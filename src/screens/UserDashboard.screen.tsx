import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MetricCard from "../components/Metric.component";
import CircularChart from "../components/Char.component";
import ProgressBar from "../components/ProgressBar.component";
import StatItem from "../components/Statitem.component";
import Button from "../components/Button.component";
import { useGame } from "../hooks/useGame";
import { useCategories } from "../hooks/useCategories";

const UserDashboardScreen = () => {
  const navigation = useNavigation();
  const { connected, score, userId, joinGame, isConnected } = useGame();

  const {
    categories,
    loading: categoriesLoading,
    loadCategories,
    activeCategories,
    totalCategories,
  } = useCategories();

  const [userStats] = useState({
    totalGames: 45,
    gamesWon: 32,
    currentStreak: 5,
    bestStreak: 12,
    averageScore: 76,
  });

  const handleQuickPlay = () => {
    if (!isConnected) {
      alert("Please check your connection and try again");
      return;
    }
    joinGame();
    navigation.navigate("GameScreen" as never);
  };

  const handleSelectCategory = () => {
    navigation.navigate("CategorySelection" as never);
  };

  const handleHowToPlay = () => {
    navigation.navigate("GameScreen" as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/7178/7178489.png",
                }}
                style={styles.avatarImage}
                resizeMode="cover"
                onError={() => {
                  // Fallback a avatar por defecto
                  console.log("Using default avatar");
                }}
              />
            </View>
          </View>
          <Text style={styles.nickname}>Username</Text>
          <View style={styles.connectionStatus}>
            <View
              style={[
                styles.statusDot,
                connected ? styles.connected : styles.disconnected,
              ]}
            />
            <Text style={styles.statusText}>
              {connected ? "Connected" : "Disconnected"}
            </Text>
          </View>
        </View>

        {/* Main Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard value={userStats.totalGames} label="Games Played" />
          <MetricCard value={userStats.gamesWon} label="Games Won" />
          <MetricCard value={userStats.currentStreak} label="Current Streak" />
          <MetricCard value={totalCategories} label="Categories" />
        </View>

        {/* Performance Charts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.chartsRow}>
            <CircularChart
              percentage={userStats.averageScore}
              label="Average Score"
              color="#FF0000"
            />
            <CircularChart
              percentage={Math.round(
                (userStats.gamesWon / userStats.totalGames) * 100
              )}
              label="Win Rate"
              color="#000000"
            />
            <CircularChart
              percentage={userStats.currentStreak * 10}
              label="Streak Power"
              color="#FF4444"
            />
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <View style={styles.statsContainer}>
            <ProgressBar percentage={65} label="Beginner" color="#FF0000" />
            <ProgressBar percentage={25} label="Intermediate" color="#000000" />
            <ProgressBar percentage={10} label="Advanced" color="#CC0000" />
          </View>

          <View style={styles.additionalStats}>
            <StatItem value={userStats.totalGames} label="Total Games" />
            <StatItem value={userStats.gamesWon} label="Games Won" />
            <StatItem value={userStats.bestStreak} label="Best Streak" />
          </View>
        </View>

        {/* Action Buttons */}
        <Button
          title="How to Play"
          variant="secondary"
          size="large"
          onPress={handleHowToPlay}
          style={styles.actionButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  nickname: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connected: {
    backgroundColor: "#00FF00",
  },
  disconnected: {
    backgroundColor: "#FF0000",
  },
  statusText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    marginBottom: 10,
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
  actionsSection: {
    padding: 20,
  },
  actionButton: {
    marginBottom: 15,
  },
});

export default UserDashboardScreen;
