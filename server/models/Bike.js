const BIKE_TYPE_CHOICES = ["Sport", "Mountain", "Kids", "Basic"];

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BikeSchema = new Schema({
    bikeName: {
        type: String,
        required: [true, 'Bike name is required'],
        maxLength: 50
    },
    bikeType: {
        type: String,
        enum: BIKE_TYPE_CHOICES,
        required: [true, 'Bike type is required'],
        maxLength: 50,
        default: "Basic"
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Bike', BikeSchema)
module.exports.BIKE_TYPE_CHOICES = BIKE_TYPE_CHOICES;
