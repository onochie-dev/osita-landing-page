# Osita — CBAM Filing Engine

<p align="center">
  <img src="frontend/public/osita-icon.svg" width="80" alt="Osita Logo">
</p>

**Osita** is a CBAM (Carbon Border Adjustment Mechanism) filing engine that streamlines the process of reporting indirect emissions from electricity. Upload energy bills, extract data automatically using AI, review and validate, then export to Excel and XML formats compliant with the CBAM transitional registry.

## ✨ Features

- **📄 PDF Upload & Processing** — Drag-and-drop energy bill PDFs (any format, any quality)
- **🤖 AI-Powered Extraction** — Mistral OCR + OpenAI structured extraction
- **🌍 Multilingual Support** — English, French, Arabic (with RTL rendering)
- **✅ Validation Engine** — Unit consistency, totals reconciliation, completeness checks
- **📊 Review Interface** — Edit extracted values with full audit trail
- **📁 Export Options** — Excel workbook, CBAM-compliant XML, ZIP package

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- API Keys (place in `.env`):
  - OpenAI API Key
  - Mistral AI API Key

### Setup

1. **Clone and configure environment**

```bash
cd /Users/Uju/Desktop/OSITA2

# Copy environment template and add your API keys
cp env.template .env
# Edit .env with your actual API keys
```

2. **Install Backend Dependencies**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
python run.py
```
Backend runs at: http://localhost:8000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

### API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📂 Project Structure

```
OSITA2/
├── backend/
│   ├── app/
│   │   ├── api/            # API routes (projects, documents, exports)
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Business logic (OCR, extraction, validation)
│   │   ├── config.py       # Environment configuration
│   │   ├── database.py     # Database setup
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
├── env.template            # Environment variables template
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for extraction | Required |
| `MISTRAL_API_KEY` | Mistral AI API key for OCR | Required |
| `DATABASE_URL` | SQLite database URL | `sqlite:///./osita.db` |
| `UPLOAD_DIR` | Directory for uploaded files | `./uploads` |
| `SECRET_KEY` | Application secret key | Dev default |

### Mock Mode

If API keys are not configured, the application runs in **mock mode** with simulated OCR and extraction results. This is useful for development and testing.

## 📋 User Workflow

1. **Create Project** — Set reporting period, declarant info, emission factor source
2. **Upload Documents** — Drag-and-drop PDF energy bills
3. **Automatic Processing** — OCR → Extraction → Validation
4. **Review & Edit** — Confirm or correct extracted values
5. **Validate** — Check for blocking issues
6. **Export** — Download Excel, XML, or ZIP package

## 🏗️ Technical Stack

### Backend
- **FastAPI** — Modern Python web framework
- **SQLAlchemy** — ORM for database operations
- **Pydantic** — Data validation and settings
- **Mistral AI** — OCR processing
- **OpenAI** — Structured data extraction
- **lxml** — XML generation (CBAM schema)
- **openpyxl** — Excel generation

### Frontend
- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **TanStack Query** — Data fetching and caching
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Lucide React** — Icons

## 📊 CBAM Compliance

Osita generates XML files conforming to the CBAM quarterly report XSD schema. The export includes:

- Reporting period and year
- Declarant information
- Installation details
- Electricity consumption (MWh)
- Indirect emissions (tCO₂)
- Emission factor source and value

## 🔒 Security Notes

- All files are stored locally
- HTTPS recommended for production
- Environment variables for sensitive data
- CORS configured for development

## 📝 License

MIT License

---

**Built for CBAM transitional reporting** | Osita v0.1.0

