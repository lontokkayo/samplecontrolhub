import {
    Box,
    Button,
    Flex,
    Image as NativeImage,
    Modal,
    NativeBaseProvider,
    Popover,
    Spinner,
    Text,
    VStack,
    Select,
    CheckIcon,
    Checkbox,
    Tooltip,
    Progress,
    Pressable as NativePressable,
} from 'native-base';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Animated,
    Easing,
    FlatList,
    ScrollView,
    TextInput,
    Image as RNImage,
    Pressable,
    Linking,
    Platform,
    Modal as RnModal,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import 'react-native-gesture-handler';
import Hyperlink from 'react-native-hyperlink';

import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons
} from 'react-native-vector-icons';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    setDoc,
    arrayUnion,
    updateDoc,
    query,
    getDocs,
    orderBy,
    startAfter,
    limit,
    where,
    increment,
    runTransaction,
    endBefore,
    limitToLast
} from 'firebase/firestore';
import moment from 'moment';
import './../style.css';
import { projectControlFirestore, projectControlAuth, projectExtensionFirestore } from "../../crossFirebase";
import FastImage from 'react-native-fast-image-web-support';
import SideDrawer from './SideDrawer/SideDrawer';
import { useSelector, useDispatch } from 'react-redux';
import {
    setCustomerListData,
    setLoadingModalVisible,
    setLoginName,
    setSelectedCustomerData
} from './redux/store';
import { HmacSHA256, enc } from 'crypto-js';
import { AES } from 'crypto-js';
import { CRYPTO_KEY, CRYPTO_KEY_API } from '@env';
import axios from 'axios';
// import { TextInput } from 'react-native-gesture-handler';
import { useNavigate } from 'react-router-dom';
import QRCodeScanner from './QrCodeScanner/QrCodeScanner';

// import { CollectionGroup } from 'firebase-admin/firestore';
const { width } = Dimensions.get('window');
let selectedScreen = 'CUSTOMER LIST'

let globalCustomerCarName = '';
let globalCustomerFirstName = '';
let globalCustomerLastName = '';

const mobileViewBreakpoint = 1367;

const nameVariable = {
    text: "",
};

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

// const Drawer = createDrawerNavigator();


const addLogToCollection = async (data) => {
    try {
        const logsCollectionRef = collection(projectControlFirestore, 'logs');

        // Add a new document to the "logs" collection
        await addDoc(logsCollectionRef, data);

        // console.log('Document added successfully!');
    } catch (error) {
        console.error('Error adding document:', error);
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
                <Text style={{ color: 'white' }} selectable={false}>Loading, please wait!</Text>
            </View>
        </View>

    );

}

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

const decryptData = (ciphertext) => {
    try {
        const secretKey = CRYPTO_KEY.toString();

        const bytes = AES.decrypt(ciphertext, secretKey);
        return bytes.toString(enc.Utf8);
    } catch (error) {
        console.error("Error decrypting data:", error);
        // useNavigate(`/devadmin/chat-messages`);

        // Handle the decryption error or return a fallback
        return null; // or handle it in another appropriate way
    }
};

const TransactionList = ({ displayedTransactions, handleChatPress, selectedCustomerData }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!Array.isArray(selectedCustomerData.transactions) || selectedCustomerData.transactions.length === 0) {
        return <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontStyle: 'italic' }}>No history to show</Text>;
    }


    function formatDate(dateString) {
        const cleanedDateString = dateString.replace(' at ', ' ');
        const date = new Date(cleanedDateString);

        if (isNaN(date.getTime())) {
            console.error("Invalid Date:", dateString);
            return "Invalid Date";
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');

        return `${year} ${month} ${day}`;
    }

    return displayedTransactions.map((transaction, index) => {
        const isHovered = hoveredIndex === index;

        return (
            <Pressable
                key={index}
                onPress={() => handleChatPress(`chat_${transaction.stockId}_${selectedCustomerData.textEmail}`)}
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
                        source={{ uri: transaction.imageUrl, priority: FastImage.priority.normal }}
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
                <View>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                        <Text style={{ color: '#0A78BE' }} selectable={false} numberOfLines={1} ellipsizeMode='tail'>
                            {transaction.carName}
                        </Text>
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                        <Text style={{ color: '#333' }} selectable={false} numberOfLines={1} ellipsizeMode='tail'>
                            {transaction.referenceNumber}
                        </Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: '#90949C', marginBottom: 5 }}>
                        <Text style={{ color: '#90949C' }} selectable={false} numberOfLines={1} ellipsizeMode='tail'>
                            {formatDate(transaction.dateOfTransaction)}
                        </Text>
                    </Text>
                </View>
            </Pressable>
        );
    });
};


const TransactionHistoryModal = () => {

    const [transactionHistoryVisible, setTransactionHistoryVisible] = useState(false);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const screenWidth = Dimensions.get('window').width;

    const navigate = useNavigate();
    const [displayedTransactions, setDisplayedTransactions] = useState(selectedCustomerData.transactions ? selectedCustomerData.transactions.slice(0, 5) : null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const hoverStyle = isHovered ? {
        backgroundColor: '#E8EAF6', // Lighter background color on hover
        // Any other style changes on hover
    } : {};

    const loadMorePayments = () => {
        if (loadingMore) return; // Prevent multiple loads

        setLoadingMore(true);
        const nextItems = selectedCustomerData.transactions.slice(
            displayedTransactions.length,
            displayedTransactions.length + 5
        );

        setTimeout(() => { // Simulate network request
            setDisplayedTransactions([...displayedTransactions, ...nextItems]);
            setLoadingMore(false);
        }, 500); // Adjust the timeout as needed
    };

    const handleTransactionHistoryModalOpen = () => {
        setDisplayedTransactions(selectedCustomerData.transactions ? selectedCustomerData.transactions.slice(0, 5) : null);
        setTransactionHistoryVisible(true);

    };

    const handleTransactionHistoryModalClose = () => {
        setTransactionHistoryVisible(false);
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    };

    const handleChatPress = (chatId) => {
        const encryptedChatId = encryptData(chatId);
        const encodedChatId = encodeURIComponent(encryptedChatId); // URL-encode the encrypted data
        // navigate(`/top/chat-messages/${encodedChatId}`);
        const path = `/top/chat-messages/${encodedChatId}`;
        // Construct the URL for hash-based routing
        const baseUrl = window.location.origin + window.location.pathname;
        const fullPath = `${baseUrl}#${path}`;
        window.open(fullPath, '_blank');
    }


    return (

        <>


            <Pressable onPress={handleTransactionHistoryModalOpen}>
                <Text style={{ fontSize: screenWidth < mobileViewBreakpoint ? 10 : 14, color: '#0A78BE', textAlign: 'center', }} underline>
                    {`View Transactions`}
                </Text>
            </Pressable>

            <Modal isOpen={transactionHistoryVisible} onClose={handleTransactionHistoryModalClose} useRNModal>
                <Modal.Content style={{ backgroundColor: 'white', borderRadius: 10 }}>
                    <Modal.CloseButton />
                    <Modal.Header style={{ backgroundColor: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                        Transactions History
                    </Modal.Header>
                    <Modal.Body>
                        <ScrollView
                            style={{ flex: 1, paddingHorizontal: 15, maxHeight: 500 }}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    loadMorePayments();
                                }
                            }}
                            scrollEventThrottle={400} // Adjust as needed
                        >

                            <TransactionList
                                displayedTransactions={displayedTransactions}
                                handleChatPress={handleChatPress}
                                selectedCustomerData={selectedCustomerData}
                            />

                            <View style={{ height: 20, }}>
                                {loadingMore && <Spinner size='sm' color="#7B9CFF" />}
                            </View>

                        </ScrollView>



                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>

    )
}

const OverbalanceHistoryModal = () => {
    const [overbalanceHistoryVisible, setOverbalanceHistoryVisible] = useState(false);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const screenWidth = Dimensions.get('window').width;

    const sortedOverbalances = selectedCustomerData.overbalanceHistory
        ? [...selectedCustomerData.overbalanceHistory].sort((a, b) => {
            const dateA = new Date(a.date.replace(' at ', ' '));
            const dateB = new Date(b.date.replace(' at ', ' '));
            return dateB - dateA; // Sorts in descending order
        })
        : [];

    const [displayedOverbalance, setDisplayedOverbalance] = useState(sortedOverbalances.slice(0, 5));
    const [loadingMore, setLoadingMore] = useState(false);

    const loadMorePayments = () => {
        if (loadingMore) return; // Prevent multiple loads

        setLoadingMore(true);
        const nextItems = sortedOverbalances.slice(
            displayedOverbalance.length,
            displayedOverbalance.length + 5
        );

        setTimeout(() => { // Simulate network request
            setDisplayedOverbalance([...displayedOverbalance, ...nextItems]);
            setLoadingMore(false);
        }, 500); // Adjust the timeout as needed
    };

    const handlePaymentHistoryModalOpen = () => {
        setDisplayedOverbalance(sortedOverbalances.slice(0, 5));
        setOverbalanceHistoryVisible(true);
    };

    const handlePaymentHistoryModalClose = () => {
        setOverbalanceHistoryVisible(false);
    };

    function formatDate(dateString) {
        const cleanedDateString = dateString.replace(' at ', ' ');
        const date = new Date(cleanedDateString);

        if (isNaN(date.getTime())) {
            console.error("Invalid Date:", dateString);
            return "Invalid Date";
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');

        return `${year} ${month} ${day}`;
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    };

    return (
        <>
            <Pressable onPress={handlePaymentHistoryModalOpen}>
                <MaterialCommunityIcons size={screenWidth < mobileViewBreakpoint ? 10 : 14} name={'history'} color={'#2C8AC7'} />
            </Pressable>

            <Modal isOpen={overbalanceHistoryVisible} onClose={handlePaymentHistoryModalClose} useRNModal>
                <Modal.Content style={{ backgroundColor: 'white', borderRadius: 10 }}>
                    <Modal.CloseButton />
                    <Modal.Header style={{ backgroundColor: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                        Overbalance History
                    </Modal.Header>
                    <Modal.Body>
                        <ScrollView
                            style={{ flex: 1, paddingHorizontal: 15, maxHeight: 500 }}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    loadMorePayments();
                                }
                            }}
                            scrollEventThrottle={400} // Adjust as needed
                        >
                            {
                                Array.isArray(sortedOverbalances) && sortedOverbalances.length > 0 ?
                                    displayedOverbalance.map((payment, index) => (

                                        <View key={index} style={{
                                            marginBottom: 15,
                                            backgroundColor: payment.type === 'Added' ? '#BBF7D0' : (payment.type === 'Reduced' ? '#EAC7D6' : '#F8F9FF'), // Card background color
                                            borderRadius: 10, // Rounded corners for the card
                                            shadowColor: '#000', // Shadow color
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 3, // Elevation for Android
                                            padding: 15, // Padding inside the card
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#eee',
                                        }}>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Date: </Text>
                                                <Text style={{ color: '#333' }}>
                                                    {formatDate(payment.date)}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Type: </Text>
                                                <Text style={{ color: '#333' }} italic>{payment.type}</Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Amount: </Text>
                                                <Text style={{ color: payment.type === 'Added' ? '#16A34A' : (payment.type === 'Reduced' ? '#FF0000' : '#000') }}>
                                                    ${Number(payment.amount).toLocaleString()}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Reason: </Text>
                                                <Text style={{ color: '#333' }}>{payment.reason}</Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Person in charge: </Text>
                                                <Text style={{ color: '#333' }}>{payment.personInCharge}</Text>
                                            </Text>


                                        </View>
                                    )) :
                                    <Text style={{ fontWeight: 'bold', alignSelf: 'center' }} italic>No history to show</Text>
                            }
                            <View style={{ height: 20 }}>
                                {loadingMore && <Spinner size='sm' color="#7B9CFF" />}
                            </View>
                        </ScrollView>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
}


const PaymentHistoryModal = () => {
    const [paymentHistoryVisible, setPaymentHistoryVisible] = useState(false);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const screenWidth = Dimensions.get('window').width;

    const sortedPayments = selectedCustomerData.paymentsHistory
        ? [...selectedCustomerData.paymentsHistory].sort((a, b) => {
            const dateA = new Date(a.date.replace(' at ', ' '));
            const dateB = new Date(b.date.replace(' at ', ' '));
            return dateB - dateA; // Sorts in descending order
        })
        : [];

    const [displayedPayments, setDisplayedPayments] = useState(sortedPayments.slice(0, 5));
    const [loadingMore, setLoadingMore] = useState(false);

    const loadMorePayments = () => {
        if (loadingMore) return; // Prevent multiple loads

        setLoadingMore(true);
        const nextItems = sortedPayments.slice(
            displayedPayments.length,
            displayedPayments.length + 5
        );

        setTimeout(() => { // Simulate network request
            setDisplayedPayments([...displayedPayments, ...nextItems]);
            setLoadingMore(false);
        }, 500); // Adjust the timeout as needed
    };

    const handlePaymentHistoryModalOpen = () => {
        setDisplayedPayments(sortedPayments.slice(0, 5));
        setPaymentHistoryVisible(true);
    };

    const handlePaymentHistoryModalClose = () => {
        setPaymentHistoryVisible(false);
    };

    function formatDate(dateString) {
        const cleanedDateString = dateString.replace(' at ', ' ');
        const date = new Date(cleanedDateString);

        if (isNaN(date.getTime())) {
            console.error("Invalid Date:", dateString);
            return "Invalid Date";
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');

        return `${year} ${month} ${day}`;
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    };

    return (
        <>
            <Pressable onPress={handlePaymentHistoryModalOpen}>
                <Text style={{ fontSize: screenWidth < mobileViewBreakpoint ? 10 : 14, color: '#0A78BE', textAlign: 'center' }} underline>
                    {`View Payments History`}
                </Text>
            </Pressable>

            <Modal isOpen={paymentHistoryVisible} onClose={handlePaymentHistoryModalClose} useRNModal>
                <Modal.Content style={{ backgroundColor: 'white', borderRadius: 10 }}>
                    <Modal.CloseButton />
                    <Modal.Header style={{ backgroundColor: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                        Payment History
                    </Modal.Header>
                    <Modal.Body>
                        <ScrollView
                            style={{ flex: 1, paddingHorizontal: 15, maxHeight: 500 }}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    loadMorePayments();
                                }
                            }}
                            scrollEventThrottle={400} // Adjust as needed
                        >
                            {
                                Array.isArray(sortedPayments) && sortedPayments.length > 0 ?
                                    displayedPayments.map((payment, index) => (

                                        <View key={index} style={{
                                            marginBottom: 15,
                                            backgroundColor: '#F8F9FF', // Card background color
                                            borderRadius: 10, // Rounded corners for the card
                                            shadowColor: '#000', // Shadow color
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 3, // Elevation for Android
                                            padding: 15, // Padding inside the card
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#eee',
                                        }}>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Date: </Text>
                                                <Text style={{ color: '#333' }}>
                                                    {formatDate(payment.date)}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Value: </Text>
                                                <Text style={{ color: Number(payment.value).toLocaleString().startsWith('-') ? '#FF0000' : '#16A34A' }}>
                                                    ${Number(payment.value).toLocaleString()}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Vehicle Name: </Text>
                                                <Text style={{ color: '#333' }}>{payment.vehicleName}</Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE' }}>Reference Number: </Text>
                                                <Text style={{ color: '#333' }}>{payment.vehicleRef}</Text>
                                            </Text>

                                        </View>
                                    )) :
                                    <Text style={{ fontWeight: 'bold', alignSelf: 'center' }} italic>No history to show</Text>
                            }
                            <View style={{ height: 20 }}>
                                {loadingMore && <Spinner size='sm' color="#7B9CFF" />}
                            </View>
                        </ScrollView>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
}

let manageOverbalanceActiveButton;
let manageOverbalanceAmountInput;
let manageOverbalanceReasonInput;

const ManageOverbalanceForm = ({ amountInputRef, reasonInputRef, handleAmountChange }) => {

    const [activeButton, setActiveButton] = useState(null);

    const handleAddPress = useCallback(() => {
        setActiveButton('add');
        manageOverbalanceActiveButton = 'add';


    }, [activeButton, setActiveButton]);

    const handleReducePress = useCallback(() => {
        setActiveButton('reduce');
        manageOverbalanceActiveButton = 'reduce';

    }, [activeButton, setActiveButton]);


    return (
        <>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20
            }}>

                <Pressable
                    style={({ hovered }) => ({
                        flex: 1,
                        padding: 10,
                        marginHorizontal: 5,
                        borderRadius: 5,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: activeButton === 'add' ? 'transparent' : '#899c89',
                        backgroundColor: activeButton === 'add' ? 'green' : (hovered ? '#e6faeb' : 'white'),
                    })}
                    onPress={handleAddPress}
                >
                    <Text selectable={false} style={{
                        color: activeButton === 'add' ? 'white' : '#899c89',
                        fontWeight: 'bold'
                    }}>(+) Add</Text>
                </Pressable>

                <Pressable
                    style={({ hovered }) => ({
                        flex: 1,
                        padding: 10,
                        marginHorizontal: 5,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: activeButton === 'reduce' ? 'transparent' : '#9c8181',
                        alignItems: 'center',
                        backgroundColor: activeButton === 'reduce' ? 'red' : (hovered ? '#fae6e6' : 'white'),
                    })}
                    onPress={handleReducePress}
                >
                    <Text selectable={false} style={{
                        color: activeButton === 'reduce' ? 'white' : '#9c8181',
                        fontWeight: 'bold'
                    }}>(-) Reduce</Text>
                </Pressable>

            </View>

            {(activeButton == 'add' || activeButton == 'reduce') && <>
                <TextInput
                    ref={amountInputRef}
                    onChangeText={handleAmountChange}
                    placeholderTextColor='#9B9E9F'
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 20,
                        outlineStyle: 'none',
                    }}
                    placeholder="Amount"
                    keyboardType="numeric"
                />
                <TextInput
                    ref={reasonInputRef}
                    onChangeText={(text) => {
                        manageOverbalanceReasonInput = text;
                    }}
                    placeholderTextColor='#9B9E9F'
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 20,
                        outlineStyle: 'none',
                    }}
                    placeholder="Reason (optional)"
                />
            </>}
        </>
    )
}

const ManageOverbalance = () => {

    const [manageOverbalanceVisible, setManageOverbalanceVisible] = useState(false);
    const [confirmIsLoading, setConfirmIsLoading] = useState(false);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const loginName = useSelector((state) => state.loginName);
    const screenWidth = Dimensions.get('window').width;


    const overbalanceRef = useRef(null);
    const amountInputRef = useRef(null);
    const reasonInputRef = useRef(null);


    const handleConfirm = async () => {
        setConfirmIsLoading(true);
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const docRefCustomer = doc(projectExtensionFirestore, 'accounts', selectedChatData.participants.customer);

        if (manageOverbalanceActiveButton === 'add' && Number(manageOverbalanceAmountInput) > 0 && amountInputRef.current.value !== '') {
            await updateDoc(docRefCustomer, {
                overbalance: increment(Number(manageOverbalanceAmountInput)),
                overbalanceHistory: arrayUnion({
                    date: formattedTime,
                    type: 'Added',
                    amount: manageOverbalanceAmountInput,
                    reason: manageOverbalanceReasonInput,
                    personInCharge: loginName,
                }),
            });
            console.log('Overbalance Added');
            setConfirmIsLoading(false);
            handleManageOverbalanceModalClose();
        }

        else if (manageOverbalanceActiveButton === 'reduce' && Number(manageOverbalanceAmountInput) > 0 && amountInputRef.current.value !== '') {
            await updateDoc(docRefCustomer, {
                overbalance: increment(-Number(manageOverbalanceAmountInput)), // decrement the overbalance
                overbalanceHistory: arrayUnion({
                    date: formattedTime,
                    type: 'Reduced',
                    amount: manageOverbalanceAmountInput,
                    reason: manageOverbalanceReasonInput,
                    personInCharge: loginName,
                }),
            });
            console.log('Overbalance Reduced');
            setConfirmIsLoading(false);
            handleManageOverbalanceModalClose();

        }

        else {
            setConfirmIsLoading(false);
            console.log('Error Adding/Reducing overbalance');
            return null;
        }
    }


    const handleAmountChange = (value) => {
        let numericValue = value.replace(/[^0-9]/g, '');

        if (numericValue.startsWith('0') && numericValue.length > 1) {
            numericValue = numericValue.slice(1);
        }


        if (amountInputRef.current) {
            amountInputRef.current.value = Number(numericValue).toLocaleString('en-US');
            manageOverbalanceAmountInput = Number(numericValue);
        }

        if (manageOverbalanceActiveButton === 'add') {
            const newBalance = Math.round(Number(numericValue) + Number(selectedCustomerData.overbalance));
            overbalanceRef.current.value = `$${newBalance.toLocaleString('en-US')}`;
            console.log(newBalance.toLocaleString('en-US'));
        }

        if (manageOverbalanceActiveButton === 'reduce') {
            const newBalance = Math.round(Number(selectedCustomerData.overbalance) - Number(numericValue));
            overbalanceRef.current.value = `$${newBalance.toLocaleString('en-US')}`;
            console.log(newBalance.toLocaleString('en-US'));
        }
    };




    const handleManageOverbalanceModalOpen = () => {
        setManageOverbalanceVisible(true);

    };

    const handleManageOverbalanceModalClose = () => {
        if (confirmIsLoading == false) {
            setManageOverbalanceVisible(false);
            manageOverbalanceActiveButton = null;
        }

    };




    return (

        <>

            <Pressable onPress={handleManageOverbalanceModalOpen}>
                <Text selectable={false} style={{ fontSize: screenWidth < mobileViewBreakpoint ? 10 : 14, color: '#0A78BE', textAlign: 'center', }} underline>
                    {`Manage Overbalance`}
                </Text>
            </Pressable>

            <Modal isOpen={manageOverbalanceVisible} onClose={handleManageOverbalanceModalClose} useRNModal>
                <Modal.Content style={{ backgroundColor: 'white', borderRadius: 10, }}>
                    <Modal.CloseButton />
                    <Modal.Header style={{ backgroundColor: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                        Manage Overbalance
                    </Modal.Header>
                    <Modal.Body>
                        <ScrollView
                            style={{ flex: 1, maxHeight: 720 }}
                        >
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white'
                            }}>
                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 12 : 18, }}>Total</Text>
                                <TextInput
                                    disabled={screenWidth > mobileViewBreakpoint}
                                    ref={overbalanceRef}
                                    editable={false}
                                    defaultValue={`$${selectedCustomerData.overbalance ? Number(selectedCustomerData.overbalance).toLocaleString('en-US', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        useGrouping: true
                                    }) : 0}`}
                                    style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 14 : 24, color: '#990000', textAlign: 'center', }} />

                                <View style={{
                                    width: '100%',
                                    backgroundColor: 'white',
                                    padding: 20,
                                }}>

                                    <ManageOverbalanceForm amountInputRef={amountInputRef} reasonInputRef={reasonInputRef} handleAmountChange={handleAmountChange} />

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Pressable
                                            style={({ hovered }) => ({
                                                flex: 1,
                                                padding: 5,
                                                marginHorizontal: 5,
                                                borderRadius: 5,
                                                alignItems: 'center',
                                                backgroundColor: hovered ? '#616060' : 'grey',
                                            })}
                                            onPress={handleManageOverbalanceModalClose}
                                        >
                                            <Text selectable={false} style={{
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}>Cancel</Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={handleConfirm}
                                            style={({ hovered }) => ({
                                                flex: 1,
                                                padding: 5,
                                                marginHorizontal: 5,
                                                borderRadius: 5,
                                                alignItems: 'center',
                                                backgroundColor: hovered ? '#030380' : 'blue',
                                            })}
                                        >
                                            {confirmIsLoading ?
                                                (
                                                    <Spinner
                                                        animating
                                                        size="sm"
                                                        color={'white'}
                                                    />
                                                ) :

                                                (<Text selectable={false} style={{
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}>Confirm</Text>

                                                )
                                            }
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>


                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>

    )
}

const CustomerProfileModal = ({ email }) => {
    const [customerData, setCustomerData] = useState(false);
    const [customerModalVisible, setCustomerModalVisible] = useState(false);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const screenWidth = Dimensions.get('window').width;
    const docRef = doc(projectExtensionFirestore, 'accounts', email);
    const dispatch = useDispatch();

    const handleModalOpen = () => {
        setCustomerModalVisible(true);
    }

    const handleModalClose = () => {
        setCustomerModalVisible(false);
    }

    const totalPaymentValue = selectedCustomerData.paymentsHistory
        ? selectedCustomerData.paymentsHistory.reduce((sum, payment) => {
            const value = Number(payment.value);
            return sum + (isNaN(value) ? 0 : value);
        }, 0)
        : 0;

    useEffect(() => {
        if (customerModalVisible) {
            const unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setCustomerData(data ? data : {});
                    dispatch(setSelectedCustomerData(data ? data : {}))
                    console.log(data)
                } else {
                    console.log("Document not found");
                }
            }, (error) => {
                console.error("Error fetching document: ", error);
            });

            // Clean up function to unsubscribe from the listener when the component unmounts
            return () => unsubscribe();
        }
    }, [customerModalVisible])

    return (
        <>
            <Pressable
                onPress={handleModalOpen}
                style={({ hovered }) => ({
                    marginTop: 3,
                    paddingVertical: 3,
                    alignItems: 'center', // Center items vertically
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: hovered ? '#0772ad' : '#0A8DD5',
                    justifyContent: 'center',
                })}
            >
                <Text style={{ color: 'white', fontWeight: 700, }}>Preview</Text>
            </Pressable>

            <Modal
                isOpen={customerModalVisible}
                onClose={handleModalClose}
                size={'lg'}

            >
                <Modal.Content background={'white'}>

                    <Modal.Body>

                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                            }}>

                            <View style={{
                                borderRadius: 10,
                                backgroundColor: '#F8F9FF',
                                width: screenWidth < mobileViewBreakpoint ? '100%' : '90%',
                                alignItems: 'center',
                                paddingBottom: 15,

                            }}>

                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 24 : 26, color: '#0A78BE', }} selectable>
                                    {`${selectedCustomerData.textFirst} ${selectedCustomerData.textLast}`}
                                </Text>

                                <Text style={{ fontSize: screenWidth < mobileViewBreakpoint ? 12 : 14, color: '#6F6F6F', width: '45%', textAlign: 'center', }} selectable>
                                    {`${selectedCustomerData.textZip}, ${selectedCustomerData.textStreet}, ${selectedCustomerData.city}, ${selectedCustomerData.country}`}
                                </Text>

                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        paddingTop: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >

                                    <Text style={{ fontSize: screenWidth < mobileViewBreakpoint ? 12 : 14, color: '#6F6F6F', textAlign: 'center', paddingTop: 2, }} selectable>
                                        {`${selectedCustomerData.textPhoneNumber}`}
                                    </Text>

                                    {/* Separator */}

                                    <View style={{
                                        height: '100%', // Full height of the parent View
                                        width: 2, // Width of the line
                                        backgroundColor: '#DCDCDC', // Line color
                                        marginHorizontal: 10, // Space on the sides of the line
                                    }} />

                                    <Hyperlink
                                        linkDefault={true}
                                        linkStyle={{ color: '#8A64F6', fontSize: screenWidth < mobileViewBreakpoint ? 12 : 14 }}

                                    >
                                        <Text style={{ textAlign: 'center' }} selectable>
                                            {selectedCustomerData.textEmail}
                                        </Text>
                                    </Hyperlink>

                                </View>


                            </View>

                        </View>

                        <View
                            style={{
                                width: screenWidth < mobileViewBreakpoint ? '100%' : '90%',
                                justifyContent: 'center',
                                marginTop: 50,
                                flexDirection: 'row',
                                alignSelf: 'center',
                            }}>

                            <View style={{ flex: 1, alignItems: 'center', }}>

                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 14 : 24, color: '#009922', textAlign: 'center', }} selectable>
                                    {`$${(totalPaymentValue).toLocaleString('en-US', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        useGrouping: true
                                    })}`}
                                </Text>

                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 12 : 16, color: '#5E4343', textAlign: 'center', }}>
                                    {`Total Payment`}
                                </Text>

                                <PaymentHistoryModal />

                            </View>


                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 14 : 24, color: '#990000', textAlign: 'center', }} selectable>
                                    {`$${selectedCustomerData.overbalance ? Number(selectedCustomerData.overbalance).toLocaleString('en-US', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        useGrouping: true
                                    }) : 0}`}
                                </Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 12 : 16, color: '#5E4343', textAlign: 'center', marginRight: 2, }}>
                                        {`Overbalance`}
                                    </Text>
                                    <OverbalanceHistoryModal />
                                </View>


                                <ManageOverbalance />

                            </View>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 14 : 24, color: '#0029A3', textAlign: 'center', }} selectable>
                                    {`${selectedCustomerData.transactions ? (selectedCustomerData.transactions).length : 0}`}
                                </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 12 : 16, color: '#5E4343', textAlign: 'center', }}>
                                    {`Transactions`}
                                </Text>

                                <TransactionHistoryModal />

                            </View>

                        </View>

                    </Modal.Body>


                </Modal.Content>
            </Modal>




        </>

    )
}

const CustomerListTable = () => {
    const screenWidth = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    // const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const searchInputRef = useRef(null);
    const [lastVisible, setLastVisible] = useState(null);
    const [firstVisible, setFirstVisible] = useState(null);
    const [searchText, setSearchText] = useState('');
    // Memoize the filtered data using useMemo
    const [sortField, setSortField] = useState('textEmail'); // null when sorting is off
    const [isSortActive, setIsSortActive] = useState(false);
    const loginName = useSelector((state) => state.loginName);
    const customerListData = useSelector((state) => state.customerListData);

    nameVariable.text = loginName;



    const fetchWithSort = async () => {
        const fieldToSortBy = isSortActive && sortField ? sortField : 'textEmail';
        const sortDirection = isSortActive ? 'desc' : 'asc';
        let q;

        if (searchText === '') {
            q = query(
                collection(projectExtensionFirestore, 'accounts'),
                orderBy(fieldToSortBy, sortDirection),
                limit(pageSize)
            );
        } else {
            q = query(
                collection(projectExtensionFirestore, 'accounts'),
                orderBy(fieldToSortBy, sortDirection),
                where('keywords', 'array-contains', searchText),
                limit(pageSize)
            );
        }

        try {
            const documents = await getDocs(q);
            const accountsData = [];
            documents.forEach((document) => {
                accountsData.push({
                    id: document.id,
                    ...document.data(),
                });
            });

            dispatch(setCustomerListData(accountsData));
            setLastVisible(documents.docs[documents.docs.length - 1]);
            setFirstVisible(documents.docs[0]);
        } catch (error) {
            console.error("Error fetching vehicle products:", error);
        } finally {
            dispatch(setLoadingModalVisible(false));
        }
    };


    useEffect(() => {
        fetchWithSort();
    }, [sortField])



    useEffect(() => {
        // Determine the field and direction to sort by
        const fieldToSortBy = isSortActive && sortField ? sortField : 'textEmail';
        const sortDirection = isSortActive ? 'desc' : 'asc';

        // Define the query
        const q = query(
            collection(projectExtensionFirestore, 'accounts'),
            orderBy(fieldToSortBy, sortDirection),
            limit(pageSize)
        );

        // Fetch the data once
        getDocs(q)
            .then((documents) => {
                const accountsData = [];
                documents.forEach((document) => {
                    accountsData.push({
                        id: document.id,
                        ...document.data(),
                    });
                });
                console.log(accountsData);

                dispatch(setCustomerListData(accountsData));
                setLastVisible(documents.docs[documents.docs.length - 1]);
                setFirstVisible(documents.docs[0]);
            })
            .catch((error) => {
                console.error("Error fetching vehicle products: ", error);
                // Handle the error appropriately
            });

        // Since this effect does not subscribe to real-time updates, there's no need to return a cleanup function
    }, [projectExtensionFirestore, pageSize, sortField, isSortActive]); // Add dependencies as necessary



    const fetchNextData = async () => {
        const fieldToSortBy = isSortActive && sortField ? sortField : 'textEmail';
        const sortDirection = isSortActive ? 'desc' : 'asc';


        if (searchText === '') {


            const q = query(
                collection(projectExtensionFirestore, 'accounts'),
                orderBy(fieldToSortBy, sortDirection),
                startAfter(lastVisible),
                limit(pageSize)
            );

            const documents = await getDocs(q);
            updateState(documents, 'next');



            dispatch(setLoadingModalVisible(false));


        }

        else {
            const q = query(
                collection(projectExtensionFirestore, 'accounts'),
                orderBy(fieldToSortBy, sortDirection),
                where('keywords', 'array-contains', searchText),
                startAfter(lastVisible),
                limit(pageSize)
            );

            const documents = await getDocs(q);
            updateState(documents, 'next');



            dispatch(setLoadingModalVisible(false));
        }

    };


    const fetchPreviousData = async () => {
        const fieldToSortBy = isSortActive && sortField ? sortField : 'textEmail';
        const sortDirection = isSortActive ? 'desc' : 'asc';

        if (searchText === '') {

            const q = query(
                collection(projectExtensionFirestore, 'accounts'),
                orderBy(fieldToSortBy, sortDirection),
                endBefore(firstVisible),
                limitToLast(pageSize)
            );


            const documents = await getDocs(q);
            updateState(documents, 'prev')
            dispatch(setLoadingModalVisible(false));

        }

        else {

            const q = query(
                collection(projectExtensionFirestore, 'accounts'),
                orderBy(fieldToSortBy, sortDirection),
                where('keywords', 'array-contains', searchText),
                endBefore(firstVisible),
                limitToLast(pageSize)
            );

            const documents = await getDocs(q);
            updateState(documents, 'prev');
            dispatch(setLoadingModalVisible(false));

        }


    }



    const fetchFirstPage = (documents) => {


        const accountsData = [];

        documents.forEach((document) => {
            accountsData.push({
                id: document.id,
                ...document.data(),
            });
        });

        dispatch(setCustomerListData(accountsData));

        if (documents?.docs[0]) {
            setFirstVisible(documents.docs[0]);
        }
        if (documents?.docs[documents.docs.length - 1]) {
            setLastVisible(documents.docs[documents.docs.length - 1]);
        }





    }

    const updateState = async (documents, pageClicked) => {


        if (!documents.empty) {
            const accountsData = [];
            documents.forEach((document) => {
                accountsData.push({
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
            if (accountsData.length < 1) {
                dispatch(setLoadingModalVisible(false));

            }

            dispatch(setCustomerListData(accountsData));
        }

        else {
            const fieldToSortBy = isSortActive && sortField ? sortField : 'textEmail';
            const sortDirection = isSortActive ? 'desc' : 'asc';

            if (searchText == '') {
                setCurrentPage(1);

                const q = query(
                    collection(projectExtensionFirestore, 'accounts'),
                    orderBy(fieldToSortBy, sortDirection),
                    limit(pageSize)
                );
                const firstPageDocuments = await getDocs(q);
                fetchFirstPage(firstPageDocuments);

            }
            else {

                setCurrentPage(1);

                const q = query(
                    collection(projectExtensionFirestore, 'accounts'),
                    where('keywords', 'array-contains', searchText),
                    orderBy(fieldToSortBy, sortDirection),
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

    }, [searchText])

    const searchData = async () => {

        dispatch(setLoadingModalVisible(true));

        if (searchText === '') {
            setCurrentPage(1);
            const q = query(
                collection(projectExtensionFirestore, 'accounts'),
                orderBy('textEmail', 'asc'),
                limit(pageSize)
            );

            const firstPageDocuments = await getDocs(q);
            fetchFirstPage(firstPageDocuments);
            dispatch(setLoadingModalVisible(false));



        }

        else {
            setCurrentPage(1);
            const q = query(
                collection(projectExtensionFirestore, 'accounts'),
                where('keywords', 'array-contains', searchText),
                orderBy('textEmail', 'asc'),
                limit(pageSize)
            );

            const firstPageDocuments = await getDocs(q);
            fetchFirstPage(firstPageDocuments);
            dispatch(setLoadingModalVisible(false));
        }
    };


    // Function to handle input changes for each item


    const handleSearchEnter = () => {
        // setSortField('textEmail');
        // setIsSortActive(false)
        if (searchInputRef.current?.value !== '') {
            setSearchText(searchInputRef.current.value.trim());
            setSortField('textEmail');
            setIsSortActive(false);
        }
        else {
            setSearchText('');
            setSortField('textEmail');
            setIsSortActive(false)
            if (searchText == '') {

                searchData();

            }



        }

    }


    return (
        <>

            {screenWidth >= 1360 ?
                (
                    <View style={{ flex: 1, }}>
                        <View>
                            <TextInput ref={searchInputRef} style={{ outlineStyle: 'none', width: '100%', padding: 10, backgroundColor: 'white', borderRadius: 5, placeholderTextColor: '#ACADA3', }}
                                onSubmitEditing={handleSearchEnter}
                                placeholder='Search'
                                returnKeyType='search'
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
                                <Text style={{ color: 'white', }} bold>Email</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={{ color: 'white', }} bold>Name</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={{ color: 'white', }} bold>Phone Number</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={{ color: 'white', }} bold>Address</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={{ color: 'white', }} bold>City</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={{ color: 'white', }} bold>Country</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2, alignItems: 'center', }}>
                                <Text style={{ color: 'white', }} bold>Operate</Text>
                            </View>
                        </View>
                        {customerListData.map((item) => (
                            <View
                                key={item.id}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#E4E4E7',
                                    backgroundColor: '#BFDBFE',
                                    paddingVertical: 10,
                                }}>
                                <View style={{ flex: 1 }}>
                                    <Text selectable style={{ width: '90%', marginLeft: 3, }}>{item.textEmail}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text selectable style={{ width: '90%', marginLeft: 3, }}>{`${item.textFirst} ${item.textLast}`}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text selectable style={{ width: '90%', marginLeft: 3, }}>{item.textPhoneNumber}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text selectable style={{ width: '90%', marginLeft: 3, }}>{`${item.textStreet} ${item.textZip}`}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text selectable style={{ width: '90%', marginLeft: 3, }}>{item.city}</Text>
                                </View>
                                <View style={{ flex: 1, }}>
                                    <Text selectable style={{ width: '90%', marginLeft: 3, }}>{item.country}</Text>
                                </View>
                                <View style={{ flex: 1, }}>
                                    <CustomerProfileModal email={item.textEmail} />
                                </View>


                            </View>
                        ))}

                        <View style={{
                            flexDirection: 'row', width: screenWidth < 460 ? '90%' : screenWidth < 1175 ? '40%' : '20%',
                            alignSelf: 'center',
                        }}>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Pressable
                                    style={{ display: currentPage <= 1 ? 'none' : 'flex' }}
                                    onPress={handlePreviousPage}>
                                    <View style={{ backgroundColor: 'rgba(6, 66, 244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                                        <MaterialIcons name='navigate-before' size={40} color={'white'} />
                                    </View>
                                </Pressable>
                            </View>


                            <View style={{ flex: 1, backgroundColor: 'rgba(6, 66, 244, 0.6)', borderRadius: 5, margin: 10, padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: 'white' }} bold>Page {currentPage}</Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
                                <Pressable
                                    onPress={handleNextPage}>
                                    <View style={{ backgroundColor: 'rgba(6,66,244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                                        <MaterialIcons name='navigate-next' size={40} color={'white'} />
                                    </View>
                                </Pressable>
                            </View>
                        </View>



                    </View>
                ) :



                (
                    <View style={{ flex: 1, }}>
                        <View >
                            <TextInput ref={searchInputRef} style={{ outlineStyle: 'none', width: '98%', padding: 10, backgroundColor: 'white', borderRadius: 5, placeholderTextColor: '#ACADA3', alignSelf: 'center', marginTop: 5, }}
                                onSubmitEditing={handleSearchEnter}
                                placeholder='Search'
                                returnKeyType='search'
                                autoCapitalize='none'
                            />
                        </View>

                        {customerListData.map((item) => (
                            <View
                                key={item.id}
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    borderWidth: 1,
                                    borderColor: '#E4E4E7',
                                    backgroundColor: '#BFDBFE',
                                    margin: 10,
                                }}>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text style={{ color: 'white', }} bold>Email</Text>
                                    </View>
                                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text selectable style={{ marginLeft: 3 }}>{item.textEmail}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text style={{ color: 'white', }} bold>Name</Text>
                                    </View>
                                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text selectable style={{ marginLeft: 3 }}>{`${item.textFirst} ${item.textLast}`}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text style={{ color: 'white', }} bold>Phone Number</Text>
                                    </View>
                                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text selectable style={{ marginLeft: 3 }}>{`${item.textPhoneNumber}`}</Text>
                                    </View>
                                </View>


                            </View>
                        ))}

                        <View style={{
                            flexDirection: 'row', width: screenWidth < 460 ? '90%' : screenWidth < 1175 ? '40%' : '20%',
                            alignSelf: 'center',
                        }}>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Pressable
                                    style={{ display: currentPage <= 1 ? 'none' : 'flex' }}
                                    onPress={handlePreviousPage}>
                                    <View style={{ backgroundColor: 'rgba(6, 66, 244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                                        <MaterialIcons name='navigate-before' size={40} color={'white'} />
                                    </View>
                                </Pressable>
                            </View>


                            <View style={{ flex: 1, backgroundColor: 'rgba(6, 66, 244, 0.6)', borderRadius: 5, margin: 10, padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: 'white' }} bold>Page {currentPage}</Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
                                <Pressable
                                    onPress={handleNextPage}>
                                    <View style={{ backgroundColor: 'rgba(6,66,244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                                        <MaterialIcons name='navigate-next' size={40} color={'white'} />
                                    </View>
                                </Pressable>
                            </View>

                        </View>

                    </View>

                )}




        </>


    );

}






export default function CustomerList() {
    const [email, setEmail] = useState('');
    // const navigation = useNavigation();
    const navigate = useNavigate();

    const loginName = useSelector((state) => state.loginName);
    const loginAccountType = useSelector((state) => state.loginAccountType);

    const [name, setName] = useState(loginName);

    const dispatch = useDispatch();


    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {

        const updateWidth = () => {
            const newWidth = Dimensions.get('window').width;
            setScreenWidth(newWidth); // Update the screenWidth state
        };

        // Add event listener for window resize
        Dimensions.addEventListener('change', updateWidth);

        // Clean up the event listener when the component unmounts or re-renders
        return () => {
            Dimensions.removeEventListener('change', updateWidth);
        };
    }, []);



    useEffect(() => {
        const unsubscribe = projectControlAuth.onAuthStateChanged(user => {
            if (!user) {
                // navigation.navigate("Login")
                navigate("/Login");

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
                        // navigation.navigate('Login');
                        navigate("/Login");

                    })
                    .catch((error) => {
                        console.error('Error signing out:', error);
                    });
            }
        } else {
            signOut(projectControlAuth)
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
        const userId = projectControlAuth.currentUser?.email;
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


    const listenForNameChange = () => {


        // To stop listening for updates, you can call unsubscribe()
        // unsubscribe();
    };



    const getFieldValueByEmail = async (email) => {
        try {
            const accountDocRef = doc(firestore, 'accounts', email);
            const accountDocSnapshot = await getDoc(accountDocRef);

            if (accountDocSnapshot.exists()) {
                const data = accountDocSnapshot.data();
                dispatch(setLoginName(data.name));

            } else {
                console.log('Document does not exist');
            }
        } catch (error) {
            console.error('Error fetching field value:', error);
        }
    };



    const handleSignOut = () => {

        signOut(projectControlAuth).then(() => {
            // navigation.navigate('Login');
            navigate("/Login");

            setEmail('');
            setName('');
        }).catch(() => {
            // An error happened.
        });


    }


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
            <>

                <View style={{ backgroundColor: "#A6BCFE", height: '100%', width: '100%', flexDirection: 'column', }} bgColor="#A6BCFE" h="100vh" w="full" flexDirection="column">
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
                        borderBottomColor={'cyan.500'}
                    >

                        <SideDrawer
                            selectedScreen={selectedScreen}
                            loginAccountType={loginAccountType}
                        />

                        <Box w={screenWidth <= 960 ? 0 : 850} h={[10, 10, 10, 10]} marginBottom={1.5} marginTop={1.5} paddingLeft={5}>
                            <FastImage
                                source={{
                                    uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FC-HUB%20LOGO%20FULL.png?alt=media&token=79ed34a5-f960-4154-b4e8-897b0f3248d4',
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.stretch}
                                style={styles.image} />
                        </Box>

                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <QRCodeScanner />
                        </View>

                        <NamePopover name={name} handleSignOut={handleSignOut} />

                    </Box>

                    {/* Content */}
                    <View style={{ flex: 1, flexDirection: 'row' }} flex={[1]} flexDirection="row">

                        <View style={{ flex: 1, backgroundColor: "#A6BCFE", height: '100%' }}>
                            <ScrollView style={{ flex: 1, }} keyboardShouldPersistTaps='always'>
                                <View style={{ flex: 1, }}>
                                    <CustomerListTable />
                                </View>
                            </ScrollView>

                        </View>
                    </View>

                </View>
                <LoadingModal />

            </>





        </NativeBaseProvider>




    );

};