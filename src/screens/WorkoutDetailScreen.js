import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WorkoutDetailScreen({
  treino,
  onGoBack,
  onFinishWorkout,
  onSaveProgress,
  treinoEmAndamento,
  onUpdateExerciseLoad,
  evolucaoCarga,
}) {
  const treinoSeguro = treino || {};
  const treinoId = treinoSeguro?.id || null;

  const listaExercicios = Array.isArray(treinoSeguro.listaExercicios)
    ? treinoSeguro.listaExercicios
    : [];

  const totalExercicios = listaExercicios.length;
  const totalSeries = Number(treinoSeguro.series) || 0;
  const descanso = Number(treinoSeguro.descanso) || 0;

  const [exercicioAtual, setExercicioAtual] = useState(0);
  const [serieAtual, setSerieAtual] = useState(1);
  const [descansoAtivo, setDescansoAtivo] = useState(false);
  const [tempoRestanteDescanso, setTempoRestanteDescanso] = useState(descanso);

  const [timerAtivo, setTimerAtivo] = useState(false);
  const [tempoRestanteExercicio, setTempoRestanteExercicio] = useState(0);
  const [cargaAtualDigitada, setCargaAtualDigitada] = useState("");

  const [inicioTreino] = useState(
    treinoEmAndamento?.inicioTreino || Date.now(),
  );

  const ultimoSalvamentoRef = useRef(0);
  const treinoFinalizadoRef = useRef(false);

  function obterExercicioAtual() {
    return listaExercicios[exercicioAtual];
  }

  function obterNomeExercicio(item) {
    if (!item) return "Exercício";
    if (typeof item === "string") return item;
    return item.nome || "Exercício";
  }

  function obterTempoExercicio(item) {
    if (!item || typeof item === "string") return 0;
    return Number(item.tempo) || 0;
  }

  function obterCargaExercicio(item) {
    if (!item || typeof item === "string") return "";
    return item.carga || "";
  }

  function formatarTempo(segundosTotais) {
    const total = Number(segundosTotais) || 0;
    const minutos = Math.floor(total / 60);
    const segundos = total % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(
      2,
      "0",
    )}`;
  }

  function definirTempoExercicio(index) {
    const item = listaExercicios[index];
    const tempo = obterTempoExercicio(item);
    setTempoRestanteExercicio(tempo);
    setTimerAtivo(false);
  }

  function atualizarCampoCargaAtual(indexAtual = exercicioAtual) {
    const item = listaExercicios[indexAtual];
    const nome = obterNomeExercicio(item);
    const cargaBase = obterCargaExercicio(item);
    const ultimaCargaSalva = evolucaoCarga?.[nome]?.ultimaCarga;

    setCargaAtualDigitada(
      ultimaCargaSalva !== undefined && ultimaCargaSalva !== null
        ? String(ultimaCargaSalva)
        : String(cargaBase || ""),
    );
  }

  useEffect(() => {
    const mesmoTreino =
      treinoEmAndamento?.treino?.id &&
      treinoId &&
      treinoEmAndamento.treino.id === treinoId;

    if (mesmoTreino) {
      const exercicioSalvo = Number(treinoEmAndamento.exercicioAtual || 0);
      const serieSalva = Number(treinoEmAndamento.serieAtual || 1);

      setExercicioAtual(exercicioSalvo);
      setSerieAtual(serieSalva);
      setDescansoAtivo(Boolean(treinoEmAndamento.descansoAtivo));
      setTempoRestanteDescanso(
        Number(treinoEmAndamento.tempoRestanteDescanso || descanso),
      );
      setTempoRestanteExercicio(
        Number(treinoEmAndamento.tempoRestanteExercicio || 0),
      );
      setTimerAtivo(Boolean(treinoEmAndamento.timerAtivo));
      atualizarCampoCargaAtual(exercicioSalvo);
    } else {
      setExercicioAtual(0);
      setSerieAtual(1);
      setDescansoAtivo(false);
      setTempoRestanteDescanso(descanso);
      definirTempoExercicio(0);
      atualizarCampoCargaAtual(0);
    }
  }, [treinoId, treinoEmAndamento, descanso]);

  useEffect(() => {
    atualizarCampoCargaAtual();
  }, [exercicioAtual, evolucaoCarga]);

  useEffect(() => {
    if (!descansoAtivo || tempoRestanteDescanso <= 0) return;

    const intervalo = setInterval(() => {
      setTempoRestanteDescanso((tempoAnterior) => {
        if (tempoAnterior <= 1) {
          setDescansoAtivo(false);
          return 0;
        }
        return tempoAnterior - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [descansoAtivo, tempoRestanteDescanso]);

  useEffect(() => {
    if (!timerAtivo || tempoRestanteExercicio <= 0) return;

    const intervalo = setInterval(() => {
      setTempoRestanteExercicio((tempoAnterior) => {
        if (tempoAnterior <= 1) {
          setTimerAtivo(false);
          return 0;
        }
        return tempoAnterior - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [timerAtivo, tempoRestanteExercicio]);

  useEffect(() => {
    if (!treinoId || treinoFinalizadoRef.current) return;

    const agora = Date.now();
    const passouTempoSuficiente = agora - ultimoSalvamentoRef.current >= 3000;
    const mudancaImportante = !timerAtivo && !descansoAtivo;

    if (!passouTempoSuficiente && !mudancaImportante) return;

    ultimoSalvamentoRef.current = agora;

    onSaveProgress?.({
      treino: {
        id: treinoSeguro.id,
        nome: treinoSeguro.nome,
        grupo: treinoSeguro.grupo,
        series: treinoSeguro.series,
        repeticoes: treinoSeguro.repeticoes,
        descanso: treinoSeguro.descanso,
        listaExercicios: treinoSeguro.listaExercicios,
      },
      exercicioAtual,
      serieAtual,
      descansoAtivo,
      tempoRestanteDescanso,
      tempoRestanteExercicio,
      timerAtivo,
      inicioTreino,
    });
  }, [
    treinoId,
    exercicioAtual,
    serieAtual,
    descansoAtivo,
    tempoRestanteDescanso,
    tempoRestanteExercicio,
    timerAtivo,
    inicioTreino,
  ]);

  function salvarCargaAtual() {
    const item = listaExercicios[exercicioAtual];
    const nome = obterNomeExercicio(item);
    const cargaNumero = Number(String(cargaAtualDigitada).replace(",", "."));

    if (!nome || String(cargaAtualDigitada).trim() === "") return;

    if (Number.isNaN(cargaNumero) || cargaNumero <= 0) {
      Alert.alert("Atenção", "Digite uma carga válida maior que zero.");
      return;
    }

    onUpdateExerciseLoad?.(nome, cargaNumero);
  }

  function iniciarOuPausarTimerExercicio() {
    if (tempoRestanteExercicio <= 0) return;
    setTimerAtivo((valorAnterior) => !valorAnterior);
  }

  function resetarTimerExercicio() {
    const item = obterExercicioAtual();
    const tempoOriginal = obterTempoExercicio(item);
    setTempoRestanteExercicio(tempoOriginal);
    setTimerAtivo(false);
  }

  function concluirSerie() {
    salvarCargaAtual();

    if (totalExercicios === 0 || totalSeries === 0) {
      Alert.alert("Atenção", "Esse treino não possui exercícios ou séries.");
      return;
    }

    if (serieAtual < totalSeries) {
      setSerieAtual((valorAnterior) => valorAnterior + 1);

      if (descanso > 0) {
        setDescansoAtivo(true);
        setTempoRestanteDescanso(descanso);
      }
      return;
    }

    if (exercicioAtual < totalExercicios - 1) {
      const proximoIndex = exercicioAtual + 1;
      setExercicioAtual(proximoIndex);
      setSerieAtual(1);
      definirTempoExercicio(proximoIndex);

      if (descanso > 0) {
        setDescansoAtivo(true);
        setTempoRestanteDescanso(descanso);
      }
      return;
    }

    finalizarTreino();
  }

  function finalizarTreino() {
    treinoFinalizadoRef.current = true;
    salvarCargaAtual();

    const agora = Date.now();
    const tempoTotalSegundos = Math.max(
      1,
      Math.floor((agora - inicioTreino) / 1000),
    );

    const totalSeriesFeitas = totalExercicios * totalSeries;
    const caloriasEstimadas = Math.max(
      Math.round(totalSeriesFeitas * 6 + tempoTotalSegundos / 10),
      1,
    );

    const hoje = new Date();

    const registro = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      nome: treinoSeguro.nome || "Treino",
      grupo: treinoSeguro.grupo || "",
      data: hoje.toLocaleDateString("pt-BR"),
      horario: hoje.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dataIso: hoje.toISOString(),
      seriesFeitas: `${totalSeriesFeitas}/${totalSeriesFeitas}`,
      tempoTreino: formatarTempo(tempoTotalSegundos),
      tempoTotalSegundos,
      tempoTotalMinutos: Math.round(tempoTotalSegundos / 60),
      calorias: caloriasEstimadas,
      listaExercicios,
    };

    onFinishWorkout?.(registro);
    Alert.alert("Treino concluído!", "Seu treino foi salvo com sucesso.");
  }

  const exercicioAtualObj = obterExercicioAtual();
  const nomeExercicioAtual = obterNomeExercicio(exercicioAtualObj);
  const tempoOriginalExercicio = obterTempoExercicio(exercicioAtualObj);
  const cargaExercicioAtual = obterCargaExercicio(exercicioAtualObj);

  const ultimaCarga = evolucaoCarga?.[nomeExercicioAtual]?.ultimaCarga || null;
  const melhorCarga = evolucaoCarga?.[nomeExercicioAtual]?.melhorCarga || null;
  const historicoCarga = evolucaoCarga?.[nomeExercicioAtual]?.historico || [];

  const percentualProgresso = useMemo(() => {
    if (totalExercicios === 0 || totalSeries === 0) return 0;

    const seriesConcluidasAntes =
      exercicioAtual * totalSeries + (serieAtual - 1);
    const totalGeral = totalExercicios * totalSeries;

    return Math.min(
      Math.max((seriesConcluidasAntes / totalGeral) * 100, 0),
      100,
    );
  }, [exercicioAtual, serieAtual, totalExercicios, totalSeries]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{treinoSeguro.nome || "Treino"}</Text>
        <Text style={styles.subtitle}>
          {treinoSeguro.grupo || "Sem grupo definido"}
        </Text>

        <View style={styles.focusCard}>
          <Text style={styles.focusLabel}>EXERCÍCIO ATUAL</Text>
          <Text style={styles.focusExercise}>{nomeExercicioAtual}</Text>
          <Text style={styles.focusSeries}>
            Série {serieAtual} de {totalSeries}
          </Text>

          <Text style={styles.focusExtra}>
            {cargaExercicioAtual
              ? `Carga base: ${cargaExercicioAtual} kg`
              : "Sem carga base definida"}
          </Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Progresso do treino</Text>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${percentualProgresso}%` },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {percentualProgresso.toFixed(0)}% concluído
          </Text>
        </View>

        <View style={styles.loadCard}>
          <Text style={styles.cardTitle}>Registrar carga</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite a carga usada hoje"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={cargaAtualDigitada}
            onChangeText={setCargaAtualDigitada}
          />

          <TouchableOpacity
            style={styles.saveLoadButton}
            onPress={salvarCargaAtual}
            accessibilityRole="button"
            accessibilityLabel="Salvar carga do exercício atual"
          >
            <Text style={styles.saveLoadButtonText}>Salvar carga</Text>
          </TouchableOpacity>

          <Text style={styles.loadInfo}>
            Última carga: {ultimaCarga ? `${ultimaCarga} kg` : "Nenhuma"}
          </Text>
          <Text style={styles.loadInfo}>
            Melhor carga: {melhorCarga ? `${melhorCarga} kg` : "Nenhuma"}
          </Text>
        </View>

        {historicoCarga.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Histórico recente de carga</Text>

            {historicoCarga.slice(0, 5).map((item, index) => (
              <Text
                key={`${item.data}-${item.carga}-${index}`}
                style={styles.infoText}
              >
                {item.data} — {item.carga} kg
              </Text>
            ))}
          </View>
        )}

        {tempoOriginalExercicio > 0 && (
          <View style={styles.timerCard}>
            <Text style={styles.cardTitle}>Timer do exercício</Text>
            <Text style={styles.timerValue}>
              {formatarTempo(tempoRestanteExercicio)}
            </Text>

            <View style={styles.timerButtonsRow}>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={iniciarOuPausarTimerExercicio}
                accessibilityRole="button"
                accessibilityLabel={
                  timerAtivo
                    ? "Pausar timer do exercício"
                    : "Iniciar timer do exercício"
                }
              >
                <Text style={styles.timerButtonText}>
                  {timerAtivo ? "Pausar" : "Iniciar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timerButtonSecondary}
                onPress={resetarTimerExercicio}
                accessibilityRole="button"
                accessibilityLabel="Resetar timer do exercício"
              >
                <Text style={styles.timerButtonText}>Resetar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {descanso > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Descanso entre séries</Text>
            <Text style={styles.cardMainText}>
              {descansoAtivo
                ? `${formatarTempo(tempoRestanteDescanso)} restantes`
                : `${descanso}s configurados`}
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo do treino</Text>
          <Text style={styles.infoText}>Exercícios: {totalExercicios}</Text>
          <Text style={styles.infoText}>
            Séries por exercício: {totalSeries}
          </Text>
          <Text style={styles.infoText}>
            Repetições: {treinoSeguro.repeticoes || "Não informado"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lista de exercícios</Text>

          {listaExercicios.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum exercício informado</Text>
          ) : (
            listaExercicios.map((item, index) => {
              const nome = obterNomeExercicio(item);
              const tempo = obterTempoExercicio(item);
              const carga = obterCargaExercicio(item);
              const melhor = evolucaoCarga?.[nome]?.melhorCarga || null;

              return (
                <View
                  key={item?.id || `${nome}-${index}`}
                  style={[
                    styles.exerciseItem,
                    index === exercicioAtual && styles.exerciseItemActive,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>
                      {index + 1}. {nome}
                    </Text>

                    <Text style={styles.exerciseInfo}>
                      {tempo > 0 ? `Tempo: ${tempo}s` : "Sem tempo definido"}
                    </Text>

                    <Text style={styles.exerciseInfo}>
                      {carga ? `Carga base: ${carga} kg` : "Sem carga definida"}
                    </Text>

                    <Text style={styles.exerciseInfo}>
                      {melhor
                        ? `Melhor carga: ${melhor} kg`
                        : "Sem evolução ainda"}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <TouchableOpacity
          style={styles.finishSetButton}
          onPress={concluirSerie}
          accessibilityRole="button"
          accessibilityLabel="Concluir série atual"
        >
          <Text style={styles.finishSetButtonText}>Concluir série</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a lista de treinos"
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 8,
    marginBottom: 24,
  },

  focusCard: {
    backgroundColor: "#22c55e",
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },

  focusLabel: {
    color: "#dcfce7",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
  },

  focusExercise: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
  },

  focusSeries: {
    color: "#dcfce7",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  focusExtra: {
    color: "#ecfccb",
    fontSize: 15,
    fontWeight: "700",
  },

  progressCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  progressBarBackground: {
    height: 14,
    backgroundColor: "#334155",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 14,
    marginBottom: 10,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 999,
  },

  progressText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  loadCard: {
    backgroundColor: "#0f766e",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },

  saveLoadButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 14,
  },

  saveLoadButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  loadInfo: {
    color: "#ecfeff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },

  timerCard: {
    backgroundColor: "#7c3aed",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  timerValue: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 18,
  },

  timerButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  timerButton: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginRight: 8,
  },

  timerButtonSecondary: {
    flex: 1,
    backgroundColor: "#334155",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginLeft: 8,
  },

  timerButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  cardTitle: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  cardMainText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },

  infoText: {
    color: "#e2e8f0",
    fontSize: 15,
    marginBottom: 8,
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 15,
    marginTop: 6,
  },

  exerciseItem: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  exerciseItemActive: {
    borderColor: "#22c55e",
    borderWidth: 2,
  },

  exerciseName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },

  exerciseInfo: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 2,
  },

  finishSetButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  finishSetButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  backButton: {
    backgroundColor: "#334155",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
