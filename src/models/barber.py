from src.database import db
from werkzeug.security import check_password_hash

class Barber:
    def __init__(self, _id=None, name=None, email=None, password=None, phone=None, specialty=None):
        self._id = _id
        self.name = name
        self.email = email
        self.password = password
        self.phone = phone
        self.specialty = specialty

    def to_dict(self):
        return {
            '_id': str(self._id) if self._id else None,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'specialty': self.specialty
        }

    @staticmethod
    def from_dict(data):
        return Barber(
            _id=data.get('_id'),
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password'),
            phone=data.get('phone'),
            specialty=data.get('specialty')
        )

    def save(self):
        data_to_save = self.to_dict()
        # Remove _id if it's None for insertion
        if data_to_save['_id'] is None:
            del data_to_save['_id']
            
        if self._id:
            from bson.objectid import ObjectId
            db.barbers.update_one({'_id': ObjectId(self._id)}, {'$set': data_to_save})
        else:
            result = db.barbers.insert_one(data_to_save)
            self._id = result.inserted_id
        return self

    @staticmethod
    def find_by_email(email):
        data = db.barbers.find_one({'email': email})
        if data:
            return Barber.from_dict(data)
        return None

    @staticmethod
    def find_by_id(barber_id):
        from bson.objectid import ObjectId
        data = db.barbers.find_one({'_id': ObjectId(barber_id)})
        if data:
            return Barber.from_dict(data)
        return None

    @staticmethod
    def delete_by_id(barber_id):
        from bson.objectid import ObjectId
        result = db.barbers.delete_one({'_id': ObjectId(barber_id)})
        return result.deleted_count > 0


