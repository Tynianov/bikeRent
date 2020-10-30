const express = require('express');
const router = express.Router();
const controllers = require('../controllers/bikeControllers');


router.get('/available', controllers.availableBikeList);
router.get('/booked', controllers.bookedBikeList);
router.post('/add', controllers.addNewBike);
router.delete('/delete/:id', controllers.deleteBikeById);
router.patch('/update/:id', controllers.updateBikeById);
router.get('/page_metadata', controllers.pageMetadata);

module.exports = router;
