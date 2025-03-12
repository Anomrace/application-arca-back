import express from "express";
import {
  getProfesseurs,
  getProfesseurById,
  createProfesseur,
  updateProfesseur,
  deleteProfesseur,
} from "../controllers/professeursController.js";

const router = express.Router();

router.get("/", getProfesseurs);
router.get("/:id", getProfesseurById);
router.post("/", createProfesseur);
router.put("/:id", updateProfesseur);
router.delete("/:id", deleteProfesseur);

export default router;
