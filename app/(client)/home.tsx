1|import React, { useState, useEffect, useCallback } from 'react';
2|import {
3|  View,
4|  Text,
5|  StyleSheet,
6|  ScrollView,
7|  TouchableOpacity,
8|  RefreshControl,
9|} from 'react-native';
10|import { router, useFocusEffect } from 'expo-router';
11|import { Ionicons } from '@expo/vector-icons';
12|import { useAuthStore } from '../../src/store/authStore';
13|import { ridesAPI } from '../../src/api/client';
14|
15|export default function ClientHomeScreen() {
16|  const { user } = useAuthStore();
17|  const [activeRide, setActiveRide] = useState<any>(null);
18|  const [refreshing, setRefreshing] = useState(false);
19|
20|  const fetchActiveRide = async () => {
21|    try {
22|      const response = await ridesAPI.getActiveRide();
23|      setActiveRide(response.data);
24|    } catch (error) {
25|      setActiveRide(null);
26|    }
27|  };
28|
29|  useFocusEffect(
30|    useCallback(() => {
31|      fetchActiveRide();
32|    }, [])
33|  );
34|
35|  const onRefresh = async () => {
36|    setRefreshing(true);
37|    await fetchActiveRide();
38|    setRefreshing(false);
39|  };
40|
41|  const getStatusText = (status: string) => {
42|    switch (status) {
43|      case 'pending':
44|        return 'En attente d\'un chauffeur...';
45|      case 'accepted':
46|        return 'Chauffeur en route';
47|      case 'in_progress':
48|        return 'Course en cours';
49|      default:
50|        return status;
51|    }
52|  };
53|
54|  const getStatusColor = (status: string) => {
55|    switch (status) {
56|      case 'pending':
57|        return '#FFB800';
58|      case 'accepted':
59|        return '#00B4D8';
60|      case 'in_progress':
61|        return '#00C853';
62|      default:
63|        return '#888';
64|    }
65|  };
66|
67|  return (
68|    <ScrollView
69|      style={styles.container}
70|      contentContainerStyle={styles.content}
71|      refreshControl={
72|        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />
73|      }
74|    >
75|      <View style={styles.header}>
76|        <Text style={styles.greeting}>Bonjour,</Text>
77|        <View style={styles.nameRow}>
78|          <Text style={styles.name}>{user?.full_name?.split(' ')[0]}</Text>
79|          <Ionicons name="hand-right" size={24} color="#FFB800" />
80|        </View>
81|      </View>
82|
83|      {activeRide && (
84|        <TouchableOpacity
85|          style={styles.activeRideCard}
86|          onPress={() => router.push({
87|            pathname: '/(client)/rides',
88|          })}
89|        >
90|          <View style={styles.activeRideHeader}>
91|            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activeRide.status) + '20' }]}>
92|              <View style={[styles.statusDot, { backgroundColor: getStatusColor(activeRide.status) }]} />
93|              <Text style={[styles.statusText, { color: getStatusColor(activeRide.status) }]}>
94|                {getStatusText(activeRide.status)}
95|              </Text>
96|            </View>
97|          </View>
98|          <View style={styles.activeRideInfo}>
99|            <View style={styles.locationRow}>
100|              <Ionicons name="location" size={18} color="#00C853" />
101|              <Text style={styles.locationText} numberOfLines={1}>
102|                {activeRide.pickup_address}
103|              </Text>
104|            </View>
105|            <View style={styles.locationRow}>
106|              <Ionicons name="flag" size={18} color="#FF6B00" />
107|              <Text style={styles.locationText} numberOfLines={1}>
108|                {activeRide.destination_address}
109|              </Text>
110|            </View>
111|          </View>
112|          {activeRide.driver_name && (
113|            <View style={styles.driverInfo}>
114|              <View style={styles.driverAvatar}>
115|                <Ionicons name="person" size={20} color="#FFF" />
116|              </View>
117|              <View>
118|                <Text style={styles.driverName}>{activeRide.driver_name}</Text>
119|                <Text style={styles.driverPhone}>{activeRide.driver_phone}</Text>
120|              </View>
121|            </View>
122|          )}
123|        </TouchableOpacity>
124|      )}
125|
126|      <TouchableOpacity
127|        style={styles.bookButton}
128|        onPress={() => router.push('/(client)/book')}
129|      >
130|        <View style={styles.bookIcon}>
131|          <Ionicons name="car" size={32} color="#FFF" />
132|        </View>
133|        <View style={styles.bookTextContainer}>
134|          <Text style={styles.bookTitle}>Réserver une course</Text>
135|          <Text style={styles.bookSubtitle}>Moto, Taxi, VTC</Text>
136|        </View>
137|        <Ionicons name="chevron-forward" size={24} color="#888" />
138|      </TouchableOpacity>
139|
140|      <Text style={styles.sectionTitle}>Nos services</Text>
141|
142|      <View style={styles.servicesGrid}>
143|        <TouchableOpacity 
144|          style={styles.serviceCard}
145|          onPress={() => router.push('/(client)/book')}
146|        >
147|          <View style={[styles.serviceIcon, { backgroundColor: '#FF6B0020' }]}>
148|            <Ionicons name="bicycle" size={28} color="#FF6B00" />
149|          </View>
150|          <Text style={styles.serviceName}>Moto</Text>
151|          <Text style={styles.servicePrice}>à partir de 500 F</Text>
152|        </TouchableOpacity>
153|
154|        <TouchableOpacity 
155|          style={styles.serviceCard}
156|          onPress={() => router.push('/(client)/book')}
157|        >
158|          <View style={[styles.serviceIcon, { backgroundColor: '#00B4D820' }]}>
159|            <Ionicons name="car" size={28} color="#00B4D8" />
160|          </View>
161|          <Text style={styles.serviceName}>Taxi</Text>
162|          <Text style={styles.servicePrice}>à partir de 800 F</Text>
163|        </TouchableOpacity>
164|
165|        <TouchableOpacity 
166|          style={styles.serviceCard}
167|          onPress={() => router.push('/(client)/book')}
168|        >
169|          <View style={[styles.serviceIcon, { backgroundColor: '#9C27B020' }]}>
170|            <Ionicons name="car-sport" size={28} color="#9C27B0" />
171|          </View>
172|          <Text style={styles.serviceName}>VTC</Text>
173|          <Text style={styles.servicePrice}>à partir de 1000 F</Text>
174|        </TouchableOpacity>
175|      </View>
176|
177|      <View style={styles.promoCard}>
178|        <Ionicons name="gift" size={32} color="#FF6B00" />
179|        <View style={styles.promoText}>
180|          <Text style={styles.promoTitle}>Parrainez vos amis</Text>
181|          <Text style={styles.promoSubtitle}>Gagnez 1000 F par parrainage</Text>
182|        </View>
183|      </View>
184|    </ScrollView>
185|  );
186|}
187|
188|const styles = StyleSheet.create({
189|  container: {
190|    flex: 1,
191|    backgroundColor: '#0A0A0A',
192|  },
193|  content: {
194|    paddingHorizontal: 20,
195|    paddingTop: 60,
196|    paddingBottom: 24,
197|  },
198|  header: {
199|    marginBottom: 24,
200|  },
201|  greeting: {
202|    fontSize: 16,
203|    color: '#888',
204|  },
205|  name: {
206|    fontSize: 28,
207|    fontWeight: '700',
208|    color: '#FFF',
209|  },
210|  nameRow: {
211|    flexDirection: 'row',
212|    alignItems: 'center',
213|    gap: 8,
214|  },
215|  activeRideCard: {
216|    backgroundColor: '#1A1A1A',
217|    borderRadius: 16,
218|    padding: 16,
219|    marginBottom: 20,
220|    borderWidth: 1,
221|    borderColor: '#333',
222|  },
223|  activeRideHeader: {
224|    marginBottom: 12,
225|  },
226|  statusBadge: {
227|    flexDirection: 'row',
228|    alignItems: 'center',
229|    alignSelf: 'flex-start',
230|    paddingHorizontal: 12,
231|    paddingVertical: 6,
232|    borderRadius: 20,
233|  },
234|  statusDot: {
235|    width: 8,
236|    height: 8,
237|    borderRadius: 4,
238|    marginRight: 8,
239|  },
240|  statusText: {
241|    fontSize: 14,
242|    fontWeight: '600',
243|  },
244|  activeRideInfo: {
245|    gap: 8,
246|  },
247|  locationRow: {
248|    flexDirection: 'row',
249|    alignItems: 'center',
250|    gap: 8,
251|  },
252|  locationText: {
253|    color: '#FFF',
254|    fontSize: 14,
255|    flex: 1,
256|  },
257|  driverInfo: {
258|    flexDirection: 'row',
259|    alignItems: 'center',
260|    marginTop: 16,
261|    paddingTop: 16,
262|    borderTopWidth: 1,
263|    borderTopColor: '#333',
264|    gap: 12,
265|  },
266|  driverAvatar: {
267|    width: 40,
268|    height: 40,
269|    borderRadius: 20,
270|    backgroundColor: '#FF6B00',
271|    justifyContent: 'center',
272|    alignItems: 'center',
273|  },
274|  driverName: {
275|    color: '#FFF',
276|    fontSize: 16,
277|    fontWeight: '600',
278|  },
279|  driverPhone: {
280|    color: '#888',
281|    fontSize: 14,
282|  },
283|  bookButton: {
284|    flexDirection: 'row',
285|    alignItems: 'center',
286|    backgroundColor: '#1A1A1A',
287|    borderRadius: 16,
288|    padding: 16,
289|    marginBottom: 24,
290|    borderWidth: 1,
291|    borderColor: '#FF6B00',
292|  },
293|  bookIcon: {
294|    width: 56,
295|    height: 56,
296|    borderRadius: 12,
297|    backgroundColor: '#FF6B00',
298|    justifyContent: 'center',
299|    alignItems: 'center',
300|  },
301|  bookTextContainer: {
302|    flex: 1,
303|    marginLeft: 16,
304|  },
305|  bookTitle: {
306|    color: '#FFF',
307|    fontSize: 18,
308|    fontWeight: '600',
309|  },
310|  bookSubtitle: {
311|    color: '#888',
312|    fontSize: 14,
313|    marginTop: 4,
314|  },
315|  sectionTitle: {
316|    fontSize: 18,
317|    fontWeight: '600',
318|    color: '#FFF',
319|    marginBottom: 16,
320|  },
321|  servicesGrid: {
322|    flexDirection: 'row',
323|    gap: 12,
324|    marginBottom: 24,
325|  },
326|  serviceCard: {
327|    flex: 1,
328|    backgroundColor: '#1A1A1A',
329|    borderRadius: 12,
330|    padding: 16,
331|    alignItems: 'center',
332|  },
333|  serviceIcon: {
334|    width: 56,
335|    height: 56,
336|    borderRadius: 28,
337|    justifyContent: 'center',
338|    alignItems: 'center',
339|    marginBottom: 12,
340|  },
341|  serviceName: {
342|    color: '#FFF',
343|    fontSize: 14,
344|    fontWeight: '600',
345|  },
346|  servicePrice: {
347|    color: '#888',
348|    fontSize: 12,
349|    marginTop: 4,
350|  },
351|  promoCard: {
352|    flexDirection: 'row',
353|    alignItems: 'center',
354|    backgroundColor: '#1A1A1A',
355|    borderRadius: 16,
356|    padding: 16,
357|    gap: 16,
358|  },
359|  promoText: {
360|    flex: 1,
361|  },
362|  promoTitle: {
363|    color: '#FFF',
364|    fontSize: 16,
365|    fontWeight: '600',
366|  },
367|  promoSubtitle: {
368|    color: '#888',
369|    fontSize: 14,
370|    marginTop: 4,
371|  },
372|});
373|
