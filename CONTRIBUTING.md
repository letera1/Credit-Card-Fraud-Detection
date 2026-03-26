# 🤝 Contributing to FraudGuard AI

Thank you for your interest in contributing to FraudGuard AI! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your changes
4. **Make your changes** following our guidelines
5. **Test your changes** thoroughly
6. **Submit a pull request**

---

## 💻 Development Setup

### Backend Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install pytest pytest-cov black flake8 mypy

# Run tests
pytest

# Format code
black src/

# Lint code
flake8 src/
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

---

## 🎯 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Python version, etc.)

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Code Contributions

We welcome contributions in these areas:

- **Bug fixes**: Fix existing issues
- **Features**: Add new functionality
- **Documentation**: Improve docs and examples
- **Tests**: Add or improve test coverage
- **Performance**: Optimize existing code
- **UI/UX**: Enhance user interface

---

## 📝 Coding Standards

### Python (Backend)

- Follow **PEP 8** style guide
- Use **type hints** for function parameters and returns
- Write **docstrings** for all functions and classes
- Keep functions **small and focused**
- Use **meaningful variable names**

```python
def calculate_risk_score(
    fraud_probability: float,
    threshold: float = 0.5
) -> int:
    """
    Calculate risk score from fraud probability.
    
    Args:
        fraud_probability: Probability of fraud (0-1)
        threshold: Decision threshold
        
    Returns:
        Risk score (0-100)
    """
    return int(fraud_probability * 100)
```

### TypeScript (Frontend)

- Follow **TypeScript best practices**
- Use **functional components** with hooks
- Write **type-safe code** with interfaces
- Use **meaningful component names**
- Keep components **small and reusable**

```typescript
interface RiskScoreProps {
  score: number
  maxScore?: number
  label?: string
}

export default function RiskScore({ 
  score, 
  maxScore = 100, 
  label = 'Risk Score' 
}: RiskScoreProps) {
  // Component implementation
}
```

### General Guidelines

- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **SOLID**: Follow SOLID principles
- **Comments**: Write clear, helpful comments
- **Error Handling**: Handle errors gracefully
- **Security**: Never commit sensitive data

---

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src tests/

# Run specific test file
pytest tests/test_api.py

# Run specific test
pytest tests/test_api.py::test_predict_endpoint
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Writing Tests

- Write tests for **all new features**
- Maintain **high test coverage** (>80%)
- Test **edge cases** and error conditions
- Use **descriptive test names**

```python
def test_fraud_detection_with_high_risk_transaction():
    """Test fraud detection with a high-risk transaction."""
    transaction = create_high_risk_transaction()
    result = predict_fraud(transaction)
    assert result.is_fraud is True
    assert result.risk_score > 80
```

---

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Update documentation if needed
2. ✅ Add tests for new features
3. ✅ Ensure all tests pass
4. ✅ Format code properly
5. ✅ Update CHANGELOG.md
6. ✅ Rebase on latest main branch

### PR Guidelines

1. **Title**: Clear, descriptive title
   - ✅ "Add SHAP explainability to predictions"
   - ❌ "Update code"

2. **Description**: Include:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots (if UI changes)
   - Related issues

3. **Size**: Keep PRs focused and manageable
   - Prefer multiple small PRs over one large PR
   - Each PR should address one concern

4. **Commits**: Write clear commit messages
   - ✅ "feat: add SHAP explanations to API response"
   - ✅ "fix: resolve feature engineering bug"
   - ✅ "docs: update API documentation"
   - ❌ "update"

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat: add real-time fraud alerts

- Implement alert management system
- Add alert resolution endpoint
- Create FraudAlerts component
- Add auto-refresh for alerts

Closes #123
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

---

## 🏗️ Project Structure

```
fraud-detection-ai/
├── src/                    # Backend source code
│   ├── api/               # API endpoints
│   ├── features/          # Feature engineering
│   ├── monitoring/        # Logging and metrics
│   └── pipeline/          # ML pipelines
├── frontend/              # Frontend application
│   └── src/
│       ├── components/    # React components
│       ├── lib/          # Utilities
│       └── types/        # TypeScript types
├── tests/                 # Test files
├── docs/                  # Documentation
└── models/               # Trained models
```

---

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Python Style Guide (PEP 8)](https://pep8.org/)
- [React Best Practices](https://react.dev/)

---

## 💬 Communication

- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Discussions**: For questions and ideas

---

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

---

## ❓ Questions?

If you have questions about contributing, feel free to:
- Open an issue
- Start a discussion
- Contact the maintainers

---

**Thank you for contributing to FraudGuard AI! 🛡️**
