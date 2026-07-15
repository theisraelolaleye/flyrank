import express from "express";

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

const app = express();

const port = 3000;

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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
