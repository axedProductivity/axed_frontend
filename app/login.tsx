import { StyleSheet, Pressable, View, TextInput, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { app } from "@/config/firebaseConfig";
import { router, useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <ThemedText style={styles.title}>Log in to your account</ThemedText>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#666666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? "Logging in..." : "Log in"}
          </ThemedText>
        </Pressable>
        <Pressable onPress={() => router.push("/signup")}>
          <ThemedText style={styles.signupText}>
            Don't have an account? Sign up
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: "#D0D0D0",
    marginBottom: 30,
    fontFamily: "SpaceMono",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#D0D0D0",
    marginBottom: 8,
    fontFamily: "SpaceMono",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(51, 102, 153, 0.5)",
    borderRadius: 16,
    paddingHorizontal: 16,
    color: "#D0D0D0",
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
  button: {
    backgroundColor: "#336699",
    padding: 16,
    borderRadius: 32,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#D0D0D0",
    fontSize: 16,
    fontFamily: "SpaceMono",
    fontWeight: "600",
  },
  error: {
    color: "#ff6b6b",
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "SpaceMono",
    textAlign: "center",
  },
  signupText: {
    color: "#D0D0D0",
    fontSize: 16,
    fontFamily: "SpaceMono",
    textAlign: "center",
    marginTop: 20,
  },
});
