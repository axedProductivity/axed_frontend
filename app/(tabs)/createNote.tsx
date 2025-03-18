import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { WebView } from "react-native-webview";

// Define attachment type
type Attachment = {
  id: string;
  uri: string;
  type: "image" | "document";
  name: string;
  size?: number;
  mimeType?: string;
};

export default function CreateNoteScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState<string>("");
  const [selectedDate] = useState<Date>(new Date());
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showFormatting, setShowFormatting] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>("");
  const webViewRef = useRef<WebView>(null);

  // Updated editor HTML with modern styling
  const editorInitialContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          font-family: -apple-system, 'Inter', sans-serif;
          margin: 0;
          padding: 16px;
          color: #e0e0e0;
          background: transparent;
          font-size: 16px;
          line-height: 1.6;
          min-height: 100%;
        }
        #editor {
          outline: none;
          min-height: 300px;
          transition: all 0.2s ease;
        }
        a {
          color: #4f75ff;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        a:hover {
          opacity: 0.8;
        }
        img {
          max-width: 100%;
          border-radius: 12px;
          margin: 12px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .file-attachment {
          display: flex;
          align-items: center;
          background: rgba(79, 117, 255, 0.1);
          border-radius: 10px;
          padding: 12px;
          margin: 8px 0;
          border: 1px solid rgba(79, 117, 255, 0.2);
          transition: background 0.2s;
        }
        .file-attachment:hover {
          background: rgba(79, 117, 255, 0.15);
        }
        .file-attachment .icon {
          margin-right: 12px;
          color: #4f75ff;
          font-size: 18px;
        }
        blockquote {
          border-left: 4px solid #4f75ff;
          margin: 12px 0;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0 8px 8px 0;
          color: #b0b0b0;
        }
        code {
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 6px;
          border-radius: 6px;
          font-family: 'Menlo', monospace;
          color: #d0d0d0;
        }
        pre {
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 8px;
          overflow-x: auto;
        }
        ul, ol {
          padding-left: 24px;
          margin: 12px 0;
        }
        li {
          margin: 6px 0;
        }
      </style>
    </head>
    <body>
      <div id="editor" contenteditable="true" spellcheck="true"></div>
      <script>
        const editor = document.getElementById('editor');
        function updateContent() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'content',
            content: editor.innerHTML
          }));
        }
        editor.addEventListener('input', updateContent);
        editor.addEventListener('blur', updateContent);
        window.onload = () => editor.focus();
        window.executeCommand = (command, value = null) => {
          document.execCommand(command, false, value);
          editor.focus();
          updateContent();
        };
        window.insertHTML = (html) => {
          document.execCommand('insertHTML', false, html);
          updateContent();
        };
      </script>
    </body>
    </html>
  `;

  const handleSaveNote = () => {
    webViewRef.current?.injectJavaScript(`
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'getContent',
        content: document.getElementById('editor').innerHTML
      }));
      true;
    `);
    console.log("Saving note:", {
      title,
      content: editorContent,
      date: selectedDate,
      attachments,
    });
  };

  const executeFormatCommand = (
    command: string,
    value: string | null = null
  ) => {
    webViewRef.current?.injectJavaScript(`
      window.executeCommand('${command}', ${value ? `'${value}'` : "null"});
      true;
    `);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        type: "image",
        name: result.assets[0].fileName || `Image_${Date.now()}`,
      };
      setAttachments((prev) => [...prev, newAttachment]);
      webViewRef.current?.injectJavaScript(`
        window.insertHTML('<img src="${newAttachment.uri}" alt="${newAttachment.name}" />');
        true;
      `);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        uri: asset.uri,
        type: "document",
        name: asset.name || `File_${Date.now()}`,
        size: asset.size,
        mimeType: asset.mimeType,
      };
      setAttachments((prev) => [...prev, newAttachment]);
      const fileHtml = `
        <div class="file-attachment">
          <span class="icon">📎</span>
          <span>${newAttachment.name}</span>
        </div>
      `;
      webViewRef.current?.injectJavaScript(`
        window.insertHTML('${fileHtml}');
        true;
      `);
    }
  };

  const handleWebViewMessage = (event: { nativeEvent: { data: string } }) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === "content" || data.type === "getContent") {
      setEditorContent(data.content);
    }
  };

  const renderFormatBar = () => {
    if (!showFormatting) return null;
    return (
      <View style={styles.formatBar}>
        <TouchableOpacity
          style={styles.formatButton}
          onPress={() => executeFormatCommand("bold")}
        >
          <MaterialIcons name="format-bold" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formatButton}
          onPress={() => executeFormatCommand("italic")}
        >
          <MaterialIcons name="format-italic" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formatButton}
          onPress={() => executeFormatCommand("underline")}
        >
          <MaterialIcons name="format-underlined" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.formatDivider} />
        <TouchableOpacity
          style={styles.formatButton}
          onPress={() => executeFormatCommand("insertUnorderedList")}
        >
          <MaterialIcons name="format-list-bulleted" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formatButton}
          onPress={() => executeFormatCommand("insertOrderedList")}
        >
          <MaterialIcons name="format-list-numbered" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.formatDivider} />
        <TouchableOpacity
          style={styles.formatButton}
          onPress={() => executeFormatCommand("formatBlock", "blockquote")}
        >
          <MaterialIcons name="format-quote" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formatButton}
          onPress={() =>
            executeFormatCommand("insertHTML", "<code>code</code>")
          }
        >
          <Feather name="code" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#1a1f3d", "#0d1126"]}
      style={[styles.gradientBackground, { paddingTop: insets.top }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Note</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Note Title"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={title}
            onChangeText={setTitle}
            selectionColor="#4f75ff"
            maxLength={100}
          />
          <View style={styles.contentContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: editorInitialContent }}
              style={styles.webview}
              onMessage={handleWebViewMessage}
              javaScriptEnabled
              domStorageEnabled
              automaticallyAdjustContentInsets={false}
            />
          </View>
        </View>

        {renderFormatBar()}

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarButton} onPress={pickDocument}>
            <Ionicons name="attach" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={pickImage}>
            <Ionicons name="image" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              showFormatting && styles.toolbarButtonActive,
            ]}
            onPress={() => setShowFormatting(!showFormatting)}
          >
            <MaterialIcons name="format-size" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 8 },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  saveButton: {
    backgroundColor: "#4f75ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Inter_500Medium",
  },
  noteContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  titleInput: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 12,
    fontFamily: "Inter_700Bold",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  formatBar: {
    backgroundColor: "rgba(20, 25, 50, 0.95)",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  formatButton: {
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: "rgba(79, 117, 255, 0.15)",
  },
  formatDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 8,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "rgba(20, 25, 50, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  toolbarButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(79, 117, 255, 0.15)",
  },
  toolbarButtonActive: {
    backgroundColor: "#4f75ff",
  },
});
