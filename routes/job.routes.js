import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const jobsRoutes = express.Router();

// Create job
jobsRoutes.post("/", protectedRoute, createJob);

// Get all jobs
jobsRoutes.get("/", protectedRoute, getAllJobs);

// Get job by id
jobsRoutes.get("/:id", protectedRoute, getJobById);

// Update job
jobsRoutes.put("/:id", protectedRoute, updateJob);

// Delete job
jobsRoutes.delete("/:id", protectedRoute, deleteJob);

export default jobsRoutes;
