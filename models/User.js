import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    profilePic: {
        type: String,
    },
    experience: [{
        company: { type: String, required: true },
        role: { type: String, required: true },
        from: { type: Date, required: true }, // start date
        to: { type: Date } // can be null if still working
    }],
    education: [{
        school: { type: String, required: true }, degree: { type: String }, from: { type: Date, required: true },
        to: { type: Date }
    }],
    skills: [String],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId }]
},
    { timestamps: true }
)

export default mongoose.model('User', userSchema);