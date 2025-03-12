import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Récupérer tous les élèves
export const getEleves = async (req, res) => {
  try {
    console.log("[getEleves] Requête de récupération des élèves");
    const eleves = await prisma.eleve.findMany({
      include: {
        user: true, // Pour accéder à firstName, lastName, email, etc.
        professeur: true, // Pour accéder aux infos du professeur
        cours: true, // Liste des cours de l’élève
      },
    });
    console.log("[getEleves] Élèves récupérés :", eleves);
    res.json(eleves);
  } catch (error) {
    console.error("[getEleves] Erreur récupération élèves :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Récupérer un élève par ID
export const getEleveById = async (req, res) => {
  try {
    console.log("[getEleveById] Requête pour l'ID :", req.params.id);
    const eleve = await prisma.eleve.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        professeur: true,
        cours: true,
      },
    });
    if (!eleve) {
      console.error("[getEleveById] Élève non trouvé :", req.params.id);
      return res.status(404).json({ error: "Élève non trouvé" });
    }
    console.log("[getEleveById] Élève trouvé :", eleve);
    res.json(eleve);
  } catch (error) {
    console.error("[getEleveById] Erreur récupération élève :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Créer un élève
export const createEleve = async (req, res) => {
  try {
    console.log("[createEleve] Données reçues :", req.body);
    const { nom, prenom, email, telephone, profId } = req.body;

    // Normalisation du profId
    const finalProfId = profId && profId !== "null" ? String(profId) : null;

    // Vérifier l'existence du professeur si finalProfId est défini
    if (finalProfId) {
      const existingProf = await prisma.professeur.findUnique({
        where: { id: finalProfId },
      });
      if (!existingProf) {
        return res.status(400).json({ error: "Professeur introuvable" });
      }
    }

    // Construction de l'objet data
    const dataToCreate = {
      telephone,
      ...(finalProfId ? { profId: finalProfId } : {}),
      user: {
        create: {
          firstName: nom,
          lastName: prenom,
          email: email,
          password: "", // À hasher en production
          role: "student", // Rôle par défaut
        },
      },
    };

    const newEleve = await prisma.eleve.create({
      data: dataToCreate,
      include: { user: true },
    });
    console.log("[createEleve] Élève créé :", newEleve);
    res.json(newEleve);
  } catch (error) {
    console.error("[createEleve] Erreur création élève :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'élève" });
  }
};

// ✅ Modifier un élève
export const updateEleve = async (req, res) => {
  try {
    console.log(
      "[updateEleve] Mise à jour de l'élève ID :",
      req.params.id,
      "avec :",
      req.body
    );
    const { nom, prenom, email, telephone, profId } = req.body;

    // On construit un objet data pour Eleve
    let dataToUpdate = {};
    if (telephone !== undefined) dataToUpdate.telephone = telephone;

    // Gérer la relation profId
    if (profId && profId !== "null") {
      const existingProf = await prisma.professeur.findUnique({
        where: { id: profId },
      });
      if (!existingProf) {
        return res.status(400).json({ error: "Professeur introuvable" });
      }
      dataToUpdate.profId = profId;
    } else if (profId === "null") {
      dataToUpdate.profId = null;
    }

    // Nested update pour le user
    // On ne fait ce nested update que si l’un des champs user est fourni
    let userUpdate = {};
    if (nom !== undefined) userUpdate.firstName = nom;
    if (prenom !== undefined) userUpdate.lastName = prenom;
    if (email !== undefined) userUpdate.email = email;
    // if (password !== undefined) userUpdate.password = hash(password)

    // S'il y a au moins un champ user, on l'ajoute à dataToUpdate
    if (Object.keys(userUpdate).length > 0) {
      dataToUpdate.user = { update: userUpdate };
    }

    const updatedEleve = await prisma.eleve.update({
      where: { id: req.params.id },
      data: dataToUpdate,
      include: { user: true, professeur: true },
    });

    console.log("[updateEleve] Élève mis à jour :", updatedEleve);
    res.json(updatedEleve);
  } catch (error) {
    console.error("[updateEleve] Erreur modification élève :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la modification de l'élève" });
  }
};

// ✅ Supprimer un élève + son user
export const deleteEleve = async (req, res) => {
  try {
    console.log("[deleteEleve] Suppression de l'élève ID :", req.params.id);

    // Récupérer l'élève pour connaître son userId
    const eleve = await prisma.eleve.findUnique({
      where: { id: req.params.id },
    });
    if (!eleve) {
      return res.status(404).json({ error: "Élève non trouvé" });
    }

    // Supprimer d'abord l'élève (cascade user ou nested delete)
    await prisma.eleve.delete({ where: { id: req.params.id } });

    // Supprimer ensuite le user si vous le souhaitez
    await prisma.user.delete({ where: { id: eleve.userId } });

    console.log("[deleteEleve] Élève + user supprimés :", req.params.id);
    res.json({ message: "Élève et user supprimés !" });
  } catch (error) {
    console.error("[deleteEleve] Erreur suppression élève :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'élève" });
  }
};
