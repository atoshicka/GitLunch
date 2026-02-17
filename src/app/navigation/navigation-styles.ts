import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const navigationStyles = {
  getScreenOptions: () => ({
    tabBarActiveTintColor: '#6200ee',
    tabBarInactiveTintColor: '#666',
    tabBarStyle: {
      height: 65,
      paddingBottom: 10,
      paddingTop: 8,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
    } as ViewStyle,
    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 5,
    } as TextStyle,
    headerStyle: {
      backgroundColor: '#6200ee',
    } as ViewStyle,
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    } as TextStyle,
    headerTitleAlign: 'center' as const,
    tabBarIcon: undefined,
  }),

  getTabBarIconStyle: (focused: boolean, color: string, size: number): TextStyle => ({
    color,
    fontSize: size - 4,
    opacity: focused ? 1 : 0.7,
  }),
};

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
