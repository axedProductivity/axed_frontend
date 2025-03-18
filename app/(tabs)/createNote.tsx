import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateCarousel from "@/components/notes/dateCarousel";
import { Ionicons } from "@expo/vector-icons";

export default function CreateNoteScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const contentInputRef = useRef<TextInput>(null);

  const handleSaveNote = () => {
    console.log("Saving note:", { title, content, date: selectedDate });
  };

  const focusContentInput = () => {
    if (contentInputRef.current) {
      contentInputRef.current.focus();
    }
  };

  return (
    <LinearGradient
      colors={["#23294d", "#0f152f"]}
      style={[styles.gradientBackground, { paddingTop: insets.top }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.header}>
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity> */}
          <Text style={styles.headerTitle}>New Note</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.noteContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder="Note Title"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
              onSubmitEditing={focusContentInput}
              selectionColor="#4866fe"
              maxLength={100}
            />
          </View>

          <View style={styles.contentContainer}>
            <TextInput
              ref={contentInputRef}
              style={styles.contentInput}
              placeholder="Start typing your note..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              selectionColor="#4866fe"
              autoCapitalize="sentences"
            />
          </View>
        </ScrollView>

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarButton}>
            <Ionicons name="attach" size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Ionicons name="list" size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Ionicons name="checkbox" size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Ionicons name="image" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4866fe",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  noteContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  titleContainer: {
    marginVertical: 10,
    backgroundColor: "rgba(11, 14, 30, 0.6)",
    borderRadius: 12,
    padding: 10,
  },
  titleInput: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(11, 14, 30, 0.6)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    minHeight: 300,
  },
  contentInput: {
    color: "#ffffff",
    fontSize: 16,
    padding: 5,
    lineHeight: 24,
    minHeight: 290,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(11, 14, 30, 0.8)",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: Platform.OS === "ios" ? 30 : 12,
  },
  toolbarButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(72, 102, 254, 0.2)",
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
});
