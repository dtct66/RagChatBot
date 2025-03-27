from django.db import models
from django.contrib.auth import get_user_model
import uuid

# Create your models here.

User = get_user_model()

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_bot = models.BooleanField(default=False)
    
    def __str__(self):
        sender = "Bot" if self.is_bot else self.user.username
        return f"{self.user.username}'s message from {sender} at {self.created_at}"