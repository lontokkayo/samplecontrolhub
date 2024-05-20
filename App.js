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
import Top from './components/Top';
import Admin from './components/Top';
import Checkpoint from './components/Checkpoint';
import ResetPassword from './components/ResetPassword';
import ResetPasswordSuccess from './components/ResetPasswordSuccess';
import './style.css';
import { Provider } from 'react-redux';
import store from './components/DevAdminComponents/redux/store';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FastImage from 'react-native-fast-image-web-support';

const logo = require('./assets/RMJ C-Hub 制御ハブ.png');


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
    const auth = getAuth();
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <NativeBaseProvider>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <VStack space={4} alignItems="center">
            <Box w={[300, 400, 550]} h={[94, 125, 172]}>
              <FastImage
                source={{
                  uri: logo,
                  priority: FastImage.priority.normal,
                }}
                style={{
                  flex: 1,
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </Box>
            <Spinner size="lg" color={'white'} />
          </VStack>
        </div>
      </NativeBaseProvider>
    ); // Show a loading spinner
  }

  const config = {
    screens: {
      Login: 'login',
      Checkpoint: 'checkpoint',
      devadmin: {
        path: 'devadmin',
        screens: {
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
    prefixes: ['https://lontokkayo.github.io/samplecontrolhub/'],
    config,
  };

  const style = document.createElement('style');
  style.textContent = `
    body, html {
      overscroll-behavior-x: none;
      overscroll-behavior-y: none;
    }
  `;

  document.head.append(style);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Login/*" element={<LoginPage />} />
          <Route path="/Checkpoint" element={<Checkpoint />} />
          <Route path="/top/*" element={<Top />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/ResetPasswordSuccess" element={<ResetPasswordSuccess />} />
        </Routes>
      </Router>
    </Provider>
  );
}


