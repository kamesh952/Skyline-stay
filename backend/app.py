from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from waitress import serve

from bson import ObjectId
from datetime import datetime, timedelta, timezone
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# App configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# MongoDB connection
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
db_name = os.getenv('DB_NAME', 'hotel_management')
client = MongoClient(mongo_uri)
db = client[db_name]

# Collections
users = db['users']
guests = db['guests']
rooms = db['rooms']
bookings = db['bookings']

# Helper function to serialize MongoDB documents
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users.find_one({'email': data['email']})
            if not current_user:
                return jsonify({'error': 'User not found'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': 'Token verification failed'}), 401
            
        return f(current_user, *args, **kwargs)
        
    return decorated

# Auth Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
            
        # Validate email format
        if '@' not in data['email']:
            return jsonify({'error': 'Invalid email format'}), 400
            
        # Check password length
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
            
        # Check if user exists
        if users.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already exists'}), 409
            
        # Create new user
        new_user = {
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'created_at': datetime.now(timezone.utc),
            'role': data.get('role', 'staff')
        }
        
        # Add optional fields
        if 'name' in data:
            new_user['name'] = data['name']
            
        # Insert user
        user_id = users.insert_one(new_user).inserted_id
        new_user = users.find_one({'_id': user_id})
        serialized_user = serialize_doc(new_user)
        del serialized_user['password']
        
        return jsonify({
            'message': 'User registered successfully',
            'user': serialized_user
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
            
        user = users.find_one({'email': data['email']})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if not check_password_hash(user['password'], data['password']):
            return jsonify({'error': 'Incorrect password'}), 401
            
        token = jwt.encode({
            'email': user['email'],
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        serialized_user = serialize_doc(user)
        del serialized_user['password']
        
        return jsonify({
            'token': token,
            'user': serialized_user
        })
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

# Protected Routes Example
@app.route('/api/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    return jsonify({
        'message': f'Hello {current_user.get("name", current_user["email"])}',
        'user': serialize_doc(current_user)
    })

# Guests API
@app.route('/api/guests', methods=['GET', 'POST'])
@token_required
def handle_guests(current_user):
    if request.method == 'GET':
        guest_list = list(guests.find())
        return jsonify([serialize_doc(guest) for guest in guest_list])
    elif request.method == 'POST':
        guest_data = request.get_json()
        result = guests.insert_one(guest_data)
        return jsonify(serialize_doc(guests.find_one({'_id': result.inserted_id}))), 201

@app.route('/api/guests/<id>', methods=['GET', 'PUT', 'DELETE'])
@token_required
def handle_guest(current_user, id):
    try:
        if request.method == 'GET':
            guest = guests.find_one({'_id': ObjectId(id)})
            if not guest:
                return jsonify({'error': 'Guest not found'}), 404
            return jsonify(serialize_doc(guest))
        elif request.method == 'PUT':
            updated_data = request.get_json()
            guests.update_one(
                {'_id': ObjectId(id)},
                {'$set': updated_data}
            )
            return jsonify(serialize_doc(guests.find_one({'_id': ObjectId(id)})))
        elif request.method == 'DELETE':
            guests.delete_one({'_id': ObjectId(id)})
            return jsonify({'message': 'Guest deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Rooms API (similar structure to guests)
@app.route('/api/rooms', methods=['GET', 'POST'])
@token_required
def handle_rooms(current_user):
    if request.method == 'GET':
        room_list = list(rooms.find())
        return jsonify([serialize_doc(room) for room in room_list])
    elif request.method == 'POST':
        room_data = request.get_json()
        result = rooms.insert_one(room_data)
        return jsonify(serialize_doc(rooms.find_one({'_id': result.inserted_id}))), 201

@app.route('/api/rooms/<id>', methods=['GET', 'PUT', 'DELETE'])
@token_required
def handle_room(current_user, id):
    try:
        if request.method == 'GET':
            room = rooms.find_one({'_id': ObjectId(id)})
            if not room:
                return jsonify({'error': 'Room not found'}), 404
            return jsonify(serialize_doc(room))
        elif request.method == 'PUT':
            updated_data = request.get_json()
            rooms.update_one(
                {'_id': ObjectId(id)},
                {'$set': updated_data}
            )
            return jsonify(serialize_doc(rooms.find_one({'_id': ObjectId(id)})))
        elif request.method == 'DELETE':
            rooms.delete_one({'_id': ObjectId(id)})
            return jsonify({'message': 'Room deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Bookings API
@app.route('/api/bookings', methods=['GET', 'POST'])
@token_required
def handle_bookings(current_user):
    if request.method == 'GET':
        booking_list = list(bookings.find())
        for booking in booking_list:
            booking['guest'] = serialize_doc(guests.find_one({'_id': ObjectId(booking['guest_id'])}))
            booking['room'] = serialize_doc(rooms.find_one({'_id': ObjectId(booking['room_id'])}))
        return jsonify([serialize_doc(booking) for booking in booking_list])
    elif request.method == 'POST':
        booking_data = request.get_json()
        booking_data['check_in'] = datetime.strptime(booking_data['check_in'], '%Y-%m-%d')
        booking_data['check_out'] = datetime.strptime(booking_data['check_out'], '%Y-%m-%d')
        result = bookings.insert_one(booking_data)
        return jsonify(serialize_doc(bookings.find_one({'_id': result.inserted_id}))), 201

@app.route('/api/bookings/<id>', methods=['GET', 'PUT', 'DELETE'])
@token_required
def handle_booking(current_user, id):
    try:
        if request.method == 'GET':
            booking = bookings.find_one({'_id': ObjectId(id)})
            if not booking:
                return jsonify({'error': 'Booking not found'}), 404
            booking['guest'] = serialize_doc(guests.find_one({'_id': ObjectId(booking['guest_id'])}))
            booking['room'] = serialize_doc(rooms.find_one({'_id': ObjectId(booking['room_id'])}))
            return jsonify(serialize_doc(booking))
        elif request.method == 'PUT':
            updated_data = request.get_json()
            if 'check_in' in updated_data:
                updated_data['check_in'] = datetime.strptime(updated_data['check_in'], '%Y-%m-%d')
            if 'check_out' in updated_data:
                updated_data['check_out'] = datetime.strptime(updated_data['check_out'], '%Y-%m-%d')
            bookings.update_one(
                {'_id': ObjectId(id)},
                {'$set': updated_data}
            )
            return jsonify(serialize_doc(bookings.find_one({'_id': ObjectId(id)})))
        elif request.method == 'DELETE':
            bookings.delete_one({'_id': ObjectId(id)})
            return jsonify({'message': 'Booking deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Health check endpoint
@app.route('/')
def index():
    return jsonify({
        'status': 'running',
        'service': 'Hotel Management API',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)  # More production-like but no auto-reload