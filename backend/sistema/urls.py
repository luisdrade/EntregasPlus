"""
URL configuration for sistema project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from usuarios.views import RegisterView, UserDetailView, ChangePasswordView, UploadFotoPerfilView, check_username


urlpatterns = [
    path('admin/', admin.site.urls),
    
    #? Rotas de Autenticação (Login e Registro)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Renovar Token
    path('api/register/', RegisterView.as_view(), name='auth_register'), 
    # Rota de Perfil (Para testar se o token funciona)
    path('api/user/', UserDetailView.as_view(), name='user_detail'),
    path('api/user/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('api/user/upload-foto/', UploadFotoPerfilView.as_view(), name='upload_foto'),
    path('api/user/check/<str:username>/', check_username, name='check_username'),

    #? Rotas de Registro
    path('api/financeiro/', include('registro_entregadespesa.urls')),

    #? Rotas de Relatórios
    path('api/relatorios/', include('relatorios_dashboard.urls')), 
    
    #? Rotas de Veiculos
    path('api/veiculos/', include('cadastro_veiculo.urls')),
]
