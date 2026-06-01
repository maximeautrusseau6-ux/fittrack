import { useEffect, useMemo, useState } from 'react';
import SessionCard from './SessionCard.jsx';
import SessionDrawer from './SessionDrawer.jsx';
import ExerciseDrawer from './ExerciseDrawer.jsx';
import SetDrawer from './SetDrawer.jsx';
import RestTimer from './RestTimer.jsx';
import TrainingStats from './TrainingStats.jsx';
import './Training.css';

const STORAGE_KEY = 'fittrack_training_data';
const DEFAULT_REST_SECONDS = 90;

const createNewData = () => ({ sessions: [] });

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function formatDateLabel(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function computeVolume(session) {
  return session.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.reduce((inner, set) => inner + set.weight * set.reps, 0),
    0
  );
}

function computeProgress(session) {
  const totalSets = session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  if (!totalSets) return 0;
  const completedSets = session.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length,
    0
  );
  return Math.round((completedSets / totalSets) * 100);
}

export default function TrainingPage({ setNavHidden }) {
  const [trainingData, setTrainingData] = useState(createNewData());
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionDrawerOpen, setSessionDrawerOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [exerciseDrawerOpen, setExerciseDrawerOpen] = useState(false);
  const [activeSessionForExercise, setActiveSessionForExercise] = useState(null);
  const [setDrawerOpen, setSetDrawerOpen] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);
  const [restTimerRunning, setRestTimerRunning] = useState(false);
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST_SECONDS);
  const [restMessage, setRestMessage] = useState('');

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      try {
        setTrainingData(JSON.parse(storedValue));
      } catch (error) {
        console.warn('Impossible de lire les données d’entraînement', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trainingData));
  }, [trainingData]);

  useEffect(() => {
    if (setNavHidden) {
      setNavHidden(sessionDrawerOpen || exerciseDrawerOpen || setDrawerOpen || restTimerRunning);
    }
  }, [sessionDrawerOpen, exerciseDrawerOpen, setDrawerOpen, restTimerRunning, setNavHidden]);

  useEffect(() => {
    if (!restTimerRunning) return undefined;
    const interval = setInterval(() => {
      setRestSeconds((current) => {
        if (current <= 1) {
          setRestTimerRunning(false);
          setRestMessage('Repos terminé — prêt pour la prochaine série.');
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimerRunning]);

  const sessions = trainingData.sessions;
  const selectedSession = sessions.find((session) => session.id === selectedSessionId) || null;

  const historyByExercise = useMemo(() => {
    return sessions.reduce((map, session) => {
      session.exercises.forEach((exercise) => {
        const existing = map[exercise.name] || null;
        if (!existing || new Date(session.updatedAt || session.createdAt) > new Date(existing.date)) {
          map[exercise.name] = {
            date: session.updatedAt || session.createdAt,
            weight: exercise.sets[exercise.sets.length - 1]?.weight || 0,
            reps: exercise.sets[exercise.sets.length - 1]?.reps || 0
          };
        }
      });
      return map;
    }, {});
  }, [sessions]);

  const stats = useMemo(() => {
    const completedSessions = sessions.length;
    const totalExercises = sessions.reduce((sum, session) => sum + session.exercises.length, 0);
    const totalSets = sessions.reduce((sum, session) => sum + session.exercises.reduce((s, exercise) => s + exercise.sets.length, 0), 0);
    const totalVolume = sessions.reduce((sum, session) => sum + computeVolume(session), 0);
    const favoriteExercise = sessions
      .flatMap((session) => session.exercises.map((exercise) => exercise.name))
      .reduce((freq, name) => ({ ...freq, [name]: (freq[name] || 0) + 1 }), {});
    const favoriteName = Object.keys(favoriteExercise).sort((a, b) => favoriteExercise[b] - favoriteExercise[a])[0] || '—';

    return {
      completedSessions,
      totalExercises,
      totalSets,
      totalVolume,
      favoriteName
    };
  }, [sessions]);

  const addSession = (sessionName) => {
    const newSession = {
      id: generateId(),
      name: sessionName.trim() || `Séance ${sessions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: []
    };
    setTrainingData((prev) => ({ sessions: [newSession, ...prev.sessions] }));
    setSelectedSessionId(newSession.id);
    setEditingSession(null);
    setSessionDrawerOpen(false);
  };

  const renameSession = (sessionName) => {
    if (!editingSession) return;
    setTrainingData((prev) => ({
      sessions: prev.sessions.map((session) =>
        session.id === editingSession.id
          ? { ...session, name: sessionName.trim() || session.name, updatedAt: new Date().toISOString() }
          : session
      )
    }));
    setEditingSession(null);
    setSessionDrawerOpen(false);
  };

  const removeSession = (sessionId) => {
    setTrainingData((prev) => ({
      sessions: prev.sessions.filter((session) => session.id !== sessionId)
    }));
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null);
    }
  };

  const openSessionEditor = (session) => {
    setEditingSession(session);
    setSessionDrawerOpen(true);
  };

  const openExerciseDrawer = (sessionId) => {
    setActiveSessionForExercise(sessionId);
    setExerciseDrawerOpen(true);
  };

  const addExercise = (exerciseName) => {
    if (!activeSessionForExercise) return;
    setTrainingData((prev) => ({
      sessions: prev.sessions.map((session) =>
        session.id === activeSessionForExercise
          ? {
              ...session,
              updatedAt: new Date().toISOString(),
              exercises: [
                ...session.exercises,
                {
                  id: generateId(),
                  name: exerciseName.trim() || `Exercice ${session.exercises.length + 1}`,
                  sets: []
                }
              ]
            }
          : session
      )
    }));
    setExerciseDrawerOpen(false);
  };

  const openSetDrawer = (exercise) => {
    setActiveExercise(exercise);
    setSetDrawerOpen(true);
  };

  const addSet = ({ weight, reps, note }) => {
    if (!selectedSession || !activeExercise) return;
    setTrainingData((prev) => ({
      sessions: prev.sessions.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              updatedAt: new Date().toISOString(),
              exercises: session.exercises.map((exercise) =>
                exercise.id === activeExercise.id
                  ? {
                      ...exercise,
                      sets: [
                        ...exercise.sets,
                        {
                          id: generateId(),
                          weight,
                          reps,
                          note,
                          completed: false,
                          createdAt: new Date().toISOString()
                        }
                      ]
                    }
                  : exercise
              )
            }
          : session
      )
    }));
    setSetDrawerOpen(false);
  };

  const toggleSetCompletion = (sessionId, exerciseId, setId) => {
    setTrainingData((prev) => ({
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: exercise.sets.map((set) =>
                        set.id === setId
                          ? {
                              ...set,
                              completed: !set.completed
                            }
                          : set
                      )
                    }
                  : exercise
              )
            }
          : session
      )
    }));
    setRestSeconds(DEFAULT_REST_SECONDS);
    setRestMessage('Repos activé après la série.');
    setRestTimerRunning(true);
  };

  const stopRest = () => {
    setRestTimerRunning(false);
    setRestMessage('Repos arrêté.');
  };

  const completedCount = selectedSession
    ? selectedSession.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length, 0)
    : 0;

  return (
    <div className="training-page">
      <div className="training-topbar">
        <div>
          <p className="training-label">Entraînement</p>
          <h1>Sessions & séances</h1>
          <p className="training-subtitle">Planifiez, suivez et revenez sur vos entraînements.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setSessionDrawerOpen(true)}>
          Nouvelle séance
        </button>
      </div>

      <TrainingStats stats={stats} />

      <section className="session-grid">
        {sessions.length ? (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              selected={selectedSessionId === session.id}
              onSelect={() => setSelectedSessionId(session.id)}
              onEdit={() => openSessionEditor(session)}
              onDelete={() => removeSession(session.id)}
            />
          ))
        ) : (
          <div className="empty-state-panel">
            <p>Aucune séance enregistrée pour le moment.</p>
            <small>Commencez par créer votre première séance et ajoutez des exercices simples.</small>
          </div>
        )}
      </section>

      {selectedSession && (
        <section className="session-detail-panel">
          <div className="session-detail-header">
            <button className="secondary-button" type="button" onClick={() => setSelectedSessionId(null)}>
              ← Retour à la liste
            </button>
            <div>
              <span className="session-badge">Séance active</span>
              <h2>{selectedSession.name}</h2>
              <p>{formatDateLabel(selectedSession.createdAt)} · {selectedSession.exercises.length} exercices</p>
            </div>
            <button className="secondary-button" type="button" onClick={() => openSessionEditor(selectedSession)}>
              Renommer
            </button>
          </div>

          <div className="session-progress-row">
            <div className="progress-meter">
              <span style={{ width: `${computeProgress(selectedSession)}%` }} />
            </div>
            <div className="session-progress-text">
              <strong>{computeProgress(selectedSession)}%</strong> de la séance terminée
            </div>
          </div>

          <div className="session-detail-actions">
            <button className="primary-button" type="button" onClick={() => openExerciseDrawer(selectedSession.id)}>
              Ajouter un exercice
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                const firstExercise = selectedSession.exercises[0];
                if (firstExercise) {
                  setActiveExercise(firstExercise);
                  setSetDrawerOpen(true);
                }
              }}
              disabled={!selectedSession.exercises.length}
            >
              Ajouter une série
            </button>
          </div>

          <div className="exercise-list">
            {selectedSession.exercises.length ? (
              selectedSession.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  sessionId={selectedSession.id}
                  history={historyByExercise[exercise.name]}
                  onToggleComplete={(setId) => toggleSetCompletion(selectedSession.id, exercise.id, setId)}
                  onAddSet={() => {
                    setActiveExercise(exercise);
                    setSetDrawerOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="empty-state-panel">
                <p>Cette séance n’a pas encore d’exercices.</p>
                <small>Ajoutez un exercice pour démarrer votre premier circuit.</small>
              </div>
            )}
          </div>

          <div className="session-summary-card">
            <div>
              <p>Volume total</p>
              <strong>{computeVolume(selectedSession)} kg</strong>
            </div>
            <div>
              <p>Séries complètes</p>
              <strong>{completedCount}</strong>
            </div>
            <div>
              <p>Dernier repos</p>
              <strong>{restMessage || 'Aucun repos actif'}</strong>
            </div>
          </div>
        </section>
      )}

      <SessionDrawer
        open={sessionDrawerOpen}
        initialName={editingSession?.name || ''}
        onClose={() => {
          setSessionDrawerOpen(false);
          setEditingSession(null);
        }}
        onSave={(name) => {
          editingSession ? renameSession(name) : addSession(name);
        }}
      />

      <ExerciseDrawer
        open={exerciseDrawerOpen}
        onClose={() => setExerciseDrawerOpen(false)}
        onSave={addExercise}
      />

      <SetDrawer
        open={setDrawerOpen}
        onClose={() => setSetDrawerOpen(false)}
        onSave={addSet}
      />

      <RestTimer
        running={restTimerRunning}
        seconds={restSeconds}
        onStop={stopRest}
        message={restMessage}
      />
    </div>
  );
}
