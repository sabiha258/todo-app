# 📝 Todo App — CI/CD Pipeline

> A simple To-Do List REST API built with Node.js and Express, demonstrating a complete **CI/CD pipeline** using **GitHub Actions**. Every push to `main` automatically builds, tests, and deploys the application.

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [CI/CD Pipeline](#-cicd-pipeline)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Pipeline Stages](#-pipeline-stages-explained)
- [Errors Fixed During Implementation](#-errors-fixed-during-implementation)

---

## 🚀 About the Project

This project was built as a **DevOps assignment** to demonstrate the implementation of a real-world CI/CD pipeline. It includes:

- A fully functional **REST API** for managing to-do items
- A simple **HTML frontend** served at the root route
- **7 automated tests** covering all API endpoints
- A **2-stage GitHub Actions pipeline** that runs on every push

The pipeline ensures that only tested, working code is ever deployed — exactly how modern software teams operate.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v18 |
| Framework | Express.js v4 |
| Testing | Jest + Supertest |
| CI/CD | GitHub Actions |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
todo-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions pipeline definition
├── src/
│   ├── app.js              # Express server, routes, HTML frontend
│   └── todoService.js      # Business logic (CRUD operations)
├── tests/
│   └── todo.test.js        # Automated test suite (7 tests)
├── package.json            # Project config & npm scripts
├── .gitignore
└── README.md
```

---

## 🔄 CI/CD Pipeline

The pipeline is defined in `.github/workflows/ci-cd.yml` and is **automatically triggered** on:
- Every `push` to the `main` branch
- Every `pull request` targeting `main`

### Pipeline Flow

```
Developer pushes code to GitHub
            │
            ▼
┌─────────────────────────┐
│   Stage 1: Build & Test │  ← Runs on every push
│                         │
│  1. Checkout code       │
│  2. Setup Node.js 18    │
│  3. npm ci (install)    │
│  4. npx jest --coverage │
│  5. Upload coverage     │
└────────────┬────────────┘
             │ ✅ All tests pass
             ▼
┌─────────────────────────┐
│   Stage 2: Deploy       │  ← Only runs on main branch
│                         │
│  1. Checkout code       │
│  2. Install prod deps   │
│  3. Verify app starts   │
│  4. Confirm deployment  │
└─────────────────────────┘
            │
            ▼
     🎉 App is live!
```

### Pipeline Configuration (`.github/workflows/ci-cd.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    name: 🔧 Build & Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: 📦 Install Dependencies
        run: npm ci
      - name: 🧪 Run Tests
        run: npx jest --coverage
      - name: 📊 Upload Coverage Report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  deploy:
    name: 🚀 Deploy
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: 📦 Install Production Dependencies
        run: npm install --production
      - name: ✅ Verify App Starts
        run: |
          node src/app.js &
          sleep 3
          curl -f http://localhost:3000/ || exit 1
          kill %1
      - name: 🎉 Deployment Successful
        run: echo "App deployed successfully at commit ${{ github.sha }}"
```

---

## 🌐 API Endpoints

| Method  | Endpoint        | Description                      | Status Codes |
|---------|-----------------|----------------------------------|--------------|
| `GET`   | `/`             | Serves the HTML frontend         | 200          |
| `GET`   | `/api/todos`    | Get all to-do items              | 200          |
| `GET`   | `/api/todos/:id`| Get a single to-do by ID         | 200, 404     |
| `POST`  | `/api/todos`    | Create a new to-do item          | 201, 400     |
| `PUT`   | `/api/todos/:id`| Update a to-do (title/completed) | 200, 404     |
| `DELETE`| `/api/todos/:id`| Delete a to-do item              | 200, 404     |

### Example Request

```bash
# Create a new todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn CI/CD"}'

# Response
{
  "id": 1,
  "title": "Learn CI/CD",
  "completed": false
}
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js v18+](https://nodejs.org)
- [Git](https://git-scm.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sabiha258/todo-app.git
cd todo-app

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

The app will be running at **http://localhost:3000**

---

## 🧪 Running Tests

```bash
npm test
```

Expected output:

```
PASS  tests/todo.test.js
  GET /api/todos
    ✓ should return empty array initially
  POST /api/todos
    ✓ should create a new todo
    ✓ should reject empty title
    ✓ should reject missing title
  PUT /api/todos/:id
    ✓ should mark todo as completed
    ✓ should return 404 for non-existing todo
  DELETE /api/todos/:id
    ✓ should delete a todo
    ✓ should return 404 for non-existing todo

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

---

## 📊 Pipeline Stages Explained

### Stage 1 — Build & Test (CI)

| Step                    | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `actions/checkout@v3`   | Downloads the repository code onto the CI runner                        |
| `actions/setup-node@v3` | Installs Node.js v18 in the CI environment                              |
| `npm ci`                | Installs dependencies cleanly (faster & safer than `npm install` in CI) |
| `npx jest --coverage`   | Runs all 7 tests and generates a coverage report                        |
| `upload-artifact@v4`    | Saves the coverage report so it can be downloaded from GitHub           |

### Stage 2 — Deploy (CD)

| Step                             | Purpose                                                            |
|----------------------------------|--------------------------------------------------------------------|
| `npm install --production`       | Installs only runtime dependencies (excludes Jest, Supertest etc.) |
| `node src/app.js &`              | Starts the server in the background                                |
| `curl -f http://localhost:3000/` | Makes a real HTTP request to confirm the server is healthy         |
| `kill %1`                        | Stops the background server process after verification             |

> **Note:** The Deploy stage only runs when code is pushed to `main` — not on pull requests. This prevents unreviewed code from being deployed.

---

## 👤 Author

**sabiha258** — DevOps Assignment, 2026

---

## 📄 License

This project is licensed under the MIT License.
