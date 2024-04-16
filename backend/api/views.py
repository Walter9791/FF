from django.shortcuts import render
from .models import User
from .serializers import UserSerializer, registerSerializer, CustomTokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response  
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny



class CustomTokenObtainPairView(TokenObtainPairView):   
    serializer_class = CustomTokenObtainPairSerializer

class registerView(generics.CreateAPIView):                       
    queryset = User.objects.all()   
    serializer_class = registerSerializer   
    permission_classes = (AllowAny,)    

@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def protectedView(request): 
    output = f"Hello, {request.user.username}! You are authenticated."                  
    return Response({'response':output}, status=status.HTTP_200_OK)   

@api_view(['GET'])
def view_all_routes(request):
    data = [
        'api/token/',
        'api/token/refresh/',
        'api/register/',
    ]
    return Response(data)