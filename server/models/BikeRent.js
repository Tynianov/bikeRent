const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BikeRentSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    bike: {
        type: Schema.Types.ObjectId,
        ref: "Bike",
        required: true
    },
    timeFrom: {
        type: Date,
        required: true
    },
    timeTo: {
        type: Date,
        required: true
    },
    rentalPrice: Number

});


module.exports = mongoose.model('BikeRent', BikeRentSchema);
