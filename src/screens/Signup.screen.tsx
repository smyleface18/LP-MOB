import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Input.component";
import Button from "../components/Button.component";

const SignupScreen = () => {
  const navigation = useNavigation();

  const handleLoginRedirect = () => {
    navigation.navigate("Login" as never);
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
          keyboardType="email-address"
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
        />

        {/* Input de Contraseña */}
        <Input
          placeholder="Contraseña"
          secureTextEntry
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
        />

        {/* Input de Confirmación de Contraseña */}
        <Input
          placeholder="Confirmar contraseña"
          secureTextEntry
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
        />

        {/* Botón de Registro */}
        <Button
          title="Registrarse"
          variant="primary"
          size="medium"
          style={styles.signupButton}
        />

        {/* Link de Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            ¿Ya estás registrado?{" "}
            <Text style={styles.loginLink} onPress={handleLoginRedirect}>
              Inicia sesión aquí
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
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  signupButton: {
    width: "100%",
    marginTop: 8,
  },
  loginContainer: {
    marginTop: 20,
  },
  loginText: {
    color: "#000000",
    fontSize: 14,
  },
  loginLink: {
    color: "#FF0000",
    fontWeight: "bold",
  },
});

export default SignupScreen;
