import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Atenção", "Preencha email e senha.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Erro ao entrar",
        error?.message || "Não foi possível entrar.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Gym</Text>
        <Text style={styles.subtitle}>
          Entre para sincronizar seus treinos na nuvem.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu email"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { color: "#fff", fontSize: 34, fontWeight: "900", marginBottom: 8 },
  subtitle: { color: "#94a3b8", fontSize: 16, marginBottom: 24 },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
  link: {
    color: "#60a5fa",
    textAlign: "center",
    marginTop: 18,
    fontWeight: "700",
  },
});
