# SlideFlow Backend

This project is a backend service for analyzing PowerPoint presentations (`.pptx`) and performing advanced searches using semantic and syntactic matching. It leverages Flask, Redis, Google Cloud Vision, and Sentence-BERT for efficient processing and searching.

---

## Prerequisites

Before starting, ensure you have the following installed:

- Python 3.8+
- Redis
- Google Cloud SDK (for Vision API)
- A virtual environment manager (e.g., `venv`, `virtualenv`)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ahmedr1zwan/slideflow.git
cd backend
```

### 2. Create and Activate a Virtual Environment

#### Create the environment:

```bash
python3 -m venv .venv
```

#### Activate the environment:

- **macOS/Linux**:
  ```bash
  source .venv/bin/activate
  ```
- **Windows**:
  ```cmd
  .venv\Scripts\activate
  ```

### 3. Install Dependencies

Install all required Python packages:

```bash
pip install -r requirements.txt
```

### 4. Start the Redis Server

Ensure that Redis is installed and running:

#### Install Redis (if not installed):

- **macOS**:
  ```bash
  brew install redis
  ```
- **Linux (Debian/Ubuntu)**:
  ```bash
  sudo apt update
  sudo apt install redis-server
  ```

#### Start Redis:

```bash
redis-server
```

#### Verify Redis is Running:

```bash
redis-cli ping
```

You should see the response:

```
PONG
```

### 5. Configure Google Cloud Vision

Set up your Google Cloud Vision API credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the Vision API.
3. Download your service account JSON key.
4. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of the JSON key:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="./secrets/famous-palisade-448915-n2-27af6b77dbce.json"
   ```

### 6. Start the Flask App

Run the Flask app:

```bash
python app.py
```

By default, the app runs on `http://127.0.0.1:5000`.

---

## API Endpoints

### 1. Upload `.pptx` File

**Endpoint**: `/upload`  
**Method**: `POST`  
**Description**: Upload a `.pptx` file for analysis.

---

### 2. Analyze Content

**Endpoint**: `/analyze`  
**Method**: `POST`  
**Description**: Process a `.pptx` file to extract and analyze its content.

---

### 3. Search for a Phrase

**Endpoint**: `/search`  
**Method**: `POST`  
**Description**: Search for a phrase in the analyzed `.pptx` files.

---

## Troubleshooting

### Common Issues

- **Redis Connection Refused**:
  Ensure Redis is installed and running on `localhost:6379`. See the [Start Redis Server](#4-start-the-redis-server) section.
- **Google Cloud Vision Credentials Not Found**:
  Verify that the `GOOGLE_APPLICATION_CREDENTIALS` environment variable is correctly set.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
