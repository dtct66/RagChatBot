from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'text', 'created_at', 'is_bot') 
    list_filter = ('is_bot', 'created_at') 
    search_fields = ('user__username', 'text') 
    ordering = ('-created_at',) 
