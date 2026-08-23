from rest_framework import viewsets, permissions
from .models import PasswordEntry
from .serializers import PasswordEntrySerializer


class PasswordEntryViewSet(viewsets.ModelViewSet):
    serializer_class = PasswordEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PasswordEntry.objects.filter(user=self.request.user)