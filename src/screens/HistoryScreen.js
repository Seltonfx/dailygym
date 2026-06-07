import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";

export default function HistoryScreen({ historico = [], onGoBack }) {
  const historicoSeguro = Array.isArray(historico) ? historico : [];

  const resumo = useMemo(() => {
    const totalTreinos = historicoSeguro.length;

    const caloriasTotais = historicoSeguro.reduce(
      (total, item) => total + (Number(item?.calorias) || 0),
      0
    );

    const tempoTotalSegundos = historicoSeguro.reduce(
      (total, item) => total + (Number(item?.tempoTotalSegundos) || 0),
      0
    );

    const horas = Math.floor(tempoTotalSegundos / 3600);
    const minutos = Math.floor((tempoTotalSegundos % 3600) / 60);

    const tempoFormatado =
      horas > 0 ? `${horas}h ${minutos}min` : `${minutos}min`;

    return {
      totalTreinos,
      caloriasTotais,
      tempoFormatado,
    };
  }, [historicoSeguro]);

  function renderItem({ item }) {
    return (
      <View style={styles.historyCard}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🏋️ Finalizado</Text>
          </View>

          <Text style={styles.date}>
            {item?.data || "Data não informada"}
          </Text>
        </View>

        <Text style={styles.workoutName}>{item?.nome || "Treino"}</Text>
        <Text style={styles.group}>{item?.grupo || "Sem grupo definido"}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Séries</Text>
            <Text style={styles.infoValue}>
              {item?.seriesFeitas || "0/0"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Tempo</Text>
            <Text style={styles.infoValue}>
              {item?.tempoTreino || "00:00"}
            </Text>
          </View>
        </View>

        <View style={styles.caloriesBox}>
          <Text style={styles.caloriesLabel}>🔥 Calorias estimadas</Text>
          <Text style={styles.caloriesValue}>
            {Number(item?.calorias) || 0} kcal
          </Text>
        </View>

        {item?.horario ? (
          <Text style={styles.extraInfo}>Horário: {item.horario}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={historicoSeguro}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Histórico de Treinos</Text>
            <Text style={styles.subtitle}>
              Veja todos os treinos que você já concluiu
            </Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>RESUMO</Text>
              <Text style={styles.summaryMain}>
                {resumo.totalTreinos} treino(s)
              </Text>
              <Text style={styles.summaryText}>
                {resumo.caloriasTotais} kcal acumuladas • {resumo.tempoFormatado} de treino
              </Text>
            </View>

            {historicoSeguro.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyTitle}>
                  Nenhum treino concluído ainda
                </Text>
                <Text style={styles.emptyText}>
                  Assim que você finalizar seus treinos, eles aparecerão aqui.
                </Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.backButton}
            onPress={onGoBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela inicial"
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
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

  summaryCard: {
    backgroundColor: "#0ea5e9",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
  },

  summaryLabel: {
    color: "#e0f2fe",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },

  summaryMain: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },

  summaryText: {
    color: "#e0f2fe",
    fontSize: 15,
    lineHeight: 22,
  },

  emptyCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  emptyText: {
    color: "#cbd5e1",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  historyCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  badge: {
    backgroundColor: "#16a34a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  date: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
  },

  workoutName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },

  group: {
    color: "#cbd5e1",
    fontSize: 16,
    marginBottom: 16,
  },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  infoBox: {
    width: "48%",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  infoValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },

  caloriesBox: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },

  caloriesLabel: {
    color: "#fbbf24",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  caloriesValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },

  extraInfo: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 12,
  },

  backButton: {
    backgroundColor: "#334155",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});