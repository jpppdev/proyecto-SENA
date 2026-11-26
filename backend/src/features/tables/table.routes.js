// backend/src/features/tables/table.routes.js
import { Router } from "express";
import { tableController } from "./table.controller.js";

const router = Router();

router.get("/", tableController.getAll);
router.get("/:id", tableController.getById);
router.post("/", tableController.create);
router.put("/:id", tableController.update);
router.patch("/:id/status", tableController.updateStatus);
router.patch("/:id/release", tableController.release);
router.patch("/:id/disable", tableController.disable);
router.delete("/:id", tableController.disable);

export default router;
