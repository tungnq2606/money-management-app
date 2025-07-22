import { Stack } from "expo-router";
import React from "react";

export default function AuthenticatedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="accounts" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="budgets" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
