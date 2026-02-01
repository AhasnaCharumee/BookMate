import { IconSymbolName } from '../components/ui/icon-symbol';

/**
 * Navigation route definitions with icons and labels
 */
export const NAVIGATION_ROUTES = {
  HOME: {
    name: 'home',
    label: 'Home',
    icon: 'house.fill' as IconSymbolName,
  },
  SEARCH: {
    name: 'search',
    label: 'Search',
    icon: 'magnifyingglass' as IconSymbolName,
  },
  ADD: {
    name: 'books/add',
    label: 'Add',
    icon: 'plus.circle.fill' as IconSymbolName,
  },
  LIBRARY: {
    name: 'library',
    label: 'Library',
    icon: 'book.fill' as IconSymbolName,
  },
  PROFILE: {
    name: 'profile',
    label: 'Profile',
    icon: 'person.circle.fill' as IconSymbolName,
  },
} as const;

/**
 * Icon size constants for consistent sizing
 */
export const ICON_SIZES = {
  small: 18,
  medium: 24,
  large: 32,
  xlarge: 40,
} as const;

/**
 * Tab bar styling constants
 */
export const TAB_BAR_CONFIG = {
  height: 60,
  iconSize: 24,
  activeColor: '#10b981', // emerald-600
  inactiveColor: '#64748b', // slate-500
  backgroundColor: '#1e293b', // slate-900
} as const;
