
const Task = require("../models/task.model");

const clean = (v) => (typeof v === "string" ? v.trim() : "");

exports.list = async (req, res) => {
  const tasks = await Task.findAll({ status: req.query.status, sort: req.query.sort });
  res.json(tasks);
};

exports.stats = async (req, res) => {
  res.json(await Task.getStats());
};

exports.getOne = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Tâche introuvable" });
  res.json(task);
};

exports.create = async (req, res) => {
  const name = clean(req.body.name);
  if (!name) return res.status(400).json({ error: "Le nom est obligatoire" });

  const task = await Task.create({ name, description: clean(req.body.description) });
  res.status(201).json(task);
};

exports.update = async (req, res) => {
  const name = clean(req.body.name);
  if (!name) return res.status(400).json({ error: "Le nom est obligatoire" });

  const task = await Task.update(req.params.id, { name, description: clean(req.body.description) });
  if (!task) return res.status(404).json({ error: "Tâche introuvable" });
  res.json(task);
};

exports.setStatus = async (req, res) => {
  const task = await Task.setStatus(req.params.id, Boolean(req.body.done));
  if (!task) return res.status(404).json({ error: "Tâche introuvable" });
  res.json(task);
};

exports.remove = async (req, res) => {
  const deleted = await Task.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Tâche introuvable" });
  res.status(204).end();
};
