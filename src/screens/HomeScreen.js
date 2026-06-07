import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen({
  onGoToWorkouts,
  onGoToHistory,
  onGoToProfile,
  onGoToStats,
  onGoToAchievements,
  onContinueWorkout,
  onEnableReminder,
  onDisableReminder,
  lembreteAtivo = false,
  totalTreinos = 0,
  totalConcluidos = 0,
  ultimoTreino = null,
  totalSeriesConcluidas = 0,
  treinoSemana = [],
  totalDiasTreinadosSemana = 0,
  perfil = {},
  metaSemanalNumero = 0,
  percentualMeta = 0,
  treinoEmAndamento = null,
  streak = 0,
}) {
  const percentualSeguro = Math.min(
    Math.max(Number(percentualMeta || 0), 0),
    100,
  );

  const nomeUsuario = perfil?.nome?.trim() ? perfil.nome.trim() : "atleta";

  const dadosSemana = useMemo(() => {
    if (!Array.isArray(treinoSemana)) return [];
    return treinoSemana.slice(0, 7);
  }, [treinoSemana]);

  const ultimoTreinoTexto = useMemo(() => {
    if (!ultimoTreino) return "Nenhum";

    const texto = String(ultimoTreino).trim();
    if (texto.length <= 22) return texto;

    return `${texto.slice(0, 22)}...`;
  }, [ultimoTreino]);

  function mensagemMeta() {
    if (!metaSemanalNumero || metaSemanalNumero <= 0) {
      return "Defina uma meta semanal no seu perfil para acompanhar melhor sua evolução.";
    }

    if (percentualSeguro >= 100) {
      return "Parabéns! Você já bateu sua meta semanal 🎉";
    }

    const faltam = Math.max(metaSemanalNumero - totalDiasTreinadosSemana, 0);

    if (faltam === 1) {
      return "Falta só 1 treino para bater sua meta semanal.";
    }

    return `Faltam ${faltam} treino(s) para bater sua meta semanal.`;
  }

  function mensagemResumo() {
    if (totalConcluidos === 0) {
      return "Você ainda não concluiu nenhum treino. Comece hoje e construa constância 💪";
    }

    if (totalConcluidos < 5) {
      return "Bom começo. Continue treinando para criar consistência.";
    }

    if (totalConcluidos < 15) {
      return "Você já está mantendo uma rotina sólida. Continue assim 🚀";
    }

    return "Excelente evolução. Seu ritmo já está de atleta disciplinado 🔥";
  }

  const exercicioAtualNumero =
    Number(treinoEmAndamento?.exercicioAtual || 0) + 1;
  const serieAtualNumero = Number(treinoEmAndamento?.serieAtual || 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Daily Gym</Text>
      <Text style={styles.subtitle}>
        Olá, {nomeUsuario} 👋 acompanhe seus treinos, evolução e consistência.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>RESUMO DO DIA</Text>
        <Text style={styles.heroTitle}>
          {totalConcluidos > 0
            ? `${totalConcluidos} treino(s) concluído(s)`
            : "Seu treino começa hoje"}
        </Text>
        <Text style={styles.heroText}>{mensagemResumo()}</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakTitle}>🔥 Sequência atual</Text>
        <Text style={styles.streakNumber}>{streak} dia(s)</Text>
        <Text style={styles.streakText}>
          Mantenha sua rotina e aumente sua sequência.
        </Text>
      </View>

      <View style={styles.reminderCard}>
        <Text style={styles.reminderTitle}>🔔 Lembrete diário</Text>
        <Text style={styles.reminderText}>
          {lembreteAtivo
            ? "Seu lembrete diário está ativo para você não esquecer o treino."
            : "Ative um lembrete diário para manter a consistência."}
        </Text>

        {lembreteAtivo ? (
          <TouchableOpacity
            style={styles.reminderOffButton}
            onPress={onDisableReminder}
            accessibilityRole="button"
            accessibilityLabel="Cancelar lembrete diário"
          >
            <Text style={styles.reminderButtonText}>Cancelar lembrete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.reminderOnButton}
            onPress={onEnableReminder}
            accessibilityRole="button"
            accessibilityLabel="Ativar lembrete diário"
          >
            <Text style={styles.reminderButtonText}>Ativar lembrete</Text>
          </TouchableOpacity>
        )}
      </View>

      {treinoEmAndamento?.treino && (
        <View style={styles.resumeCard}>
          <Text style={styles.resumeLabel}>TREINO EM ANDAMENTO</Text>
          <Text style={styles.resumeTitle} numberOfLines={2}>
            {treinoEmAndamento.treino?.nome || "Treino atual"}
          </Text>
          <Text style={styles.resumeText}>
            Exercício {exercicioAtualNumero} • Série {serieAtualNumero}
          </Text>

          <TouchableOpacity
            style={styles.resumeButton}
            onPress={onContinueWorkout}
            accessibilityRole="button"
            accessibilityLabel="Continuar treino em andamento"
          >
            <Text style={styles.resumeButtonText}>Continuar treino</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Visão geral</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalTreinos}</Text>
          <Text style={styles.statLabel}>Treinos criados</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalConcluidos}</Text>
          <Text style={styles.statLabel}>Treinos concluídos</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalSeriesConcluidas}</Text>
          <Text style={styles.statLabel}>Séries concluídas</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumberSmall} numberOfLines={2}>
            {ultimoTreinoTexto}
          </Text>
          <Text style={styles.statLabel}>Último treino</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Meta semanal</Text>

      <View style={styles.goalCard}>
        <Text style={styles.goalMainText}>
          {metaSemanalNumero > 0
            ? `${totalDiasTreinadosSemana}/${metaSemanalNumero} treino(s)`
            : "--/-- treino(s)"}
        </Text>

        <Text style={styles.goalSubText}>{mensagemMeta()}</Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${percentualSeguro}%` }]}
          />
        </View>

        <Text style={styles.goalPercent}>
          {metaSemanalNumero > 0 ? `${percentualSeguro.toFixed(0)}%` : "0%"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Consistência semanal</Text>

      <View style={styles.weekCard}>
        <Text style={styles.weekTitle}>
          {totalDiasTreinadosSemana}/7 dias treinados nesta semana
        </Text>

        <View style={styles.weekRow}>
          {dadosSemana.map((dia) => (
            <View
              key={dia.nome}
              style={[
                styles.dayBox,
                dia.treinou ? styles.dayBoxDone : styles.dayBoxPending,
              ]}
            >
              <Text style={styles.dayName}>{dia.nome}</Text>
              <Text style={styles.dayStatus}>{dia.treinou ? "✅" : "⭕"}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acessos rápidos</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onGoToWorkouts}
        accessibilityRole="button"
        accessibilityLabel="Ir para meus treinos"
      >
        <Text style={styles.buttonText}>Meus Treinos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onGoToHistory}
        accessibilityRole="button"
        accessibilityLabel="Ir para histórico"
      >
        <Text style={styles.buttonText}>Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onGoToStats}
        accessibilityRole="button"
        accessibilityLabel="Ir para estatísticas"
      >
        <Text style={styles.buttonText}>Estatísticas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onGoToAchievements}
        accessibilityRole="button"
        accessibilityLabel="Ir para conquistas"
      >
        <Text style={styles.buttonText}>Conquistas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={onGoToProfile}
        accessibilityRole="button"
        accessibilityLabel="Ir para perfil"
      >
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
  },

  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 10,
    lineHeight: 24,
    marginBottom: 20,
  },

  heroCard: {
    backgroundColor: "#1d4ed8",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  heroLabel: {
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },

  heroText: {
    color: "#dbeafe",
    fontSize: 15,
    lineHeight: 22,
  },

  streakCard: {
    backgroundColor: "#f97316",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  streakTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  streakNumber: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 6,
  },

  streakText: {
    color: "#ffedd5",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },

  reminderCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  reminderTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  reminderText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },

  reminderOnButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  reminderOffButton: {
    backgroundColor: "#b91c1c",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  reminderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  resumeCard: {
    backgroundColor: "#16a34a",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },

  resumeLabel: {
    color: "#dcfce7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },

  resumeTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  resumeText: {
    color: "#ecfccb",
    fontSize: 15,
    marginBottom: 14,
  },

  resumeButton: {
    backgroundColor: "#14532d",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  resumeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },

  goalCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },

  goalMainText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  goalSubText: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },

  progressBarBackground: {
    width: "100%",
    height: 14,
    backgroundColor: "#334155",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 999,
  },

  goalPercent: {
    color: "#22c55e",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    backgroundColor: "#1e293b",
    width: "48%",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 14,
    minHeight: 130,
    justifyContent: "center",
  },

  statNumber: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 10,
  },

  statNumberSmall: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 15,
    color: "#cbd5e1",
    lineHeight: 22,
  },

  weekCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },

  weekTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 18,
  },

  weekRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },

  dayBox: {
    width: "13%",
    minWidth: 42,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  dayBoxDone: {
    backgroundColor: "#166534",
  },

  dayBoxPending: {
    backgroundColor: "#334155",
  },

  dayName: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },

  dayStatus: {
    fontSize: 18,
  },

  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
    marginBottom: 14,
  },

  secondaryButton: {
    backgroundColor: "#334155",
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
    marginBottom: 14,
  },

  profileButton: {
    backgroundColor: "#1d4ed8",
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
