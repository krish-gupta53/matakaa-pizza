import Food from '../models/foodModel.js';
import fs from 'fs'

export const listFood = async (req, res) => {
    try {
        const foods = await Food.find({});
        res.json({
            success: true,
            data: foods
        });
    } catch (error) {
        console.error("Error in listFood:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching food items",
            error: error.message
        });
    }
};

export const addFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        
        // Validate required fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate image
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Food image is required"
            });
        }

        const newFood = new Food({
            name,
            description,
            price: parseFloat(price),
            image: req.file.filename,
            category
        });

        await newFood.save();

        res.status(201).json({
            success: true,
            message: "Food item added successfully",
            data: newFood
        });
    } catch (error) {
        console.error("Error in addFood:", error);
        res.status(500).json({
            success: false,
            message: "Error adding food item",
            error: error.message
        });
    }
};

export const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required"
            });
        }

        const result = await Food.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        res.json({
            success: true,
            message: "Food item removed successfully"
        });
    } catch (error) {
        console.error("Error in removeFood:", error);
        res.status(500).json({
            success: false,
            message: "Error removing food item",
            error: error.message
        });
    }
};