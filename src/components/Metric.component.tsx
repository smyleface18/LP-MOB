import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface MetricCardProps {
  value: number | string;
  label: string;
  subLabel?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  subLabel,
  color = "#FF0000",
}) => (
  <View style={styles.card}>
    <Text style={[styles.value, { color }]}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
    {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 3,
  },
  subLabel: {
    fontSize: 12,
    color: "#666666",
  },
});

export default MetricCard;
