import PromoCode from '../models/PromoCode.js';

// Create a new promo code
export const createPromoCode = async (req, res) => {
    try {
        const promoCode = new PromoCode(req.body);
        await promoCode.save();
        res.json({ success: true, data: promoCode });
    } catch (error) {
        console.error('Error creating promo code:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Failed to create promo code' 
        });
    }
};

// Get all active promo codes
export const getActivePromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find({
            isActive: true,
            validUntil: { $gt: new Date() }
        });
        res.json({ success: true, data: promoCodes });
    } catch (error) {
        console.error('Error fetching active promo codes:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to fetch promo codes' 
        });
    }
};

// Get all promo codes (admin)
export const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
        res.json({ success: true, data: promoCodes });
    } catch (error) {
        console.error('Error fetching all promo codes:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to fetch promo codes' 
        });
    }
};

// Validate and apply promo code
export const validatePromoCode = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        const promoCode = await PromoCode.findOne({
            code: code.toUpperCase(),
            isActive: true,
            validUntil: { $gt: new Date() }
        });

        if (!promoCode) {
            return res.status(404).json({ 
                success: false, 
                message: 'Invalid or expired promo code' 
            });
        }

        if (orderAmount < promoCode.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of Rs ${promoCode.minOrderAmount} required`
            });
        }

        let discount = 0;
        if (promoCode.discountType === 'PERCENTAGE') {
            discount = (orderAmount * promoCode.discountValue) / 100;
        } else {
            discount = promoCode.discountValue;
        }

        res.json({
            success: true,
            data: {
                promoCode,
                discount,
                finalAmount: orderAmount - discount
            }
        });
    } catch (error) {
        console.error('Error validating promo code:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to validate promo code' 
        });
    }
};

// Update promo code
export const updatePromoCode = async (req, res) => {
    try {
        const promoCode = await PromoCode.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!promoCode) {
            return res.status(404).json({ 
                success: false, 
                message: 'Promo code not found' 
            });
        }
        res.json({ success: true, data: promoCode });
    } catch (error) {
        console.error('Error updating promo code:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Failed to update promo code' 
        });
    }
};

// Delete promo code
export const deletePromoCode = async (req, res) => {
    try {
        const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
        if (!promoCode) {
            return res.status(404).json({ 
                success: false, 
                message: 'Promo code not found' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Promo code deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting promo code:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to delete promo code' 
        });
    }
}; 