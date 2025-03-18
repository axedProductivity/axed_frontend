import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUserData } from "@/hooks/getUserData";
import SkeletonLoading from "@/components/loading";
import { useAuth } from "@/hooks/useAuth";
import useLocation from "@/hooks/useLocation";
import { useState, useEffect } from "react";

export default function NotesScreen() {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData(user);
  const insets = useSafeAreaInsets();
  const [weather, setWeather] = useState<any>(null);
  const [moon, setMoon] = useState<any>(null);
  const [greeting, setGreeting] = useState<string>("What's on your mind");
  const { location, errorMsg } = useLocation();

  // Set greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good morning");
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting("Good afternoon");
      } else if (currentHour >= 17 && currentHour < 22) {
        setGreeting("Good evening");
      } else {
        setGreeting("Still up late");
      }
    };

    updateGreeting();
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!location) {
          console.log("Location not available yet");
          return;
        }

        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&q=${location.coords.latitude},${location.coords.longitude}`
        );
        const data = await response.json();
        console.log("Weather data:", data);
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    if (location) {
      fetchWeather();
    }
  }, [location]);

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
          <Text style={styles.greeting}>
            {greeting}
            {userData?.firstName ? ", " + userData.firstName : ""}
          </Text>

          <Text style={styles.question}>What's on your mind?</Text>

          {weather && (
            <>
              <View style={styles.weatherContent}>
                <View style={styles.weatherMain}>
                  <Text style={styles.temperature}>
                    {weather.current.temp_f}°F
                  </Text>
                  <View style={styles.conditionContainer}>
                    {weather.current.condition.icon && (
                      <Image
                        source={{
                          uri: `https:${weather.current.condition.icon}`,
                        }}
                        style={styles.weatherIcon}
                      />
                    )}
                  </View>
                </View>
              </View>
            </>
          )}
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
    padding: 20,
    alignItems: "stretch",
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 32,
    marginBottom: 8,
    fontFamily: "PlayfairDisplay_600SemiBold",
  },
  question: {
    color: "#CCCCCC",
    fontSize: 20,
    marginBottom: 30,
    fontFamily: "PlayfairDisplay_400Regular",
  },

  weatherContent: {
    marginBottom: 20,
  },
  weatherMain: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  temperature: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "bold",
  },
  conditionContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  weatherIcon: {
    width: 64,
    height: 64,
    marginBottom: 5,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "SpaceMono",
  },
});
