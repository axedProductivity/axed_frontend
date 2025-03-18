import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function CreateNoteScreen() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={["#23294d", "#0f152f"]}
      style={styles.gradientBackground}
    >
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Create Note</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
