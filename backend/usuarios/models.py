from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import django.utils.timezone

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Entregador(AbstractBaseUser, PermissionsMixin):
    #? Dados Pessoais
    nome = models.CharField(max_length=100, db_index=True)
    cpf = models.CharField(max_length=14, unique=True, null=True, blank=True)
    telefone = models.CharField(max_length=20, null=True, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    foto = models.ImageField(upload_to='fotos_perfil/', null=True, blank=True)

    #? Autenticação
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    
    #?endereço
    endereco = models.CharField(max_length=200, null=True, blank=True)
    cep = models.CharField(max_length=10, null=True, blank=True)
    cidade = models.CharField(max_length=100, null=True, blank=True)
    estado = models.CharField(max_length=2, null=True, blank=True)


    #? Validação de email (apenas para web)
    email_validado = models.BooleanField(default=False)
    registration_verified = models.BooleanField(default=False)  # Indica se completou verificação pós-cadastro

    two_factor_enabled = models.BooleanField(default=False)
    two_factor_required = models.BooleanField(default=False)  # Se deve pedir 2FA no próximo login
    last_2fa_check = models.DateTimeField(null=True, blank=True)  # Última verificação 2FA

    #? Campos de sistema
    date_joined = models.DateTimeField(default=django.utils.timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'telefone']

    def __str__(self):
        return self.email

class CodigoVerificacao(models.Model):
    """
    Modelo ÚNICO para gerir todos os códigos temporários do sistema.
    """
    TIPOS_CODIGO = [
        ('login_2fa', 'Login 2FA'),
        ('validacao_email', 'Validação de E-mail'),
        ('recuperacao_senha', 'Recuperação de Senha'),
        ('setup_2fa', 'Configuração 2FA')
    ]

    user = models.ForeignKey(Entregador, on_delete=models.CASCADE, related_name='codigos_seguranca')
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=TIPOS_CODIGO, default='login_2fa')
    
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    # Proteção contra hackers/Spam (Brute Force)
    tentativas = models.IntegerField(default=0)
    bloqueado_ate = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Código ({self.get_purpose_display()}) para {self.user.email} - {self.code}"
    
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at
class TrustedDevice(models.Model):
    """
    Modelo para dispositivos confiáveis que não precisam de 2FA
    """
    user = models.ForeignKey(Entregador, on_delete=models.CASCADE, related_name='trusted_devices')
    device_id = models.CharField(max_length=255)  # ID único do dispositivo
    device_name = models.CharField(max_length=100)  # Nome do dispositivo
    device_type = models.CharField(max_length=50, choices=[
        ('mobile', 'Mobile'),
        ('web', 'Web'),
        ('tablet', 'Tablet')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user', 'device_id']
        ordering = ['-last_used']
    
    def __str__(self):
        return f"{self.user.email} - {self.device_name} ({self.device_type})"
