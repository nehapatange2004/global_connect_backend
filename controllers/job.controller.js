import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import SavedJob from "../models/SavedJob.js";

// ✅ Create a job (Recruiter only)
export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Only recruiters can post jobs" });
    }

    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { id } = req.params; // job ID
    const { coverLetter } = req.body;

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const existing = await JobApplication.findOne({ job: id, applicant: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already applied to this job" });
    }

    const application = new JobApplication({
      job: id,
      applicant: req.user.id,
      coverLetter,
    });

    await application.save();
    res.status(201).json({ success: true, message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Save a job
export const saveJob = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await SavedJob.findOne({ job: id, user: req.user.id });
    if (!existing) {
      await SavedJob.create({ job: id, user: req.user.id });
    }

    res.status(200).json({ success: true, message: "Job saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Unsave a job
export const unsaveJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SavedJob.findOneAndDelete({ job: id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Job not found in saved list" });
    }

    res.status(200).json({ success: true, message: "Job removed from saved list" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get my applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ applicant: req.user.id })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user.id })
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};