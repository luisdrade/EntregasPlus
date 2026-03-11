from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import secrets
import logging

logger = logging.getLogger(__name__)

class TwoFactorEmailService:
    """
    Serviço para envio de códigos 2FA por email
    """
    
    @staticmethod
    def generate_code():
        """Gera um código de 6 dígitos"""
        return f"{secrets.randbelow(1000000):06d}"
    
    @staticmethod
    def send_2fa_code(user, purpose='login'):
        """
        Envia código 2FA por email
        
        Args:
            user: Instância do usuário
            purpose: Propósito do código ('login', 'setup', 'disable')
        
        Returns:
            dict: Resultado da operação
        """
        try:
            # Verificar configuração de email antes de continuar
            email_backend = getattr(settings, 'EMAIL_BACKEND', '')
            email_host_user = getattr(settings, 'EMAIL_HOST_USER', '')
            
            # Se está usando console backend, ainda pode funcionar (para logs)
            using_console = email_backend == 'django.core.mail.backends.console.EmailBackend'
            
            if not using_console and not email_host_user:
                logger.warning("EMAIL_HOST_USER não configurado, mas tentando enviar mesmo assim")
            
            # Gerar código
            code = TwoFactorEmailService.generate_code()
            
            # Definir tempo de expiração (10 minutos)
            expires_at = timezone.now() + timedelta(minutes=10)
            
            # Criar registro no banco
            from ..models import CodigoVerificacao
            
            # Deletar códigos antigos não usados para o mesmo propósito antes de criar novo
            CodigoVerificacao.objects.filter(
                user=user,
                purpose=purpose,
                is_used=False
            ).delete()
            
            verification = CodigoVerificacao.objects.create(
                user=user,
                code=code,
                expires_at=expires_at,
                purpose=purpose
            )
            
            # Definir assunto e mensagem baseado no propósito
            if purpose == 'login':
                subject = 'Código de Verificação - Login'
                template = 'emails/2fa_login.html'
                context = {
                    'user_name': user.nome,
                    'code': code,
                    'expires_in': 10
                }
            elif purpose == 'setup':
                subject = 'Código de Verificação - Ativar 2FA'
                template = 'emails/2fa_setup.html'
                context = {
                    'user_name': user.nome,
                    'code': code,
                    'expires_in': 10
                }
            elif purpose == 'disable':
                subject = 'Código de Verificação - Desabilitar 2FA'
                template = 'emails/2fa_disable.html'
                context = {
                    'user_name': user.nome,
                    'code': code,
                    'expires_in': 10
                }
            else:
                subject = 'Código de Verificação'
                template = 'emails/2fa_generic.html'
                context = {
                    'user_name': user.nome,
                    'code': code,
                    'expires_in': 10
                }
            
            # Renderizar template HTML
            try:
                html_message = render_to_string(template, context)
            except Exception as template_error:
                logger.error(f"Erro ao renderizar template {template}: {str(template_error)}")
                # Usar mensagem simples se o template falhar
                html_message = None
            
            # Enviar email com tratamento robusto de erros
            try:
                success = send_mail(
                    subject=subject,
                    message=f'Seu código de verificação é: {code}\n\nEste código expira em 10 minutos.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                    html_message=html_message,
                )
                
                if success:
                    logger.info(f"✅ Código 2FA enviado para {user.email} (purpose: {purpose}, código: {code})")
                    return {
                        'success': True,
                        'message': 'Código enviado com sucesso',
                        'expires_at': expires_at.isoformat()
                    }
                else:
                    logger.error(f"❌ send_mail retornou False para {user.email}")
                    verification.delete()
                    return {
                        'success': False,
                        'message': 'Erro ao enviar email (retorno False)'
                    }
                    
            except Exception as email_error:
                logger.error(f"❌ Erro ao enviar email para {user.email}: {str(email_error)}")
                logger.error(f"Configuração - BACKEND: {email_backend}")
                logger.error(f"Configuração - HOST: {getattr(settings, 'EMAIL_HOST', 'N/A')}")
                logger.error(f"Configuração - USER: {email_host_user}")
                logger.error(f"Configuração - PORT: {getattr(settings, 'EMAIL_PORT', 'N/A')}")
                
                # Se está usando console backend, ainda considerar sucesso (para desenvolvimento)
                if using_console:
                    logger.info(f"ℹ️ Usando console backend - código será exibido nos logs")
                    logger.info(f"📧 Código para {user.email}: {code}")
                    return {
                        'success': True,
                        'message': 'Código gerado (modo console - verifique os logs)',
                        'expires_at': expires_at.isoformat()
                    }
                
                # Para produção sem email configurado, deletar código e retornar erro
                verification.delete()
                error_message = str(email_error)
                
                # Mensagens de erro mais amigáveis
                if 'authentication' in error_message.lower() or 'login' in error_message.lower():
                    error_message = 'Erro de autenticação no servidor de email. Verifique as credenciais.'
                elif 'connection' in error_message.lower() or 'timeout' in error_message.lower():
                    error_message = 'Erro de conexão com servidor de email. Tente novamente mais tarde.'
                elif 'smtp' in error_message.lower():
                    error_message = 'Erro na configuração do servidor de email.'
                
                return {
                    'success': False,
                    'message': f'Erro ao enviar email: {error_message}'
                }
                
        except Exception as e:
            logger.error(f"❌ Erro ao enviar código 2FA: {str(e)}", exc_info=True)
            import traceback
            logger.error(f"Traceback completo: {traceback.format_exc()}")
            return {
                'success': False,
                'message': f'Erro interno do servidor: {str(e)}'
            }
    
    @staticmethod
    def verify_code(user, code, purpose='login'):
        """
        Verifica código 2FA
        
        Args:
            user: Instância do usuário
            code: Código a ser verificado
            purpose: Propósito do código
        
        Returns:
            dict: Resultado da verificação
        """
        try:
            from ..models import CodigoVerificacao
            
            # Buscar código válido
            verification = CodigoVerificacao.objects.filter(
                user=user,
                code=code,
                purpose=purpose,
                is_used=False
            ).order_by('-created_at').first()
            
            if not verification:
                return {
                    'success': False,
                    'message': 'Código inválido'
                }
            
            if verification.is_expired():
                verification.delete()
                return {
                    'success': False,
                    'message': 'Código expirado'
                }
            
            # Marcar como usado
            verification.is_used = True
            verification.save()
            
            logger.info(f"Código 2FA verificado para {user.email} (purpose: {purpose})")
            
            return {
                'success': True,
                'message': 'Código verificado com sucesso'
            }
            
        except Exception as e:
            logger.error(f"Erro ao verificar código 2FA: {str(e)}")
            return {
                'success': False,
                'message': 'Erro interno do servidor'
            }
    
    @staticmethod
    def send_registration_code(user):
        """
        Envia código de verificação pós-cadastro por email
        
        Args:
            user: Instância do usuário
        
        Returns:
            dict: Resultado da operação
        """
        try:
            # Verificar configuração de email
            email_backend = getattr(settings, 'EMAIL_BACKEND', '')
            using_console = email_backend == 'django.core.mail.backends.console.EmailBackend'
            
            # Gerar código
            code = TwoFactorEmailService.generate_code()
            
            # Definir tempo de expiração (10 minutos)
            expires_at = timezone.now() + timedelta(minutes=10)
            
            # Atualizar campos do usuário
            user.registration_code = code
            user.registration_code_expires_at = expires_at
            user.save(update_fields=['registration_code', 'registration_code_expires_at'])
            
            # Renderizar template HTML
            try:
                html_message = render_to_string('emails/registration_verification.html', {
                    'user_name': user.nome,
                    'code': code,
                    'expires_in': 10
                })
            except Exception as template_error:
                logger.error(f"Erro ao renderizar template: {str(template_error)}")
                html_message = None
            
            # Enviar email com tratamento robusto
            try:
                success = send_mail(
                    subject='Verificação de Cadastro - Gestão Entregadores',
                    message=f'Seu código de verificação é: {code}\n\nEste código expira em 10 minutos.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    # Não deixar o fluxo falhar por email em produção free-tier
                    fail_silently=True,
                    html_message=html_message,
                )
                
                if success:
                    logger.info(f"✅ Código de verificação de cadastro enviado para {user.email}")
                    return {
                        'success': True,
                        'message': 'Código enviado com sucesso',
                        'expires_at': expires_at.isoformat()
                    }
                else:
                    logger.error(f"❌ send_mail retornou False para {user.email}")
                    user.registration_code = None
                    user.registration_code_expires_at = None
                    user.save(update_fields=['registration_code', 'registration_code_expires_at'])
                    return {
                        'success': False,
                        'message': 'Erro ao enviar email (retorno False)'
                    }
                    
            except Exception as email_error:
                logger.error(f"❌ Erro ao enviar email para {user.email}: {str(email_error)}")
                # Mesmo sem email, não devemos quebrar o fluxo de cadastro
                logger.info(f"ℹ️ Prosseguindo sem envio de email. Código: {code}")
                return {
                    'success': True,
                    'message': 'Código gerado (envio de email indisponível)',
                    'expires_at': expires_at.isoformat()
                }
                
        except Exception as e:
            logger.error(f"❌ Erro ao enviar código de verificação de cadastro: {str(e)}", exc_info=True)
            import traceback
            logger.error(f"Traceback completo: {traceback.format_exc()}")
            
            # Limpar código em caso de erro
            try:
                user.registration_code = None
                user.registration_code_expires_at = None
                user.save(update_fields=['registration_code', 'registration_code_expires_at'])
            except:
                pass
            
            return {
                'success': False,
                'message': f'Erro interno do servidor: {str(e)}'
            }
    
    @staticmethod
    def verify_registration_code(user, code):
        """
        Verifica código de verificação pós-cadastro
        
        Args:
            user: Instância do usuário
            code: Código a ser verificado
        
        Returns:
            dict: Resultado da verificação
        """
        try:
            # Verificar se há código armazenado
            if not user.registration_code:
                return {
                    'success': False,
                    'message': 'Nenhum código de verificação encontrado'
                }
            
            # Verificar se o código confere
            if user.registration_code != code:
                return {
                    'success': False,
                    'message': 'Código inválido'
                }
            
            # Verificar se não expirou
            if user.registration_code_expires_at and timezone.now() > user.registration_code_expires_at:
                # Limpar código expirado
                user.registration_code = None
                user.registration_code_expires_at = None
                user.save(update_fields=['registration_code', 'registration_code_expires_at'])
                
                return {
                    'success': False,
                    'message': 'Código expirado'
                }
            
            # Código válido - limpar campos
            user.registration_code = None
            user.registration_code_expires_at = None
            user.registration_verified = True
            user.save(update_fields=['registration_code', 'registration_code_expires_at', 'registration_verified'])
            
            logger.info(f"Código de verificação de cadastro verificado para {user.email}")
            
            return {
                'success': True,
                'message': 'Código verificado com sucesso'
            }
            
        except Exception as e:
            logger.error(f"Erro ao verificar código de verificação de cadastro: {str(e)}")
            return {
                'success': False,
                'message': 'Erro interno do servidor'
            }
    
    @staticmethod
    def cleanup_expired_codes():
        """Remove códigos expirados"""
        try:
            from ..models import CodigoVerificacao
            from django.utils import timezone
            
            expired_codes = CodigoVerificacao.objects.filter(
                expires_at__lt=timezone.now()
            )
            count = expired_codes.count()
            expired_codes.delete()
            
            logger.info(f"Removidos {count} códigos 2FA expirados")
            return count
            
        except Exception as e:
            logger.error(f"Erro ao limpar códigos expirados: {str(e)}")
            return 0

