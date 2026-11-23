const path = require("path");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const taskRoutes = require("./routes/task.routes");
const errorHandler = require("./middlewares/errorHandler");

const openapiDoc = YAML.load(path.join(__dirname, "..", "openapi.yaml"));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
app.use("/api/tasks", taskRoutes);

app.use((req, res) => res.status(404).json({ error: "Route introuvable" }));
app.use(errorHandler);

module.exports = app;