import { useEffect, useMemo, useState } from 'react';
import SessionCard from './SessionCard.jsx';
import SessionDrawer from './SessionDrawer.jsx';
import ExerciseDrawer from './ExerciseDrawer.jsx';
import SetDrawer from './SetDrawer.jsx';
import ExerciseEditor from './ExerciseEditor.jsx';
import RestTimer from './RestTimer.jsx';
import TrainingStats from './TrainingStats.jsx';
import './Training.css';

const STORAGE_KEY = 'fittrack_training_data';
const DEFAULT_REST_SECONDS = 90;

const createNewData = () => ({ sessions: [] });

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : 0;
}

function normalizeSet(set = {}, index = 0) {
  return {
    id: String(set?.id || generateId()),
    weight: safeNumber(set?.weight),
    reps: safeNumber(set?.reps),
    note: typeof set?.note === 'string' ? set.note : '',
    completed: Boolean(set?.completed),
    createdAt: set?.createdAt || new Date().toISOString()
  };
}

function normalizeExercise(exercise = {}, index = 0) {
  return {
    id: String(exercise?.id || generateId()),
    name: typeof exercise?.name === 'string' && exercise.name.trim() ? exercise.name.trim() : `Exercice ${index + 1}`,
    sets: safeArray(exercise?.sets).map((set, setIndex) => normalizeSet(set, setIndex))
  };
}

function normalizeSession(session = {}, index = 0) {
  return {
    id: String(session?.id || generateId()),
    name: typeof session?.name === 'string' && session.name.trim() ? session.name.trim() : `Séance ${index + 1}`,
    createdAt: session?.createdAt || new Date().toISOString(),
    updatedAt: session?.updatedAt || session?.createdAt || new Date().toISOString(),
    exercises: safeArray(session?.exercises).map((exercise, exerciseIndex) => normalizeExercise(exercise, exerciseIndex))
  };
}

function normalizeTrainingData(value) {
  return {
    sessions: safeArray(value?.sessions).map((session, index) => normalizeSession(session, index))
  };
}

function formatDateLabel(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function computeVolume(session) {
  return safeArray(session.exercises).reduce(
    (sum, exercise) =>
      sum + safeArray(exercise.sets).reduce((inner, set) => inner + safeNumber(set.weight) * safeNumber(set.reps), 0),
    0
  );
}

function computeProgress(session) {
  const totalSets = safeArray(session.exercises).reduce((sum, exercise) => sum + safeArray(exercise.sets).length, 0);
  if (!totalSets) return 0;
  const completedSets = safeArray(session.exercises).reduce(
    (sum, exercise) => sum + safeArray(exercise.sets).filter((set) => set.completed).length,
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
  const [exerciseEditorOpen, setExerciseEditorOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingExerciseSessionId, setEditingExerciseSessionId] = useState(null);
  const [restTimerRunning, setRestTimerRunning] = useState(false);
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST_SECONDS);
  const [restMessage, setRestMessage] = useState('');

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue);
        setTrainingData(normalizeTrainingData(parsed));
        return;
      } catch (error) {
        console.warn('Impossible de lire les données d’entraînement', error);
      }
    }
    setTrainingData(createNewData());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trainingData));
    } catch (error) {
      console.warn('Impossible de sauvegarder les données d’entraînement', error);
    }
  }, [trainingData]);

  useEffect(() => {
    if (setNavHidden) {
      setNavHidden(sessionDrawerOpen || exerciseDrawerOpen || setDrawerOpen || exerciseEditorOpen || restTimerRunning);
    }
  }, [sessionDrawerOpen, exerciseDrawerOpen, setDrawerOpen, exerciseEditorOpen, restTimerRunning, setNavHidden]);

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

  const sessions = safeArray(trainingData.sessions);
  const selectedSession = sessions.find((session) => session.id === selectedSessionId) || null;

  const historyByExercise = useMemo(() => {
    return sessions.reduce((map, session) => {
      safeArray(session.exercises).forEach((exercise) => {
        const existing = map[exercise.name] || null;
        if (!existing || new Date(session.updatedAt || session.createdAt) > new Date(existing.date)) {
          map[exercise.name] = {
            date: session.updatedAt || session.createdAt,
            weight: safeNumber(safeArray(exercise.sets)[exercise.sets.length - 1]?.weight),
            reps: safeNumber(safeArray(exercise.sets)[exercise.sets.length - 1]?.reps)
          };
        }
      });
      return map;
    }, {});
  }, [sessions]);

  const stats = useMemo(() => {
    const completedSessions = sessions.length;
    const totalExercises = sessions.reduce((sum, session) => sum + safeArray(session.exercises).length, 0);
    const totalSets = sessions.reduce(
      (sum, session) => sum + safeArray(session.exercises).reduce((sub, exercise) => sub + safeArray(exercise.sets).length, 0),
      0
    );
    const totalVolume = sessions.reduce((sum, session) => sum + computeVolume(session), 0);
    const favoriteExercise = sessions
      .flatMap((session) => safeArray(session.exercises).map((exercise) => exercise.name))
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

  const updateSession = (sessionId, callback) => {
    setTrainingData((prev) => ({
      sessions: safeArray(prev.sessions).map((session) =>
        session.id === sessionId ? callback(session) : session
      )
    }));
  };

  const addSession = (sessionName) => {
    const newSession = {
      id: generateId(),
      name: sessionName.trim() || `Séance ${sessions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: []
    };
    setTrainingData((prev) => ({ sessions: [newSession, ...safeArray(prev.sessions)] }));
    setSelectedSessionId(newSession.id);
    setEditingSession(null);
    setSessionDrawerOpen(false);
  };

  const renameSession = (sessionName) => {
    if (!editingSession) return;
    updateSession(editingSession.id, (session) => ({
      ...session,
      name: sessionName.trim() || session.name,
      updatedAt: new Date().toISOString()
    }));
    setEditingSession(null);
    setSessionDrawerOpen(false);
  };

  const removeSession = (sessionId) => {
    setTrainingData((prev) => ({
      sessions: safeArray(prev.sessions).filter((session) => session.id !== sessionId)
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
    updateSession(activeSessionForExercise, (session) => ({
      ...session,
      updatedAt: new Date().toISOString(),
      exercises: [
        ...safeArray(session.exercises),
        normalizeExercise({ name: exerciseName.trim() })
      ]
    }));
    setExerciseDrawerOpen(false);
  };

  const openExerciseEditor = (sessionId, exercise) => {
    if (!sessionId || !exercise) return;
    setEditingExercise(normalizeExercise(exercise));
    setEditingExerciseSessionId(sessionId);
    setExerciseEditorOpen(true);
  };

  const saveExercise = (updatedExercise) => {
    if (!editingExerciseSessionId || !updatedExercise) return;
    updateSession(editingExerciseSessionId, (session) => ({
      ...session,
      updatedAt: new Date().toISOString(),
      exercises: safeArray(session.exercises).map((exercise) =>
        exercise.id === updatedExercise.id ? normalizeExercise(updatedExercise) : exercise
      )
    }));
    setExerciseEditorOpen(false);
    setEditingExercise(null);
    setEditingExerciseSessionId(null);
  };

  const closeExerciseEditor = () => {
    setExerciseEditorOpen(false);
    setEditingExercise(null);
    setEditingExerciseSessionId(null);
  };

  const openSetDrawer = (exercise) => {
    if (!exercise) return;
    setActiveExercise(exercise);
    setSetDrawerOpen(true);
  };

  const addSet = ({ weight, reps, note }) => {
    if (!selectedSession || !activeExercise) return;
    updateSession(selectedSession.id, (session) => ({
      ...session,
      updatedAt: new Date().toISOString(),
      exercises: safeArray(session.exercises).map((exercise) =>
        exercise.id === activeExercise.id
          ? {
              ...exercise,
              sets: [
                ...safeArray(exercise.sets),
                normalizeSet({ weight, reps, note })
              ]
            }
          : exercise
      )
    }));
    setSetDrawerOpen(false);
  };

  const toggleSetCompletion = (sessionId, exerciseId, setId) => {
    updateSession(sessionId, (session) => ({
      ...session,
      exercises: safeArray(session.exercises).map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: safeArray(exercise.sets).map((set) =>
                set.id === setId ? { ...set, completed: !set.completed } : set
              )
            }
          : exercise
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
    ? safeArray(selectedSession.exercises).reduce((sum, exercise) => sum + safeArray(exercise.sets).filter((set) => set.completed).length, 0)
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
              <p>{formatDateLabel(selectedSession.createdAt)} · {safeArray(selectedSession.exercises).length} exercices</p>
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
                const firstExercise = safeArray(selectedSession.exercises)[0];
                if (firstExercise) {
                  setActiveExercise(firstExercise);
                  setSetDrawerOpen(true);
                }
              }}
              disabled={!safeArray(selectedSession.exercises).length}
            >
              Ajouter une série
            </button>
          </div>

          <div className="exercise-list">
            {safeArray(selectedSession.exercises).length ? (
              safeArray(selectedSession.exercises).map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  sessionId={selectedSession.id}
                  history={historyByExercise[exercise.name]}
                  onToggleComplete={(setId) => toggleSetCompletion(selectedSession.id, exercise.id, setId)}
                  onAddSet={() => openSetDrawer(exercise)}
                  onEdit={() => openExerciseEditor(selectedSession.id, exercise)}
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

      <ExerciseEditor
        open={exerciseEditorOpen}
        initialExercise={editingExercise}
        onClose={closeExerciseEditor}
        onSave={saveExercise}
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
