import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    isOrderEnabled: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Settings', settingsSchema); 