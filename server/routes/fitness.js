import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('fitness_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/goals', async (req, res) => {
  try {
    const { userId, goalType, target, deadline, description } = req.body;
    const { data, error } = await supabase
      .from('fitness_goals')
      .insert([{
        user_id: userId,
        goal_type: goalType,
        target,
        deadline,
        description
      }])
      .select();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('fitness_goals')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('fitness_goals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/workouts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/workouts', async (req, res) => {
  try {
    const { userId, workoutType, duration, caloriesBurned, exercises, notes } = req.body;
    const { data, error } = await supabase
      .from('workouts')
      .insert([{
        user_id: userId,
        workout_type: workoutType,
        duration,
        calories_burned: caloriesBurned,
        exercises,
        notes
      }])
      .select();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('fitness_progress')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/progress', async (req, res) => {
  try {
    const { userId, weight, bodyFat, measurements, date } = req.body;
    const { data, error } = await supabase
      .from('fitness_progress')
      .insert([{
        user_id: userId,
        weight,
        body_fat: bodyFat,
        measurements,
        date: date || new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
