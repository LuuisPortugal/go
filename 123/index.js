const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let countRequests = 0;

server.use((req, res, next) => {
  console.log(`Requisições recebidas: ${++countRequests}`);

  return next();
});

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  if (!projects.some(project => project.id === id)) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
});

server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(project => project.id === id);

  projects[index].title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id === id);

  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(project => project.id === id);

  projects[index].tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
