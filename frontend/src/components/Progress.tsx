import React, { useRef, useEffect } from 'react';
import { useFitnessStore } from '../stores/fitnessStore';
import { ACTIVITY_MULTIPLIERS } from '../data/fitnessData';

const BarChart: React.FC<{ data: number[]; color: string; label: string }> = ({ data, color, label }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement!.clientWidth, h = 120;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    const max = Math.max(...data) * 1.25 || 1;
    const bw = (w - 32) / data.length;
    ctx.clearRect(0, 0, w, h);
    data.forEach((v, i) => {
      const bh = (v / max) * (h - 28);
      const x = 16 + i * bw + bw * 0.15;
      const bwi = bw * 0.7;
      ctx.fillStyle = color + '22'; ctx.beginPath(); ctx.roundRect(x, h - 20 - bh, bwi, bh, 5); ctx.fill();
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, h - 20 - bh, bwi, Math.min(bh, bh * 0.5), 5); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(days[i], x + bwi / 2, h - 4);
    });
  }, [data, color]);
  return (
    <div className="card">
      <div className="card-header"><div><div className="card-label">Weekly</div><h3 className="card-title">{label}</h3></div></div>
      <div style={{ width: '100%' }}><canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} /></div>
    </div>
  );
};

const Progress: React.FC = () => {
  const s = useFitnessStore();
  const level = s.getLevel();
  const xpInLevel = s.getXPInCurrentLevel();
  const bmr = s.getBMR();
  const tdee = s.getTDEE();
  const { target, description } = s.getCalorieTarget();
  const xpPct = (xpInLevel / 500) * 100;

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Analytics & Settings</span>
        <h1>Your Progress</h1>
        <p>{description}</p>
      </div>

      {/* Profile Editor */}
      <div className="card">
        <div className="card-header"><div><div className="card-label">Profile</div><h3 className="card-title">Your Body Stats</h3></div></div>
        <div className="grid-form-2">
          <div>
            <label className="input-label">Gender</label>
            <select value={s.profile.gender} onChange={(e) => s.setProfile({ gender: e.target.value as 'male' | 'female' })} className="input-field">
              <option value="male">Male</option><option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="input-label">Age</label>
            <input type="number" value={s.profile.age} onChange={(e) => s.setProfile({ age: +e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="input-label">Weight (kg)</label>
            <input type="number" value={s.profile.weightKg} onChange={(e) => s.setProfile({ weightKg: +e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="input-label">Height (cm)</label>
            <input type="number" value={s.profile.heightCm} onChange={(e) => s.setProfile({ heightCm: +e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="input-label">Activity Level</label>
            <select value={s.profile.activityLevel} onChange={(e) => s.setProfile({ activityLevel: e.target.value as any })} className="input-field">
              {Object.entries(ACTIVITY_MULTIPLIERS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Goal</label>
            <select value={s.profile.goal} onChange={(e) => s.setProfile({ goal: e.target.value as any })} className="input-field">
              <option value="lose">Fat Loss (-500 kcal/day)</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Muscle Gain (+400 kcal/day)</option>
            </select>
          </div>
          <div className="span-2">
            <label className="input-label">Target Weight (kg)</label>
            <input type="number" value={s.profile.targetWeightKg} onChange={(e) => s.setProfile({ targetWeightKg: +e.target.value })} className="input-field" />
          </div>
        </div>
      </div>

      {/* Calculated Stats */}
      <div className="stat-grid stat-grid-4">
        <div className="stat-tile"><span className="label">BMR</span><span className="value" style={{ color: 'var(--accent)' }}>{bmr}</span><span style={{ fontSize: '0.58rem', color: 'var(--text-faint)' }}>kcal/day at rest</span></div>
        <div className="stat-tile"><span className="label">TDEE</span><span className="value" style={{ color: 'var(--accent-green)' }}>{tdee}</span><span style={{ fontSize: '0.58rem', color: 'var(--text-faint)' }}>total daily expenditure</span></div>
        <div className="stat-tile"><span className="label">Daily Target</span><span className="value" style={{ color: 'var(--accent-amber)' }}>{target}</span><span style={{ fontSize: '0.58rem', color: 'var(--text-faint)' }}>kcal for your goal</span></div>
        <div className="stat-tile"><span className="label">Protein Target</span><span className="value" style={{ color: '#60a5fa' }}>{Math.round(s.profile.weightKg * (s.profile.goal === 'gain' ? 2 : 1.6))}g</span><span style={{ fontSize: '0.58rem', color: 'var(--text-faint)' }}>{s.profile.goal === 'gain' ? '2' : '1.6'}g per kg</span></div>
      </div>

      {/* Level */}
      <div className="card">
        <div className="card-header"><div><div className="card-label">Gamification</div><h3 className="card-title">Level {level}</h3></div>
          <div className="pill" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>{500 - xpInLevel} XP to Level {level + 1}</div>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${xpPct}%`, borderRadius: 5, background: 'linear-gradient(90deg, var(--accent), #a78bfa)', transition: 'width 0.7s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
          <span>Total XP: {s.userXP}</span>
          <span>{xpInLevel} / 500 XP</span>
        </div>
      </div>

      <div className="grid-equal-2">
        <BarChart data={s.weeklyCalories} color="#7c6ef7" label="Calories Consumed" />
        <BarChart data={s.weeklyWorkouts} color="#34d399" label="Workout Sessions" />
      </div>
    </>
  );
};

export default Progress;
