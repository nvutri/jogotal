from django.contrib.auth.models import User
from django.test import TestCase, Client
from rest_framework.test import APIClient


class AuthTestCase(TestCase):
    """Testing the handling of users."""

    def test_create_new_user(self):
        """Test creating new user."""
        c = Client()
        response = c.post('/auth/register/', {
            'username': 'test3@yahoo.com',
            'email': 'test3@yahoo.com',
            'password': '2faf3sf3',
            'first_name': 'firstN',
            'last_name': 'lastN',
        })
        self.assertEqual(response.status_code, 201, response)
        self.assertIsNone(response.json().get('error'), response.json())
        self.assertTrue(User.objects.filter(username='test3@yahoo.com').exists())

    def test_create_duplicated_user(self):
        """Test creating duplicating user."""
        c = Client()
        c_request = {
            'email': 'test2@yahoo.com',
            'username': 'test2@yahoo.com',
            'password': '2faf3sf3',
            'first_name': 'firstN',
            'last_name': 'lastN',
        }
        response = c.post('/auth/register/', c_request)
        self.assertEqual(response.status_code, 201, response)
        self.assertIsNone(response.json().get('error'))
        self.assertTrue(User.objects.filter(username='test2@yahoo.com').exists())
        response = c.post('/auth/register/', c_request)
        self.assertEqual(response.status_code, 400, response)
        self.assertIsNotNone(response.json().get('username'), response.json())

    def test_logout_user(self):
        """Test logout user."""
        client = APIClient()
        user = User.objects.create_user(username='testauth', password='test')
        client.force_authenticate(user=user)
        response = client.post('/auth/logout/')
        self.assertEqual(response.status_code, 204, response)


class UserTestCase(TestCase):
    """Testing the handling of users."""

    def setUp(self):
        """Setup default client and user."""
        self.user = User.objects.create_user(
            username='test@jogotal.com',
            email='test@jogotal.com'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def testEditUser(self):
        """Test permission to edit other users."""
        user_2 = User.objects.create_user(
            username='test2@jogotal.com',
            password='a23faf2sf',
            email='test2@jogotal.com',
            first_name='Test2'
        )
        response = self.client.patch('/api/users/%s/' % user_2.id, {'first_name': 'user_2'})
        self.assertNotEqual(response.status_code, 200)
        response = self.client.patch('/api/users/%s/' % self.user.id, {'first_name': 'user_1'})
        self.assertEqual(response.status_code, 200)
