import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fileUrls: {
        type: [String],  
        required: false, 
    },
    password: {
        type: String,
        required: true,
    },
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        default: 'Paciente'
    }
}, {
    timestamps: true
});

export default mongoose.model('Patient', patientSchema);