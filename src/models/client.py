from src.database import db
from werkzeug.security import check_password_hash

class Client:
    def __init__(self, _id=None, name=None, email=None, password=None, phone=None, address=None):
        self._id = _id
        self.name = name
        self.email = email
        self.password = password
        self.phone = phone
        self.address = address if address is not None else {}

    def to_dict(self):
        return {
            '_id': str(self._id) if self._id else None,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address
        }

    @staticmethod
    def from_dict(data):
        return Client(
            _id=data.get('_id'),
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password'),
            phone=data.get('phone'),
            address=data.get('address')
        )

    def save(self):
        data_to_save = self.to_dict()
        # Remove _id if it's None for insertion
        if data_to_save['_id'] is None:
            del data_to_save['_id']
            
        if self._id:
            from bson.objectid import ObjectId
            db.clients.update_one({'_id': ObjectId(self._id)}, {'$set': data_to_save})
        else:
            result = db.clients.insert_one(data_to_save)
            self._id = result.inserted_id
        return self

    @staticmethod
    def find_by_email(email):
        data = db.clients.find_one({'email': email})
        if data:
            return Client.from_dict(data)
        return None

    @staticmethod
    def find_by_id(client_id):
        from bson.objectid import ObjectId
        data = db.clients.find_one({'_id': ObjectId(client_id)})
        if data:
            return Client.from_dict(data)
        return None

    @staticmethod
    def delete_by_id(client_id):
        from bson.objectid import ObjectId
        result = db.clients.delete_one({'_id': ObjectId(client_id)})
        return result.deleted_count > 0




