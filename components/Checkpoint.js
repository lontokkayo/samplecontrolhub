import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/core'
import { app, db, getFirestore, collection, addDoc, doc, setDoc, auth, getDoc, onSnapshot } from '../firebasecontrol'
import { signOut, onAuthStateChanged, reload, getAuth } from 'firebase/auth';
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import {
  // setModelData,
  setLoginEmail,
  setLoginName
} from './DevAdminComponents/redux/store'

const { width, height } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;
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






export default function Checkpoint() {
  const dispatch = useDispatch();
  const loginEmail = useSelector((state) => state.loginEmail);
  const loginName = useSelector((state) => state.loginName);
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [emailCredential, setEmailCredential] = React.useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = React.useState(false);
  const [errorShow, setErrorShow] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const logo = require('../assets/RMJ C-Hub 制御ハブ.png');

  const navigation = useNavigation()


  // const handleDocumentChange = (snapshot) => {
  //   if (!snapshot.exists()) {
  //     signOut(auth)
  //       .then(() => {
  //         navigation.navigate('Login');
  //       })
  //       .catch((error) => {
  //         console.error('Error signing out:', error);
  //       });
  //   }
  // };


  const handleDocumentChange = (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      const isActive = data.active;

      if (!isActive) {
        signOut(auth)
          .then(() => {
            navigation.navigate('Login');
          })
          .catch((error) => {
            console.error('Error signing out:', error);
          });
      }
    } else {
      signOut(auth)
        .then(() => {
          navigation.navigate('Login');
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
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToFieldChange();

    return () => {
      unsubscribe();
    };
  }, []);



  useEffect(() => {
    const currentUserEmail = getEmailOfCurrentUser();
    if (currentUserEmail) {
      getFieldValueByEmail(currentUserEmail);
      setEmail(currentUserEmail)
    }
  }, []);

  const getRandomDelay = () => {
    const minDelay = 100; // Minimum delay in milliseconds
    const maxDelay = 200; // Maximum delay in milliseconds
    return Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
  };

  const getFieldValueByEmail = async (email) => {
    try {
      const accountDocRef = doc(firestore, 'accounts', email);
      
      onSnapshot(accountDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const fieldType = data.type;
          const fieldName = data.name;
          
          if(data.active === true){
            setType(fieldType);
            dispatch(setLoginName(fieldName));
            const delay = getRandomDelay();
            // setTimeout(() => {
              navigation.replace(fieldType);
            // }, delay);
          }
          else{
            signOut(auth)
            .then(() => {
              navigation.navigate('Login');
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

  // const getFieldValueByEmail = (email, navigation) => {


  //   try {
  //     const accountDocRef = doc(firestore, 'accounts', email);
  //     const unsubscribe = onSnapshot(accountDocRef, (accountDocSnapshot) => {
  //       if (accountDocSnapshot.exists()) {
  //         const data = accountDocSnapshot.data();
  //         const fieldType = data.type;
  //         const fieldName = data.name;

  //         if (data.active === true) {
  //           dispatch(setLoginName(fieldName));
  //           const delay = getRandomDelay();
  //           setTimeout(() => {
  //             navigation.replace(fieldType);
  //           }, delay);
  //         } else {
  //           signOut(auth)
  //             .then(() => {
  //               navigation.navigate('Login');
  //             })
  //             .catch((error) => {
  //               console.error('Error signing out:', error);
  //             });
  //         }
  //       } else {
  //         console.log('Document does not exist');
  //       }
  //     });

  //     // Return the unsubscribe function to stop listening when necessary
  //     return unsubscribe;
  //   } catch (error) {
  //     console.error('Error fetching field value:', error);
  //   }
  // };




  return (

    <NativeBaseProvider>

      <Box bgColor='#7b9cff' w='100%' h='100%'>

        <Center flex={1}>
          <Center px="3">
            <Box w={[300, 400, 550]} h={[94, 125, 172]}>
              <Image source={{
                uri: logo
              }} resizeMode='stretch' alt="Real Motor Japan Control Hub" style={{ flex: 1, }} />
            </Box>
            {/* <LoginForm /> */}

            <Stack space={4} w="100%" alignItems="center">
              <HStack space={1} justifyContent="center">
                <Spinner color='white' size='lg' />
              </HStack>
            </Stack>

          </Center>


        </Center>


      </Box>
    </NativeBaseProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
