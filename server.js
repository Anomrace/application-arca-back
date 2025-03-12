import express from "express";
import cors from "cors";
import elevesRoutes from "./routes/elevesRoutes.js";
import professeursRoutes from "./routes/professeursRoutes.js";
import coursRoutes from "./routes/coursRoutes.js";
import facturesRoutes from "./routes/facturesRoutes.js";
import morgan from "morgan";
const app = express();

app.use(cors());
app.use(express.json());

// Middleware de log pour toutes les requêtes
app.use(morgan("dev"));

// Routes de l'API
app.use("/eleves", elevesRoutes);
app.use("/professeurs", professeursRoutes);
app.use("/cours", coursRoutes);
app.use("/factures", facturesRoutes);

app.listen(3000, () => {
  console.log("🚀 Serveur backend lancé sur http://localhost:3000");
});
