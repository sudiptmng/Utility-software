from django.test import TestCase

# Create your tests here.
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Bookmark


@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass123')


@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.mark.django_db
def test_create_bookmark(auth_client):
    response = auth_client.post('/api/bookmarks/', {
        'title': 'Django Docs',
        'url': 'https://docs.djangoproject.com'
    })
    assert response.status_code == 201
    assert Bookmark.objects.count() == 1


@pytest.mark.django_db
def test_list_bookmarks_only_own(auth_client, user):
    other_user = User.objects.create_user(username='other', password='pass123')
    Bookmark.objects.create(user=user, title='Mine', url='https://a.com')
    Bookmark.objects.create(user=other_user, title='Not mine', url='https://b.com')

    response = auth_client.get('/api/bookmarks/')
    assert response.status_code == 200
    assert len(response.data) == 1


@pytest.mark.django_db
def test_delete_bookmark(auth_client, user):
    bookmark = Bookmark.objects.create(user=user, title='Delete me', url='https://a.com')
    response = auth_client.delete(f'/api/bookmarks/{bookmark.id}/')
    assert response.status_code == 204