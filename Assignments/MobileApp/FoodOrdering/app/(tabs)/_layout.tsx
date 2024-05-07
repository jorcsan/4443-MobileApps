import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useNavigation } from 'expo-router';
import { Pressable, View, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Define a custom back button component
const BackButton = ({ onPress }: { onPress: () => void }) => ( // Explicitly define the type of onPress
  <Pressable onPress={onPress} style={{ marginLeft: 15 }}>
    <FontAwesome name="arrow-left" size={25} color={Colors.light.tint} />
  </Pressable>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation(); // Access the navigation object

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          headerShown: false,
          title: 'search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="shopping-cart"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: 'location',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
 
    </Tabs>
  );
}
