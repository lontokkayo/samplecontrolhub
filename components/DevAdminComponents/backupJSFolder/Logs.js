import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
    IconButton,
    Popover
} from "native-base";
import { DataTable } from 'react-native-paper';
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
import { authForCreateUser } from '../../firebasecontrolCreateUser';
import { app, db, getFirestore, collection, addDoc, doc, setDoc, auth, getDoc, onSnapshot, updateDoc, getDocs, orderBy, query, limit } from '../../firebasecontrol'
import { projectExtensionFirestore } from '../../crossFirebase';
import { useNavigation } from '@react-navigation/core'
import './../style.css';
import { debounce, set, throttle } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { bg } from 'date-fns/locale';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginName } from './redux/store';
import MobileViewDrawer from './SideDrawer/MobileViewDrawer';
import SideDrawer from './SideDrawer/SideDrawer';

const { width, height } = Dimensions.get('window');

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


let selectedScreen = 'LOGS'

























export default function Logs() {
    const dispatch = useDispatch();
    const loginName = useSelector((state) => state.loginName);
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
    const [isYesLoading, setIsYesLoading] = useState(false);
    const navigation = useNavigation();

    const [isSelectedLogs, setIsSelectedLogs] = useState(true);
    const [isSelectedAddAccount, setIsSelectedAddAccount] = useState(false);
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
    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputConfirmPassword, setInputConfirmPassword] = useState('');
    const [typeOfAccount, setTypeOfAccount] = useState('');
    const [typeOfAccountDisplay, setTypeOfAccountDisplay] = useState('');
    const [showModal, setShowModal] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const [remainingTime, setRemainingTime] = useState(0);
    const [todayCurrency, setTodayCurrency] = useState('')
    const [timestampCurrency, setTimestampCurrency] = useState('');
    const [exchangeRate, setExchangeRate] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const [time, setTime] = useState('');
    const [isIntervalActive, setIsIntervalActive] = useState(true);
    const optionsPerPage = [13, 26, 52];
    const [showNamePopover, setShowNamePopover] = useState(false);
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showSampleModal, setShowSampleModal] = useState(false);

    const searchInput = useRef(null);
    const searchInputValue = searchInput.current?.value;


    useEffect(() => {

    }, [isSelectedLogs, isSelectedAddAccount, isSelectedAccountList]);




    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setData(documents);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const filtered = useMemo(() => {
        return data.filter(
            (item) =>
                item.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.message.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, data]);

    const paginatedData = useMemo(() => {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }, [page, itemsPerPage, filtered]);

    const startIndex = page * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);
    useEffect(() => {

    }, [searchInputValue]);





    const handleSearch = debounce((text) => {
        setSearchQuery(text);
    }, 300);



    // const delayedSearch = (text) => {
    //     clearTimeout(timeoutId);
    //     timeoutId = setTimeout(() => {
    //         handleSearch(text);
    //     }, 300); // Set the delay to 300 milliseconds
    // };





    // const handleChange = text => {
    //     setEmail(text)
    //     setErrorShow(false)
    // };
















    const SuccessModal = () => {
        return <Center>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg"  >
                <Modal.Content maxWidth="350" bgColor={'green.600'} borderWidth={3} borderColor={'green.400'}>
                    <Modal.Header bgColor={'green.600'} borderBottomWidth={0}><Text color="white" textAlign={'center'} bold>😊😎 Success! 😎😊</Text></Modal.Header>
                    <Modal.Body >
                        <Text color="white" textAlign={'center'}>Account creation for Real Motor Japan Control Hub was successful.</Text>
                    </Modal.Body>
                    <Modal.Footer bgColor={'green.600'} borderTopWidth={0}>
                        <Button _hover={{ bgColor: 'green.500', }} variant={'outline'} flex="1" onPress={() => setShowModal(false)}>
                            <Text color="white" textAlign={'center'}>Proceed</Text>
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Center>;
    };


    useEffect(() => {
    }, [typeOfAccount]);



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.navigate("Login")
            }

        })

        return unsubscribe
    }, []);



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

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedTime = currentDate.toLocaleTimeString('en-US', timeOptions);





    const handleToggleLogs = useCallback(() => {


        navigation.navigate("LOGS");
    }, []);

    const handleToggleAddAccount = useCallback(() => {
        // setIsSelectedAddAccount(true);

        // setIsSelectedLogs(false);
        // setIsSelectedAccountList(false);
        // setIsSelected3(false);
        // setIsSelected4(false);

        navigation.navigate("ADD C-HUB ACCOUNT");
    }, []);

    const handleToggleAccountList = useCallback(() => {
        // setIsSelectedAccountList(true);

        // setIsSelectedAddAccount(false);
        // setIsSelected3(false);
        // setIsSelected4(false);
        // setIsSelectedLogs(false);
        navigation.navigate("ACCOUNT LIST");
    }, []);

    const handleToggleAddVehicle = useCallback(() => {
        // setIsSelected3(true);

        // setIsSelectedAddAccount(false);
        // setIsSelectedAccountList(false);
        // setIsSelected4(false);
        // setIsSelectedLogs(false);
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

            } else {
                console.log('Document does not exist');
            }
        } catch (error) {
            console.error('Error fetching field value:', error);
        }
    };





    const handleSignOut = () => {

        signOut(auth).then(() => {
            navigation.navigate('Login');
            setEmail('');
            setName('');
        }).catch(() => {
            // An error happened.
        });


    }







    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(projectExtensionFirestore, 'currency', 'currency'),
            (snapshot) => {
                const data = snapshot.data();
                setTodayCurrency(data?.todayCurrency);
                setTimestampCurrency(data?.timestampCurrency);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {

    }, [time])

    const CurrencyConverter = async () => {
        setIsLoading(true);
        setIsYesLoading(true);
        try {
            const response = await axios.get(
                'https://openexchangerates.org/api/latest.json?app_id=28a91b51aa36420f9cbd6fb04a52ddd9'
            );

            // Replace 'YOUR_APP_ID' with your actual API key obtained from Open Exchange Rates


            const rates = response.data.rates;
            const usdToJpy = 1 / rates.JPY; // Invert the rate to convert USD to JPY
            const JpyToUsd = rates.JPY / 1;

            const yenToDollar = Number(usdToJpy.toFixed(4)); // Move the toFixed here
            const dollarToYen = Number(JpyToUsd.toFixed(4));
            setExchangeRate(yenToDollar);

            const timestamp = response.data.timestamp;
            const lastUpdateDate = new Date(timestamp * 1000);
            setLastUpdate(lastUpdateDate);

            const formattedLastUpdate = lastUpdateDate.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short',
            });

            const newTodayCurrency = `1 JPY = ${yenToDollar} USD\n1 USD = ${dollarToYen} JPY`;
            const currencyRef = doc(projectExtensionFirestore, 'currency', 'currency');

            try {
                await setDoc(currencyRef, {
                    jpyToUsd: Number(usdToJpy),
                    usdToJpy: Number(JpyToUsd),
                    todayCurrency: newTodayCurrency,
                    timestampCurrency: 'Updated Last: ' + formattedLastUpdate,
                }, { merge: true });
                console.log('Currency data updated successfully!');
                setSuccessModalVisible(true);
                setModalVisible(false);
                setIsLoading(false);
                setIsYesLoading(false);
                try {
                    const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo');
                    const { datetime } = response.data;
                    const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
                    setTime(formattedTime);

                    const logDataCurrency = {
                        message: `Currency Update: "${loginName}" updated the currency exchange.`,
                        timestamp: formattedTime, // Use the formatted time here
                        colorScheme: true,
                    };

                    addLogToCollection(logDataCurrency);
                }
                catch (error) {
                    console.error('Error fetching time:', error);
                }

            } catch (error) {
                console.error('Error updating currency data:', error);
            }
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        }
    };

    //     <Box alignItems="center" backgroundColor={"rgba(0, 0, 0, 0.7)"} borderRadius={5}>
    //     {/* <Text bold color="#39ff14" margin={1}>1 JPY = {exchangeRate.toFixed(4)} USD</Text>
    //     <Text textAlign="center" color="#39ff14" margin={1}>Updated Last: {formattedLastUpdate}</Text> */}
    //     <Text bold color="#39ff14" margin={1}>{todayCurrency}</Text>
    //     <Text textAlign="center" color="#39ff14" margin={1}>{timestampCurrency}</Text>
    //     <Button _hover={{ bgColor: "green.800"}} bgColor={'transparent'} variant={'outline'} borderColor={"#39ff14"} _text={{color: "#39ff14", }}>Update</Button>
    //     {/* <Text color="#39ff14">Updating in: {formatTime(remainingTime)}</Text> */}
    // </Box>

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

    const handleCloseCurrencyModal = () => {
        setModalVisible(false);
        setIsLoading(false);
    };
    const handleOpenCurrencyModal = () => {
        setModalVisible(true);
        setIsLoading(true);
    };

    const handleCloseSuccessModal = () => {
        setSuccessModalVisible(false);
        setIsLoading(false);
    };


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
                    borderBottomColor={'cyan.500'} >

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
                        selectedScreen={selectedScreen} />}


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
                    {/* <Box w={[100, 200, 1020]} h={[10, 10, 10]} flex={1}>
                        <Flex direction="row-reverse">
                            <Popover isOpen={showNamePopover} trigger={triggerProps => {
                                return <Text color="white" marginTop={[2, 2, 2]} fontSize={[17, 18, 20]} marginRight={[1, 3, 5]} {...triggerProps} onPress={showPopover}>
                                    <MaterialCommunityIcons name="account" size={[20, 25, 30]} color="white" /> {name}  <Ionicons name="caret-down" size={16} color="white" />
                                </Text>;
                            }} onClose={() => setShowNamePopover(!showNamePopover)} placement='bottom right' trapFocus={false}>
                                <Popover.Content backgroundColor={'#7B9CFF'}>
                                    <Popover.Body backgroundColor={'#7B9CFF'}>
                                        <Button _hover={{ bgColor: 'blueGray.500', }} onPress={handleSignOut} leftIcon={<MaterialCommunityIcons name="logout" size={20} color="white" />} bgColor={'transparent'}>
                                            Logout
                                        </Button>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                        </Flex>



                    </Box> */}
                </Box>

                {/* Content */}
                <Box flex={[1]} flexDirection="row" >
                    {/* Sidebar */}
                    <SideDrawer
                        selectedScreen={selectedScreen}
                    />

                    {/* Main Content */}
                    <Box flex={1} flexGrow={1} minHeight={0} flexDirection={['column', 'row', 'row']}>
                        {/* Main Content Content */}
                        <Box flex={1} contentContainerStyle={{ flexGrow: 1 }}>

                            <Box
                                borderWidth={1}
                                borderColor="gray.200"
                                borderRadius={4}
                                overflow="hidden"
                                margin={1}
                                height={'49%'}
                                alignItems={'center'}
                                bg="#F5F5F5">
                                <Image
                                    source={require('../../assets/currency_background.jpg')}
                                    alt="Background Image"
                                    resizeMode="stretch"
                                    width="100%"
                                    height="100%"
                                    position={'absolute'}

                                />

                                <Center height="100%">

                                    <Box alignItems="center" backgroundColor={"rgba(0, 0, 0, 0.7)"} borderRadius={5} paddingBottom={1}>
                                        <Text bold color="#39ff14" margin={1} textAlign={'center'}>{todayCurrency}</Text>
                                        <Text textAlign="center" color="#39ff14" margin={1}>{timestampCurrency}</Text>
                                        <Button w={'95%'} _hover={{ bgColor: "green.800" }} bgColor={'transparent'} variant={'outline'} borderColor={"#39ff14"} _text={{ color: "#39ff14", }} onPress={handleOpenCurrencyModal}>{isLoading ? <Spinner color="#39ff14" size={21} /> : 'Update'}</Button>

                                    </Box>

                                </Center>

                            </Box>


                            <Box borderWidth={1} borderColor="gray.200" borderRadius={4} overflow="hidden" margin={1} height={'49%'}>


                            </Box>

                        </Box>



                        {/* <Box>
                                <Input
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                    bgColor={'white'}
                                    margin={1}
                                />

                                <Box borderWidth={1} borderColor="gray.200" borderRadius={4} overflow="hidden" margin={1}>
                                    <Box flexDirection="row" borderBottomWidth={1} borderColor="gray.200" bgColor="#0642F4">
                                        <Box flex={1} padding={2}>
                                            <Text fontWeight="bold" color="white">Timestamp</Text>
                                        </Box>
                                        <Box flex={1} padding={2}>
                                            <Text fontWeight="bold" color="white">Action</Text>
                                        </Box>
                                    </Box>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item) => (
                                            <Box
                                                key={item.id}
                                                flexDirection="row"
                                                bgColor={item.colorScheme ? 'green.200' : 'red.200'}
                                                borderBottomColor="gray.200"
                                                borderBottomWidth={1}
                                            >
                                                <Box flex={1} padding={2}>
                                                    <Text>{item.timestamp}</Text>
                                                </Box>
                                                <Box flex={1} padding={2}>
                                                    <Text>{item.message}</Text>
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box padding={2}>
                                            <Text>No results found.</Text>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            <HStack justifyContent="center" space={5}>
                                <Button onPress={handlePrevPage} disabled={currentPage === 1}>
                                    <Text>Previous</Text>
                                </Button>
                                <Button onPress={handleNextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
                                    <Text>Next</Text>
                                </Button>
                            </HStack>
 */}
                        <Box flex={1} height={'100%'}>
                            <Input ref={searchInput} onChangeText={handleSearch} placeholder="Search" bgColor={'white'} />
                            <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }}>
                                <DataTable margin={1}>
                                    <Box borderWidth={1} borderColor="gray.200" borderRadius={4} overflow="hidden">
                                        <Box flexDirection="row" borderBottomWidth={1} borderColor="gray.200" bgColor="#0642F4">
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color="white">
                                                    Timestamp
                                                </Text>
                                            </Box>
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color="white">
                                                    Action
                                                </Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <PresenceTransition visible={true} initial={{
                                        opacity: 0
                                    }} animate={{
                                        opacity: 1,
                                        transition: {
                                            duration: 250
                                        }
                                    }}>
                                        {paginatedData.map((item) => (
                                            <Box
                                                key={item.id}
                                                flexDirection="row"
                                                bgColor={item.colorScheme ? 'green.200' : 'red.200'}
                                                borderBottomColor="gray.200"
                                                borderBottomWidth={1}
                                            >
                                                <Box flex={1} padding={2}>
                                                    <Text>{item.timestamp}</Text>
                                                </Box>
                                                <Box flex={1} padding={2}>
                                                    <Text>{item.message}</Text>
                                                </Box>

                                            </Box>
                                        ))}
                                    </PresenceTransition>
                                    <DataTable.Pagination
                                        page={page}
                                        numberOfPages={Math.ceil(filtered.length / itemsPerPage)}
                                        onPageChange={(page) => setPage(page)}
                                        label={`${startIndex + 1}-${endIndex} of ${filtered.length}`}
                                        optionsPerPage={optionsPerPage}
                                        itemsPerPage={itemsPerPage}
                                        setItemsPerPage={setItemsPerPage}
                                        showFastPagination
                                        optionsLabel={'Rows per page'}
                                    />
                                </DataTable>
                            </ScrollView>
                        </Box>




                        <Modal isOpen={modalVisible} onClose={handleCloseCurrencyModal}>
                            <Modal.Content>
                                <Modal.CloseButton />
                                <Modal.Header borderBottomWidth={0}>Update currency</Modal.Header>
                                <Modal.Body  >
                                    Do you want to update to the latest currency?
                                </Modal.Body>
                                <Modal.Footer borderTopWidth={0}>
                                    <Button onPress={handleCloseCurrencyModal} flex={1} margin={1} colorScheme={'danger'}>No</Button>
                                    <Button onPress={CurrencyConverter} colorScheme={'success'} flex={1} margin={1}>{isYesLoading ? <Spinner color="white" size={21} /> : 'Yes'}</Button>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>

                        <Modal isOpen={successModalVisible} onClose={handleCloseSuccessModal}>
                            <Modal.Content>
                                <Modal.CloseButton />
                                <Modal.Header bgColor={'green.200'} borderBottomWidth={0}>Update success!</Modal.Header>
                                <Modal.Body bgColor={'green.200'}  >
                                    <Text bold margin={1}>{todayCurrency}</Text>
                                    <Text margin={1}>{timestampCurrency}</Text>
                                </Modal.Body>
                                <Modal.Footer bgColor={'green.200'} borderTopWidth={0}>
                                    <Button onPress={handleCloseSuccessModal} flex={1} margin={1}>Ok</Button>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>



                    </Box>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
}



