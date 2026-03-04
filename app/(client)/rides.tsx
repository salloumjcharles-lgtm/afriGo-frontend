1|import React, { useState, useCallback } from 'react';
2|import {
3|  View,
4|  Text,
5|  StyleSheet,
6|  ScrollView,
7|  TouchableOpacity,
8|  RefreshControl,
9|  Alert,
10|} from 'react-native';
11|import { useFocusEffect } from 'expo-router';
12|import { Ionicons } from '@expo/vector-icons';
13|import { ridesAPI } from '../../src/api/client';
14|
15|const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
16|  pending: { label: 'En attente', color: '#FFB800' },
17|  accepted: { label: 'Acceptée', color: '#00B4D8' },
18|  in_progress: { label: 'En cours', color: '#00C853' },
19|  completed: { label: 'Terminée', color: '#4CAF50' },
20|  cancelled: { label: 'Annulée', color: '#FF4444' },
21|};
22|
23|export default function RidesScreen() {
24|  const [rides, setRides] = useState<any[]>([]);
25|  const [refreshing, setRefreshing] = useState(false);
26|  const [loading, setLoading] = useState(true);
27|
28|  const fetchRides = async () => {
29|    try {
30|      const response = await ridesAPI.getMyRides();
31|      setRides(response.data || []);
32|    } catch (error) {
33|      console.error('Error fetching rides:', error);
34|    } finally {
35|      setLoading(false);
36|    }
37|  };
38|
39|  useFocusEffect(
40|    useCallback(() => {
41|      fetchRides();
42|    }, [])
43|  );
44|
45|  const onRefresh = async () => {
46|    setRefreshing(true);
47|    await fetchRides();
48|    setRefreshing(false);
49|  };
50|
51|  const handleCancel = async (rideId: string) => {
52|    Alert.alert(
53|      'Annuler la course',
54|      'Êtes-vous sûr de vouloir annuler cette course ?',
55|      [
56|        { text: 'Non', style: 'cancel' },
57|        {
58|          text: 'Oui, annuler',
59|          style: 'destructive',
60|          onPress: async () => {
61|            try {
62|              await ridesAPI.cancelRide(rideId);
63|              fetchRides();
64|            } catch (error: any) {
65|              Alert.alert(
66|                'Erreur',
67|                error.response?.data?.detail || 'Impossible d\'annuler la course'
68|              );
69|            }
70|          },
71|        },
72|      ]
73|    );
74|  };
75|
76|  const formatDate = (dateStr: string) => {
77|    const date = new Date(dateStr);
78|    return date.toLocaleDateString('fr-FR', {
79|      day: '2-digit',
80|      month: 'short',
81|      hour: '2-digit',
82|      minute: '2-digit',
83|    });
84|  };
85|
86|  const getPaymentLabel = (method: string) => {
87|    switch (method) {
88|      case 'cash':
89|        return 'Espèces';
90|      case 'orange_money':
91|        return 'Orange Money';
92|      case 'wave':
93|        return 'Wave';
94|      default:
95|        return method;
96|    }
97|  };
98|
99|  return (
100|    <View style={styles.container}>
101|      <View style={styles.header}>
102|        <Text style={styles.title}>Mes courses</Text>
103|      </View>
104|
105|      <ScrollView
106|        contentContainerStyle={styles.content}
107|        refreshControl={
108|          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />
109|        }
110|      >
111|        {rides.length === 0 ? (
112|          <View style={styles.emptyState}>
113|            <Ionicons name="car" size={64} color="#333" />
114|            <Text style={styles.emptyTitle}>Aucune course</Text>
115|            <Text style={styles.emptySubtitle}>
116|              Vos courses apparaîtront ici
117|            </Text>
118|          </View>
119|        ) : (
120|          rides.map((ride) => {
121|            const status = STATUS_CONFIG[ride.status] || { label: ride.status, color: '#888' };
122|            return (
123|              <View key={ride.id} style={styles.rideCard}>
124|                <View style={styles.rideHeader}>
125|                  <View
126|                    style={[
127|                      styles.statusBadge,
128|                      { backgroundColor: status.color + '20' },
129|                    ]}
130|                  >
131|                    <View style={[styles.statusDot, { backgroundColor: status.color }]} />
132|                    <Text style={[styles.statusText, { color: status.color }]}>
133|                      {status.label}
134|                    </Text>
135|                  </View>
136|                  <Text style={styles.rideDate}>{formatDate(ride.created_at)}</Text>
137|                </View>
138|
139|                <View style={styles.rideLocations}>
140|                  <View style={styles.locationRow}>
141|                    <Ionicons name="location" size={18} color="#00C853" />
142|                    <Text style={styles.locationText} numberOfLines={1}>
143|                      {ride.pickup_address}
144|                    </Text>
145|                  </View>
146|                  <View style={styles.locationDivider} />
147|                  <View style={styles.locationRow}>
148|                    <Ionicons name="flag" size={18} color="#FF6B00" />
149|                    <Text style={styles.locationText} numberOfLines={1}>
150|                      {ride.destination_address}
151|                    </Text>
152|                  </View>
153|                </View>
154|
155|                <View style={styles.rideDetails}>
156|                  <View style={styles.detailItem}>
157|                    <Ionicons name="car" size={16} color="#888" />
158|                    <Text style={styles.detailText}>
159|                      {ride.vehicle_type === 'moto' ? 'Moto' : ride.vehicle_type === 'taxi' ? 'Taxi' : 'VTC'}
160|                    </Text>
161|                  </View>
162|                  <View style={styles.detailItem}>
163|                    <Ionicons name="cash" size={16} color="#888" />
164|                    <Text style={styles.detailText}>{getPaymentLabel(ride.payment_method)}</Text>
165|                  </View>
166|                  <View style={styles.detailItem}>
167|                    <Text style={styles.priceText}>
168|                      {(ride.final_price || ride.estimated_price).toLocaleString()} F
169|                    </Text>
170|                  </View>
171|                </View>
172|
173|                {ride.driver_name && (
174|                  <View style={styles.driverSection}>
175|                    <View style={styles.driverAvatar}>
176|                      <Ionicons name="person" size={18} color="#FFF" />
177|                    </View>
178|                    <View style={styles.driverInfo}>
179|                      <Text style={styles.driverName}>{ride.driver_name}</Text>
180|                      <Text style={styles.driverPhone}>{ride.driver_phone}</Text>
181|                    </View>
182|                    <TouchableOpacity style={styles.callButton}>
183|                      <Ionicons name="call" size={20} color="#00C853" />
184|                    </TouchableOpacity>
185|                  </View>
186|                )}
187|
188|                {['pending', 'accepted'].includes(ride.status) && (
189|                  <TouchableOpacity
190|                    style={styles.cancelButton}
191|                    onPress={() => handleCancel(ride.id)}
192|                  >
193|                    <Text style={styles.cancelButtonText}>Annuler la course</Text>
194|                  </TouchableOpacity>
195|                )}
196|              </View>
197|            );
198|          })
199|        )}
200|      </ScrollView>
201|    </View>
202|  );
203|}
204|
205|const styles = StyleSheet.create({
206|  container: {
207|    flex: 1,
208|    backgroundColor: '#0A0A0A',
209|  },
210|  header: {
211|    paddingHorizontal: 20,
212|    paddingTop: 60,
213|    paddingBottom: 16,
214|  },
215|  title: {
216|    fontSize: 28,
217|    fontWeight: '700',
218|    color: '#FFF',
219|  },
220|  content: {
221|    paddingHorizontal: 20,
222|    paddingBottom: 100,
223|  },
224|  emptyState: {
225|    alignItems: 'center',
226|    paddingTop: 80,
227|  },
228|  emptyTitle: {
229|    fontSize: 20,
230|    fontWeight: '600',
231|    color: '#FFF',
232|    marginTop: 16,
233|  },
234|  emptySubtitle: {
235|    fontSize: 14,
236|    color: '#888',
237|    marginTop: 8,
238|  },
239|  rideCard: {
240|    backgroundColor: '#1A1A1A',
241|    borderRadius: 16,
242|    padding: 16,
243|    marginBottom: 16,
244|  },
245|  rideHeader: {
246|    flexDirection: 'row',
247|    justifyContent: 'space-between',
248|    alignItems: 'center',
249|    marginBottom: 16,
250|  },
251|  statusBadge: {
252|    flexDirection: 'row',
253|    alignItems: 'center',
254|    paddingHorizontal: 10,
255|    paddingVertical: 4,
256|    borderRadius: 12,
257|  },
258|  statusDot: {
259|    width: 6,
260|    height: 6,
261|    borderRadius: 3,
262|    marginRight: 6,
263|  },
264|  statusText: {
265|    fontSize: 12,
266|    fontWeight: '600',
267|  },
268|  rideDate: {
269|    fontSize: 12,
270|    color: '#888',
271|  },
272|  rideLocations: {
273|    marginBottom: 16,
274|  },
275|  locationRow: {
276|    flexDirection: 'row',
277|    alignItems: 'center',
278|    gap: 10,
279|  },
280|  locationDivider: {
281|    width: 2,
282|    height: 20,
283|    backgroundColor: '#333',
284|    marginLeft: 8,
285|    marginVertical: 4,
286|  },
287|  locationText: {
288|    color: '#FFF',
289|    fontSize: 14,
290|    flex: 1,
291|  },
292|  rideDetails: {
293|    flexDirection: 'row',
294|    justifyContent: 'space-between',
295|    paddingTop: 12,
296|    borderTopWidth: 1,
297|    borderTopColor: '#333',
298|  },
299|  detailItem: {
300|    flexDirection: 'row',
301|    alignItems: 'center',
302|    gap: 6,
303|  },
304|  detailText: {
305|    color: '#888',
306|    fontSize: 13,
307|  },
308|  priceText: {
309|    color: '#FF6B00',
310|    fontSize: 16,
311|    fontWeight: '700',
312|  },
313|  driverSection: {
314|    flexDirection: 'row',
315|    alignItems: 'center',
316|    marginTop: 16,
317|    paddingTop: 16,
318|    borderTopWidth: 1,
319|    borderTopColor: '#333',
320|  },
321|  driverAvatar: {
322|    width: 36,
323|    height: 36,
324|    borderRadius: 18,
325|    backgroundColor: '#FF6B00',
326|    justifyContent: 'center',
327|    alignItems: 'center',
328|  },
329|  driverInfo: {
330|    flex: 1,
331|    marginLeft: 12,
332|  },
333|  driverName: {
334|    color: '#FFF',
335|    fontSize: 14,
336|    fontWeight: '600',
337|  },
338|  driverPhone: {
339|    color: '#888',
340|    fontSize: 12,
341|  },
342|  callButton: {
343|    width: 40,
344|    height: 40,
345|    borderRadius: 20,
346|    backgroundColor: '#00C85320',
347|    justifyContent: 'center',
348|    alignItems: 'center',
349|  },
350|  cancelButton: {
351|    marginTop: 16,
352|    paddingVertical: 12,
353|    alignItems: 'center',
354|    backgroundColor: '#FF444420',
355|    borderRadius: 8,
356|  },
357|  cancelButtonText: {
358|    color: '#FF4444',
359|    fontSize: 14,
360|    fontWeight: '600',
361|  },
362|});
363|
