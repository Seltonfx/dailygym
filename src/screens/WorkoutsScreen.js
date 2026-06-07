import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";

export default function WorkoutsScreen({
  onGoBack,
  onGoToCreateWorkout,
  onOpenWorkout,
  onDeleteWorkout,
  onEditWorkout,
  treinos = [],
}) {
  function renderizarExercicio(exercicio) {
    if (typeof exercicio === "string") {
      return exercicio;
    }

    const nome = exercicio?.nome || "Exercício";
    const carga = exercicio?.carga ? ` • ${exercicio.carga} kg` : "";
    const tempo = exercicio?.tempo ? ` • ${exercicio.tempo}s` : "";

    return `${nome}${carga}${tempo}`;
  }

  function confirmarExclusao(treino) {
    Alert.alert(
      "Excluir treino",
      `Tem certeza que deseja excluir "${treino?.nome || "este treino"}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDeleteWorkout(treino.id),
        },
      ]
    );
  }

  function renderWorkoutCard({ item }) {
    const totalExercicios = Array.isArray(item?.listaExercicios)
      ? item.listaExercicios.length
      : 0;

    const previewExercicios =
      totalExercicios > 0 ? item.listaExercicios.slice(0, 3) : [];

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => onOpenWorkout(item.id)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Abrir treino ${item.nome || "sem nome"}`}
        >
          <Text style={styles.cardTitle}>{item?.nome || "Treino"}</Text>
          <Text style={styles.cardText}>
            Grupo: {item?.grupo || "Não informado"}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                {totalExercicios} exercício(s)
              </Text>
            </View>

            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                {item?.series || "--"} série(s)
              </Text>
            </View>

            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                {item?.descanso || "--"}s descanso
              </Text>
            </View>
          </View>

          <Text style={styles.exerciseTitle}>Prévia dos exercícios</Text>

          {previewExercicios.length > 0 ? (
            previewExercicios.map((exercicio, i) => (
              <Text
                key={exercicio?.id || `${item.id}-preview-${i}`}
                style={styles.exerciseItem}
                numberOfLines={1}
              >
                • {renderizarExercicio(exercicio)}
              </Text>
            ))
          ) : (
            <Text style={styles.exerciseItem}>Nenhum exercício informado</Text>
          )}

          {totalExercicios > 3 && (
            <Text style={styles.moreExercisesText}>
              + {totalExercicios - 3} exercício(s)
            </Text>
          )}

          <Text style={styles.openHint}>Toque no card para abrir o treino</Text>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEditWorkout(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Editar treino ${item.nome || "sem nome"}`}
          >
            <Text style={styles.actionButtonText}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmarExclusao(item)}
            accessibilityRole="button"
            accessibilityLabel={`Excluir treino ${item.nome || "sem nome"}`}
          >
            <Text style={styles.actionButtonText}>🗑 Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={Array.isArray(treinos) ? treinos : []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderWorkoutCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Meus Treinos</Text>
            <Text style={styles.subtitle}>
              Organize seus treinos e mantenha sua rotina consistente.
            </Text>

            {treinos.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Nenhum treino criado</Text>
                <Text style={styles.emptyText}>
                  Crie seu primeiro treino para começar.
                </Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={onGoToCreateWorkout}
              accessibilityRole="button"
              accessibilityLabel="Criar novo treino"
            >
              <Text style={styles.buttonText}>+ Criar treino</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onGoBack}
              accessibilityRole="button"
              accessibilityLabel="Voltar para a tela inicial"
            >
              <Text style={styles.buttonText}>Voltar para Home</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 30,
  },

  subtitle: {
    fontSize: 15,
    color: "#94a3b8",
    marginTop: 8,
    marginBottom: 25,
    lineHeight: 22,
  },

  emptyCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  emptyText: {
    color: "#cbd5e1",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 18,
    marginBottom: 14,
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cardText: {
    color: "#cbd5e1",
    fontSize: 16,
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
    marginBottom: 14,
  },

  infoBadge: {
    backgroundColor: "#0f172a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  infoBadgeText: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "700",
  },

  exerciseTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 8,
  },

  exerciseItem: {
    color: "#cbd5e1",
    fontSize: 15,
    marginBottom: 6,
    paddingLeft: 4,
  },

  moreExercisesText: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  openHint: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 12,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#1d4ed8",
    paddingVertical: 12,
    borderRadius: 12,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#7f1d1d",
    paddingVertical: 12,
    borderRadius: 12,
  },

  actionButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },

  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 20,
  },

  secondaryButton: {
    backgroundColor: "#334155",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 14,
    marginBottom: 30,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});