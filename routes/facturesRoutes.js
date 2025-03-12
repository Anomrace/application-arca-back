import express from "express";
import {
  generateFacture,
  getFacturesByClient,
  getFactureById,
  downloadFacture,
  deleteFacture,
} from "../controllers/facturesController.js";

const router = express.Router();

// Générer (créer) une facture
router.post("/generate", generateFacture);

// Récupérer toutes les factures d'un client
router.get("/client/:clientId", getFacturesByClient);

// Récupérer une facture par ID
router.get("/:id", getFactureById);

// Télécharger une facture PDF
router.get("/download/:id", downloadFacture);

// Supprimer une facture
router.delete("/:id", deleteFacture);

export default router;
