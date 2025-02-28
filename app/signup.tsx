import {
  StyleSheet,
  Pressable,
  View,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { app } from "@/config/firebaseConfig";
import { router, useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface UserData {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
}

export default function SignupScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Basic validation
    if (!userData.email || !password) {
      setError("Please enter email and password");
      return;
    }
    if (!userData.firstName || !userData.lastName) {
      setError("Please enter your first and last name");
      return;
    }
    if (!userData.age || isNaN(Number(userData.age))) {
      setError("Please enter a valid age");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Create user account
      const auth = getAuth(app);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        password
      );
      router.replace("/(tabs)");
    } catch (err) {
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Image
            source={require("../assets/images/axed-logo-D0D0D0.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <ThemedText style={styles.title}>Create your account</ThemedText>

          <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>First Name</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol
                style={styles.icons}
                name="pencil"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                placeholderTextColor="#666666"
                value={userData.firstName}
                onChangeText={(text) =>
                  setUserData({ ...userData, firstName: text })
                }
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Last Name</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol
                style={styles.icons}
                name="pencil"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                placeholderTextColor="#666666"
                value={userData.lastName}
                onChangeText={(text) =>
                  setUserData({ ...userData, lastName: text })
                }
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Age</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol
                style={styles.icons}
                name="person.fill"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                placeholderTextColor="#666666"
                value={userData.age}
                onChangeText={(text) => setUserData({ ...userData, age: text })}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol
                style={styles.icons}
                name="envelope.fill"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666666"
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol
                style={styles.icons}
                name="lock.fill"
              />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#666666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Confirm Password</ThemedText>
            <View style={styles.inputContainer}>
              <IconSymbol
                style={styles.icons}
                name="lock.rotation"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#666666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? "Creating account..." : "Create account"}
            </ThemedText>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.loginLink}>
            <ThemedText style={styles.loginText}>
              Already have an account? Log in
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    alignItems: "center",
    padding: 20,
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
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    height: 50,
    backgroundColor: "rgba(51, 102, 153, 0.5)",
    borderRadius: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    maxWidth: 400,
    flexDirection: "column"
  },
  label: {
    fontSize: 16,
    color: "#D0D0D0",
    marginBottom: 8,
    fontFamily: "SpaceMono",
  },
  input: {
    color: "#D0D0D0",
    fontSize: 16,
    fontFamily: "SpaceMono",
    flex: 1,
    height: "100%",
    paddingVertical: 10,
    outlineWidth: 0,
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
  loginLink: {
    marginTop: 20,
    padding: 10,
  },
  loginText: {
    color: "#D0D0D0",
    fontSize: 16,
    fontFamily: "SpaceMono",
    textAlign: "center",
  },
  icons: {
    color: "#111111",
    fontSize: 30,
    marginLeft: -8,
    marginRight: 8,
  }
});
