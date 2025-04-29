import express from "express";
import { getRecommendations } from "../controllers/IntelliServeInsightModule/recommendation.controller.js";

const router = express.Router();

// API route to fetch recommendations for a user
router.get("/recommendations/:userId", getRecommendations);

export default router;
