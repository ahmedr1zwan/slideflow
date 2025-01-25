from flask import Flask, request, jsonify
import PyPDF2
import os
from flask_cors import CORS
from pptx import Presentation

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Define a route for the home page
@app.route('/')
def home():
    return "Welcome to the PDF Text Extractor!"

# Define the endpoint to extract text from a PDF file by path
@app.route('/pdf2txt', methods=['POST'])
def extract_text():
    data = request.get_json()
    if not data or 'file_path' not in data:
        return jsonify({"error": "File path not provided"}), 400
    
    file_path = data['file_path']
    
    if not os.path.isfile(file_path):
        return jsonify({"error": f"File not found: {file_path}"}), 404
    
    try:
        # Extract text from the PDF
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            extracted_text = ""
            for page in pdf_reader.pages:
                extracted_text += page.extract_text()
        
        return jsonify({"text": extracted_text}), 200
    
    except Exception as e:
        return jsonify({"error": f"Failed to process the PDF: {str(e)}"}), 500
    

# Define the endpoint to extract text from a PowerPoint file by path
@app.route('/pptx2txt', methods=['POST'])
def extract_pptx_text():
    data = request.get_json()
    if not data or 'file_path' not in data:
        return jsonify({"error": "File path not provided"}), 400
    
    file_path = data['file_path']
    
    if not os.path.isfile(file_path):
        return jsonify({"error": f"File not found: {file_path}"}), 404
    
    try:
        # Extract text from the PowerPoint file
        presentation = Presentation(file_path)
        pages = []
        for slide in presentation.slides:
            extracted_text = ""
            for shape in slide.shapes:
                if shape.has_text_frame:
                    extracted_text += shape.text + "\n"

            pages.append(extracted_text)
        
        return jsonify({"pages": pages}), 200
        # return jsonify({"text": "aa"}), 200
    
    except Exception as e:
        return jsonify({"error": f"Failed to process the PowerPoint file: {str(e)}"}), 500

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
