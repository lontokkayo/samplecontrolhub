import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  NativeBaseProvider,
  Popover,
  Pressable,
  Spinner,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
  TextArea,
  InputRightAddon,
  InputGroup,
  InputLeftAddon,
  Select,
  CheckIcon,
  PresenceTransition,
  CloseIcon,
  ScrollView,
  Divider,
  useDisclosure,
  useDisclose,
  FlatList,
  FormControl,
  Checkbox,
} from 'native-base';
import React, { useEffect, useRef, useState, useMemo, useCallback, useReducer } from 'react';
import { Dimensions, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View, PanResponder, Animated, InputAccessoryView } from 'react-native';
import 'react-native-gesture-handler';
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  EvilIcons
} from 'react-native-vector-icons';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { authForCreateUser } from '../../firebasecontrolCreateUser';
import './../style.css';
import { projectControlFirestore, projectControlAuth, projectExtensionFirestore, projectExtensionAuth, projectControlFirebase, projectExtensionFirebase } from "../../crossFirebase";
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DragSortableView, AutoDragSortableView, AnySizeDragSortableView } from "react-native-drag-sort";
import DraggableFlatList from "react-native-draggable-flatlist";
import SelectDropdown from 'react-native-select-dropdown';
import MobileViewDrawer from './SideDrawer/MobileViewDrawer';
import SideDrawer from './SideDrawer/SideDrawer';

const { width, height } = Dimensions.get('window');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const parentWidth = width - 18;
const childrenWidth = 76;
const childrenHeight = 76;
const marginChildrenTop = 7;
const marginChildrenBottom = 0;
const marginChildrenLeft = 0;
const marginChildrenRight = 7;

let selectedScreen = 'VEHICLE LIST'

const firestore = getFirestore();
const getEmailOfCurrentUser = () => {
  const user = projectControlAuth.currentUser;
  if (user) {
    const email = user.email;
    return email;
  } else {
    console.log('No user is currently authenticated');
    return null;
  }
};

// const Drawer = createDrawerNavigator();


const storage = getStorage(projectExtensionFirebase);

export default function VehicleList() {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const logo = require('../../assets/C-Hub.png');
  const logo2 = require('../../assets/C-Hub Logo Only.png');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [name, setName] = useState('');
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const [isSelectedLogs, setIsSelectedLogs] = useState(false);
  const [isSelectedAddAccount, setIsSelectedAddAccount] = useState(false);
  const [isSelectedAccountList, setIsSelectedAccountList] = useState(false);
  const [isSelectedAddVehicle, setIsSelectedAddVehicle] = useState(false);
  const [isSelectedVehicleList, setIsSelectedVehicleList] = useState(true);




  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [typeOfAccount, setTypeOfAccount] = useState('');
  const [typeOfAccountDisplay, setTypeOfAccountDisplay] = useState('');
  const [showModal, setShowModal] = React.useState(false);
  const inputRefs = useRef([]);



  const [formattedTime, setFormattedTime] = useState('');

  const [time, setTime] = useState('');
  const [isIntervalActive, setIsIntervalActive] = useState(true);

  const [showNamePopover, setShowNamePopover] = useState(false);

  const [IsAddPhotoVisible, setIsAddPhotoVisible] = useState(true);


  const [selectedImages, setSelectedImages] = useState([]);

  const [widthState, setWidthState] = useState(Dimensions.get('window').width);
  const [currentYear, setCurrentYear] = useState(null);









  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(projectControlFirestore, 'currency', 'currency'),
      (snapshot) => {
        const data = snapshot.data();
        setJpyToUsd(data?.jpyToUsd);
        setUsdToJpy(data?.usdToJpy);
      }
    );

    return () => unsubscribe();
  }, []);




  const handleImageSelection = async () => {
    const options = {
      mediaType: 'photo',
      // quality: 0,
      maxWidth: 1000,
      maxHeight: 1000,
      selectionLimit: 40,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      } else if (!response.assets || response.assets.length === 0) {
        console.log('No images selected.');
        return;
      }

      // Remove duplicates from the selected images
      const uniqueImages = response.assets.filter(
        (asset, index, self) => index === self.findIndex((a) => a.uri === asset.uri)
      );

      // Filter out images larger than 10MB
      const filteredImages = [];
      const imageOrder = [];
      for (let index = 0; index < uniqueImages.length; index++) {
        const image = uniqueImages[index];
        const file = await fetch(image.uri).then((res) => res.blob());
        const fileSize = file.size;
        if (fileSize / 1024 / 1024 < 10) {
          filteredImages.push(image);
          imageOrder.push(index);
        } else {
          alert('Please select image(s) smaller than 10MB');
        }
      }


      // Sort the filtered images based on their original order
      const sortedImages = filteredImages.sort((a, b) => {
        const indexA = imageOrder[filteredImages.indexOf(a)];
        const indexB = imageOrder[filteredImages.indexOf(b)];
        return indexA - indexB;
      });



      // Limit the number of selected images to 40
      const limitedImages = sortedImages.slice(0, 40);
      setSelectedImages(limitedImages);

      if (limitedImages.length > 0) {
        setIsAddPhotoVisible(false);
        setAddAnotherImages(true);
      }

      if (limitedImages.length >= 40) {
        setIsAddPhotoVisible(false);
        setAddAnotherImages(false);
      }


    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };





  const handleDeleteImagePress = useCallback((uri) => {
    setSelectedImages((prevImages) => {
      const updatedImages = prevImages.filter((image) => image.uri !== uri);

      if (updatedImages.length < 40) {
        setAddAnotherImages(true);
      }
      if (updatedImages.length == 0) {
        setAddAnotherImages(false);
        setIsAddPhotoVisible(true);
      }
      return updatedImages;
    });
  }, []);



  const handleImageAddToSelection = async () => {
    if (selectedImages.length === 40) {
      return; // Limit reached, do not add a new image
    }

    const options = {
      mediaType: 'photo',
      // quality: 0,
      maxWidth: 1000,
      maxHeight: 1000,
      selectionLimit: 40 - selectedImages.length, // Adjust the selection limit based on the remaining slots
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      } else if (!response.assets || response.assets.length === 0) {
        console.log('No images selected.');
        return;
      }

      // Filter out images larger than 10MB
      const newImages = [...selectedImages];
      const promises = response.assets.map(async (asset) => {
        const file = await fetch(asset.uri).then((res) => res.blob());
        const fileSize = file.size;
        if (fileSize / 1024 / 1024 < 10) {
          const exists = newImages.some((image) => image.uri === asset.uri);
          if (!exists) {
            newImages.push(asset); // Add the asset to the array if it doesn't exist
          }
        } else {
          alert('Please select image(s) smaller than 10MB');
        }
      });

      await Promise.all(promises);

      const limitedImages = newImages.slice(0, 40);
      setSelectedImages(limitedImages);

      if (limitedImages.length >= 40) {
        setAddAnotherImages(false);
      }

      // limitedImages.forEach((image) => {
      //   console.log(`File size: ${image.fileSize}`);
      // });

    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };




  const uploadImages = () => {
    selectedImages.forEach((asset) => {
      uploadImage(asset);
    });
  };

  const uploadImage = async (asset) => {
    const { uri } = asset;
    const imageName = uri.substring(uri.lastIndexOf('/') + 1);

    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `images/${imageName}`);
    const snapshot = await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File available at', downloadURL);
  };





  const reloadData = useCallback(() => {
    // Perform data reloading logic here based on width or other dependencies
    // Use the existing selectedImages value and update it
    setSelectedImages(prevSelectedImages => {
      // ... Logic to reload data using prevSelectedImages and width
      return [...prevSelectedImages]; // Return the updated value of selectedImages
    });
  }, [widthState]);

  useEffect(() => {
    const handleWidthChange = ({ window }) => {
      setWidthState(window.width);
    };

    Dimensions.addEventListener('change', handleWidthChange);

    return () => {
      Dimensions.removeEventListener('change', handleWidthChange);
    };
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);


  useEffect(() => {
  }, [typeOfAccount]);




  useEffect(() => {
    const unsubscribe = projectControlAuth.onAuthStateChanged(user => {
      if (!user) {
        navigation.navigate("Login")
      }

    })

    return unsubscribe
  }, [])



  const addLogToCollection = async (data) => {
    try {
      const logsCollectionRef = collection(projectControlFirestore, 'logs');

      // Add a new document to the "logs" collection
      await addDoc(logsCollectionRef, data);

      console.log('Document added successfully!');
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };



  const logData = {
    message: `Account Added: "${name}" added an account for "${inputName}" with "${typeOfAccountDisplay}" privilege.`,
    timestamp: time,
    colorScheme: true,
  };




  const handleToggleLogs = () => {


    navigation.navigate("LOGS");
  };
  const handleToggleAddAccount = () => {


    navigation.navigate("ADD C-HUB ACCOUNT");
  };

  const handleToggleAccountList = () => {

    navigation.navigate("ACCOUNT LIST");
  };

  const handleToggleAddVehicle = () => {

    navigation.navigate("ADD NEW VEHICLE");
  };


  const handleVehicleList = useCallback(() => {
    navigation.navigate("VEHICLE LIST");
  }, []);

  const handleDocumentChange = (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      const isActive = data.active;

      if (!isActive) {
        signOut(projectControlAuth)
          .then(() => {
            navigation.navigate('Login');
          })
          .catch((error) => {
            console.error('Error signing out:', error);
          });
      }
    } else {
      signOut(projectControlAuth)
        .then(() => {
          navigation.navigate('Login');
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  };

  const subscribeToFieldChange = () => {
    const userId = projectControlAuth.currentUser?.email;
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
    const userRef = doc(projectControlFirestore, 'accounts', documentId);

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

      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching field value:', error);
    }
  };










  const validateEmail = () => {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(inputEmail);

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

    signOut(projectControlAuth).then(() => {
      navigation.navigate('Login');
      setEmail('');
      setName('');
    }).catch(() => {
      // An error happened.
    });


  }

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


  const showDrawerIcon = useBreakpointValue([true, true, true, false]);













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


  const SuccessModal = ({ isOpen, onClose, bodyText, headerText }) => {



    return (
      <Modal isOpen={isOpen} onClose={onClose} >
        <Modal.Content bgColor={'green.100'}>
          <Modal.Header borderBottomWidth={0} bgColor={'green.100'}>
            <Text textAlign={'center'} color={'#102A43'} bold>
              😊😎 Success! 😎😊
            </Text>
          </Modal.Header>
          <Modal.Body
            justifyContent={'center'}
            alignItems={'center'}
            bgColor={'green.200'}
            borderLeftWidth={4}
            borderLeftColor={'green.600'}
            margin={5}
          >
            <Box flex={1}>
              <Text color={'green.600'} bold>
                {headerText}
                {/* Vehicle Added! */}
              </Text>
              <Text color={'green.600'}>
                {bodyText}
                {/* Vehicle was successfully added! You can view it in the vehicle list. */}
              </Text>
            </Box>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} bgColor={'green.100'}>
            <HStack space={5} flex={1}>
              <Button colorScheme={'success'} flex="1" onPress={onClose} _text={{ color: 'white' }}>
                Ok
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
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
          <NamePopover name={name} handleSignOut={handleSignOut} />


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

              <Box px="3" bgColor="#A6BCFE" height="full" >


                <Box bgColor='#A6BCFE' w='100%' h='100%' margin={1}>


                </Box>

              </Box>

            </ScrollView>
          </Box>
        </Box>
      </Box>
    </NativeBaseProvider>




  );

};