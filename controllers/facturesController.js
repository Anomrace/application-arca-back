import { PrismaClient } from "@prisma/client";
import { generateInvoice } from "../utils/generateInvoice.js";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// ✅ Générer une facture (création)
export const generateFacture = async (req, res) => {
  try {
    console.log("[generateFacture] Données reçues :", req.body);
    const invoiceData = req.body;
    const requiredFields = [
      "amount",
      "creditor",
      "debtor",
      "reference",
      "invoiceNumber",
      "date",
      "clientId",
      "clientName",
    ];
    const missingFields = requiredFields.filter((field) => !invoiceData[field]);
    if (missingFields.length > 0) {
      console.error("[generateFacture] Données incomplètes :", missingFields);
      return res
        .status(400)
        .json({ error: "Données de facture incomplètes", missingFields });
    }

    // Génération du PDF et création en BDD
    const filePath = await generateInvoice(invoiceData);
    console.log("[generateFacture] Fichier généré :", filePath);

    const newFacture = await prisma.facture.create({
      data: {
        clientId: invoiceData.clientId,
        amount: invoiceData.amount,
        reference: invoiceData.reference,
        filePath,
      },
    });
    console.log("[generateFacture] Facture enregistrée en BDD :", newFacture);
    res.json({ facture: newFacture, fileLink: filePath });
  } catch (error) {
    console.error("[generateFacture] Erreur génération facture :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la génération de la facture" });
  }
};

// ✅ Récupérer toutes les factures d'un client
export const getFacturesByClient = async (req, res) => {
  try {
    console.log(
      "[getFacturesByClient] Requête pour le client ID :",
      req.params.clientId
    );
    const factures = await prisma.facture.findMany({
      where: { clientId: req.params.clientId },
    });
    if (!factures.length) {
      console.error(
        "[getFacturesByClient] Aucune facture trouvée pour le client :",
        req.params.clientId
      );
      return res
        .status(404)
        .json({ error: "Aucune facture trouvée pour ce client." });
    }
    console.log("[getFacturesByClient] Factures récupérées :", factures);
    res.json(factures);
  } catch (error) {
    console.error(
      "[getFacturesByClient] Erreur récupération factures :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des factures" });
  }
};

// ✅ Récupérer une facture par ID
export const getFactureById = async (req, res) => {
  try {
    console.log("[getFactureById] Requête pour la facture ID :", req.params.id);
    const facture = await prisma.facture.findUnique({
      where: { id: req.params.id },
    });
    if (!facture) {
      console.error(
        "[getFactureById] Facture non trouvée pour l'ID :",
        req.params.id
      );
      return res.status(404).json({ error: "Facture non trouvée." });
    }
    console.log("[getFactureById] Facture trouvée :", facture);
    res.json(facture);
  } catch (error) {
    console.error("[getFactureById] Erreur récupération facture :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la facture" });
  }
};

// ✅ Télécharger la facture PDF
export const downloadFacture = async (req, res) => {
  try {
    console.log(
      "[downloadFacture] Téléchargement de la facture ID :",
      req.params.id
    );
    const facture = await prisma.facture.findUnique({
      where: { id: req.params.id },
    });
    if (!facture) {
      console.error(
        "[downloadFacture] Facture non trouvée pour l'ID :",
        req.params.id
      );
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    const resolvedPath = path.resolve(facture.filePath);
    if (!fs.existsSync(resolvedPath)) {
      console.error(
        "[downloadFacture] Fichier introuvable pour le chemin :",
        resolvedPath
      );
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    console.log("[downloadFacture] Fichier trouvé, début du téléchargement");
    res.download(resolvedPath, `facture-${req.params.id}.pdf`);
  } catch (error) {
    console.error(
      "[downloadFacture] Erreur lors du téléchargement de la facture :",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

// ✅ Supprimer une facture (et le fichier associé)
export const deleteFacture = async (req, res) => {
  try {
    console.log(
      "[deleteFacture] Suppression de la facture ID :",
      req.params.id
    );
    const facture = await prisma.facture.findUnique({
      where: { id: req.params.id },
    });
    if (facture && fs.existsSync(facture.filePath)) {
      fs.unlinkSync(facture.filePath);
      console.log("[deleteFacture] Fichier supprimé :", facture.filePath);
    }
    await prisma.facture.delete({ where: { id: req.params.id } });
    console.log("[deleteFacture] Facture supprimée de la BDD :", req.params.id);
    res.json({ message: "Facture supprimée !" });
  } catch (error) {
    console.error("[deleteFacture] Erreur suppression facture :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la facture" });
  }
};
