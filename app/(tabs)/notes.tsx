import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useUserData } from "@/hooks/getUserData";
import SkeletonLoading from "@/components/loading";
import { useAuth } from "@/hooks/useAuth";
import useLocation from "@/hooks/useLocation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DateCarousel from "@/components/notes/dateCarousel";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
export default function NotesScreen() {
  const navigation = useNavigation();
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData(user);
  const insets = useSafeAreaInsets();
  const [weather, setWeather] = useState<any>(null);
  const [greeting, setGreeting] = useState<string>("What's on your mind");
  const { location, errorMsg } = useLocation();

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Set greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Rise and shine ☀️");
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting("Having a great day 🌤️");
      } else if (currentHour >= 17 && currentHour < 22) {
        setGreeting("Winding down, ✨");
      } else {
        setGreeting("Night owl mode 🌙");
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

  // Handle date change
  const onDateChange = (date: Date) => {
    setSelectedDate(date);
    // You can perform additional actions based on the selected date here
    console.log("Selected date:", date.toISOString().split("T")[0]);
  };

  if (authLoading || userDataLoading) {
    return <SkeletonLoading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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

            {weather && (
              <View style={styles.headerContainer}>
                <View style={styles.weatherInfo}>
                  <Text style={styles.question}>What's on your mind?</Text>
                  <View style={styles.locationContainer}>
                    <Text style={styles.locationText}>
                      {weather.location.name}, {weather.location.country}
                    </Text>
                  </View>
                </View>

                <View style={styles.weatherDisplay}>
                  <Text style={styles.temperature}>
                    {weather.current.temp_c}°C | {weather.current.temp_f}°F
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
                    <Text style={styles.conditionText}>
                      {weather.current.condition.text}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {!weather && (
              <Text style={styles.question}>What's on your mind?</Text>
            )}

            {/* DateCarousel component with proper initialization */}
            <DateCarousel
              initialDate={selectedDate}
              onDateChange={onDateChange}
            />
            <TouchableOpacity
              style={styles.createNoteButton}
              onPress={() => navigation.navigate({ name: "createNote" })}
            >
              <View style={styles.createNotePlus}>
                <Ionicons
                  name="add"
                  size={28}
                  color="white"
                  style={{ fontWeight: "bold" }}
                />
              </View>
              <Text style={styles.createNoteButtonText}>Create Note</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </GestureHandlerRootView>
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
    marginBottom: 24,
    fontFamily: "PlayfairDisplay_500Medium",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  weatherInfo: {
    flex: 1,
    justifyContent: "flex-start",
  },
  question: {
    color: "#CCCCCC",
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "Montserrat_400Regular",
  },
  locationContainer: {
    marginTop: 4,
  },
  locationText: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  weatherDisplay: {
    alignItems: "flex-end",
  },
  temperature: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Montserrat_400Regular",
    marginBottom: 4,
  },
  conditionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherIcon: {
    width: 36,
    height: 36,
    marginRight: 6,
  },
  conditionText: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  createNoteButton: {
    backgroundColor: "#4866fe",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  createNoteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    textAlign: "center",
  },
  createNotePlus: {
    width: 32,
    height: 32,
    backgroundColor: "#0B0E1E",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
