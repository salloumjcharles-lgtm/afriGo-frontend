1|import React, { useState } from 'react';
2|import {
3|  View,
4|  Text,
5|  StyleSheet,
6|  TouchableOpacity,
7|  KeyboardAvoidingView,
8|  Platform,
9|  ScrollView,
10|  Alert,
11|} from 'react-native';
12|import { router } from 'expo-router';
13|import { Ionicons } from '@expo/vector-icons';
14|import { Input } from '../../src/components/Input';
15|import { Button } from '../../src/components/Button';
16|import { authAPI } from '../../src/api/client';
17|import { useAuthStore } from '../../src/store/authStore';
18|
19|export default function LoginScreen() {
20|  const [phone, setPhone] = useState('');
21|  const [password, setPassword] = useState('');
22|  const [loading, setLoading] = useState(false);
23|  const [showPassword, setShowPassword] = useState(false);
24|  const { setAuth } = useAuthStore();
25|
26|  const handleLogin = async () => {
27|    if (!phone || !password) {
28|      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
29|      return;
30|    }
31|
32|    setLoading(true);
33|    try {
34|      const response = await authAPI.login({ phone, password });
35|      const { access_token, user } = response.data;
36|      await setAuth(user, access_token);
37|      
38|      if (user.user_type === 'driver') {
39|        if (!user.profile_complete) {
40|          router.replace('/(driver)/register-vehicle');
41|        } else {
42|          router.replace('/(driver)/home');
43|        }
44|      } else {
45|        router.replace('/(client)/home');
46|      }
47|    } catch (error: any) {
48|      Alert.alert(
49|        'Erreur',
50|        error.response?.data?.detail || 'Impossible de se connecter'
51|      );
52|    } finally {
53|      setLoading(false);
54|    }
55|  };
56|
57|  return (
58|    <KeyboardAvoidingView
59|      style={styles.container}
60|      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
61|    >
62|      <ScrollView
63|        contentContainerStyle={styles.scrollContent}
64|        keyboardShouldPersistTaps="handled"
65|      >
66|        <TouchableOpacity
67|          style={styles.backButton}
68|          onPress={() => router.back()}
69|        >
70|          <Ionicons name="arrow-back" size={24} color="#FFF" />
71|        </TouchableOpacity>
72|
73|        <View style={styles.header}>
74|          <Text style={styles.title}>Connexion</Text>
75|          <Text style={styles.subtitle}>Bon retour sur AfriGo !</Text>
76|        </View>
77|
78|        <View style={styles.form}>
79|          <Input
80|            label="Numéro de téléphone"
81|            placeholder="07 XX XX XX XX"
82|            value={phone}
83|            onChangeText={setPhone}
84|            keyboardType="phone-pad"
85|            autoCapitalize="none"
86|          />
87|
88|          <View>
89|            <Input
90|              label="Mot de passe"
91|              placeholder="Votre mot de passe"
92|              value={password}
93|              onChangeText={setPassword}
94|              secureTextEntry={!showPassword}
95|            />
96|            <TouchableOpacity
97|              style={styles.eyeIcon}
98|              onPress={() => setShowPassword(!showPassword)}
99|            >
100|              <Ionicons
101|                name={showPassword ? 'eye-off' : 'eye'}
102|                size={22}
103|                color="#888"
104|              />
105|            </TouchableOpacity>
106|          </View>
107|
108|          <Button
109|            title="Se connecter"
110|            onPress={handleLogin}
111|            loading={loading}
112|            style={{ marginTop: 24 }}
113|          />
114|        </View>
115|
116|        <View style={styles.footer}>
117|          <Text style={styles.footerText}>Pas encore de compte ?</Text>
118|          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
119|            <Text style={styles.linkText}>S'inscrire</Text>
120|          </TouchableOpacity>
121|        </View>
122|      </ScrollView>
123|    </KeyboardAvoidingView>
124|  );
125|}
126|
127|const styles = StyleSheet.create({
128|  container: {
129|    flex: 1,
130|    backgroundColor: '#0A0A0A',
131|  },
132|  scrollContent: {
133|    flexGrow: 1,
134|    paddingHorizontal: 24,
135|    paddingTop: 60,
136|    paddingBottom: 24,
137|  },
138|  backButton: {
139|    width: 44,
140|    height: 44,
141|    borderRadius: 22,
142|    backgroundColor: '#1A1A1A',
143|    justifyContent: 'center',
144|    alignItems: 'center',
145|    marginBottom: 24,
146|  },
147|  header: {
148|    marginBottom: 32,
149|  },
150|  title: {
151|    fontSize: 32,
152|    fontWeight: '700',
153|    color: '#FFF',
154|    marginBottom: 8,
155|  },
156|  subtitle: {
157|    fontSize: 16,
158|    color: '#888',
159|  },
160|  form: {
161|    flex: 1,
162|  },
163|  eyeIcon: {
164|    position: 'absolute',
165|    right: 16,
166|    top: 42,
167|  },
168|  footer: {
169|    flexDirection: 'row',
170|    justifyContent: 'center',
171|    alignItems: 'center',
172|    marginTop: 24,
173|  },
174|  footerText: {
175|    color: '#888',
176|    fontSize: 14,
177|  },
178|  linkText: {
179|    color: '#FF6B00',
180|    fontSize: 14,
181|    fontWeight: '600',
182|    marginLeft: 8,
183|  },
184|});
