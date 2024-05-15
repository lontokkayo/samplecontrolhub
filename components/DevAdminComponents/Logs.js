import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, TextInput, Keyboard, Pressable, } from 'react-native';
import {
    Input,
    Icon,
    Stack,

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
    Popover,
    Select,
    CheckIcon,
    FlatList
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
import { arrayUnion, where, startAfter, endBefore, limitToLast, collectionGroup } from 'firebase/firestore';
import { projectExtensionFirestore, projectControlFirestore } from '../../crossFirebase';
import { useNavigation } from '@react-navigation/core'
import './../style.css';
import { debounce, set, throttle } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { bg } from 'date-fns/locale';
import FastImage from 'react-native-fast-image-web-support';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginName, setSelectedLogsButton, setStatsData, setLogsData, setLoadingModalVisible, setStatsModalVisible } from './redux/store';
import MobileViewDrawer from './SideDrawer/MobileViewDrawer';
import SideDrawer from './SideDrawer/SideDrawer';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryVoronoiContainer } from 'victory';
import {
    OPEN_EXCHANGE_API_KEY
} from '@env';
import { format, parseISO, subMonths } from "date-fns";
import Svg, { Rect } from 'react-native-svg';

import { AES } from 'crypto-js';
import { CRYPTO_KEY, CRYPTO_KEY_API } from '@env';

const { width, height } = Dimensions.get('window');

const firestore = getFirestore();
const getEmailOfCurrentUser = () => {
    const user = auth.currentUser;
    if (user) {
        const email = user.email;
        return email;
    } else {
        // console.log('No user is currently authenticated');
        return null;
    }
};

// const Drawer = createDrawerNavigator();


import { useNavigate } from 'react-router-dom';
import QRCodeScanner from './QrCodeScanner/QrCodeScanner';

let selectedScreen = 'LOGS'
let defaultSelectedButton = 'stats'
let globalCustomerId;
let globalChatId;














// const addKeywordsToLogs = async () =>{
//     const logsRef = collection(projectControlFirestore, "logs");

//     try {
//       const querySnapshot = await getDocs(logsRef);

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         const keywords = [
//           data.timestamp,
//           data.message,
//         ];

//         updateDoc(doc.ref, {
//           keywords: arrayUnion(...keywords)
//         });
//       });

//       console.log("Keywords added successfully to logs collection.");
//     } catch (error) {
//       console.error("Error adding keywords to logs collection:", error);
//     }
//   }
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
                <Text style={{ color: 'white' }} selectable={false}>Loading, please wait!</Text>
            </View>
        </View>

    );

}


const LogsTable = () => {

    const dispatch = useDispatch();
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastVisible, setLastVisible] = useState(null);
    const [firstVisible, setFirstVisible] = useState(null);
    const [searchText, setSearchText] = useState('');
    const searchInputRef = useRef(null);
    const logsData = useSelector((state) => state.logsData);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        const q = query(
            collection(projectControlFirestore, 'logs'),
            orderBy('timestamp', 'desc'),
            limit(pageSize)
        );
        const unsubscribe = onSnapshot(q, (documents) => {
            const logsDatabaseData = [];
            documents.forEach((document) => {
                logsDatabaseData.push({
                    id: document.id,
                    ...document.data(),
                });
            });
            dispatch(setLogsData(logsDatabaseData));
            setLastVisible(documents.docs[documents.docs.length - 1]);
            setFirstVisible(documents.docs[0]);
            dispatch(setLoadingModalVisible(false));

        });
        return () => unsubscribe();

    }, []);

    const fetchNextData = async () => {

        if (searchText === '') {


            const q = query(
                collectionGroup(projectControlFirestore, 'logs'),
                orderBy('timestamp', 'desc'),
                startAfter(lastVisible),
                limit(pageSize)
            );

            const documents = await getDocs(q);
            updateState(documents, 'next');



            dispatch(setLoadingModalVisible(false));


        }

        else {
            const q = query(
                collection(projectControlFirestore, 'logs'),
                where('keywords', 'array-contains', searchText.toLowerCase()),
                orderBy('timestamp', 'desc'),
                startAfter(lastVisible),
                limit(pageSize)
            );

            const documents = await getDocs(q);
            updateState(documents, 'next');



            dispatch(setLoadingModalVisible(false));
        }

    };


    const fetchPreviousData = async () => {
        if (searchText === '') {


            const q = query(
                collection(projectControlFirestore, 'logs'),
                orderBy('timestamp', 'desc'),
                endBefore(firstVisible),
                limitToLast(pageSize)
            );


            const documents = await getDocs(q);
            updateState(documents, 'prev')
            dispatch(setLoadingModalVisible(false));

        }

        else {

            const q = query(
                collection(projectControlFirestore, 'logs'),
                where('keywords', 'array-contains', searchText.toLowerCase()),
                orderBy('timestamp', 'desc'),
                endBefore(firstVisible),
                limitToLast(pageSize)
            );

            const documents = await getDocs(q);
            updateState(documents, 'prev');
            dispatch(setLoadingModalVisible(false));

        }


    }



    const fetchFirstPage = (documents) => {


        const logsDatabaseData = [];

        documents.forEach((document) => {
            logsDatabaseData.push({
                id: document.id,
                ...document.data(),
            });
        });

        dispatch(setLogsData(logsDatabaseData));

        if (documents?.docs[0]) {
            setFirstVisible(documents.docs[0]);
        }
        if (documents?.docs[documents.docs.length - 1]) {
            setLastVisible(documents.docs[documents.docs.length - 1]);
        }





    }

    const updateState = async (documents, pageClicked) => {


        if (!documents.empty) {
            const logsDatabaseData = [];
            documents.forEach((document) => {
                logsDatabaseData.push({
                    id: document.id,
                    ...document.data(),
                });
            });



            if (documents?.docs[0]) {
                setFirstVisible(documents.docs[0]);
            }
            if (documents?.docs[documents.docs.length - 1]) {
                setLastVisible(documents.docs[documents.docs.length - 1]);
            }

            if (pageClicked == 'next') {
                setCurrentPage(currentPage + 1);
            }
            if (pageClicked == 'prev') {
                setCurrentPage(currentPage - 1);
            }

            dispatch(setLogsData(logsDatabaseData));
        }

        else {

            if (searchText == '') {
                setCurrentPage(1);

                const q = query(
                    collection(projectControlFirestore, 'logs'),
                    orderBy('timestamp', 'desc'),
                    limit(pageSize)
                );
                const firstPageDocuments = await getDocs(q);
                fetchFirstPage(firstPageDocuments);

            }
            else {

                setCurrentPage(1);

                const q = query(
                    collection(projectControlFirestore, 'logs'),
                    where('keywords', 'array-contains', searchText.toLowerCase()),
                    orderBy('timestamp', 'desc'),
                    limit(pageSize)
                );
                const firstPageDocuments = await getDocs(q);
                fetchFirstPage(firstPageDocuments);

            }


        }


    };


    const handleNextPage = async () => {
        // setPageClicked('next');
        dispatch(setLoadingModalVisible(true));
        // setCurrentPage(currentPage + 1);
        await fetchNextData();




    };

    const handlePreviousPage = async () => {
        // setPageClicked('previous');
        dispatch(setLoadingModalVisible(true));
        // setCurrentPage(currentPage - 1);
        await fetchPreviousData();


    };


    useEffect(() => {

        searchData();

    }, [searchText]);

    const searchData = async () => {

        dispatch(setLoadingModalVisible(true));

        if (searchText === '') {

            setCurrentPage(1);
            const q = query(
                collection(projectControlFirestore, 'logs'),
                orderBy('timestamp', 'desc'),
                limit(pageSize)
            );

            const firstPageDocuments = await getDocs(q);
            fetchFirstPage(firstPageDocuments);
            dispatch(setLoadingModalVisible(false));



        }

        else {

            setCurrentPage(1);
            const q = query(
                collection(projectControlFirestore, 'logs'),
                where('keywords', 'array-contains', searchText.toLowerCase()),
                orderBy('timestamp', 'desc'),
                limit(pageSize)
            );

            const firstPageDocuments = await getDocs(q);
            fetchFirstPage(firstPageDocuments);
            dispatch(setLoadingModalVisible(false));
        }
    };

    const handleSearchEnter = () => {

        if (searchInputRef.current?.value !== '') {
            setSearchText(searchInputRef.current.value.trim());
        }
        else {
            setSearchText('');

            if (searchText == '') {
                searchData();
            }


        }

    }

    return (
        <View style={{ flex: 1, }}>
            <View>
                <TextInput ref={searchInputRef} style={{ width: '100%', padding: 10, backgroundColor: 'white', borderRadius: 5, placeholderTextColor: '#ACADA3', }}
                    onSubmitEditing={handleSearchEnter}
                    placeholder='Search'
                    returnKeyType='search'
                    keyboardType='default'
                    autoCapitalize='none'
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E4E4E7',
                    backgroundColor: '#0642F4',
                    padding: 2,
                    borderRadius: 5,
                }}>
                <View style={{ flex: 1, padding: 2 }}>
                    <Text style={{ color: 'white', }} bold>Timestamp</Text>
                </View>
                <View style={{ flex: 1, padding: 2 }}>
                    <Text style={{ color: 'white', }} bold>Action</Text>
                </View>
            </View>
            {logsData.map((item) => (
                <View
                    key={item.id}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E4E4E7',
                        backgroundColor: item.colorScheme ? '#BBF7D0' : '#EAC7D6',
                        paddingVertical: 10,
                        flexGrow: 1,
                    }}>
                    <View style={{ flex: 1, }}>
                        <Text selectable style={{ width: '90%', marginLeft: 3, }}>{item.timestamp}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text selectable style={{ width: '90%', }}>{item.message} </Text>
                    </View>
                </View>
            ))}

            <View style={{ flexDirection: 'row', width: screenWidth <= 960 ? '100%' : '30%', alignSelf: 'center', backgroundColor: '#A6BCFE', }}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ display: currentPage <= 1 ? 'none' : 'flex' }}
                        onPress={handlePreviousPage}>
                        <View style={{ backgroundColor: 'rgba(6,66,244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                            <MaterialIcons name='navigate-before' size={40} color={'white'} />
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={{ flex: 1, backgroundColor: 'rgba(6,66,244, 0.6)', borderRadius: 5, margin: 10, padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'white' }} bold>Page {currentPage}</Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
                    <TouchableOpacity
                        onPress={handleNextPage}>
                        <View style={{ backgroundColor: 'rgba(6,66,244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                            <MaterialIcons name='navigate-next' size={40} color={'white'} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
            <TouchableOpacity
              onPress={addKeywordsToVehicleProducts}>
              <View style={{ backgroundColor: 'rgba(6,66,244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                <MaterialIcons name='save' size={40} color={'white'} />
              </View>
            </TouchableOpacity>
          </View> */}

            </View>
        </View>

    );


};

const addLogToCollection = async (data) => {
    try {
        const firestore = getFirestore();
        const logsCollectionRef = collection(firestore, 'logs');

        // Add a new document to the "logs" collection
        await addDoc(logsCollectionRef, data);

        // console.log('Document added successfully!');
    } catch (error) {
        console.error('Error adding document:', error);
    }
};

const CurrencyConverterComponent = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isYesLoading, setIsYesLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [todayCurrency, setTodayCurrency] = useState([]);
    const [timestampCurrency, setTimestampCurrency] = useState([]);
    const [exchangeRate, setExchangeRate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [time, setTime] = useState('');
    const [lastUpdate, setLastUpdate] = useState(null);
    const loginName = useSelector((state) => state.loginName);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {


        const unsubscribe = onSnapshot(
            doc(projectExtensionFirestore, 'currency', 'currency'),
            (snapshot) => {
                const data = snapshot.data();
                setTodayCurrency(data?.todayCurrency);
                setTimestampCurrency(data?.timestampCurrency);
                dispatch(setLoadingModalVisible(false));
            }

        );

        return () => unsubscribe();
    }, []);

    const CurrencyConverter = async () => {

        setIsLoading(true);
        setIsYesLoading(true);
        try {
            const response = await axios.get(
                `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_API_KEY}`
            );

            // Replace 'YOUR_APP_ID' with your actual API key obtained from Open Exchange Rates


            const rates = response.data.rates;
            const usdToJpy = 1 / rates.JPY; // Invert the rate to convert USD to JPY
            const JpyToUsd = rates.JPY / 1;



            const yenToDollar = Number(usdToJpy.toFixed(4)); // Move the toFixed here
            const dollarToYen = Number(JpyToUsd.toFixed(4));

            const usdToEur = 1 / rates.EUR;
            const eurToUsd = rates.EUR;

            const usdToGbp = 1 / rates.GBP;
            const gbpToUsd = rates.GBP;

            const usdToAud = 1 / rates.AUD;
            const audToUsd = rates.AUD;


            const usdToCad = 1 / rates.CAD;
            const cadToUsd = rates.CAD;

            // Calculate Yen to Euro and Euro to Yen
            const yenToEuro = yenToDollar * eurToUsd; // Convert Yen to USD first, then to Euro
            const euroToYen = dollarToYen * usdToEur; // Convert Euro to USD first, then to Yen

            const yenToGbp = yenToDollar * gbpToUsd; // Convert Yen to USD first, then to Pound Sterling
            const gbpToYen = dollarToYen * usdToGbp; // Convert Pound Sterling to USD first, then to Yen

            const yenToAud = yenToDollar * audToUsd; // Convert Yen to USD first, then to Australian Dollars
            const audToYen = dollarToYen * usdToAud; // Convert Australian Dollars to USD first, then to Yen

            const yenToCad = yenToDollar * cadToUsd; // Convert Yen to USD first, then to Canadian Dollars
            const cadToYen = dollarToYen * usdToCad; // Convert Canadian Dollars to USD first, then to Yen

            // Format the new rates



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

            const newTodayCurrency = `1 JPY = ${yenToDollar} USD / 1 USD = ${dollarToYen} JPY\n1 JPY = ${yenToEuro.toFixed(4)} EUR / 1 EUR = ${euroToYen.toFixed(4)} JPY\n1 JPY = ${yenToAud.toFixed(4)} AUD / 1 AUD = ${audToYen.toFixed(4)} JPY\n1 JPY = ${yenToGbp.toFixed(4)} GBP / 1 GBP = ${gbpToYen.toFixed(4)} JPY\n1 JPY = ${yenToCad.toFixed(4)} CAD / 1 CAD = ${cadToYen.toFixed(4)} JPY\n`;
            const currencyRef = doc(projectExtensionFirestore, 'currency', 'currency');

            try {
                await setDoc(currencyRef, {
                    jpyToUsd: Number(usdToJpy),
                    usdToJpy: Number(JpyToUsd),
                    jpyToEur: yenToEuro,
                    eurToJpy: euroToYen,
                    jpyToGbp: yenToGbp,
                    gbpToJpy: gbpToYen,
                    jpyToAud: yenToAud,
                    audToJpy: audToYen,
                    usdToEur: eurToUsd,
                    eurToUsd: usdToEur,
                    usdToGbp: gbpToUsd,
                    gbpToUsd: usdToGbp,
                    usdToAud: audToUsd,
                    audToUsd: usdToAud,
                    cadToUsd: usdToCad,
                    usdToCad: cadToUsd,
                    jpyToCad: cadToYen,
                    cadToJpy: yenToCad,
                    todayCurrency: newTodayCurrency,
                    timestampCurrency: 'Updated Last: ' + formattedLastUpdate,
                }, { merge: true });
                // console.log('Currency data updated successfully!');
                setSuccessModalVisible(true);
                setModalVisible(false);
                setIsLoading(false);
                setIsYesLoading(false);
                try {
                    const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
                    const { datetime } = response.data;
                    const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
                    const year = moment(datetime).format('YYYY');
                    const month = moment(datetime).format('MM');
                    const monthWithDay = moment(datetime).format('MM/DD');
                    const date = moment(datetime).format('YYYY/MM/DD');
                    const day = moment(datetime).format('DD');
                    const time = moment(datetime).format('HH:mm');
                    const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');
                    setTime(formattedTime);

                    const logDataCurrency = {
                        message: `Currency Update: "${loginName}" updated the currency exchange.\n¥JPY → $USD = ${Number(usdToJpy).toFixed(4)} / $USD → ¥JPY = ${Number(JpyToUsd).toFixed(4)}\n¥JPY → €EUR = ${yenToEuro.toFixed(4)} / €EUR → ¥JPY = ${euroToYen.toFixed(4)}\n¥JPY → A$AUD = ${yenToAud.toFixed(4)} / A$AUD → ¥JPY = ${audToYen.toFixed(4)}\n¥JPY → £GBP = ${yenToGbp.toFixed(4)} / £GBP → ¥JPY = ${gbpToYen.toFixed(4)}\n¥JPY → C$CAD = ${yenToCad.toFixed(4)} / C$CAD → ¥JPY = ${cadToYen.toFixed(4)}`,
                        timestamp: formattedTime, // Use the formatted time here
                        colorScheme: true,
                        keywords: [
                            formattedTime.toLowerCase(),
                            loginName.toLowerCase(),
                            '$'.toLowerCase(),
                            '¥'.toLowerCase(),
                            `Currency Update: "${loginName}" updated the currency exchange.`.toLowerCase(),
                            'Update'.toLowerCase(),
                            'Currency'.toLowerCase(),
                            formattedTime.toLowerCase(),
                            year.toLowerCase(),
                            month.toLowerCase(),
                            monthWithDay.toLowerCase(),
                            date.toLowerCase(),
                            day.toLowerCase(),
                            time.toLowerCase(),
                            timeWithMinutesSeconds.toLowerCase(),
                        ],

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


    return (
        <>
            <Box
                borderWidth={1}
                borderColor="gray.200"
                borderRadius={4}
                overflow="hidden"
                margin={1}
                alignItems={'center'}
                bg="#F5F5F5"
                style={{ width: screenWidth <= 960 ? '98%' : 700, height: 400, alignSelf: 'center', }}
            >
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

                        <Text bold color="#39ff14" margin={1} textAlign={'center'} fontSize={screenWidth > 960 ? '' : 12} >{todayCurrency}</Text>
                        <Text textAlign="center" color="#39ff14" margin={1} fontSize={screenWidth > 960 ? '' : 12}>{timestampCurrency}</Text>
                        <Button alignSelf={'center'} w={'95%'} _hover={{ bgColor: "green.800" }} bgColor={'transparent'} variant={'outline'} borderColor={"#39ff14"} _text={{ color: "#39ff14", }} onPress={handleOpenCurrencyModal}>{isLoading ? <Spinner color="#39ff14" size={21} /> : 'Update'}</Button>

                    </Box>

                </Center>

            </Box>

            <Modal isOpen={modalVisible} onClose={handleCloseCurrencyModal}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header borderBottomWidth={0}>Update currency</Modal.Header>
                    <Modal.Body>
                        Do you want to update to the latest currency?
                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0}>
                        <Button onPress={handleCloseCurrencyModal} flex={1} margin={1} colorScheme={'danger'}>No</Button>
                        <Button onPress={CurrencyConverter} colorScheme={'success'} flex={1} margin={1}>{isYesLoading ? <Spinner color="white" size={21} /> : 'Yes'}</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal><Modal isOpen={successModalVisible} onClose={handleCloseSuccessModal}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header bgColor={'green.200'} borderBottomWidth={0}>Update success!</Modal.Header>
                    <Modal.Body bgColor={'green.200'}>
                        <Text bold margin={1}>{todayCurrency}</Text>
                        <Text margin={1}>{timestampCurrency}</Text>
                    </Modal.Body>
                    <Modal.Footer bgColor={'green.200'} borderTopWidth={0}>
                        <Button onPress={handleCloseSuccessModal} flex={1} margin={1}>Ok</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>

    );

};



const fetchCurrentDate = async () => {
    try {
        const response = await axios.get("https://worldtimeapi.org/api/timezone/Asia/Tokyo");
        const { datetime } = response.data;
        return datetime.slice(0, 7); // Extracts YYYY-MM
    } catch (error) {
        console.error("Error fetching current date:", error);
        return new Date().toISOString().slice(0, 7); // Fallback to local time if API fails
    }
};

// Fetch stats data based on type
// Fetch stats data based on type
const fetchStatsData = async (yearMonth, type, period) => {
    try {
        if (period === "Monthly") {
            // Handle fetching monthly data for the entire year
            const year = yearMonth.split("-")[0]; // Extract the year
            const monthlyData = await Promise.all(Array.from({ length: 12 }, async (_, index) => {
                const monthValue = `${year}-${(index + 1).toString().padStart(2, '0')}`; // Format: "YYYY-MM"
                const documentRef = doc(projectExtensionFirestore, `${type}`, monthValue);
                const documentSnapshot = await getDoc(documentRef);

                let count = 0;
                let data = [];

                if (documentSnapshot.exists()) {
                    const docData = documentSnapshot.data() || {};
                    count = Object.values(docData).reduce((acc, cur) => acc + cur.length, 0); // Aggregate counts

                    // Fetch data for each field (assuming each field contains an array of items)
                    const fieldPromises = Object.keys(docData).map(async (field) => {
                        const fieldData = docData[field];
                        // Example: Adjust the way fieldData is fetched or processed if necessary
                        return { [field]: fieldData };
                    });

                    data = await Promise.all(fieldPromises);
                }

                return {
                    value: monthValue,
                    count,
                    data
                };
            }));

            return monthlyData;
        } else {
            // Existing logic for daily data
            const documentRef = doc(projectExtensionFirestore, `${type}`, `${yearMonth}`);
            const documentSnapshot = await getDoc(documentRef);
            const docData = documentSnapshot.data() || {};

            const days = await Promise.all(Array.from({ length: 31 }, async (_, index) => {
                const dayValue = String(index + 1).padStart(2, "0");
                let count = 0;
                let data = [];

                if (docData[dayValue]) {
                    const dayData = docData[dayValue];
                    count = dayData.length;  // Assuming dayData is an array

                    // Fetch data for each field (assuming each field contains an array of items)
                    const fieldPromises = dayData.map(async (item) => {
                        // Example: Adjust the way item is fetched or processed if necessary
                        return item;
                    });

                    data = await Promise.all(fieldPromises);
                }

                return {
                    value: dayValue,
                    count,
                    data
                };
            }));

            return days;
        }
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        if (period === "Monthly") {
            return Array.from({ length: 12 }, (_, index) => ({
                value: `${yearMonth.split("-")[0]}-${(index + 1).toString().padStart(2, '0')}`,
                count: 0,
                data: []
            }));
        } else {
            return Array.from({ length: 31 }, (_, index) => ({
                value: String(index + 1).padStart(2, "0"),
                count: 0,
                data: []
            }));
        }
    }
};
// Process data based on the period
const processData = (data, period) => {
    if (period === "Daily") {
        return data; // Assuming daily data doesn't need aggregation
    } else if (period === "Weekly") {
        // Assuming data has daily counts and needs to be aggregated into weeks
        const weeks = Array.from({ length: 5 }, () => ({ value: '', count: 0, data: [] }));
        data.forEach((day, index) => {
            const weekIndex = Math.floor(index / 7); // Divide the month into 5 weeks approximately
            if (weekIndex < weeks.length) {
                weeks[weekIndex].value = `Week ${weekIndex + 1}`;
                weeks[weekIndex].count += day.count;
                weeks[weekIndex].data = weeks[weekIndex].data.concat(day.data);
            }
        });
        return weeks;
    } else if (period === "Monthly") {
        // Assuming data is structured per month, each array element corresponds to a month's data
        const months = Array.from({ length: 12 }, (_, i) => ({ value: `${(i + 1).toString().padStart(2, '0')}`, count: 0, data: [] }));
        data.forEach((monthData, index) => {
            if (index < months.length) {
                months[index].value = `${(index + 1).toString().padStart(2, '0')}`; // Ensure month labels are "01", "02", etc.
                months[index].count = monthData.count; // Assign count from the data, assuming data is pre-aggregated by month
                monthData.data.forEach(day => {
                    // Sort the keys to ensure data is processed in the correct order of days
                    Object.keys(day).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).forEach(dayKey => {
                        const dayEntries = day[dayKey];
                        months[index].data = months[index].data.concat(dayEntries);
                    });
                });
            }
        });
        return months;
    }
};

// Calculate total from data
const calculateTotal = (data) => {
    return data.reduce((sum, { count }) => sum + count, 0);
};

const fetchDataBasedOnType = async (date, type, period) => {
    switch (type) {
        case "Offer":
            return fetchStatsData(date, 'OfferStats', period);
        case "Orders":
            return fetchStatsData(date, 'OrderStats', period);
        case "Payment":
            return fetchStatsData(date, 'PaidStats', period);
        default:
            return [];
    }
};

// Type and Period selectors component
const TypeAndPeriodSelectors = ({ period, setPeriod, type, setType, yearMonth, setYearMonth }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const screenWidth = Dimensions.get('window').width;

    // Generate options based on the period selection
    let yearMonthOptions;
    if (period === "Monthly") {
        yearMonthOptions = Array.from({ length: currentYear - 2013 + 1 }, (_, i) => {
            const year = currentYear - i;
            return { label: `${year}`, value: `${year}` };
        });
    } else {
        yearMonthOptions = Array.from({ length: 13 }, (_, i) => {
            const date = subMonths(currentDate, i);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            return { label: `${year}-${month}`, value: `${year}-${month}` };
        });
    }

    return (
        <Box flexDirection={screenWidth <= 960 ? 'column' : 'row'} space={3}>
            <Box marginX={'10px'}>
                <Text>Period</Text>
                <Select
                    selectedValue={period}
                    minWidth={120}
                    accessibilityLabel="Select Period"
                    placeholder="Select Period"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                    mt={1}
                    onValueChange={(value) => {
                        setPeriod(value);
                        // Update yearMonth when switching periods; set to currentYear if "Monthly" is selected
                        if (value === "Monthly") {
                            setYearMonth(currentYear.toString());  // Default to currentYear when "Monthly" is selected
                        } else {
                            setYearMonth('');  // Clear the selection otherwise
                        }
                    }}
                >
                    <Select.Item label="Daily" value="Daily" />
                    <Select.Item label="Weekly" value="Weekly" />
                    <Select.Item label="Monthly" value="Monthly" />
                </Select>
            </Box>
            <Box marginX={'10px'}>
                <Text>Type</Text>
                <Select
                    selectedValue={type}
                    minWidth={120}
                    accessibilityLabel="Select Type"
                    placeholder="Select Type"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                    mt={1}
                    onValueChange={(value) => setType(value)}
                >
                    <Select.Item label="Offer" value="Offer" />
                    <Select.Item label="Orders" value="Orders" />
                    <Select.Item label="Payment" value="Payment" />
                </Select>
            </Box>
            <Box marginX={'10px'}>
                <Text>{period === "Monthly" ? "Year" : "Year-Month"}</Text>
                <Select
                    selectedValue={yearMonth}
                    minWidth={120}
                    accessibilityLabel={`Select ${period === "Monthly" ? "Year" : "Year-Month"}`}
                    placeholder={`Select ${period === "Monthly" ? "Year" : "Year-Month"}`}
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                    mt={1}
                    onValueChange={(value) => setYearMonth(value)}
                >
                    {yearMonthOptions.map(option => (
                        <Select.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Select>
            </Box>
        </Box>
    );
};

const encryptData = (data) => {
    try {
        const secretKey = CRYPTO_KEY.toString();
        return AES.encrypt(data, secretKey).toString();
    } catch (error) {
        console.error("Error encrypting data:", error);
        // useNavigate(`/devadmin/chat-messages`);

        // Handle the encryption error or return a fallback
        return null; // or handle it in another appropriate way
    }
};

const handleChatPressNewTab = async (chatId) => {
    const encryptedChatId = encryptData(chatId);
    const encodedChatId = encodeURIComponent(encryptedChatId); // URL-encode the encrypted data

    // Assuming chatId is already properly encoded and needs no further encoding
    const path = `/top/chat-messages/${encodedChatId}`;
    // Construct the URL for hash-based routing
    const baseUrl = window.location.origin + window.location.pathname;
    const fullPath = `${baseUrl}#${path}`;
    window.open(fullPath, '_blank');

    // dispatch(setActiveChatId(chatId));

    // globalCustomerId = customerId;
    globalChatId = chatId;

    console.log(fullPath)
};

const renderModalContent = () => {
    const [displayedTransactions, setDisplayedTransactions] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const statsData = useSelector((state) => state.statsData);

    useEffect(() => {
        if (statsData && statsData.length > 0) {
            setDisplayedTransactions(statsData.slice(-5)); // Show the last 5 transactions
        }
    }, [statsData]);

    const loadMorePayments = () => {
        if (loadingMore) return; // Prevent multiple loads

        const remainingItems = statsData.length - displayedTransactions.length;
        const nextItemsCount = remainingItems >= 5 ? 5 : remainingItems;
        const nextItems = statsData.slice(statsData.length - displayedTransactions.length - nextItemsCount, statsData.length - displayedTransactions.length);

        if (nextItems.length === 0) return; // Stop loading if no new data

        setLoadingMore(true);

        setTimeout(() => { // Simulate network request
            setDisplayedTransactions((prevTransactions) => [...nextItems, ...prevTransactions]); // Prepend new items
            setLoadingMore(false);
        }, 500); // Adjust the timeout as needed
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    };

    return (

        <ScrollView
            style={{ flex: 1, paddingHorizontal: 5, maxHeight: 500 }}
            onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                    loadMorePayments();
                }
            }}
            scrollEventThrottle={400} // Adjust as needed
        >
            {displayedTransactions.slice().reverse().map((item, index) => {
                const isHovered = hoveredIndex === index;

                return (
                    <Pressable
                        key={index}
                        onPress={() => handleChatPressNewTab(`chat_${item.stockId}_${item.customerEmail}`)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            marginBottom: 15,
                            backgroundColor: isHovered ? '#F2F2F2' : '#FFFFFF',
                            borderRadius: 10,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 3,
                            padding: 5,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View>
                            <FastImage
                                source={{ uri: item.imageUrl, priority: FastImage.priority.normal }}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    alignSelf: 'center',
                                    margin: 10,
                                }}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                        </View>
                        <VStack>
                            <Text fontSize="14" fontWeight="bold" color="black" mb={1}>
                                <Text color="#0029A3" isTruncated>{item.customerName}</Text>
                            </Text>
                            <Text fontSize="14" fontWeight="bold" color="black" mb={1}>
                                <Text color="#0A78BE" isTruncated>{item.carName}</Text>
                            </Text>
                            <Text fontSize="14" fontWeight="bold" color="black" mb={1}>
                                <Text color="#333" isTruncated>{item.referenceNumber}</Text>
                            </Text>
                        </VStack>
                    </Pressable>
                );
            })}

            <View style={{ height: 20 }}>
                {loadingMore && <Spinner size='sm' color="#7B9CFF" />}
            </View>
        </ScrollView>
    );
};

const StatsModalComponent = () => {
    const dispatch = useDispatch();
    const statsModalVisible = useSelector((state) => state.statsModalVisible);

    return (

        <Modal isOpen={statsModalVisible} onClose={() => dispatch(setStatsModalVisible(false))} useRNModal>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header style={{ backgroundColor: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                    Transactions
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal.Content>
        </Modal>
    )
}

// StatsChart component






const DesktopChart = ({ data, period, minCount, maxCount, }) => {
    const dispatch = useDispatch();
    const [hoveredBarIndex, setHoveredBarIndex] = useState(null);


    const handleBarPress = (datum) => {

        dispatch(setStatsData(datum.data))
        dispatch(setStatsModalVisible(true));
        console.log(datum);
    };

    return (
        <VictoryChart
            width={1000}
            theme={VictoryTheme.material}
            domainPadding={{ x: period === 'Weekly' ? 40 : 20 }}

        >
            <VictoryAxis
                style={{ grid: { stroke: "#F3F3F3", strokeDasharray: "none" } }}  // Solid grid lines
            />
            <VictoryAxis
                dependentAxis
                style={{ grid: { stroke: "#F3F3F3", strokeDasharray: "none" } }}  // Solid grid lines
                tickFormat={(tick) => `${Math.round(tick)}`}  // Format ticks as whole numbers
            />
            <VictoryBar
                data={data}
                x="value"
                y="count"
                cornerRadius={7}
                style={{
                    data: {
                        fill: ({ datum, index }) => {
                            if (index === hoveredBarIndex) {
                                if (minCount === maxCount) return "#19b954 ";
                                if (datum.count === minCount) return "#FF9494";
                                if (datum.count === maxCount) return "#19b954";
                                return "#698DF8";
                            }; // Change color on hover
                            if (minCount === maxCount) return "#16A34A";
                            if (datum.count === minCount) return "#FF0000";
                            if (datum.count === maxCount) return "#16A34A";
                            return "rgba(6, 66, 244, 1)";
                        },
                        cursor: "pointer"  // Change cursor to hand
                    },
                    labels: {
                        fontSize: 12,
                        fill: ({ datum, index }) => {
                            if (index === hoveredBarIndex) {
                                if (minCount === maxCount) return "#19b954 ";
                                if (datum.count === minCount) return "#FF9494";
                                if (datum.count === maxCount) return "#19b954";
                                return "#698DF8";
                            };
                            if (minCount === maxCount) return "#16A34A";
                            if (datum.count === minCount) return "#FF0000";
                            if (datum.count === maxCount) return "#16A34A";
                            return "rgba(6, 66, 244, 1)";
                        }
                    }
                }}
                labels={({ datum }) => `${datum.count === 0 ? '' : datum.count}`}
                labelComponent={<VictoryLabel dy={-10} />}
                events={[
                    {
                        target: "data",
                        eventHandlers: {
                            onClick: (evt, clickedProps) => {
                                handleBarPress(clickedProps.datum);
                            },
                            onMouseOver: (evt, targetProps) => {
                                setHoveredBarIndex(targetProps.index);
                            },
                            onMouseOut: () => {
                                setHoveredBarIndex(null);
                            }
                        }
                    }
                ]}
            />
        </VictoryChart>
    );
};


const StatsChart = () => {
    const [data, setData] = useState([]);
    const [yearMonth, setYearMonth] = useState("");
    const [type, setType] = useState("Offer");
    const [period, setPeriod] = useState("Daily");
    const [currentTotal, setCurrentTotal] = useState(0);
    const [previousTotal, setPreviousTotal] = useState(0);
    const [currentMonthName, setCurrentMonthName] = useState("");
    const [previousMonthName, setPreviousMonthName] = useState("");
    const screenWidth = Dimensions.get('window').width;
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const effectiveDate = yearMonth || await fetchCurrentDate();
            if (!yearMonth) {
                setYearMonth(effectiveDate); // Initialize yearMonth if not set
            }
            const currentData = await fetchDataBasedOnType(effectiveDate, type, period); // Ensure fetchStatsData handles type correctly
            const processedData = processData(currentData, period);
            const currentTotal = calculateTotal(processedData);

            const previousDate = format(subMonths(parseISO(`${effectiveDate}-01`), 1), "yyyy-MM");
            const previousData = await fetchDataBasedOnType(previousDate, type, period);
            const processedPreviousData = processData(previousData, period);
            const previousTotal = calculateTotal(processedPreviousData);

            setData(processedData);
            console.log(processedData);
            setCurrentTotal(currentTotal);
            setPreviousTotal(previousTotal);
            if (period !== 'Monthly') {
                setCurrentMonthName(format(parseISO(`${effectiveDate}-01`), "MMMM"));
                setPreviousMonthName(format(parseISO(`${previousDate}-01`), "MMMM"));
            }

        };

        fetchData();
        dispatch(setLoadingModalVisible(false));
    }, [yearMonth, type, period]); // Dependencies to trigger re-fetching and re-processing

    const counts = data.map(d => d.count).filter(count => count !== 0);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);







    const MobileViewChart = () => {
        const maxValue = Math.max(...data.map(d => d.value));

        return (
            <Box
                flex={1}
                borderWidth={1}
                borderColor="#FFF"
                backgroundColor="#FFF"
                marginBottom={screenWidth <= 960 ? '1px' : '5px'}
                marginLeft={screenWidth <= 960 ? '1px' : '5px'}
                marginRight={screenWidth <= 960 ? '1px' : '5px'}
                borderRadius={5}
                padding={2}
            >
                <HStack space={4} mb={3} justifyContent="center">
                    <Box padding={2} backgroundColor="orange.100" borderRadius={5} alignItems="center">
                        <Text style={{ fontSize: 14, color: "orange.800", fontWeight: "bold" }}>{`${previousMonthName}: ${previousTotal}`}</Text>
                    </Box>
                    <Box padding={2} backgroundColor="blue.100" borderRadius={5} alignItems="center">
                        <Text style={{ fontSize: 14, color: "teal.800", fontWeight: "bold" }}>{`${currentMonthName}: ${currentTotal}`}</Text>
                    </Box>
                </HStack>
                <TypeAndPeriodSelectors
                    period={period}
                    setPeriod={setPeriod}
                    type={type}
                    setType={setType}
                    yearMonth={yearMonth}
                    setYearMonth={setYearMonth}
                />
                <VictoryChart
                    width={1000}
                    height={1500}  // Increased height for more space
                    theme={VictoryTheme.material}
                    domainPadding={{ y: period === 'Weekly' ? 60 : 40 }}
                >
                    <VictoryAxis
                        style={{ grid: { stroke: "#F3F3F3", strokeDasharray: "none" } }}  // Solid grid lines
                        tickFormat={(tick) => `${Math.round(tick)}`}  // Format ticks as whole numbers
                        domain={[0, maxValue]}  // Adjust domain to start at 0
                    />
                    <VictoryAxis
                        dependentAxis
                        style={{ grid: { stroke: "#F3F3F3", strokeDasharray: "none" } }}  // Solid grid lines
                        tickFormat={(tick) => tick}  // Format ticks as whole numbers
                        domain={[1, 0]}  // Reverse the domain to put 1 on top
                    />

                    <VictoryBar
                        data={data}
                        x="value"
                        y="count"
                        horizontal={true}
                        cornerRadius={8}
                        style={{
                            data: {
                                fill: ({ datum }) => {
                                    if (minCount === maxCount) return "#16A34A";
                                    if (datum.count === minCount) return "#FF0000";
                                    if (datum.count === maxCount) return "#16A34A";
                                    return "rgba(6, 66, 244, 1)";
                                }
                            },
                            labels: {
                                fontSize: 20, fill: ({ datum }) => {
                                    if (minCount === maxCount) return "#16A34A";
                                    if (datum.count === minCount) return "#FF0000";
                                    if (datum.count === maxCount) return "#16A34A";
                                    return "rgba(6, 66, 244, 1)";
                                }
                            }
                        }}
                        labels={({ datum }) => `${datum.count === 0 ? '' : datum.count}`}
                        labelComponent={<VictoryLabel dx={10} />}
                    />

                </VictoryChart>
            </Box>
        );
    };


    const DesktopViewChart = () => {


        return (
            <>
                <Box
                    flex={1}
                    borderWidth={1}
                    borderColor="#FFF"
                    backgroundColor="#FFF"
                    marginBottom={screenWidth <= 960 ? '1px' : '5px'}
                    marginLeft={screenWidth <= 960 ? '1px' : '5px'}
                    marginRight={screenWidth <= 960 ? '1px' : '5px'}
                    borderRadius={5}
                    padding={screenWidth <= 960 ? 2 : 5}
                >
                    <HStack space={4} mb={3} justifyContent="center">
                        <Box padding={2} backgroundColor="orange.100" borderRadius={5} alignItems="center">
                            <Text style={{ fontSize: 14, color: "orange.800", fontWeight: "bold" }}>{`${previousMonthName}: ${previousTotal}`}</Text>
                        </Box>
                        <Box padding={2} backgroundColor="blue.100" borderRadius={5} alignItems="center">
                            <Text style={{ fontSize: 14, color: "teal.800", fontWeight: "bold" }}>{`${currentMonthName}: ${currentTotal}`}</Text>
                        </Box>
                    </HStack>
                    <TypeAndPeriodSelectors
                        period={period}
                        setPeriod={setPeriod}
                        type={type}
                        setType={setType}
                        yearMonth={yearMonth}
                        setYearMonth={setYearMonth}
                    />
                    <DesktopChart data={data} period={period} minCount={minCount} maxCount={maxCount} />
                </Box>


            </>
        );
    }

    return (
        <>
            {screenWidth <= 960 ? <MobileViewChart /> : <DesktopViewChart />}
            <StatsModalComponent />
        </>
    );
};



const LogsNavigation = () => {

    const screenWidth = Dimensions.get('window').width;

    const dispatch = useDispatch();
    const [selectedButtonState, setSelectedButtonState] = useState(defaultSelectedButton);


    const handlePress = (button) => {
        if (button !== selectedButtonState) {
            dispatch(setLoadingModalVisible(true));
        }
        dispatch(setSelectedLogsButton(button));
        setSelectedButtonState(button);
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: screenWidth >= 960 ? '50%' : '90%' }}>

            <TouchableOpacity
                onPress={() => handlePress('stats')}
                style={{
                    borderRadius: 5,
                    flex: 1,
                    padding: 10,
                    margin: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: selectedButtonState === 'stats' ? '#0642F4' : 'transparent',
                    flexDirection: 'row',
                }}
            >
                <Ionicons
                    name="stats-chart" // The icon name from MaterialIcons
                    size={20} // Set the size of the icon
                    color={selectedButtonState === 'stats' ? 'white' : 'black'} // Set the color based on active state
                />
                <Text style={{ color: selectedButtonState === 'stats' ? 'white' : 'black', fontWeight: 'bold', marginLeft: 5, }}>Stats</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handlePress('logs')}
                style={{
                    borderRadius: 5,
                    flex: 1,
                    padding: 10,
                    margin: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: selectedButtonState === 'logs' ? '#0642F4' : 'transparent',
                    flexDirection: 'row',
                }}
            >
                <MaterialIcons
                    name="history" // The icon name from MaterialIcons
                    size={20} // Set the size of the icon
                    color={selectedButtonState === 'logs' ? 'white' : 'black'} // Set the color based on active state
                />
                <Text style={{ color: selectedButtonState === 'logs' ? 'white' : 'black', fontWeight: 'bold', marginLeft: 5, }}>Logs</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handlePress('currency')}
                style={{
                    borderRadius: 5,
                    flex: 1,
                    padding: 10,
                    margin: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: selectedButtonState === 'currency' ? '#0642F4' : 'transparent',
                    flexDirection: 'row',
                }}
            >
                <Ionicons
                    name="logo-yen"
                    size={20} // Set the size of the icon
                    color={selectedButtonState === 'currency' ? 'white' : 'black'} // Set the color based on active state
                />
                <Text style={{ color: selectedButtonState === 'currency' ? 'white' : 'black', fontWeight: 'bold', marginLeft: 5, }}>Currency</Text>
            </TouchableOpacity>

        </View>
    );
}


const NavigatePage = () => {
    const selectedLogsButton = useSelector((state) => state.selectedLogsButton);
    const screenWidth = Dimensions.get('window').width;

    if (selectedLogsButton === 'stats') {
        return <View style={{ flex: screenWidth <= 960 ? null : 1, }}><StatsChart /></View>;
    }
    if (selectedLogsButton === 'logs') {
        return <View style={{ flex: 1, }}><LogsTable /></View>;
    }
    if (selectedLogsButton === 'currency') {
        return <View><CurrencyConverterComponent /></View>;
    }
};

export default function Logs() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const loginName = useSelector((state) => state.loginName);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

    // const navigation = useNavigation();
    const navigate = useNavigate();

    const [isSelectedLogs, setIsSelectedLogs] = useState(true);
    const [isSelectedAddAccount, setIsSelectedAddAccount] = useState(false);
    const [isSelectedAccountList, setIsSelectedAccountList] = useState(false);
    const [typeOfAccount, setTypeOfAccount] = useState('');
    const [showModal, setShowModal] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [remainingTime, setRemainingTime] = useState(0);
    const [todayCurrency, setTodayCurrency] = useState('')
    const [timestampCurrency, setTimestampCurrency] = useState('');
    const [exchangeRate, setExchangeRate] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const [time, setTime] = useState('');
    const optionsPerPage = [13, 26, 52];
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const searchInput = useRef(null);
    const searchInputValue = searchInput.current?.value;


    const dispatch = useDispatch();





    useEffect(() => {

        const updateWidth = () => {
            const newWidth = Dimensions.get('window').width;
            setScreenWidth(newWidth); // Update the screenWidth state
        };

        // Add event listener for window resize
        Dimensions.addEventListener('change', updateWidth);

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
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                // navigation.navigate("Login")
                navigate("/Login");
            }

        })

        return unsubscribe
    }, []);












    const handleDocumentChange = (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            const isActive = data.active;

            if (!isActive) {
                signOut(auth)
                    .then(() => {
                        // navigation.navigate('Login');
                        navigate("/Login");

                    })
                    .catch((error) => {
                        console.error('Error signing out:', error);
                    });
            }
        } else {
            signOut(auth)
                .then(() => {
                    // navigation.navigate('Login');
                    navigate("/Login");

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
            // This will now always be a function
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
                dispatch(setLoginName(data.name));

            } else {
                console.log('Document does not exist');
            }
        } catch (error) {
            console.error('Error fetching field value:', error);
        }
    };





    const handleSignOut = () => {

        signOut(auth).then(() => {
            // navigation.navigate('Login');
            navigate("/Login");
            setEmail('');
            setName('');
        }).catch(() => {
            // An error happened.
        });


    }









    // const showDrawerIcon = useBreakpointValue([true, true, true, false]);


    // Function to hide the Popover

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
                        <Popover.Content backgroundColor={'#0642F4'}>
                            {/* <Popover.Arrow bgColor={'#7B9CFF'} /> */}
                            <Popover.Body backgroundColor={'#0642F4'}>
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
        <NativeBaseProvider>
            <SuccessModal />
            <Box bgColor="#A6BCFE" h="100vh" w="full" flexDirection="column">
                {/* Header */}
                <Box
                    px="3"
                    bgColor='#0642f4'
                    height={54}
                    position="sticky"
                    top={0}
                    zIndex={999}
                    flexDirection="row"
                    alignItems="center"
                    borderBottomWidth={0}
                    borderBottomColor={'cyan.500'} >

                    <SideDrawer
                        selectedScreen={selectedScreen} />

                    <Box w={[0, 0, 0, 850]} h={[10, 10, 10, 10]} marginBottom={1.5} marginTop={1.5} paddingLeft={5}>
                        <FastImage
                            source={{
                                uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FC-HUB%20LOGO%20FULL.png?alt=media&token=79ed34a5-f960-4154-b4e8-897b0f3248d4',
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                            style={styles.image}
                        />
                    </Box>
                    {/* 
                    {showDrawerIcon && <MobileViewDrawer
                        selectedScreen={selectedScreen} />} */}

                    {/* <Box w={[150, 200, 250, 0]} h={[6, 8, 10, 10]} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]} >
                        <FastImage
                            source={{
                                uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FC-HUB%20LOGO%20HALF.png?alt=media&token=7ce6aef2-0527-40c7-b1ce-e47079e144df',
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                            style={styles.image}
                        />
                    </Box> */}


                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <QRCodeScanner />
                    </View>

                    <NamePopover name={loginName} handleSignOut={handleSignOut} />

                </Box>

                {/* Content */}

                <View style={{ flex: 1, }}>

                    <LogsNavigation />


                    <NavigatePage />


                </View>

            </Box>
            <LoadingModal />
        </NativeBaseProvider>
    );
}

