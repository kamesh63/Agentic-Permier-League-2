import React from 'react';
import { useFitnessStore } from '../stores/fitnessStore';

const Dashboard: React.FC = () => {
  const s = useFitnessStore();
  const level = s.getLevel();
  const tdee = s.getTDEE();
  const { target, description } = s.getCalorieTarget();
  const consumed = s.getTodayCaloriesConsumed();
  const burned = s.getTodayCaloriesBurned();
  const macros = s.getTodayMacros();
  const calPct = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  const remaining = target - consumed;
  const net = consumed - burned;

  const goalLabel = s.profile.goal === 'gain' ? 'Surplus' : s.profile.goal === 'lose' ? 'Deficit' : 'Balance';
  const goalDiff = s.profile.goal === 'gain' ? consumed - tdee : tdee - consumed;
  const weightDiff = Math.abs(s.profile.targetWeightKg - s.profile.weightKg);
  const weeksToGoal = s.profile.goal === 'maintain' ? 0 : Math.round(weightDiff / (s.profile.goal === 'lose' ? 0.5 : 0.4));

  const proteinTarget = Math.round(s.profile.weightKg * (s.profile.goal === 'gain' ? 2 : 1.6));
  const carbTarget = Math.round((target * 0.45) / 4);
  const fatTarget = Math.round((target * 0.25) / 9);

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Overview</span>
        <h1>Welcome, {s.userName}</h1>
        <p>Goal: <strong style={{ color: 'var(--accent)' }}>{s.profile.goal === 'gain' ? 'Muscle Gain' : s.profile.goal === 'lose' ? 'Fat Loss' : 'Maintain'}</strong> — {description}</p>
      </div>

      <div className="stat-grid stat-grid-4">
        <div className="stat-tile"><span className="label">TDEE</span><span className="value" style={{ color: 'var(--accent)' }}>{tdee}</span><span style={{ fontSize: '0.6rem', color: 'var(--text-faint)' }}>kcal/day</span></div>
        <div className="stat-tile"><span className="label">Target</span><span className="value" style={{ color: 'var(--accent-green)' }}>{target}</span><span style={{ fontSize: '0.6rem', color: 'var(--text-faint)' }}>kcal/day</span></div>
        <div className="stat-tile"><span className="label">Burned Today</span><span className="value" style={{ color: 'var(--accent-amber)' }}>{burned}</span><span style={{ fontSize: '0.6rem', color: 'var(--text-faint)' }}>kcal exercise</span></div>
        <div className="stat-tile"><span className="label">Net Calories</span><span className="value" style={{ color: net > target ? 'var(--accent-red)' : 'var(--accent-green)' }}>{net}</span><span style={{ fontSize: '0.6rem', color: 'var(--text-faint)' }}>intake − burned</span></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div><div className="card-label">Daily Target</div><h3 className="card-title">Calorie Intake</h3></div>
            <div className="pill" style={{ background: calPct > 100 ? 'rgba(248,113,113,0.15)' : 'var(--accent-glow)', color: calPct > 100 ? 'var(--accent-red)' : 'var(--accent)' }}>{calPct}%</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0 16px' }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
              <svg viewBox="0 0 140 140" width="140" height="140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="9" />
                <circle cx="70" cy="70" r="60" fill="none" stroke={calPct > 100 ? 'var(--accent-red)' : 'var(--accent)'} strokeWidth="9"
                  strokeDasharray={`${Math.min(calPct, 100) * 3.77} ${377 - Math.min(calPct, 100) * 3.77}`}
                  strokeDashoffset="94" strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ fontSize: '1.4rem', fontWeight: 800 }}>{consumed}</strong>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>of {target} kcal</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: remaining > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600, marginBottom: 16 }}>
            {remaining > 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over target`}
          </div>
          <div className="stat-grid stat-grid-3">
            {[
              { label: 'Protein', value: macros.protein, goal: proteinTarget, color: 'var(--accent-green)' },
              { label: 'Carbs', value: macros.carbs, goal: carbTarget, color: 'var(--accent-amber)' },
              { label: 'Fat', value: macros.fat, goal: fatTarget, color: 'var(--accent)' },
            ].map((m) => (
              <div className="stat-tile" key={m.label}>
                <span className="label">{m.label}</span>
                <span className="value" style={{ color: m.color, fontSize: '1rem' }}>{m.value}g</span>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${m.goal > 0 ? Math.min(100, (m.value / m.goal) * 100) : 0}%`, background: m.color }} /></div>
                <span style={{ fontSize: '0.58rem', color: 'var(--text-faint)' }}>Goal: {m.goal}g</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header"><div><div className="card-label">Goal</div><h3 className="card-title">{s.profile.weightKg}kg → {s.profile.targetWeightKg}kg</h3></div></div>
            <div className="progress-bar" style={{ height: 8, marginBottom: 6 }}>
              <div className="progress-fill" style={{ width: '35%', background: 'var(--accent)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              <span>{goalLabel}: {goalDiff > 0 ? '+' : ''}{goalDiff} kcal today</span>
              {weeksToGoal > 0 && <span>~{weeksToGoal} weeks</span>}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div><div className="card-label">Hydration</div><h3 className="card-title">Water</h3></div></div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '2px 0 12px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  width: 34, height: 34, borderRadius: 9, fontSize: '0.8rem',
                  background: i < s.waterGlasses ? 'rgba(96,165,250,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${i < s.waterGlasses ? 'rgba(96,165,250,0.25)' : 'var(--border)'}`,
                  display: 'grid', placeItems: 'center', transition: 'all 0.2s ease',
                }}>💧</div>
              ))}
            </div>
            <button className="btn-primary" onClick={s.addWater}>+ Add Glass (+5 XP)</button>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-header"><div><div className="card-label">Activity</div><h3 className="card-title">Recent Workouts</h3></div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.workoutLogs.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>No workouts yet. Go to Workouts tab!</p>}
              {s.workoutLogs.slice(0, 3).map((w) => (
                <div className="list-item" key={w.id}>
                  <div>
                    <div className="list-item-title">{w.exercise}</div>
                    <div className="list-item-sub">{w.sets > 1 ? `${w.sets}×${w.reps}` : `${w.duration}min`} · {w.caloriesBurned} kcal</div>
                  </div>
                  <div className="list-item-badge">{w.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
