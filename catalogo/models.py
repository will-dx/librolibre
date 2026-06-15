from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('correo institucional'), unique=True)
    nombre = models.CharField(_('nombre completo'), max_length=150)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']

    def __str__(self):
        return self.nombre or self.email


class Materia(models.Model):
    nombre = models.CharField('nombre', max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField('descripción', blank=True)
    icono = models.CharField('icono', max_length=10, default='📖')

    class Meta:
        verbose_name = 'materia'
        verbose_name_plural = 'materias'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Libro(models.Model):
    class Estado(models.TextChoices):
        DISPONIBLE = 'disponible', 'Disponible'
        PRESTADO = 'prestado', 'Prestado'
        DONADO = 'donado', 'Donado'

    titulo = models.CharField('título', max_length=200, null=False, blank=False)
    autor = models.CharField('autor', max_length=200, blank=True)
    estado = models.CharField(
        'estado', max_length=20,
        choices=Estado.choices,
        default=Estado.DISPONIBLE,
    )
    foto = models.ImageField('foto', upload_to='libros/', blank=True, null=True)
    usuario = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE,
        related_name='libros',
        verbose_name='usuario',
    )
    materia = models.ForeignKey(
        Materia, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='libros',
        verbose_name='materia',
    )
    fecha_publicacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'libro'
        verbose_name_plural = 'libros'
        ordering = ['-fecha_publicacion']

    def __str__(self):
        return self.titulo


class Mensaje(models.Model):
    remitente = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE,
        related_name='mensajes_enviados',
        verbose_name='remitente',
    )
    destinatario = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE,
        related_name='mensajes_recibidos',
        verbose_name='destinatario',
    )
    libro = models.ForeignKey(
        Libro, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='mensajes',
        verbose_name='libro',
    )
    contenido = models.TextField('contenido')
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField('leído', default=False)

    class Meta:
        verbose_name = 'mensaje'
        verbose_name_plural = 'mensajes'
        ordering = ['-fecha_envio']

    def __str__(self):
        return f'De: {self.remitente.nombre} → {self.destinatario.nombre}'


class Favorito(models.Model):
    usuario = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE,
        related_name='favoritos',
        verbose_name='usuario',
    )
    libro = models.ForeignKey(
        Libro, on_delete=models.CASCADE,
        related_name='favoritos',
        verbose_name='libro',
    )
    fecha_agregado = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'favorito'
        verbose_name_plural = 'favoritos'
        unique_together = ['usuario', 'libro']
        ordering = ['-fecha_agregado']

    def __str__(self):
        return f'{self.usuario.nombre} → {self.libro.titulo}'


class ContactoMensaje(models.Model):
    nombre = models.CharField('nombre', max_length=150)
    email = models.EmailField('correo')
    asunto = models.CharField('asunto', max_length=200)
    mensaje = models.TextField('mensaje')
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField('leído', default=False)

    class Meta:
        verbose_name = 'mensaje de contacto'
        verbose_name_plural = 'mensajes de contacto'
        ordering = ['-fecha_envio']

    def __str__(self):
        return f'{self.nombre}: {self.asunto}'
