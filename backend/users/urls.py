from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'favorites', views.FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', views.current_user, name='current_user'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    # Alternative endpoint that frontend might be calling
    path('current-user/', views.current_user, name='current_user_alt'),
    # Include router URLs
    path('', include(router.urls)),
]
