1|import React from 'react';
2|import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
3|import { router } from 'expo-router';
4|import { Ionicons } from '@expo/vector-icons';
5|import { useAuthStore } from '../../src/store/authStore';
6|
7|export default function ProfileScreen() {
8|  const { user, logout } = useAuthStore();
9|
10|  const handleLogout = () => {
11|    Alert.alert(
12|      'Déconnexion',
13|      'Êtes-vous sûr de vouloir vous déconnecter ?',
14|      [
15|        { text: 'Annuler', style: 'cancel' },
16|        {
17|          text: 'Déconnexion',
18|          style: 'destructive',
19|          onPress: async () => {
20|            await logout();
21|            router.replace('/');
22|          },
23|        },
24|      ]
25|    );
26|  };
27|
28|  return (
29|    <View style={styles.container}>
30|      <View style={styles.header}>
31|        <View style={styles.avatarContainer}>
32|          <View style={styles.avatar}>
33|            <Ionicons name="person" size={40} color="#FFF" />
34|          </View>
35|          <TouchableOpacity style={styles.editAvatarButton}>
36|            <Ionicons name="camera" size={16} color="#FFF" />
37|          </TouchableOpacity>
38|        </View>
39|        <Text style={styles.name}>{user?.full_name}</Text>
40|        <Text style={styles.phone}>{user?.phone}</Text>
41|      </View>
42|
43|      <View style={styles.menuSection}>
44|        <TouchableOpacity style={styles.menuItem}>
45|          <View style={[styles.menuIcon, { backgroundColor: '#FF6B0020' }]}>
46|            <Ionicons name="person" size={20} color="#FF6B00" />
47|          </View>
48|          <View style={styles.menuContent}>
49|            <Text style={styles.menuTitle}>Modifier le profil</Text>
50|            <Text style={styles.menuSubtitle}>Nom, téléphone</Text>
51|          </View>
52|          <Ionicons name="chevron-forward" size={20} color="#888" />
53|        </TouchableOpacity>
54|
55|        <TouchableOpacity style={styles.menuItem}>
56|          <View style={[styles.menuIcon, { backgroundColor: '#00B4D820' }]}>
57|            <Ionicons name="location" size={20} color="#00B4D8" />
58|          </View>
59|          <View style={styles.menuContent}>
60|            <Text style={styles.menuTitle}>Adresses sauvées</Text>
61|            <Text style={styles.menuSubtitle}>Maison, travail</Text>
62|          </View>
63|          <Ionicons name="chevron-forward" size={20} color="#888" />
64|        </TouchableOpacity>
65|
66|        <TouchableOpacity style={styles.menuItem}>
67|          <View style={[styles.menuIcon, { backgroundColor: '#4CAF5020' }]}>
68|            <Ionicons name="card" size={20} color="#4CAF50" />
69|          </View>
70|          <View style={styles.menuContent}>
71|            <Text style={styles.menuTitle}>Moyens de paiement</Text>
72|            <Text style={styles.menuSubtitle}>Espèces, Orange Money, Wave</Text>
73|          </View>
74|          <Ionicons name="chevron-forward" size={20} color="#888" />
75|        </TouchableOpacity>
76|
77|        <TouchableOpacity style={styles.menuItem}>
78|          <View style={[styles.menuIcon, { backgroundColor: '#9C27B020' }]}>
79|            <Ionicons name="gift" size={20} color="#9C27B0" />
80|          </View>
81|          <View style={styles.menuContent}>
82|            <Text style={styles.menuTitle}>Code promo</Text>
83|            <Text style={styles.menuSubtitle}>Ajouter un code</Text>
84|          </View>
85|          <Ionicons name="chevron-forward" size={20} color="#888" />
86|        </TouchableOpacity>
87|
88|        <TouchableOpacity style={styles.menuItem}>
89|          <View style={[styles.menuIcon, { backgroundColor: '#FFB80020' }]}>
90|            <Ionicons name="help-circle" size={20} color="#FFB800" />
91|          </View>
92|          <View style={styles.menuContent}>
93|            <Text style={styles.menuTitle}>Aide et support</Text>
94|            <Text style={styles.menuSubtitle}>FAQ, contact</Text>
95|          </View>
96|          <Ionicons name="chevron-forward" size={20} color="#888" />
97|        </TouchableOpacity>
98|      </View>
99|
100|      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
101|        <Ionicons name="log-out" size={20} color="#FF4444" />
102|        <Text style={styles.logoutText}>Déconnexion</Text>
103|      </TouchableOpacity>
104|
105|      <Text style={styles.version}>AfriGo v1.0.0</Text>
106|    </View>
107|  );
108|}
109|
110|const styles = StyleSheet.create({
111|  container: {
112|    flex: 1,
113|    backgroundColor: '#0A0A0A',
114|  },
115|  header: {
116|    alignItems: 'center',
117|    paddingTop: 60,
118|    paddingBottom: 24,
119|    borderBottomWidth: 1,
120|    borderBottomColor: '#1A1A1A',
121|  },
122|  avatarContainer: {
123|    marginBottom: 16,
124|  },
125|  avatar: {
126|    width: 80,
127|    height: 80,
128|    borderRadius: 40,
129|    backgroundColor: '#FF6B00',
130|    justifyContent: 'center',
131|    alignItems: 'center',
132|  },
133|  editAvatarButton: {
134|    position: 'absolute',
135|    bottom: 0,
136|    right: 0,
137|    width: 28,
138|    height: 28,
139|    borderRadius: 14,
140|    backgroundColor: '#333',
141|    justifyContent: 'center',
142|    alignItems: 'center',
143|    borderWidth: 2,
144|    borderColor: '#0A0A0A',
145|  },
146|  name: {
147|    fontSize: 24,
148|    fontWeight: '700',
149|    color: '#FFF',
150|  },
151|  phone: {
152|    fontSize: 14,
153|    color: '#888',
154|    marginTop: 4,
155|  },
156|  menuSection: {
157|    paddingHorizontal: 20,
158|    paddingTop: 24,
159|  },
160|  menuItem: {
161|    flexDirection: 'row',
162|    alignItems: 'center',
163|    backgroundColor: '#1A1A1A',
164|    borderRadius: 12,
165|    padding: 16,
166|    marginBottom: 12,
167|  },
168|  menuIcon: {
169|    width: 40,
170|    height: 40,
171|    borderRadius: 10,
172|    justifyContent: 'center',
173|    alignItems: 'center',
174|  },
175|  menuContent: {
176|    flex: 1,
177|    marginLeft: 16,
178|  },
179|  menuTitle: {
180|    color: '#FFF',
181|    fontSize: 16,
182|    fontWeight: '600',
183|  },
184|  menuSubtitle: {
185|    color: '#888',
186|    fontSize: 12,
187|    marginTop: 2,
188|  },
189|  logoutButton: {
190|    flexDirection: 'row',
191|    alignItems: 'center',
192|    justifyContent: 'center',
193|    marginHorizontal: 20,
194|    marginTop: 24,
195|    paddingVertical: 16,
196|    backgroundColor: '#FF444420',
197|    borderRadius: 12,
198|    gap: 8,
199|  },
200|  logoutText: {
201|    color: '#FF4444',
202|    fontSize: 16,
203|    fontWeight: '600',
204|  },
205|  version: {
206|    color: '#666',
207|    fontSize: 12,
208|    textAlign: 'center',
209|    marginTop: 24,
210|  },
211|});
212|
