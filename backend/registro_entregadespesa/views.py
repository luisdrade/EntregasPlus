import logging
from django.utils.dateparse import parse_date
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import RegistroTrabalho, Despesa, CategoriaDespesa

logger = logging.getLogger(__name__)

def formata_data_segura(data_string):
    #? tenta converter a data recebida no formado certo (YYYY-MM-DD)
    if '/' in data_string:
        partes = data_string.split('/')
        if len(partes[0]) == 2: #Troca o DD-MM-YYYY para YYYY-MM-DD
            return f"{partes[2]}-{partes[1]}-{partes[0]}"
    return data_string


#? REGISTROS (trabalho e Despesas
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def registro_trabalho(request):
    if request.method == 'POST':
        try:
            data = request.data
            
            # Deixa o Django ORM fazer o trabalho pesado
            registro = RegistroTrabalho.objects.create(
                entregador=request.user,
                data=formata_data_segura(data.get('data')),
                hora_inicio=data.get('hora_inicio'),
                hora_fim=data.get('hora_fim'),
                quantidade_entregues=int(data.get('quantidade_entregues', 0)),
                quantidade_nao_entregues=int(data.get('quantidade_nao_entregues', 0)),
                tipo_pagamento=data.get('tipo_pagamento'),
                valor=float(data.get('valor', 0))
            )
            return Response({'success': True, 'message': 'Registrado!', 'id': registro.id}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Erro na criação: {str(e)}")
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
    elif request.method == 'GET':
        registros = RegistroTrabalho.objects.filter(entregador=request.user).order_by('-data')
        return Response({
            'success': True,
            'results': [{
                'id': r.id, 'data': r.data.strftime('%d/%m/%Y'), 'hora_inicio': str(r.hora_inicio),
                'hora_fim': str(r.hora_fim), 'quantidade_entregues': r.quantidade_entregues,
                'quantidade_nao_entregues': r.quantidade_nao_entregues, 'tipo_pagamento': r.tipo_pagamento,
                'valor': float(r.valor)
            } for r in registros]
        })
    

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def registro_despesa(request):
    if request.method == 'POST':
        try: 
            data = request.data
            
            # Buscar categoria personalizada se enviada
            cat_nome = data.get('categoria_personalizada')
            categoria_obj = None
            if cat_nome:
                categoria_obj = CategoriaDespesa.objects.filter(nome=cat_nome, entregador=request.user).first()
            
            # Salva direto via ORM (Sem SQL Raw)
            despesa = Despesa.objects.create(
                entregador=request.user,
                tipo_despesa=data.get('tipo_despesa'),
                categoria_personalizada=categoria_obj,
                descricao=data.get('descricao', ''),
                valor=float(data.get('valor', 0)),
                data=formata_data_segura(data.get('data'))
            )
            return Response({'success': True, 'message': 'Despesa Registrada', 'id': despesa.id}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

    elif request.method == 'GET':
        despesas = Despesa.objects.filter(entregador=request.user).order_by('-data')
        return Response({
            'success': True,
            'results': [{
                'id': d.id, 'tipo_despesa': d.tipo_despesa, 'descricao': d.descricao,
                'valor': float(d.valor), 'data': d.data.strftime('%d/%m/%Y'),
                'categoria_display': d.categoria_display
            } for d in despesas]
        })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def registro_trabalho_detail(request, registro_id):
    # Apenas o essencial, como exemplo de limpeza
    try:
        registro = RegistroTrabalho.objects.get(id=registro_id, entregador=request.user)
        registro.delete()
        return Response({'success': True, 'message': 'Excluído com sucesso'})
    except RegistroTrabalho.DoesNotExist:
        return Response({'success': False}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def registro_despesa_detail(request, despesa_id):
    try:
        despesa = Despesa.objects.get(id=despesa_id, entregador=request.user)
        despesa.delete()
        return Response({'success': True, 'message': 'Excluído com sucesso'})
    except Despesa.DoesNotExist:
        return Response({'success': False}, status=status.HTTP_404_NOT_FOUND)
    



# ? CATEGORIAS DE !*DESPESAS (Otimizado)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def categorias_despesas(request):
    if request.method == 'GET':
        categorias = CategoriaDespesa.objects.filter(entregador=request.user, ativa=True).order_by('nome')
        return Response({
            'success': True,
            'results': [{
                'id': c.id, 
                'nome': c.nome, 
                'descricao': c.descricao, 
                'data_criacao': c.data_criacao.strftime('%d/%m/%Y')
            } for c in categorias]
        })
    
    elif request.method == 'POST':
        nome = request.data.get('nome', '').strip()
        if not nome:
            return Response({'success': False, 'error': 'Nome da categoria é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        if CategoriaDespesa.objects.filter(nome__iexact=nome, entregador=request.user).exists():
            return Response({'success': False, 'error': 'Já existe uma categoria com esse nome'}, status=status.HTTP_400_BAD_REQUEST)
        
        categoria = CategoriaDespesa.objects.create(
            nome=nome,
            descricao=request.data.get('descricao', ''),
            entregador=request.user
        )
        return Response({'success': True, 'id': categoria.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def categoria_despesa_detail(request, categoria_id):
    try:
        categoria = CategoriaDespesa.objects.get(id=categoria_id, entregador=request.user)
    except CategoriaDespesa.DoesNotExist:
        return Response({'success': False, 'error': 'Categoria não encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        nome = request.data.get('nome', '').strip()
        if CategoriaDespesa.objects.filter(nome__iexact=nome, entregador=request.user).exclude(id=categoria_id).exists():
            return Response({'success': False, 'error': 'Já existe uma categoria com esse nome'}, status=status.HTTP_400_BAD_REQUEST)
        
        categoria.nome = nome
        categoria.descricao = request.data.get('descricao', '')
        categoria.save()
        return Response({'success': True})
        
    elif request.method == 'DELETE':
        if Despesa.objects.filter(categoria_personalizada=categoria).exists():
            categoria.ativa = False
            categoria.save()
            return Response({'success': True, 'message': 'Categoria desativada (em uso)'})
        
        categoria.delete()
        return Response({'success': True, 'message': 'Categoria excluída'})
