from django.test import TestCase

# Create your tests here.
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_register_creates_user():
    client = APIClient()
    response = client.post('/api/register/', {
        'username': 'newuser',
        'password': 'strongpass123'
    })
    assert response.status_code == 201
    assert User.objects.filter(username='newuser').exists()


@pytest.mark.django_db
def test_register_duplicate_username_fails():
    User.objects.create_user(username='existing', password='pass123')
    client = APIClient()
    response = client.post('/api/register/', {
        'username': 'existing',
        'password': 'pass123'
    })
    assert response.status_code == 400
