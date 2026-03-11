from django.contrib import admin
from .models import RegistroTrabalho, Despesa, CategoriaDespesa

admin.site.register(RegistroTrabalho)
admin.site.register(Despesa)
admin.site.register(CategoriaDespesa)