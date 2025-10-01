import express from 'express';
import { vCreate } from '../controllers/payment.controller.js';
import { protect } from '../middleware/authentication.middleware.js';

const router = express.Router();

router.post('/create', vCreate);

export default router;
