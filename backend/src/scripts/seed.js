import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quote from '../models/Quote.js';
import Achievement from '../models/Achievement.js';
import SystemConfig from '../models/SystemConfig.js';
import dayjs from 'dayjs';

dotenv.config();

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do. Your attitude determines how well you do it.", author: "Lou Holtz" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "An obstacles is often a stepping stone.", author: "Prescott" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "I attribute my success to this: I never gave or took any excuse.", author: "Florence Nightingale" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Do not wait; the time will never be 'just right.' Start where you stand.", author: "Napoleon Hill" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle Onassis" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Keep your eyes on the stars, and your feet on the ground.", author: "Theodore Roosevelt" },
  { text: "There is no traffic jam along the extra mile.", author: "Roger Staubach" },
  { text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Setting goals is the first step in turning the invisible into the visible.", author: "Tony Robbins" },
  { text: "Determine never to be idle. No person will have occasion to complain of the want of time who never loses any.", author: "Thomas Jefferson" },
  { text: "The index of a man's character is how he treats people who can't do him any good.", author: "Ann Landers" },
  { text: "Well begun is half done.", author: "Aristotle" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Productivity is being able to do things that you were never able to do before.", author: "Franz Kafka" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.", author: "Earl Nightingale" },
  { text: "If you spend too much time thinking about a thing, you'll never get it done.", author: "Bruce Lee" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali" },
  { text: "Knowing is not enough; we must apply. Willing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.", author: "Paul J. Meyer" },
  { text: "There is no royal road to anything. One thing at a time, all things in succession. That which grows fast, withers as rapidly. That which grows slowly, endures.", author: "Josiah Gilbert Holland" },
  { text: "If you don't design your own life plan, chances are you'll fall into someone else's plan. And guess what they have planned for you? Not much.", author: "Jim Rohn" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "You can do anything, but not everything.", author: "David Allen" },
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "The power of concentration is the only key to the treasure-house of knowledge.", author: "Swami Vivekananda" },
  { text: "Desire is the starting point of all achievement, not a hope, not a wish, but a keen pulsating desire which transcends everything.", author: "Napoleon Hill" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Don't yield to the temptation of comparison. Compare yourself only to who you were yesterday.", author: "Jordan Peterson" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "Work like there is someone working twenty-four hours a day to take it all away from you.", author: "Mark Cuban" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Courage is resistance to fear, mastery of fear - not absence of fear.", author: "Mark Twain" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "The best revenge is to be unlike him who performed the injury.", author: "Marcus Aurelius" },
  { text: "If it is not right do not do it; if it is not true do not say it.", author: "Marcus Aurelius" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love.", author: "Marcus Aurelius" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "Loss is nothing else but change, and change is Nature's delight.", author: "Marcus Aurelius" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "While we wait for life, life passes.", author: "Seneca" },
  { text: "He who is brave is free.", author: "Seneca" },
  { text: "No man is more unhappy than he who never faces adversity, for he is not permitted to prove himself.", author: "Seneca" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "If a man knows not to which port he sails, no wind is favorable.", author: "Seneca" },
  { text: "He suffers more than necessary, who suffers before it is necessary.", author: "Seneca" },
  { text: "Life is long if you know how to use it.", author: "Seneca" },
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
  { text: "The higher we are placed, the more humbly we should walk.", author: "Cicero" },
  { text: "To be content with what one has is the greatest and truest of riches.", author: "Cicero" },
  { text: "Before you begin, get good counsel; then, when you have decided, act promptly.", author: "Sallust" },
  { text: "Only those who dare to fail greatly can ever achieve greatly.", author: "Robert F. Kennedy" },
  { text: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
  { text: "Perseverance is not a long race; it is many short races one after the other.", author: "Walter Elliot" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "To win big, you sometimes have to take big risks.", author: "Bill Gates" },
  { text: "Patience and time do more than strength or passion.", author: "Jean de La Fontaine" },
  { text: "Be not afraid of going slowly, be afraid only of standing still.", author: "Chinese Proverb" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "There is only one good, knowledge, and one evil, ignorance.", author: "Socrates" },
  { text: "Wonder is the beginning of wisdom.", author: "Socrates" },
  { text: "To find yourself, think for yourself.", author: "Socrates" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "He is richest who is content with the least, for content is the wealth of nature.", author: "Socrates" },
  { text: "From the deepest desires oft times encounters the deadliest hate.", author: "Socrates" }
];

const achievements = [
  {
    key: 'first_task',
    title: 'First Step',
    description: 'Complete your first task',
    icon: 'CheckCircle'
  },
  {
    key: 'streak_7',
    title: 'Week of Iron',
    description: 'Achieve a 7-day streak on any repeatable task',
    icon: 'Flame'
  },
  {
    key: 'streak_30',
    title: 'Habit Master',
    description: 'Achieve a 30-day streak on any repeatable task',
    icon: 'Calendar'
  },
  {
    key: 'tasks_100',
    title: 'Centurion',
    description: 'Complete 100 tasks',
    icon: 'Award'
  },
  {
    key: 'tasks_500',
    title: 'Productivity Beast',
    description: 'Complete 500 tasks',
    icon: 'Zap'
  },
  {
    key: 'first_goal',
    title: 'Dream Chaser',
    description: 'Complete your first yearly goal',
    icon: 'Trophy'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Seed: Connected to Database...');

    // Seed Quotes
    const quoteCount = await Quote.countDocuments();
    if (quoteCount === 0) {
      await Quote.insertMany(quotes);
      console.log(`Seed: Inserted ${quotes.length} quotes.`);
    } else {
      console.log('Seed: Quotes already exist in database.');
    }

    // Seed Achievements
    for (const ach of achievements) {
      await Achievement.findOneAndUpdate(
        { key: ach.key },
        ach,
        { upsert: true, new: true }
      );
    }
    console.log('Seed: Seeded default achievements.');

    // Seed System Config
    const configCount = await SystemConfig.countDocuments();
    if (configCount === 0) {
      await SystemConfig.create({
        key: 'system_settings',
        lastResetDate: dayjs().format('YYYY-MM-DD')
      });
      console.log('Seed: Initialized system config with date:', dayjs().format('YYYY-MM-DD'));
    }

    console.log('Seed: Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed: Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
