import unittest
from src.models.client import Client
from src.models.barber import Barber
from src.models.service import Service
from src.models.appointment import Appointment
from src.database import db # Import db from the new database.py
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

class TestModelsMongoDB(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Use a test database
        cls.test_db = db.client.barberpro_test_db
        # Assign collections to models for testing
        Client.collection = cls.test_db.clients
        Barber.collection = cls.test_db.barbers
        Service.collection = cls.test_db.services
        Appointment.collection = cls.test_db.appointments

    def setUp(self):
        # Clear collections before each test
        self.test_db.clients.delete_many({})
        self.test_db.barbers.delete_many({})
        self.test_db.services.delete_many({})
        self.test_db.appointments.delete_many({})

    def test_client_creation_and_find(self):
        hashed_password = generate_password_hash("password123")
        client = Client(name="Test Client", email="test@example.com", password=hashed_password, phone="123456789", address={"street": "Main St"})
        client.save()
        self.assertIsNotNone(client._id)

        found_client = Client.find_by_email("test@example.com")
        self.assertIsNotNone(found_client)
        self.assertEqual(found_client.name, "Test Client")
        self.assertTrue(check_password_hash(found_client.password, "password123"))

        found_client_by_id = Client.find_by_id(str(client._id))
        self.assertIsNotNone(found_client_by_id)
        self.assertEqual(found_client_by_id.email, "test@example.com")

    def test_barber_creation_and_find(self):
        hashed_password = generate_password_hash("barberpass")
        barber = Barber(name="Test Barber", email="barber@example.com", password=hashed_password, phone="987654321", specialty="Haircut")
        barber.save()
        self.assertIsNotNone(barber._id)

        found_barber = Barber.find_by_email("barber@example.com")
        self.assertIsNotNone(found_barber)
        self.assertEqual(found_barber.name, "Test Barber")

        found_barber_by_id = Barber.find_by_id(str(barber._id))
        self.assertIsNotNone(found_barber_by_id)
        self.assertEqual(found_barber_by_id.email, "barber@example.com")

    def test_service_creation_and_find(self):
        barber = Barber(name="Test Barber", email="barber@example.com", password="pass", phone="123", specialty="cut")
        barber.save()

        service = Service(name="Haircut", description="Standard haircut", price=50.0, duration=30, barber_id=str(barber._id))
        service.save()
        self.assertIsNotNone(service._id)

        found_service = Service.find_by_id(str(service._id))
        self.assertIsNotNone(found_service)
        self.assertEqual(found_service.name, "Haircut")

        all_services = Service.find_all()
        self.assertEqual(len(all_services), 1)

        barber_services = Service.find_by_barber_id(str(barber._id))
        self.assertEqual(len(barber_services), 1)

    def test_appointment_creation_and_find(self):
        client = Client(name="Test Client", email="client@example.com", password="pass", phone="123")
        client.save()
        barber = Barber(name="Test Barber", email="barber@example.com", password="pass", phone="123", specialty="cut")
        barber.save()
        service = Service(name="Haircut", description="Standard haircut", price=50.0, duration=30, barber_id=str(barber._id))
        service.save()

        appointment = Appointment(
            client_id=str(client._id),
            barber_id=str(barber._id),
            date="2025-08-01",
            time="10:00",
            duration=30,
            total_price=50.0,
            appointment_type="barbershop",
            service_ids=[str(service._id)],
            payment_method="pix",
            payment_status="pending"
        )
        appointment.save()
        self.assertIsNotNone(appointment._id)

        found_appointment = Appointment.find_by_id(str(appointment._id))
        self.assertIsNotNone(found_appointment)
        self.assertEqual(found_appointment.client_id, str(client._id))

        client_appointments = Appointment.find_all(client_id=str(client._id))
        self.assertEqual(len(client_appointments), 1)

        barber_appointments = Appointment.find_all(barber_id=str(barber._id))
        self.assertEqual(len(barber_appointments), 1)

    def test_get_available_times(self):
        barber = Barber(name="Test Barber", email="barber@example.com", password="pass", phone="123", specialty="cut")
        barber.save()

        # Book an appointment
        appointment = Appointment(
            client_id=str(ObjectId()),
            barber_id=str(barber._id),
            date="2025-08-02",
            time="10:00",
            duration=30,
            total_price=50.0,
            appointment_type="barbershop",
            service_ids=[],
            payment_method="pix",
            payment_status="pending"
        )
        appointment.save()

        available_times = Appointment.get_available_times(str(barber._id), "2025-08-02")
        self.assertNotIn("10:00", available_times)
        self.assertIn("09:00", available_times)

    @classmethod
    def tearDownClass(cls):
        # Clean up test database
        cls.test_db.client.drop_database(cls.test_db.name)

if __name__ == '__main__':
    unittest.main()


