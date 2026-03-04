1|import axios from 'axios';
2|import AsyncStorage from '@react-native-async-storage/async-storage';
3|
4|const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';
5|
6|export const api = axios.create({
7|  baseURL: `${API_URL}/api`,
8|  headers: {
9|    'Content-Type': 'application/json',
10|  },
11|});
12|
13|// Add auth token to requests
14|api.interceptors.request.use(async (config) => {
15|  const token = await AsyncStorage.getItem('token');
16|  if (token) {
17|    config.headers.Authorization = `Bearer ${token}`;
18|  }
19|  return config;
20|});
21|
22|// Auth API
23|export const authAPI = {
24|  register: (data: { phone: string; full_name: string; password: string; user_type: string }) =>
25|    api.post('/auth/register', data),
26|  login: (data: { phone: string; password: string }) =>
27|    api.post('/auth/login', data),
28|  getMe: () => api.get('/auth/me'),
29|};
30|
31|// Driver API
32|export const driverAPI = {
33|  registerVehicle: (data: any) => api.post('/driver/register-vehicle', data),
34|  updateAvailability: (is_available: boolean) =>
35|    api.put(`/driver/availability?is_available=${is_available}`),
36|  updateLocation: (location: { lat: number; lng: number }) =>
37|    api.put('/driver/location', location),
38|  getPendingRides: () => api.get('/driver/pending-rides'),
39|  getMyRides: (status?: string) =>
40|    api.get('/driver/rides' + (status ? `?status_filter=${status}` : '')),
41|};
42|
43|// Rides API
44|export const ridesAPI = {
45|  createRide: (data: any) => api.post('/rides/request', data),
46|  acceptRide: (rideId: string) => api.put(`/rides/${rideId}/accept`),
47|  startRide: (rideId: string) => api.put(`/rides/${rideId}/start`),
48|  completeRide: (rideId: string) => api.put(`/rides/${rideId}/complete`),
49|  cancelRide: (rideId: string) => api.put(`/rides/${rideId}/cancel`),
50|  getMyRides: (status?: string) =>
51|    api.get('/rides/my-rides' + (status ? `?status_filter=${status}` : '')),
52|  getRide: (rideId: string) => api.get(`/rides/${rideId}`),
53|  getActiveRide: () => api.get('/rides/active'),
54|};
55|
[End of file]
