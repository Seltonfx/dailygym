import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function AchievementsScreen({
  historico = [],
  totalSeriesConcluidas = 0,
  totalDiasTreinadosSemana = 0,
  metaSemanalNumero = 0,
  onGoBack,
}) {
  const historicoSeguro = Array.isArray(historico) ? historico : [];
  const seriesSeguras = Number(totalSeriesConcluidas) || 0;
  const diasTreinados = Number(totalDiasTreinadosSemana) || 0;
  const metaSegura = Number(metaSemanalNumero) || 0;

  const totalTreinos = historicoSeguro.length;

  const caloriasTotais = useMemo(() => {
    return historicoSeguro.reduce((total, item) => {
      return total + (Number(item?.calorias) || 0);
    }, 0);
  }, [historicoSeguro]);

  const conquistas = useMemo(() => {
    const lista = [
      {
        id: "primeiro_treino",
        emoji: "🥇",
        titulo: "Primeiro treino",
        descricao: "Concluir 1 treino",
        valorAtual: totalTreinos,
        objetivo: 1,
      },
      {
        id: "consistencia_inicial",
        emoji: "🔥",
        titulo: "Consistência inicial",
        descricao: "Concluir 5 treinos",
        valorAtual: totalTreinos,
        objetivo: 5,
      },
      {
        id: "atleta_em_evolucao",
        emoji: "🏆",
        titulo: "Atleta em evolução",
        descricao: "Concluir 10 treinos",
        valorAtual: totalTreinos,
        objetivo: 10,
      },
      {
        id: "mestre_das_series",
        emoji: "💯",
        titulo: "Mestre das séries",
        descricao: "Completar 100 séries",
        valorAtual: seriesSeguras,
        objetivo: 100,
      },
      {
        id: "queima_intensa",
        emoji: "⚡",
        titulo: "Queima intensa",
        descricao: "Queimar 1000 kcal",
        valorAtual: caloriasTotais,
        objetivo: 1000,
      },
      {
        id: "meta_semanal",
        emoji: "📆",
        titulo: "Meta semanal",
        descricao: "Cumprir sua meta da semana",
        valorAtual: metaSegura > 0 ? diasTreinados : 0,
        objetivo: metaSegura > 0 ? metaSegura : 1,
        bloqueadaSemMeta: metaSegura <= 0,
      },
    ];

    return lista.map((item) => {
      const desbloqueado =
        !item.bloqueadaSemMeta && item.valorAtual >= item.objetivo;

      const percentual = item.bloqueadaSemMeta
        ? 0
        : Math.min((item.valorAtual / item.objetivo) * 100, 100);

      return {
        ...item,
        desbloqueado,
        percentual,
      };
    });
  }, [totalTreinos, seriesSeguras, caloriasTotais, diasTreinados, metaSegura]);

  const totalDesbloqueadas = conquistas.filter(
    (item) => item.desbloqueado
  ).length;

  function textoProgresso(item) {
    if (item.bloqueadaSemMeta) {
      return "Defina uma meta semanal no perfil";
    }

    if (item.desbloqueado) {
      return "Conquista desbloqueada";
    }

    return `${item.valorAtual}/${item.objetivo}`;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Conquistas</Text>
        <Text style={styles.subtitle}>
          Seu progresso também merece troféus
        </Text>

        <View style={styles.highlightCard}>
          <Text style={styles.highlightLabel}>RESUMO</Text>
          <Text style={styles.highlightTitle}>
            {totalDesbloqueadas} / {conquistas.length} desbloqueadas
          </Text>
          <Text style={styles.highlightText}>
            Continue treinando para liberar novas conquistas.
          </Text>
        </View>

        {conquistas.map((item) => (
          <View
            key={item.id}
            style={[
              styles.achievementCard,
              item.desbloqueado
                ? styles.achievementUnlocked
                : styles.achievementLocked,
            ]}
          >
            <View style={styles.achievementTopRow}>
              <Text style={styles.achievementEmoji}>{item.emoji}</Text>

              <View style={styles.achievementTextArea}>
                <Text style={styles.achievementTitle}>{item.titulo}</Text>
                <Text style={styles.achievementDesc}>{item.descricao}</Text>
              </View>

              <Text
                style={[
                  styles.statusText,
                  item.desbloqueado
                    ? styles.statusUnlocked
                    : styles.statusLocked,
                ]}
              >
                {item.desbloqueado ? "Desbloqueado" : "Bloqueado"}
              </Text>
            </View>

            <View style={styles.progressArea}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${item.percentual}%` },
                  ]}
                />
              </View>

              <Text style={styles.progressText}>{textoProgresso(item)}</Text>
            </View>
          </View>
        ))}

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
    backgroundColor: "#f59e0b",
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },

  highlightLabel: {
    color: "#fff7ed",
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
    color: "#fff7ed",
    fontSize: 15,
    lineHeight: 22,
  },

  achievementCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "#1e293b",
  },

  achievementUnlocked: {
    borderWidth: 1.5,
    borderColor: "#22c55e",
  },

  achievementLocked: {
    borderWidth: 1.5,
    borderColor: "#334155",
    opacity: 0.95,
  },

  achievementTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  achievementEmoji: {
    fontSize: 34,
    marginRight: 16,
  },

  achievementTextArea: {
    flex: 1,
  },

  achievementTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },

  achievementDesc: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },

  statusText: {
    fontWeight: "800",
    fontSize: 12,
    marginLeft: 10,
  },

  statusUnlocked: {
    color: "#22c55e",
  },

  statusLocked: {
    color: "#94a3b8",
  },

  progressArea: {
    marginTop: 16,
  },

  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#334155",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 999,
  },

  progressText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "700",
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