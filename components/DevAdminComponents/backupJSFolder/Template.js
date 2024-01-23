import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Icon,
    Image as NativeImage,
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
    ScrollView as ScrollViewNative,
    Divider,
    useDisclosure,
    useDisclose,
    FormControl,
    Checkbox,
    useToast
} from 'native-base';
import React, { useEffect, useRef, useState, useMemo, useCallback, useReducer } from 'react';
import {
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    View,
    PanResponder,
    Animated,
    InputAccessoryView,
    FlatList,
    ScrollView,
    TouchableHighlight,
    TextInput,
    Image as RNImage
} from 'react-native';
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
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, setDoc, arrayUnion, updateDoc, query, getDocs, orderBy, startAfter, limit, where, endBefore, endAt, limitToLast, collectionGroup } from 'firebase/firestore';
import moment from 'moment';
import { authForCreateUser } from '../../firebasecontrolCreateUser';
import './../style.css';
import { projectControlFirestore, projectControlAuth, projectExtensionFirestore, projectExtensionAuth, projectControlFirebase, projectExtensionFirebase } from "../../crossFirebase";
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import FastImage from 'react-native-fast-image-web-support';
import MobileViewDrawer from './SideDrawer/MobileViewDrawer';
import SideDrawer from './SideDrawer/SideDrawer';
import { useSelector, useDispatch } from 'react-redux';
import DraggableFlatList from "react-native-draggable-flatlist";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { DragSortableView } from 'react-native-drag-sort';
import {
    setVehicleListData,
    setSupplyChainsCostsData,
    setSelectedPaidTo,
    setSelectedExpenseName,
    setSupplyChainsCostsModalVisible,
    setVehicleListSupplyChainsCostsData,
    setDeleteImageVisible,
    setSelectedImages,
    setAddAnotherImages,
    setIsAddPhotoVisible,
    setUploadImagesModalVisible,
    setUploadImagesButtonLoading,
    setViewImagesModalVisible,
    setViewImagesData,
    setLoadingModalVisible,
    setAddVehicleListData,
    setEditVehicleModalVisible,
    setFobPriceHistoryModalVisible
} from './redux/store';
// import { TextInput } from 'react-native-gesture-handler';
import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';
import StickyHeader from './Header/StickyHeader';
import { UsePagination } from './VehicleListComponent/UsePagination';
// import { CollectionGroup } from 'firebase-admin/firestore';
const { width } = Dimensions.get('window');
let selectedScreen = 'VEHICLE LIST'

const firestore = getFirestore();

const getEmailOfCurrentUser = () => {
    const user = projectControlAuth.currentUser;
    if (user) {
        const email = user.email;
        return email;
    } else {
        // console.log('No user is currently authenticated');
        return null;
    }
};

const LoadingModal = () => {
    const loadingModalVisible = useSelector((state) => state.loadingModalVisible);


    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                flex: 1,
                display: loadingModalVisible ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* Content within the modal */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="lg" color="white" />
                <Text style={{ color: 'white' }}>Loading, please wait!</Text>
            </View>
        </View>

    );

}




export default function Freight() {

    const [email, setEmail] = useState('');
    const logo = require('../../assets/C-Hub.png');
    const logo2 = require('../../assets/C-Hub Logo Only.png');
    const [isMobileView, setIsMobileView] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigation = useNavigation();



    const [typeOfAccount, setTypeOfAccount] = useState('');


    const loginName = useSelector((state) => state.loginName);
    const [name, setName] = useState(loginName);
    const [time, setTime] = useState('');

    const [selectedImages, setSelectedImages] = useState([]);

    const [widthState, setWidthState] = useState(Dimensions.get('window').width);




    const screenWidth = Dimensions.get('window').width;



    // useEffect(() => {
    //   const handleWidthChange = ({ window }) => {
    //     setWidthState(window.width);
    //   };

    //   Dimensions.addEventListener('change', handleWidthChange);

    //   return () => {
    //     Dimensions.removeEventListener('change', handleWidthChange);
    //   };
    // }, []);

    // useEffect(() => {
    //   reloadData();
    // }, [reloadData]);


    // useEffect(() => {
    // }, [typeOfAccount]);




    useEffect(() => {
        const unsubscribe = projectControlAuth.onAuthStateChanged(user => {
            if (!user) {
                navigation.navigate("Login")
            }

        })

        return unsubscribe
    }, [])












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


        // To stop listening for updates, you can call unsubscribe()
        // unsubscribe();
    };



    const getFieldValueByEmail = async (email) => {
        try {
            const accountDocRef = doc(firestore, 'accounts', email);
            const accountDocSnapshot = await getDoc(accountDocRef);

            if (accountDocSnapshot.exists()) {

            } else {
                // console.log('Document does not exist');
            }
        } catch (error) {
            console.error('Error fetching field value:', error);
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

    // useEffect(() => {
    //   const handleScreenResize = () => {
    //     const screenWidth = Dimensions.get('window').width;
    //     setIsMobileView(screenWidth < 1200);
    //   };

    //   // Initial check on component mount
    //   handleScreenResize();

    //   // Listen for screen dimension changes
    //   Dimensions.addEventListener('change', handleScreenResize);

    //   // Cleanup event listener on component unmount
    //   return () => {
    //     Dimensions.removeEventListener('change', handleScreenResize);
    //   };
    // }, []);


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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        image: {
            flex: 1,
        },
    });

    return (
        <>
            <View style={{ backgroundColor: "#A6BCFE", height: '100%', width: '100%', flexDirection: 'column', }} bgColor="#A6BCFE" h="100vh" w="full" flexDirection="column">
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

                    <Box w={screenWidth <= 960 ? 0 : 850} h={[10, 10, 10, 10]} marginBottom={1.5} marginTop={1.5}>

                        <FastImage
                            source={{
                                uri: 'https://i.imgur.com/V98nKSK.png',
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                            style={styles.image} />
                    </Box>

                    {screenWidth <= 960 && <MobileViewDrawer
                        selectedScreen={selectedScreen} />}


                    <Box w={screenWidth <= 960 ? 120 : 0} h={screenWidth <= 960 ? 6 : 10} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]}>

                        <FastImage
                            source={{
                                uri: 'https://i.imgur.com/NGCIoSV.png',
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                            style={styles.image} />
                    </Box>
                    <NamePopover name={name} handleSignOut={handleSignOut} />


                </Box>

                {/* Content */}
                <View style={{ flex: 1, flexDirection: 'row' }} flex={[1]} flexDirection="row">
                    {/* Sidebar */}
                    <SideDrawer
                        selectedScreen={selectedScreen} />

                    {/* Main Content */}
                    {/* <Box flex={1} flexGrow={1} minHeight={0}> */}
                    {/* Main Content Content */}


                    {/* <Box px="3" bgColor="#A6BCFE" height="full" > */}
                    <View style={{ flex: 1, backgroundColor: "#A6BCFE", height: '100%' }}>
                        <ScrollView style={{ flex: 1, }} keyboardShouldPersistTaps='always'>
                            <View style={{ flex: 1, }}>


                            </View>
                        </ScrollView>
                        {/* <SuccessModal /> */}

                    </View>


                    {/* </Box> */}

                    {/* </Box> */}
                </View>

            </View>
            <LoadingModal />

        </>
    );
}