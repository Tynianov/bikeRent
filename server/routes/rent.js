const express = require('express');
const router = express.Router();
const controllers = require('../controllers/rentControllers');

router.post('/create', controllers.createBikeRent);
router.get('/list', controllers.rentList);
router.get('/list/:id', controllers.rentDetails);
router.delete('/delete/:id', controllers.deleteRent)

module.exports = router;
