import hashlib
from flask import Flask, Blueprint, request, jsonify, current_app
from flask_cors import CORS
import os
import PyPDF2
from werkzeug.utils import secure_filename
import redis
from google.cloud import vision
import hashlib
import json
import fitz  # PyMuPDF for extracting images from PDF
from fuzzywuzzy import fuzz  # Add fuzzy matching support
from sentence_transformers import SentenceTransformer, util
from utils import validate_file_path, allowed_file

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

pdf_routes = Blueprint('pdf_routes', __name__)

# Initialize Redis client
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

# Initialize Google Vision client
vision_client = vision.ImageAnnotatorClient()

# Load Sentence-BERT model
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')

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
def analyze_pdf_content():
    data = request.get_json()
    if not data or 'file_path' not in data:
        return jsonify({"error": "File path not provided"}), 400

    file_path = data['file_path']
    error = validate_file_path(file_path)
    if error:
        return error

    # Generate a unique hash for the file
    file_hash = hashlib.md5(file_path.encode()).hexdigest()

    try:
        # Check if the file is already cached in Redis
        cached_data = redis_client.get(file_hash)
        if cached_data:
            return jsonify({"message": "Data retrieved from Redis cache", "data": json.loads(cached_data)}), 200

        # Extract and analyze content from the PDF file
        pdf_document = fitz.open(file_path)
        pages_data = []

        for page_number in range(len(pdf_document)):
            page = pdf_document[page_number]
            page_text = page.get_text()
            image_analysis = []

            # Extract images from the page
            for img_index, img in enumerate(page.get_images(full=True), start=1):
                xref = img[0]
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                image_filename = f"page_{page_number + 1}_image_{img_index}.{image_ext}"
                image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)

                # Save the image
                with open(image_path, "wb") as img_file:
                    img_file.write(image_bytes)

                # Perform analysis using Vision API
                with open(image_path, "rb") as img_file:
                    content = img_file.read()
                    image = vision.Image(content=content)
                    response = vision_client.annotate_image({
                        "image": image,
                        "features": [
                            {"type": vision.Feature.Type.TEXT_DETECTION},
                            {"type": vision.Feature.Type.LABEL_DETECTION},
                            {"type": vision.Feature.Type.OBJECT_LOCALIZATION},
                            {"type": vision.Feature.Type.SAFE_SEARCH_DETECTION},
                            {"type": vision.Feature.Type.LOGO_DETECTION}
                        ],
                    })

                # Extract analysis results
                text = response.text_annotations[0].description if response.text_annotations else ""
                labels = [label.description for label in response.label_annotations]
                objects = [
                    {
                        "name": obj.name,
                        "bounding_poly": [
                            {"x": vertex.x, "y": vertex.y}
                            for vertex in obj.bounding_poly.normalized_vertices
                        ]
                    }
                    for obj in response.localized_object_annotations
                ]
                safe_search = {
                    "adult": response.safe_search_annotation.adult,
                    "violence": response.safe_search_annotation.violence,
                    "racy": response.safe_search_annotation.racy,
                }
                logos = [logo.description for logo in response.logo_annotations]

                image_analysis.append({
                    "text": text,
                    "labels": labels,
                    "objects": objects,
                    "safe_search": safe_search,
                    "logos": logos
                })

            pages_data.append({
                "page_number": page_number + 1,
                "page_text": page_text.strip(),
                "image_analysis": image_analysis
            })

        # Cache the results in Redis
        redis_client.set(file_hash, json.dumps({
            "file_name": os.path.basename(file_path),
            "pages": pages_data
        }))

        return jsonify({"message": "Content analyzed and cached", "data": pages_data}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to process the PDF: {str(e)}"}), 500


@pdf_routes.route('/search', methods=['POST'])
def search_pdf_phrase():
    search_all = request.args.get('searchAll', 'false').lower() == 'true'  # Check if searchAll is true
    data = request.get_json()

    if not data or 'phrase' not in data:
        return jsonify({"error": "Phrase not provided"}), 400

    phrase = data['phrase']
    phrase_embedding = sbert_model.encode(phrase)  # Encode the phrase for semantic matching
    semantic_threshold = 0.6  # Minimum threshold for semantic similarity
    fuzzy_threshold = 80  # Minimum threshold for fuzzy matching
    matching_results = []

    try:
        if search_all:
            # Retrieve all cached keys from Redis
            keys = redis_client.keys()
        else:
            # Search within a specific file
            if 'file_path' not in data:
                return jsonify({"error": "file_path must be provided if searchAll is false"}), 400

            file_path = data['file_path']
            file_hash = hashlib.md5(file_path.encode()).hexdigest()

            if not redis_client.exists(file_hash):
                return jsonify({"error": f"File '{file_path}' not found in Redis cache. Please analyze it first."}), 404

            keys = [file_hash]

        # Perform the search
        for key in keys:
            # Retrieve cached file data from Redis
            cached_data = redis_client.get(key)
            if not cached_data:
                continue
            file_data = json.loads(cached_data)  # Parse JSON string into Python dictionary

            file_name = file_data['file_name']
            pages = file_data['pages']
            image_analysis = file_data.get('image_analysis', [])

            for page in pages:
                page_number = page["page_number"]
                page_text = page["page_text"]  # Extract text from the dictionary

                # Syntactic similarity (fuzzy matching)
                fuzzy_score = fuzz.partial_ratio(phrase.lower(), page_text.lower())

                # Semantic similarity (cosine similarity with embeddings)
                page_embedding = sbert_model.encode(page_text)
                semantic_similarity = util.cos_sim(phrase_embedding, page_embedding).item()

                # Combine scores (weighted average)
                combined_score = 0.7 * semantic_similarity + 0.3 * (fuzzy_score / 100)

                if combined_score >= semantic_threshold:
                    matching_results.append({
                        "file_name": file_name,
                        "page_number": page_number,
                        "match_type": "text",
                        "syntactic_score": fuzzy_score,
                        "semantic_similarity": semantic_similarity,
                        "combined_score": combined_score
                    })

            # Check image metadata
            for image in image_analysis:
                labels = image['labels']
                image_text = image['text']

                # Syntactic and semantic similarity in image text
                if image_text.strip():
                    image_text_embedding = sbert_model.encode(image_text)
                    image_semantic_similarity = util.cos_sim(phrase_embedding, image_text_embedding).item()
                    image_fuzzy_score = fuzz.partial_ratio(phrase.lower(), image_text.lower())
                    image_combined_score = 0.7 * image_semantic_similarity + 0.3 * (image_fuzzy_score / 100)

                    if image_combined_score >= semantic_threshold:
                        matching_results.append({
                            "file_name": file_name,
                            "match_type": "image_text",
                            "syntactic_score": image_fuzzy_score,
                            "semantic_similarity": image_semantic_similarity,
                            "combined_score": image_combined_score
                        })

                # Syntactic and semantic similarity in image labels
                for label in labels:
                    label_embedding = sbert_model.encode(label)
                    label_semantic_similarity = util.cos_sim(phrase_embedding, label_embedding).item()
                    label_fuzzy_score = fuzz.partial_ratio(phrase.lower(), label.lower())
                    label_combined_score = 0.7 * label_semantic_similarity + 0.3 * (label_fuzzy_score / 100)

                    if label_combined_score >= semantic_threshold:
                        matching_results.append({
                            "file_name": file_name,
                            "match_type": "image_label",
                            "syntactic_score": label_fuzzy_score,
                            "semantic_similarity": label_semantic_similarity,
                            "combined_score": label_combined_score
                        })

        # Sort results by combined score in descending order
        matching_results.sort(key=lambda x: x['combined_score'], reverse=True)

        return jsonify({
            "message": f"Phrase '{phrase}' search results:",
            "results": matching_results
        }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred during search: {str(e)}"}), 500

