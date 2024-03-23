from django.shortcuts import render
from .models import User
from .serializers import UserSerializer, registerSerializer, CustomTokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response  
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.

class CustomTokenObtainPairView(TokenObtainPairView):   # Create a CustomTokenObtainPairView class that inherits from the TokenObtainPairView class
    serializer_class = CustomTokenObtainPairSerializer

class registerView(generics.CreateAPIView):                         # Create a registerView class that inherits from the CreateAPIView class
    queryset = User.objects.all()   
    serializer_class = registerSerializer   
    permission_classes = (AllowAny,)    

@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def protectedView(request): 
    output = f"Hello, {request.user.username}! You are authenticated."                  
    return Response({'response':output}, status=status.HTTP_200_OK)   # Return a response with a message and a status code of 200

@api_view(['GET'])
def view_all_routes(request):
    data = [
        'api/token/',
        'api/token/refresh/',
        'api/register/',
    ]
    return Response(data)