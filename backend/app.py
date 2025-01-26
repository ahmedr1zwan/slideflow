from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
from pptx import Presentation
from routes.pdf_routes import pdf_routes
from routes.pptx_routes import pptx_routes

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

app.config['UPLOAD_FOLDER'] = './files/'  # Directory for uploaded files
# Register Blueprints
app.register_blueprint(pdf_routes, url_prefix='/pdf')
app.register_blueprint(pptx_routes, url_prefix='/pptx')

# Define a route for the home page
@app.route('/')
def home():
    return "Welcome to the PDF Text Extractor!"
    
# Run the app
if __name__ == "__main__":
    app.run(debug=True)
