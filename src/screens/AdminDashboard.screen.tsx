import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CategoryItem from "../components/CategoryItem.component";
import MetricCard from "../components/Metric.component";
import CircularChart from "../components/Char.component";
import ProgressBar from "../components/ProgressBar.component";
import StatItem from "../components/Statitem.component";
import Button from "../components/Button.component";

const AdminDashboardScreen = () => {
  const navigation = useNavigation();

  const metricsData = {
    totalQuestions: 156,
    totalCategories: 12,
    totalUsers: 2.847,
    activeUsers: 1.234,
    totalGames: 8.921,
    averageScore: 76,
    newUsersThisWeek: 156,
    questionsAnswered: 45.678,
  };

  const handleNavigateToQuestions = () => {
    navigation.navigate("ManageQuestionsScreen" as never);
  };

  const handleNavigateToCategories = () => {
    navigation.navigate("ManageCategoriesScreen" as never);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard Admin</Text>
        <Text style={styles.subtitle}>Resumen general de LinguaPlay</Text>
      </View>

      {/* Métricas Principales */}
      <View style={styles.metricsGrid}>
        <MetricCard
          value={metricsData.totalQuestions}
          label="Preguntas"
          subLabel="+12 esta semana"
        />
        <MetricCard
          value={metricsData.totalCategories}
          label="Categorías"
          subLabel="3 niveles"
        />
        <MetricCard
          value={metricsData.totalUsers}
          label="Usuarios"
          subLabel="Total registrados"
        />
        <MetricCard
          value={metricsData.activeUsers}
          label="Activos"
          subLabel="Últimos 7 días"
        />
      </View>

      {/* Gráficas de Rendimiento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rendimiento General</Text>
        <View style={styles.chartsRow}>
          <CircularChart
            percentage={metricsData.averageScore}
            label="Puntuación Promedio"
            color="#FF0000"
          />
          <CircularChart
            percentage={85}
            label="Tasa de Finalización"
            color="#000000"
          />
          <CircularChart 
            percentage={72} 
            label="Retención" 
            color="#FF4444" 
          />
        </View>
      </View>

      {/* Estadísticas de Uso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas de Uso</Text>
        <View style={styles.statsContainer}>
          <ProgressBar percentage={65} label="Principiantes" color="#FF0000" />
          <ProgressBar percentage={25} label="Intermedios" color="#000000" />
          <ProgressBar percentage={10} label="Avanzados" color="#CC0000" />
        </View>

        <View style={styles.additionalStats}>
          <StatItem
            value={metricsData.totalGames}
            label="Juegos Completados"
          />
          <StatItem
            value={metricsData.questionsAnswered}
            label="Preguntas Respondidas"
          />
          <StatItem
            value={metricsData.newUsersThisWeek}
            label="Nuevos Esta Semana"
          />
        </View>
      </View>

      {/* Distribución de Categorías */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distribución por Categoría</Text>
        <View style={styles.categoryDistribution}>
          <CategoryItem color="#FF0000" text="Vocabulario (35%)" />
          <CategoryItem color="#000000" text="Gramática (25%)" />
          <CategoryItem color="#CC0000" text="Listening (20%)" />
          <CategoryItem color="#990000" text="Speaking (15%)" />
          <CategoryItem color="#660000" text="Otros (5%)" />
        </View>
      </View>

      {/* Botones de Acción */}
      <View style={styles.actionsSection}>
        <Button
          title="Gestionar Preguntas"
          variant="primary"
          size="large"
          onPress={handleNavigateToQuestions}
          style={styles.actionButton}
        />
        <Button
          title="Gestionar Categorías"
          variant="primary"
          size="large"
          onPress={handleNavigateToCategories}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#FF0000",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    justifyContent: "space-between",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 15,
  },
  chartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsContainer: {
    marginBottom: 20,
  },
  additionalStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryDistribution: {
    marginTop: 10,
  },
  actionsSection: {
    padding: 20,
  },
  actionButton: {
    marginBottom: 15,
  },
});

export default AdminDashboardScreen;