1|import { create } from 'zustand';
2|import AsyncStorage from '@react-native-async-storage/async-storage';
3|
4|interface User {
5|  id: string;
6|  phone: string;
7|  full_name: string;
8|  user_type: 'client' | 'driver';
9|  profile_complete: boolean;
10|  driver_info?: any;
11|}
12|
13|interface AuthState {
14|  user: User | null;
15|  token: string | null;
16|  isLoading: boolean;
17|  isAuthenticated: boolean;
18|  setAuth: (user: User, token: string) => Promise<void>;
19|  logout: () => Promise<void>;
20|  loadAuth: () => Promise<void>;
21|  updateUser: (user: Partial<User>) => void;
22|}
23|
24|export const useAuthStore = create<AuthState>((set, get) => ({
25|  user: null,
26|  token: null,
27|  isLoading: true,
28|  isAuthenticated: false,
29|
30|  setAuth: async (user: User, token: string) => {
31|    await AsyncStorage.setItem('token', token);
32|    await AsyncStorage.setItem('user', JSON.stringify(user));
33|    set({ user, token, isAuthenticated: true, isLoading: false });
34|  },
35|
36|  logout: async () => {
37|    await AsyncStorage.removeItem('token');
38|    await AsyncStorage.removeItem('user');
39|    set({ user: null, token: null, isAuthenticated: false });
40|  },
41|
42|  loadAuth: async () => {
43|    try {
44|      const token = await AsyncStorage.getItem('token');
45|      const userStr = await AsyncStorage.getItem('user');
46|      if (token && userStr) {
47|        const user = JSON.parse(userStr);
48|        set({ user, token, isAuthenticated: true, isLoading: false });
49|      } else {
50|        set({ isLoading: false });
51|      }
52|    } catch (error) {
53|      set({ isLoading: false });
54|    }
55|  },
56|
57|  updateUser: (userData: Partial<User>) => {
58|    const currentUser = get().user;
59|    if (currentUser) {
60|      const updatedUser = { ...currentUser, ...userData };
61|      set({ user: updatedUser });
62|      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
63|    }
64|  },
65|}));
66|
[End of file]
