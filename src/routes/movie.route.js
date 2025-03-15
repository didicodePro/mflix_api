import { Router } from "express";
import Movie from "../models/movie.model.js";
import {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";

const router = Router();

// ✅ Route 1 : Récupérer tous les films (limités à 10)
router.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    const movies = await Movie.find()
      .select("title plot genres poster ")
      .limit(limit);
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Route 2 : Récupérer un film par ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    console.log(req.params.id);

    if (!movie) return res.status(404).json({ error: "Film non trouvé" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Route 3 : Ajouter un film
router.post("/", async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ error: "Données invalides" });
  }
});

// ✅ Route 4 : Modifier un film
router.put("/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie)
      return res.status(404).json({ error: "Film non trouvé" });
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Route 5 : Supprimer un film
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ error: "Film non trouvé" });
    res.json({ message: "Film supprimé !" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/", getAllMovies);
router.get("/:id", getMovie);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);
export default router;
