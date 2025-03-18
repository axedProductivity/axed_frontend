import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DOMComponent from "@/components/hello";
import Editor from "@/components/dom-components/hello-dom";

export default function CreateNoteScreen() {
  const insets = useSafeAreaInsets();
  const [plainText, setPlainText] = useState("");
  const [editorState, setEditorState] = useState<string | null>(null);
  return (
    <LinearGradient
      colors={["#23294d", "#0f152f"]}
      style={styles.gradientBackground}
    >
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <Editor setPlainText={setPlainText} setEditorState={setEditorState}/>
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
