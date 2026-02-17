from rest_framework import serializers
from .models import Entregador

class EntregadorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="nome")

    class Meta:
        model = Entregador
        fields = ['id', 'name', 'email', 'password']
        extra_kwargas = {'password': {'write_only': True}}

    def create(self, validade_data):
        user = Entregador.objects.create_user(
            email=validade_data['email'],
            username=validade_data['email'], #usar o email como user
            password=validade_data['password'],
            nome=validade_data['nome']
        )
        return user