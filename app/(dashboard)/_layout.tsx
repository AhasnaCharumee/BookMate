import { Tabs, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { NAVIGATION_ROUTES, TAB_BAR_CONFIG } from '../../constants/navigation';

export default function DashboardLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  
  // Hide tab bar on form pages
  const isFormPage = pathname.includes('/books/add') || 
                     pathname.includes('/books/edit/') ||
                     pathname.includes('/books/');
  
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
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          borderRadius: 16,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          display: isFormPage ? 'none' : 'flex',
        },
        tabBarItemStyle: {
          paddingVertical: 8,
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
