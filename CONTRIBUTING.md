# Contributing to FraudGuard ML

First off, thank you for considering contributing to FraudGuard ML! It's people like you that make this fraud detection system such a great tool.

## 🌟 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 11, Ubuntu 22.04]
 - Python Version: [e.g. 3.11]
 - Node Version: [e.g. 18.20.0]
 - Browser: [e.g. Chrome 120]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request**

## 🔧 Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fraudguard-ml.git
cd fraudguard-ml

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python train_advanced_model.py

# Run the backend
set PYTHONPATH=%CD%  # On Windows
export PYTHONPATH=$(pwd)  # On Linux/Mac
uvicorn src.api.app:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📝 Coding Standards

### Python Code Style

We follow [PEP 8](https://pep8.org/) with some modifications:

- **Line length**: 100 characters (not 79)
- **Imports**: Group by standard library, third-party, local
- **Type hints**: Use type hints for function signatures
- **Docstrings**: Use Google-style docstrings

**Example:**
```python
from typing import List, Dict, Optional
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def predict_fraud(
    transaction: Dict[str, float],
    model: RandomForestClassifier,
    threshold: float = 0.5
) -> Dict[str, any]:
    """
    Predict fraud probability for a transaction.
    
    Args:
        transaction: Dictionary containing transaction features
        model: Trained fraud detection model
        threshold: Classification threshold (default: 0.5)
        
    Returns:
        Dictionary containing prediction results
        
    Raises:
        ValueError: If transaction is missing required features
    """
    # Implementation here
    pass
```

### TypeScript/React Code Style

- **Use TypeScript** for all new code
- **Functional components** with hooks
- **Named exports** for components
- **Props interfaces** for all components
- **Tailwind CSS** for styling

**Example:**
```typescript
interface TransactionCardProps {
  transactionId: string
  riskScore: number
  timestamp: string
  onResolve?: () => void
}

export function TransactionCard({ 
  transactionId, 
  riskScore, 
  timestamp,
  onResolve 
}: TransactionCardProps) {
  const [isResolved, setIsResolved] = useState(false)
  
  return (
    <div className="glass-panel rounded-xl p-6">
      {/* Component content */}
    </div>
  )
}
```

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src tests/

# Run specific test file
pytest tests/test_models.py
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- TransactionHistory.test.tsx
```

## 📚 Documentation

- **Code comments**: Explain "why", not "what"
- **Docstrings**: Required for all public functions/classes
- **README updates**: Update if you change functionality
- **API documentation**: Update OpenAPI specs if you modify endpoints

## 🔀 Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/updates
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(api): add batch prediction endpoint

Add new endpoint for processing multiple transactions
in a single request. Supports up to 1000 transactions.

Closes #123

---

fix(frontend): resolve transaction filter bug

Transaction filters were not resetting properly when
switching between risk levels.

Fixes #456
```

## 🎯 Pull Request Process

1. **Update documentation** with details of changes
2. **Add tests** for new functionality
3. **Ensure all tests pass** before submitting
4. **Update CHANGELOG.md** with your changes
5. **Request review** from maintainers
6. **Address feedback** promptly

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] CHANGELOG.md updated

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #(issue number)
```

## 🏆 Recognition

Contributors will be recognized in:
- README.md Contributors section
- CHANGELOG.md for their contributions
- GitHub Contributors page

## 💬 Communication

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions and discussions
- **Discussions**: General questions and ideas

## 📖 Additional Resources

- [Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ❓ Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

---

**Thank you for contributing to FraudGuard ML!** 🎉

Your contributions help make fraud detection more accessible and effective for everyone.
