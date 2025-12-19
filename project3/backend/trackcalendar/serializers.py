from rest_framework import serializers
from .models import * 
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, authenticate
from djoser.serializers import UserCreateSerializer

User = get_user_model()  # Get the current user model

# user = authenticate(email="user@example.com", password="correct_password")
# print(user)  # Should not be None if the credentials are correct


class TrackSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Track
        fields = ['id','task','completed','date','tasktime','created_date','updated_date']
        read_only_fields = ['id']  # Read-only fields

class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'password']

# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

#     def to_representation(self, instance):
#         ret = super().to_representation(instance)
#         ret.pop('password', None)
#         return ret


class RegisterSerializer(serializers.ModelSerializer):
    class Meta: 
        model = CustomUser
        fields = ('id','first_name','last_name','phone_number','email','password')
        extra_kwargs = { 'password': {'write_only':True}} # it will not display on DB panel when you add/create a password
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    