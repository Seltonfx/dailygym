import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister() {
    setMessage("Botão clicado...");

    const nomeLimpo = name.trim();
    const emailLimpo = email.trim();

    if (!nomeLimpo || !emailLimpo || !password) {
      setMessage("Preencha nome, email e senha.");
      return;
    }

    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("Criando conta...");

      await register(nomeLimpo, emailLimpo, password);

      setMessage("Conta criada com sucesso!");
    } catch (error) {
      console.log("ERRO AO CRIAR CONTA:", error);

      if (error?.code === "auth/email-already-in-use") {
        setMessage("Este email já está cadastrado. Tente fazer login.");
      } else if (error?.code === "auth/invalid-email") {
        setMessage("Email inválido.");
      } else if (error?.code === "auth/weak-password") {
        setMessage("Senha muito fraca.");
      } else if (error?.code === "auth/network-request-failed") {
        setMessage("Falha de conexão. Verifique sua internet.");
      } else {
        setMessage(error?.message || "Não foi possível criar a conta.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          Salve seus dados na nuvem e sincronize entre dispositivos.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />

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
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Criando..." : "Criar conta"}
          </Text>
        </TouchableOpacity>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Já tenho conta</Text>
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
  message: {
    color: "#facc15",
    textAlign: "center",
    marginTop: 14,
    fontWeight: "700",
  },
  link: {
    color: "#60a5fa",
    textAlign: "center",
    marginTop: 18,
    fontWeight: "700",
  },
});
