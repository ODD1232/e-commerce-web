# from django.shortcuts import render
from rest_framework import generics, permissions
from .serializers import UserSerializer

class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# Create your views here.
