import os
from flask import jsonify

def validate_file_path(file_path):
    """Validate if the file exists at the given path."""
    if not os.path.isfile(file_path):
        return jsonify({"error": f"File not found: {file_path}"}), 404
    return None

def allowed_file(filename, allowed_extensions):
    """Check if a file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

