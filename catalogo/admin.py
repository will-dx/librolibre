from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Libro, Materia, Mensaje, Favorito, ContactoMensaje


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'nombre', 'is_staff', 'is_active']
    search_fields = ['email', 'nombre']
    ordering = ['email']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': ('nombre',)}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre', 'password1', 'password2'),
        }),
    )


@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'autor', 'estado', 'materia', 'usuario', 'fecha_publicacion']
    list_filter = ['estado', 'materia', 'fecha_publicacion']
    search_fields = ['titulo', 'autor', 'usuario__email']


@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'slug', 'total_libros']
    prepopulated_fields = {'slug': ('nombre',)}
    search_fields = ['nombre']

    def total_libros(self, obj):
        return obj.libros.count()
    total_libros.short_description = 'Libros'


@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ['remitente', 'destinatario', 'libro', 'fecha_envio', 'leido']
    list_filter = ['leido', 'fecha_envio']
    search_fields = ['remitente__email', 'destinatario__email', 'contenido']


@admin.register(Favorito)
class FavoritoAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'libro', 'fecha_agregado']


@admin.register(ContactoMensaje)
class ContactoMensajeAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'asunto', 'fecha_envio', 'leido']
    list_filter = ['leido', 'fecha_envio']
    search_fields = ['nombre', 'email', 'asunto']
