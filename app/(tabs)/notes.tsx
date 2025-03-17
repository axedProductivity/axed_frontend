import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUserData } from "@/hooks/getUserData";
import SkeletonLoading from "@/components/loading";
import { useAuth } from "@/hooks/useAuth";

export default function NotesScreen() {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData(user);
  const insets = useSafeAreaInsets();

  if (authLoading || userDataLoading) {
    return <SkeletonLoading />;
  }

  return (
    <LinearGradient
      colors={["#23294d", "#0f152f"]}
      style={styles.gradientBackground}
    >
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.text}>
            What's on your mind{", " + userData?.firstName + "?" || "?"}
          </Text>
        </View>
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
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: "#FFFFFF", // Assuming you want white text on the dark background
  },
});
