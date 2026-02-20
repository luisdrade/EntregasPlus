from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Sum
from datetime import date

from cadastro_veiculo.models import Veiculo
from registro_entregadespesa.models import RegistroTrabalho, Despesa
from .utils import calcular_periodo

class EstatisticasUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            data_inicio, data_fim = calcular_periodo(
                request.GET.get('periodo', 'mes'),
                request.GET.get('data_inicio'),
                request.GET.get('data_fim')
            )
#? Consulta o banco apenas o necessário
            trabalhos = RegistroTrabalho.objects.filter(entregador=user, data__range=[data_inicio, data_fim])
            despesa = Despesa.objects.filter(entregador=user, data__range=[data_inicio, data_fim])

#? Agragação feita direto do banco
            agg_trabalho = trabalhos.aggregate(
                total_ent=Sum('quantidade_entregues'),
                total_ganho=Sum('valor')
            )

            agg_despesa = despesa.aggregate(total_desp=Sum('valor'))

            total_entrega = agg_trabalho['total_ent'] or 0
            total_ganhos =  float(agg_trabalho['total_ganho'] or 0)
            total_despesa =  float(agg_despesa['total_desp'] or 0)

            dias_trabalhados = trabalhos.values('data').distinct().count()
            dias_conectados = (date.today() - user.date_joined.date()).days if user.date_joined else 0

            return Response({
                'totalEntregas': total_entrega,
                'totalGanhos': round(total_ganhos, 2),
                'totalDespesas': round(total_despesa, 2),
                'lucroLiquido': round(total_ganhos - total_despesa, 2),
                #'veiculosCadastrados': Veiculo.object.filter(entregador=user).count(),
                'diasTrabalhados': dias_trabalhados,
                'diasConectado': dias_conectados,
                'periodo': {
                    'inicio': data_inicio.strftime('%Y-%m-%d'),
                    'fim': data_fim.strftime('%Y-%m-%d')
                },
                'foto': request.build_absolute_uri(user.foto.url) if user.foto else None
            })
        
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar estatísticas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_trabalho(request):
    try:
        data_inicio, data_fim = calcular_periodo(
            request.GET.get('periodo', 'mes'), request.GET.get, request.GET.get('data_fim')
        )

        trabalhos = RegistroTrabalho.objects.filter(entregador=request.user, data__range=[data_inicio, data_fim]).order_by('data')

        agg = trabalhos.aggregate(
            ent_ok=Sum('quantidade_entregues'),
            ent_nok=Sum('quantidade_nao_entregues'),
            ganho=Sum('valor')
        )

        entregas_realizadas = agg['ent_ok'] or 0
        total_dias = trabalhos.count()

        melhor_dia = trabalhos.order_by('-quantidades_entregues').first()
        pior_dia = trabalhos.filter(quantidade_entregues__gt=0).order_by('quantidade_entregues').first()

        relatorio_data = {
            'total_dias': total_dias,
            'total_entregas': entregas_realizadas,
            'entregas_realizadas': entregas_realizadas,
            'entregas_nao_realizadas': agg['ent_nok'] or 0,
            'ganho_toal': float(agg['ganho'] or 0),
            'melhor_dia': melhor_dia.data.strftime('%d/%m/%Y') if melhor_dia else 'N/A',
            'pior_dia': pior_dia.data.strftime('%d/%m/%Y') if pior_dia else 'N/A',
            'dias_trabalhados': [
                {
                    'id': r.id, 
                    'data': r.data.strftime('%Y-%m-%d'), 
                    'entregas': r.quantidade_entregues, 
                    'ganho': float(r.valor)
                }
                for r in trabalhos #r é trabalhos
            ]
        }
        return Response({'success': True, 'data': relatorio_data})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_despesas(request):
    try:
        data_inicio, data_fim = calcular_periodo(
            request.GET.get('periodo', 'mes'), request.GET.get('data_inicio'), request.GET.get('data_fim')
        )

        despesas = Despesa.objects.filter(entregador=request.user, data__range=[data_inicio, data_fim]).order_by('data')
        total_despesas = despesas.aggregate(total=Sum('valor'))['total'] or 0
        
        # Agrupa despesas por categoria direto no banco
        categorias_agg = despesas.values('tipo_despesa').annotate(total=Sum('valor')).order_by('-total')
        
        despesas_por_categoria = [{'nome': c['tipo_despesa'].title(), 'total': float(c['total'])} for c in categorias_agg]
        categoria_mais_cara = despesas_por_categoria[0]['nome'] if despesas_por_categoria else 'N/A'

        relatorio_data = {
            'total_despesas': float(total_despesas),
            'media_despesas_dia': float(total_despesas) / max((data_fim - data_inicio).days + 1, 1),
            'maior_despesa': float(despesas.order_by('-valor').first().valor if despesas.exists() else 0),
            'categoria_mais_cara': categoria_mais_cara,
            'despesas_por_categoria': despesas_por_categoria,
            'despesas_por_dia': [
                {'id': d.id, 'data': d.data.strftime('%Y-%m-%d'), 'categoria': d.tipo_despesa, 'valor': float(d.valor), 'descricao': d.descricao or ''} 
                for d in despesas
            ]
        }
        return Response({'success': True, 'data': relatorio_data})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)