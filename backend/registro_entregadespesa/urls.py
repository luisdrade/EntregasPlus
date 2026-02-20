from django.urls import path
from . import views

urlpatterns = [    
    path('trabalho/', views.registro_trabalho, name='registro_trabalho'),
    path('trabalho/<int:registro_id>/', views.registro_trabalho_detail, name='registro_trabalho_detail'),
    
    path('despesa/', views.registro_despesa, name='registro_despesa'),
    path('despesa/<int:despesa_id>/', views.registro_despesa_detail, name='registro_despesa_detail'),

    path('categorias/', views.categorias_despesas, name='categorias_despesas'),
    path('categorias/<int:categoria_id>/', views.categoria_despesa_detail, name='categoria_despesa_detail'),
]
