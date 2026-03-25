# Contributing Guidelines

Thank you for considering contributing to the Credit Card Fraud Detection project!

## Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/Credit-Card-Fraud-Detection.git
cd Credit-Card-Fraud-Detection
```

3. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. Install dependencies:
```bash
make install
# or
pip install -r requirements.txt
pip install -e .
```

## Development Workflow

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Run tests:
```bash
make test
```

4. Format code:
```bash
make format
```

5. Lint code:
```bash
make lint
```

6. Commit your changes:
```bash
git add .
git commit -m "feat: add your feature description"
```

7. Push to your fork:
```bash
git push origin feature/your-feature-name
```

8. Create a Pull Request

## Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Code Style

- Follow PEP 8 guidelines
- Use Black for code formatting (line length: 100)
- Use isort for import sorting
- Add type hints where appropriate
- Write docstrings for all public functions/classes

## Testing

- Write unit tests for new features
- Maintain test coverage above 80%
- Use pytest for testing
- Mock external dependencies

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Update documentation as needed
- Add tests for new functionality
- Ensure all tests pass
- Update CHANGELOG.md if applicable

## Questions?

Open an issue for any questions or concerns.
