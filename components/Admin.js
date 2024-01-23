import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Input, Icon, Stack, Pressable, Center, NativeBaseProvider, Button, Box, HStack, Image } from "native-base";
import { signOut  } from 'firebase/auth';
import { app, db, getFirestore, collection, addDoc, doc, setDoc, getDoc, auth } from '../firebasecontrol'
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/core'



export default function SuperAdmin() {

  const [show, setShow] = React.useState(false);
  const navigation = useNavigation()
  
  // const logo = require('./assets/RMJ C-Hub 制御ハブ.png');
  const handleSignOut = () => {
    signOut(auth).then(() => {
        navigation.navigate('Login');
    }).catch((error) => {
      // An error happened.
    });

  }

  return (
    <NativeBaseProvider>

      <Box bgColor='#7b9cff' w='100%' h='100%'>
        <Center flex={1}>

          <Center px="3"  >


            <Button onPress={handleSignOut}>Signout</Button>

            {/* <Box w={[300, 400, 550]} h={[94, 125, 172]}>
              <Image source={{
                uri: logo
              }} resizeMode='stretch' alt="Real Motor Japan Control Hub" style={{ flex: 1,}} />
            </Box> */}
            

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
