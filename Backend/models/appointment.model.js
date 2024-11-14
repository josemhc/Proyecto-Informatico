import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateTime: { type: Date, required: true },
    ultrasoundType: { type: String, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'canceled', 'completed'],
        required: true
    },
    reminderSent: { type: Boolean, default: false } // Indicador de si se ha enviado un recordatorio
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;