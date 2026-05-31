import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import './Training.css';

export default function Training({ sessions, setSessions, nutrition, setNutrition }) {
  const [newName, setNewName] = useState('');
  const [openSession, setOpenSession] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [newExercise, setNewExercise] = useState('');
  const [newSet, setNewSet] = useState({ reps: '', weight: '' });

  const getDayKey = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const todayKey = getDayKey();

  const addSession = () => {
    if (!newName.trim()) return;
    setSessions([...sessions, { name: newName.trim(), exercises: [], lastDone: null }]);
    setNewName('');
  };

  const deleteSession = (i) => {
    setSessions(sessions.filter((_, idx) => idx !== i));
    if (openSession === i) setOpenSession(null);
  };

  const addExercise = (sIdx) => {
    if (!newExercise.trim()) return;
    const updated = sessions.map((s, i) =>
      i === sIdx ? { ...s, exercises: [...s.exercises, { name: newExercise.trim(), sets: [] }] } : s
    );
    setSessions(updated);
    setNewExercise('');
  };

  const addSet = (sIdx, eIdx) => {
    if (!newSet.reps) return;
    const updated = sessions.map((s, i) => {
      if (i !== sIdx) return s;
      return {
        ...s,
        exercises: s.exercises.map((e, j) =>
          j !== eIdx ? e : { ...e, sets: [...e.sets, { reps: Number(newSet.reps), weight: Number(newSet.weight) || 0, done: false }] }
        )
      };
    });
    setSessions(updated);
    setNewSet({ reps: '', weight: '' });
  };

  const deleteExercise = (sIdx, eIdx) => {
    const updated = sessions.map((s, i) =>
      i !== sIdx ? s : { ...s, exercises: s.exercises.filter((_, j) => j !== eIdx) }
    );
    setSessions(updated);
  };

  const deleteSet = (sIdx, eIdx, setIdx) => {
    const updated = sessions.map((s, i) => {
      if (i !== sIdx) return s;
      return {
        ...s,
        exercises: s.exercises.map((e, j) =>
          j !== eIdx ? e : { ...e, sets: e.sets.filter((_, k) => k !== setIdx) }
        )
      };
    });
    setSessions(updated);
  };

  const toggleSetDone = (sIdx, eIdx, setIdx) => {
    const updated = sessions.map((s, i) => {
      if (i !== sIdx) return s;
      return {
        ...s,
        exercises: s.exercises.map((e, j) =>
          j !== eIdx ? e : {
            ...e,
            sets: e.sets.map((set, k) =>
              k !== setIdx ? set : { ...set, done: !set.done }
            )
          }
        )
      };
    });
    setSessions(updated);
  };

  const startSession = (sIdx) => {
    setActiveSession(sIdx);
    setOpenSession(sIdx);
  };

  const finishSession = (sIdx) => {
    const key = todayKey;
    setNutrition(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        trainingDone: true,
      }
    }));
    setSessions(sessions.map((s, i) => i === sIdx ? { ...s, lastDone: key } : s));
    setActiveSession(null);
    setOpenSession(null);
  };

  return (
    <div className="training">
      <h1 className="page-title">Entraînements 🏋️</h1>

      <div className="add-card">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSession()}
          placeholder="Nom de la séance (ex: Pectoraux, Jambes…)"
          className="styled-input"
        />
        <button className="btn-primary" onClick={addSession}>+ Créer</button>
      </div>

      {sessions.map((s, sIdx) => (
        <div key={sIdx} className="session-card">
          <div className="session-header" onClick={() => setOpenSession(openSession === sIdx ? null : sIdx)}>
            <div>
              <h3 className="session-name">{s.name}</h3>
              <p className="session-meta">{s.exercises.length} exercice{s.exercises.length !== 1 ? 's' : ''}</p>
              {s.lastDone === todayKey && <span className="session-done-badge">Séance faite aujourd'hui</span>}
            </div>
            <div className="session-actions">
              {s.lastDone !== todayKey && (
                <button className="btn-secondary-sm" onClick={e => { e.stopPropagation(); startSession(sIdx); }}>
                  Commencer
                </button>
              )}
              <span className="chevron">{openSession === sIdx ? '▲' : '▼'}</span>
              <button className="btn-danger-sm" onClick={e => { e.stopPropagation(); deleteSession(sIdx); }}>✕</button>
            </div>
          </div>

          {openSession === sIdx && (
            <div className="session-body">
              <div className="add-row">
                <input
                  value={newExercise}
                  onChange={e => setNewExercise(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addExercise(sIdx)}
                  placeholder="Ajouter un exercice…"
                  className="styled-input"
                />
                <button className="btn-secondary" onClick={() => addExercise(sIdx)}>+ Exercice</button>
              </div>

              {s.exercises.map((ex, eIdx) => (
                <div key={eIdx} className="exercise-card">
                  <div className="exercise-header">
                    <strong>{ex.name}</strong>
                    <button className="btn-danger-sm" onClick={() => deleteExercise(sIdx, eIdx)}>✕</button>
                  </div>

                  <div className="set-cols-header">
                    <span>#</span>
                    <span>Kg</span>
                    <span>Reps</span>
                    <span></span>
                  </div>

                  <div className="sets-list">
                    {ex.sets.map((set, k) => (
                      <div key={k} className={`set-line ${set.done ? 'set-done' : ''}`}>
                        <span className="col-set">{k + 1}</span>
                        <span className="col-kg">{set.weight > 0 ? `${set.weight} kg` : '—'}</span>
                        <span className="col-reps">{set.reps} reps</span>
                        <div className="set-actions">
                          <button className={`check-btn ${set.done ? 'check-done' : ''}`} onClick={() => toggleSetDone(sIdx, eIdx, k)}>
                            {set.done ? '✔' : '○'}
                          </button>
                          <button className="set-delete-btn" onClick={() => deleteSet(sIdx, eIdx, k)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="set-add-row">
                    <input
                      type="number"
                      placeholder="Reps"
                      value={newSet.reps}
                      onChange={e => setNewSet({ ...newSet, reps: e.target.value })}
                      className="inline-input"
                    />
                    <input
                      type="number"
                      placeholder="Kg"
                      value={newSet.weight}
                      onChange={e => setNewSet({ ...newSet, weight: e.target.value })}
                      className="inline-input"
                    />
                    <button className="btn-secondary-sm" onClick={() => addSet(sIdx, eIdx)}>+ Série</button>
                  </div>
                </div>
              ))}
              {activeSession === sIdx && (
                <button className="btn-primary btn-finish" onClick={() => finishSession(sIdx)}>
                  Terminer la séance
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {sessions.length === 0 && (
        <div className="empty-state">
          <p style={{ fontSize: 48 }}>🏋️</p>
          <p>Aucune séance pour l'instant</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Crée ta première séance ci-dessus</p>
        </div>
      )}
    </div>
  );
}
