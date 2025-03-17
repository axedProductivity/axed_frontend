import React, { useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SkeletonLoading = () => {
  const shimmer = new Animated.Value(0);

  // Colors matching your app's dark theme
  const backgroundColor = "#1a203a";
  const shimmerColor = "#2a315a";
  const highlightColor = "#3a4170";

  useEffect(() => {
    // Create the shimmer animation
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  // Create the shimmer gradient interpolation
  const shimmerGradient = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  // Shared shimmer animation style
  const getShimmerStyle = () => {
    return {
      backgroundColor: backgroundColor,
      overflow: "hidden" as const,
      position: "relative" as const,
    };
  };

  // Animated gradient overlay
  const renderShimmerOverlay = (width: number) => {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: shimmerColor,
            width: width,
            transform: [{ translateX: shimmerGradient }],
          },
          styles.shimmerGradient,
        ]}
      />
    );
  };

  return (
    <LinearGradient colors={["#23294d", "#0f152f"]} style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <View style={[styles.avatar, getShimmerStyle()]}>
          {renderShimmerOverlay(60)}
        </View>
        <View style={styles.headerTextContainer}>
          <View style={[styles.titleSkeleton, getShimmerStyle()]}>
            {renderShimmerOverlay(150)}
          </View>
          <View style={[styles.subtitleSkeleton, getShimmerStyle()]}>
            {renderShimmerOverlay(100)}
          </View>
        </View>
      </View>

      {/* Content skeletons */}
      <View style={styles.content}>
        {/* Card 1 */}
        <View style={[styles.card, getShimmerStyle()]}>
          {renderShimmerOverlay(300)}
          <View style={styles.cardContent}>
            <View style={[styles.cardTitle, getShimmerStyle()]}>
              {renderShimmerOverlay(200)}
            </View>
            <View style={[styles.cardText, getShimmerStyle()]}>
              {renderShimmerOverlay(250)}
            </View>
            <View style={[styles.cardText, getShimmerStyle()]}>
              {renderShimmerOverlay(180)}
            </View>
          </View>
        </View>

        {/* Card 2 */}
        <View style={[styles.card, getShimmerStyle()]}>
          {renderShimmerOverlay(300)}
          <View style={styles.cardContent}>
            <View style={[styles.cardTitle, getShimmerStyle()]}>
              {renderShimmerOverlay(200)}
            </View>
            <View style={[styles.cardText, getShimmerStyle()]}>
              {renderShimmerOverlay(250)}
            </View>
            <View style={[styles.cardText, getShimmerStyle()]}>
              {renderShimmerOverlay(180)}
            </View>
          </View>
        </View>

        {/* List items */}
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.listItem}>
            <View style={[styles.listItemIcon, getShimmerStyle()]}>
              {renderShimmerOverlay(40)}
            </View>
            <View style={styles.listItemContent}>
              <View style={[styles.listItemTitle, getShimmerStyle()]}>
                {renderShimmerOverlay(200)}
              </View>
              <View style={[styles.listItemSubtitle, getShimmerStyle()]}>
                {renderShimmerOverlay(150)}
              </View>
            </View>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 50, // Adding padding to account for safe area
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  titleSkeleton: {
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
    width: "80%",
  },
  subtitleSkeleton: {
    height: 16,
    borderRadius: 4,
    width: "50%",
  },
  content: {
    flex: 1,
  },
  card: {
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  cardTitle: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
    width: "70%",
  },
  cardText: {
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
    width: "90%",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    height: 18,
    borderRadius: 4,
    marginBottom: 6,
    width: "80%",
  },
  listItemSubtitle: {
    height: 14,
    borderRadius: 4,
    width: "60%",
  },
  shimmerGradient: {
    width: 40,
    height: "100%",
    opacity: 0.5,
  },
});

export default SkeletonLoading;
