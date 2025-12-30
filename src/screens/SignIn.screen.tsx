import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Input.component";
import Button from "../components/Button.component";
import { useAuth } from "../hooks/useAuth";

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, error, loading } = useAuth();

  const handleSignupRedirect = () => {
    navigation.navigate("Signup" as never);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña");
      return;
    }

    const response = await signIn(email, password);
    if (!response?.ok) {
      Alert.alert("Error", response?.message!);
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.formContainer}>
        {/* Logo */}
        <Image
          source={require("../assets/LinguaPlay.png")}
          style={styles.logo}
        />

        {/* Input de Correo */}
        <Input
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={handleLogin}
        />

        {/* Input de Contraseña */}
        <Input
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
        />

        {/* Botón de Login */}
        <Button
          title={loading ? "Iniciando sesión..." : "Login"}
          variant="primary"
          size="medium"
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        />

        {/* Link de Registro */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            ¿No estás registrado?{" "}
            <Text style={styles.registerLink} onPress={handleSignupRedirect}>
              Regístrate aquí
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  formContainer: {
    flex: 1,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    width: "100%",
  },
  registerContainer: {
    marginTop: 20,
  },
  registerText: {
    color: "#000000",
    fontSize: 14,
  },
  registerLink: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  credentialsInfo: {
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#FF0000",
  },
  credentialsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  credentialsText: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
});

export default SignInScreen;
