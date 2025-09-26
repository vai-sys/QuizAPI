# Quiz API

A comprehensive backend service for managing quizzes, questions, and submissions with detailed scoring and result generation.

## Features

- **Multiple Question Types**: Single-correct MCQs, Multiple-correct MCQs, and Text-based questions
- **Smart Scoring**: Automatic scoring with detailed result generation
- **RESTful API**: Clean and intuitive API endpoints
- **Data Validation**: Robust input validation and error handling
- **MongoDB Integration**: Efficient data storage with Mongoose ODM

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Question Types](#question-types)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Key Features & Assumptions](#key-features--assumptions)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vai-sys/QuizAPI.git
   cd QuizAPI
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/quiz-api
   # For MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz-api
   ```

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   # or
   nodemon index.js
   
   # Production mode
   npm start
   # or
   node index.js
   ```

5. **Verify setup**
   
   Server will be running at `http://localhost:3000`

## API Endpoints

### Quiz Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quiz` | Create a new quiz |
| `GET` | `/api/quiz` | Get all quizzes |
| `GET` | `/api/quiz/:quizId` | Get a specific quiz |
| `GET` | `/api/quiz/:quizId/questions` | Get all questions for a quiz |
| `POST` | `/api/quiz/:quizId/submit` | Submit answers for a quiz |
| `DELETE` | `/api/quiz/:quizId` | Delete a quiz |

### Question Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quiz/:quizId/questions` | Add a question to a quiz |
| `GET` | `/api/question/:questionId` | Get a specific question |
| `PUT` | `/api/question/:questionId` | Update a question |
| `DELETE` | `/api/question/:questionId` | Delete a question |

## Question Types

### 1. Single-Correct MCQ
```json
{
  "text": "What is the capital of France?",
  "type": "single",
  "marks": 2,
  "hint": "City of Love",
  "options": [
    { "text": "Paris", "isCorrect": true },
    { "text": "London", "isCorrect": false },
    { "text": "Berlin", "isCorrect": false },
    { "text": "Madrid", "isCorrect": false }
  ]
}
```

### 2. Multiple-Correct MCQ
```json
{
  "text": "Which of the following are programming languages?",
  "type": "multiple",
  "marks": 3,
  "options": [
    { "text": "JavaScript", "isCorrect": true },
    { "text": "Python", "isCorrect": true },
    { "text": "HTML", "isCorrect": false },
    { "text": "Java", "isCorrect": true }
  ]
}
```

### 3. Text-Based Question
```json
{
  "text": "What does API stand for?",
  "type": "text",
  "marks": 1,
  "correctAnswer": "Application Programming Interface",
  "hint": "It's about how applications communicate"
}
```

## Testing

### Using Postman

Access the complete Postman collection for testing all API endpoints:

**Postman Collection Link**: [Quiz API Collection](https://www.postman.com/vais2005/workspace/quizapi/collection/37113333-5f90f698-0efb-4603-8e93-c9116e8b46ed?action=share&source=copy-link&creator=37113333)

### Manual Testing Examples

#### 1. Create a Quiz
```bash
POST /api/quiz
Content-Type: application/json

{
  "title": "JavaScript Basics"
}
```

#### 2. Add a Question
```bash
POST /api/quiz/{quizId}/questions
Content-Type: application/json

{
  "text": "What is a closure in JavaScript?",
  "type": "single",
  "marks": 2,
  "options": [
    { "text": "A function with access to outer scope", "isCorrect": true },
    { "text": "A loop structure", "isCorrect": false }
  ]
}
```

#### 3. Submit Answers
```bash
POST /api/quiz/{quizId}/submit
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "64a1b2c3d4e5f6789",
      "selectedOptions": ["64a1b2c3d4e5f6790"],
      "textAnswer": ""
    }
  ]
}
```

### Sample Response (Quiz Submission)
```json
{
  "totalQuestions": 5,
  "totalMarks": 10,
  "scoredMarks": 8,
  "percentage": 80,
  "results": [
    {
      "questionId": "64a1b2c3d4e5f6789",
      "isCorrect": true,
      "marksAwarded": 2,
      "correctAnswer": ["Option A"]
    }
  ]
}
```

## Project Structure

```
QuizAPI/
├── models/
│   ├── Quiz.js
│   └── Question.js
├── routes/
│   ├── quizRoutes.js
│   └── questionRoutes.js
├── controllers/
│   ├── quizController.js
│   └── questionController.js
├── middleware/
│   └── validation.js
├── config/
│   └── database.js
├── .env
├── index.js
├── package.json
└── README.md
```

## Key Features & Assumptions

### Design Choices
- **Database**: MongoDB with Mongoose ODM for flexible schema design
- **Architecture**: RESTful API following MVC pattern
- **Validation**: Comprehensive input validation for all endpoints
- **Error Handling**: Structured error responses with appropriate HTTP status codes

### Business Rules
- MCQ questions must have at least one correct option
- Text questions require a correct answer for scoring
- Quiz submission calculates total marks and percentage automatically
- Partial scoring available for multiple-correct questions

### Scoring Logic
- **Single MCQ**: Full marks for correct answer, zero for incorrect
- **Multiple MCQ**: Proportional scoring based on correct selections
- **Text Questions**: Exact match with correct answer (case-insensitive)



## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**Vaishnavi Thorat**
- GitHub: [@vai-sys](https://github.com/vai-sys)

---

**Repository Link**: [https://github.com/vai-sys/QuizAPI.git](https://github.com/vai-sys/QuizAPI.git)
