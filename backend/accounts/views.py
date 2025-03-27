# Create your views here.
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token


from django.contrib.auth import logout
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

from .serializers import SignupSerializer, LoginSerializer


# カスタムユーザーを取得
User = get_user_model()


# ユーザ情報の取得
class UserView(APIView):
    permission_class = [permissions.AllowAny]
    
    def get(self, request):
        user=request.user
        return Response({"username": user.username})

# ユーザ登録のビュー
class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  
            token, create = Token.objects.get_or_create(user=user)
            return Response({"Token": token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ログインのビュー
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, create = Token.objects.get_or_create(user=user)
            
            return Response({"Token": token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ログアウトのビュー
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        
        token = Token.objects.get(user=request.user)
        token.delete()
        
        logout(request)
        return Response({"message": "Logout successful!"}, status=status.HTTP_200_OK)
    
# アカウント削除のビュー
class DeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        user.delete()
        return Response({"message": "Account deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        
