import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createJob,
  getAllJobs,
  applyForJob,
  saveJob,
  unsaveJob,
  getMyApplications,
  getSavedJobs,
} from "../controllers/job.controller.js";

const jobsRoutes = express.Router();

// Recruiter
jobsRoutes.post("/", protectedRoute, createJob);

// Candidates
jobsRoutes.get("/", protectedRoute, getAllJobs);
jobsRoutes.post("/:id/apply", protectedRoute, applyForJob);

// Saved jobs
jobsRoutes.post("/:id/save", protectedRoute, saveJob);
jobsRoutes.delete("/:id/unsave", protectedRoute, unsaveJob);
jobsRoutes.get("/saved", protectedRoute, getSavedJobs);

// Applications
jobsRoutes.get("/applications/me", protectedRoute, getMyApplications);

export default jobsRoutes;