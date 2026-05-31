import Quote from '../models/Quote.js';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear.js';

dayjs.extend(dayOfYear);

// Get quote of the day (stable for each calendar date)
export const getTodayQuote = async (req, res) => {
  try {
    const quotes = await Quote.find({});
    if (quotes.length === 0) {
      return res.json({
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
      });
    }

    const currentDayOfYear = dayjs().dayOfYear();
    const index = currentDayOfYear % quotes.length;
    res.json(quotes[index]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a random quote
export const getRandomQuote = async (req, res) => {
  try {
    const quotes = await Quote.find({});
    if (quotes.length === 0) {
      return res.json({
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
      });
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    res.json(quotes[randomIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
