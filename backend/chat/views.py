from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import permissions


from .models import Message
from .serializers import MessageSerializer


from .rag.search_and_answer import answer_query


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('created_at')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    #ユーザのメッセージを取得
    @action(detail=False, methods=['get'])
    def user_messages(self, request):
        user = request.user
        messages = Message.objects.filter(user=user).order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    
    
    #ユーザがメッセージを送信時の処理
    @action(detail=False, methods=['post'])
    def send_message(self, request):
        user = request.user
        user_message = request.data.get('message')
        
        if not user_message:
            return Response({'error': 'Message content is required'}, status=400)

        user_msg = Message.objects.create(user=user, text=user_message, is_bot=False)
        
        try:
            bot_response_text = answer_query(user_message)

            
            
        except Exception as e:
            bot_response_text = f"エラーが発生しました: {str(e)}"
        
        bot_msg = Message.objects.create(user=user, text=bot_response_text, is_bot=True)
        
        return Response({
            'user_message': MessageSerializer(user_msg).data,
            'bot_response': MessageSerializer(bot_msg).data
        })