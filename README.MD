# Task API

A simple RESTful Task API built with **Node.js** and **Express**.

This project demonstrates the basic CRUD operations:

- Create a task
- Read all tasks
- Read a single task
- Update a task
- Delete a task

The API also includes:

- Health check endpoint
- Swagger UI documentation
- Input validation
- Proper HTTP status codes

---

## Technologies Used

- Node.js
- Express.js
- Swagger UI Express

---

## Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-api.git
```

Move into the project directory

```bash
cd task-api
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm start
```

The API will be available at

```
http://localhost:3000
```

Swagger documentation

```
http://localhost:3000/docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a task by ID |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

## Example Request

Create a task

```bash
curl -i -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Buy milk"}'
```

Example Response

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "id": 4,
  "title": "Buy milk",
  "done": false
}
```

---

## Swagger Documentation

Visit

```
http://localhost:3000/docs
```

to explore and test the API interactively.

### Swagger Screenshot

> Replace the image below with your own screenshot.

![Swagger UI](images/swagger-ui.png)

---

## Project Structure

```
.
├── app.js
├── openapi.json
├── package.json
├── README.md
└── images
    └── swagger-ui.png
```

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |

---

## Author

Israel Olaleye