const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A hotel must have a name'],
        trim: true,
        maxLength: [100, 'Hotel name cannot exceed 100 characters']
    },
    country: {
        type: String,
        required: [true, 'A hotel must have a country'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'A hotel must have a city'],
        trim: true
    },
    items: [{
        foodName: {
            type: String,
            required: [true, 'Food item must have a name']
        },
        price: {
            type: Number,
            required: [true, 'Food item must have a price']
        },
        description: {
            type: String,
            trim: true
        },
        category: {
            type: String,
            enum: ['appetizer', 'main course', 'dessert', 'beverage'],
            required: [true, 'Food item must have a category']
        },
        isVegetarian: {
            type: Boolean,
            default: false
        },
        image: {
            type: String,
            default: 'default-food.jpg'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;