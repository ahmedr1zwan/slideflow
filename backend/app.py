from flask import Flask, request, jsonify
import PyPDF2
import os

# Initialize the Flask app
app = Flask(__name__)

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

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
