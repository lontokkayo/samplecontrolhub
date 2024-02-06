import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, TextInput, Keyboard } from 'react-native';
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
import { setLoginName } from './redux/store';
import MobileViewDrawer from './SideDrawer/MobileViewDrawer';
import SideDrawer from './SideDrawer/SideDrawer';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import {
    OPEN_EXCHANGE_API_KEY
} from '@env';
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

import {
    setLogsData,
    setLoadingModalVisible,
} from './redux/store';
let selectedScreen = 'LOGS'
















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
                <Text style={{ color: 'white' }}>Loading, please wait!</Text>
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

            <View style={{ flexDirection: 'row', width: screenWidth < 960 ? '90%' : '30%', alignSelf: 'center', }}>

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
                flex={1}
                borderWidth={1}
                borderColor="gray.200"
                borderRadius={4}
                overflow="hidden"
                margin={1}
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


const MyBarChart = () => {
    const dataValues = [
        { day: 1, value: 30 },
        { day: 2, value: 45 },
        // ... add data for each day of the month
        { day: 31, value: 60 }
    ];

    return (
        <ScrollView style={{ flex: 1, margin: 5, borderRadius: 5, }}>
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={10}
                style={{
                    parent: {
                        backgroundColor: "#FFF", // White background
                    }
                }}
            >
                <VictoryAxis
                    style={{
                        axis: { stroke: "#757575" }, // Style for the axis itself
                        ticks: { stroke: "grey", size: 5 }, // Style for axis ticks
                        tickLabels: { fontSize: 10, padding: 5, fill: "grey" } // Style for the labels
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    style={{
                        axis: { stroke: "#757575" },
                        ticks: { stroke: "grey", size: 5 },
                        tickLabels: { fontSize: 10, padding: 5, fill: "grey" }
                    }}
                />
                <VictoryBar
                    data={dataValues}
                    x="day"
                    y="value"
                    style={{
                        data: {
                            fill: ({ datum }) => datum.value > 50 ? "#4178BE" : "#5AA9E6", // Blue shades for bars
                            width: 8 // Width of each bar
                        }
                    }}
                    barRatio={0.8} // Adjusts the width of the bars
                />
            </VictoryChart>
        </ScrollView>
    );
};


export default function Logs() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const loginName = useSelector((state) => state.loginName);

    // const navigation = useNavigation();

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

    const screenWidth = Dimensions.get('window').width;

    const dispatch = useDispatch();





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


                    <Box w={[150, 200, 250, 0]} h={[6, 8, 10, 10]} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]}>
                        <FastImage
                            source={{
                                uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FC-HUB%20LOGO%20HALF.png?alt=media&token=7ce6aef2-0527-40c7-b1ce-e47079e144df',
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                            style={styles.image}
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
                    <Box flex={1} flexGrow={1} minHeight={0} flexDirection={screenWidth <= 960 ? 'column' : 'row'}>
                        {/* Main Content Content */}



                        <Box flex={1}>
                            <CurrencyConverterComponent />
                            <MyBarChart />
                        </Box>



                        <Box flex={1} height={'100%'}>
                            <ScrollView flex={1}>
                                <LogsTable />
                            </ScrollView>


                        </Box>








                    </Box>
                </Box>
            </Box>
            <LoadingModal />
        </NativeBaseProvider>
    );
}



