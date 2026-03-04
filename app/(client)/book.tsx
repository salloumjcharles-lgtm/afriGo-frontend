1|import React, { useState } from 'react';
2|import {
3|  View,
4|  Text,
5|  StyleSheet,
6|  ScrollView,
7|  TouchableOpacity,
8|  Alert,
9|  KeyboardAvoidingView,
10|  Platform,
11|} from 'react-native';
12|import { router } from 'expo-router';
13|import { Ionicons } from '@expo/vector-icons';
14|import { Input } from '../../src/components/Input';
15|import { Button } from '../../src/components/Button';
16|import { ridesAPI } from '../../src/api/client';
17|
18|const VEHICLE_TYPES = [
19|  { id: 'moto', name: 'Moto', icon: 'bicycle', color: '#FF6B00' },
20|  { id: 'taxi', name: 'Taxi', icon: 'car', color: '#00B4D8' },
21|  { id: 'voiture', name: 'VTC', icon: 'car-sport', color: '#9C27B0' },
22|];
23|
24|const PAYMENT_METHODS = [
25|  { id: 'cash', name: 'Espèces', icon: 'cash' },
26|  { id: 'orange_money', name: 'Orange Money', icon: 'phone-portrait' },
27|  { id: 'wave', name: 'Wave', icon: 'wallet' },
28|];
29|
30|// Popular locations in Abidjan
31|const POPULAR_LOCATIONS = [
32|  { name: 'Aéroport FHB', lat: 5.2564, lng: -3.9262 },
33|  { name: 'Plateau', lat: 5.3176, lng: -4.0197 },
34|  { name: 'Cocody', lat: 5.3456, lng: -3.9897 },
35|  { name: 'Yopougon', lat: 5.3328, lng: -4.0885 },
36|  { name: 'Marcory', lat: 5.2987, lng: -3.9902 },
37|  { name: 'Treichville', lat: 5.2969, lng: -4.0039 },
38|];
39|
40|export default function BookScreen() {
41|  const [pickupAddress, setPickupAddress] = useState('');
42|  const [destinationAddress, setDestinationAddress] = useState('');
43|  const [vehicleType, setVehicleType] = useState('moto');
44|  const [paymentMethod, setPaymentMethod] = useState('cash');
45|  const [loading, setLoading] = useState(false);
46|  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
47|
48|  // Simulated coordinates (in real app, use geocoding)
49|  const getCoordinates = (address: string) => {
50|    const location = POPULAR_LOCATIONS.find(
51|      loc => address.toLowerCase().includes(loc.name.toLowerCase())
52|    );
53|    if (location) {
54|      return { lat: location.lat, lng: location.lng };
55|    }
56|    // Default to random Abidjan coordinates
57|    return {
58|      lat: 5.316667 + (Math.random() - 0.5) * 0.1,
59|      lng: -4.033333 + (Math.random() - 0.5) * 0.1,
60|    };
61|  };
62|
63|  const calculatePrice = () => {
64|    if (!pickupAddress || !destinationAddress) return;
65|
66|    const basePrices: Record<string, number> = {
67|      moto: 500,
68|      taxi: 800,
69|      voiture: 1000,
70|    };
71|
72|    // Simulate distance-based pricing
73|    const distance = 2 + Math.random() * 8; // 2-10 km
74|    const pricePerKm: Record<string, number> = {
75|      moto: 200,
76|      taxi: 300,
77|      voiture: 350,
78|    };
79|
80|    const price = basePrices[vehicleType] + distance * pricePerKm[vehicleType];
81|    setEstimatedPrice(Math.round(price / 100) * 100);
82|  };
83|
84|  const handleBook = async () => {
85|    if (!pickupAddress || !destinationAddress) {
86|      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
87|      return;
88|    }
89|
90|    setLoading(true);
91|    try {
92|      const pickup = getCoordinates(pickupAddress);
93|      const destination = getCoordinates(destinationAddress);
94|
95|      await ridesAPI.createRide({
96|        pickup_address: pickupAddress,
97|        pickup_location: pickup,
98|        destination_address: destinationAddress,
99|        destination_location: destination,
100|        vehicle_type: vehicleType,
101|        payment_method: paymentMethod,
102|      });
103|
104|      Alert.alert(
105|        'Course demandée !',
106|        'Nous recherchons un chauffeur pour vous...',
107|        [
108|          {
109|            text: 'OK',
110|            onPress: () => router.push('/(client)/rides'),
111|          },
112|        ]
113|      );
114|    } catch (error: any) {
115|      Alert.alert(
116|        'Erreur',
117|        error.response?.data?.detail || 'Impossible de créer la course'
118|      );
119|    } finally {
120|      setLoading(false);
121|    }
122|  };
123|
124|  return (
125|    <KeyboardAvoidingView
126|      style={styles.container}
127|      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
128|    >
129|      <ScrollView
130|        contentContainerStyle={styles.content}
131|        keyboardShouldPersistTaps="handled"
132|      >
133|        <View style={styles.header}>
134|          <Text style={styles.title}>Réserver une course</Text>
135|          <Text style={styles.subtitle}>Où voulez-vous aller ?</Text>
136|        </View>
137|
138|        <View style={styles.locationInputs}>
139|          <View style={styles.inputWithIcon}>
140|            <View style={styles.iconContainer}>
141|              <View style={[styles.dot, { backgroundColor: '#00C853' }]} />
142|            </View>
143|            <Input
144|              placeholder="Adresse de départ"
145|              value={pickupAddress}
146|              onChangeText={(text) => {
147|                setPickupAddress(text);
148|                setEstimatedPrice(null);
149|              }}
150|              containerStyle={styles.inputContainer}
151|            />
152|          </View>
153|
154|          <View style={styles.inputWithIcon}>
155|            <View style={styles.iconContainer}>
156|              <View style={[styles.dot, { backgroundColor: '#FF6B00' }]} />
157|            </View>
158|            <Input
159|              placeholder="Adresse de destination"
160|              value={destinationAddress}
161|              onChangeText={(text) => {
162|                setDestinationAddress(text);
163|                setEstimatedPrice(null);
164|              }}
165|              containerStyle={styles.inputContainer}
166|            />
167|          </View>
168|        </View>
169|
170|        <Text style={styles.sectionTitle}>Lieux populaires</Text>
171|        <ScrollView
172|          horizontal
173|          showsHorizontalScrollIndicator={false}
174|          style={styles.popularScroll}
175|        >
176|          {POPULAR_LOCATIONS.map((loc) => (
177|            <TouchableOpacity
178|              key={loc.name}
179|              style={styles.popularItem}
180|              onPress={() => {
181|                if (!pickupAddress) {
182|                  setPickupAddress(loc.name);
183|                } else if (!destinationAddress) {
184|                  setDestinationAddress(loc.name);
185|                }
186|              }}
187|            >
188|              <Ionicons name="location" size={16} color="#FF6B00" />
189|              <Text style={styles.popularText}>{loc.name}</Text>
190|            </TouchableOpacity>
191|          ))}
192|        </ScrollView>
193|
194|        <Text style={styles.sectionTitle}>Type de véhicule</Text>
195|        <View style={styles.vehicleGrid}>
196|          {VEHICLE_TYPES.map((type) => (
197|            <TouchableOpacity
198|              key={type.id}
199|              style={[
200|                styles.vehicleCard,
201|                vehicleType === type.id && styles.vehicleCardActive,
202|                vehicleType === type.id && { borderColor: type.color },
203|              ]}
204|              onPress={() => {
205|                setVehicleType(type.id);
206|                setEstimatedPrice(null);
207|              }}
208|            >
209|              <Ionicons
210|                name={type.icon as any}
211|                size={32}
212|                color={vehicleType === type.id ? type.color : '#888'}
213|              />
214|              <Text
215|                style={[
216|                  styles.vehicleName,
217|                  vehicleType === type.id && { color: type.color },
218|                ]}
219|              >
220|                {type.name}
221|              </Text>
222|            </TouchableOpacity>
223|          ))}
224|        </View>
225|
226|        <Text style={styles.sectionTitle}>Mode de paiement</Text>
227|        <View style={styles.paymentGrid}>
228|          {PAYMENT_METHODS.map((method) => (
229|            <TouchableOpacity
230|              key={method.id}
231|              style={[
232|                styles.paymentCard,
233|                paymentMethod === method.id && styles.paymentCardActive,
234|              ]}
235|              onPress={() => setPaymentMethod(method.id)}
236|            >
237|              <Ionicons
238|                name={method.icon as any}
239|                size={24}
240|                color={paymentMethod === method.id ? '#FF6B00' : '#888'}
241|              />
242|              <Text
243|                style={[
244|                  styles.paymentName,
245|                  paymentMethod === method.id && styles.paymentNameActive,
246|                ]}
247|              >
248|                {method.name}
249|              </Text>
250|            </TouchableOpacity>
251|          ))}
252|        </View>
253|
254|        {pickupAddress && destinationAddress && (
255|          <TouchableOpacity
256|            style={styles.estimateButton}
257|            onPress={calculatePrice}
258|          >
259|            <Text style={styles.estimateButtonText}>Estimer le prix</Text>
260|          </TouchableOpacity>
261|        )}
262|
263|        {estimatedPrice && (
264|          <View style={styles.priceCard}>
265|            <Text style={styles.priceLabel}>Prix estimé</Text>
266|            <Text style={styles.priceValue}>{estimatedPrice.toLocaleString()} F CFA</Text>
267|          </View>
268|        )}
269|
270|        <Button
271|          title="Demander une course"
272|          onPress={handleBook}
273|          loading={loading}
274|          disabled={!pickupAddress || !destinationAddress}
275|          style={{ marginTop: 24 }}
276|        />
277|      </ScrollView>
278|    </KeyboardAvoidingView>
279|  );
280|}
281|
282|const styles = StyleSheet.create({
283|  container: {
284|    flex: 1,
285|    backgroundColor: '#0A0A0A',
286|  },
287|  content: {
288|    paddingHorizontal: 20,
289|    paddingTop: 60,
290|    paddingBottom: 100,
291|  },
292|  header: {
293|    marginBottom: 24,
294|  },
295|  title: {
296|    fontSize: 28,
297|    fontWeight: '700',
298|    color: '#FFF',
299|    marginBottom: 8,
300|  },
301|  subtitle: {
302|    fontSize: 16,
303|    color: '#888',
304|  },
305|  locationInputs: {
306|    marginBottom: 24,
307|  },
308|  inputWithIcon: {
309|    flexDirection: 'row',
310|    alignItems: 'center',
311|  },
312|  iconContainer: {
313|    width: 24,
314|    alignItems: 'center',
315|  },
316|  dot: {
317|    width: 12,
318|    height: 12,
319|    borderRadius: 6,
320|  },
321|  inputContainer: {
322|    flex: 1,
323|    marginLeft: 8,
324|  },
325|  sectionTitle: {
326|    fontSize: 16,
327|    fontWeight: '600',
328|    color: '#FFF',
329|    marginBottom: 12,
330|  },
331|  popularScroll: {
332|    marginBottom: 24,
333|  },
334|  popularItem: {
335|    flexDirection: 'row',
336|    alignItems: 'center',
337|    backgroundColor: '#1A1A1A',
338|    paddingHorizontal: 12,
339|    paddingVertical: 8,
340|    borderRadius: 20,
341|    marginRight: 8,
342|    gap: 6,
343|  },
344|  popularText: {
345|    color: '#FFF',
346|    fontSize: 14,
347|  },
348|  vehicleGrid: {
349|    flexDirection: 'row',
350|    gap: 12,
351|    marginBottom: 24,
352|  },
353|  vehicleCard: {
354|    flex: 1,
355|    backgroundColor: '#1A1A1A',
356|    borderRadius: 12,
357|    padding: 16,
358|    alignItems: 'center',
359|    borderWidth: 2,
360|    borderColor: '#333',
361|  },
362|  vehicleCardActive: {
363|    backgroundColor: 'rgba(255, 107, 0, 0.1)',
364|  },
365|  vehicleName: {
366|    color: '#888',
367|    fontSize: 14,
368|    fontWeight: '600',
369|    marginTop: 8,
370|  },
371|  paymentGrid: {
372|    flexDirection: 'row',
373|    gap: 12,
374|    marginBottom: 16,
375|  },
376|  paymentCard: {
377|    flex: 1,
378|    backgroundColor: '#1A1A1A',
379|    borderRadius: 12,
380|    padding: 12,
381|    alignItems: 'center',
382|    borderWidth: 1,
383|    borderColor: '#333',
384|  },
385|  paymentCardActive: {
386|    borderColor: '#FF6B00',
387|    backgroundColor: 'rgba(255, 107, 0, 0.1)',
388|  },
389|  paymentName: {
390|    color: '#888',
391|    fontSize: 12,
392|    marginTop: 6,
393|  },
394|  paymentNameActive: {
395|    color: '#FF6B00',
396|  },
397|  estimateButton: {
398|    alignSelf: 'center',
399|    paddingVertical: 8,
400|    paddingHorizontal: 16,
401|  },
402|  estimateButtonText: {
403|    color: '#FF6B00',
404|    fontSize: 14,
405|    fontWeight: '600',
406|  },
407|  priceCard: {
408|    backgroundColor: '#1A1A1A',
409|    borderRadius: 12,
410|    padding: 16,
411|    alignItems: 'center',
412|    borderWidth: 1,
413|    borderColor: '#FF6B00',
414|  },
415|  priceLabel: {
416|    color: '#888',
417|    fontSize: 14,
418|  },
419|  priceValue: {
420|    color: '#FF6B00',
421|    fontSize: 28,
422|    fontWeight: '700',
423|    marginTop: 4,
424|  },
425|});
