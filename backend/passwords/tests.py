from django.test import TestCase

# Create your tests here.
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import PasswordEntry


@pytest.fixture
def user():
    return User.objects.create_user(username='testuser', password='testpass123')


@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.mark.django_db
def test_create_password_entry(auth_client):
    response = auth_client.post('/api/passwords/', {
        'site_name': 'Gmail',
        'username': 'myuser',
        'password': 'secret123'
    })
    assert response.status_code == 201
    assert PasswordEntry.objects.count() == 1
    assert 'password' not in response.data


@pytest.mark.django_db
def test_password_is_encrypted(auth_client, user):
    auth_client.post('/api/passwords/', {
        'site_name': 'Gmail',
        'username': 'myuser',
        'password': 'secret123'
    })
    entry = PasswordEntry.objects.first()
    assert entry.get_password() == 'secret123'
    assert entry.encrypted_password != b'secret123'


@pytest.mark.django_db
def test_list_passwords_only_own(auth_client, user):
    other_user = User.objects.create_user(username='other', password='pass123')
    entry = PasswordEntry(user=user, site_name='Site A', username='a')
    entry.set_password('pass1')
    entry.save()

    other_entry = PasswordEntry(user=other_user, site_name='Site B', username='b')
    other_entry.set_password('pass2')
    other_entry.save()

    response = auth_client.get('/api/passwords/')
    assert response.status_code == 200
    assert len(response.data) == 1


@pytest.mark.django_db
def test_reveal_password_correct_login_password(auth_client, user):
    entry = PasswordEntry(user=user, site_name='Gmail', username='me')
    entry.set_password('mysecret')
    entry.save()

    response = auth_client.post(f'/api/passwords/{entry.id}/reveal/', {
        'login_password': 'testpass123'
    })
    assert response.status_code == 200
    assert response.data['password'] == 'mysecret'


@pytest.mark.django_db
def test_reveal_password_wrong_login_password(auth_client, user):
    entry = PasswordEntry(user=user, site_name='Gmail', username='me')
    entry.set_password('mysecret')
    entry.save()

    response = auth_client.post(f'/api/passwords/{entry.id}/reveal/', {
        'login_password': 'wrongpassword'
    })
    assert response.status_code == 401