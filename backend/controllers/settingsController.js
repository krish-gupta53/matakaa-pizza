import Settings from '../models/settingsModel.js';

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ isOrderEnabled: true });
        }
        console.log('Settings from DB:', settings);
        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error in getSettings:', error);
        res.json({ success: false, message: "Error" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        console.log('Update request body:', req.body);
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ isOrderEnabled: req.body.isOrderEnabled });
        } else {
            settings.isOrderEnabled = req.body.isOrderEnabled;
            await settings.save();
        }
        console.log('Updated settings:', settings);
        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error in updateSettings:', error);
        res.json({ success: false, message: "Error" });
    }
}; 