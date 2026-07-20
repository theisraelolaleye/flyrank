import Database from "better-sqlite3";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const db = new Database(path.join(__dirname, "tasks.db"));
const port = 3000;

db.exec(`
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT,
    done BOOLEAN
);
`);

const { count } = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

if (count === 0) {
	const seed = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)");
	seed.run("Task 1", 1);
	seed.run("Task 2", 1);
	seed.run("Task 3", 0);
}

const toTask = (row) => ({ ...row, done: !!row.done });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({
		name: "Task API",
		version: "1.0",
		endpoints: ["/tasks"],
	});
});

app.get("/health", (req, res) => {
	res.json({
		status: "ok",
	});
});

app.get("/tasks", (req, res) => {
	const { done } = req.query;

	if (done === undefined) {
		const rows = db.prepare("SELECT * FROM tasks").all();
		return res.json(rows.map(toTask));
	}

	const completed = done === "true" ? 1 : 0;
	const rows = db.prepare("SELECT * FROM tasks WHERE done = ?").all(completed);

	res.json(rows.map(toTask));
});

app.get("/tasks/:id", (req, res) => {
	const id = Number(req.params.id);
	const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

	if (!row) {
		return res.status(404).json({
			error: `Task ${id} not found`,
		});
	}

	res.json(toTask(row));
});

app.post("/tasks", (req, res) => {
	const { title } = req.body;

	if (!title || title.trim() === "") {
		return res.status(400).json({
			error: "Title is required",
		});
	}

	const info = db
		.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)")
		.run(title, 0);

	res.status(201).json({
		id: info.lastInsertRowid,
		title,
		done: false,
	});
});

app.put("/tasks/:id", (req, res) => {
	const id = Number(req.params.id);
	const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

	if (!existing) {
		return res.status(404).json({
			error: `Task ${id} not found`,
		});
	}

	const { title, done } = req.body;

	if (title === undefined && done === undefined) {
		return res.status(400).json({
			error: "Provide title and/or done",
		});
	}

	if (title !== undefined && title.trim() === "") {
		return res.status(400).json({
			error: "Title cannot be empty",
		});
	}

	if (done !== undefined && typeof done !== "boolean") {
		return res.status(400).json({
			error: "Done must be true or false",
		});
	}

	db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?").run(
		title !== undefined ? title : existing.title,
		done !== undefined ? (done ? 1 : 0) : existing.done,
		id,
	);

	const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

	res.json(toTask(updated));
});

app.delete("/tasks/:id", (req, res) => {
	const id = Number(req.params.id);
	const info = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

	if (info.changes === 0) {
		return res.status(404).json({
			error: `Task ${id} not found`,
		});
	}

	res.sendStatus(204);
});

app.get("/stats", (req, res) => {
	const { total } = db.prepare("SELECT COUNT(*) AS total FROM tasks").get();
	const { done } = db
		.prepare("SELECT COUNT(*) AS done FROM tasks WHERE done = 1")
		.get();

	res.json({
		total,
		done,
		open: total - done,
	});
});

const swaggerDocument = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "openapi.json"), "utf8"),
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
