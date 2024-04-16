from .models import User, Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import Token


class UserSerializer(serializers.ModelSerializer):  # Create a UserSerializer class that inherits from the ModelSerializer class
    class Meta:
        model = User
        fields = ('id', 'email', 'username')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):   # Create a CustomTokenObtainPairSerializer class that inherits from the TokenObtainPairSerializer class
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)             # Call the get_token method of the parent class
        
        token['email'] = user.email                              
        token['username'] = user.username          
        token['first_name'] = user.profile.first_name       
        token['last_name'] = user.profile.last_name       

        return token


class registerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True) 
    last_name = serializers.CharField(required=True) 
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password]) 
    password2 = serializers.CharField(write_only=True, required=True) 
    

    class Meta:
        model = User
        fields = ('email', 'username','first_name', 'last_name', 'password', 'password2', )        
    
    def validate(self, attrs):  
        if attrs['password'] != attrs['password2']:    
            raise serializers.ValidationError({"password": "Passwords don't match."}) 
        return attrs
    
    def create(self, validated_data):  
        user = User.objects.create_user(   
            email=validated_data['email'], 
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        validated_data.pop('password2', None)  # Remove password2 before creating the user


        user.save()

        user.profile.first_name = validated_data.get('first_name', user.profile.first_name)
        user.profile.last_name = validated_data.get('last_name', user.profile.last_name)
        user.profile.save()

        return user
