import swaggerUi from "swagger-ui-express";
import fs from "fs";
import express from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasks = [
	{
		id: 1,
		title: "Task 1",
		done: true,
	},
	{
		id: 2,
		title: "Task 2",
		done: true,
	},
	{
		id: 3,
		title: "Task 3",
		done: false,
	},
];

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
	res.json(tasks);
});

app.get("/task/:id", (req, res) => {
	const id = Number(req.params.id);
	const task = tasks.find((task) => task.id === id);

	if (!task) {
		return res.status(404).json({
			error: `Task ${id} not found`,
		});
	}

	res.json(task);
	// console.log(req.params);
});

app.post("/tasks", (req, res) => {
	const nextID = tasks.length + 1;
	const { title } = req.body;

	if (!title || title.trim() === "") {
		return res.status(400).json({
			error: "Title is required",
		});
	}
	const newTask = {
		id: nextID,
		title,
		done: false,
	};

	tasks.push(newTask);

	res.status(201).json(newTask);

	// console.log();
});

app.put("/tasks/:id", (req, res) => {
	const id = Number(req.params.id);

	const index = tasks.findIndex((task) => task.id === id);

	if (index === -1) {
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

	if (title !== undefined) {
		tasks[index].title = title;
	}

	if (done !== undefined) {
		tasks[index].done = done;
	}

	res.json(tasks[index]);
});

app.delete("/tasks/:id", (req, res) => {
	const id = Number(req.params.id);

	const index = tasks.findIndex((task) => task.id === id);

	if (index === -1) {
		return res.status(404).json({
			error: `Task ${id} not found`,
		});
	}

	tasks.splice(index, 1);

	res.sendStatus(204);
});

app.get("/tasks", (req, res) => {
	const { done } = req.query;

	if (done === undefined) {
		return res.json(tasks);
	}

	const completed = done === "true";

	const filteredTasks = tasks.filter((task) => task.done === completed);

	res.json(filteredTasks);
});

app.get("/stats", (req, res) => {
	const total = tasks.length;

	const done = tasks.filter((task) => task.done).length;

	const open = total - done;

	res.json({
		total,
		done,
		open,
	});
});

const swaggerDocument = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
