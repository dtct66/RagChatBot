from django.urls import path
from .views import UserView, SignupView, LoginView, LogoutView, DeleteView

urlpatterns = [
    path('user/', UserView.as_view(), name='user-info'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('delete/', DeleteView.as_view(), name='delete'),
]