import { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";

interface Task {
  id: number;
  title: string;
  done: boolean;
}

export default function Home() {
  const db = useSQLiteContext();
  const { name, refresh } = useLocalSearchParams<{ name?: string; refresh?: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    const res = await db.getAllAsync<Task>("SELECT * FROM tasks ORDER BY id DESC");
    setTasks(res);
  };

  // Khi component mount hoặc param refresh thay đổi → fetch lại tasks
  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  const toggleDone = async (id: number, done: boolean) => {
    await db.runAsync("UPDATE tasks SET done = ? WHERE id = ?", !done, id);
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await db.runAsync("DELETE FROM tasks WHERE id = ?", id);
    fetchTasks();
  };

  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: "https://i.pravatar.cc/100?img=5" }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>Hi {name}</Text>
          <Text style={styles.sub}>Have a great day ahead</Text>
        </View>
      </View>

      <TextInput placeholder="Search" value={search} onChangeText={setSearch} style={styles.search} />

      <ScrollView>
  {filtered.map((task) => (
    <View key={task.id} style={styles.card}>
      <TouchableOpacity onPress={() => toggleDone(task.id, task.done)}>
        <MaterialIcons name={task.done ? "check-box" : "check-box-outline-blank"} size={24} color="#00C853" />
      </TouchableOpacity>

      <Text style={[styles.text, { textDecorationLine: task.done ? "line-through" : "none" }]}>
        {task.title}
      </Text>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => router.push(`/add?id=${task.id}`)}>
          <MaterialIcons name="edit" size={22} color="#e74c3c" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteTask(task.id)} style={{ marginLeft: 10 }}>
          <MaterialIcons name="delete" size={22} color="#e53935" />
        </TouchableOpacity>
      </View>
    </View>
  ))}
</ScrollView>


      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb", padding: 20, paddingTop: 60 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "bold" },
  sub: { fontSize: 13, color: "#7f8c8d" },
  search: { backgroundColor: "#fff", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#ddd", marginBottom: 10 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 15, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 10 },
  text: { flex: 1, marginLeft: 10, fontSize: 16 },
  fab: { position: "absolute", bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: "#00BCD4", justifyContent: "center", alignItems: "center" },
});
