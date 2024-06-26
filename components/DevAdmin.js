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

import AddAccount from './DevAdminComponents/AddAccount';
import Logs from './DevAdminComponents/Logs';
import AccountList from './DevAdminComponents/AccountList';
import AddVehicle from './DevAdminComponents/AddVehicle';
import VehicleList from './DevAdminComponents/VehicleList';

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


export default function DevAdmin() {

  const Drawer = createDrawerNavigator();

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
    //   <Drawer.Screen
    //     name="LOGS"
    //     component={() => (
    //       <LazyScreen importFunc={() => import('./DevAdminComponents/Logs')} />
    //     )}
    //     options={{ unmountOnBlur: true }}
    //   />

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

    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#7B9CFF' },
        drawerContentOptions: {
          activeTintColor: '#7B9CFF',
          inactiveTintColor: '#7B9CFF',
          activeLabelStyle: { color: '#7B9CFF' },
          inactiveLabelStyle: { color: '#7B9CFF' },
        },
      }}
    >
      <Drawer.Screen
        name="LOGS"
        children={LogsComponent}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="CHAT MESSAGES"
        children={ChatMessagesComponent}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="FREIGHT"
        children={FreightComponent}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="ADD NEW VEHICLE"
        children={AddVehicleComponent}
        options={{ unmountOnBlur: true }}
      />

      <Drawer.Screen
        name="VEHICLE LIST"
        children={VehicleListComponent}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="ACCOUNT LIST"
        children={AccountListComponent}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="ADD C-HUB ACCOUNT"
        children={AddAccountComponent}
        options={{ unmountOnBlur: true }}
      />
    </Drawer.Navigator>

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



