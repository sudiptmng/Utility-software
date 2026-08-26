from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import PasswordEntry
from .serializers import PasswordEntrySerializer


class PasswordEntryViewSet(viewsets.ModelViewSet):
    serializer_class = PasswordEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PasswordEntry.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def reveal(self, request, pk=None):
        entry = self.get_object()
        login_password = request.data.get('login_password', '')

        user = authenticate(username=request.user.username, password=login_password)
        if user is None:
            return Response({'detail': 'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({'password': entry.get_password()})