import React, { useState, useMemo } from 'react';
import { useFitnessStore } from '../stores/fitnessStore';
import { FOOD_DATABASE, type FoodEntry } from '../data/fitnessData';

const Nutrition: React.FC = () => {
  const s = useFitnessStore();
  const macros = s.getTodayMacros();
  const consumed = s.getTodayCaloriesConsumed();
  const { target } = s.getCalorieTarget();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FoodEntry | null>(null);
  const [qty, setQty] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customCal, setCustomCal] = useState(200);
  const [customP, setCustomP] = useState(15);
  const [customC, setCustomC] = useState(20);
  const [customF, setCustomF] = useState(8);
  const [mode, setMode] = useState<'saved' | 'search' | 'custom'>('saved');

  const results = useMemo(() => {
    if (!search.trim()) return FOOD_DATABASE.slice(0, 8);
    const q = search.toLowerCase();
    return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q));
  }, [search]);

  const handleAddFood = (food: FoodEntry, quantity: number) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    s.addMeal({
      name: food.name + (quantity > 1 ? ` ×${quantity}` : ''),
      serving: food.serving,
      calories: Math.round(food.calories * quantity),
      protein: Math.round(food.protein * quantity * 10) / 10,
      carbs: Math.round(food.carbs * quantity * 10) / 10,
      fat: Math.round(food.fat * quantity * 10) / 10,
      time,
    });
    setSelected(null); setSearch(''); setQty(1);
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    s.addMeal({ name: customName, serving: 'custom', calories: customCal, protein: customP, carbs: customC, fat: customF, time });
    setCustomName(''); setCustomCal(200); setCustomP(15); setCustomC(20); setCustomF(8);
  };

  const proteinTarget = Math.round(s.profile.weightKg * (s.profile.goal === 'gain' ? 2 : 1.6));
  const carbTarget = Math.round((target * 0.45) / 4);
  const fatTarget = Math.round((target * 0.25) / 9);

  return (
    <>
      <div className="page-header">
        <span className="eyebrow">Nutrition</span>
        <h1>Fuel Your Performance</h1>
        <p>Real USDA values. Target: <strong style={{ color: 'var(--accent)' }}>{target} kcal/day</strong></p>
      </div>

      <div className="stat-grid stat-grid-3">
        <div className="stat-tile"><span className="label">Consumed</span><span className="value" style={{ color: consumed > target ? 'var(--accent-red)' : 'var(--accent)' }}>{consumed}</span><span style={{ fontSize: '0.58rem', color: 'var(--text-faint)' }}>of {target} kcal</span></div>
        <div className="stat-tile"><span className="label">Remaining</span><span className="value" style={{ color: 'var(--accent-green)' }}>{Math.max(0, target - consumed)}</span></div>
        <div className="stat-tile"><span className="label">Meals</span><span className="value" style={{ color: 'var(--accent-amber)' }}>{s.mealLogs.length}</span></div>
      </div>

      <div className="card">
        <div className="card-header"><div><div className="card-label">Macros</div><h3 className="card-title">Daily Breakdown</h3></div></div>
        <div className="stat-grid stat-grid-3">
          {[
            { label: 'Protein', value: macros.protein, goal: proteinTarget, color: 'var(--accent-green)' },
            { label: 'Carbs', value: macros.carbs, goal: carbTarget, color: 'var(--accent-amber)' },
            { label: 'Fat', value: macros.fat, goal: fatTarget, color: 'var(--accent)' },
          ].map((m) => (
            <div className="stat-tile" key={m.label}>
              <span className="label">{m.label}</span>
              <span className="value" style={{ color: m.color, fontSize: '1.05rem' }}>{m.value}g <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)', fontWeight: 500 }}>/ {m.goal}g</span></span>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${m.goal > 0 ? Math.min(100, (m.value / m.goal) * 100) : 0}%`, background: m.color }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div><div className="card-label">Log</div><h3 className="card-title">Add Meal</h3></div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['saved', 'search', 'custom'] as const).map((m) => (
                <button key={m} className={mode === m ? 'btn-primary' : 'btn-secondary'} onClick={() => { setMode(m); setSelected(null); }} style={{ padding: '5px 12px', fontSize: '0.68rem', textTransform: 'capitalize' }}>{m === 'saved' ? 'My Foods' : m === 'search' ? 'Search All' : 'Custom'}</button>
              ))}
            </div>
          </div>

          {/* ===== Saved Foods ===== */}
          {mode === 'saved' && (
            <>
              {s.savedFoods.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: 8 }}>No saved foods yet.</p>
                  <p style={{ color: 'var(--text-faint)', fontSize: '0.72rem' }}>Search for foods in "Search All" and save them for quick access!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 340, overflowY: 'auto' }}>
                  {s.savedFoods.map((f) => (
                    <div key={f.name} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)',
                    }}>
                      <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleAddFood(f, 1)}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.name}</div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: 2 }}>
                          {f.calories} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleAddFood(f, 1)} style={{
                          padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: 'var(--accent)', color: '#fff', fontSize: '0.68rem', fontWeight: 700,
                        }}>+ Add</button>
                        <button onClick={() => s.removeSavedFood(f.name)} style={{
                          padding: '4px 8px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
                          background: 'transparent', color: 'var(--accent-red)', fontSize: '0.68rem',
                        }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ===== Search All ===== */}
          {mode === 'search' && (
            <>
              <div>
                <label className="input-label">Search Food Database</label>
                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setSelected(null); }} placeholder="e.g. eggs, chicken, rice..." className="input-field" />
              </div>

              {!selected && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, maxHeight: 220, overflowY: 'auto' }}>
                  {results.map((f) => (
                    <button key={f.name} onClick={() => setSelected(f)} style={{
                      textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)',
                      color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'background 0.15s',
                    }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                       onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 2 }}>
                        {f.serving} · {f.calories} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g
                      </div>
                    </button>
                  ))}
                  {results.length === 0 && <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', padding: 10 }}>No results found.</div>}
                </div>
              )}

              {selected && (
                <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: 'rgba(124,110,247,0.06)', border: '1px solid rgba(124,110,247,0.12)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selected.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: 12 }}>{selected.serving}</div>
                    </div>
                    <button onClick={() => { s.addSavedFood(selected); }} style={{
                      padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(52,211,153,0.3)',
                      background: 'rgba(52,211,153,0.1)', color: 'var(--accent-green)',
                      cursor: 'pointer', fontSize: '0.66rem', fontWeight: 700, fontFamily: 'var(--font)',
                    }}>
                      {s.savedFoods.some((f) => f.name === selected.name) ? '✓ Saved' : '★ Save'}
                    </button>
                  </div>
                  <div className="grid-form-2">
                    <div className="span-2">
                      <label className="input-label">Servings</label>
                      <input type="number" value={qty} onChange={(e) => setQty(Math.max(0.5, +e.target.value))} min={0.5} step={0.5} className="input-field" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12, textAlign: 'center', fontSize: '0.75rem' }}>
                    <div><div style={{ color: 'var(--text-dim)' }}>Calories</div><strong>{Math.round(selected.calories * qty)}</strong></div>
                    <div><div style={{ color: 'var(--text-dim)' }}>Protein</div><strong style={{ color: 'var(--accent-green)' }}>{Math.round(selected.protein * qty)}g</strong></div>
                    <div><div style={{ color: 'var(--text-dim)' }}>Carbs</div><strong style={{ color: 'var(--accent-amber)' }}>{Math.round(selected.carbs * qty)}g</strong></div>
                    <div><div style={{ color: 'var(--text-dim)' }}>Fat</div><strong style={{ color: 'var(--accent)' }}>{Math.round(selected.fat * qty)}g</strong></div>
                  </div>
                  <button className="btn-primary" onClick={() => handleAddFood(selected, qty)} style={{ marginTop: 14 }}>+ Add to Log (+10 XP)</button>
                </div>
              )}
            </>
          )}

          {/* ===== Custom ===== */}
          {mode === 'custom' && (
            <div className="grid-form-2" style={{ marginTop: 8 }}>
              <div className="span-2"><label className="input-label">Meal Name</label><input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Homemade Curry" className="input-field" /></div>
              {[
                { l: 'Calories', v: customCal, s: setCustomCal },
                { l: 'Protein (g)', v: customP, s: setCustomP },
                { l: 'Carbs (g)', v: customC, s: setCustomC },
                { l: 'Fat (g)', v: customF, s: setCustomF },
              ].map(({ l, v, s: setter }) => (
                <div key={l}><label className="input-label">{l}</label><input type="number" value={v} onChange={(e) => setter(+e.target.value)} min={0} className="input-field" /></div>
              ))}
              <div className="span-2"><button className="btn-primary" onClick={handleAddCustom} style={{ marginTop: 4 }}>+ Add Custom Meal (+10 XP)</button></div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header"><div><div className="card-label">History</div><h3 className="card-title">Meals Logged</h3></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {s.mealLogs.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>No meals logged yet.</p>}
            {s.mealLogs.map((m) => (
              <div className="list-item" key={m.id}>
                <div>
                  <div className="list-item-title">{m.name}</div>
                  <div className="list-item-sub">{m.time} · P:{m.protein}g C:{m.carbs}g F:{m.fat}g</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.85rem' }}>{m.calories}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Nutrition;
