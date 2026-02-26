from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes

import base64, logging, uuid

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

from .serializers import EntregadorSerializer
from .models import Entregador

logger = logging.getLogger(__name__)

#? Registro de usuario
class RegisterView(generics.CreateAPIView):
    queryset= Entregador.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = EntregadorSerializer

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = EntregadorSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        serializer = EntregadorSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Perfil Atualizado com sucesso !!',
                'user' : serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#? segurança

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        senha_atual = request.data.get('atual')
        senha_nova = request.data.get('nova')
        confirmar_senha = request.data.get('confirmar')

        if not senha_atual or not senha_nova or not confirmar_senha:
            return Response({'error': 'Todos os campos são obrigatorios'}, status=status.HTTP_400_BAD_REQUEST)
        
        if  senha_nova != confirmar_senha:
            return Response({'error': 'As senhas não coincidem'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.check_password(senha_atual):
            return Response({'error': 'A senha atual está incorreta'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.check_password(senha_nova):
            return Response({'error': 'A senha nova precisa ser diferente da atual'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(senha_nova)
        user.save()
        logger.info(f"Senha alterada com sucesso para o usuario {user.email}")

        return Response({'success': True, 'message': 'Senha alterada com sucesso!'})

class UploadFotoPerfilView(APIView):
    """Gerencia o upload da foto de perfil em Base64"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            foto_data = request.data.get('foto')
            
            if not foto_data:
                return Response({'error': 'Nenhuma foto fornecida'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Decodificar base64
            try:
                if ';base64,' in foto_data:
                    foto_data = foto_data.split(';base64,')[1]
                foto_bytes = base64.b64decode(foto_data)
            except Exception as e:
                logger.error(f"Erro ao decodificar base64: {str(e)}")
                return Response({'error': 'Formato de imagem inválido'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Remover foto antiga se existir
            if user.foto:
                try:
                    if default_storage.exists(user.foto.name):
                        default_storage.delete(user.foto.name)
                except Exception as e:
                    logger.warning(f"Erro ao remover foto antiga: {str(e)}")
            
            # Salvar nova foto
            filename = f"perfil_{user.id}_{uuid.uuid4().hex[:8]}.jpg"
            user.foto.save(filename, ContentFile(foto_bytes), save=True)
            
            # Construir URL completa
            foto_url = request.build_absolute_uri(user.foto.url)
            
            return Response({
                'success': True,
                'message': 'Foto atualizada com sucesso',
                'foto_url': foto_url
            })
                
        except Exception as e:
            logger.error(f"Erro ao fazer upload da foto: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- UTILITÁRIOS ---

@api_view(['GET'])
@permission_classes([AllowAny])
def check_username(request, username):
    """Verifica se um username já está em uso (útil para formulário de registro)"""
    try:
        exists = Entregador.objects.filter(username=username).exists()
        return Response({'available': not exists, 'username': username})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)