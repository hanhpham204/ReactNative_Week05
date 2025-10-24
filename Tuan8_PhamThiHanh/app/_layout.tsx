// app/_layout.tsx
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";

async function migrateDb(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0
    );
  `);
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="tasks.db" onInit={migrateDb}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Welcome" }} />
        <Stack.Screen name="home" options={{ title: "Home" }} />
        <Stack.Screen name="add" options={{ title: "Add Task" }} />
      </Stack>
    </SQLiteProvider>
  );
}
