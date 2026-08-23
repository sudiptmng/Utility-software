from django.db import models
from django.contrib.auth.models import User
from cryptography.fernet import Fernet
from django.conf import settings


class PasswordEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='passwords')
    site_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    encrypted_password = models.BinaryField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def set_password(self, raw_password):
        f = Fernet(settings.FERNET_KEY)
        self.encrypted_password = f.encrypt(raw_password.encode())

    def get_password(self):
        f = Fernet(settings.FERNET_KEY)
        return f.decrypt(self.encrypted_password).decode()

    def __str__(self):
        return f"{self.site_name} ({self.user.username})"