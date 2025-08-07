from src.database import db
from datetime import datetime
from bson.objectid import ObjectId

class Appointment:
    def __init__(self, _id=None, client_id=None, barber_id=None, date=None, time=None, duration=None, total_price=None, status='pending', appointment_type=None, service_ids=None, payment_method=None, payment_status=None, address=None):
        self._id = _id
        self.client_id = client_id
        self.barber_id = barber_id
        self.date = date # YYYY-MM-DD string
        self.time = time # HH:MM string
        self.duration = duration
        self.total_price = total_price
        self.status = status
        self.appointment_type = appointment_type
        self.service_ids = service_ids if service_ids is not None else []
        self.payment_method = payment_method
        self.payment_status = payment_status
        self.address = address if address is not None else {}

    def to_dict(self):
        return {
            '_id': str(self._id) if self._id else None,
            'client_id': str(self.client_id),
            'barber_id': str(self.barber_id),
            'date': self.date,
            'time': self.time,
            'duration': self.duration,
            'total_price': self.total_price,
            'status': self.status,
            'appointment_type': self.appointment_type,
            'service_ids': [str(s_id) for s_id in self.service_ids],
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'address': self.address
        }

    @staticmethod
    def from_dict(data):
        return Appointment(
            _id=data.get('_id'),
            client_id=data.get('client_id'),
            barber_id=data.get('barber_id'),
            date=data.get('date'),
            time=data.get('time'),
            duration=data.get('duration'),
            total_price=data.get('total_price'),
            status=data.get('status'),
            appointment_type=data.get('appointment_type'),
            service_ids=data.get('service_ids'),
            payment_method=data.get('payment_method'),
            payment_status=data.get('payment_status'),
            address=data.get('address')
        )

    def save(self):
        data_to_save = self.to_dict()
        # Remove _id if it's None for insertion
        if data_to_save['_id'] is None:
            del data_to_save['_id']

        if self._id:
            db.appointments.update_one({'_id': ObjectId(self._id)}, {'$set': data_to_save})
        else:
            result = db.appointments.insert_one(data_to_save)
            self._id = result.inserted_id
        return self

    @staticmethod
    def find_by_id(appointment_id):
        data = db.appointments.find_one({'_id': ObjectId(appointment_id)})
        if data:
            return Appointment.from_dict(data)
        return None

    @staticmethod
    def find_all(barber_id=None, client_id=None, status=None, date=None):
        query = {}
        if barber_id:
            query['barber_id'] = str(ObjectId(barber_id))
        if client_id:
            query['client_id'] = str(ObjectId(client_id))
        if status:
            query['status'] = status
        if date:
            query['date'] = date

        appointments = []
        for data in db.appointments.find(query):
            appointments.append(Appointment.from_dict(data))
        return appointments

    @staticmethod
    def delete_by_id(appointment_id):
        result = db.appointments.delete_one({'_id': ObjectId(appointment_id)})
        return result.deleted_count > 0

    @staticmethod
    def get_available_times(barber_id, date):
        # This is a simplified example. A real implementation would consider:
        # - Barber's working hours
        # - Already booked appointments for the barber on that date
        # - Duration of services
        # - Buffer time between appointments

        # For now, let's return some dummy available times
        # In a real scenario, you'd query appointments for the barber on the given date
        # and calculate available slots based on their schedule and service durations.
        
        # Example: Assume barber works from 9:00 to 18:00, with 30 min slots
        available_slots = []
        start_hour = 9
        end_hour = 18
        interval_minutes = 30

        current_time = datetime.now().time()
        current_date_str = datetime.now().strftime('%Y-%m-%d')

        for hour in range(start_hour, end_hour):
            for minute in range(0, 60, interval_minutes):
                slot_time_str = f'{hour:02d}:{minute:02d}'
                
                # Only add future times for today's date
                if date == current_date_str:
                    slot_dt = datetime.strptime(slot_time_str, '%H:%M').time()
                    if slot_dt > current_time:
                        available_slots.append(slot_time_str)
                else:
                    available_slots.append(slot_time_str)

        # Filter out already booked appointments
        booked_appointments = db.appointments.find({
            'barber_id': str(ObjectId(barber_id)),
            'date': date,
            'status': {'$in': ['pending', 'confirmed']}
        })

        booked_times = []
        for appt in booked_appointments:
            booked_times.append(appt['time'])
            # For more accurate availability, you'd also need to consider the duration
            # and block subsequent slots based on the service duration.

        filtered_slots = [slot for slot in available_slots if slot not in booked_times]
        return filtered_slots


