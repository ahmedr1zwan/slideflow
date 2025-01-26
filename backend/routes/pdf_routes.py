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
import re
from itertools import islice

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


def generate_ngrams(words, n):
    """Generate n-grams from a list of words."""
    return [' '.join(words[i:i + n]) for i in range(len(words) - n + 1)]

@pdf_routes.route('/search', methods=['POST'])
def search_pdf_phrase():
    search_all = request.args.get('searchAll', 'false').lower() == 'true'
    data = request.get_json()

    if not data or 'phrase' not in data:
        return jsonify({"error": "Phrase not provided"}), 400

    # Preprocess the phrase to remove specific patterns
    phrase = data['phrase']
    patterns_to_remove = [r'\bsearch for\b', r'\bto the slide with\b', r'\bto the slide titled\b']
    for pattern in patterns_to_remove:
        phrase = re.sub(pattern, '', phrase, flags=re.IGNORECASE).strip()

    phrase_embedding = sbert_model.encode(phrase)  # Encode phrase for semantic matching
    semantic_threshold = 0.6  # Adjust as needed for stricter or looser matches

    try:
        if search_all:
            keys = redis_client.keys()
        else:
            if 'file_path' not in data:
                return jsonify({"error": "file_path must be provided if searchAll is false"}), 400

            file_path = data['file_path']
            file_hash = hashlib.md5(file_path.encode()).hexdigest()

            if not redis_client.exists(file_hash):
                return jsonify({"error": f"File '{file_path}' not found in Redis cache. Please analyze it first."}), 404

            keys = [file_hash]

        for key in keys:
            cached_data = redis_client.get(key)
            if not cached_data:
                continue
            file_data = json.loads(cached_data)
            file_name = file_data['file_name']
            pages = file_data['pages']

            for page in pages:
                page_number = page["page_number"]
                page_text = page["page_text"]
                image_analysis = page["image_analysis"]

                # Tokenize text and generate n-grams
                words = re.findall(r'\b\w+\b', page_text)
                ngrams = generate_ngrams(words, 3) + words  # Include n-grams and single words

                # Match against textual content
                for chunk in ngrams:
                    fuzzy_score = fuzz.partial_ratio(phrase.lower(), chunk.lower())
                    chunk_embedding = sbert_model.encode(chunk)
                    semantic_similarity = util.cos_sim(phrase_embedding, chunk_embedding).item()

                    combined_score = 0.85 * semantic_similarity + 0.15 * (fuzzy_score / 100)
                    if combined_score >= semantic_threshold:
                        return jsonify({
                            "message": f"Phrase '{phrase}' found.",
                            "result": {
                                "file_name": file_name,
                                "page_number": page_number,
                                "match_type": "text",
                                "matched_chunk": chunk,
                                "syntactic_score": fuzzy_score,
                                "semantic_similarity": semantic_similarity,
                                "combined_score": combined_score
                            }
                        }), 200

                # Match against image analysis metadata
                for analysis in image_analysis:
                    # Labels
                    for label in analysis["labels"]:
                        label_embedding = sbert_model.encode(label)
                        label_similarity = util.cos_sim(phrase_embedding, label_embedding).item()
                        label_fuzzy = fuzz.partial_ratio(phrase.lower(), label.lower())
                        label_score = 0.85 * label_similarity + 0.15 * (label_fuzzy / 100)
                        if label_score >= semantic_threshold:
                            return jsonify({
                                "message": f"Phrase '{phrase}' found.",
                                "result": {
                                    "file_name": file_name,
                                    "page_number": page_number,
                                    "match_type": "label",
                                    "matched_label": label,
                                    "syntactic_score": label_fuzzy,
                                    "semantic_similarity": label_similarity,
                                    "combined_score": label_score
                                }
                            }), 200

                    # Logos
                    for logo in analysis["logos"]:
                        logo_embedding = sbert_model.encode(logo)
                        logo_similarity = util.cos_sim(phrase_embedding, logo_embedding).item()
                        logo_fuzzy = fuzz.partial_ratio(phrase.lower(), logo.lower())
                        logo_score = 0.85 * logo_similarity + 0.15 * (logo_fuzzy / 100)
                        if logo_score >= semantic_threshold:
                            return jsonify({
                                "message": f"Phrase '{phrase}' found.",
                                "result": {
                                    "file_name": file_name,
                                    "page_number": page_number,
                                    "match_type": "logo",
                                    "matched_logo": logo,
                                    "syntactic_score": logo_fuzzy,
                                    "semantic_similarity": logo_similarity,
                                    "combined_score": logo_score
                                }
                            }), 200

                    # Safe search annotations
                    for key, value in analysis["safe_search"].items():
                        if key in ["adult", "violence", "racy"] and str(value) in phrase.lower():
                            return jsonify({
                                "message": f"Phrase '{phrase}' found.",
                                "result": {
                                    "file_name": file_name,
                                    "page_number": page_number,
                                    "match_type": "safe_search",
                                    "matched_metadata": {key: value},
                                    "combined_score": 1.0  # Metadata match, assume max accuracy
                                }
                            }), 200

        return jsonify({"message": f"Phrase '{phrase}' not found in any document."}), 404

    except Exception as e:
        return jsonify({"error": f"An error occurred during search: {str(e)}"}), 500