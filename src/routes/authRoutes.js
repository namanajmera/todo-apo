import express from 'express';
import { changePassword, forgotPassword, login, logout, protect, resetPassword, signUp } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword)

router.get('/logout', logout);
router.post('/change-password', protect, changePassword);

export default router;