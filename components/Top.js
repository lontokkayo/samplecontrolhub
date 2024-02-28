import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import {
  Input,
  Icon,
  Stack,
  Pressable,
  Center,
  PresenceTransition,
  NativeBaseProvider,
  Button,
  Box,
  HStack,
  Image,
  Container,
  Header,
  Left,
  Body,
  Title,
  Content,
  Text,
  Heading,
  Flex,
  VStack,
  ScrollView,
  SectionList,
  useBreakpointValue,
  Spinner,
  Modal,
  Divider
} from "native-base";
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  Ionicons,
  Fontisto,
  EvilIcons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5Brands
} from 'react-native-vector-icons';
import 'react-native-gesture-handler';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { signOut, onAuthStateChanged, reload, getAuth, getIdTokenResult, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { authForCreateUser } from '../firebasecontrolCreateUser';
import { app, db, getFirestore, collection, addDoc, doc, setDoc, auth, getDoc, onSnapshot, updateDoc } from '../firebasecontrol'
import { useNavigation } from '@react-navigation/core'
import './style.css';
import { debounce } from 'lodash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LazyScreen from './DevAdminComponents/Lazy Screen/LazyScreen';

import { HashRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';

import AddAccount from './DevAdminComponents/AddAccount';
import Logs from './DevAdminComponents/Logs';
import AccountList from './DevAdminComponents/AccountList';
import AddVehicle from './DevAdminComponents/AddVehicle';
import VehicleList from './DevAdminComponents/VehicleList';
import Freight from './DevAdminComponents/Freight';
import ChatMessages from './DevAdminComponents/ChatMessages';
import { setLoginAccountType, setLoginName } from './DevAdminComponents/redux/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const StackNavigator = createNativeStackNavigator();


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;

const firestore = getFirestore();
const getEmailOfCurrentUser = () => {
  const user = auth.currentUser;
  if (user) {
    const email = user.email;
    return email;
  } else {
    console.log('No user is currently authenticated');
    return null;
  }
};

// const Drawer = createDrawerNavigator();


export default function Top({ navigation }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const loginAccountType = useSelector((state) => state.loginAccountType);
  const Drawer = createDrawerNavigator();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const ChatMessagesComponent = () => (
    <LazyScreen importFunc={() => import('./DevAdminComponents/ChatMessages')} />
  );

  const LogsComponent = () => (
    <LazyScreen importFunc={() => import('./DevAdminComponents/Logs')} />
  );

  const FreightComponent = () => (
    <LazyScreen importFunc={() => import('./DevAdminComponents/Freight')} />
  );

  const VehicleListComponent = () => (
    <LazyScreen importFunc={() => import('./DevAdminComponents/VehicleList')} />
  );

  const AccountListComponent = () => (
    <LazyScreen importFunc={() => import('./DevAdminComponents/AccountList')} />
  );

  const AddVehicleComponent = () => (
    <LazyScreen importFunc={() => import('./DevAdminComponents/AddVehicle')} />
  );

  const AddAccountComponent = () => (
    <LazyScreen importFunc={() => import('./DevAdminComponents/AddAccount')} />
  );

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('state', () => {
  //     // Close the drawer on navigation change
  //     setDrawerVisible(false);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    // Initially hide the drawer
    setDrawerVisible(false);
  }, []);


  const handleDocumentChange = (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      const isActive = data.active;

      if (!isActive) {
        signOut(auth)
          .then(() => {
            // navigation.navigate('Login');
            navigate('/Login');
          })
          .catch((error) => {
            console.error('Error signing out:', error);
          });
      }
    } else {
      signOut(auth)
        .then(() => {
          // navigation.navigate('Login');
          navigate('/Login');
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  };

  const subscribeToFieldChange = () => {
    const userId = auth.currentUser?.email;
    if (userId) {
      const userRef = doc(firestore, 'accounts', userId);
      const unsubscribe = onSnapshot(userRef, handleDocumentChange);
      return unsubscribe;
    } else {
      // Return a no-op function if there's no user
      return () => {
        navigate("/login")
      };
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToFieldChange();

    return () => {
      unsubscribe();
    };
  }, []);

  const getRandomDelay = () => {
    const minDelay = 100; // Minimum delay in milliseconds
    const maxDelay = 200; // Maximum delay in milliseconds
    return Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
  };

  useEffect(() => {
    const currentUserEmail = getEmailOfCurrentUser();
    if (currentUserEmail) {
      getFieldValueByEmail(currentUserEmail);
      setEmail(currentUserEmail)
    }
  }, []);


  const getFieldValueByEmail = async (email) => {
    try {
      const accountDocRef = doc(firestore, 'accounts', email);

      onSnapshot(accountDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const fieldType = data.type;
          const fieldName = data.name;

          if (data.active === true) {
            setType(fieldType);
            dispatch(setLoginAccountType(fieldType));
            // console.log('Account Type: ', fieldType);
            dispatch(setLoginName(fieldName));
            const delay = getRandomDelay();
            // setTimeout(() => {
            // navigation.replace(fieldType);
            // navigate(`/top`)
            // }, delay);
          }
          else {
            signOut(auth)
              .then(() => {
                // navigation.navigate('Login');
                navigate('/Login');
              })
              .catch((error) => {
                console.error('Error signing out:', error);
              });
          }
        } else {
          // Handle the case where the document does not exist
        }
      });
    } catch (error) {
      console.error('Error fetching field value:', error);
    }

  };

  const ProtectedRoute = ({ loginAccountType, allowedAccountTypes, redirectTo, children }) => {
    return allowedAccountTypes.includes(loginAccountType) ? children : <Navigate to={redirectTo} replace />;
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


    // <Drawer.Navigator
    //   // useLegacyImplementation
    //   screenOptions={{
    //     headerShown: false,
    //     drawerStyle: { backgroundColor: '#7B9CFF' },
    //     drawerContentOptions: {
    //       activeTintColor: '#7B9CFF',
    //       inactiveTintColor: '#7B9CFF',
    //       activeLabelStyle: { color: '#7B9CFF' },
    //       inactiveLabelStyle: { color: '#7B9CFF' },
    //     },
    //   }}
    // >

    //   <Drawer.Screen
    //     name="CHAT MESSAGES"
    //     component={() => (
    //       <LazyScreen importFunc={() => import('./DevAdminComponents/ChatMessages')} />
    //     )}
    //     options={{ unmountOnBlur: true }}
    //   />
    // <Drawer.Screen
    //   name="LOGS"
    //   component={() => (
    //     <LazyScreen importFunc={() => import('./DevAdminComponents/Logs')} />
    //   )}
    //   options={{ unmountOnBlur: true }}
    // />

    //   <Drawer.Screen
    //     name="FREIGHT"
    //     component={() => (
    //       <LazyScreen importFunc={() => import('./DevAdminComponents/Freight')} />
    //     )}
    //     options={{ unmountOnBlur: true }}
    //   />
    //   <Drawer.Screen
    //     name="VEHICLE LIST"
    //     component={() => (
    //       <LazyScreen importFunc={() => import('./DevAdminComponents/VehicleList')} />
    //     )}
    //     options={{ unmountOnBlur: true }}
    //   />
    //   <Drawer.Screen
    //     name="ACCOUNT LIST"
    //     component={() => (
    //       <LazyScreen importFunc={() => import('./DevAdminComponents/AccountList')} />
    //     )}
    //     options={{ unmountOnBlur: true }}
    //   />

    //   <Drawer.Screen
    //     name="ADD NEW VEHICLE"
    //     component={() => (
    //       <LazyScreen importFunc={() => import('./DevAdminComponents/AddVehicle')} />
    //     )}
    //     options={{ unmountOnBlur: true }}
    //   />
    //   <Drawer.Screen
    //     name="ADD C-HUB ACCOUNT"
    //     component={() => (
    //       <LazyScreen importFunc={() => import('./DevAdminComponents/AddAccount')} />
    //     )}
    //     options={{ unmountOnBlur: true }}
    //   />
    // </Drawer.Navigator>

    // <StackNavigator.Navigator screenOptions={{ headerShown: false }}>

    //   <StackNavigator.Screen name="CHAT MESSAGES" component={ChatMessagesComponent} />
    //   <StackNavigator.Screen name="FREIGHT" component={FreightComponent} />
    //   <StackNavigator.Screen name="ADD NEW VEHICLE" component={AddVehicleComponent} />
    //   <StackNavigator.Screen name="LOGS" component={LogsComponent} />
    //   <StackNavigator.Screen name="VEHICLE LIST" component={VehicleListComponent} />
    //   <StackNavigator.Screen name="ACCOUNT LIST" component={AccountListComponent} />
    //   <StackNavigator.Screen name="ADD C-HUB ACCOUNT" component={AddAccountComponent} />

    // </StackNavigator.Navigator>
    <NativeBaseProvider>
      <Routes>
        <Route path="*" element={<Navigate to="chat-messages" replace />} />
        <Route path="chat-messages" element={<ChatMessages />} />
        <Route path="chat-messages/:chatId" element={<ChatMessages />} />
        <Route path="freight" element={<FreightComponent />} />
        <Route path="add-new-vehicle" element={<AddVehicleComponent />} />
        <Route path="logs" element={<LogsComponent />} />
        <Route path="vehicle-list" element={<VehicleListComponent />} />
        <Route path="account-list" element={<AccountListComponent />} />
        <Route path="add-c-hub-account" element={<AddAccountComponent />} />
        {/* Add additional nested routes as needed */}
      </Routes>
    </NativeBaseProvider>
    // <Drawer.Navigator useLegacyImplementation screenOptions={{
    //   headerShown: false,
    //   drawerStyle: { backgroundColor: '#D0DCFF' },
    //   drawerContentOptions: {
    //     activeTintColor: 'white',
    //     inactiveTintColor: 'white',
    //     activeLabelStyle: { color: 'white' },
    //     inactiveLabelStyle: { color: 'white' }
    //   }
    // }} >  
    //        <Drawer.Screen name="ADD NEW VEHICLE" component={AddVehicle} />
    //   <Drawer.Screen name="VEHICLE LIST" component={VehicleList} />

    //   <Drawer.Screen name="ACCOUNT LIST" component={AccountList} />
    //   <Drawer.Screen name="LOGS" component={Logs} />
    //   <Drawer.Screen name="ADD C-HUB ACCOUNT" component={AddAccount} />


    // </Drawer.Navigator>


    //  <NativeBaseProvider>
    //       <StackNavigator.Navigator options={{ headerShown: false }}>
    //         <StackNavigator.Screen options={{ headerShown: false }} name="AccountList" component={AccountList} />
    //         <StackNavigator.Screen options={{ headerShown: false }} name="Logs" component={Logs} />
    //         <StackNavigator.Screen options={{ headerShown: false }} name="AddAccount" component={AddAccount} />

    //       </StackNavigator.Navigator>

    //     </NativeBaseProvider>

  );
}



