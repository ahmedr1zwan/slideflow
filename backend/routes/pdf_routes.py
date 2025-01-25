import hashlib
from flask import Flask, Blueprint, request, jsonify, current_app
from flask_cors import CORS
import os
import PyPDF2
from werkzeug.utils import secure_filename

from utils import validate_file_path, allowed_file

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

pdf_routes = Blueprint('pdf_routes', __name__)

# Cache structure
cache = {}

@pdf_routes.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not allowed_file(file.filename, {'pdf'}):
        return jsonify({"error": "Unsupported file type. Only PDFs are allowed."}), 400
    
    filename = secure_filename(file.filename)
    upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    os.makedirs(os.path.dirname(upload_path), exist_ok=True)  # Create folder if not exists
    file.save(upload_path)
    return jsonify({"message": "File uploaded successfully", "path": upload_path}), 200

@pdf_routes.route('/analyze', methods=['POST'])
def extract_pdf_text():
    data = request.get_json()
    if not data or 'file_path' not in data:
        return jsonify({"error": "File path not provided"}), 400
    
    file_path = data['file_path']
    error = validate_file_path(file_path)
    if error:
        return error

    # Generate a unique hash for the file
    file_hash = hashlib.md5(file_path.encode()).hexdigest()

    # Check if the file is already cached
    if file_hash in cache:
        return jsonify({"message": "Text retrieved from cache", "data": cache[file_hash]}), 200

    try:
        # Extract text from the PDF and cache it
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            pages = []
            word_index = {}

            for page_number, page in enumerate(pdf_reader.pages, start=1):
                text = page.extract_text()
                pages.append(text)

                # Index words for quick search
                words = text.split()
                for word in words:
                    word_lower = word.lower()
                    if word_lower not in word_index:
                        word_index[word_lower] = set()
                    word_index[word_lower].add(page_number)

            # Save to cache
            cache[file_hash] = {
                "pages": pages,
                "word_index": {k: list(v) for k, v in word_index.items()},
            }

        return jsonify({"message": "Text extracted and cached", "data": cache[file_hash]}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to process the PDF: {str(e)}"}), 500

@pdf_routes.route('/search', methods=['POST'])
def search_word():
    data = request.get_json()
    if not data or 'file_path' not in data or 'word' not in data:
        return jsonify({"error": "File path or word not provided"}), 400
    
    file_path = data['file_path']
    word = data['word']
    file_hash = hashlib.md5(file_path.encode()).hexdigest()

    # Check if the file is cached
    if file_hash not in cache:
        return jsonify({"error": "File not found in cache. Please extract text first."}), 404

    # Search the word
    word_lower = word.lower()
    word_index = cache[file_hash]["word_index"]
    if word_lower in word_index:
        return jsonify({"word": word, "pages": word_index[word_lower]}), 200
    else:
        return jsonify({"word": word, "pages": []}), 200
