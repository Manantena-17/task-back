
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// Valeurs du champ "status" (à adapter à votre base du TP si besoin)
const STATUS = { PENDING: "en cours", DONE: "terminée" };

const collection = () => getDB().collection(process.env.COLLECTION || "tasks");

// Liste avec filtre par statut et tri par nom
async function findAll({ status = "all", sort = "asc" } = {}) {
  const filter = {};
  if (status === "done") filter.status = STATUS.DONE;
  else if (status === "pending") filter.status = STATUS.PENDING;

  return collection()
    .find(filter)
    .collation({ locale: "fr", strength: 2 }) // ignore casse et accents
    .sort({ name: sort === "desc" ? -1 : 1 })
    .toArray();
}

// Compteurs : tout / en cours / terminées
async function getStats() {
  const [all, done, pending] = await Promise.all([
    collection().countDocuments({}),
    collection().countDocuments({ status: STATUS.DONE }),
    collection().countDocuments({ status: STATUS.PENDING }),
  ]);
  return { all, done, pending };
}

function findById(id) {
  return collection().findOne({ _id: new ObjectId(id) });
}

async function create({ name, description = "" }) {
  const doc = { name, description, status: STATUS.PENDING, createdAt: new Date() };
  const result = await collection().insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

function update(id, { name, description = "" }) {
  return collection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { name, description, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
}

// Terminer ou rouvrir une tâche
function setStatus(id, done) {
  return collection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status: done ? STATUS.DONE : STATUS.PENDING, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
}

async function remove(id) {
  const result = await collection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = { STATUS, findAll, getStats, findById, create, update, setStatus, remove };
EOF