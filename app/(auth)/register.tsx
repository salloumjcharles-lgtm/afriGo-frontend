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
19|export default function RegisterScreen() {
20|  const [fullName, setFullName] = useState('');
21|  const [phone, setPhone] = useState('');
22|  const [password, setPassword] = useState('');
23|  const [userType, setUserType] = useState<'client' | 'driver'>('client');
24|  const [loading, setLoading] = useState(false);
25|  const [showPassword, setShowPassword] = useState(false);
26|  const { setAuth } = useAuthStore();
27|
28|  const handleRegister = async () => {
29|    if (!fullName || !phone || !password) {
30|      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
31|      return;
32|    }
33|
34|    if (password.length < 6) {
35|      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
36|      return;
37|    }
38|
39|    setLoading(true);
40|    try {
41|      const response = await authAPI.register({
42|        full_name: fullName,
43|        phone,
44|        password,
45|        user_type: userType,
46|      });
47|      const { access_token, user } = response.data;
48|      await setAuth(user, access_token);
49|
50|      if (userType === 'driver') {
51|        router.replace('/(driver)/register-vehicle');
52|      } else {
53|        router.replace('/(client)/home');
54|      }
55|    } catch (error: any) {
56|      Alert.alert(
57|        'Erreur',
58|        error.response?.data?.detail || "Impossible de créer le compte"
59|      );
60|    } finally {
61|      setLoading(false);
62|    }
63|  };
64|
65|  return (
66|    <KeyboardAvoidingView
67|      style={styles.container}
68|      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
69|    >
70|      <ScrollView
71|        contentContainerStyle={styles.scrollContent}
72|        keyboardShouldPersistTaps="handled"
73|      >
74|        <TouchableOpacity
75|          style={styles.backButton}
76|          onPress={() => router.back()}
77|        >
78|          <Ionicons name="arrow-back" size={24} color="#FFF" />
79|        </TouchableOpacity>
80|
81|        <View style={styles.header}>
82|          <Text style={styles.title}>Inscription</Text>
83|          <Text style={styles.subtitle}>Créez votre compte AfriGo</Text>
84|        </View>
85|
86|        {/* User Type Selection */}
87|        <View style={styles.typeContainer}>
88|          <Text style={styles.typeLabel}>Je suis :</Text>
89|          <View style={styles.typeButtons}>
90|            <TouchableOpacity
91|              style={[
92|                styles.typeButton,
93|                userType === 'client' && styles.typeButtonActive,
94|              ]}
95|              onPress={() => setUserType('client')}
96|            >
97|              <Ionicons
98|                name="person"
99|                size={24}
100|                color={userType === 'client' ? '#FF6B00' : '#888'}
101|              />
102|              <Text
103|                style={[
104|                  styles.typeText,
105|                  userType === 'client' && styles.typeTextActive,
106|                ]}
107|              >
108|                Passager
109|              </Text>
110|            </TouchableOpacity>
111|
112|            <TouchableOpacity
113|              style={[
114|                styles.typeButton,
115|                userType === 'driver' && styles.typeButtonActive,
116|              ]}
117|              onPress={() => setUserType('driver')}
118|            >
119|              <Ionicons
120|                name="car"
121|                size={24}
122|                color={userType === 'driver' ? '#FF6B00' : '#888'}
123|              />
124|              <Text
125|                style={[
126|                  styles.typeText,
127|                  userType === 'driver' && styles.typeTextActive,
128|                ]}
129|              >
130|                Chauffeur
131|              </Text>
132|            </TouchableOpacity>
133|          </View>
134|        </View>
135|
136|        <View style={styles.form}>
137|          <Input
138|            label="Nom complet"
139|            placeholder="Votre nom complet"
140|            value={fullName}
141|            onChangeText={setFullName}
142|            autoCapitalize="words"
143|          />
144|
145|          <Input
146|            label="Numéro de téléphone"
147|            placeholder="07 XX XX XX XX"
148|            value={phone}
149|            onChangeText={setPhone}
150|            keyboardType="phone-pad"
151|          />
152|
153|          <View>
154|            <Input
155|              label="Mot de passe"
156|              placeholder="Minimum 6 caractères"
157|              value={password}
158|              onChangeText={setPassword}
159|              secureTextEntry={!showPassword}
160|            />
161|            <TouchableOpacity
162|              style={styles.eyeIcon}
163|              onPress={() => setShowPassword(!showPassword)}
164|            >
165|              <Ionicons
166|                name={showPassword ? 'eye-off' : 'eye'}
167|                size={22}
168|                color="#888"
169|              />
170|            </TouchableOpacity>
171|          </View>
172|
173|          <Button
174|            title={userType === 'driver' ? "Continuer" : "S'inscrire"}
175|            onPress={handleRegister}
176|            loading={loading}
177|            style={{ marginTop: 24 }}
178|          />
179|        </View>
180|
181|        <View style={styles.footer}>
182|          <Text style={styles.footerText}>Déjà un compte ?</Text>
183|          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
184|            <Text style={styles.linkText}>Se connecter</Text>
185|          </TouchableOpacity>
186|        </View>
187|      </ScrollView>
188|    </KeyboardAvoidingView>
189|  );
190|}
191|
192|const styles = StyleSheet.create({
193|  container: {
194|    flex: 1,
195|    backgroundColor: '#0A0A0A',
196|  },
197|  scrollContent: {
198|    flexGrow: 1,
199|    paddingHorizontal: 24,
200|    paddingTop: 60,
201|    paddingBottom: 24,
202|  },
203|  backButton: {
204|    width: 44,
205|    height: 44,
206|    borderRadius: 22,
207|    backgroundColor: '#1A1A1A',
208|    justifyContent: 'center',
209|    alignItems: 'center',
210|    marginBottom: 24,
211|  },
212|  header: {
213|    marginBottom: 24,
214|  },
215|  title: {
216|    fontSize: 32,
217|    fontWeight: '700',
218|    color: '#FFF',
219|    marginBottom: 8,
220|  },
221|  subtitle: {
222|    fontSize: 16,
223|    color: '#888',
224|  },
225|  typeContainer: {
226|    marginBottom: 24,
227|  },
228|  typeLabel: {
229|    color: '#FFF',
230|    fontSize: 14,
231|    fontWeight: '500',
232|    marginBottom: 12,
233|  },
234|  typeButtons: {
235|    flexDirection: 'row',
236|    gap: 12,
237|  },
238|  typeButton: {
239|    flex: 1,
240|    flexDirection: 'row',
241|    alignItems: 'center',
242|    justifyContent: 'center',
243|    backgroundColor: '#1A1A1A',
244|    padding: 16,
245|    borderRadius: 12,
246|    borderWidth: 1,
247|    borderColor: '#333',
248|    gap: 8,
249|  },
250|  typeButtonActive: {
251|    borderColor: '#FF6B00',
252|    backgroundColor: 'rgba(255, 107, 0, 0.1)',
253|  },
254|  typeText: {
255|    color: '#888',
256|    fontSize: 14,
257|    fontWeight: '500',
258|  },
259|  typeTextActive: {
260|    color: '#FF6B00',
261|  },
262|  form: {
263|    flex: 1,
264|  },
265|  eyeIcon: {
266|    position: 'absolute',
267|    right: 16,
268|    top: 42,
269|  },
270|  footer: {
271|    flexDirection: 'row',
272|    justifyContent: 'center',
273|    alignItems: 'center',
274|    marginTop: 24,
275|  },
276|  footerText: {
277|    color: '#888',
278|    fontSize: 14,
279|  },
280|  linkText: {
281|    color: '#FF6B00',
282|    fontSize: 14,
283|    fontWeight: '600',
284|    marginLeft: 8,
285|  },
286|});
