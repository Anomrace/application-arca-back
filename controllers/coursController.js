import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Récupérer tous les cours
export const getCours = async (req, res) => {
  try {
    console.log("[getCours] Requête reçue");
    const cours = await prisma.cours.findMany({
      include: {
        eleve: { select: { nom: true } },
        professeur: { select: { nom: true } },
      },
    });
    console.log("[getCours] Cours récupérés :", cours);
    res.json(cours);
  } catch (error) {
    console.error("[getCours] Erreur récupération cours :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Récupérer un cours par ID
export const getCoursById = async (req, res) => {
  try {
    console.log("[getCoursById] Requête pour l'ID :", req.params.id);
    const cours = await prisma.cours.findUnique({
      where: { id: req.params.id },
      include: {
        eleve: { select: { nom: true } },
        professeur: { select: { nom: true } },
      },
    });
    if (!cours) {
      console.error(
        "[getCoursById] Cours non trouvé pour l'ID :",
        req.params.id
      );
      return res.status(404).json({ error: "Cours non trouvé" });
    }
    console.log("[getCoursById] Cours trouvé :", cours);
    res.json(cours);
  } catch (error) {
    console.error("[getCoursById] Erreur récupération cours par id :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Créer un cours
export const createCours = async (req, res) => {
  try {
    console.log("[createCours] Données reçues :", req.body);
    const { date, eleveId, profId, lieu } = req.body;
    if (!eleveId || !profId || !date) {
      console.error("[createCours] Requête incomplète :", req.body);
      return res
        .status(400)
        .json({ error: "eleveId, profId et date sont requis" });
    }
    const newCours = await prisma.cours.create({
      data: {
        eleveId,
        profId,
        date: new Date(date),
        lieu: lieu || "Non spécifié",
      },
    });
    console.log("[createCours] Cours créé :", newCours);
    res.json(newCours);
  } catch (error) {
    console.error("[createCours] Erreur création cours :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Modifier un cours
export const updateCours = async (req, res) => {
  try {
    console.log(
      "[updateCours] Mise à jour du cours ID :",
      req.params.id,
      "avec :",
      req.body
    );
    const updatedCours = await prisma.cours.update({
      where: { id: req.params.id },
      data: req.body,
    });
    console.log("[updateCours] Cours mis à jour :", updatedCours);
    res.json(updatedCours);
  } catch (error) {
    console.error("[updateCours] Erreur modification cours :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Supprimer un cours
export const deleteCours = async (req, res) => {
  try {
    console.log("[deleteCours] Suppression du cours ID :", req.params.id);
    await prisma.cours.delete({ where: { id: req.params.id } });
    console.log("[deleteCours] Cours supprimé :", req.params.id);
    res.json({ message: "Cours supprimé !" });
  } catch (error) {
    console.error("[deleteCours] Erreur suppression cours :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du cours" });
  }
};
