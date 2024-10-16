import React from "react";
import { StyleSheet, View } from "react-native";
import ChatBot from "./src/ChatBot";

export default function App() {
  return (
    <View style={styles.container}>
      <ChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})