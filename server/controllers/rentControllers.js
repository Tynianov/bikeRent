const BikeRent = require('../models/BikeRent');
const Bike = require('../models/Bike');

function calculateRentPrice(reqBody, bike){
    let timeDiff = Math.abs(Date.parse(reqBody.timeTo) - Date.parse(reqBody.timeFrom));
    let hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));

    let rentalPrice = bike.price * hoursDiff;

    if (hoursDiff > 20){
        return rentalPrice / 2;
    }
    return rentalPrice;
}

module.exports.createBikeRent = function (req, res, next){
    Bike.findById(req.body.bike,(err, bike) => {
        if (err)
            return res.status(400).json({errors: err});
        if (!bike)
            return res.status(404).json({error: "Bike not found"})

        if (!bike.isAvailable)
            return res.status(400).json({error: "Bike is not available for renting"})

        if (Date.parse(req.body.timeFrom) > Date.parse(req.body.timeTo))
            return res.status(400).json({error: "Time from can't be greater than time To"})

        BikeRent.create({
            bike: bike,
            timeFrom: req.body.timeFrom,
            timeTo: req.body.timeTo,
            rentalPrice: calculateRentPrice(req.body, bike)
        }, (err) => {
            if (err)
                return res.status(400).json({errors: err});
            bike.isAvailable = false;
            bike.save();
            res.json({message: "Bike has been successfully rent"})
        })
    })
}

module.exports.rentList = function (req, res, next) {
    BikeRent.find({})
        .populate('bike')
        .exec((err, rents) => {
            if (err)
                return res.status(500).json({message: err});
            res.json({rents})
    })
}

module.exports.rentDetails = function (req, res, next) {
    BikeRent.findById(req.params.id)
        .populate("bike")
        .exec( (err, rent) => {
            if (err)
                return res.status(500).json({message: err});
            if (!rent)
                return res.status(404).json({error: "Rent not found"})

            res.json({rent})
    })
}

module.exports.deleteRent = function (req, res, next) {
    BikeRent.findByIdAndRemove(req.params.id, (err, rent) => {
        if (err)
            return res.status(500).json({message: err});
        if (!rent)
            return res.status(404).json({note: "Rent not found"});
        Bike.findByIdAndUpdate(rent.bike, {isAvailable: true}, {new: true}, (err, bike) => {
            if (err)
                return res.status(500).json({message: err});
            res.json({message: "Bike rent has been successfully deleted"})
        })
    })
}
