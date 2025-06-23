const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middlewares/auth');

router.post('/', auth, appointmentController.criar);
router.get('/', auth, appointmentController.listarMeus);
router.put('/cancelar/:id', auth, appointmentController.cancelar);

module.exports = router;
