from datetime import datetime, timedelta
from decimal import Decimal
from django.contrib.auth.models import User

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from jogotal_jogs.models import JogotalJog


class JogsTestCase(TestCase):
    """Testing the handling of jogging."""

    def setUp(self):
        """Setup default client and user."""
        self.user = User.objects.create_user(
            username='freelancer@yahoo.com', email='freelancer@yahoo.com'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.test_jog = {
            'user': self.user.id,
            'distance': 2.0,
            'duration': 0.5,
            'recorded': datetime.now().isoformat()
        }

    def test_create_jog(self):
        response = self.client.post('/api/jogs/', self.test_jog)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response)

    def test_edit_jog(self):
        response = self.client.post('/api/jogs/', self.test_jog)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        jog = response.json()
        edit_response = self.client.patch('/api/jogs/%s/' % jog.get('id'), {
            'distance': 2.5,
            'duration': 1.0
        })
        self.assertEqual(edit_response.status_code, status.HTTP_200_OK)
        edit_jog = JogotalJog.objects.get(id=jog.get('id'))
        self.assertEqual(edit_jog.distance, 2.5)
        self.assertEqual(edit_jog.duration, 1.0)

    def test_delete_jog(self):
        response = self.client.post('/api/jogs/', self.test_jog)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        jog = response.json()
        delete_response = self.client.delete('/api/jogs/%s' % jog.get('id'))
        self.assertEqual(delete_response.status_code, 200)

    def test_get_stats(self):
        test_jog = self.test_jog
        test_jog['distance'] = 2.0
        test_jog['recorded'] = datetime(2017, 9, 7)
        self.client.post('/api/jogs/', test_jog)
        test_jog['distance'] = 2.5
        test_jog['recorded'] = datetime(2017, 9, 6)
        self.client.post('/api/jogs/', test_jog)
        test_jog['distance'] = 3.5
        test_jog['recorded'] = datetime(2017, 9, 1)
        self.client.post('/api/jogs/', test_jog)
        test_jog['distance'] = 0.5
        test_jog['recorded'] = datetime(2017, 8, 30)
        self.client.post('/api/jogs/', test_jog)
        response = self.client.get('/api/jogs/stats/')
        stats = response.json()


class JogsAdminTestCase(TestCase):
    """Testing jogging CRUD for ADMIN."""

    def setUp(self):
        """Setup default client and user."""
        self.user = User.objects.create_user(
            username='freelancer@yahoo.com', email='freelancer@yahoo.com',
            is_staff=True
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.test_jog = {
            'user': self.user.id,
            'distance': 2.0,
            'duration': 0.5,
            'recorded': datetime.now().isoformat()
        }

    def test_list_jog(self):
        # Successfully getting data for admin users.
        response = self.client.get('/api/jogsadmin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response)
        # Test Fail Authentication for non-staff and anonymous users.
        client = APIClient()
        response = client.get('/api/jogsadmin/', self.test_jog)
        self.assertEqual(response.status_code, 401)
        user = User.objects.create_user(
            username='testuser@yahoo.com', email='testuser@yahoo.com'
        )
        client.force_authenticate(user=user)
        response = client.get('/api/jogsadmin/', self.test_jog)
        self.assertEqual(response.status_code, 403)
