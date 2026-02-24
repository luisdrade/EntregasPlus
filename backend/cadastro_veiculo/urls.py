from django.urls import path
from . import views
urlpatterns = [
    #ROta para criar e aparecer veiculos 
    path('', views.gerenciar_veiculos, name='gerenciar_veiculos' ),
    
    path('<int:veiculo_id>/', views.deletar_veiculo, name='deletar_veiculo'),
    # Rota de template removida - usando apenas API
]
