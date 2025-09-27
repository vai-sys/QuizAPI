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
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
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
   
   Server will be running at `http://localhost:5000`

## API Endpoints

### Quiz Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quiz` | Create a new quiz |
| `GET` | `/api/quiz` | Get all quizzes |
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
  "correctTextAnswer": "Application Programming Interface",
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
  "text": "What does 'let' keyword do in JavaScript?",
  "type": "single",
  "marks": 2,
  "hint": "Think about variable scope",
  "options": [
    { "text": "Defines a variable with block scope", "isCorrect": true },
    { "text": "Defines a global variable", "isCorrect": false },
    { "text": "Creates a constant", "isCorrect": false }
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
      "questionId": "68d6e5b6d987953bf16dacf5",
      "selectedOptionIds": ["68d6e5b6d987953bf16dacf6"]
    },
    {
      "questionId": "68d6e833d987953bf16dad04",
      "textAnswer": "object"
    }
  ]
}
```

### Sample Response (Quiz Submission)
```json
{
  "success": true,
  "score": 6,
  "totalMarks": 10,
  "percentage": 60,
  "results": [
    {
      "questionId": "68d6e81fd987953bf16dacfc",
      "correct": false,
      "userAnswer": [
        "68d6e81fd987953bf16dacfd",
        "68d6e81fd987953bf16dacfe",
        "68d6e81fd987953bf16dad00"
      ],
      "correctAnswer": [
        {
          "_id": "68d6e81fd987953bf16dacfd",
          "text": "String"
        },
        {
          "_id": "68d6e81fd987953bf16dacfe",
          "text": "Number"
        },
        {
          "_id": "68d6f1d20a064cd7d646608a",
          "text": "Boolean"
        }
      ]
    },
    {
      "questionId": "68d6e5b6d987953bf16dacf5",
      "correct": true,
      "userAnswer": [
        "68d6e5b6d987953bf16dacf6"
      ],
      "correctAnswer": [
        {
          "_id": "68d6e5b6d987953bf16dacf6",
          "text": "Defines a variable with block scope"
        }
      ]
    }
    
    
    
  ]
}
```

## Project Structure

```
QuizAPI/
├── config/
│   └── db.js
├── controllers/
│   ├── quizController.js
│   └── questionController.js
├── models/
│   ├── Quiz.js
│   └── Question.js
├── routes/
│   ├── quizRoutes.js
│   └── questionRoutes.js
├── .env
├── index.js
├── package.json
└── README.md
```

## Key Features & Assumptions

### Design Choices
- **Database**: MongoDB with Mongoose ODM for flexible schema design
- **Architecture**: RESTful API following MVC pattern
- **Validation**: Comprehensive input validation at model level using Mongoose pre-validation hooks
- **Error Handling**: Structured error responses with appropriate HTTP status codes

### Business Rules
- **Single MCQ**: Must have exactly one correct option
- **Multiple MCQ**: Must have at least one correct option
- **Text Questions**: Require a `correctTextAnswer` field for scoring
- **Quiz Deletion**: Automatically deletes all associated questions
- **Question Deletion**: Automatically removes question reference from quiz

### Validation Rules
- Quiz title is required and cannot be empty
- Question text is required (max 300 characters)
- Question type must be one of: "single", "multiple", "text"
- Options are required for MCQ questions
- Text answers are case-insensitive during comparison
- Marks must be at least 1

### Scoring Logic
- **Single MCQ**: Full marks for correct answer, zero for incorrect
- **Multiple MCQ**: Full marks only if all correct options are selected and no incorrect ones
- **Text Questions**: Exact match with correct answer (case-insensitive, trimmed)

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```


## Dependencies

- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling for Node.js
- **dotenv**: Loads environment variables from .env file
- **body-parser**: Parse incoming request bodies

## Deployed Version 
   Access here - https://quizapi-4-5b0a.onrender.com/


## Author

**Vaishnavi Thorat**
- GitHub: [@vai-sys](https://github.com/vai-sys)

---

**Repository Link**: [https://github.com/vai-sys/QuizAPI.git](https://github.com/vai-sys/QuizAPI.git)
