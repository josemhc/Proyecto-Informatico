import mongoose from 'mongoose';

const resetPasswordUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    resetPasswordToken: {
        type: String,
        required: true
    },
    resetPasswordExpires: {
        type: Date,
        required: true
    }
});

const ResetPasswordUser = mongoose.models.ResetPasswordUser || mongoose.model('ResetPasswordUser', resetPasswordUserSchema);

export default ResetPasswordUser;