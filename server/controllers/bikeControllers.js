const Bike = require('../models/Bike')

module.exports.availableBikeList = function (req, res, next){
    Bike.find({isAvailable: true}, (err, bikes) => {
        if (err)
            return res.status(500).json({message: err});
        res.json({bikes: bikes})
    })
}

module.exports.bookedBikeList = function (req, res, next){
    Bike.find({isAvailable: false}, (err, bikes) => {
        if (err)
            return res.status(500).json({message: err});
        res.json({bikes: bikes})
    })
}

module.exports.addNewBike = function (req, res, next){
    Bike.create({
        bikeName: req.body.bikeName,
        bikeType: req.body.bikeType,
        price: req.body.price
    }, (err) => {
        if (err){
            return res.status(400).json({errors: err});
        }
        res.json({message: "Bike has been successfully added"})
    })
}

module.exports.deleteBikeById = function (req, res, next) {
    Bike.findByIdAndRemove(req.params.id, (err, bike) => {
        if (err)
            return res.status(500).json({errors: err});
        if (!bike)
            return res.status(404).json({note: "Bike not found"});
        res.json({message: "Bike has been successfully deleted"})
    })
}

module.exports.updateBikeById = function (req, res, next){
    Bike.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, bike) => {
        if (err)
            return res.status(500).json({errors: err});
        if (!bike)
            return res.status(404).json({note: "Bike not found"});
        res.json({note: bike, message: "Bike updated successfully"});
    })
}

module.exports.pageMetadata = function (req, res){
    let metadata = {
        bikeTypeChoices: Bike.BIKE_TYPE_CHOICES
    }
    return res.json(metadata)
}