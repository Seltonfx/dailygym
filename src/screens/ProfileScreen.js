import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen({
  perfil = {},
  onGoBack,
  onEditProfile,
}) {
  const nomeUsuario = perfil?.nome?.trim() ? perfil.nome.trim() : 'Usuário';

  const dadosFormatados = useMemo(() => {
    const peso = perfil?.peso ? `${perfil.peso} kg` : '--';
    const altura = perfil?.altura ? `${perfil.altura} m` : '--';
    const objetivo = perfil?.objetivo?.trim() || '--';
    const nivel = perfil?.nivel?.trim() || '--';
    const metaSemanal = perfil?.metaSemanal
      ? `${perfil.metaSemanal} treino(s)`
      : '--';

    return {
      peso,
      altura,
      objetivo,
      nivel,
      metaSemanal,
    };
  }, [perfil]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Seu Perfil</Text>
        <Text style={styles.subtitle}>
          Informações pessoais e metas do seu treino.
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {nomeUsuario.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.heroName}>{nomeUsuario}</Text>
          <Text style={styles.heroDescription}>
            Mantenha seus dados atualizados para acompanhar melhor sua evolução.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Dados físicos</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{dadosFormatados.peso}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>{dadosFormatados.altura}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Objetivos e nível</Text>

          <View style={styles.infoRowVertical}>
            <Text style={styles.infoLabel}>Objetivo</Text>
            <Text style={styles.infoValueBlock}>
              {dadosFormatados.objetivo}
            </Text>
          </View>

          <View style={styles.infoRowVertical}>
            <Text style={styles.infoLabel}>Nível</Text>
            <Text style={styles.infoValueBlock}>{dadosFormatados.nivel}</Text>
          </View>

          <View style={styles.infoRowVertical}>
            <Text style={styles.infoLabel}>Meta semanal</Text>
            <Text style={styles.infoValueBlock}>
              {dadosFormatados.metaSemanal}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditProfile}
          accessibilityRole="button"
          accessibilityLabel="Editar perfil">
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela inicial">
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 30,
  },

  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },

  heroCard: {
    backgroundColor: '#1d4ed8',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
  },

  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  heroName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },

  heroDescription: {
    color: '#dbeafe',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
  },

  cardSectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  infoRowVertical: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  infoLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  infoValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  infoValueBlock: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },

  editButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 14,
    marginTop: 4,
  },

  backButton: {
    backgroundColor: '#334155',
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 30,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
