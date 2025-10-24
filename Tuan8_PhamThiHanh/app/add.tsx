import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";

export default function AddTask() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [title, setTitle] = useState("");

  // Load existing task if editing
  useEffect(() => {
    if (!id) return;
    (async () => {
      const result = await db.getFirstAsync<{ title: string }>("SELECT title FROM tasks WHERE id = ?", id);
      if (result) setTitle(result.title);
    })();
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) return;

    if (id) {
      await db.runAsync("UPDATE tasks SET title = ? WHERE id = ?", title, id);
    } else {
      await db.runAsync("INSERT INTO tasks (title, done) VALUES (?, ?)", title, 0);
    }

    // Navigate về Home và gửi param refresh
    router.replace({ pathname: "/home", params: { refresh: Date.now() } });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={setTitle}
        autoFocus
        onSubmitEditing={handleSave}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.btnText}>{id ? "Save Changes" : "Add Task"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f6f7fb" },
  input: { width: "100%", padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: "#00BCD4", paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
