import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#444444",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#0B0E1E",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Journal",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="journal-whills" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meditation"
        options={{
          title: "Meditation",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="meditation" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="createNote"
        options={{
          title: "Create Note",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
