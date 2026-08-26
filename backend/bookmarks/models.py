from django.db import models
from django.contrib.auth.models import User


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    title = models.CharField(max_length=255)
    url = models.URLField()
    tag = models.CharField(max_length=100, blank=True)
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
