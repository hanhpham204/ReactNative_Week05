import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  const [name, setName] = useState("");

  const handleStart = () => {
    if (!name.trim()) return;
    router.push({ pathname: "/home", params: { name } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MANAGE YOUR{"\n"}TASK</Text>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.btnText}>GET STARTED →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", color: "#8e44ad", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, width: "70%", padding: 10, marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "#00BCD4", paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
