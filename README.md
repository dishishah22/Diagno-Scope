# 🏥 Diagno-Scope (Diagno-Sight)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9%2B-blue.svg)
![React](https://img.shields.io/badge/react-18.x-cyan.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-green.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)

An AI-powered medical image diagnosis system designed for automated disease detection from medical imaging such as X-rays, MRIs, and CT scans. Diagno-Scope provides deep learning-based classification, visual explanations (e.g., Grad-CAM), and comprehensive diagnostic report generation to assist medical professionals.

---

## ✨ Features

- **Automated Detection:** High-accuracy disease detection from various medical scans (X-ray, MRI, CT).
- **Visual Explanations:** Highlights critical areas in images using interpretation techniques (like Grad-CAM) to explain the model's predictions.
- **Diagnostic Reports:** Automatically generates detailed, exportable reports based on findings.
- **Modern User Interface:** A fast, responsive, and intuitive dashboard built with React and Tailwind CSS.
- **High-Performance API:** Built with FastAPI for lightning-fast inference and data processing.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python, FastAPI
- **Machine Learning:** TensorFlow, Keras, OpenCV
- **Deployment & DevOps:** Docker, Docker Compose, Vercel (Frontend), Render (Backend)

## 📂 Project Structure

```text
Diagno-Scope/
├── backend/                # FastAPI backend application
│   ├── app/                # Main application code (api, core, models, schemas, services, utils)
│   ├── Dockerfile          # Backend containerization
│   └── requirements.txt    # Python dependencies
├── frontend/               # React + Vite frontend application
│   ├── src/                # UI components, pages, services, and utilities
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.js      # Vite configuration
├── ml/                     # Machine learning models and workflows
│   ├── notebooks/          # Jupyter notebooks for data exploration and testing
│   └── training/           # Scripts for model training and evaluation
├── deployment/             # Cloud deployment configurations
│   ├── render.yaml         # Render configuration for backend
│   └── vercel.json         # Vercel configuration for frontend
├── docs/                   # Additional documentation
├── reports/                # Generated medical reports output directory
├── docker-compose.yml      # Orchestration for local multi-container development
└── README.md               # Main project documentation
```

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Docker & Docker Compose (optional, for containerized run)

### 1. Clone the repository

```bash
git clone https://github.com/dishishah22/Diagno-Scope.git
cd Diagno-Scope
```

### 2. Frontend Setup (React + Vite)

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will typically run at `http://localhost:5173`.

### 3. Backend Setup (FastAPI)

Open a new terminal and navigate to the `backend` directory:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI development server
uvicorn app.main:app --reload
```

The backend API will run at `http://localhost:8000`. You can access the interactive Swagger documentation at `http://localhost:8000/docs`.

### 4. Running with Docker (Alternative)

If you prefer to run the entire stack (Frontend + Backend) using Docker, simply run:

```bash
# Build and start the containers
docker-compose up --build
```

## 🧠 Machine Learning & Model Training

To retrain the models or explore the data, navigate to the `ml` folder. The `notebooks` directory contains interactive Jupyter notebooks, while the `training` directory contains python scripts for automated training pipelines.

```bash
cd ml
pip install notebook tensorflow
jupyter notebook
```

## 🌐 Deployment

- The **frontend** is configured for deployment on [Vercel](https://vercel.com/) via the `deployment/vercel.json` config.
- The **backend** is configured for deployment on [Render](https://render.com/) via the `deployment/render.yaml` config.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
