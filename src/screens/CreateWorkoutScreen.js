import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateWorkoutScreen({
  onGoBack,
  onSaveWorkout,
  treinoParaEditar,
  modoEdicao = false,
}) {
  const [nome, setNome] = useState("");
  const [grupo, setGrupo] = useState("");
  const [series, setSeries] = useState("");
  const [repeticoes, setRepeticoes] = useState("");
  const [descanso, setDescanso] = useState("");

  const [novoExercicio, setNovoExercicio] = useState("");
  const [novoTempo, setNovoTempo] = useState("");
  const [novaCarga, setNovaCarga] = useState("");

  const [listaExercicios, setListaExercicios] = useState([]);

  function gerarId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  useEffect(() => {
    if (modoEdicao && treinoParaEditar) {
      setNome(String(treinoParaEditar.nome || ""));
      setGrupo(String(treinoParaEditar.grupo || ""));
      setSeries(String(treinoParaEditar.series || ""));
      setRepeticoes(String(treinoParaEditar.repeticoes || ""));
      setDescanso(String(treinoParaEditar.descanso || ""));

      const listaNormalizada = Array.isArray(treinoParaEditar.listaExercicios)
        ? treinoParaEditar.listaExercicios.map((item) => {
            if (typeof item === "string") {
              return {
                id: gerarId(),
                nome: item,
                tempo: "",
                carga: "",
              };
            }

            return {
              id: item?.id || gerarId(),
              nome: item?.nome || "",
              tempo: item?.tempo || "",
              carga: item?.carga || "",
            };
          })
        : [];

      setListaExercicios(listaNormalizada);
      return;
    }

    if (!modoEdicao) {
      setNome("");
      setGrupo("");
      setSeries("");
      setRepeticoes("");
      setDescanso("");
      setNovoExercicio("");
      setNovoTempo("");
      setNovaCarga("");
      setListaExercicios([]);
    }
  }, [modoEdicao, treinoParaEditar]);

  function normalizarNumero(valor) {
    return String(valor).replace(",", ".").trim();
  }

  function adicionarExercicio() {
    const nomeExercicio = novoExercicio.trim();
    const tempoNormalizado = normalizarNumero(novoTempo);
    const cargaNormalizada = normalizarNumero(novaCarga);

    if (!nomeExercicio) {
      Alert.alert("Atenção", "Digite o nome do exercício.");
      return;
    }

    if (tempoNormalizado) {
      const tempoNumero = Number(tempoNormalizado);
      if (Number.isNaN(tempoNumero) || tempoNumero <= 0) {
        Alert.alert("Atenção", "Digite um tempo válido para o exercício.");
        return;
      }
    }

    if (cargaNormalizada) {
      const cargaNumero = Number(cargaNormalizada);
      if (Number.isNaN(cargaNumero) || cargaNumero <= 0) {
        Alert.alert("Atenção", "Digite uma carga válida para o exercício.");
        return;
      }
    }

    const novoItem = {
      id: gerarId(),
      nome: nomeExercicio,
      tempo: tempoNormalizado || "",
      carga: cargaNormalizada || "",
    };

    setListaExercicios((estadoAnterior) => [...estadoAnterior, novoItem]);
    setNovoExercicio("");
    setNovoTempo("");
    setNovaCarga("");
  }

  function removerExercicio(id) {
    setListaExercicios((estadoAnterior) =>
      estadoAnterior.filter((item) => item.id !== id)
    );
  }

  function salvarTreino() {
    const nomeLimpo = nome.trim();
    const grupoLimpo = grupo.trim();
    const repeticoesLimpo = repeticoes.trim();

    if (!nomeLimpo || !grupoLimpo) {
      Alert.alert("Atenção", "Preencha nome e grupo do treino.");
      return;
    }

    if (listaExercicios.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos um exercício.");
      return;
    }

    const seriesNumero = Number(series);
    const descansoNumero = Number(descanso);

    if (Number.isNaN(seriesNumero) || seriesNumero <= 0) {
      Alert.alert("Atenção", "Digite um número válido de séries.");
      return;
    }

    if (Number.isNaN(descansoNumero) || descansoNumero < 0) {
      Alert.alert("Atenção", "Digite um valor válido para o descanso.");
      return;
    }

    const treinoFinal = {
      id: modoEdicao
        ? treinoParaEditar?.id || gerarId()
        : gerarId(),
      nome: nomeLimpo,
      grupo: grupoLimpo,
      series: seriesNumero,
      repeticoes: repeticoesLimpo,
      descanso: descansoNumero,
      cadencia: treinoParaEditar?.cadencia || "",
      rpe: treinoParaEditar?.rpe || "",
      tipoCardio: treinoParaEditar?.tipoCardio || "nenhum",
      hiitTrabalho: treinoParaEditar?.hiitTrabalho || "",
      hiitDescanso: treinoParaEditar?.hiitDescanso || "",
      listaExercicios,
    };

    onSaveWorkout(treinoFinal);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {modoEdicao ? "Editar Treino" : "Criar Treino"}
        </Text>

        <Text style={styles.subtitle}>
          Monte sua ficha do jeito que você quiser.
        </Text>

        <Text style={styles.label}>Nome do treino</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Treino A"
          placeholderTextColor="#94a3b8"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Grupo muscular</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Peito e Tríceps"
          placeholderTextColor="#94a3b8"
          value={grupo}
          onChangeText={setGrupo}
        />

        <Text style={styles.label}>Séries por exercício</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 4"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={series}
          onChangeText={setSeries}
        />

        <Text style={styles.label}>Repetições</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 10 a 12"
          placeholderTextColor="#94a3b8"
          value={repeticoes}
          onChangeText={setRepeticoes}
        />

        <Text style={styles.label}>Descanso (segundos)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 60"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={descanso}
          onChangeText={setDescanso}
        />

        <View style={styles.exerciseSection}>
          <Text style={styles.sectionTitle}>Adicionar exercício</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do exercício"
            placeholderTextColor="#94a3b8"
            value={novoExercicio}
            onChangeText={setNovoExercicio}
          />

          <TextInput
            style={styles.input}
            placeholder="Tempo (segundos) — opcional"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={novoTempo}
            onChangeText={setNovoTempo}
          />

          <TextInput
            style={styles.input}
            placeholder="Carga/Peso (kg) — opcional"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={novaCarga}
            onChangeText={setNovaCarga}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={adicionarExercicio}
            accessibilityRole="button"
            accessibilityLabel="Adicionar exercício ao treino"
          >
            <Text style={styles.addButtonText}>Adicionar exercício</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseListCard}>
          <Text style={styles.sectionTitle}>Lista de exercícios</Text>

          {listaExercicios.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum exercício informado</Text>
          ) : (
            listaExercicios.map((item) => (
              <View key={item.id} style={styles.exerciseItem}>
                <View style={styles.exerciseTextArea}>
                  <Text style={styles.exerciseName}>{item.nome}</Text>
                  <Text style={styles.exerciseInfo}>
                    {item.tempo
                      ? `Tempo: ${item.tempo}s`
                      : "Sem tempo definido"}
                  </Text>
                  <Text style={styles.exerciseInfo}>
                    {item.carga
                      ? `Carga: ${item.carga} kg`
                      : "Sem carga definida"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removerExercicio(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover exercício ${item.nome}`}
                >
                  <Text style={styles.removeButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarTreino}
          accessibilityRole="button"
          accessibilityLabel={
            modoEdicao ? "Salvar alterações do treino" : "Salvar treino"
          }
        >
          <Text style={styles.saveButtonText}>
            {modoEdicao ? "Salvar alterações" : "Salvar treino"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          accessibilityRole="button"
          accessibilityLabel="Cancelar e voltar"
        >
          <Text style={styles.backButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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

  label: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },

  exerciseSection: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },

  addButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  exerciseListCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 15,
    marginTop: 6,
  },

  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  exerciseTextArea: {
    flex: 1,
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

  removeButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginLeft: 12,
  },

  removeButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  saveButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  saveButtonText: {
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