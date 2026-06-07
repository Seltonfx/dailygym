import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function ProfileEditScreen({
  perfilAtual,
  onGoBack,
  onSaveProfile,
}) {
  const [nome, setNome] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState("");
  const [metaSemanal, setMetaSemanal] = useState("");

  useEffect(() => {
    if (perfilAtual) {
      setNome(String(perfilAtual.nome || ""));
      setPeso(String(perfilAtual.peso || ""));
      setAltura(String(perfilAtual.altura || ""));
      setObjetivo(String(perfilAtual.objetivo || ""));
      setNivel(String(perfilAtual.nivel || ""));
      setMetaSemanal(String(perfilAtual.metaSemanal || ""));
    }
  }, [perfilAtual]);

  function normalizarNumero(valor) {
    return String(valor).replace(",", ".").trim();
  }

  function salvarPerfil() {
    const nomeLimpo = nome.trim();
    const pesoLimpo = normalizarNumero(peso);
    const alturaLimpa = normalizarNumero(altura);
    const objetivoLimpo = objetivo.trim();
    const nivelLimpo = nivel.trim();
    const metaSemanalLimpa = metaSemanal.trim();

    if (!nomeLimpo) {
      Alert.alert("Atenção", "Digite pelo menos seu nome.");
      return;
    }

    if (pesoLimpo) {
      const pesoNumero = Number(pesoLimpo);
      if (Number.isNaN(pesoNumero) || pesoNumero <= 0 || pesoNumero > 500) {
        Alert.alert("Atenção", "Digite um peso válido em kg.");
        return;
      }
    }

    if (alturaLimpa) {
      const alturaNumero = Number(alturaLimpa);
      if (Number.isNaN(alturaNumero) || alturaNumero <= 0 || alturaNumero > 3) {
        Alert.alert("Atenção", "Digite uma altura válida em metros. Ex: 1.75");
        return;
      }
    }

    if (metaSemanalLimpa) {
      const metaNumero = Number(metaSemanalLimpa);
      if (Number.isNaN(metaNumero) || metaNumero <= 0 || metaNumero > 7) {
        Alert.alert(
          "Atenção",
          "A meta semanal deve ser um número entre 1 e 7."
        );
        return;
      }
    }

    const perfilAtualizado = {
      nome: nomeLimpo,
      peso: pesoLimpo,
      altura: alturaLimpa,
      objetivo: objetivoLimpo,
      nivel: nivelLimpo,
      metaSemanal: metaSemanalLimpa,
    };

    onSaveProfile(perfilAtualizado);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.subtitle}>
          Atualize seus dados e metas fitness.
        </Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Selton"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          value={peso}
          onChangeText={setPeso}
          keyboardType="numeric"
          placeholder="Ex: 78"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Altura (m)</Text>
        <TextInput
          style={styles.input}
          value={altura}
          onChangeText={setAltura}
          keyboardType="numeric"
          placeholder="Ex: 1.75"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Objetivo</Text>
        <TextInput
          style={styles.input}
          value={objetivo}
          onChangeText={setObjetivo}
          placeholder="Ex: Hipertrofia"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Nível</Text>
        <TextInput
          style={styles.input}
          value={nivel}
          onChangeText={setNivel}
          placeholder="Ex: Iniciante / Intermediário / Avançado"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Meta semanal</Text>
        <TextInput
          style={styles.input}
          value={metaSemanal}
          onChangeText={setMetaSemanal}
          keyboardType="numeric"
          placeholder="Ex: 5"
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarPerfil}
          accessibilityRole="button"
          accessibilityLabel="Salvar perfil"
        >
          <Text style={styles.buttonText}>Salvar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          accessibilityRole="button"
          accessibilityLabel="Cancelar edição do perfil"
        >
          <Text style={styles.buttonText}>Cancelar</Text>
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

  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: "#334155",
  },

  saveButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 28,
    marginBottom: 14,
  },

  backButton: {
    backgroundColor: "#334155",
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 30,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});