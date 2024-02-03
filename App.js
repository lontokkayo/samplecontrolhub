import React, { useState, useEffect, StrictMode } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import {
  Input,
  Icon,
  Stack,
  Pressable,
  Center,
  NativeBaseProvider,
  Button,
  Box,
  HStack,
  Image,
  VStack,
  Alert,
  IconButton,
  CloseIcon,
  Spinner,
  Heading,
  Collapse,
  useToast,
  PresenceTransition
} from "native-base";
import { getAuth, auth, getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, onSnapshot, } from './firebasecontrol'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/LoginPage';
import DevAdmin from './components/DevAdmin';
import Admin from './components/Admin';
import Checkpoint from './components/Checkpoint';
import ResetPassword from './components/ResetPassword';
import ResetPasswordSuccess from './components/ResetPasswordSuccess';
import './style.css';
import { Provider } from 'react-redux';
import store from './components/DevAdminComponents/redux/store';
import { BrowserRouter as Router } from 'react-router-dom';

const StackNavigator = createNativeStackNavigator();

const { width, height } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;



export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }


  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged)

    return subscriber;
  }, [])


  if (initializing) {
    return null; // or a loading screen if needed
  }


  const config = {
    screens: {
      Login: 'login',
      Checkpoint: 'checkpoint',
      devadmin: {
        path: 'devadmin',
        screens: {
          'CHAT MESSAGES': 'ChatMessages',
          'CHAT MESSAGES': 'ChatMessages/:chatId',
          'FREIGHT': 'Freight',
          'ADD NEW VEHICLE': 'AddNewVehicle',
          'LOGS': 'Logs',
          'VEHICLE LIST': 'VehicleList',
          'ACCOUNT LIST': 'AccountList',
          'ADD C-HUB ACCOUNT': 'AddCHubAccount',
        },
      },

    },
  };

  const linking = {
    prefixes: ['http://localhost:19006/', 'https://lontokkayo.github.io/'],
    config,
  };


  return (
    <Router>
      <Provider store={store}>
        <NativeBaseProvider>
          {/* <LoginPage/> */}
          <NavigationContainer linking={linking}>
            <StackNavigator.Navigator options={{ headerShown: false }}>
              <StackNavigator.Screen options={{ headerShown: false, }} name="Login" component={LoginPage} />
              <StackNavigator.Screen options={{ headerShown: false, }} name="Checkpoint" component={Checkpoint} />
              <StackNavigator.Screen options={{ headerShown: false, unmountOnBlur: true }} name="devadmin" component={DevAdmin} />
              <StackNavigator.Screen options={{ headerShown: false }} name="admin" component={Admin} />
              <StackNavigator.Screen options={{ headerShown: false }} name="ResetPassword" component={ResetPassword} />
              <StackNavigator.Screen options={{ headerShown: false }} name="ResetPasswordSuccess" component={ResetPasswordSuccess} />
              {/* {user ? (<StackNavigator.Screen options={{ headerShown: false }} name="Checkpoint" component={Checkpoint} /> ) : user ?
          (<StackNavigator.Screen options={{ headerShown: false }} name="superadmin" component={SuperAdmin} />) : user ?
          (<StackNavigator.Screen options={{ headerShown: false }} name="admin" component={Admin} />) :  (
          <StackNavigator.Screen  options={{ headerShown: false }} name="Login" component={LoginPage} />
        )} */}
            </StackNavigator.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Router>
  );
}


