
const router = require("express").Router();
const ctrl = require("../controllers/task.controller");
const asyncHandler = require("../middlewares/asyncHandler");
const validateId = require("../middlewares/validateId");

router.get("/", asyncHandler(ctrl.list));
router.get("/stats", asyncHandler(ctrl.stats));         
router.post("/", asyncHandler(ctrl.create));

router.get("/:id", validateId, asyncHandler(ctrl.getOne));
router.put("/:id", validateId, asyncHandler(ctrl.update));
router.patch("/:id/status", validateId, asyncHandler(ctrl.setStatus));
router.delete("/:id", validateId, asyncHandler(ctrl.remove));

module.exports = router;
