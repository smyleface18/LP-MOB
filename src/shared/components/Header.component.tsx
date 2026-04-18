import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({
  title = "",
  subtitle = "LinguaPlay Overview",
  titleStyle = {},
  subtitleStyle = {},
  headerStyle = {},
  containerStyle = {}
}) => {
  return (
    <View style={[styles.header, headerStyle]}>
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#000000ff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  container: {
    // Contenedor interno para mayor flexibilidad
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
});

export default Header;