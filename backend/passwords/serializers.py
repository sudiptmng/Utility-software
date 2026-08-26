from rest_framework import serializers
from .models import PasswordEntry
from .models import Note
from .models import Bookmark


class PasswordEntrySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = PasswordEntry
        fields = ['id', 'site_name', 'username', 'password', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        raw_password = validated_data.pop('password')
        entry = PasswordEntry(user=self.context['request'].user, **validated_data)
        entry.set_password(raw_password)
        entry.save()
        return entry


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'tag', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'title', 'url', 'tag', 'is_favorite', 'created_at']
        read_only_fields = ['id', 'created_at']