from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from products.models import Product
from django.conf import settings
import razorpay

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class OrderViewSet(viewsets.ModelViewSet):
    queryset=Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request):
        prod_id = request.data.get('product_id')
        qty = int(request.data.get('quantity', 1))
        try:
            product = Product.objects.get(id=prod_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        order, _ = Order.objects.get_or_create(user=request.user, is_paid=False)
        item, created = OrderItem.objects.get_or_create(order=order, product=product)
        if not created:
            item.quantity += qty
        else:
            item.quantity = qty
        item.save()
        return Response({'message': 'Added/Updated cart'})

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        order = Order.objects.filter(user=request.user, is_paid=False).first()
        if not order:
            return Response({'items': []})
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_cart_item(self, request):
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        try:
            item = OrderItem.objects.get(id=item_id, order__user=request.user, order__is_paid=False)
            if quantity <= 0:
                item.delete()
                return Response({'message': 'Item removed'})
            else:
                item.quantity = quantity
                item.save()
                return Response({'message': 'Quantity updated'})
        except OrderItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        orders = Order.objects.filter(user=request.user, is_paid=True)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_checkout_order(request):
    order = Order.objects.filter(user=request.user, is_paid=False).first()
    if not order or not order.items.exists():
        return Response({"error": "No active cart to checkout"}, status=status.HTTP_400_BAD_REQUEST)

    total_amount = 0
    for item in order.items.all():
        total_amount += item.product.price * item.quantity

    razorpay_order = client.order.create(dict(amount=int(total_amount * 100), currency="INR", payment_capture=1))

    return Response({
        "razorpay_order_id": razorpay_order['id'],
        "amount": total_amount,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID,
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def payment_success(request):
    data = request.data
    try:
        params_dict = {
            'razorpay_order_id': data['razorpay_order_id'],
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_signature': data['razorpay_signature'],
        }
        client.utility.verify_payment_signature(params_dict)
        order = Order.objects.filter(user=request.user, is_paid=False).first()
        if order:
            order.is_paid = True
            order.save()
        return Response({"message": "Payment successful and order completed"})
    except:
        return Response({"error": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
