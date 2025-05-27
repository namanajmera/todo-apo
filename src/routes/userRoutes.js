import express from 'express';
import { deleteMe, getMe, updateMe } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/profile', getMe);
router.put('/profile', updateMe);
router.delete('/profile', deleteMe);

export default router;