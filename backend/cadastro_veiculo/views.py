from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Veiculo
import logging

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def gerenciar_veiculos(request):
    """
    GET: Lista todos os veículos do usuário logado.
    POST: Cadastra um novo veículo para o usuário logado.
    """

    if request.method == 'GET':
        veiculos = Veiculo.objects.filter(entregador=request.user).order_by('-id')
        
        dados = [{ 'id': v.id, 
                  'tipo': v.tipo, 
                  'placa': v.placa, 
                  'modelo': v.modelo,
                  #!'cor': v.cor
        } for v in veiculos ]

        return Response({'success': True, 'results': dados})
    
    elif request.method == 'POST':
        try:
            data = request.data

            veiculo = Veiculo.objects.create(
                entregador=request.user,
                tipo=data.get('tipo','moto'),
                placa=data.get('placa','').upper(),
                modelo=data.get('modelo', ''),
              #!  cor=data.get('cor', '')
            )

            return Response({
                'success' : True,
                'message': 'Veiculo cadastrado com sucesso!!',
                'id': veiculo.id
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Erro ao cadastrar o veiculo: {str(e)}")
            return Response({'sucess': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])

def deletar_veiculo(request, veiculo_id):
    #deleatar o veiculos especidifcp

    try:
        veiculo = Veiculo.objects.get(id=veiculo_id, entregador=request.user)
        veiculo.delete()
        return Response({'success': True, 'message': 'Veículo removido com SUcesso!!'})
    
    except Veiculo.DoesNotExist:
        return Response({
            'success': False,
            'erro' : 'Veículo não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)