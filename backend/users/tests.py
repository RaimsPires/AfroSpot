from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import UserAddress


User = get_user_model()


class UserAddressAPITests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			email='user@example.com',
			password='pass12345',
		)
		self.other_user = User.objects.create_user(
			email='other@example.com',
			password='pass12345',
		)
		self.client.force_authenticate(user=self.user)
		self.create_url = reverse('user_address_create')

	@staticmethod
	def _payload(**overrides):
		base_payload = {
			'address_type': 'home',
			'is_active': False,
			'address': '124 Atlantic Ave',
			'city': 'Brooklyn',
			'state': 'NY',
			'zip_code': '11201',
			'country': 'USA',
		}
		base_payload.update(overrides)
		return base_payload

	def test_first_address_becomes_primary_even_if_is_active_false(self):
		response = self.client.post(self.create_url, self._payload(), format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(response.data['is_active'])
		self.assertEqual(UserAddress.objects.filter(user=self.user, is_active=True).count(), 1)

	def test_create_primary_demotes_existing_primary(self):
		UserAddress.objects.create(
			user=self.user,
			address_type='home',
			is_active=True,
			address='Old Address',
			city='Old City',
			state='NY',
			zip_code='10001',
			country='USA',
		)

		response = self.client.post(
			self.create_url,
			self._payload(address='New Address', is_active=True),
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(UserAddress.objects.filter(user=self.user, is_active=True).count(), 1)
		self.assertTrue(UserAddress.objects.get(id=response.data['id']).is_active)

	def test_set_primary_switches_active_address(self):
		current_primary = UserAddress.objects.create(
			user=self.user,
			address_type='home',
			is_active=True,
			address='Primary Address',
			city='Brooklyn',
			state='NY',
			zip_code='11201',
			country='USA',
		)
		target_address = UserAddress.objects.create(
			user=self.user,
			address_type='work',
			is_active=False,
			address='Work Address',
			city='New York',
			state='NY',
			zip_code='10001',
			country='USA',
		)

		set_primary_url = reverse('user_address_set_primary', kwargs={'address_id': target_address.id})
		response = self.client.patch(set_primary_url, {}, format='json')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		current_primary.refresh_from_db()
		target_address.refresh_from_db()
		self.assertFalse(current_primary.is_active)
		self.assertTrue(target_address.is_active)
		self.assertEqual(UserAddress.objects.filter(user=self.user, is_active=True).count(), 1)

	def test_set_primary_rejects_address_from_other_user(self):
		other_user_address = UserAddress.objects.create(
			user=self.other_user,
			address_type='home',
			is_active=True,
			address='Other Address',
			city='Chicago',
			state='IL',
			zip_code='60601',
			country='USA',
		)

		set_primary_url = reverse('user_address_set_primary', kwargs={'address_id': other_user_address.id})
		response = self.client.patch(set_primary_url, {}, format='json')

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
