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
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>LinguaPlay Overview</Text>
      </View>

      {/* Main Metrics */}
      <View style={styles.metricsGrid}>
        <MetricCard
          value={metricsData.totalQuestions}
          label="Questions"
          subLabel="+12 this week"
        />
        <MetricCard
          value={metricsData.totalCategories}
          label="Categories"
          subLabel="3 levels"
        />
        <MetricCard
          value={metricsData.totalUsers}
          label="Users"
          subLabel="Total registered"
        />
        <MetricCard
          value={metricsData.activeUsers}
          label="Active"
          subLabel="Last 7 days"
        />
      </View>

      {/* Performance Charts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Performance</Text>
        <View style={styles.chartsRow}>
          <CircularChart
            percentage={metricsData.averageScore}
            label="Average Score"
            color="#FF0000"
          />
          <CircularChart
            percentage={85}
            label="Completion Rate"
            color="#000000"
          />
          <CircularChart 
            percentage={72} 
            label="Retention" 
            color="#FF4444" 
          />
        </View>
      </View>

      {/* Usage Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Statistics</Text>
        <View style={styles.statsContainer}>
          <ProgressBar percentage={65} label="Beginners" color="#FF0000" />
          <ProgressBar percentage={25} label="Intermediate" color="#000000" />
          <ProgressBar percentage={10} label="Advanced" color="#CC0000" />
        </View>

        <View style={styles.additionalStats}>
          <StatItem
            value={metricsData.totalGames}
            label="Games Completed"
          />
          <StatItem
            value={metricsData.questionsAnswered}
            label="Questions Answered"
          />
          <StatItem
            value={metricsData.newUsersThisWeek}
            label="New This Week"
          />
        </View>
      </View>

      {/* Category Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Distribution</Text>
        <View style={styles.categoryDistribution}>
          <CategoryItem color="#FF0000" text="Vocabulary (35%)" />
          <CategoryItem color="#000000" text="Grammar (25%)" />
          <CategoryItem color="#CC0000" text="Listening (20%)" />
          <CategoryItem color="#990000" text="Speaking (15%)" />
          <CategoryItem color="#660000" text="Others (5%)" />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <Button
          title="Manage Questions"
          variant="primary"
          size="large"
          onPress={handleNavigateToQuestions}
          style={styles.actionButton}
        />
        <Button
          title="Manage Categories"
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
    backgroundColor: "#000000ff",
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