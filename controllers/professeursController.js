import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Récupérer tous les professeurs
export const getProfesseurs = async (req, res) => {
  try {
    const professeurs = await prisma.professeur.findMany({
      include: {
        user: true, // firstName, lastName, email
        eleves: true,
        cours: true,
      },
    });
    res.json(professeurs);
  } catch (error) {
    console.error("❌ Erreur API /professeurs :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des professeurs" });
  }
};

export const getProfesseurById = async (req, res) => {
  try {
    const professeur = await prisma.professeur.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        eleves: true,
        cours: true,
      },
    });
    if (!professeur)
      return res.status(404).json({ error: "Professeur non trouvé" });
    res.json(professeur);
  } catch (error) {
    console.error("❌ Erreur API /professeurs/:id :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Créer un professeur
export const createProfesseur = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, specialite } = req.body;

    const newProf = await prisma.professeur.create({
      data: {
        telephone,
        specialite,
        user: {
          create: {
            firstName: nom,
            lastName: prenom,
            email: email,
            password: "",
            role: "professor",
          },
        },
      },
      include: { user: true },
    });
    res.json(newProf);
  } catch (error) {
    console.error("❌ Erreur création professeur :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du professeur" });
  }
};

// ✅ Modifier un professeur
export const updateProfesseur = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, specialite } = req.body;

    let dataToUpdate = {};
    if (telephone !== undefined) dataToUpdate.telephone = telephone;
    if (specialite !== undefined) dataToUpdate.specialite = specialite;

    // Nested update pour le user
    let userUpdate = {};
    if (nom !== undefined) userUpdate.firstName = nom;
    if (prenom !== undefined) userUpdate.lastName = prenom;
    if (email !== undefined) userUpdate.email = email;

    if (Object.keys(userUpdate).length > 0) {
      dataToUpdate.user = { update: userUpdate };
    }

    const updatedProf = await prisma.professeur.update({
      where: { id: req.params.id },
      data: dataToUpdate,
      include: { user: true, eleves: true, cours: true },
    });
    res.json(updatedProf);
  } catch (error) {
    console.error("❌ Erreur API /professeurs (UPDATE) :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la modification du professeur" });
  }
};

// ✅ Supprimer un professeur (et éventuellement son user)
export const deleteProfesseur = async (req, res) => {
  try {
    const prof = await prisma.professeur.findUnique({
      where: { id: req.params.id },
    });
    if (!prof) return res.status(404).json({ error: "Professeur non trouvé" });

    // Supprimer le professeur
    await prisma.professeur.delete({ where: { id: req.params.id } });

    // Supprimer le user associé
    await prisma.user.delete({ where: { id: prof.userId } });

    res.json({ message: "Professeur et user supprimés !" });
  } catch (error) {
    console.error("❌ Erreur API /professeurs (DELETE) :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du professeur" });
  }
};
