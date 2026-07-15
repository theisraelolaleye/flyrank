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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
