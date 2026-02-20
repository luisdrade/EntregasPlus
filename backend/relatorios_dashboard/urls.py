from django.urls import path
from . import views

app_name = 'relatorios_dashboard_api'

urlpatterns = [
    path('estatisticas/', views.EstatisticasUsuarioView.as_view(), name='estatisticas_usuario'),
    path('trabalho/', views.relatorio_trabalho, name='relatorio_trabalho'),
    path('despesas/', views.relatorio_despesas, name='relatorio_despesas'),
]

