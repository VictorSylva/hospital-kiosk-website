import express from 'express';
import { submitVitals, getVitalsHistory, getAbnormalReadings } from '../controllers/vitalsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, submitVitals);
router.get('/:patientId', getVitalsHistory);
router.get('/alerts', getAbnormalReadings);

export default router;
