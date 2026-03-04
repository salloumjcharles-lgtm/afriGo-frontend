1|import React, { useState, useCallback, useEffect } from 'react';
2|import {
3|  View,
4|  Text,
5|  StyleSheet,
6|  ScrollView,
7|  TouchableOpacity,
8|  RefreshControl,
9|  Switch,
10|  Alert,
11|} from 'react-native';
12|import { router, useFocusEffect } from 'expo-router';
13|import { Ionicons } from '@expo/vector-icons';
14|import { useAuthStore } from '../../src/store/authStore';
15|import { driverAPI, ridesAPI } from '../../src/api/client';
16|import * as Location from 'expo-location';
17|
18|export default function DriverHomeScreen() {
19|  const { user, logout } = useAuthStore();
20|  const [isAvailable, setIsAvailable] = useState(false);
21|  const [pendingRides, setPendingRides] = useState<any[]>([]);
22|  const [activeRide, setActiveRide] = useState<any>(null);
23|  const [refreshing, setRefreshing] = useState(false);
24|  const [stats, setStats] = useState({ today: 0, week: 0, earnings: 0 });
25|
26|  const fetchData = async () => {
27|    try {
28|      // Fetch pending rides
29|      const pendingResponse = await driverAPI.getPendingRides();
30|      setPendingRides(pendingResponse.data || []);
31|
32|      // Fetch active ride
33|      const activeResponse = await ridesAPI.getActiveRide();
34|      setActiveRide(activeResponse.data);
35|
36|      // Calculate stats from completed rides
37|      const ridesResponse = await driverAPI.getMyRides('completed');
38|      const rides = ridesResponse.data || [];
39|      const today = new Date();
40|      const todayRides = rides.filter((r: any) => {
41|        const rideDate = new Date(r.completed_at);
42|        return rideDate.toDateString() === today.toDateString();
43|      });
44|      const weekRides = rides.filter((r: any) => {
45|        const rideDate = new Date(r.completed_at);
46|        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
47|        return rideDate >= weekAgo;
48|      });
49|      const earnings = weekRides.reduce((sum: number, r: any) => sum + (r.final_price || 0), 0);
50|      
51|      setStats({
52|        today: todayRides.length,
53|        week: weekRides.length,
54|        earnings,
55|      });
56|    } catch (error) {
57|      console.error('Error fetching data:', error);
58|    }
59|  };
60|
61|  useFocusEffect(
62|    useCallback(() => {
63|      fetchData();
64|      const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
65|      return () => clearInterval(interval);
66|    }, [])
67|  );
68|
69|  useEffect(() => {
70|    (async () => {
71|      const { status } = await Location.requestForegroundPermissionsAsync();
72|      if (status === 'granted') {
73|        const location = await Location.getCurrentPositionAsync({});
74|        driverAPI.updateLocation({
75|          lat: location.coords.latitude,
76|          lng: location.coords.longitude,
77|        });
78|      }
79|    })();
80|  }, []);
81|
82|  const onRefresh = async () => {
83|    setRefreshing(true);
84|    await fetchData();
85|    setRefreshing(false);
86|  };
87|
88|  const toggleAvailability = async (value: boolean) => {
89|    try {
90|      await driverAPI.updateAvailability(value);
91|      setIsAvailable(value);
92|    } catch (error) {
93|      Alert.alert('Erreur', 'Impossible de mettre à jour la disponibilité');
94|    }
95|  };
96|
97|  const handleAcceptRide = async (rideId: string) => {
98|    try {
99|      await ridesAPI.acceptRide(rideId);
100|      Alert.alert('Succès', 'Course acceptée !');
101|      fetchData();
102|    } catch (error: any) {
103|      Alert.alert(
104|        'Erreur',
105|        error.response?.data?.detail || "Cette course n'est plus disponible"
106|      );
107|      fetchData();
108|    }
109|  };
110|
111|  const handleStartRide = async () => {
112|    if (!activeRide) return;
113|    try {
114|      await ridesAPI.startRide(activeRide.id);
115|      fetchData();
116|    } catch (error: any) {
117|      Alert.alert('Erreur', error.response?.data?.detail || 'Impossible de démarrer');
118|    }
119|  };
120|
121|  const handleCompleteRide = async () => {
122|    if (!activeRide) return;
123|    Alert.alert(
124|      'Terminer la course',
125|      'Confirmez-vous avoir déposé le client à destination ?',
126|      [
127|        { text: 'Non', style: 'cancel' },
128|        {
129|          text: 'Oui, terminer',
130|          onPress: async () => {
131|            try {
132|              await ridesAPI.completeRide(activeRide.id);
133|              Alert.alert('Bravo !', `Course terminée. Gain: ${activeRide.estimated_price.toLocaleString()} F CFA`);
134|              fetchData();
135|            } catch (error: any) {
136|              Alert.alert('Erreur', error.response?.data?.detail || 'Impossible de terminer');
137|            }
138|          },
139|        },
140|      ]
141|    );
142|  };
143|
144|  const handleLogout = () => {
145|    Alert.alert('Déconnexion', 'Êtes-vous sûr ?', [
146|      { text: 'Annuler', style: 'cancel' },
147|      {
148|        text: 'Oui',
149|        onPress: async () => {
150|          await logout();
151|          router.replace('/');
152|        },
153|      },
154|    ]);
155|  };
156|
157|  const getPaymentLabel = (method: string) => {
158|    switch (method) {
159|      case 'cash': return 'Espèces';
160|      case 'orange_money': return 'Orange Money';
161|      case 'wave': return 'Wave';
162|      default: return method;
163|    }
164|  };
165|
166|  return (
167|    <View style={styles.container}>
168|      <View style={styles.header}>
169|        <View>
170|          <Text style={styles.greeting}>Bonjour, Chauffeur</Text>
171|          <Text style={styles.name}>{user?.full_name}</Text>
172|        </View>
173|        <TouchableOpacity onPress={handleLogout}>
174|          <Ionicons name="log-out" size={24} color="#888" />
175|        </TouchableOpacity>
176|      </View>
177|
178|      <View style={styles.availabilityCard}>
179|        <View style={styles.availabilityInfo}>
180|          <View style={[styles.statusIndicator, isAvailable && styles.statusActive]} />
181|          <Text style={styles.availabilityText}>
182|            {isAvailable ? 'En service' : 'Hors service'}
183|          </Text>
184|        </View>
185|        <Switch
186|          value={isAvailable}
187|          onValueChange={toggleAvailability}
188|          trackColor={{ false: '#333', true: '#FF6B00' }}
189|          thumbColor="#FFF"
190|        />
191|      </View>
192|
193|      <ScrollView
194|        style={styles.scrollView}
195|        contentContainerStyle={styles.scrollContent}
196|        refreshControl={
197|          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B00" />
198|        }
199|      >
200|        {/* Stats */}
201|        <View style={styles.statsGrid}>
202|          <View style={styles.statCard}>
203|            <Text style={styles.statValue}>{stats.today}</Text>
204|            <Text style={styles.statLabel}>Aujourd'hui</Text>
205|          </View>
206|          <View style={styles.statCard}>
207|            <Text style={styles.statValue}>{stats.week}</Text>
208|            <Text style={styles.statLabel}>Cette semaine</Text>
209|          </View>
210|          <View style={[styles.statCard, styles.statCardHighlight]}>
211|            <Text style={[styles.statValue, { color: '#FF6B00' }]}>
212|              {stats.earnings.toLocaleString()}
213|            </Text>
214|            <Text style={styles.statLabel}>F CFA</Text>
215|          </View>
216|        </View>
217|
218|        {/* Active Ride */}
219|        {activeRide && (
220|          <View style={styles.activeRideCard}>
221|            <View style={styles.activeRideHeader}>
222|              <Text style={styles.activeRideTitle}>Course en cours</Text>
223|              <View style={[styles.statusBadge, { backgroundColor: activeRide.status === 'in_progress' ? '#00C85320' : '#00B4D820' }]}>
224|                <Text style={[styles.statusBadgeText, { color: activeRide.status === 'in_progress' ? '#00C853' : '#00B4D8' }]}>
225|                  {activeRide.status === 'in_progress' ? 'En route' : 'Acceptée'}
226|                </Text>
227|              </View>
228|            </View>
229|
230|            <View style={styles.clientInfo}>
231|              <View style={styles.clientAvatar}>
232|                <Ionicons name="person" size={24} color="#FFF" />
233|              </View>
234|              <View style={styles.clientDetails}>
235|                <Text style={styles.clientName}>{activeRide.client_name}</Text>
236|                <Text style={styles.clientPhone}>{activeRide.client_phone}</Text>
237|              </View>
238|              <TouchableOpacity style={styles.callButton}>
239|                <Ionicons name="call" size={20} color="#00C853" />
240|              </TouchableOpacity>
241|            </View>
242|
243|            <View style={styles.rideLocations}>
244|              <View style={styles.locationRow}>
245|                <Ionicons name="location" size={18} color="#00C853" />
246|                <Text style={styles.locationText} numberOfLines={2}>
247|                  {activeRide.pickup_address}
248|                </Text>
249|              </View>
250|              <View style={styles.locationDivider} />
251|              <View style={styles.locationRow}>
252|                <Ionicons name="flag" size={18} color="#FF6B00" />
253|                <Text style={styles.locationText} numberOfLines={2}>
254|                  {activeRide.destination_address}
255|                </Text>
256|              </View>
257|            </View>
258|
259|            <View style={styles.rideInfo}>
260|              <View style={styles.rideInfoItem}>
261|                <Ionicons name="cash" size={16} color="#888" />
262|                <Text style={styles.rideInfoText}>{getPaymentLabel(activeRide.payment_method)}</Text>
263|              </View>
264|              <Text style={styles.ridePrice}>{activeRide.estimated_price.toLocaleString()} F</Text>
265|            </View>
266|
267|            {activeRide.status === 'accepted' ? (
268|              <TouchableOpacity style={styles.actionButton} onPress={handleStartRide}>
269|                <Ionicons name="play" size={20} color="#FFF" />
270|                <Text style={styles.actionButtonText}>Démarrer la course</Text>
271|              </TouchableOpacity>
272|            ) : (
273|              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#00C853' }]} onPress={handleCompleteRide}>
274|                <Ionicons name="checkmark" size={20} color="#FFF" />
275|                <Text style={styles.actionButtonText}>Terminer la course</Text>
276|              </TouchableOpacity>
277|            )}
278|          </View>
279|        )}
280|
281|        {/* Pending Rides */}
282|        {!activeRide && isAvailable && (
283|          <>
284|            <Text style={styles.sectionTitle}>Courses disponibles</Text>
285|            {pendingRides.length === 0 ? (
286|              <View style={styles.emptyState}>
287|                <Ionicons name="car" size={48} color="#333" />
288|                <Text style={styles.emptyText}>Aucune course disponible</Text>
289|                <Text style={styles.emptySubtext}>Restez connecté, de nouvelles courses arrivent</Text>
290|              </View>
291|            ) : (
292|              pendingRides.map((ride) => (
293|                <View key={ride.id} style={styles.pendingRideCard}>
294|                  <View style={styles.pendingRideHeader}>
295|                    <Text style={styles.pendingRidePrice}>
296|                      {ride.estimated_price.toLocaleString()} F CFA
297|                    </Text>
298|                    <View style={styles.paymentBadge}>
299|                      <Text style={styles.paymentBadgeText}>{getPaymentLabel(ride.payment_method)}</Text>
300|                    </View>
301|                  </View>
302|
303|                  <View style={styles.rideLocations}>
304|                    <View style={styles.locationRow}>
305|                      <Ionicons name="location" size={16} color="#00C853" />
306|                      <Text style={styles.pendingLocationText} numberOfLines={1}>
307|                        {ride.pickup_address}
308|                      </Text>
309|                    </View>
310|                    <View style={styles.locationRow}>
311|                      <Ionicons name="flag" size={16} color="#FF6B00" />
312|                      <Text style={styles.pendingLocationText} numberOfLines={1}>
313|                        {ride.destination_address}
314|                      </Text>
315|                    </View>
316|                  </View>
317|
318|                  <TouchableOpacity
319|                    style={styles.acceptButton}
320|                    onPress={() => handleAcceptRide(ride.id)}
321|                  >
322|                    <Text style={styles.acceptButtonText}>Accepter</Text>
323|                  </TouchableOpacity>
324|                </View>
325|              ))
326|            )}
327|          </>
328|        )}
329|
330|        {!activeRide && !isAvailable && (
331|          <View style={styles.offlineState}>
332|            <Ionicons name="power" size={48} color="#FF6B00" />
333|            <Text style={styles.offlineTitle}>Vous êtes hors service</Text>
334|            <Text style={styles.offlineText}>
335|              Activez votre disponibilité pour recevoir des courses
336|            </Text>
337|          </View>
338|        )}
339|      </ScrollView>
340|    </View>
341|  );
342|}
343|
344|const styles = StyleSheet.create({
345|  container: {
346|    flex: 1,
347|    backgroundColor: '#0A0A0A',
348|  },
349|  header: {
350|    flexDirection: 'row',
351|    justifyContent: 'space-between',
352|    alignItems: 'center',
353|    paddingHorizontal: 20,
354|    paddingTop: 60,
355|    paddingBottom: 16,
356|  },
357|  greeting: {
358|    fontSize: 14,
359|    color: '#888',
360|  },
361|  name: {
362|    fontSize: 22,
363|    fontWeight: '700',
364|    color: '#FFF',
365|  },
366|  availabilityCard: {
367|    flexDirection: 'row',
368|    justifyContent: 'space-between',
369|    alignItems: 'center',
370|    marginHorizontal: 20,
371|    backgroundColor: '#1A1A1A',
372|    borderRadius: 12,
373|    padding: 16,
374|  },
375|  availabilityInfo: {
376|    flexDirection: 'row',
377|    alignItems: 'center',
378|    gap: 12,
379|  },
380|  statusIndicator: {
381|    width: 12,
382|    height: 12,
383|    borderRadius: 6,
384|    backgroundColor: '#888',
385|  },
386|  statusActive: {
387|    backgroundColor: '#00C853',
388|  },
389|  availabilityText: {
390|    fontSize: 16,
391|    fontWeight: '600',
392|    color: '#FFF',
393|  },
394|  scrollView: {
395|    flex: 1,
396|  },
397|  scrollContent: {
398|    padding: 20,
399|    paddingBottom: 40,
400|  },
401|  statsGrid: {
402|    flexDirection: 'row',
403|    gap: 12,
404|    marginBottom: 24,
405|  },
406|  statCard: {
407|    flex: 1,
408|    backgroundColor: '#1A1A1A',
409|    borderRadius: 12,
410|    padding: 16,
411|    alignItems: 'center',
412|  },
413|  statCardHighlight: {
414|    borderWidth: 1,
415|    borderColor: '#FF6B00',
416|  },
417|  statValue: {
418|    fontSize: 24,
419|    fontWeight: '700',
420|    color: '#FFF',
421|  },
422|  statLabel: {
423|    fontSize: 12,
424|    color: '#888',
425|    marginTop: 4,
426|  },
427|  activeRideCard: {
428|    backgroundColor: '#1A1A1A',
429|    borderRadius: 16,
430|    padding: 16,
431|    marginBottom: 24,
432|    borderWidth: 1,
433|    borderColor: '#FF6B00',
434|  },
435|  activeRideHeader: {
436|    flexDirection: 'row',
437|    justifyContent: 'space-between',
438|    alignItems: 'center',
439|    marginBottom: 16,
440|  },
441|  activeRideTitle: {
442|    fontSize: 18,
443|    fontWeight: '700',
444|    color: '#FFF',
445|  },
446|  statusBadge: {
447|    paddingHorizontal: 10,
448|    paddingVertical: 4,
449|    borderRadius: 12,
450|  },
451|  statusBadgeText: {
452|    fontSize: 12,
453|    fontWeight: '600',
454|  },
455|  clientInfo: {
456|    flexDirection: 'row',
457|    alignItems: 'center',
458|    marginBottom: 16,
459|  },
460|  clientAvatar: {
461|    width: 48,
462|    height: 48,
463|    borderRadius: 24,
464|    backgroundColor: '#FF6B00',
465|    justifyContent: 'center',
466|    alignItems: 'center',
467|  },
468|  clientDetails: {
469|    flex: 1,
470|    marginLeft: 12,
471|  },
472|  clientName: {
473|    fontSize: 16,
474|    fontWeight: '600',
475|    color: '#FFF',
476|  },
477|  clientPhone: {
478|    fontSize: 14,
479|    color: '#888',
480|  },
481|  callButton: {
482|    width: 44,
483|    height: 44,
484|    borderRadius: 22,
485|    backgroundColor: '#00C85320',
486|    justifyContent: 'center',
487|    alignItems: 'center',
488|  },
489|  rideLocations: {
490|    marginBottom: 16,
491|  },
492|  locationRow: {
493|    flexDirection: 'row',
494|    alignItems: 'flex-start',
495|    gap: 10,
496|    marginBottom: 8,
497|  },
498|  locationDivider: {
499|    width: 2,
500|    height: 16,
501|    backgroundColor: '#333',
502|    marginLeft: 7,
503|  },
504|  locationText: {
505|    color: '#FFF',
506|    fontSize: 14,
507|    flex: 1,
508|  },
509|  rideInfo: {
510|    flexDirection: 'row',
511|    justifyContent: 'space-between',
512|    alignItems: 'center',
513|    paddingTop: 12,
514|    borderTopWidth: 1,
515|    borderTopColor: '#333',
516|  },
517|  rideInfoItem: {
518|    flexDirection: 'row',
519|    alignItems: 'center',
520|    gap: 6,
521|  },
522|  rideInfoText: {
523|    color: '#888',
524|    fontSize: 14,
525|  },
526|  ridePrice: {
527|    fontSize: 20,
528|    fontWeight: '700',
529|    color: '#FF6B00',
530|  },
531|  actionButton: {
532|    flexDirection: 'row',
533|    alignItems: 'center',
534|    justifyContent: 'center',
535|    backgroundColor: '#FF6B00',
536|    borderRadius: 12,
537|    paddingVertical: 14,
538|    marginTop: 16,
539|    gap: 8,
540|  },
541|  actionButtonText: {
542|    color: '#FFF',
543|    fontSize: 16,
544|    fontWeight: '600',
545|  },
546|  sectionTitle: {
547|    fontSize: 18,
548|    fontWeight: '600',
549|    color: '#FFF',
550|    marginBottom: 16,
551|  },
552|  emptyState: {
553|    alignItems: 'center',
554|    paddingVertical: 48,
555|  },
556|  emptyText: {
557|    fontSize: 16,
558|    fontWeight: '600',
559|    color: '#FFF',
560|    marginTop: 16,
561|  },
562|  emptySubtext: {
563|    fontSize: 14,
564|    color: '#888',
565|    marginTop: 4,
566|  },
567|  pendingRideCard: {
568|    backgroundColor: '#1A1A1A',
569|    borderRadius: 12,
570|    padding: 16,
571|    marginBottom: 12,
572|  },
573|  pendingRideHeader: {
574|    flexDirection: 'row',
575|    justifyContent: 'space-between',
576|    alignItems: 'center',
577|    marginBottom: 12,
578|  },
579|  pendingRidePrice: {
580|    fontSize: 20,
581|    fontWeight: '700',
582|    color: '#FF6B00',
583|  },
584|  paymentBadge: {
585|    backgroundColor: '#333',
586|    paddingHorizontal: 10,
587|    paddingVertical: 4,
588|    borderRadius: 8,
589|  },
590|  paymentBadgeText: {
591|    color: '#888',
592|    fontSize: 12,
593|  },
594|  pendingLocationText: {
595|    color: '#FFF',
596|    fontSize: 13,
597|    flex: 1,
598|  },
599|  acceptButton: {
600|    backgroundColor: '#FF6B00',
601|    borderRadius: 10,
602|    paddingVertical: 12,
603|    alignItems: 'center',
604|    marginTop: 12,
605|  },
606|  acceptButtonText: {
607|    color: '#FFF',
608|    fontSize: 16,
609|    fontWeight: '600',
610|  },
611|  offlineState: {
612|    alignItems: 'center',
613|    paddingVertical: 64,
614|  },
615|  offlineTitle: {
616|    fontSize: 18,
617|    fontWeight: '600',
618|    color: '#FFF',
619|    marginTop: 16,
620|  },
621|  offlineText: {
622|    fontSize: 14,
623|    color: '#888',
624|    marginTop: 8,
625|    textAlign: 'center',
626|  },
627|});
