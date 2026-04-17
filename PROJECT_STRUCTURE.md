# 📁 Project Structure

Complete overview of the FraudGuard ML project organization.

## 🗂️ Directory Tree

```
Credit-Card-Fraud-Detection/
│
├── 📄 Documentation Files
│   ├── README.md                      # Main project documentation
│   ├── CONTRIBUTING.md                # Contribution guidelines
│   ├── CONTRIBUTORS.md                # List of contributors
│   ├── AUTHORS.md                     # Project authors
│   ├── CHANGELOG.md                   # Version history
│   ├── SECURITY.md                    # Security policy
│   ├── LICENSE                        # MIT License
│   ├── DEPLOYMENT_GUIDE.md            # Deployment instructions
│   ├── DOCKER_GUIDE.md                # Docker usage guide
│   ├── ENHANCEMENTS_SUMMARY.md        # Feature improvements
│   ├── SYSTEM_COMPLETE.md             # System completion summary
│   ├── FINAL_UI_UPDATES.md            # UI update documentation
│   └── PROJECT_STRUCTURE.md           # This file
│
├── 🐍 Backend (Python/FastAPI)
│   ├── src/
│   │   ├── api/                       # API endpoints
│   │   │   ├── app.py                 # Main FastAPI application
│   │   │   ├── advanced_endpoints.py  # Advanced API routes
│   │   │   └── __init__.py
│   │   │
│   │   ├── pipeline/                  # ML pipelines
│   │   │   ├── training_pipeline.py   # Model training
│   │   │   ├── inference_pipeline.py  # Prediction inference
│   │   │   └── __init__.py
│   │   │
│   │   ├── features/                  # Feature engineering
│   │   │   ├── feature_engineer.py    # Feature transformations
│   │   │   └── __init__.py
│   │   │
│   │   ├── monitoring/                # System monitoring
│   │   │   ├── logger.py              # Logging configuration
│   │   │   ├── metrics_tracker.py     # Metrics collection
│   │   │   ├── model_monitor.py       # Model performance
│   │   │   └── __init__.py
│   │   │
│   │   ├── config/                    # Configuration
│   │   │   ├── config_manager.py      # Config management
│   │   │   └── __init__.py
│   │   │
│   │   ├── data_loader.py             # Data loading utilities
│   │   ├── evaluation.py              # Model evaluation
│   │   ├── explainability.py          # SHAP explanations
│   │   ├── models.py                  # Model definitions
│   │   ├── preprocessing.py           # Data preprocessing
│   │   ├── sampling.py                # Data sampling
│   │   ├── utils.py                   # Utility functions
│   │   └── __init__.py
│   │
│   ├── core/                          # Core utilities
│   │   ├── config.py                  # Core configuration
│   │   ├── logging.py                 # Logging setup
│   │   └── __init__.py
│   │
│   ├── apis/                          # API wrappers
│   │   ├── fraud_detection/
│   │   │   ├── app.py                 # Fraud detection API
│   │   │   └── __init__.py
│   │   └── __init__.py
│   │
│   ├── pipelines/                     # Pipeline definitions
│   │   └── __init__.py
│   │
│   ├── scripts/                       # Utility scripts
│   │   └── __init__.py
│   │
│   ├── experiments/                   # ML experiments
│   │   └── __init__.py
│   │
│   └── tests/                         # Test suite
│       └── __init__.py
│
├── ⚛️ Frontend (Next.js/React/TypeScript)
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/                   # Next.js App Router
│   │   │   │   ├── page.tsx           # Main page
│   │   │   │   ├── layout.tsx         # Root layout
│   │   │   │   └── globals.css        # Global styles
│   │   │   │
│   │   │   ├── components/            # React components
│   │   │   │   ├── AdvancedAnalytics.tsx      # Analytics dashboard
│   │   │   │   ├── AnalyticsDashboard.tsx     # Metrics overview
│   │   │   │   ├── BatchProcessing.tsx        # Batch upload
│   │   │   │   ├── FraudAlerts.tsx            # Alert management
│   │   │   │   ├── FraudDistributionChart.tsx # Distribution viz
│   │   │   │   ├── Header.tsx                 # App header
│   │   │   │   ├── ModelInfo.tsx              # Model artifacts
│   │   │   │   ├── ModelPerformance.tsx       # Performance metrics
│   │   │   │   ├── PredictionForm.tsx         # Prediction input
│   │   │   │   ├── ResultCard.tsx             # Result display
│   │   │   │   ├── RiskScoreCard.tsx          # Risk score widget
│   │   │   │   ├── Settings.tsx               # Configuration
│   │   │   │   ├── Sidebar.tsx                # Navigation
│   │   │   │   └── TransactionHistory.tsx     # Transaction logs
│   │   │   │
│   │   │   ├── contexts/              # React contexts
│   │   │   │   └── ThemeContext.tsx   # Theme provider
│   │   │   │
│   │   │   ├── lib/                   # Utilities
│   │   │   │   └── api.ts             # API client
│   │   │   │
│   │   │   └── types/                 # TypeScript types
│   │   │       └── index.ts           # Type definitions
│   │   │
│   │   ├── public/                    # Static assets
│   │   ├── .next/                     # Next.js build output
│   │   ├── node_modules/              # Dependencies
│   │   ├── package.json               # Node dependencies
│   │   ├── package-lock.json          # Lockfile
│   │   ├── tsconfig.json              # TypeScript config
│   │   ├── next.config.js             # Next.js config
│   │   ├── tailwind.config.ts         # Tailwind config
│   │   ├── postcss.config.js          # PostCSS config
│   │   ├── .eslintrc.json             # ESLint config
│   │   ├── .env.example               # Environment template
│   │   ├── .gitignore                 # Git ignore rules
│   │   ├── .dockerignore              # Docker ignore rules
│   │   └── Dockerfile                 # Frontend container
│
├── 🤖 ML Artifacts
│   ├── models/                        # Trained models
│   │   ├── best_fraud_model.pkl       # Best single model
│   │   ├── ensemble_models.pkl        # Ensemble models
│   │   ├── feature_names.pkl          # Feature schema
│   │   ├── amount_scaler.pkl          # Amount scaler
│   │   └── .gitkeep
│   │
│   ├── artifacts/                     # Training artifacts
│   │   ├── models/
│   │   │   └── .gitkeep
│   │   └── preprocessors/
│   │       └── .gitkeep
│   │
│   └── reports/                       # Evaluation reports
│       └── model_report.json          # Training metrics
│
├── 📊 Data
│   ├── data/                          # Datasets
│   │   ├── creditcard_advanced.csv    # Training data
│   │   └── .gitkeep
│   │
│   └── test_data/                     # Test transactions
│       ├── legitimate_transaction.json
│       ├── moderate_risk_transaction.json
│       ├── fraud_transaction.json
│       ├── high_risk_fraud.json
│       ├── batch_sample.json
│       └── README.md
│
├── ⚙️ Configuration
│   ├── config/                        # Config files
│   │   └── config.yaml                # Main configuration
│   │
│   ├── .env.example                   # Environment template
│   ├── .gitignore                     # Git ignore rules
│   └── .dockerignore                  # Docker ignore rules
│
├── 🐳 DevOps
│   ├── .github/                       # GitHub configuration
│   │   ├── workflows/
│   │   │   └── ci-cd.yml              # CI/CD pipeline
│   │   ├── ISSUE_TEMPLATE/
│   │   │   ├── bug_report.md          # Bug report template
│   │   │   └── feature_request.md     # Feature request template
│   │   ├── PULL_REQUEST_TEMPLATE.md   # PR template
│   │   └── FUNDING.yml                # Funding configuration
│   │
│   ├── Dockerfile                     # Backend container
│   ├── docker-compose.yml             # Development compose
│   ├── docker-compose.prod.yml        # Production compose
│   └── Makefile                       # Build automation
│
├── 📝 Logs
│   └── logs/                          # Application logs
│       └── api_20260404.log
│
├── 🔧 Build & Dependencies
│   ├── requirements.txt               # Python dependencies
│   ├── train_advanced_model.py        # Model training script
│   └── .vscode/                       # VS Code settings
│
└── 📜 Root Files
    ├── LICENSE                        # MIT License
    └── README.md                      # Main documentation
```

## 📊 File Count by Type

| Type | Count | Purpose |
|------|-------|---------|
| Python (`.py`) | 30+ | Backend logic, ML pipeline |
| TypeScript (`.tsx`, `.ts`) | 20+ | Frontend components, types |
| Markdown (`.md`) | 15+ | Documentation |
| JSON (`.json`) | 10+ | Config, test data, reports |
| YAML (`.yml`, `.yaml`) | 3 | CI/CD, configuration |
| Docker | 3 | Containerization |
| Config | 10+ | Various configurations |

## 🎯 Key Directories Explained

### `/src` - Backend Core
Contains all Python backend code including API endpoints, ML pipelines, feature engineering, and monitoring.

### `/frontend` - Frontend Application
Next.js 15 application with React components, TypeScript types, and Tailwind CSS styling.

### `/models` - ML Artifacts
Serialized machine learning models and preprocessing artifacts.

### `/data` - Datasets
Training data and test transaction samples.

### `/test_data` - Test Transactions
Pre-configured test transactions for all 4 risk levels.

### `/.github` - GitHub Configuration
CI/CD workflows, issue templates, and PR templates.

### `/config` - Configuration
Application configuration files.

### `/logs` - Application Logs
Runtime logs from the API server.

## 📦 Dependencies

### Backend (Python)
- **Core**: FastAPI, Uvicorn, Pydantic
- **ML**: scikit-learn, XGBoost, LightGBM, imbalanced-learn
- **Data**: pandas, numpy
- **Explainability**: SHAP
- **Utilities**: python-dotenv, joblib

### Frontend (Node.js)
- **Framework**: Next.js 15, React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP**: Axios
- **Linting**: ESLint

## 🔄 Data Flow

```
User Input (Frontend)
    ↓
API Request (HTTP)
    ↓
FastAPI Endpoint
    ↓
Inference Pipeline
    ↓
Feature Engineering
    ↓
Ensemble Models
    ↓
Risk Classification
    ↓
SHAP Explanation
    ↓
API Response (JSON)
    ↓
Frontend Display
```

## 🏗️ Build Artifacts

### Generated During Build
- `/frontend/.next/` - Next.js build output
- `/frontend/node_modules/` - Node dependencies
- `/__pycache__/` - Python bytecode
- `/models/*.pkl` - Trained models (after training)

### Ignored by Git
- `.env` - Environment variables
- `*.pyc` - Python bytecode
- `node_modules/` - Node dependencies
- `.next/` - Next.js build
- `*.log` - Log files
- `__pycache__/` - Python cache

## 📈 Code Statistics

### Lines of Code (Approximate)
- Python: ~5,000 lines
- TypeScript/TSX: ~4,000 lines
- Configuration: ~500 lines
- Documentation: ~3,000 lines
- **Total**: ~12,500 lines

### Component Breakdown
- Backend API: 25%
- ML Pipeline: 20%
- Frontend Components: 30%
- Documentation: 20%
- Configuration: 5%

## 🎨 Design Patterns

### Backend
- **Repository Pattern**: Data access abstraction
- **Pipeline Pattern**: ML workflow orchestration
- **Dependency Injection**: FastAPI dependencies
- **Factory Pattern**: Model creation

### Frontend
- **Component Pattern**: Reusable UI components
- **Container/Presenter**: Logic/UI separation
- **Context API**: Global state management
- **Custom Hooks**: Reusable logic

## 🔐 Security Considerations

### Sensitive Files (Never Commit)
- `.env` - Environment variables
- `*.pkl` - May contain sensitive data
- `*.log` - May contain PII
- `credentials.json` - API keys

### Protected Directories
- `/models/` - Model artifacts
- `/data/` - Training data
- `/logs/` - Application logs

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main project documentation |
| CONTRIBUTING.md | Contribution guidelines |
| CHANGELOG.md | Version history |
| SECURITY.md | Security policy |
| DEPLOYMENT_GUIDE.md | Deployment instructions |
| DOCKER_GUIDE.md | Docker usage |
| AUTHORS.md | Project authors |
| CONTRIBUTORS.md | Contributor list |

## 🚀 Getting Started

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/fraudguard-ml.git
   ```

2. **Backend Setup**
   ```bash
   pip install -r requirements.txt
   python train_advanced_model.py
   uvicorn src.api.app:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Docker Setup**
   ```bash
   docker compose up -d --build
   ```

## 📞 Support

For questions about the project structure:
- 📖 Read the [README](README.md)
- 💬 Open a [Discussion](https://github.com/yourusername/fraudguard-ml/discussions)
- 🐛 Report an [Issue](https://github.com/yourusername/fraudguard-ml/issues)

---

**Last Updated**: April 17, 2026

**Project Version**: 3.0.0
