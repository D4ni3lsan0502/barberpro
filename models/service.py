from src.database import db

class Service:
    def __init__(self, _id=None, name=None, description=None, price=None, duration=None, barber_id=None):
        self._id = _id
        self.name = name
        self.description = description
        self.price = price
        self.duration = duration
        self.barber_id = barber_id

    def to_dict(self):
        return {
            '_id': str(self._id) if self._id else None,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'duration': self.duration,
            'barber_id': str(self.barber_id) if self.barber_id else None
        }

    @staticmethod
    def from_dict(data):
        return Service(
            _id=data.get('_id'),
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            duration=data.get('duration'),
            barber_id=data.get('barber_id')
        )

    def save(self):
        data_to_save = self.to_dict()
        # Remove _id if it's None for insertion
        if data_to_save['_id'] is None:
            del data_to_save['_id']
            
        if self._id:
            from bson.objectid import ObjectId
            db.services.update_one({'_id': ObjectId(self._id)}, {'$set': data_to_save})
        else:
            result = db.services.insert_one(data_to_save)
            self._id = result.inserted_id
        return self

    @staticmethod
    def find_by_id(service_id):
        from bson.objectid import ObjectId
        data = db.services.find_one({'_id': ObjectId(service_id)})
        if data:
            return Service.from_dict(data)
        return None

    @staticmethod
    def find_all():
        services = []
        for data in db.services.find():
            services.append(Service.from_dict(data))
        return services

    @staticmethod
    def delete_by_id(service_id):
        from bson.objectid import ObjectId
        result = db.services.delete_one({'_id': ObjectId(service_id)})
        return result.deleted_count > 0

    @staticmethod
    def find_by_barber_id(barber_id):
        from bson.objectid import ObjectId
        services = []
        for data in db.services.find({'barber_id': str(ObjectId(barber_id))}):
            services.append(Service.from_dict(data))
        return services


