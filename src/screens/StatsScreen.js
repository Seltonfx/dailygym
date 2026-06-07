import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function StatsScreen({
  historico = [],
  totalSeriesConcluidas = 0,
  totalDiasTreinadosSemana = 0,
  metaSemanalNumero = 0,
  percentualMeta = 0,
  onGoBack,
}) {
  const historicoSeguro = Array.isArray(historico) ? historico : [];
  const seriesSeguras = Number(totalSeriesConcluidas) || 0;
  const diasSemanaSeguro = Number(totalDiasTreinadosSemana) || 0;
  const metaSegura = Number(metaSemanalNumero) || 0;
  const percentualSeguro = Math.min(
    Math.max(Number(percentualMeta) || 0, 0),
    100
  );

  const totalTreinos = historicoSeguro.length;

  const caloriasTotais = useMemo(() => {
    return historicoSeguro.reduce((total, item) => {
      return total + (Number(item?.calorias) || 0);
    }, 0);
  }, [historicoSeguro]);

  const tempoTotalSegundos = useMemo(() => {
    return historicoSeguro.reduce((total, item) => {
      return total + (Number(item?.tempoTotalSegundos) || 0);
    }, 0);
  }, [historicoSeguro]);

  const tempoFormatado = useMemo(() => {
    const horas = Math.floor(tempoTotalSegundos / 3600);
    const minutos = Math.floor((tempoTotalSegundos % 3600) / 60);

    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }

    return `${minutos}min`;
  }, [tempoTotalSegundos]);

  const mediaCalorias =
    totalTreinos > 0 ? Math.round(caloriasTotais / totalTreinos) : 0;

  const mediaTempoPorTreino = useMemo(() => {
    if (totalTreinos === 0) return "0min";

    const mediaSegundos = Math.floor(tempoTotalSegundos / totalTreinos);
    const minutos = Math.floor(mediaSegundos / 60);
    const segundos = mediaSegundos % 60;

    if (minutos > 0) {
      return `${minutos}min ${segundos}s`;
    }

    return `${segundos}s`;
  }, [tempoTotalSegundos, totalTreinos]);

  const mensagemConsistencia = useMemo(() => {
    if (totalTreinos === 0) {
      return "Comece hoje 💪";
    }

    if (metaSegura > 0 && percentualSeguro >= 100) {
      return "Meta batida 🎯";
    }

    if (totalTreinos < 5) {
      return "Bom começo 🚀";
    }

    if (totalTreinos < 15) {
      return "Rotina consistente 🔥";
    }

    return "Excelente disciplina 🏆";
  }, [totalTreinos, metaSegura, percentualSeguro]);

  const descricaoConsistencia = useMemo(() => {
    if (metaSegura <= 0) {
      return "Defina uma meta semanal no perfil para acompanhar melhor seu ritmo.";
    }

    if (percentualSeguro >= 100) {
      return "Você já concluiu toda a sua meta semanal. Continue mantendo o ritmo.";
    }

    const faltam = Math.max(metaSegura - diasSemanaSeguro, 0);

    if (faltam === 1) {
      return "Falta apenas 1 dia de treino para alcançar sua meta semanal.";
    }

    return `Faltam ${faltam} dia(s) de treino para alcançar sua meta semanal.`;
  }, [metaSegura, percentualSeguro, diasSemanaSeguro]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Estatísticas</Text>
        <Text style={styles.subtitle}>Veja sua evolução no Daily Gym</Text>

        <View style={styles.highlightCard}>
          <Text style={styles.highlightLabel}>SEU RESUMO</Text>
          <Text style={styles.highlightTitle}>
            {totalTreinos} treino(s) concluído(s)
          </Text>
          <Text style={styles.highlightText}>
            Seu progresso está sendo construído treino após treino.
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>🔥 Calorias totais</Text>
            <Text style={styles.cardValue}>{caloriasTotais}</Text>
          </View>

          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>⏱ Tempo total</Text>
            <Text style={styles.cardValue}>{tempoFormatado}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>🏋️ Séries totais</Text>
            <Text style={styles.cardValue}>{seriesSeguras}</Text>
          </View>

          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>📆 Semana atual</Text>
            <Text style={styles.cardValue}>
              {metaSegura > 0
                ? `${diasSemanaSeguro}/${metaSegura}`
                : `${diasSemanaSeguro} dia(s)`}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meta semanal</Text>
          <Text style={styles.cardMainText}>
            {metaSegura > 0
              ? `${diasSemanaSeguro} / ${metaSegura} dia(s)`
              : "Meta não definida"}
          </Text>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${percentualSeguro}%` },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {metaSegura > 0
              ? `${percentualSeguro.toFixed(0)}% da meta concluída`
              : "Defina uma meta no perfil para acompanhar seu progresso"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Média por treino</Text>
          <Text style={styles.cardMainText}>{mediaCalorias} kcal</Text>
          <Text style={styles.cardSubText}>
            Em média, cada treino concluído gerou esse gasto estimado.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Duração média</Text>
          <Text style={styles.cardMainText}>{mediaTempoPorTreino}</Text>
          <Text style={styles.cardSubText}>
            Tempo médio gasto em cada treino concluído.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Consistência</Text>
          <Text style={styles.cardMainText}>{mensagemConsistencia}</Text>
          <Text style={styles.cardSubText}>{descricaoConsistencia}</Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela inicial"
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

  highlightCard: {
    backgroundColor: "#7c3aed",
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },

  highlightLabel: {
    color: "#ede9fe",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
  },

  highlightTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },

  highlightText: {
    color: "#ede9fe",
    fontSize: 15,
    lineHeight: 22,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  cardSmall: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  cardLabel: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  cardValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
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
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },

  cardSubText: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
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