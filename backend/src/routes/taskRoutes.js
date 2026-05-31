import express from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  patchStatus, 
  getHabitHistory 
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', patchStatus);
router.get('/habithistory', getHabitHistory);

export default router;
