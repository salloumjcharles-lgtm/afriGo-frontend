1|import React, { useEffect } from 'react';
2|import { Stack } from 'expo-router';
3|import { StatusBar } from 'expo-status-bar';
4|import { useAuthStore } from '../src/store/authStore';
5|import { View, ActivityIndicator, StyleSheet } from 'react-native';
6|
7|export default function RootLayout() {
8|  const { isLoading, loadAuth } = useAuthStore();
9|
10|  useEffect(() => {
11|    loadAuth();
12|  }, []);
13|
14|  if (isLoading) {
15|    return (
16|      <View style={styles.loading}>
17|        <ActivityIndicator size="large" color="#FF6B00" />
18|      </View>
19|    );
20|  }
21|
22|  return (
23|    <>
24|      <StatusBar style="light" />
25|      <Stack
26|        screenOptions={{
27|          headerShown: false,
28|          contentStyle: { backgroundColor: '#0A0A0A' },
29|        }}
30|      />
31|    </>
32|  );
33|}
34|
35|const styles = StyleSheet.create({
36|  loading: {
37|    flex: 1,
38|    justifyContent: 'center',
39|    alignItems: 'center',
40|    backgroundColor: '#0A0A0A',
41|  },
42|});
