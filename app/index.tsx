1|import React, { useEffect } from 'react';
2|import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
3|import { router } from 'expo-router';
4|import { useAuthStore } from '../src/store/authStore';
5|import { Ionicons } from '@expo/vector-icons';
6|
7|export default function WelcomeScreen() {
8|  const { isAuthenticated, user } = useAuthStore();
9|
10|  useEffect(() => {
11|    if (isAuthenticated && user) {
12|      if (user.user_type === 'driver') {
13|        router.replace('/(driver)/home');
14|      } else {
15|        router.replace('/(client)/home');
16|      }
17|    }
18|  }, [isAuthenticated, user]);
19|
20|  return (
21|    <View style={styles.container}>
22|      <View style={styles.header}>
23|        <View style={styles.logoContainer}>
24|          <Ionicons name="car-sport" size={60} color="#FF6B00" />
25|        </View>
26|        <Text style={styles.title}>AfriGo</Text>
27|        <Text style={styles.subtitle}>VTC Côte d'Ivoire</Text>
28|      </View>
29|
30|      <View style={styles.features}>
31|        <View style={styles.featureItem}>
32|          <Ionicons name="location" size={24} color="#FF6B00" />
33|          <Text style={styles.featureText}>Courses à la demande</Text>
34|        </View>
35|        <View style={styles.featureItem}>
36|          <Ionicons name="cash" size={24} color="#FF6B00" />
37|          <Text style={styles.featureText}>Espèces & Mobile Money</Text>
38|        </View>
39|        <View style={styles.featureItem}>
40|          <Ionicons name="shield-checkmark" size={24} color="#FF6B00" />
41|          <Text style={styles.featureText}>Chauffeurs vérifiés</Text>
42|        </View>
43|      </View>
44|
45|      <View style={styles.buttonContainer}>
46|        <TouchableOpacity
47|          style={styles.primaryButton}
48|          onPress={() => router.push('/(auth)/register')}
49|        >
50|          <Text style={styles.primaryButtonText}>Créer un compte</Text>
51|        </TouchableOpacity>
52|
53|        <TouchableOpacity
54|          style={styles.secondaryButton}
55|          onPress={() => router.push('/(auth)/login')}
56|        >
57|          <Text style={styles.secondaryButtonText}>Se connecter</Text>
58|        </TouchableOpacity>
59|      </View>
60|
61|      <Text style={styles.footer}>Abidjan • Bouaké • Yamoussoukro</Text>
62|    </View>
63|  );
64|}
65|
66|const styles = StyleSheet.create({
67|  container: {
68|    flex: 1,
69|    backgroundColor: '#0A0A0A',
70|    paddingHorizontal: 24,
71|    paddingTop: 80,
72|  },
73|  header: {
74|    alignItems: 'center',
75|    marginBottom: 48,
76|  },
77|  logoContainer: {
78|    width: 100,
79|    height: 100,
80|    borderRadius: 50,
81|    backgroundColor: '#1A1A1A',
82|    justifyContent: 'center',
83|    alignItems: 'center',
84|    marginBottom: 16,
85|  },
86|  title: {
87|    fontSize: 42,
88|    fontWeight: '700',
89|    color: '#FFF',
90|    marginBottom: 8,
91|  },
92|  subtitle: {
93|    fontSize: 18,
94|    color: '#888',
95|  },
96|  features: {
97|    marginBottom: 48,
98|  },
99|  featureItem: {
100|    flexDirection: 'row',
101|    alignItems: 'center',
102|    marginBottom: 20,
103|    paddingHorizontal: 16,
104|  },
105|  featureText: {
106|    color: '#FFF',
107|    fontSize: 16,
108|    marginLeft: 16,
109|  },
110|  buttonContainer: {
111|    gap: 12,
112|  },
113|  primaryButton: {
114|    backgroundColor: '#FF6B00',
115|    height: 56,
116|    borderRadius: 12,
117|    justifyContent: 'center',
118|    alignItems: 'center',
119|  },
120|  primaryButtonText: {
121|    color: '#FFF',
122|    fontSize: 18,
123|    fontWeight: '600',
124|  },
125|  secondaryButton: {
126|    backgroundColor: '#1A1A1A',
127|    height: 56,
128|    borderRadius: 12,
129|    justifyContent: 'center',
130|    alignItems: 'center',
131|    borderWidth: 1,
132|    borderColor: '#333',
133|  },
134|  secondaryButtonText: {
135|    color: '#FFF',
136|    fontSize: 18,
137|    fontWeight: '600',
138|  },
139|  footer: {
140|    color: '#666',
141|    fontSize: 14,
142|    textAlign: 'center',
143|    marginTop: 'auto',
144|    marginBottom: 32,
145|  },
146|});
