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
        
        token['email'] = user.email                 # Add the email to the token                
        token['username'] = user.username           # Add the username to the token
        token['first_name'] = user.profile.first_name       # Add the first_name to the token
        token['last_name'] = user.profile.last_name         # Add the last_name to the token

        return token


class registerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True) # Create a firstname field that is required
    last_name = serializers.CharField(required=True) # Create a lastname field that is required
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password]) # Create a password field that is write only
    password2 = serializers.CharField(write_only=True, required=True) # Create a password2 field that is write only
    

    class Meta:
        model = User
        fields = ('email', 'username','first_name', 'last_name', 'password', 'password2', )        # Create a Meta class that contains the model and fields
    
    def validate(self, attrs):  # Create a validate method that takes in the attrs parameter
        if attrs['password'] != attrs['password2']:    # Check if the password and password2 fields are not equal
            raise serializers.ValidationError({"password": "Passwords don't match."}) # Raise a validation error if the password fields don't match
        return attrs
    
    def create(self, validated_data):   # Create a create method that takes in the validated_data parameter
        user = User.objects.create_user(   # Create a user object
            email=validated_data['email'], # Set the email field to the email field in the validated_data parameter
            username=validated_data['username'], # Set the username field to the username field in the validated_data parameter
        )
        user.set_password(validated_data['password'])
        validated_data.pop('password2', None)  # Remove password2 before creating the user


        user.save()

        user.profile.first_name = validated_data.get('first_name', user.profile.first_name)
        user.profile.last_name = validated_data.get('last_name', user.profile.last_name)
        user.profile.save()

        return user
