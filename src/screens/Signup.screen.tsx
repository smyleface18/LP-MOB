import React, { useState } from "react";
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
import { useAuth } from "../hooks/useAuth";
import { SignUpDto } from "../types/type";

const SignupScreen = () => {
  const navigation = useNavigation();

  const handleLoginRedirect = () => {
    navigation.navigate("Login" as never);
  };

  const { signUp, loading, error, signUpForm, setSignUpForm } = useAuth();

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const handleSignUp = async () => {
    if (signUpForm.password != signUpForm.confirmPassword) {
      alert("las constraseñas no coinciden");
      return;
    }

    if (!validatePassword(signUpForm.password)) {
      alert(
        `La contraseña debe contener mayúsculas, minúsculas,
         números y caracteres especiales, la contraseña debe tener 8 caracteres o más de largo.`
      );
      return;
    }
    const signUpDto: SignUpDto = {
      email: signUpForm.email,
      username: signUpForm.nickname,
      password: signUpForm.password,
    };

    const result = await signUp(signUpDto);

    alert(result);
    console.log(result);
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
          value={signUpForm.email}
          onChangeText={(text) => setSignUpForm({ ...signUpForm, email: text })}
        />

        {/* Input de nickname */}
        <Input
          placeholder="nickname"
          keyboardType="twitter"
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={signUpForm.nickname}
          onChangeText={(text) =>
            setSignUpForm({ ...signUpForm, nickname: text })
          }
        />

        {/* Input de Contraseña */}
        <Input
          placeholder="Contraseña"
          secureTextEntry
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={signUpForm.password}
          onChangeText={(text) =>
            setSignUpForm({ ...signUpForm, password: text })
          }
        />

        {/* Input de Confirmación de Contraseña */}
        <Input
          placeholder="Confirmar contraseña"
          secureTextEntry
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={signUpForm.confirmPassword}
          onChangeText={(text) =>
            setSignUpForm({ ...signUpForm, confirmPassword: text })
          }
        />

        {/* Botón de Registro */}
        <Button
          title={loading ? "Registrando..." : "Registrarse"}
          variant="primary"
          size="medium"
          style={[styles.signupButton, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
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
  buttonDisabled: {
    opacity: 0.6,
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
