import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Navigation

import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//Screens

import Home from './screens/Home';
import NewNote from './screens/NewNote';
import EditNote from './screens/EditNote';
import Search from './screens/Search';
import {useColorScheme} from 'react-native';

export const defaultBanner = './assets/images/defaultBanner.png';

export interface Note {
  title: string;
  data: string;
  image: string;
  tags: {
    text: string;
    isSelected: boolean;
  }[];
}

export type RootStackParamList = {
  Home: {notes: Note[]};
  NewNote: {notes: Note[]};
  EditNote: {
    notes: Note[];
    title: string;
    data: string;
    index: number;
    imagePath: string;
    tags: {text: string; isSelected: boolean}[];
  };
  Search: {notes: Note[]};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const getNotes = async () => {
      try {
        const value = await AsyncStorage.getItem('notes');
        const parsedNotes = value ? JSON.parse(value) : [];
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error retrieving notes:', error);
      }
    };
    getNotes();
  }, []);

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={Home} initialParams={{notes}} />
        <Stack.Screen name="NewNote" component={NewNote} />
        <Stack.Screen name="EditNote" component={EditNote} />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
