import { create } from 'zustand';
import { calcBMR, ACTIVITY_MULTIPLIERS, getGoalCalories, type ActivityLevel, type WeightGoal, type FoodEntry } from '../data/fitnessData';

export interface WorkoutLog {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  caloriesBurned: number;
  duration: number;
  date: string;
}

export interface MealLog {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: WeightGoal;
  targetWeightKg: number;
}

export interface FitnessState {
  userName: string;
  userXP: number;
  streak: number;
  getLevel: () => number;
  getXPInCurrentLevel: () => number;

  savedFoods: FoodEntry[];
  addSavedFood: (food: FoodEntry) => void;
  removeSavedFood: (name: string) => void;

  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;

  activeTab: 'dashboard' | 'workouts' | 'nutrition' | 'progress';
  setActiveTab: (tab: FitnessState['activeTab']) => void;

  waterGlasses: number;
  addWater: () => void;

  workoutLogs: WorkoutLog[];
  addWorkout: (log: Omit<WorkoutLog, 'id' | 'date'>) => void;

  mealLogs: MealLog[];
  addMeal: (meal: Omit<MealLog, 'id'>) => void;

  weeklyCalories: number[];
  weeklyWorkouts: number[];

  getBMR: () => number;
  getTDEE: () => number;
  getCalorieTarget: () => { target: number; description: string };
  getTodayCaloriesBurned: () => number;
  getTodayCaloriesConsumed: () => number;
  getTodayMacros: () => { protein: number; carbs: number; fat: number };
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useFitnessStore = create<FitnessState>((set, get) => ({
  userName: 'Athlete',
  userXP: 0,
  streak: 1,
  getLevel: () => Math.floor(get().userXP / 500) + 1,
  getXPInCurrentLevel: () => get().userXP % 500,

  savedFoods: [],
  addSavedFood: (food) => set((s) => {
    if (s.savedFoods.some((f) => f.name === food.name)) return s;
    return { savedFoods: [...s.savedFoods, food] };
  }),
  removeSavedFood: (name) => set((s) => ({ savedFoods: s.savedFoods.filter((f) => f.name !== name) })),

  profile: { gender: 'male', age: 25, weightKg: 75, heightCm: 175, activityLevel: 'moderate', goal: 'gain', targetWeightKg: 80 },
  setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  waterGlasses: 0,
  addWater: () => set((s) => ({ waterGlasses: s.waterGlasses + 1, userXP: s.userXP + 5 })),

  workoutLogs: [],
  addWorkout: (log) => set((s) => ({ workoutLogs: [{ ...log, id: generateId(), date: 'Today' }, ...s.workoutLogs], userXP: s.userXP + 50 })),

  mealLogs: [],
  addMeal: (meal) => set((s) => ({ mealLogs: [{ ...meal, id: generateId() }, ...s.mealLogs], userXP: s.userXP + 10 })),

  weeklyCalories: [2100, 1950, 2300, 2050, 1800, 2200, 0],
  weeklyWorkouts: [1, 2, 1, 3, 0, 2, 0],

  getBMR: () => { const p = get().profile; return Math.round(calcBMR(p.weightKg, p.heightCm, p.age, p.gender)); },
  getTDEE: () => Math.round(get().getBMR() * ACTIVITY_MULTIPLIERS[get().profile.activityLevel].value),
  getCalorieTarget: () => getGoalCalories(get().getTDEE(), get().profile.goal),
  getTodayCaloriesBurned: () => get().workoutLogs.filter((w) => w.date === 'Today').reduce((s, w) => s + w.caloriesBurned, 0),
  getTodayCaloriesConsumed: () => get().mealLogs.reduce((s, m) => s + m.calories, 0),
  getTodayMacros: () => {
    const meals = get().mealLogs;
    return {
      protein: Math.round(meals.reduce((s, m) => s + m.protein, 0) * 10) / 10,
      carbs: Math.round(meals.reduce((s, m) => s + m.carbs, 0) * 10) / 10,
      fat: Math.round(meals.reduce((s, m) => s + m.fat, 0) * 10) / 10,
    };
  },
}));