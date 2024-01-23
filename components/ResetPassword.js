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
import { app, db, getFirestore, collection, addDoc, doc, setDoc, getAuth, auth } from '../firebasecontrol'
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail, confirmPasswordReset  } from 'firebase/auth';
import { MaterialIcons } from "@expo/vector-icons";
const { width, height } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;






export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [emailCredential, setEmailCredential] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = React.useState(false);
  const [errorShow, setErrorShow] = React.useState(false);
  const [resetShow, setResetShow] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const logo = require('../assets/RMJ C-Hub 制御ハブ.png');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Checkpoint")
      }
      
    })

    return unsubscribe
  }, []) 


  const ErrorLoginShow = () => {
    return <Box w="100%" alignItems="center">
            <PresenceTransition visible={errorShow} initial={{
            opacity: 0,
            scale: 0,
          }} animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 200
            }
          }} >
        {/* <Collapse isOpen={errorShow}> */}
          <Alert maxW="400" status="error">
            <VStack space={1} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="md" fontWeight="medium" _dark={{
                  color: "coolGray.800"
                }}>
                    {errorTitle}
                  </Text>
                </HStack>
              </HStack>
              <Box pl="6" _dark={{
              _text: {
                color: "coolGray.600"
              }
            }}>
                {errorMessage}
              </Box>
            </VStack>
          </Alert>
        {/* </Collapse> */}
        </PresenceTransition>
 
      </Box>;
  
};



  const handleReturnLogin = () => {
    navigation.navigate('Login');
  };

   const handleEmailOnChangeText = (text) => {
    setEmail(text) 
    setErrorShow(false)
  };

  const handleReset = () => {
    setIsLoading(true);
    setIsDisabled(true);
    setErrorShow(false);
    sendPasswordResetEmail(auth, email)
    .then((re)=> {
      console.log(re);
      navigation.navigate('ResetPasswordSuccess');
    
    })
    .catch((error) =>{
      setIsLoading(false);
      setIsDisabled(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      setErrorShow(true);
      if (errorCode === 'auth/missing-email') {
        console.log('Please enter an email.☹️');
        setErrorTitle('Email is empty!');
        setErrorMessage('Please enter an email.☹️');
        <ErrorLoginShow/>
      }
      else if (errorCode === 'auth/invalid-email') {
        console.log('Email is invalid. ☹️');
        setErrorTitle('Invalid email!');
        setErrorMessage('Please enter a valid email. ☹️');
         <ErrorLoginShow/>
      } 
      else if (errorCode === 'auth/user-not-found') {
        console.log('Please use an existing email. ☹️');
        setErrorTitle('User not found!');
        setErrorMessage('Please use an existing email. ☹️');
         <ErrorLoginShow/>
      }       else if (errorCode === 'auth/too-many-requests') {
        console.log('Too many requests detected, please try again later. ☹️');
        setErrorTitle('Too many requests!');
        setErrorMessage('Too many requests detected, please try again later. ☹️');
         <ErrorLoginShow/>
      } 
    })
  };
  
  return (
    <NativeBaseProvider>

      <Box bgColor='#7b9cff' w='100%' h='100%'>
      <ErrorLoginShow/>
        <Center flex={1}>
          <Center px="3">
            <Box w={[300, 400, 550]} h={[94, 125, 172]}>
              <Image source={{
                uri: logo
              }} resizeMode='stretch' alt="Real Motor Japan Control Hub" style={{ flex: 1, }} />
            </Box>
            {/* <LoginForm /> */}
            <Stack space={4} w="100%" alignItems="center">

    <Input w={{
      base: "90%",
      md: "90%",
      sm: "90%", 
    }} value={email} onSubmitEditing={handleReset} onChangeText={handleEmailOnChangeText} fontSize='16' InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="white" />} placeholder="Email" placeholderTextColor='white' color='white' />

    <HStack space={1} justifyContent="center">
      <Button _hover={{ bgColor: 'danger.900', }} _pressed={{ bgColor: 'danger.900', }} _focus={{ bgColor: 'danger.900', }} bgColor='danger.600' size="lg" borderWidth='1' borderColor='white' w={{
        base: 130,
        md: 130,
        sm: 130,
      }} onPress={handleReset} disabled={isDisabled}>{isLoading ? <Spinner color="white" size={16}  />:<Text style={{color: 'white',}}>Reset Password</Text>}</Button>
      <Button _hover={{ bgColor: '#537EFC', }} _pressed={{ bgColor: '#537EFC', }} _focus={{ bgColor: '#537EFC', }} bgColor='#7b9cff' size="lg" borderWidth='1' borderColor='white' w={{
        base: 130,
        md: 130,
        sm: 130,
      }} onPress={handleReturnLogin}><Text style={{color: 'white',}}>Return to Login</Text></Button>

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
