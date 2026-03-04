1|import { Tabs } from 'expo-router';
2|import { Ionicons } from '@expo/vector-icons';
3|
4|export default function ClientLayout() {
5|  return (
6|    <Tabs
7|      screenOptions={{
8|        headerShown: false,
9|        tabBarStyle: {
10|          backgroundColor: '#0A0A0A',
11|          borderTopColor: '#1A1A1A',
12|          borderTopWidth: 1,
13|          height: 60,
14|          paddingBottom: 8,
15|          paddingTop: 8,
16|        },
17|        tabBarActiveTintColor: '#FF6B00',
18|        tabBarInactiveTintColor: '#888',
19|      }}
20|    >
21|      <Tabs.Screen
22|        name="home"
23|        options={{
24|          title: 'Accueil',
25|          tabBarIcon: ({ color, size }) => (
26|            <Ionicons name="home" size={size} color={color} />
27|          ),
28|        }}
29|      />
30|      <Tabs.Screen
31|        name="book"
32|        options={{
33|          title: 'Réserver',
34|          tabBarIcon: ({ color, size }) => (
35|            <Ionicons name="car" size={size} color={color} />
36|          ),
37|        }}
38|      />
39|      <Tabs.Screen
40|        name="rides"
41|        options={{
42|          title: 'Mes courses',
43|          tabBarIcon: ({ color, size }) => (
44|            <Ionicons name="list" size={size} color={color} />
45|          ),
46|        }}
47|      />
48|      <Tabs.Screen
49|        name="profile"
50|        options={{
51|          title: 'Profil',
52|          tabBarIcon: ({ color, size }) => (
53|            <Ionicons name="person" size={size} color={color} />
54|          ),
55|        }}
56|      />
57|    </Tabs>
58|  );
59|}
60|
