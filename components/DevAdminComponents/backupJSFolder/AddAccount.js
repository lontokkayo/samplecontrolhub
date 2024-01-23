import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Divider,
  Popover
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
  FontAwesome5Brands,
} from 'react-native-vector-icons';
import 'react-native-gesture-handler';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { signOut, onAuthStateChanged, reload, getAuth, getIdTokenResult, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { authForCreateUser } from '../../firebasecontrolCreateUser';
import { app, db, getFirestore, collection, addDoc, doc, setDoc, auth, getDoc, onSnapshot, updateDoc } from '../../firebasecontrol'
import { useNavigation } from '@react-navigation/core'
import './../style.css';
import { debounce } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import {useSelector, useDispatch } from 'react-redux';
import { setLoginName } from './redux/store';
import MobileViewDrawer from './SideDrawer/MobileViewDrawer';
import SideDrawer from './SideDrawer/SideDrawer';
let selectedScreen='ADD C-HUB ACCOUNT'

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




























export default function AddAccount() {    
  const dispatch = useDispatch();
  const loginName = useSelector((state) => state.loginName);
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const logo = require('../../assets/C-Hub.png');
  const logo2 = require('../../assets/C-Hub Logo Only.png');
  const screenWidth = Dimensions.get('window').width;
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [name, setName] = useState('');
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const [isSelectedLogs, setIsSelectedLogs] = useState(false);
  const [isSelectedAddAccount, setIsSelectedAddAccount] = useState(true);
  const [isSelectedAccountList, setIsSelectedAccountList] = useState(false);
  const [isSelected3, setIsSelected3] = useState(false);
  const [isSelected4, setIsSelected4] = useState(false);

  const [accountTypeSpAd, setAccountTypeSpAd] = useState(false);
  const [accountTypeDevAd, setAccountTypeDevAd] = useState(false);
  const [accountTypeAd, setAccountTypeAd] = useState(false);
  const [accountType3, setAccountType3] = useState(false);
  const [accountType4, setAccountType4] = useState(false);


  const [nameVerify, setNameVerify] = useState(false);
  const [emailVerify, setEmailVerify] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [confirmPasswordVerify, setConfirmPasswordVerify] = useState(false);
  const [accountTypeVerify, setAccountTypeVerify] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [emailError, setEmailError] = useState(false);
  // const [inputName, setInputName] = useState('');
  // const [inputEmail, setInputEmail] = useState('');
  // const [inputPassword, setInputPassword] = useState('');
  // const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [typeOfAccount, setTypeOfAccount] = useState('');
  const [typeOfAccountDisplay, setTypeOfAccountDisplay] = useState('');
  const [showModal, setShowModal] = useState(false);
  const inputRefs = useRef([]);


  const inputName = useRef(null);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);
  const inputConfirmPassword = useRef(null);

  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordMatchLabel, setPasswordMatchLabel] = useState(true);
  const [passwordLengthLabel, setPasswordLengthLabel] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(true);

  const [formattedTime, setFormattedTime] = useState('');

  const [time, setTime] = useState('');
  const fetchTimeRef = useRef();
  const [isIntervalActive, setIsIntervalActive] = useState(true);

  const [showNamePopover, setShowNamePopover] = useState(false);




  useEffect(() => {

  }, [isSelectedLogs, isSelectedAddAccount, isSelectedAccountList]);




  const SuccessModal = () => {
    return <Center>
      <Modal isOpen={showModal} onClose={closeModal} size="lg"  >
        <Modal.Content maxWidth="350" bgColor={'green.600'} borderWidth={3} borderColor={'green.400'}>
          <Modal.Header bgColor={'green.600'} borderBottomWidth={0}><Text textAlign={'center'} bold>😊😎 Success! 😎😊</Text></Modal.Header>
          <Modal.Body >

            <Text textAlign={'center'}>Account creation for Real Motor Japan Control Hub was successful.</Text>
          </Modal.Body>
          <Modal.Footer bgColor={'green.600'} borderTopWidth={0}>
            <Button _hover={{ bgColor: 'green.500', }} variant={'outline'} flex="1" onPress={closeModal} _text={{ color: 'black', }}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>;
  };


  useEffect(() => {
  }, [typeOfAccount]);

  const handleToggleAccountTypeSpAd = () => {
    const text = 'superadmin';
    setAccountTypeSpAd(true);

    setAccountTypeDevAd(false);
    setAccountTypeAd(false);
    setAccountType3(false);
    setAccountType4(false);
    setTypeOfAccount(text);
    setTypeOfAccountDisplay('Super Admin');
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigation.navigate("Login")
      }

    })

    return unsubscribe
  }, [])

  const firebaseFirestore = getFirestore();


  const addLogToCollection = async (data) => {
    try {
      const firestore = getFirestore();
      const logsCollectionRef = collection(firestore, 'logs');

      // Add a new document to the "logs" collection
      await addDoc(logsCollectionRef, data);

      console.log('Document added successfully!');
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  // useEffect(() => {
  //   const fetchTime = async () => {
  //     try {
  //       const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo');
  //       const { datetime } = response.data;
  //       const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
  //       setTime(formattedTime);
  //     } catch (error) {
  //       console.error('Error fetching time:', error);
  //     }
  //   };
  //   const interval = setInterval(fetchTime, 1000);
  //   return () => clearInterval(interval);
  // }, []);
  // useEffect(() => {
  //   const fetchTime = async () => {
  //     try {
  //       const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo');
  //       const { datetime } = response.data;
  //       const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
  //       setTime(formattedTime);
  //     } catch (error) {
  //       console.error('Error fetching time:', error);
  //     }
  //   };

  //   const interval = setInterval(() => {
  //     if (isIntervalActive) {
  //       fetchTime();
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [isIntervalActive]);

  const openModal = () => {
    setShowModal(true);
    setIsIntervalActive(false); // Pause the interval when the modal is opened
  };

  const closeModal = () => {
    setShowModal(false);
    setIsIntervalActive(true); // Resume the interval when the modal is closed
  };





  const handleAddAccount = async () => {
    setIsDisabled(true);
    setIsLoading(true);
    if (
      passwordLengthLabel === false ||
      passwordMatch === false ||
      passwordMatchLabel === false ||
      validateEmail() === false ||
      isNameEmpty === true ||
      isAccountType() === false
    ) {
      setTimeout(() => {
        // Reset loading and disabled state
        setIsLoading(false);
        setIsDisabled(false);
      }, 500);
    } else {
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, inputEmail.current?.value);
        if (signInMethods.length > 0) {
          // Email already exists
          setIsEmailDuplicate(true);
          setEmailError(false);
          validateEmail(false);
          setIsLoading(false);
          setIsDisabled(false);
          return;
        }
        const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');

        await createUserWithEmailAndPassword(authForCreateUser, inputEmail.current.value, inputPassword.current.value)
          .then((userCredential) => {

            const user = userCredential.user;



            try {

              // setTime(formattedTime);

              const customID = inputEmail.current.value; // Replace 'your-custom-id' with your desired custom ID
              const docRef = doc(db, 'accounts', customID); // Replace 'myCollection' with the name of your desired collection
              const logData = {
                message: `Account Added: "${name}" added an account for "${inputName.current?.value}" with "${typeOfAccountDisplay}" privilege.`,
                timestamp: formattedTime,
                colorScheme: true,
              };

              setDoc(docRef, {
                // Specify the data you want to add to the document
                email: inputEmail.current?.value,
                name: inputName.current?.value,
                pass: inputPassword.current?.value,
                type: typeOfAccount,
                typeDisplay: typeOfAccountDisplay,
                dateOfCreation: formattedTime,
                lastUpdatedDate: formattedTime,
                active: true,
                // ...
              });

              addLogToCollection(logData);
              console.log(logData);
              console.log(formattedTime);
              setIsLoading(false);
              setIsDisabled(false);
              handleClear();
              openModal();

              console.log('Document added with custom ID: ', customID);
            } catch (error) {
              console.error('Error adding document: ', error);
            }




            // Reset loading and disabled state



          })
          .catch((error) => {
            console.log('An error occurred during sign-up. Please try again later.');
            console.log(error);
            setIsLoading(false);
            setIsDisabled(false);
          });
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('An error occurred while checking the email existence. Please try again later.');
        // console.log(errorCode, errorMessage);
        setIsLoading(false);
        setIsDisabled(false);
      }
    }
  };

  const handleClear = () => {
    const text = '';

    inputName.current.value = "";
    inputEmail.current.value = "";
    inputPassword.current.value = "";
    inputConfirmPassword.current.value = "";
    setAccountTypeAd(false);
    setAccountTypeSpAd(false);
    setAccountTypeDevAd(false);
    setAccountType3(false);
    setAccountType4(false);
    setEmailError(false);
    setIsEmailDuplicate(false);
    setIsNameEmpty(true);

    setPasswordLengthLabel(false);
    setPasswordMatch(false);
    setPasswordMatchLabel(true);


    // setInputConfirmPassword('');
    // setInputEmail('');
    // setInputName('');
    // setInputPassword('');


  };

  const registerInputRef = (index) => (ref) => {
    inputRefs.current[index] = ref;
  };

  const handleToggleAccountTypeAd = () => {
    const text = 'admin';
    setAccountTypeAd(true);
    setAccountTypeSpAd(false);
    setAccountTypeDevAd(false);
    setAccountType3(false);
    setAccountType4(false);


    setTypeOfAccount(text);
    setTypeOfAccountDisplay('Admin');
  };

  const handleToggleAccountTypeDevAd = () => {
    const text = 'devadmin';
    setAccountTypeDevAd(true);

    setAccountTypeAd(false);
    setAccountTypeSpAd(false);
    setAccountType3(false);
    setAccountType4(false);
    setTypeOfAccountDisplay('Developer Admin');

    setTypeOfAccount(text);

  };

  const handleToggleAccountType3 = () => {
    const text = 'staff';
    setAccountType3(true);
    setAccountTypeDevAd(false);
    setAccountTypeAd(false);
    setAccountTypeSpAd(false);
    setAccountType4(false);

    setTypeOfAccount(text);

    setTypeOfAccountDisplay('Staff');
  };

  const handleToggleAccountType4 = () => {
    const text = 'booking';
    setAccountType4(true);
    setAccountType3(false);
    setAccountTypeDevAd(false);
    setAccountTypeAd(false);
    setAccountTypeSpAd(false);


    setTypeOfAccount(text);
    setTypeOfAccountDisplay('Booking');
  };

  const handleToggleLogs =  useCallback(() => {


    navigation.navigate("LOGS");
  }, []);

  const handleToggleAddAccount = useCallback(() => {

    navigation.navigate("ADD C-HUB ACCOUNT");
  }, []);

  const handleToggleAccountList = useCallback(() => {

    navigation.navigate("ACCOUNT LIST");
  }, []);

  const handleToggleAddVehicle = useCallback(() => {

    navigation.navigate("ADD NEW VEHICLE");
  }, []);

  const handleVehicleList = useCallback(() => {
    navigation.navigate("VEHICLE LIST");
  }, []);

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
      const documentId = currentUserEmail;
      listenForNameChange(documentId);
    }
  }, []);

  const listenForNameChange = (documentId) => {
    const userRef = doc(db, 'accounts', documentId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const name = doc.data().name;
        const type = doc.data().type;
        setName(name);
        setType(type);
        // Perform any necessary actions with the name value
      } else {
        console.log('Document does not exist');
      }
    });

    // To stop listening for updates, you can call unsubscribe()
    // unsubscribe();
  };



  const getFieldValueByEmail = async (email) => {
    try {
      const accountDocRef = doc(firestore, 'accounts', email);
      const accountDocSnapshot = await getDoc(accountDocRef);

      if (accountDocSnapshot.exists()) {
        const data = accountDocSnapshot.data();
        const fieldType = data.type;
        const fieldName = data.name;

      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching field value:', error);
    }
  };


  const handlePasswordChange = () => {
    // const inputPasswordValue = inputPassword.current?.value;
    // const inputConfirmPasswordValue = inputConfirmPassword.current?.value;
    // const inputPasswordValueLength = inputPasswordValue ? inputPasswordValue.length : 0;

    // setPasswordMatch(
    //   inputPasswordValue === inputConfirmPasswordValue && inputPasswordValueLength >= 6
    // );
    // setPasswordMatchLabel(inputPasswordValue === inputConfirmPasswordValue);
    // setPasswordLengthLabel(inputPasswordValueLength >= 6);
    handlePasswordStatus();
  };

  const handleConfirmPasswordChange = () => {
    const inputPasswordValue = inputPassword.current?.value;
    const inputConfirmPasswordValue = inputConfirmPassword.current?.value;
    const inputPasswordValueLength = inputPasswordValue ? inputPasswordValue.length : 0;

    setPasswordMatch(
      inputPasswordValue === inputConfirmPasswordValue && inputPasswordValueLength >= 6
    );
    setPasswordMatchLabel(inputPasswordValue === inputConfirmPasswordValue);
  };


  const handlePasswordStatus = () => {
    const inputPasswordValue = inputPassword.current?.value;
    const inputConfirmPasswordValue = inputConfirmPassword.current?.value;
    const inputPasswordValueLength = inputPasswordValue ? inputPasswordValue.length : 0;

    setPasswordMatch(
      inputPasswordValue === inputConfirmPasswordValue && inputPasswordValueLength >= 6
    );
    setPasswordMatchLabel(inputPasswordValue === inputConfirmPasswordValue);
    setPasswordLengthLabel(inputPasswordValueLength >= 6);

  };

  // const isPasswordMatch = () => {
  //   const inputPasswordValue = inputPassword.current?.value;
  //   const inputConfirmPasswordValue = inputConfirmPassword.current?.value;
  //   const inputPasswordValueLength = inputPasswordValue ? inputPasswordValue.length : 0;

  //   return (
  //     inputPasswordValue === inputConfirmPasswordValue &&
  //     inputPasswordValueLength >= 6
  //   );
  // };

  const isAccountType = () => {
    return accountTypeDevAd || accountTypeSpAd || accountTypeAd || accountType3 || accountType4 === true;
  };

  // const isPasswordMatchLabel = () => {
  //   const inputPasswordValue = inputPassword.current?.value;
  //   const inputPasswordValueLength = inputPasswordValue ? inputPasswordValue.length : 0;
  //   return inputPassword.current?.value === inputConfirmPassword.current?.value;
  // };

  // const isPasswordLengthLabel = () => {
  //   const inputPasswordValue = inputPassword.current?.value;
  //   const inputPasswordValueLength = inputPasswordValue ? inputPasswordValue.length : 0;
  //   return inputPasswordValueLength >= 6;
  // };


  const handleEmailChange = () => {
    setIsEmailDuplicate(false);
    handleEmailSubmit();
  };

  const handleNameChange = () => {
    setIsNameEmpty(inputName.current?.value === '')
  };


  const validateEmail = () => {
    const emailValue = inputEmail.current?.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(emailValue);

    return isValid;
  };

  const handleEmailSubmit = (value) => {
    setEmailError(validateEmail(value));

    if (emailError) {
      // console.log(emailError);
      // setEmailError(validateEmail());
    } else {

    }
  };


  const handleSignOut = () => {

    signOut(auth).then(() => {
      navigation.navigate('Login');
      setEmail('');
      setName('');
    }).catch((error) => {
      // An error happened.
    });


  };

  useEffect(() => {
    const handleScreenResize = () => {
      const screenWidth = Dimensions.get('window').width;
      setIsMobileView(screenWidth < 1200);
    };

    // Initial check on component mount
    handleScreenResize();

    // Listen for screen dimension changes
    Dimensions.addEventListener('change', handleScreenResize);

    // Cleanup event listener on component unmount
    return () => {
      Dimensions.removeEventListener('change', handleScreenResize);
    };
  }, []);

  const sidebarListData = [{
    title: "VEHICLE INFORMATION INPUT",
    data: ["Add New Vehicle", "Vehicle List",]
  },];

  const showDrawerIcon = useBreakpointValue([true, true, true, false]);

  const showPopover = () => {
    setShowNamePopover(true);
  };

  // Function to hide the Popover
  const hidePopover = () => {
    setShowNamePopover(false);
  };
  const NamePopover = ({ name, handleSignOut }) => {
    const [showNamePopover, setShowNamePopover] = useState(false);

    const showPopover = () => {
      setShowNamePopover(!showNamePopover);
    };

    return (
      <Box w={[100, 200, 1020]} h={[10, 10, 10]} flex={1}>
        <Flex direction="row-reverse">
          <Popover
            isOpen={showNamePopover}
            trigger={(triggerProps) => (
              <Text color="white" marginTop={[2, 2, 2]} fontSize={[17, 18, 20]} marginRight={[1, 3, 5]} {...triggerProps} onPress={showPopover}>
                <MaterialCommunityIcons name="account" size={[20, 25, 30]} color="white" /> {name} <Ionicons name="caret-down" size={16} color="white" />
              </Text>
            )}
            onClose={() => setShowNamePopover(!showNamePopover)}
            placement='bottom right'
            trapFocus={false}
          >
            <Popover.Content backgroundColor={'#7B9CFF'}>
              {/* <Popover.Arrow bgColor={'#7B9CFF'} /> */}
              <Popover.Body backgroundColor={'#7B9CFF'}>
                <Button _hover={{ bgColor: 'blueGray.500' }} onPress={handleSignOut} leftIcon={<MaterialCommunityIcons name="logout" size={20} color="white" />} bgColor={'transparent'}>
                  Logout
                </Button>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </Flex>
      </Box>
    );
  };
  return (
    <NativeBaseProvider>
      <SuccessModal />
      <Box bgColor="#A6BCFE" h="100vh" w="full" flexDirection="column">
        {/* Header */}
        <Box
          px="3"
          bgColor='#7b9cff'
          height={54}
          position="sticky"
          top={0}
          zIndex={999}
          flexDirection="row"
          alignItems="center"
          borderBottomWidth={2}
          borderBottomColor={'cyan.500'}

        >

          <Box w={[0, 0, 0, 850]} h={[10, 10, 10, 10]} marginBottom={1.5} marginTop={1.5}>
            <Image
              source={{
                uri: logo
              }}
              resizeMode="stretch"
              alt="Real Motor Japan Control Hub"
              style={{ flex: 1 }}
            />
          </Box>

          {showDrawerIcon && <MobileViewDrawer
            handleToggleAddVehicle={handleToggleAddVehicle}
            handleVehicleList={handleVehicleList}
            handleToggleLogs={handleToggleLogs}
            handleToggleAddAccount={handleToggleAddAccount}
            handleToggleAccountList={handleToggleAccountList}
            selectedScreen={selectedScreen}
          />}


          <Box w={[150, 200, 250, 0]} h={[6, 8, 10, 10]} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]}>

            <Image
              source={{
                uri: logo2
              }}
              resizeMode="stretch"
              alt="Real Motor Japan Control Hub"
              style={{ flex: 1 }}
            />
          </Box>
          <NamePopover name={loginName} handleSignOut={handleSignOut} />


        </Box>

        {/* Content */}
        <Box flex={[1]} flexDirection="row" >
          {/* Sidebar */}
          <SideDrawer
                        selectedScreen={selectedScreen}
                    />

          {/* Main Content */}
          <Box flex={1} flexGrow={1} minHeight={0}>
            {/* Main Content Content */}
            <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }}>

              {/* <AddAccount/> */}

              <Box px="3" bgColor="#A6BCFE" height="full" >


                <Box bgColor='#A6BCFE' w='100%' h='100%' margin={1}>
                  <Center flex={1}>
                    <Center px="3">


                      <Stack space={4} w="100%" alignItems="center">
                        <Text marginTop={5} marginBottom={1} fontSize={[12, 14, 16]} color={'white'} bold={'center'}>ADD ACCOUNT FOR REAL MOTOR JAPAN CONTROL HUB</Text>
                        <Input w={{
                          base: "90%",
                          md: "90%",
                          sm: "90%",
                        }} ref={inputName} onSubmitEditing={handleAddAccount} onChangeText={handleNameChange} borderColor={'white'} borderBottomColor={!isNameEmpty ? 'green.300' : 'red.500'} borderBottomWidth={2} fontSize='16' InputLeftElement={<Icon as={<AntDesign name="idcard" />} size={5} ml="2" color="white" />} placeholder="Name" placeholderTextColor='white' color='white' />
                        <Input w={{
                          base: "90%",
                          md: "90%",
                          sm: "90%",
                        }} ref={inputEmail} onChangeText={handleEmailChange} onSubmitEditing={handleAddAccount} color={!isEmailDuplicate ? 'white' : 'red.500'} borderColor={'white'} borderBottomColor={validateEmail() ? 'green.300' : 'red.500'} borderBottomWidth={2} fontSize='16' InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="white" />} placeholder="Email" placeholderTextColor='white' />


                        <Input w={{
                          base: "90%",
                          md: "90%",
                          sm: "90%",
                        }} ref={inputPassword} onSubmitEditing={handleAddAccount} borderBottomColor={passwordLengthLabel ? 'green.300' : 'red.500'} borderBottomWidth={2} onChangeText={handlePasswordChange} fontSize='16' borderColor={'white'} type={show ? "text" : "password"} InputLeftElement={<Icon as={<FontAwesome name={show ? "unlock-alt" : "lock"} />} size={5} ml="2" color="white" />} InputRightElement={<Pressable onPress={() => setShow(!show)} >
                          <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="white" />
                        </Pressable>} placeholder="Password" placeholderTextColor='gray' color='white' />
                        <Input w={{
                          base: "90%",
                          md: "90%",
                          sm: "90%",
                        }} ref={inputConfirmPassword} onSubmitEditing={handleAddAccount} borderBottomColor={passwordMatch ? 'green.300' : 'red.500'} borderBottomWidth={2} onChangeText={handleConfirmPasswordChange} fontSize='16' borderColor={'white'} type={show2 ? "text" : "password"} InputLeftElement={<Icon as={<FontAwesome name={show2 ? "unlock-alt" : "lock"} />} size={5} ml="2" color="white" />} InputRightElement={<Pressable onPress={() => setShow2(!show2)}>
                          <Icon as={<MaterialIcons name={show2 ? "visibility" : "visibility-off"} />} size={5} mr="2" color="white" />
                        </Pressable>} placeholder="Confirm Password" placeholderTextColor='white' color='white' />
                        {!validateEmail() && (
                          <Text fontSize={[12, 14, 16]} color={'#D22730'} bold>Invalid Email!</Text>
                        )}
                        {isEmailDuplicate && (
                          <Text fontSize={[12, 14, 16]} color={'#D22730'} bold>Email already in use! Please use a different email!</Text>
                        )}
                        {!passwordLengthLabel && (
                          <Text fontSize={[12, 14, 16]} color={'#D22730'} bold>Password must be at least 6 characters or above!</Text>
                        )}
                        {!passwordMatchLabel && (
                          <Text fontSize={[12, 14, 16]} color={'#D22730'} bold>Passwords do not match!</Text>
                        )}

                        <Text fontSize={16} color={'white'} bold>ACCOUNT TYPE:                                                             </Text>
                        <Box borderColor={isAccountType() ? 'green.300' : 'red.500'} borderWidth={2}>
                          <HStack space={1} justifyContent="center" >
                            <Button _hover={{ bgColor: accountType4 ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                              base: 90,
                              md: 90,
                              sm: 90,
                            }} onPress={handleToggleAccountType4} bgColor={accountType4 ? '#0642F4' : '#CED5EA'} ><Text style={{ color: 'white', }}>Booking</Text></Button>
                            <Button _hover={{ bgColor: accountType3 ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                              base: 90,
                              md: 90,
                              sm: 90,
                            }} onPress={handleToggleAccountType3} bgColor={accountType3 ? '#0642F4' : '#CED5EA'}  ><Text style={{ color: 'white', }}>Staff</Text></Button>
                            <Button _hover={{ bgColor: accountTypeAd ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                              base: 90,
                              md: 90,
                              sm: 90,
                            }} onPress={handleToggleAccountTypeAd} bgColor={accountTypeAd ? '#0642F4' : '#CED5EA'}  ><Text style={{ color: 'white', }}>Admin</Text></Button>
                            <Button _hover={{ bgColor: accountTypeSpAd ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                              base: 90,
                              md: 90,
                              sm: 90,
                            }} onPress={handleToggleAccountTypeSpAd} bgColor={accountTypeSpAd ? '#0642F4' : '#CED5EA'} ><Text style={{ color: 'white', }}>Super Admin</Text></Button>

                          </HStack>
                          <HStack space={1} justifyContent="center" marginTop={1}>
                            <Button _hover={{ bgColor: accountTypeDevAd ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                              base: 90,
                              md: 90,
                              sm: 90,
                            }} onPress={handleToggleAccountTypeDevAd} bgColor={accountTypeDevAd ? '#0642F4' : '#CED5EA'} ><Text style={{ color: 'white', }}>Dev Admin</Text></Button>
                          </HStack>
                        </Box>
                        <HStack space={1} justifyContent="center" marginBottom={5}>
                          <Button _hover={{ bgColor: '#D9D9D9', }} _pressed={{ bgColor: '#D9D9D9', }} _focus={{ bgColor: '#D9D9D9', }} bgColor='warmGray.200' size="lg" borderWidth='1' borderColor='white' w={{
                            base: 130,
                            md: 130,
                            sm: 130,
                          }} onPress={handleClear} ><Text style={{ color: 'gray', }}>Clear</Text></Button>
                          <Button _hover={{ bgColor: '#537EFC', }} _pressed={{ bgColor: '#537EFC', }} _focus={{ bgColor: '#537EFC', }} bgColor='#7b9cff' size="lg" borderWidth='1' borderColor='white' w={{
                            base: 130,
                            md: 130,
                            sm: 130,
                          }} onPress={handleAddAccount} disabled={isDisabled}>{isLoading ? <Spinner color="white" size={16} /> : <Text style={{ color: 'white', }}>Add Acccount</Text>}</Button>

                        </HStack>


                      </Stack>

                    </Center>


                  </Center>


                </Box>

              </Box>

            </ScrollView>
          </Box>
        </Box>
      </Box>
    </NativeBaseProvider>


  );
}



