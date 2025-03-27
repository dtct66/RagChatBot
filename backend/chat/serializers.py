# backend/chat/serializers.py
from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', default="Guest", read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'user', 'text', 'created_at', 'is_bot']