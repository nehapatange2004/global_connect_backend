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
  getApplicationsForMyJobs,
  updateApplicationStatus,
} from "../controllers/job.controller.js";

const jobsRoutes = express.Router();

//
// Candidate Routes
//
jobsRoutes.get("/", getAllJobs); // make public OR add protectedRoute if you want
jobsRoutes.post("/:id/apply", protectedRoute, applyForJob);

jobsRoutes.post("/:id/save", protectedRoute, saveJob);
jobsRoutes.delete("/:id/unsave", protectedRoute, unsaveJob);
jobsRoutes.get("/saved", protectedRoute, getSavedJobs);

jobsRoutes.get("/applications/me", protectedRoute, getMyApplications);

//
// Recruiter Routes
//
jobsRoutes.post("/", protectedRoute, createJob);
jobsRoutes.get("/applications/recruiter", protectedRoute, getApplicationsForMyJobs);
jobsRoutes.put("/applications/:id/status", protectedRoute, updateApplicationStatus);

export default jobsRoutes;
