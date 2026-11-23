const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log(`MongoDB connecté : base "${process.env.DB_NAME}"`);
  return db;
}

function getDB() {
  if (!db) throw new Error("La base de données n'est pas connectée");
  return db;
}

module.exports = { connectDB, getDB };