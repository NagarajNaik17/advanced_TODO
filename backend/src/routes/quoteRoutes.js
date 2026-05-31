import express from 'express';
import { getTodayQuote, getRandomQuote } from '../controllers/quoteController.js';

const router = express.Router();

router.get('/today', getTodayQuote);
router.get('/random', getRandomQuote);

export default router;
