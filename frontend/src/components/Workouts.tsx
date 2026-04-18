import React, { useState, useMemo } from 'react';
import { useFitnessStore } from '../stores/fitnessStore';
import { EXERCISE_DATABASE, calcStrengthCalories, calcCardioCalories } from '../data/fitnessData';

const Workouts: React.FC = () => {
  const { workoutLogs, addWorkout, profile } = useFitnessStore();
  const [exerciseName, setExerciseName] = useState(EXERCISE_DATABASE[0].name);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(60);
  const [duration, setDuration] = useState(15);

  const selectedExercise = useMemo(() => EXERCISE_DATABASE.find((e) => e.name === exerciseName), [exerciseName]);
  const isCardio = selectedExercise?.category === 'Cardio' || selectedExercise?.category === 'HIIT';

  const estimatedCalories = useMemo(() => {
    if (!selectedExercise) return 0;
    if (isCardio) return calcCardioCalories(selectedExercise.met, profile.weightKg, duration);
    return calcStrengthCalories(selectedExercise.met, profile.weightKg, sets, reps);
  }, [selectedExercise, isCardio, sets, reps, duration, profile.weightKg]);

  const handleAdd = () => {
    addWorkout({
      exercise: exerciseName,
      sets: isCardio ? 1 : sets,
      reps: isCardio ? 1 : reps,
      weight: isCardio ? 0 : weight,
      caloriesBurned: estimatedCalories,
      duration: isCardio ? duration : Math.round((sets * reps * 4 + (sets - 1) * 60) / 60),
    });
  };

  const todayLogs = workoutLogs.filter((w) => w.date === 'Today');
  const todayBurned = todayLogs.reduce((s, w) => s + w.caloriesBurned, 0);

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Workout Tracker</span>
        <h1>Log Your Workout</h1>
        <p>Calorie burns calculated using MET values × your body weight ({profile.weightKg}kg).</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div><div className="card-label">New Entry</div><h3 className="card-title">Add Exercise</h3></div>
          </div>
          <div className="grid-form-2">
            <div className="span-2">
              <label className="input-label">Exercise</label>
              <select value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} className="input-field">
                {['Strength', 'Cardio', 'Core', 'HIIT', 'Flexibility'].map((cat) => (
                  <optgroup label={cat} key={cat}>
                    {EXERCISE_DATABASE.filter((ex) => ex.category === cat).map((ex) => (
                      <option key={ex.name} value={ex.name}>{ex.name} (MET: {ex.met})</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {isCardio ? (
              <div className="span-2">
                <label className="input-label">Duration (minutes)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(+e.target.value)} min={1} className="input-field" />
              </div>
            ) : (
              <>
                <div>
                  <label className="input-label">Sets</label>
                  <input type="number" value={sets} onChange={(e) => setSets(+e.target.value)} min={1} className="input-field" />
                </div>
                <div>
                  <label className="input-label">Reps</label>
                  <input type="number" value={reps} onChange={(e) => setReps(+e.target.value)} min={1} className="input-field" />
                </div>
                <div className="span-2">
                  <label className="input-label">Weight (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(+e.target.value)} min={0} className="input-field" />
                </div>
              </>
            )}
          </div>

          {/* Live Calorie Estimate */}
          <div style={{
            margin: '18px 0', padding: '16px 18px', borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(124,110,247,0.08), rgba(52,211,153,0.06))',
            border: '1px solid rgba(124,110,247,0.12)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Estimated Calories</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: 2 }}>
                MET {selectedExercise?.met} × {profile.weightKg}kg × {isCardio ? `${duration}min` : `${sets}×${reps} reps`}
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green)' }}>
              {estimatedCalories} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>kcal</span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleAdd}>+ Log Exercise</button>
        </div>

        <div className="card">
          <div className="card-header">
            <div><div className="card-label">Today</div><h3 className="card-title">Session Summary</h3></div>
          </div>
          <div className="stat-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="stat-tile">
              <span className="label">Exercises</span>
              <span className="value" style={{ color: 'var(--accent)' }}>{todayLogs.length}</span>
            </div>
            <div className="stat-tile">
              <span className="label">Calories Burned</span>
              <span className="value" style={{ color: 'var(--accent-green)' }}>{todayBurned}</span>
            </div>
            <div className="stat-tile">
              <span className="label">Total Sets</span>
              <span className="value" style={{ color: 'var(--accent-amber)' }}>{todayLogs.reduce((s,w)=>s+w.sets,0)}</span>
            </div>
            <div className="stat-tile">
              <span className="label">Duration</span>
              <span className="value" style={{ color: '#60a5fa' }}>{todayLogs.reduce((s,w)=>s+w.duration,0)}m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div><div className="card-label">History</div><h3 className="card-title">Workout Log</h3></div>
          <div className="pill" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>{workoutLogs.length} entries</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {workoutLogs.map((w) => (
            <div className="list-item" key={w.id}>
              <div>
                <div className="list-item-title">{w.exercise}</div>
                <div className="list-item-sub">
                  {w.sets > 1 ? `${w.sets}×${w.reps} reps` : `${w.duration} min`}
                  {w.weight > 0 ? ` · ${w.weight}kg` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-green)', fontSize: '0.88rem' }}>{w.caloriesBurned} kcal</div>
                <div className="list-item-sub">{w.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Workouts;
