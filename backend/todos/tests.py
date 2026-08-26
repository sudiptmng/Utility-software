from django.test import TestCase

# Create your tests here.
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Todo


@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass123')


@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.mark.django_db
def test_create_todo(auth_client):
    response = auth_client.post('/api/todos/', {'title': 'Buy groceries'})
    assert response.status_code == 201
    assert Todo.objects.count() == 1


@pytest.mark.django_db
def test_list_todos_only_own(auth_client, user):
    other_user = User.objects.create_user(username='other', password='pass123')
    Todo.objects.create(user=user, title='Mine')
    Todo.objects.create(user=other_user, title='Not mine')

    response = auth_client.get('/api/todos/')
    assert response.status_code == 200
    assert len(response.data) == 1


@pytest.mark.django_db
def test_delete_todo(auth_client, user):
    todo = Todo.objects.create(user=user, title='Delete me')
    response = auth_client.delete(f'/api/todos/{todo.id}/')
    assert response.status_code == 204
    assert Todo.objects.count() == 0
