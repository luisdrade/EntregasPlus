from datetime import timedelta, date
from django.utils import timezone

def calcular_periodo(periodo, data_inicio_param, data_fim_param):
    #*funçao para calcular o range das datas
    hoje = timezone.now().date()

    if data_fim_param and data_fim_param:
        return date.fromisoformat(data_inicio_param), date.fromisoformat(data_fim_param)
    
    if periodo == 'semana':
        return hoje -timedelta(days=7), hoje
    elif periodo == 'ano':
        return hoje - timedelta(days=365), hoje
    else: # padarão seria o mês
        return hoje - timedelta(days=30), hoje