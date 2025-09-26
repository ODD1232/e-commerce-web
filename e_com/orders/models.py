from django.db import models
from django.contrib.auth.models import User
from products.models import Product

class Order(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)
    is_paid=models.BooleanField(default=False)
    def __str__(self):
        return f"Order {self.id} by {self.user.username}"
class OrderItem(models.Model):
    order=models.ForeignKey(Order,related_name="items",on_delete=models.CASCADE)
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.IntegerField(default=1)
    def __str__(self):
        return f"{self.quality} X {self.product.name}"

# Create your models here.
