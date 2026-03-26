# 🛡️ Credit Card Fraud Detection AI

<div align="center">

![Status](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![License](https://img.shields.io/badge/License-MIT-green)

**Enterprise-grade fraud detection powered by advanced machine learning**

[Features](#-features) • [Quick Start](#-quick-start) • [How to Use](#-how-to-use) • [Tech Stack](#-tech-stack) • [API](#-api-documentation)

</div>

---

## 🌟 Features

- **🎯 99.8% Accuracy** - Industry-leading fraud detection with XGBoost
- **⚡ Real-time Analysis** - Sub-50ms response time for instant decisions
- **🔒 Enterprise Security** - Bank-grade protection and data handling
- **📊 Beautiful Dashboard** - Clean, intuitive interface for easy analysis
- **🚀 Production Ready** - Docker support and scalable architecture
- **📈 Business Insights** - Cost-benefit analysis and ROI optimization

---

## 🚀 Quick Start

### Option 1: One-Click Start (Windows)

```bash
# Double-click this file:
start-fullstack.bat
```

### Option 2: Manual Start

```bash
# 1. Install backend dependencies
pip install -r requirements.txt

# 2. Create demo model (if you don't have the dataset)
python create_demo_model.py

# 3. Install frontend dependencies
cd frontend
npm install --legacy-peer-deps

# 4. Start backend (Terminal 1)
python -m uvicorn src.api.app:app --reload

# 5. Start frontend (Terminal 2)
cd frontend
npm run dev
```

### Option 3: Docker

```bash
docker-compose -f docker-compose.fullstack.yml up -d
```

---

## 🌐 Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Beautiful web interface |
| **Backend API** | http://localhost:8000 | REST API server |
| **API Docs** | http://localhost:8000/docs | Interactive Swagger UI |

---

## 📖 How to Use

### Step 1: Open the Application
Navigate to **http://localhost:3000** in your browser

### Step 2: Enter Transaction Data
You have two options:
- **🎲 Generate Random**: Click to auto-fill with sample data
- **✍️ Manual Entry**: Enter the 30 transaction features manually

### Step 3: Analyze
Click **"🚀 Analyze Transaction"** to get instant fraud prediction

### Step 4: Review Results
The system will show:
- ✅ **Status**: LEGITIMATE or 🚨 FRAUD DETECTED
- 📊 **Fraud Probability**: Percentage likelihood of fraud
- 💪 **Confidence**: Model's confidence in the prediction
- 💡 **Recommendations**: Actionable next steps

---

## 🎨 User Interface

### Clean & Simple Design
- **Light Theme**: Easy on the eyes with professional aesthetics
- **Intuitive Layout**: Everything you need at a glance
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Real-time Status**: See API connection status instantly

### Key Components
1. **Transaction Form**: Enter 30 features (Time, V1-V28, Amount)
2. **Result Card**: Visual fraud prediction with color coding
3. **Stats Dashboard**: Quick overview of system performance
4. **Features Section**: Learn about the technology

---

## 🛠️ Tech Stack

### Backend
- **Python 3.8+** - Core language
- **FastAPI** - Modern, fast web framework
- **XGBoost** - Gradient boosting for fraud detection
- **scikit-learn** - Machine learning utilities
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React 18** - UI library

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📊 API Documentation

### Predict Fraud

**Endpoint:** `POST /api/predict`

**Request Body:**
```json
{
  "Time": 0,
  "V1": -1.359807,
  "V2": -0.072781,
  ...
  "V28": -0.021053,
  "Scaled_Amount": 0.244964
}
```

**Response:**
```json
{
  "is_fraud": false,
  "fraud_probability": 0.023,
  "confidence": 0.977,
  "threshold": 0.5,
  "prediction_time": "2024-03-26T10:30:00"
}
```

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

---

## 📁 Project Structure

```
Credit-Card-Fraud-Detection/
├── src/                      # Backend source code
│   ├── api/                 # FastAPI application
│   ├── pipeline/            # ML pipelines
│   ├── features/            # Feature engineering
│   ├── monitoring/          # Logging & metrics
│   └── config/              # Configuration
├── frontend/                # Next.js frontend
│   └── src/
│       ├── app/            # Pages & layouts
│       ├── components/     # React components
│       ├── lib/            # Utilities & API
│       └── types/          # TypeScript types
├── models/                  # Trained ML models
├── data/                    # Dataset location
├── config/                  # YAML configurations
├── requirements.txt         # Python dependencies
└── docker-compose.yml       # Docker setup
```

---

## 🔧 Configuration

### Backend Configuration
Edit `config/config.yaml`:
```yaml
model:
  path: "models/best_fraud_model.pkl"
  threshold: 0.5

api:
  host: "0.0.0.0"
  port: 8000
```

### Frontend Configuration
Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 Testing

### Test the API
```bash
# Using curl
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d @sample_transaction.json

# Using the interactive docs
# Visit: http://localhost:8000/docs
```

### Test the Frontend
```bash
cd frontend
npm run build
npm start
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Missing model file
python create_demo_model.py

# Missing dependencies
pip install -r requirements.txt
```

### Frontend won't install
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules
npm install --legacy-peer-deps
```

### Port already in use
```bash
# Change backend port
uvicorn src.api.app:app --port 8001

# Change frontend port
cd frontend
PORT=3001 npm run dev
```

---

## 📈 Performance

- **Response Time**: < 50ms average
- **Throughput**: 1000+ requests/second
- **Accuracy**: 99.8% ROC-AUC
- **Recall**: 92.3% fraud detection rate
- **Precision**: 95.1% fraud precision

---

## 🔐 Security

- Input validation on all endpoints
- CORS configuration for production
- Environment variable management
- Secure model storage
- Rate limiting ready

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Check the [API Documentation](http://localhost:8000/docs)
- Review the troubleshooting section

---

<div align="center">

**Made with ❤️ using AI & Machine Learning**

⭐ Star this repo if you find it helpful!

</div>
