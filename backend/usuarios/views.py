from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import EntregadorSerializer
from .models import Entregador

class RegisterView(generics.CreateAPIView):
    queryset= Entregador.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = EntregadorSerializer

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = EntregadorSerializer

    def get_object(self):
        return self.request.user