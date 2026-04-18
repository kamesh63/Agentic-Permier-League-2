// Real nutritional data per standard serving (sourced from USDA)
export interface FoodEntry {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const FOOD_DATABASE: FoodEntry[] = [
  // Proteins
  { name: 'Eggs (2 large)', serving: '100g', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Chicken Breast (grilled)', serving: '150g', calories: 231, protein: 43, carbs: 0, fat: 5 },
  { name: 'Salmon Fillet', serving: '150g', calories: 312, protein: 34, carbs: 0, fat: 18 },
  { name: 'Paneer', serving: '100g', calories: 265, protein: 18, carbs: 1.2, fat: 21 },
  { name: 'Greek Yogurt', serving: '200g', calories: 130, protein: 20, carbs: 8, fat: 0.7 },
  { name: 'Whey Protein Shake', serving: '1 scoop (30g)', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: 'Tofu', serving: '150g', calories: 114, protein: 12, carbs: 2.4, fat: 6.6 },
  { name: 'Tuna Can', serving: '100g', calories: 116, protein: 26, carbs: 0, fat: 1 },

  // Carbs
  { name: 'Brown Rice (cooked)', serving: '200g', calories: 248, protein: 5.5, carbs: 52, fat: 2 },
  { name: 'White Rice (cooked)', serving: '200g', calories: 260, protein: 4.4, carbs: 56, fat: 0.4 },
  { name: 'Oatmeal', serving: '50g dry', calories: 190, protein: 6.7, carbs: 34, fat: 3.4 },
  { name: 'Sweet Potato', serving: '200g', calories: 172, protein: 3.2, carbs: 40, fat: 0.2 },
  { name: 'Banana', serving: '1 medium (120g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Whole Wheat Bread', serving: '2 slices (60g)', calories: 160, protein: 8, carbs: 28, fat: 2.4 },
  { name: 'Roti / Chapati', serving: '2 pieces', calories: 220, protein: 6, carbs: 36, fat: 6 },
  { name: 'Pasta (cooked)', serving: '200g', calories: 262, protein: 9, carbs: 50, fat: 1.6 },

  // Fats & Snacks
  { name: 'Almonds', serving: '30g (23 nuts)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Peanut Butter', serving: '2 tbsp (32g)', calories: 188, protein: 8, carbs: 6, fat: 16 },
  { name: 'Avocado', serving: '1/2 (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 15 },
  { name: 'Olive Oil', serving: '1 tbsp (14ml)', calories: 119, protein: 0, carbs: 0, fat: 14 },

  // Meals
  { name: 'Dal + Rice', serving: '1 plate', calories: 380, protein: 14, carbs: 62, fat: 8 },
  { name: 'Chicken Biryani', serving: '1 plate (300g)', calories: 490, protein: 28, carbs: 52, fat: 18 },
  { name: 'Grilled Chicken Salad', serving: '1 bowl', calories: 320, protein: 35, carbs: 12, fat: 14 },
  { name: 'Egg Omelette (2 eggs)', serving: '1 serving', calories: 188, protein: 14, carbs: 1.6, fat: 14 },
  { name: 'Idli + Sambar', serving: '4 idli', calories: 290, protein: 8, carbs: 52, fat: 4 },
  { name: 'Dosa + Chutney', serving: '2 dosa', calories: 310, protein: 6, carbs: 40, fat: 14 },
  { name: 'Protein Bowl', serving: '1 bowl', calories: 450, protein: 40, carbs: 35, fat: 16 },
  { name: 'Smoothie Bowl', serving: '1 bowl', calories: 340, protein: 12, carbs: 52, fat: 10 },

  // Drinks
  { name: 'Black Coffee', serving: '1 cup', calories: 2, protein: 0.3, carbs: 0, fat: 0 },
  { name: 'Milk (whole)', serving: '250ml', calories: 150, protein: 8, carbs: 12, fat: 8 },
  { name: 'Lassi (sweet)', serving: '250ml', calories: 220, protein: 6, carbs: 32, fat: 7 },
  { name: 'Coconut Water', serving: '250ml', calories: 46, protein: 1.7, carbs: 9, fat: 0.5 },
];

// Real exercise data using MET values (Metabolic Equivalent of Task)
// Calories burned = MET × weight(kg) × duration(hours)
export interface ExerciseEntry {
  name: string;
  met: number; // MET value from Compendium of Physical Activities
  category: string;
}

export const EXERCISE_DATABASE: ExerciseEntry[] = [
  // Strength
  { name: 'Bench Press', met: 6.0, category: 'Strength' },
  { name: 'Squats (barbell)', met: 6.0, category: 'Strength' },
  { name: 'Deadlift', met: 6.0, category: 'Strength' },
  { name: 'Overhead Press', met: 6.0, category: 'Strength' },
  { name: 'Barbell Row', met: 6.0, category: 'Strength' },
  { name: 'Pull-ups', met: 8.0, category: 'Strength' },
  { name: 'Push-ups', met: 8.0, category: 'Strength' },
  { name: 'Lunges', met: 5.0, category: 'Strength' },
  { name: 'Bicep Curls', met: 4.0, category: 'Strength' },
  { name: 'Tricep Dips', met: 5.0, category: 'Strength' },
  { name: 'Leg Press', met: 5.0, category: 'Strength' },
  { name: 'Lat Pulldown', met: 5.0, category: 'Strength' },

  // Cardio
  { name: 'Running (8 km/h)', met: 8.3, category: 'Cardio' },
  { name: 'Running (10 km/h)', met: 10.0, category: 'Cardio' },
  { name: 'Cycling (moderate)', met: 6.8, category: 'Cardio' },
  { name: 'Jump Rope', met: 12.3, category: 'Cardio' },
  { name: 'Swimming (laps)', met: 7.0, category: 'Cardio' },
  { name: 'Walking (brisk)', met: 4.3, category: 'Cardio' },
  { name: 'Rowing Machine', met: 7.0, category: 'Cardio' },
  { name: 'Stair Climbing', met: 9.0, category: 'Cardio' },

  // Flexibility & Core
  { name: 'Plank Hold', met: 3.8, category: 'Core' },
  { name: 'Yoga', met: 3.0, category: 'Flexibility' },
  { name: 'Stretching', met: 2.3, category: 'Flexibility' },
  { name: 'Crunches', met: 3.8, category: 'Core' },
  { name: 'Burpees', met: 12.0, category: 'HIIT' },
];

// Calculate calories burned for a strength exercise
// Formula: MET × bodyWeight(kg) × (sets × reps × 4 seconds per rep) / 3600
export function calcStrengthCalories(met: number, bodyWeightKg: number, sets: number, reps: number): number {
  const timeSeconds = sets * reps * 4; // ~4 seconds per rep average
  const restSeconds = (sets - 1) * 60; // ~60 second rest between sets
  const totalHours = (timeSeconds + restSeconds) / 3600;
  return Math.round(met * bodyWeightKg * totalHours);
}

// Calculate calories burned for cardio
// Formula: MET × bodyWeight(kg) × duration(hours)
export function calcCardioCalories(met: number, bodyWeightKg: number, durationMinutes: number): number {
  return Math.round(met * bodyWeightKg * (durationMinutes / 60));
}

// TDEE Calculator using Mifflin-St Jeor Equation
export function calcBMR(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: { label: 'Sedentary (desk job)', value: 1.2 },
  light: { label: 'Lightly Active (1-3 days/week)', value: 1.375 },
  moderate: { label: 'Moderately Active (3-5 days/week)', value: 1.55 },
  active: { label: 'Very Active (6-7 days/week)', value: 1.725 },
  extreme: { label: 'Athlete (2x/day training)', value: 1.9 },
} as const;

export type ActivityLevel = keyof typeof ACTIVITY_MULTIPLIERS;
export type WeightGoal = 'lose' | 'maintain' | 'gain';

// Recommended daily surplus/deficit
export function getGoalCalories(tdee: number, goal: WeightGoal): { target: number; description: string } {
  switch (goal) {
    case 'lose': return { target: tdee - 500, description: '~0.5 kg/week loss (500 kcal deficit)' };
    case 'gain': return { target: tdee + 400, description: '~0.4 kg/week gain (400 kcal surplus)' };
    default: return { target: tdee, description: 'Maintain current weight' };
  }
}
