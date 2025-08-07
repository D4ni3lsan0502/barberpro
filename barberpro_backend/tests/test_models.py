import unittest
from datetime import date, time
from src.main import app, db
from src.models.client import Client
from src.models.barber import Barber
from src.models.service import Service
from src.models.appointment import Appointment

class TestModels(unittest.TestCase):

    def setUp(self):
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        app.config["TESTING"] = True
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_client_model(self):
        with app.app_context():
            client = Client(
                name="Test Client",
                email="test@client.com",
                phone="11987654321",
                role="client"
            )
            client.set_password("password123")
            db.session.add(client)
            db.session.commit()

            self.assertIsNotNone(client.id)
            self.assertEqual(client.email, "test@client.com")
            self.assertTrue(client.check_password("password123"))
            self.assertEqual(client.role, "client")

    def test_barber_model(self):
        with app.app_context():
            barber = Barber(
                name="Test Barber",
                email="test@barber.com",
                phone="11912345678",
                specialty="Haircut",
                role="barber"
            )
            barber.set_password("barberpass")
            db.session.add(barber)
            db.session.commit()

            self.assertIsNotNone(barber.id)
            self.assertEqual(barber.email, "test@barber.com")
            self.assertTrue(barber.check_password("barberpass"))
            self.assertEqual(barber.role, "barber")

    def test_service_model(self):
        with app.app_context():
            barber = Barber(
                name="Test Barber",
                email="test@barber.com",
                phone="11912345678",
                specialty="Haircut",
                role="barber"
            )
            barber.set_password("barberpass")
            db.session.add(barber)
            db.session.commit()

            service = Service(
                name="Haircut",
                description="Standard haircut",
                price=50.0,
                duration=30,
                barber_id=barber.id
            )
            db.session.add(service)
            db.session.commit()

            self.assertIsNotNone(service.id)
            self.assertEqual(service.name, "Haircut")
            self.assertEqual(service.barber_id, barber.id)

    def test_appointment_model(self):
        with app.app_context():
            client = Client(
                name="Test Client",
                email="test@client.com",
                phone="11987654321",
                role="client"
            )
            client.set_password("password123")
            db.session.add(client)
            db.session.commit()

            barber = Barber(
                name="Test Barber",
                email="test@barber.com",
                phone="11912345678",
                specialty="Haircut",
                role="barber"
            )
            barber.set_password("barberpass")
            db.session.add(barber)
            db.session.commit()

            service = Service(
                name="Haircut",
                description="Standard haircut",
                price=50.0,
                duration=30,
                barber_id=barber.id
            )
            db.session.add(service)
            db.session.commit()

            appointment = Appointment(
                client_id=client.id,
                barber_id=barber.id,
                date=date(2025, 7, 20),
                time=time(10, 0),
                duration=30,
                total_price=50.0,
                appointment_type="barbershop"
            )
            appointment.services.append(service)
            db.session.add(appointment)
            db.session.commit()

            self.assertIsNotNone(appointment.id)
            self.assertEqual(appointment.client_id, client.id)
            self.assertEqual(appointment.barber_id, barber.id)
            self.assertEqual(len(appointment.services), 1)
            self.assertEqual(appointment.services[0].name, "Haircut")

if __name__ == '__main__':
    unittest.main()


