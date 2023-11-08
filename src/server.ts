import cors from "cors";
import express from "express";
import { allRoutes } from "./routes/index";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", allRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`API iniciada na porta -> ${PORT}`);
});
