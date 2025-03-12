import express from "express";
import {
  getEleves,
  getEleveById,
  createEleve,
  updateEleve,
  deleteEleve,
} from "../controllers/elevesController.js";

const router = express.Router();

router.get("/", getEleves);
router.get("/:id", getEleveById);
router.post("/", createEleve);
router.put("/:id", updateEleve);
router.delete("/:id", deleteEleve);

export default router;
