1|import React, { useState } from 'react';
2|import {
3|  View,
4|  Text,
5|  StyleSheet,
6|  ScrollView,
7|  TouchableOpacity,
8|  KeyboardAvoidingView,
9|  Platform,
10|  Alert,
11|} from 'react-native';
12|import { router } from 'expo-router';
13|import { Ionicons } from '@expo/vector-icons';
14|import { Input } from '../../src/components/Input';
15|import { Button } from '../../src/components/Button';
16|import { driverAPI } from '../../src/api/client';
17|import { useAuthStore } from '../../src/store/authStore';
18|
19|const VEHICLE_TYPES = [
20|  { id: 'moto', name: 'Moto', icon: 'bicycle', color: '#FF6B00' },
21|  { id: 'taxi', name: 'Taxi', icon: 'car', color: '#00B4D8' },
22|  { id: 'voiture', name: 'VTC', icon: 'car-sport', color: '#9C27B0' },
23|];
24|
25|export default function RegisterVehicleScreen() {
26|  const { updateUser } = useAuthStore();
27|  const [vehicleType, setVehicleType] = useState('moto');
28|  const [vehicleBrand, setVehicleBrand] = useState('');
29|  const [vehicleModel, setVehicleModel] = useState('');
30|  const [vehicleColor, setVehicleColor] = useState('');
31|  const [plateNumber, setPlateNumber] = useState('');
32|  const [licenseNumber, setLicenseNumber] = useState('');
33|  const [loading, setLoading] = useState(false);
34|
35|  const handleSubmit = async () => {
36|    if (!vehicleBrand || !vehicleModel || !vehicleColor || !plateNumber) {
37|      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
38|      return;
39|    }
40|
41|    setLoading(true);
42|    try {
43|      await driverAPI.registerVehicle({
44|        vehicle_type: vehicleType,
45|        vehicle_brand: vehicleBrand,
46|        vehicle_model: vehicleModel,
47|        vehicle_color: vehicleColor,
48|        plate_number: plateNumber,
49|        license_number: licenseNumber || null,
50|      });
51|
52|      updateUser({ profile_complete: true });
53|      Alert.alert(
54|        'Succès !',
55|        'Votre véhicule a été enregistré. Vous pouvez maintenant recevoir des courses.',
56|        [
57|          {
58|            text: 'Continuer',
59|            onPress: () => router.replace('/(driver)/home'),
60|          },
61|        ]
62|      );
63|    } catch (error: any) {
64|      Alert.alert(
65|        'Erreur',
66|        error.response?.data?.detail || "Impossible d'enregistrer le véhicule"
67|      );
68|    } finally {
69|      setLoading(false);
70|    }
71|  };
72|
73|  return (
74|    <KeyboardAvoidingView
75|      style={styles.container}
76|      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
77|    >
78|      <ScrollView
79|        contentContainerStyle={styles.content}
80|        keyboardShouldPersistTaps="handled"
81|      >
82|        <View style={styles.header}>
83|          <View style={styles.iconContainer}>
84|            <Ionicons name="car" size={40} color="#FF6B00" />
85|          </View>
86|          <Text style={styles.title}>Enregistrez votre véhicule</Text>
87|          <Text style={styles.subtitle}>
88|            Ces informations nous permettent de valider votre profil
89|          </Text>
90|        </View>
91|
92|        <Text style={styles.sectionTitle}>Type de véhicule</Text>
93|        <View style={styles.vehicleGrid}>
94|          {VEHICLE_TYPES.map((type) => (
95|            <TouchableOpacity
96|              key={type.id}
97|              style={[
98|                styles.vehicleCard,
99|                vehicleType === type.id && styles.vehicleCardActive,
100|                vehicleType === type.id && { borderColor: type.color },
101|              ]}
102|              onPress={() => setVehicleType(type.id)}
103|            >
104|              <Ionicons
105|                name={type.icon as any}
106|                size={32}
107|                color={vehicleType === type.id ? type.color : '#888'}
108|              />
109|              <Text
110|                style={[
111|                  styles.vehicleName,
112|                  vehicleType === type.id && { color: type.color },
113|                ]}
114|              >
115|                {type.name}
116|              </Text>
117|            </TouchableOpacity>
118|          ))}
119|        </View>
120|
121|        <View style={styles.form}>
122|          <Input
123|            label="Marque du véhicule *"
124|            placeholder="Ex: Toyota, Honda, Yamaha"
125|            value={vehicleBrand}
126|            onChangeText={setVehicleBrand}
127|          />
128|
129|          <Input
130|            label="Modèle *"
131|            placeholder="Ex: Corolla, CRV, NMAX"
132|            value={vehicleModel}
133|            onChangeText={setVehicleModel}
134|          />
135|
136|          <Input
137|            label="Couleur *"
138|            placeholder="Ex: Noir, Blanc, Gris"
139|            value={vehicleColor}
140|            onChangeText={setVehicleColor}
141|          />
142|
143|          <Input
144|            label="Numéro d'immatriculation *"
145|            placeholder="Ex: AB 1234 CI"
146|            value={plateNumber}
147|            onChangeText={setPlateNumber}
148|            autoCapitalize="characters"
149|          />
150|
151|          <Input
152|            label="Numéro de permis (optionnel)"
153|            placeholder="Votre numéro de permis"
154|            value={licenseNumber}
155|            onChangeText={setLicenseNumber}
156|          />
157|
158|          <Button
159|            title="Enregistrer mon véhicule"
160|            onPress={handleSubmit}
161|            loading={loading}
162|            style={{ marginTop: 16 }}
163|          />
164|        </View>
165|      </ScrollView>
166|    </KeyboardAvoidingView>
167|  );
168|}
169|
170|const styles = StyleSheet.create({
171|  container: {
172|    flex: 1,
173|    backgroundColor: '#0A0A0A',
174|  },
175|  content: {
176|    paddingHorizontal: 20,
177|    paddingTop: 60,
178|    paddingBottom: 40,
179|  },
180|  header: {
181|    alignItems: 'center',
182|    marginBottom: 32,
183|  },
184|  iconContainer: {
185|    width: 80,
186|    height: 80,
187|    borderRadius: 40,
188|    backgroundColor: '#FF6B0020',
189|    justifyContent: 'center',
190|    alignItems: 'center',
191|    marginBottom: 16,
192|  },
193|  title: {
194|    fontSize: 24,
195|    fontWeight: '700',
196|    color: '#FFF',
197|    marginBottom: 8,
198|    textAlign: 'center',
199|  },
200|  subtitle: {
201|    fontSize: 14,
202|    color: '#888',
203|    textAlign: 'center',
204|  },
205|  sectionTitle: {
206|    fontSize: 16,
207|    fontWeight: '600',
208|    color: '#FFF',
209|    marginBottom: 12,
210|  },
211|  vehicleGrid: {
212|    flexDirection: 'row',
213|    gap: 12,
214|    marginBottom: 24,
215|  },
216|  vehicleCard: {
217|    flex: 1,
218|    backgroundColor: '#1A1A1A',
219|    borderRadius: 12,
220|    padding: 16,
221|    alignItems: 'center',
222|    borderWidth: 2,
223|    borderColor: '#333',
224|  },
225|  vehicleCardActive: {
226|    backgroundColor: 'rgba(255, 107, 0, 0.1)',
227|  },
228|  vehicleName: {
229|    color: '#888',
230|    fontSize: 14,
231|    fontWeight: '600',
232|    marginTop: 8,
233|  },
234|  form: {
235|    flex: 1,
236|  },
237|});
238|

