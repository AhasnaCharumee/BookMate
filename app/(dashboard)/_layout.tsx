import { Tabs } from 'expo-router';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { NAVIGATION_ROUTES, TAB_BAR_CONFIG } from '../../constants/navigation';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TAB_BAR_CONFIG.activeColor,
        tabBarInactiveTintColor: TAB_BAR_CONFIG.inactiveColor,
        tabBarStyle: {
          backgroundColor: TAB_BAR_CONFIG.backgroundColor,
          borderTopColor: '#334155', // slate-700
          borderTopWidth: 1,
          height: TAB_BAR_CONFIG.height,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: NAVIGATION_ROUTES.HOME.label,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name={NAVIGATION_ROUTES.HOME.icon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: NAVIGATION_ROUTES.SEARCH.label,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name={NAVIGATION_ROUTES.SEARCH.icon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="books/add"
        options={{
          title: NAVIGATION_ROUTES.ADD.label,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name={NAVIGATION_ROUTES.ADD.icon} color={color} size={TAB_BAR_CONFIG.iconSize + 8} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: NAVIGATION_ROUTES.LIBRARY.label,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name={NAVIGATION_ROUTES.LIBRARY.icon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: NAVIGATION_ROUTES.PROFILE.label,
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name={NAVIGATION_ROUTES.PROFILE.icon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
