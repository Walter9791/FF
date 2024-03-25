from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import registerView, CustomTokenObtainPairView, protectedView, view_all_routes

urlpatterns = [
    # Use CustomTokenObtainPairView for the token generation
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', registerView.as_view(), name='auth_register'),
    path('test/', protectedView, name='test'),
    path('', view_all_routes, name='routes'),
]
