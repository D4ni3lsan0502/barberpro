import unittest
import json
from src.main import app, db
from src.models.client import Client
from src.models.barber import Barber
from src.models.service import Service
from src.models.appointment import Appointment

class TestRoutes(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.app = app.test_client()
        with app.app_context():
            db.create_all()

            # Create a test client
            self.client_data = {
                "name": "Test Client",
                "email": "client@example.com",
                "password": "password123",
                "phone": "11987654321",
                "cep": "12345-678",
                "street": "Rua Teste",
                "number": "123",
                "complement": "Apto 1",
                "neighborhood": "Bairro Teste",
                "city": "Cidade Teste",
                "state": "SP"
            }
            self.app.post("/api/clients", json=self.client_data)
            client_login_res = self.app.post("/api/login", json={
                "email": "client@example.com",
                "password": "password123",
                "role": "client"
            })
            self.client_access_token = json.loads(client_login_res.data)["access_token"]

            # Create a test barber
            self.barber_data = {
                "name": "Test Barber",
                "email": "barber@example.com",
                "password": "password123",
                "phone": "11912345678",
                "specialty": "Corte Masculino"
            }
            self.app.post("/api/barbers", json=self.barber_data)
            barber_login_res = self.app.post("/api/login", json={
                "email": "barber@example.com",
                "password": "password123",
                "role": "barber"
            })
            self.barber_access_token = json.loads(barber_login_res.data)["access_token"]

            # Create a test service
            self.service_data = {
                "name": "Corte de Cabelo",
                "description": "Corte de cabelo masculino",
                "price": 50.00,
                "duration": 30
            }
            service_res = self.app.post("/api/services", json=self.service_data, headers={
                "Authorization": f"Bearer {self.barber_access_token}"
            })
            if service_res.status_code == 201:
                self.service_id = json.loads(service_res.data)["service"]["id"]
            else:
                # If service creation fails, try to get an existing service or default to 1
                existing_services = self.app.get("/api/services").json.get("services")
                if existing_services:
                    self.service_id = existing_services[0]["id"]
                else:
                    self.service_id = 1  # Default service ID for testing

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_client_registration(self):
        res = self.app.post("/api/clients", json={
            "name": "New Client",
            "email": "newclient@example.com",
            "password": "newpassword",
            "phone": "11999999999",
            "cep": "12345-678",
            "street": "Rua Nova",
            "number": "456",
            "complement": "Casa",
            "neighborhood": "Centro",
            "city": "São Paulo",
            "state": "SP"
        })
        self.assertEqual(res.status_code, 201)
        self.assertIn("Client registered successfully", str(res.data))

    def test_barber_registration(self):
        res = self.app.post("/api/barbers", json={
            "name": "New Barber",
            "email": "newbarber@example.com",
            "password": "newpassword",
            "phone": "11988888888",
            "specialty": "Barba"
        })
        self.assertEqual(res.status_code, 201)
        self.assertIn("Barber registered successfully", str(res.data))

    def test_login(self):
        res = self.app.post("/api/login", json={
            "email": "client@example.com",
            "password": "password123",
            "role": "client"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("access_token", str(res.data))

    def test_get_client(self):
        with app.app_context():
            client = Client.query.filter_by(email="client@example.com").first()
            res = self.app.get(f"/api/clients/{client.id}", headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            self.assertEqual(res.status_code, 200)
            self.assertIn("Test Client", str(res.data))

    def test_update_client(self):
        with app.app_context():
            client = Client.query.filter_by(email="client@example.com").first()
            res = self.app.put(f"/api/clients/{client.id}", json={
                "name": "Updated Client Name",
                "phone": "11987654322",
                "cep": "12345-678",
                "street": "Rua Teste",
                "number": "123",
                "complement": "Apto 1",
                "neighborhood": "Bairro Teste",
                "city": "Cidade Teste",
                "state": "SP"
            }, headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            self.assertEqual(res.status_code, 200)
            self.assertIn("Updated Client Name", str(res.data))

    def test_delete_client(self):
        with app.app_context():
            client = Client.query.filter_by(email="client@example.com").first()
            res = self.app.delete(f"/api/clients/{client.id}", headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            self.assertEqual(res.status_code, 204)

    def test_get_barber(self):
        with app.app_context():
            barber = Barber.query.filter_by(email="barber@example.com").first()
            res = self.app.get(f"/api/barbers/{barber.id}", headers={
                "Authorization": f"Bearer {self.barber_access_token}"
            })
            self.assertEqual(res.status_code, 200)
            self.assertIn("Test Barber", str(res.data))

    def test_update_barber(self):
        with app.app_context():
            barber = Barber.query.filter_by(email="barber@example.com").first()
            res = self.app.put(f"/api/barbers/{barber.id}", json={
                "specialty": "Corte e Barba",
                "name": "Test Barber",
                "email": "barber@example.com",
                "phone": "11912345678"
            }, headers={
                "Authorization": f"Bearer {self.barber_access_token}"
            })
            self.assertEqual(res.status_code, 200)
            self.assertIn("Corte e Barba", str(res.data))

    def test_delete_barber(self):
        with app.app_context():
            barber = Barber.query.filter_by(email="barber@example.com").first()
            res = self.app.delete(f"/api/barbers/{barber.id}", headers={
                "Authorization": f"Bearer {self.barber_access_token}"
            })
            self.assertEqual(res.status_code, 204)

    def test_create_service(self):
        res = self.app.post("/api/services", json={
            "name": "Barba",
            "description": "Serviço de barbearia",
            "price": 30.00,
            "duration": 20
        }, headers={
            "Authorization": f"Bearer {self.barber_access_token}"
        })
        self.assertEqual(res.status_code, 201)
        self.assertIn("Service created successfully", str(res.data))

    def test_get_services(self):
        res = self.app.get("/api/services", headers={
            "Authorization": f"Bearer {self.barber_access_token}"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("Corte de Cabelo", str(res.data))

    def test_get_service(self):
        res = self.app.get(f"/api/services/{self.service_id}", headers={
            "Authorization": f"Bearer {self.barber_access_token}"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("Corte de Cabelo", str(res.data))

    def test_update_service(self):
        res = self.app.put(f"/api/services/{self.service_id}", json={
            "price": 60.00,
            "name": "Corte de Cabelo",
            "description": "Corte de cabelo masculino",
            "duration": 30
        }, headers={
            "Authorization": f"Bearer {self.barber_access_token}"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("60.0", str(res.data))

    def test_delete_service(self):
        res = self.app.delete(f"/api/services/{self.service_id}", headers={
            "Authorization": f"Bearer {self.barber_access_token}"
        })
        self.assertEqual(res.status_code, 204)

    def test_create_appointment(self):
        with app.app_context():
            client = Client.query.filter_by(email="client@example.com").first()
            barber = Barber.query.filter_by(email="barber@example.com").first()
            res = self.app.post("/api/appointments", json={
                "barber_id": barber.id,
                "date": "2025-07-20",
                "time": "10:00",
                "duration": 60,
                "total_price": 100.00,
                "appointment_type": "barbershop",
                "service_ids": [self.service_id]
            }, headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            self.assertEqual(res.status_code, 201)
            self.assertIn("Appointment created successfully", str(res.data))

    def test_get_appointments(self):
        with app.app_context():
            client = Client.query.filter_by(email="client@example.com").first()
            barber = Barber.query.filter_by(email="barber@example.com").first()
            self.app.post("/api/appointments", json={
                "barber_id": barber.id,
                "date": "2025-07-20",
                "time": "10:00",
                "duration": 60,
                "total_price": 100.00,
                "appointment_type": "barbershop",
                "service_ids": [self.service_id]
            }, headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            res = self.app.get("/api/appointments", headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            self.assertEqual(res.status_code, 200)
            self.assertIn("2025-07-20", str(res.data))

    def test_get_appointment(self):
        with app.app_context():
            client = Client.query.filter_by(email="client@example.com").first()
            barber = Barber.query.filter_by(email="barber@example.com").first()
            create_res = self.app.post("/api/appointments", json={
                "barber_id": barber.id,
                "date": "2025-07-20",
                "time": "10:00",
                "duration": 60,
                "total_price": 100.00,
                "appointment_type": "barbershop",
                "service_ids": [self.service_id]
            }, headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            appointment_id = json.loads(create_res.data)["appointment"]["id"]
            res = self.app.get(f"/api/appointments/{appointment_id}", headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            self.assertEqual(res.status_code, 200)
            self.assertIn("2025-07-20", str(res.data))

    def test_update_appointment(self):
        with app.app_context():
            client = Client.query.filter_by(email="client@example.com").first()
            barber = Barber.query.filter_by(email="barber@example.com").first()
            create_res = self.app.post("/api/appointments", json={
                "barber_id": barber.id,
                "date": "2025-07-20",
                "time": "10:00",
                "duration": 60,
                "total_price": 100.00,
                "appointment_type": "barbershop",
                "service_ids": [self.service_id]
            }, headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            appointment_id = json.loads(create_res.data)["appointment"]["id"]
            res = self.app.put(f"/api/appointments/{appointment_id}", json={
                "status": "confirmed",
                "barber_id": barber.id,
                "date": "2025-07-20",
                "time": "10:00",
                "duration": 60,
                "total_price": 100.00,
                "appointment_type": "barbershop",
                "service_ids": [self.service_id]
            }, headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            self.assertEqual(res.status_code, 200)
            self.assertIn("confirmed", str(res.data))

    def test_delete_appointment(self):
        with app.app_context():
            client = Client.query.filter_by(email="client@example.com").first()
            barber = Barber.query.filter_by(email="barber@example.com").first()
            create_res = self.app.post("/api/appointments", json={
                "barber_id": barber.id,
                "date": "2025-07-20",
                "time": "10:00",
                "duration": 60,
                "total_price": 100.00,
                "appointment_type": "barbershop",
                "service_ids": [self.service_id]
            }, headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            appointment_id = json.loads(create_res.data)["appointment"]["id"]
            res = self.app.delete(f"/api/appointments/{appointment_id}", headers={
                "Authorization": f"Bearer {self.client_access_token}"
            })
            self.assertEqual(res.status_code, 204)

if __name__ == '__main__':
    unittest.main()


