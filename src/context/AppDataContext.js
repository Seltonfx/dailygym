import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { db } from "../config/firebase";
import {
  formatDatePtBR,
  formatTimePtBR,
  parseWorkoutDate,
  toStartOfDay,
} from "../utils/date";
import { useAuth } from "./AuthContext";

const AppDataContext = createContext(null);

const initialProfile = {
  nome: "",
  peso: "",
  altura: "",
  objetivo: "",
  nivel: "",
  metaSemanal: "",
};

const initialState = {
  treinos: [],
  historico: [],
  perfil: initialProfile,
  evolucaoCarga: {},
  treinoEmAndamento: null,
  streak: 0,
  lembreteAtivo: false,
  lembreteId: null,
};

function getUserStorageKeys(uid) {
  const base = uid ? `dailygym_${uid}` : "dailygym_guest";

  return {
    treinos: `${base}_treinos`,
    historico: `${base}_historico`,
    perfil: `${base}_perfil`,
    evolucaoCarga: `${base}_evolucao_carga`,
    treinoEmAndamento: `${base}_treino_em_andamento`,
    streak: `${base}_streak`,
    lembreteAtivo: `${base}_lembrete_ativo`,
    lembreteId: `${base}_lembrete_id`,
  };
}

function parseJsonSafe(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeWorkouts(list) {
  if (!Array.isArray(list)) return [];

  return list.map((workout) => ({
    id: workout?.id || createId(),
    nome: workout?.nome || "Treino",
    grupo: workout?.grupo || "",
    series: workout?.series || "",
    repeticoes: workout?.repeticoes || "",
    descanso: workout?.descanso || "",
    cadencia: workout?.cadencia || "",
    rpe: workout?.rpe || "",
    tipoCardio: workout?.tipoCardio || "nenhum",
    hiitTrabalho: workout?.hiitTrabalho || "",
    hiitDescanso: workout?.hiitDescanso || "",
    listaExercicios: Array.isArray(workout?.listaExercicios)
      ? workout.listaExercicios.map((item) => {
          if (typeof item === "string") {
            return { id: createId(), nome: item, tempo: "", carga: "" };
          }

          return {
            id: item?.id || createId(),
            nome: item?.nome || "",
            tempo: item?.tempo || "",
            carga: item?.carga || "",
          };
        })
      : [],
  }));
}

function normalizeHistory(list) {
  if (!Array.isArray(list)) return [];

  return list.map((item) => ({
    id: item?.id || createId(),
    nome: item?.nome || "Treino",
    grupo: item?.grupo || "",
    data: item?.data || "",
    dataIso: item?.dataIso || "",
    horario: item?.horario || "",
    seriesFeitas: item?.seriesFeitas || "0/0",
    tempoTreino: item?.tempoTreino || "00:00",
    tempoTotalSegundos: Number(item?.tempoTotalSegundos) || 0,
    tempoTotalMinutos: Number(item?.tempoTotalMinutos) || 0,
    calorias: Number(item?.calorias) || 0,
    listaExercicios: Array.isArray(item?.listaExercicios)
      ? item.listaExercicios
      : [],
  }));
}

function buildStateFromStorageMap(map, keys) {
  return {
    treinos: normalizeWorkouts(parseJsonSafe(map[keys.treinos], [])),
    historico: normalizeHistory(parseJsonSafe(map[keys.historico], [])),
    perfil: parseJsonSafe(map[keys.perfil], initialProfile),
    evolucaoCarga: parseJsonSafe(map[keys.evolucaoCarga], {}),
    treinoEmAndamento: parseJsonSafe(map[keys.treinoEmAndamento], null),
    streak: Number(parseJsonSafe(map[keys.streak], 0)) || 0,
    lembreteAtivo: Boolean(parseJsonSafe(map[keys.lembreteAtivo], false)),
    lembreteId: parseJsonSafe(map[keys.lembreteId], null),
  };
}

function buildStateFromCloud(cloudData) {
  return {
    treinos: normalizeWorkouts(cloudData?.treinos || []),
    historico: normalizeHistory(cloudData?.historico || []),
    perfil: cloudData?.perfil || initialProfile,
    evolucaoCarga: cloudData?.evolucaoCarga || {},
    treinoEmAndamento: cloudData?.treinoEmAndamento || null,
    streak: Number(cloudData?.streak) || 0,
    lembreteAtivo: Boolean(cloudData?.lembreteAtivo),
    lembreteId: cloudData?.lembreteId || null,
  };
}

export function AppDataProvider({ children }) {
  const { user } = useAuth();

  const [dataLoading, setDataLoading] = useState(true);
  const [syncingCloud, setSyncingCloud] = useState(false);

  const [treinos, setTreinos] = useState(initialState.treinos);
  const [historico, setHistorico] = useState(initialState.historico);
  const [perfil, setPerfil] = useState(initialState.perfil);
  const [evolucaoCarga, setEvolucaoCarga] = useState(
    initialState.evolucaoCarga,
  );
  const [treinoEmAndamento, setTreinoEmAndamento] = useState(
    initialState.treinoEmAndamento,
  );
  const [streak, setStreak] = useState(initialState.streak);
  const [lembreteAtivo, setLembreteAtivo] = useState(
    initialState.lembreteAtivo,
  );
  const [lembreteId, setLembreteId] = useState(initialState.lembreteId);

  const cloudTimerRef = useRef(null);
  const hydratedRef = useRef(false);
  const activeUidRef = useRef(null);

  const storageKeys = useMemo(() => getUserStorageKeys(user?.uid), [user?.uid]);

  function applyState(nextState) {
    setTreinos(nextState.treinos);
    setHistorico(nextState.historico);
    setPerfil(nextState.perfil);
    setEvolucaoCarga(nextState.evolucaoCarga);
    setTreinoEmAndamento(nextState.treinoEmAndamento);
    setStreak(nextState.streak);
    setLembreteAtivo(nextState.lembreteAtivo);
    setLembreteId(nextState.lembreteId);
  }

  async function persistLocalData(nextState = null) {
    if (!user?.uid) return;

    const keys = getUserStorageKeys(user.uid);

    const state = nextState || {
      treinos,
      historico,
      perfil,
      evolucaoCarga,
      treinoEmAndamento,
      streak,
      lembreteAtivo,
      lembreteId,
    };

    await AsyncStorage.multiSet([
      [keys.treinos, JSON.stringify(state.treinos)],
      [keys.historico, JSON.stringify(state.historico)],
      [keys.perfil, JSON.stringify(state.perfil)],
      [keys.evolucaoCarga, JSON.stringify(state.evolucaoCarga)],
      [keys.treinoEmAndamento, JSON.stringify(state.treinoEmAndamento)],
      [keys.streak, JSON.stringify(state.streak)],
      [keys.lembreteAtivo, JSON.stringify(state.lembreteAtivo)],
      [keys.lembreteId, JSON.stringify(state.lembreteId)],
    ]);
  }

  async function loadLocalDataForUser(uid) {
    if (!uid) {
      applyState(initialState);
      return;
    }

    const keys = getUserStorageKeys(uid);
    const results = await AsyncStorage.multiGet(Object.values(keys));
    const map = Object.fromEntries(results);
    const nextState = buildStateFromStorageMap(map, keys);

    applyState(nextState);
  }

  async function syncCloudNow() {
    if (!user?.uid || !hydratedRef.current) return;

    setSyncingCloud(true);

    try {
      const payload = {
        uid: user.uid,
        email: user.email || "",
        treinos,
        historico,
        perfil,
        evolucaoCarga,
        treinoEmAndamento,
        streak,
        lembreteAtivo,
        lembreteId,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "dailygym_users", user.uid), payload, {
        merge: true,
      });
    } finally {
      setSyncingCloud(false);
    }
  }

  function scheduleCloudSync() {
    if (!user?.uid || !hydratedRef.current) return;

    if (cloudTimerRef.current) {
      clearTimeout(cloudTimerRef.current);
    }

    cloudTimerRef.current = setTimeout(() => {
      syncCloudNow().catch((error) =>
        console.log("Erro ao sincronizar com a nuvem:", error),
      );
    }, 800);
  }

  async function hydrateFromCloud() {
    if (!user?.uid) return;

    const snapshot = await getDoc(doc(db, "dailygym_users", user.uid));

    if (!snapshot.exists()) {
      await persistLocalData();
      return;
    }

    const cloudData = snapshot.data();
    const nextState = buildStateFromCloud(cloudData);

    applyState(nextState);
    await persistLocalData(nextState);
  }

  useEffect(() => {
    let isMounted = true;

    async function bootUserData() {
      setDataLoading(true);
      hydratedRef.current = false;

      if (cloudTimerRef.current) {
        clearTimeout(cloudTimerRef.current);
      }

      try {
        if (!user?.uid) {
          activeUidRef.current = null;
          applyState(initialState);
          return;
        }

        activeUidRef.current = user.uid;

        await loadLocalDataForUser(user.uid);

        if (!isMounted || activeUidRef.current !== user.uid) return;

        const snapshot = await getDoc(doc(db, "dailygym_users", user.uid));

        if (!isMounted || activeUidRef.current !== user.uid) return;

        if (snapshot.exists()) {
          const cloudState = buildStateFromCloud(snapshot.data());
          applyState(cloudState);
          await persistLocalData(cloudState);
        }
      } catch (error) {
        console.log("Erro ao carregar dados do usuário:", error);
      } finally {
        if (isMounted) {
          hydratedRef.current = true;
          setDataLoading(false);
        }
      }
    }

    bootUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!hydratedRef.current || !user?.uid) return;

    persistLocalData().catch((error) =>
      console.log("Erro ao salvar localmente:", error),
    );

    scheduleCloudSync();

    return () => {
      if (cloudTimerRef.current) {
        clearTimeout(cloudTimerRef.current);
      }
    };
  }, [
    user?.uid,
    treinos,
    historico,
    perfil,
    evolucaoCarga,
    treinoEmAndamento,
    streak,
    lembreteAtivo,
    lembreteId,
  ]);

  async function enableReminder() {
    const permission = await Notifications.requestPermissionsAsync();

    if (!permission.granted) {
      throw new Error("Permissão de notificações não concedida.");
    }

    if (lembreteId) {
      await Notifications.cancelScheduledNotificationAsync(lembreteId);
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora do treino 💪",
        body: "Abra o Daily Gym e mantenha sua sequência.",
      },
      trigger: {
        hour: 19,
        minute: 0,
        repeats: true,
      },
    });

    setLembreteId(id);
    setLembreteAtivo(true);
  }

  async function disableReminder() {
    if (lembreteId) {
      await Notifications.cancelScheduledNotificationAsync(lembreteId);
    }

    setLembreteId(null);
    setLembreteAtivo(false);
  }

  const addWorkout = useCallback((workout) => {
    setTreinos((prev) => [
      ...prev,
      { ...workout, id: workout?.id || createId() },
    ]);
  }, []);

  const updateWorkout = useCallback((updatedWorkout) => {
    setTreinos((prev) =>
      prev.map((item) =>
        item.id === updatedWorkout.id ? updatedWorkout : item,
      ),
    );

    setTreinoEmAndamento((prev) => {
      if (prev?.treino?.id === updatedWorkout.id) {
        return { ...prev, treino: updatedWorkout };
      }

      return prev;
    });
  }, []);

  const deleteWorkout = useCallback((id) => {
    setTreinos((prev) => prev.filter((item) => item.id !== id));

    setTreinoEmAndamento((prev) => {
      if (prev?.treino?.id === id) return null;
      return prev;
    });
  }, []);

  const updateProfileData = useCallback((nextProfile) => {
    setPerfil(nextProfile);
  }, []);

  const updateExerciseLoad = useCallback((exerciseName, newLoad) => {
    if (!exerciseName) return;

    const loadNumber = Number(newLoad);

    if (Number.isNaN(loadNumber) || loadNumber <= 0) return;

    setEvolucaoCarga((prev) => {
      const current = prev[exerciseName] || {
        ultimaCarga: 0,
        melhorCarga: 0,
        historico: [],
      };

      return {
        ...prev,
        [exerciseName]: {
          ultimaCarga: loadNumber,
          melhorCarga: Math.max(loadNumber, Number(current.melhorCarga || 0)),
          historico: [
            { data: formatDatePtBR(new Date()), carga: loadNumber },
            ...(current.historico || []),
          ].slice(0, 20),
        },
      };
    });
  }, []);

  function updateStreakWithHistory(newRecord) {
    const newDate = parseWorkoutDate(newRecord);

    if (!newDate) {
      setStreak((current) => (current > 0 ? current : 1));
      return;
    }

    if (historico.length === 0) {
      setStreak(1);
      return;
    }

    const lastRecordDate = parseWorkoutDate(historico[0]);

    if (!lastRecordDate) {
      setStreak(1);
      return;
    }

    const newDay = toStartOfDay(newDate);
    const lastDay = toStartOfDay(lastRecordDate);

    if (newDay.getTime() === lastDay.getTime()) return;

    const diffMs = newDay.getTime() - lastDay.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      setStreak((current) => current + 1);
    } else if (diffDays > 1) {
      setStreak(1);
    }
  }

  const finishWorkout = useCallback(
    (record) => {
      const completeRecord = {
        ...record,
        id: record?.id || createId(),
        data: record?.data || formatDatePtBR(new Date()),
        horario: record?.horario || formatTimePtBR(new Date()),
        dataIso: record?.dataIso || new Date().toISOString(),
      };

      updateStreakWithHistory(completeRecord);
      setHistorico((prev) => [completeRecord, ...prev]);
      setTreinoEmAndamento(null);
    },
    [historico],
  );

  const saveWorkoutProgress = useCallback((progress) => {
    setTreinoEmAndamento((prev) => {
      const prevString = JSON.stringify(prev);
      const nextString = JSON.stringify(progress);

      if (prevString === nextString) {
        return prev;
      }

      return progress;
    });
  }, []);

  const totalTreinos = treinos.length;
  const totalConcluidos = historico.length;
  const ultimoTreino = historico.length > 0 ? historico[0].nome : null;

  const totalSeriesConcluidas = useMemo(() => {
    return historico.reduce((total, item) => {
      const parts = String(item.seriesFeitas || "0/0").split("/");
      const completed = Number(parts[0]) || 0;

      return total + completed;
    }, 0);
  }, [historico]);

  const weeklyTraining = useMemo(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const trainedDays = new Set();

    historico.forEach((item) => {
      const parsed = parseWorkoutDate(item);

      if (!parsed) return;

      const day = toStartOfDay(parsed);

      if (day >= weekStart) {
        trainedDays.add(day.getDay());
      }
    });

    return ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
      (name, index) => ({
        nome: name,
        treinou: trainedDays.has(index),
      }),
    );
  }, [historico]);

  const totalDiasTreinadosSemana = weeklyTraining.filter(
    (item) => item.treinou,
  ).length;

  const metaSemanalNumero = Number(perfil.metaSemanal) || 0;

  const percentualMeta =
    metaSemanalNumero > 0
      ? Math.min((totalDiasTreinadosSemana / metaSemanalNumero) * 100, 100)
      : 0;

  const value = useMemo(
    () => ({
      dataLoading,
      syncingCloud,
      treinos,
      historico,
      evolucaoCarga,
      treinoEmAndamento,
      streak,
      lembreteAtivo,
      lembreteId,
      perfil,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      updateProfileData,
      updateExerciseLoad,
      finishWorkout,
      saveWorkoutProgress,
      enableReminder,
      disableReminder,
      totalTreinos,
      totalConcluidos,
      ultimoTreino,
      totalSeriesConcluidas,
      treinoSemana: weeklyTraining,
      totalDiasTreinadosSemana,
      metaSemanalNumero,
      percentualMeta,
      refreshCloudData: hydrateFromCloud,
      syncCloudNow,
      storageKeys,
    }),
    [
      dataLoading,
      syncingCloud,
      treinos,
      historico,
      evolucaoCarga,
      treinoEmAndamento,
      streak,
      lembreteAtivo,
      lembreteId,
      perfil,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      updateProfileData,
      updateExerciseLoad,
      finishWorkout,
      saveWorkoutProgress,
      totalTreinos,
      totalConcluidos,
      ultimoTreino,
      totalSeriesConcluidas,
      weeklyTraining,
      totalDiasTreinadosSemana,
      metaSemanalNumero,
      percentualMeta,
      storageKeys,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  }

  return context;
}
