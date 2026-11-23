
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
EOF

cat > src/middlewares/validateId.js <<'EOF'
const { ObjectId } = require("mongodb");

module.exports = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  next();
};
EOF

cat > src/middlewares/errorHandler.js <<'EOF'
module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
};
EOF