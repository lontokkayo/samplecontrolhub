const React = require('react');
const { useState, useEffect } = require('react');
const { View, TouchableOpacity, Text, StyleSheet, Dimensions } = require('react-native');
const {
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
} = require("native-base");
const { getAuth, getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, onSnapshot } = require('./firebasecontrol');
const { signInWithEmailAndPassword } = require('firebase/auth');
const { MaterialIcons } = require("@expo/vector-icons");
const { NavigationContainer } = require('@react-navigation/native');
const { createNativeStackNavigator } = require('@react-navigation/native-stack');
const LoginPage = require('./components/LoginPage');
const Top = require('./components/Top');
const Admin = require('./components/Admin'); // Assuming Admin is different from Top
const Checkpoint = require('./components/Checkpoint');
const ResetPassword = require('./components/ResetPassword');
const ResetPasswordSuccess = require('./components/ResetPasswordSuccess');
require('./style.css');
const { Provider } = require('react-redux');
const store = require('./components/DevAdminComponents/redux/store');
const { HashRouter: Router, Route, Routes, Navigate } = require('react-router-dom');

// Initialize Firebase Auth
const firebase = require('./firebasecontrol'); // Adjust the path to your firebase setup file
const auth = getAuth(firebase);

const App_SSR = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

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
};

module.exports = App_SSR;
