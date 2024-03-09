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
    Spinner,
    Stack,
    Text,
    VStack,
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
    useToast,
    Tooltip,
    Progress,
    Alert
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
    Easing,
    InputAccessoryView,
    FlatList,
    ScrollView,
    TouchableHighlight,
    TextInput,
    Image as RNImage,
    Pressable,
    Linking,
    Modal as RNModal,
    Platform,
    SafeAreaView,
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
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, setDoc, arrayUnion, updateDoc, query, getDocs, orderBy, startAfter, limit, where, endBefore, endAt, limitToLast, collectionGroup, increment } from 'firebase/firestore';
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
    setFobPriceHistoryModalVisible,
    setChatListData,
    setChatListImageUrl,
    setChatListLastVisible,
    setLoadMoreLoading,
    setNoMoreData,
    setActiveChatId,
    setChatListSearchText,
    setChatMessagesData,
    setChatMessageBoxLoading,
    setSelectedChatData,
    setReadByListModalVisible,
    setLoadMoreMessagesLoading,
    setNoMoreMessagesData,
    setDeleteMessageTemplateVisible,
    setInvoiceData,
    setTransactionModalVisible,
    setPreviewInvoiceVisible,
    setSelectedCustomerData,
    setPdfViewerModalVisible,
    setSelectedFileUrl,
    setIsLoading,
    setLoginName,
    setCarImageUrl,
    setSelectedVehicleData,
    setMessageTextInputValue,
} from './redux/store';
// import { TextInput } from 'react-native-gesture-handler';
import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';
import StickyHeader from './Header/StickyHeader';
import { UsePagination } from './VehicleListComponent/UsePagination';
import Hyperlink from 'react-native-hyperlink';
import { HmacSHA256, enc } from 'crypto-js';
import { AES } from 'crypto-js';
import { CRYPTO_KEY, CRYPTO_KEY_API } from '@env';
import { captureRef } from 'react-native-view-shot';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'react-native-qrcode-svg';
import { useRoute } from '@react-navigation/native';
import { HashRouter as Router, Route, Routes, useNavigate, Navigate, useParams, useHistory, useLocation } from 'react-router-dom';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// import { CollectionGroup } from 'firebase-admin/firestore';
const { width } = Dimensions.get('window');
let selectedScreen = 'CHAT MESSAGES'
let globalLastVisible;
let globalMessagesLastVisible;
let globalSearchText = '';
let globalCustomerId = '';
let globalChatId = '';
let globalImageUrl = '';
let globalCustomerCarName = '';
let globalCustomerFirstName = '';
let globalCustomerLastName = '';

let globalAdditionalNameArray = [];

let globalAdditionalPriceArray = [];

let globalMessageTemplateSelectedTitle = '';

// let userEmail = projectControlAuth.currentUser.email;

let formattedIssuingDate = ''; // Initialize the variable outside the conditional rendering block
let formattedDueDate = '';

let transactionModalTitle = '';

let transactionModalContentValue = 0;

let ip = '';
let ipCountry = '';

let globalInvoiceVariable = {
    carData: {

    },
    cfs: '',
    placeOfDelivery: '',
    departureCountry: '',
    departurePort: '',
    salesPerson: '',

    discharge: {
        port: '',
        country: '',
    },

    consignee: {
        sameAsBuyer: null,
        name: '',
        address: '',
        contactNumber: '',
        fax: '',
        email: '',
    },

    notifyParty: {
        sameAsConsignee: null,
        name: '',
        address: '',
        contactNumber: '',
        fax: '',
        email: '',
    },

    paymentDetails: {
        incoterms: '',
        inspectionIsChecked: null,
        inspectionName: '',
        warrantyIsCheck: null,
        warrantyAmount: 0,
        fobPrice: 0,
        freightPrice: 0,
        insurancePrice: 0,
        inspectionPrice: 0,
        totalAmount: 0,
        additionalName: [],
        additionalPrice: [],
    },

    bankInformations: {
        dueDate: '',
        issuingDate: '',
        bankAccount: {

        },
        paymentTerms: '',
        salesAgreement: '',
    },

}

const mobileViewBreakpoint = 1367;

let globalSelectedPDFUrl = '';
let globalSelectedFileType = '';


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

const encryptDataAPI = (data) => {
    try {
        const secretKey = CRYPTO_KEY_API.toString();
        return AES.encrypt(data, secretKey).toString();
    } catch (error) {
        console.error("Error encrypting data:", error);
        // useNavigate(`/devadmin/chat-messages`);

        // Handle the encryption error or return a fallback
        return null; // or handle it in another appropriate way
    }
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


const TimelineStatus = ({ data }) => {

    const selectedChatData = useSelector(state => state.selectedChatData);

    const changeIndex = data.findIndex(item => selectedChatData.stepIndicator.value < item.value);


    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 3, }}>
            {/* Dots and individual line segments */}
            {data.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Dot */}
                    <Tooltip label={item.title} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33' }}>
                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: selectedChatData.stepIndicator.value < item.value ? '#C1C1C1' : '#abf7c7',
                            justifyContent: 'center',
                        }}>
                            {selectedChatData.stepIndicator.value < item.value ? (
                                <FastImage
                                    source={{
                                        uri: require(`../../assets/chat_step/chat_step_${item.value}_off.png`),
                                        priority: FastImage.priority.normal,
                                    }}
                                    style={{
                                        tintColor: 'rgba(128, 128, 128, 1)',
                                        width: 15,
                                        height: 15,
                                        alignSelf: 'center',
                                    }}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            ) : (
                                <FastImage
                                    source={{
                                        uri: require(`../../assets/chat_step/chat_step_${item.value}_on.png`),
                                        priority: FastImage.priority.normal
                                    }}
                                    style={{
                                        tintColor: 'rgba(128, 128, 128, 1)',
                                        width: 15,
                                        height: 15,
                                        alignSelf: 'center',
                                    }}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            )}

                        </View>
                    </Tooltip>
                    {/* Line Segment (except for the last dot) */}
                    {index < data.length - 1 && (
                        <View style={{
                            height: 3,
                            width: 20, // Adjust the width to match the space between the dots
                            backgroundColor: selectedChatData.stepIndicator.value <= item.value ? '#C1C1C1' : '#abf7c7',
                        }} />
                    )}
                </View>
            ))}
        </View>
    );
};


const statusData = [
    { title: 'Negotiation', value: 1 },
    { title: 'Issued Proforma Invoice', value: 2 },
    { title: 'Order Item', value: 3 },
    { title: 'Payment Confirmed', value: 4 },
    { title: 'Shipping Schedule', value: 5 },
    { title: 'Documents', value: 6 },
    { title: 'Vehicle Received', value: 7 },
    // Add more events as needed
];

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

// const SkeletonChatListLayout = () => {
//     return (
//         <SkeletonPlaceholder>
//             <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" padding={12}>
//                 {/* Placeholder for Image */}
//                 <SkeletonPlaceholder.Item width={60} height={60} borderRadius={30} />

//                 {/* Placeholder for Texts */}
//                 <SkeletonPlaceholder.Item flex={1} marginLeft={20}>
//                     {/* Date */}
//                     <SkeletonPlaceholder.Item width={80} height={12} marginBottom={6} />
//                     {/* Car Name */}
//                     <SkeletonPlaceholder.Item width={120} height={14} marginBottom={6} />
//                     {/* Text First and Last */}
//                     <SkeletonPlaceholder.Item width={140} height={14} marginBottom={6} />
//                     {/* Last Message */}
//                     <SkeletonPlaceholder.Item width={160} height={12} marginBottom={6} />
//                 </SkeletonPlaceholder.Item>
//             </SkeletonPlaceholder.Item>
//         </SkeletonPlaceholder>
//     );
// };

const HeaderButton = ({ title, onPress, isActive, headerCount }) => {
    const activeStyle = isActive ? { backgroundColor: '#E1EDF7' } : {};
    const screenWidth = Dimensions.get('window').width;
    const [isHovered, setIsHovered] = useState(false);
    const hoverIn = () => setIsHovered(true);
    const hoverOut = () => setIsHovered(false);

    return (
        <Pressable
            onHoverIn={hoverIn}
            onHoverOut={hoverOut}
            focusable={false}
            onPress={onPress}
            style={{ backgroundColor: isHovered ? '#f2f2f2' : 'transparent', padding: 12, marginVertical: screenWidth > 1818 ? 10 : 2, borderWidth: 5, borderColor: 'transparent', marginLeft: 8, width: 195, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5, ...activeStyle }}
        >
            <Text color={isActive ? '#0A78BE' : '#1C2B33'} fontSize={14} style={{ fontWeight: isActive ? 700 : 400, alignSelf: 'center', textAlign: 'center', }}>{title}</Text>
            {headerCount}

        </Pressable>
    );

};

const FilterButton = ({ title, onPress, isActive, iconActive, iconNotActive }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hoverIn = () => setIsHovered(true);
    const hoverOut = () => setIsHovered(false);
    return (
        <Pressable
            focusable={false}
            variant='ghost'
            onPress={onPress}
            onHoverIn={hoverIn}
            onHoverOut={hoverOut}
            style={{
                padding: 5,
                width: 100,
                margin: 5,
                flexDirection: 'row', // Align items in a row
                alignItems: 'center', // Center items vertically
                justifyContent: 'center',
                borderRadius: 5,
                backgroundColor: isActive ? '#E1EDF7' : (isHovered ? '#d7d7d9' : '#ECEDF0'),
            }}
        >
            {isActive ? iconActive : iconNotActive}
            <Text color={isActive ? '#0A78BE' : '#1C2B33'} fontSize={14} style={{ fontWeight: isActive ? 700 : 400, marginLeft: 5, }}>{title}</Text>


        </Pressable>
    );
};

const formatDate = (timestamp) => {
    const currentDate = new Date();
    const formattedTimestamp = timestamp.replace(' at ', 'T').replace(/\//g, '-');
    const givenDate = new Date(formattedTimestamp);

    // Resetting the time part to compare dates only
    const currentFormattedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const givenFormattedDate = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());

    // Check if the dates are the same
    if (givenFormattedDate.getTime() === currentFormattedDate.getTime()) {
        return "This day";
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // Check if the date is within this week
    if (givenDate >= startOfWeek && givenDate < currentFormattedDate) {
        return givenDate.toLocaleDateString('en-US', { weekday: 'short' });
    }

    // Check if the date is within this year
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    if (givenDate >= startOfYear) {
        return givenDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // If the date is not within this year
    return givenDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SkeletonChatListLayout = () => {

    return (
        <>
            <View // Add a unique key here
                style={{
                    padding: 12,
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                    backgroundColor: 'white',
                }}
            >
                {/* Skeleton for the image */}
                <View
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#e0e0e0',
                        marginRight: 12,
                    }}
                />
                {/* Skeleton for the text */}
                <View style={{ flex: 1 }}>
                    {Array.from({ length: 3 }).map((_, subIndex) => (
                        <View
                            key={`text-${subIndex}`}  // Add a unique key here for each text line
                            style={{
                                height: 10,
                                backgroundColor: '#e0e0e0',
                                marginBottom: 6,
                                width: '80%',
                                borderRadius: 4,
                            }}
                        />
                    ))}
                    <View style={{
                        position: 'absolute',
                        right: 10, height: 10,
                        backgroundColor: '#e0e0e0',
                        marginBottom: 6,
                        width: '5%',
                        borderRadius: 4,
                    }} />

                    <View
                        style={{
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            position: 'absolute',
                            right: -20,
                            top: -20,
                            padding: 10,
                            alignSelf: 'center',
                        }}

                    />
                </View>
            </View>
        </>

    );
}



const DeleteMessageTemplateYesNo = ({ handleDeleteMessageTemplateClose }) => {

    const deleteMessageTemplateVisible = useSelector((state) => state.deleteMessageTemplateVisible);
    const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';
    const selectedTitle = globalMessageTemplateSelectedTitle;
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const handleClose = () => {
        handleDeleteMessageTemplateClose();

    }


    const deleteMessageTemplate = async (titleToDelete) => {
        const documentRef = doc(projectControlFirestore, 'MessageTemplate', email);
        setIsDeleteLoading(true);
        try {
            // Fetch current data
            const docSnap = await getDoc(documentRef);

            if (docSnap.exists()) {
                let messageTemplates = docSnap.data().messageTemplate || [];

                // Filter out the item with the specified title
                const updatedTemplates = messageTemplates.filter(template => template.title !== titleToDelete);

                // Update the document with the new array
                await updateDoc(documentRef, { messageTemplate: updatedTemplates });

                console.log('Item successfully deleted');
                setIsDeleteLoading(false);
                handleClose();
            } else {
                console.log('Document does not exist');
                setIsDeleteLoading(false);

            }
        } catch (error) {
            console.error('Error deleting item: ', error);
            setIsDeleteLoading(false);

        }
    };

    return (

        <Modal
            isOpen={deleteMessageTemplateVisible}
            onClose={handleClose}
        >
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header >Delete Message Template?</Modal.Header>
                <Modal.Body>
                    <View style={{ flex: 1, }}>
                        <Text style={{ fontWeight: 400, }}>Are you sure you want to delete the selected message template?</Text>
                    </View>
                </Modal.Body>

                <Modal.Footer >
                    <Button.Group variant="ghost" space="2">
                        <Button style={{ width: 80, height: 36, }} onPress={handleClose} variant={'solid'} colorScheme={'warmGray'}>Cancel</Button>
                        <Button isLoading={isDeleteLoading ? true : false} onPress={() => deleteMessageTemplate(selectedTitle)} style={{ padding: 16, height: 36, }} variant={'solid'} colorScheme={'error'}>Delete</Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>


    );
};

const MessageTemplateItem = ({ setOriginalTitle, addVisible, titleInputRef, valueInputRef, setAddVisible, item, textInputRef, setPopoverOpen }) => {
    const [isTemplateItemHovered, setIsTemplateItemHovered] = useState(false);
    const [isTemplateMenuHovered, setIsTemplateMenuHovered] = useState(false);
    const [isTemplateEditHovered, setIsTemplateEditHovered] = useState(false);
    const [isTemplateDeleteHovered, setIsTemplateDeleteHovered] = useState(false);
    const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [addIsVisible, setIsAddVisible] = useState(null);
    const dispatch = useDispatch();

    const onPress = (item) => {
        // textInputRef.current.value = item.value;
        dispatch(setMessageTextInputValue(item.value));
        setPopoverOpen(false);
    };

    const onEditPress = (item) => {

        setAddVisible(true);
        // setCurrentItem(item);
        setIsAddVisible(true);
        setTemplateMenuOpen(false);
        titleInputRef.current.value = item.title;
        valueInputRef.current.value = item.value;
        setOriginalTitle(item.title);
        textInputRef.current.focus();

    };

    // useEffect(() => {


    //     if (addIsVisible == true) {
    //         console.log(addIsVisible);
    //         titleInputRef.current.value = currentItem.title;
    //         valueInputRef.current.value = currentItem.value;
    //     }
    //     if (titleInputRef.current && valueInputRef.current) {
    //         titleInputRef.current.value = currentItem.title;
    //         valueInputRef.current.value = currentItem.value;
    //     }
    // }, [currentItem]);

    const handleDeletePress = (title) => {

        dispatch(setDeleteMessageTemplateVisible(true));
        globalMessageTemplateSelectedTitle = title;
    }


    return (
        <Pressable
            onPress={() => onPress(item)}
            onHoverIn={() => setIsTemplateItemHovered(true)}
            onHoverOut={() => setIsTemplateItemHovered(false)}
            style={{
                padding: 10,
                backgroundColor: isTemplateItemHovered ? '#f2f2f2' : 'transparent',
                flex: 1,
                borderRadius: 5,
            }}>
            <View style={{ flex: 1, flexDirection: 'row', }}>
                <Text style={{ fontWeight: '700', flex: 1, }} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                <Popover
                    isOpen={templateMenuOpen}
                    onClose={() => setTemplateMenuOpen(false)}
                    trigger={(triggerProps) => {
                        return <Pressable
                            {...triggerProps}
                            onPress={() => setTemplateMenuOpen(true)}
                            onHoverIn={() => setIsTemplateMenuHovered(true)}
                            onHoverOut={() => setIsTemplateMenuHovered(false)}
                            style={{ backgroundColor: isTemplateMenuHovered ? '#dedede' : 'transparent', padding: 5, justifyContent: 'center', borderRadius: 5, }}>
                            <Entypo size={16} name='dots-three-horizontal' color='#171717' />
                        </Pressable>
                    }}

                >
                    <Popover.Content>

                        <Pressable
                            onPress={() => onEditPress(item)}
                            onHoverIn={() => setIsTemplateEditHovered(true)}
                            onHoverOut={() => setIsTemplateEditHovered(false)} style={{ flex: 1, width: 50, backgroundColor: isTemplateEditHovered ? '#dedede' : 'white', padding: 5, }} focusable={false}>
                            <Text>Edit</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => handleDeletePress(item.title)}
                            onHoverIn={() => setIsTemplateDeleteHovered(true)}
                            onHoverOut={() => setIsTemplateDeleteHovered(false)} style={{ flex: 1, width: 50, backgroundColor: isTemplateDeleteHovered ? '#dedede' : 'white', padding: 5, }} focusable={false}>
                            <Text>Delete</Text>
                        </Pressable>

                    </Popover.Content>
                </Popover>
            </View>
            <Text style={{ fontWeight: '400', fontSize: 12, }} numberOfLines={1} ellipsizeMode='tail'>{item.value}</Text>
        </Pressable>


    );
}

const MessageTemplate = ({ textInputRef }) => {
    const dispatch = useDispatch();
    const [isTemplateHovered, setIsTemplateHovered] = useState(false);
    const [isAddHovered, setIsAddHovered] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [addVisible, setAddVisible] = useState(false);

    const [isCancelHovered, setIsCancelHovered] = useState(false);
    const [isSaveHovered, setIsSaveHovered] = useState(false);
    const [originalTitle, setOriginalTitle] = useState('');


    const [saveLoading, setSaveLoading] = useState(false);

    const [templateData, setTemplateData] = useState([]);

    const screenWidth = Dimensions.get('window').width;

    const searchInputRef = useRef(null);
    const titleInputRef = useRef(null);
    const valueInputRef = useRef(null);

    const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

    const data = [
        { title: 'Message 1', value: 'Sample Message 1' },
        { title: 'Message 2', value: 'Sample Message 2' },
        { title: 'Message 3', value: 'Sample Message 3' },
    ];



    const saveMessageTemplate = async () => {
        setSaveLoading(true);
        const documentRef = doc(projectControlFirestore, 'MessageTemplate', email);

        try {
            // Fetch current data
            const docSnap = await getDoc(documentRef);

            let messageTemplates = [];
            const newTitle = titleInputRef.current?.value;
            const newValue = valueInputRef.current?.value;

            if (newTitle && newValue) {
                if (docSnap.exists()) {
                    // Document exists, get the current templates
                    messageTemplates = docSnap.data().messageTemplate || [];

                    // Find index based on the original title
                    const index = messageTemplates.findIndex(template => template.title === originalTitle);

                    if (index !== -1) {
                        // Update existing template
                        messageTemplates[index] = { title: newTitle, value: newValue };
                    } else {
                        // Add new template if original title does not exist
                        messageTemplates.push({ title: newTitle, value: newValue });
                    }
                } else {
                    // Document does not exist, create a new array with the new template
                    console.log('Creating a new document');
                    messageTemplates = [{ title: newTitle, value: newValue }];
                }

                // Update or set the document
                await setDoc(documentRef, { messageTemplate: messageTemplates }, { merge: true });

                console.log('Document successfully updated or created');
            } else {
                console.log('Title or value is empty');
            }
        } catch (error) {
            console.error('Error updating or creating document: ', error);
        } finally {
            setSaveLoading(false);
            handleCancelPressed();
        }
    };


    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = templateData.filter(item =>
            item.title.toLowerCase().includes(text.toLowerCase()) ||
            item.value.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
        setAddVisible(false);
        setIsAddHovered(false);
    };

    const handleCancelPressed = () => {
        setIsAddHovered(false);
        setAddVisible(false);
        setIsCancelHovered(false)
        setIsSaveHovered(false)
        titleInputRef.current.clear();
        valueInputRef.current.clear();

    };

    const renderItem = ({ item }) => {
        return <MessageTemplateItem setOriginalTitle={setOriginalTitle} addVisible={addVisible} titleInputRef={titleInputRef} valueInputRef={valueInputRef} setAddVisible={setAddVisible} item={item} textInputRef={textInputRef} setPopoverOpen={setPopoverOpen} />;
    };


    useEffect(() => {
        const docRef = doc(projectControlFirestore, "MessageTemplate", email);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                let arrayFieldData = docSnap.data().messageTemplate;

                // Sort the array by title
                arrayFieldData.sort((a, b) => {
                    let titleA = a.title.toUpperCase(); // ignore upper and lowercase
                    let titleB = b.title.toUpperCase(); // ignore upper and lowercase
                    if (titleA < titleB) {
                        return -1;
                    }
                    if (titleA > titleB) {
                        return 1;
                    }
                    // titles must be equal
                    return 0;
                });

                setTemplateData(arrayFieldData);
            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.error("Error fetching document:", error);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [popoverOpen]);

    const handleDeleteMessageTemplateClose = () => {

        dispatch(setDeleteMessageTemplateVisible(false));
    };

    return (
        <>
            <DeleteMessageTemplateYesNo handleDeleteMessageTemplateClose={handleDeleteMessageTemplateClose} />
            <Popover
                isOpen={popoverOpen}
                onClose={handlePopoverClose}
                // initialFocusRef={searchInputRef}
                finalFocusRef={textInputRef}
                placement={'top'}
                trigger={(triggerProps) => {
                    return <Pressable
                        focusable={false}
                        {...triggerProps}
                        onPress={() => setPopoverOpen(true)}
                        onHoverIn={() => setIsTemplateHovered(true)}
                        onHoverOut={() => setIsTemplateHovered(false)}
                        style={({ pressed }) => [
                            {
                                bottom: 0,
                                right: 100,
                                position: 'absolute',
                                borderRadius: 20,
                                opacity: pressed ? 0.5 : 1
                            }
                        ]}

                    >
                        <Ionicons name="chatbox-ellipses-outline" size={24} color={isTemplateHovered ? "#0A78BE" : "#C1C1C1"} />
                    </Pressable>
                }} >
                <Popover.Content w={screenWidth < mobileViewBreakpoint ? 320 : 400} marginRight={10} >
                    <Popover.Arrow />
                    <View style={{ display: addVisible ? 'flex' : 'none', }}><Popover.Header backgroundColor={'white'}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={{ fontWeight: 700, fontSize: 16, flex: 1 }}>Create a message template</Text>
                        </View>
                    </Popover.Header>
                        <Popover.Body backgroundColor={'white'} height={250}>
                            <Text style={{ fontWeight: 700, }}>Title</Text>
                            <TextInput
                                ref={titleInputRef}
                                placeholder='Input Title'
                                placeholderTextColor='#9B9E9F'
                                underlineColorAndroid="transparent"
                                style={{ height: 40, padding: 10, outlineStyle: 'none', borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 5 }} />
                            <br />
                            <Text style={{ fontWeight: 700, }}>Message</Text>
                            <TextInput
                                multiline
                                ref={valueInputRef}
                                placeholder='Input Message'
                                placeholderTextColor='#9B9E9F'
                                underlineColorAndroid="transparent"
                                style={{ height: 100, padding: 10, outlineStyle: 'none', borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 5 }} />

                        </Popover.Body>
                        <Popover.Footer backgroundColor={'white'}>
                            <View style={{ height: 30, flexDirection: 'row', justifyContent: 'center', }}>
                                <Pressable
                                    onHoverIn={() => setIsCancelHovered(true)}
                                    onHoverOut={() => setIsCancelHovered(false)}
                                    onPress={handleCancelPressed}
                                    style={{ backgroundColor: isCancelHovered ? '#DADADA' : 'white', width: 60, borderRadius: 5, padding: 5, borderWidth: 1, borderColor: '#DADDE1', marginHorizontal: 5, }}>
                                    <Text style={{ textAlign: 'center', fontWeight: 500, }}>Cancel</Text>
                                </Pressable>

                                <Pressable
                                    onPress={saveMessageTemplate}
                                    onHoverIn={() => setIsSaveHovered(true)}
                                    onHoverOut={() => setIsSaveHovered(false)}
                                    style={{ backgroundColor: isSaveHovered ? '#107a37' : '#16A34A', width: 60, borderRadius: 5, padding: 5, borderWidth: 1, borderColor: '#DADDE1', marginHorizontal: 5, }}>
                                    {saveLoading ?
                                        (<Spinner
                                            animating
                                            size="sm"
                                            color={'white'}
                                        />) :
                                        (
                                            <Text style={{ textAlign: 'center', color: 'white', fontWeight: 500, }}>Save</Text>
                                        )}
                                </Pressable>
                            </View>
                        </Popover.Footer>
                    </View><View style={{ display: !addVisible ? 'flex' : 'none', }}><Popover.Header backgroundColor={'white'}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={{ fontWeight: 700, fontSize: 16, flex: 1 }}>Message Template</Text>
                            <Pressable focusable={false} onPress={() => setAddVisible(true)} onHoverIn={() => setIsAddHovered(true)} onHoverOut={() => setIsAddHovered(false)}>
                                <Text style={{ fontWeight: 400, fontSize: 16, color: '#1B81C2', textDecorationLine: isAddHovered ? 'underline' : 'none' }}>+ ADD</Text>
                            </Pressable>
                        </View>
                    </Popover.Header>
                        <Popover.Body backgroundColor={'white'} height={300}>
                            <TextInput
                                ref={searchInputRef}
                                focusable={false}
                                placeholder='Search'
                                placeholderTextColor='#9B9E9F'
                                underlineColorAndroid="transparent"
                                style={{ height: 40, padding: 10, outlineStyle: 'none', borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 5, marginBottom: 5, }}
                                keyboardType='search'
                                onChangeText={handleSearch}
                                value={searchText} />
                            {templateData.length > 0 || filteredData.length > 0 ? (
                                <FlatList
                                    style={{ height: 100, borderBottomLeftRadius: 5 }}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.title.toString()}
                                    data={searchText ? filteredData : templateData} />
                            ) : (
                                <Text style={{ fontWeight: 700, alignSelf: 'center', }}>No message template found</Text>
                            )}

                        </Popover.Body>
                    </View>
                </Popover.Content>
            </Popover>
        </>
    );
};


const FileDisplay = ({ file, onRemove }) => {
    const iconSize = 24;
    if (!file) return null;  // Define the icon size




    const getFileIcon = (type) => {
        if (type.includes('pdf')) {
            return <MaterialIcons name={'picture-as-pdf'} size={iconSize} color="#FF0000" />; // Red for PDF
        }
        if (type.includes('msword') || type.includes('wordprocessingml')) {
            return <MaterialCommunityIcons name={'microsoft-word'} size={iconSize} color="#2B579A" />; // Blue for Word
        }
        if (type.includes('vnd.ms-excel') || type.includes('spreadsheetml') || type === 'text/csv') {
            return <MaterialCommunityIcons name={'microsoft-excel'} size={iconSize} color="#217346" />; // Green for Excel and CSV
        }
        if (type.includes('rar') || type.includes('x-rar-compressed') || type.includes('x-compressed')) {
            return <FastImage
                source={{ uri: require('../../assets/rar_icon.png'), priority: FastImage.priority.high }}
                style={{
                    width: 24,
                    height: 24,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />; // Color of your choice for RAR files
        }

        return <MaterialIcons name="insert-drive-file" size={iconSize} color="black" />; // Default color for others
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
            {getFileIcon(file.type)}
            <Text style={{ marginLeft: 10 }}>{file.name}</Text>
            <Pressable onPress={onRemove}>
                <MaterialIcons name="close" size={20} color="black" />
            </Pressable>
        </View>
    );
};

const MessageTextInput = ({ handleSendMessage, textInputRef }) => {
    const [inputHeight, setInputHeight] = useState(50);
    const screenWidth = Dimensions.get('window').width;
    const messageTextInputValue = useSelector((state) => state.messageTextInputValue)
    const dispatch = useDispatch();

    const handleContentOnChange = (event) => {
        const target = event.target;
        // Temporarily reset height to ensure scrollHeight reflects current content
        target.style.height = '0px'; // Reset height to recalculate
        const updatedHeight = Math.max(50, Math.min(200, target.scrollHeight));
        target.style.height = `${updatedHeight}px`; // Set to new calculated height
        setInputHeight(updatedHeight);

    };

    const handleContentSizeChange = (event) => {
        const { width, height } = event.nativeEvent.contentSize;
        const updatedHeight = Math.max(50, Math.min(200, height));
        setInputHeight(updatedHeight); // Set to new calculated height
    };

    const handleKeyPress = (e) => {
        // Define a breakpoint for mobile resolution, e.g., 768 pixels
        const mobileBreakpoint = 768;

        // Check if the screen width is less than or equal to the mobile breakpoint
        if (screenWidth >= mobileBreakpoint) {
            // Check if 'Enter' key is pressed
            if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                e.preventDefault(); // Prevent the default behavior of adding a new line
                handleSendMessage();

            }
        }
    };

    const handleInputChange = (text) => {
        dispatch(setMessageTextInputValue(text));
        // You can also call handleContentSizeChange manually here if needed
    };

    return (
        <TextInput
            ref={textInputRef}
            value={messageTextInputValue} // Controlled component
            multiline
            placeholder='Send a message...'
            placeholderTextColor='#9B9E9F'
            onChangeText={handleInputChange} // Use onChangeText for React Native
            onChange={handleContentOnChange}
            onContentSizeChange={handleContentSizeChange}
            onKeyPress={handleKeyPress}
            style={{
                outlineStyle: 'none',
                width: '100%',
                minHeight: 50,
                maxHeight: 200,
                height: inputHeight,
                alignSelf: 'center',
                padding: 10,
                overflow: 'auto',
                marginBottom: 25,
                marginRight: 50,
            }}
        />
    )
}

const ChatInputText = () => {
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const activeChatId = useSelector((state) => state.activeChatId);

    const [isSendHovered, setIsSendHovered] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFilePreview, setSelectedFilePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [fileUri, setFileUri] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isSendImageHovered, setIsSendImageHovered] = useState(false);
    const [isSendAttachmentHovered, setIsSendAttachmentHovered] = useState(false);
    const [sendIsLoading, setSendIsLoading] = useState(false);
    const textInputRef = useRef(null);
    const [inputHeight, setInputHeight] = useState(50);

    const [inputValue, setInputValue] = useState(''); // Add state for input value
    const messageTextInputValue = useSelector((state) => state.messageTextInputValue)
    const dispatch = useDispatch();
    const handleContentSizeChange = (event) => {
        const target = event.target;
        // Temporarily reset height to ensure scrollHeight reflects current content
        target.style.height = '0px'; // Reset height to recalculate
        const updatedHeight = Math.max(50, Math.min(200, target.scrollHeight));
        target.style.height = `${updatedHeight}px`; // Set to new calculated height
        setInputHeight(updatedHeight);

    };

    const removeImage = () => {
        setImageUri(null);
        setSelectedImage(null);
        setFileName(null);

    };

    const removeFile = () => {
        setSelectedFile(null);
        setSelectedFilePreview(null);
        setFileUri(null);
        setFileName(null);


    };

    const selectFile = async () => {
        const maxFileSize = 10 * 1024 * 1024; // 5MB in bytes

        if (Platform.OS === 'web') {
            return new Promise((resolve, reject) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf, .doc, .docx, .xls, .xlsx, .rar'; // Acceptable file types
                input.onchange = () => {
                    const file = input.files[0];

                    if (file) {
                        if (![
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'application/x-rar-compressed',
                            'application/x-compressed',
                            'text/csv'
                        ].includes(file.type)) {
                            alert('File type not allowed');
                            reject('File type not allowed');
                            return;
                        }

                        if (file.size > maxFileSize) {
                            alert('File size should be less than 10MB');
                            reject('File size should be less than 10MB');
                            return;
                        }
                        removeImage();
                        // Read the file as a Data URL and set it in the state
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            setFileUri(e.target.result);
                            resolve(file);
                            setSelectedFile(file);
                            setSelectedFilePreview({ name: file.name, type: file.type });
                            setFileName(file.name);
                            textInputRef.current.focus();
                        };
                        reader.onerror = (e) => {
                            reject(e);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
        } else {
            return new Promise((resolve, reject) => {
                launchImageLibrary({ mediaType: 'photo' }, (response) => {
                    if (response.didCancel) {
                        reject('User cancelled image picker');
                    } else if (response.errorCode) {
                        reject(response.errorMessage);
                    } else {
                        const asset = response.assets[0];

                        if (!asset.type.startsWith('image/')) {
                            reject('Only image files are allowed');
                            alert('Only image files are allowed');

                            return;
                        }

                        if (asset.fileSize > maxFileSize) {
                            reject('File size should be less than 10MB');
                            alert('File size should be less than 10MB');
                            return;
                        }

                        const selectedImageUri = asset.uri;
                        const fileName = asset.fileName || 'Unknown name';
                        resolve({ uri: selectedImageUri, name: fileName });
                        setImageUri(selectedImageUri); // Set imageUri here
                        // console.log(`File name: ${fileName}`);
                    }
                });
            });
        }
    };

    const selectImage = async () => {
        const maxFileSize = 10 * 1024 * 1024; // 5MB in bytes

        if (Platform.OS === 'web') {

            return new Promise((resolve, reject) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = () => {
                    const file = input.files[0];
                    if (file) {

                        if (!file.type.startsWith('image/')) {
                            reject('Only image files are allowed');
                            alert('Only image files are allowed');

                            return;
                        }

                        if (file.size > maxFileSize) {
                            reject('File size should be less than 10MB');
                            alert('File size should be less than 10MB');

                            return;
                        }

                        removeFile();
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                            resolve({ dataUrl: reader.result, name: file.name });
                            setImageUri(reader.result); // Set imageUri here
                            setFileName(file.name);
                            // console.log(`File name: ${file.name}`);
                        };
                        setSelectedImage(file);
                        reader.onerror = error => reject(error);
                    }
                };
                input.click();
            });
        } else {
            return new Promise((resolve, reject) => {
                launchImageLibrary({ mediaType: 'photo' }, (response) => {
                    if (response.didCancel) {
                        reject('User cancelled image picker');
                    } else if (response.errorCode) {
                        reject(response.errorMessage);
                    } else {
                        const asset = response.assets[0];

                        if (!asset.type.startsWith('image/')) {
                            reject('Only image files are allowed');
                            alert('Only image files are allowed');
                            return;
                        }

                        if (asset.fileSize > maxFileSize) {
                            reject('File size should be less than 10MB');
                            alert('Only image files are allowed');
                            return;
                        }

                        const selectedImageUri = asset.uri;
                        const fileName = asset.fileName || 'Unknown name';
                        resolve({ uri: selectedImageUri, name: fileName });
                        setImageUri(selectedImageUri); // Set imageUri here
                        // console.log(`File name: ${fileName}`);
                    }
                });
            });
        }
    };

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set your desired image size here
                    const maxWidth = 800; // Example value
                    const maxHeight = 800; // Example value
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        }));
                    }, 'image/jpeg', 0.7); // Adjust the quality (0.7 is a good balance between quality and file size)
                };
                img.onerror = error => reject(error);
            };
            reader.onerror = error => reject(error);
        });
    };

    const addFileMessage = async () => {
        setSendIsLoading(true);
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const formattedTimeForFile = moment(datetime).format('MMDDYYYYHHmmss.SSS');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';
        const inputValue = textInputRef.current?.value;

        textInputRef.current.clear();
        textInputRef.current.focus();
        removeFile();

        const storage = getStorage(projectExtensionFirebase);

        if (fileUri) { // Assuming you have a fileUri state for the selected file

            try {

                let fileUrl = null;
                if (fileUri) {
                    // Upload file and get URL
                    const fileRef = ref(storage, `ChatFiles/${selectedChatData.id}/C-HUB_${formattedTimeForFile}/${fileName}`);
                    const uploadResult = await uploadBytes(fileRef, selectedFile);
                    fileUrl = await getDownloadURL(uploadResult.ref);
                }

                // Adding the message to the 'messages' subcollection
                await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                    text: inputValue.trim(),
                    sender: email,
                    timestamp: formattedTime,
                    ip: ip,
                    ipCountry: ipCountry,
                    file: {
                        name: fileName,
                        type: 'attachment', // Set the file type
                        url: fileUrl,
                    } // Include file URL if available
                });

                // Updating the main chat document with the latest message details
                await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                    lastMessageSender: email,
                    lastMessage: `Sent an attachment`,
                    lastMessageDate: formattedTime,
                    customerRead: false,
                    read: true,
                    readBy: [email],
                });

                setSendIsLoading(false);

            } catch (e) {
                console.error('Error adding document: ', e);
            }
        }
        else {
            setSendIsLoading(false);
        }
    };


    const addImageMessage = async () => {
        setSendIsLoading(true);
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const formattedTimeForFile = moment(datetime).format('MMDDYYYYHHmmss.SSS');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';
        const inputValue = textInputRef.current?.value;



        const storage = getStorage(projectExtensionFirebase);

        if (imageUri) { // Assuming imageFile holds the file to be uploaded

            textInputRef.current.clear();
            textInputRef.current.focus();
            removeImage();

            try {
                let imageUrl = null;
                if (imageUri) {
                    // Upload image and get URL
                    const resizedImage = await resizeImage(selectedImage);
                    const imageRef = ref(storage, `ChatFiles/${selectedChatData.id}/C-HUB_${formattedTimeForFile}/${fileName}`);
                    const uploadResult = await uploadBytes(imageRef, resizedImage);
                    imageUrl = await getDownloadURL(uploadResult.ref);
                }

                // Adding the message to the 'messages' subcollection
                await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                    text: inputValue.trim(),
                    sender: email,
                    timestamp: formattedTime,
                    ip: ip,
                    ipCountry: ipCountry,
                    file: {
                        name: fileName,
                        type: 'image',
                        url: imageUrl,
                    } // Include image URL if available
                });

                // Updating the main chat document with the latest message details
                await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                    lastMessageSender: email,
                    lastMessage: 'Sent an image',
                    lastMessageDate: formattedTime,
                    customerRead: false,
                    read: true,
                    readBy: [email],
                });

                setSendIsLoading(false);

            } catch (e) {
                console.error('Error adding document: ', e);
            }
        }
        else {
            setSendIsLoading(false);
        }
    };


    const addMessage = async () => {
        setSendIsLoading(true);

        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

        // const inputValue = textInputRef.current?.value;
        const inputValue = messageTextInputValue;
        dispatch(setMessageTextInputValue(''));
        textInputRef.current.clear();
        textInputRef.current.focus();

        if (inputValue !== '') {
            const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';
            try {

                // Adding the message to the 'messages' subcollection
                await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                    text: inputValue.trim(),
                    sender: email,
                    timestamp: formattedTime, // Using the fetched timestamp
                    ip: ip, // IP Address
                    ipCountry: ipCountry // Country of the IP Address
                });


                // Updating the main chat document with the latest message details
                await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                    lastMessageSender: email,
                    lastMessage: inputValue,
                    lastMessageDate: formattedTime,
                    customerRead: false,
                    read: true,
                    readBy: [email],
                });
                setSendIsLoading(false);

            } catch (e) {
                console.error('Error adding document: ', e);
            }
        }
        else {
            setSendIsLoading(false);
        }

    };

    const screenWidth = Dimensions.get('window').width;

    const handleKeyPress = (e) => {
        // Define a breakpoint for mobile resolution, e.g., 768 pixels
        const mobileBreakpoint = 768;

        // Check if the screen width is less than or equal to the mobile breakpoint
        if (screenWidth >= mobileBreakpoint) {
            // Check if 'Enter' key is pressed
            if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                e.preventDefault(); // Prevent the default behavior of adding a new line
                handleSendMessage();

            }
        }
    };


    const handleSendMessage = () => {
        textInputRef.current.focus();

        if (imageUri !== null) {
            addImageMessage();
        }
        if (fileUri !== null) {
            addFileMessage();
        }
        else {
            addMessage();
        }

    }

    return (

        <View style={{ width: '98%', flexDirection: 'row', backgroundColor: 'white', }}>

            <View style={{ flexDirection: 'column', flex: 1, }}>

                {fileUri &&
                    (
                        <FileDisplay file={selectedFilePreview} onRemove={removeFile} />
                    )}

                {imageUri && (
                    <View style={{
                        position: 'relative', // Make sure the parent View is positioned relative
                        width: 70,
                        height: 70,
                        borderRadius: 5,
                        overflow: 'hidden', // This ensures that nothing spills out of the container
                        borderWidth: 1,
                        borderColor: '#DADDE1',
                        margin: 2,
                    }}>
                        <FastImage
                            source={{ uri: imageUri }}
                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <Pressable
                            onPress={removeImage}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent background for better visibility
                                borderRadius: 12 // Circular shape
                            }}
                        >
                            <MaterialIcons name="close" size={20} color="black" />
                        </Pressable>
                    </View>

                )}
                <View style={{ flexDirection: 'row', }}>
                    <View style={{ marginHorizontal: 5, marginTop: 5, }}>
                        <FastImage
                            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FRMJ%20Round.jpg?alt=media&token=90d7f2fe-d9cd-4a6f-9a6b-bc39fe2b33b2', priority: FastImage.priority.high }}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    {/* <TextInput
                        ref={textInputRef}
                        multiline
                        placeholder='Send a message...'
                        placeholderTextColor='#9B9E9F'
                        onChange={handleContentSizeChange}
                        onKeyPress={handleKeyPress}
                        style={{
                            outlineStyle: 'none',
                            width: '100%',
                            minHeight: 50, // Set your desired minHeight
                            maxHeight: 200, // Set your desired maxHeight
                            height: inputHeight, // Dynamic height
                            alignSelf: 'center',
                            padding: 10,
                            overflow: 'auto',
                            marginBottom: 25,
                            marginRight: 50,
                        }}
                    /> */}

                    <MessageTextInput handleSendMessage={handleSendMessage} textInputRef={textInputRef} />

                    <Pressable
                        focusable={false}
                        onPress={() => sendIsLoading ? null : handleSendMessage()}
                        onHoverIn={() => setIsSendHovered(true)}
                        onHoverOut={() => setIsSendHovered(false)}
                        style={({ pressed }) => [
                            {
                                padding: 10,
                                top: 20,
                                right: 10,
                                position: 'absolute',
                                borderRadius: 20,
                                backgroundColor: isSendHovered ? '#e8f4ff' : 'transparent', // Change color on hover
                                opacity: pressed ? 0.5 : 1 // Change opacity when pressed
                            }
                        ]}
                    >
                        {sendIsLoading ? <Spinner
                            animating
                            size="sm"
                            color={"#95BCF9"}
                        /> :
                            <MaterialIcons name="send" size={24} color="#95BCF9" />
                        }
                    </Pressable>
                </View>
            </View>

            <Pressable
                onHoverIn={() => setIsSendImageHovered(true)}
                onHoverOut={() => setIsSendImageHovered(false)}
                style={({ pressed }) => [
                    {
                        padding: 10,
                        bottom: -10,
                        right: 125,
                        position: 'absolute',
                        borderRadius: 20,
                        opacity: pressed ? 0.5 : 1 // Change opacity when pressed
                    }
                ]}
                onPress={selectImage}
            >
                <Ionicons name="image-outline" size={24} color={isSendImageHovered ? "#0A78BE" : "#C1C1C1"} />
            </Pressable>

            <Pressable
                onHoverIn={() => setIsSendAttachmentHovered(true)}
                onHoverOut={() => setIsSendAttachmentHovered(false)}
                style={({ pressed }) => [
                    {
                        padding: 10,
                        bottom: -9,
                        right: 155,
                        position: 'absolute',
                        borderRadius: 20,
                        opacity: pressed ? 0.5 : 1 // Change opacity when pressed
                    }
                ]}
                onPress={selectFile}
            >
                <MaterialIcons name="attach-file" size={24} color={isSendAttachmentHovered ? "#0A78BE" : "#C1C1C1"} />
            </Pressable>

            <MessageTemplate textInputRef={textInputRef} />

        </View>

    );
}




const CancelledView = () => {

    return (
        <View style={{
            zIndex: 999,
            position: 'absolute',
            borderRadius: 40,
            borderWidth: 0, // Border width
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.5,
            // Centering the view within its parent
            top: 38,
            left: 17,
        }}>

            <View style={{ backgroundColor: "#FF0000", width: 50, height: 6, borderRadius: 20, }} />
        </View>
    );

};

const ChatListItem = ({ item, onPress, onPressNewTab, isActive, messageUnread, formattedDate, chatListData }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [chatListStepImageUrl, setChatListStepImageUrl] = useState(null);
    const [textFirst, setTextFirst] = useState('');
    const [textLast, setTextLast] = useState('');
    const dispatch = useDispatch();
    const [isUnreadHovered, setIsUnreadHovered] = useState(false);
    const [isOpenNewTabHovered, setIsOpenNewTabHovered] = useState(false);
    const [isUnreadVisible, setIsUnreadVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [customerData, setCustomerData] = useState({});

    const carName = item.carData && item.carData.carName ? item.carData.carName : (item.vehicle && item.vehicle.carName ? item.vehicle.carName : '');
    const updateChatToUnread = async () => {
        dispatch(setActiveChatId(''));
        dispatch(setChatMessagesData([]));
        dispatch(setSelectedChatData([]));
        const docRef = doc(projectExtensionFirestore, "chats", item.id);
        try {
            await updateDoc(docRef, {
                read: false,
            });

        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const hoverIn = () => {
        setIsHovered(true)
    };

    const hoverOut = () => {
        setIsHovered(false);
    };

    const hoverOpenNewTabIn = () => {
        setIsHovered(true)
        setIsOpenNewTabHovered(true)
    };

    const hoverOpenNewTabOut = () => {
        setIsOpenNewTabHovered(false)
    };

    const hoverUnreadIn = () => {
        setIsHovered(true)
        setIsUnreadHovered(true)
    };

    const hoverUnreadOut = () => {
        setIsUnreadHovered(false)
    };


    useEffect(() => {
        // getChatListStepImageUrl();
        const folderName = item.carData && item.carData.stockID ? item.carData.stockID : (item.vehicle && item.vehicle.carId ? item.vehicle.carId : '');
        const storage = getStorage(projectExtensionFirebase);
        const imageRef = ref(storage, `${folderName}/0`); // Ensure this path is correct

        getDownloadURL(imageRef)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                if (error.code === 'storage/object-not-found') {
                    // Handle the 'object not found' error.
                    setImageUrl('https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FNo%20Car%20Image%20Found.png?alt=media&token=de86488c-73a6-4c04-811c-bc508a11123a');
                } else {
                    // Handle other errors differently

                    setImageUrl('https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FNo%20Car%20Image%20Found.png?alt=media&token=de86488c-73a6-4c04-811c-bc508a11123a');

                }
            });

        const collectionPath = 'accounts';
        const docId = item.participants.customer; // Ensure this is a valid document ID

        const docRef = doc(projectExtensionFirestore, collectionPath, docId);

        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setCustomerData(data ? data : {});
                setTextFirst(data.textFirst ? data.textFirst : '');
                setTextLast(data.textLast ? data.textLast : '');

            } else {
                console.log("Document not found");
            }
        }, (error) => {
            console.error("Error fetching document: ", error);
        });

        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const loadingCondition = !imageUrl || imageUrl == null || imageUrl == '' || imageUrl == undefined || !item;

    const chatStepIconOn = require(`../../assets/chat_step/chat_step_${item.stepIndicator.value}_on.png`);
    const chatStepIconOff = require(`../../assets/chat_step/chat_step_${item.stepIndicator.value}_off.png`);


    const handlePress = () => {
        onPress()

        // dispatch(setSelectedCustomerData(customerData));
        globalCustomerFirstName = textFirst ? textFirst : '';
        globalCustomerLastName = textLast ? textLast : '';
        globalImageUrl = imageUrl ? imageUrl : '';
        dispatch(setCarImageUrl(imageUrl ? imageUrl : ''));

        globalCustomerCarName = carName;
        setIsHovered(false);
        setIsUnreadHovered(false)


    }

    const handlePressNewTab = () => {
        onPressNewTab()

        // dispatch(setSelectedCustomerData(customerData));
        globalCustomerFirstName = textFirst ? textFirst : '';
        globalCustomerLastName = textLast ? textLast : '';
        globalImageUrl = imageUrl ? imageUrl : '';
        dispatch(setCarImageUrl(imageUrl ? imageUrl : ''));

        globalCustomerCarName = carName;
        setIsHovered(false);
        setIsUnreadHovered(false)


    }

    if (loadingCondition) {
        return <SkeletonChatListLayout />
    }
    else {
        return (
            <Pressable
                onHoverIn={hoverIn}
                onHoverOut={hoverOut}
                focusable={false}
                style={{
                    padding: 12,
                    alignItems: 'flex-start', // Align items to the start of the button
                    flexDirection: 'row',
                    backgroundColor: isActive ? '#f2f2f2' : (isHovered ? '#f2f2f2' : 'white'),
                    borderLeftColor: isActive ? '#0A9FDC' : 'transparent',
                    borderRightColor: isActive ? '#0A9FDC' : 'transparent',
                    borderLeftWidth: 2,
                    borderRightWidth: 2,

                }}
                onPress={handlePress}
            >
                {item.isCancelled && <CancelledView />}

                <View style={{ paddingRight: 10, justifyContent: 'center', }}>
                    {imageUrl ? (
                        <FastImage
                            source={{ uri: imageUrl, priority: FastImage.priority.normal }}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                    ) : (
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: '#e0e0e0',
                                marginRight: 12,
                            }}
                        />
                    )}
                </View>
                <View style={{ flex: 1 }}>
                    {!isHovered ? (<Text style={{ fontSize: 12, position: 'absolute', right: 10, color: messageUnread ? '#0A78BE' : '#90949C', fontWeight: messageUnread ? 700 : 400, }}>{formattedDate}</Text>) : (!item.read ? (<Text style={{ fontSize: 12, position: 'absolute', right: 10, color: messageUnread ? '#0A78BE' : '#90949C', fontWeight: messageUnread ? 700 : 400, }}>{formattedDate}</Text>) : null)}
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 14, width: '70%', overflow: 'hidden', fontWeight: messageUnread ? 700 : 400, color: messageUnread ? '#1C2B33' : '#586369', }}>{carName}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 14, width: '80%', overflow: 'hidden', flex: 1, fontWeight: messageUnread ? 700 : 400, color: messageUnread ? '#1C2B33' : '#586369', }}>{`${textFirst} ${textLast}`}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 12, width: '80%', overflow: 'hidden', flex: 1, fontWeight: messageUnread ? 700 : 400, color: messageUnread ? '#0A78BE' : '#90949c', }}>{item.lastMessageSender == item.participants.customer ? (item.lastMessage ? item.lastMessage : 'No message found') : (item.lastMessage ? `Sales: ${item.lastMessage}` : `Sales: No message found`)}</Text>
                    {!item.read ? (
                        <FastImage
                            source={{ uri: chatStepIconOn, priority: FastImage.priority.normal }}
                            style={{
                                tintColor: 'rgba(128, 128, 128, 1)',
                                width: 22,
                                height: 20,
                                position: 'absolute',
                                right: 10,
                                bottom: 0,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                    ) : (
                        <FastImage
                            source={{ uri: chatStepIconOff, priority: FastImage.priority.normal }}
                            style={{
                                tintColor: 'rgba(128, 128, 128, 1)',
                                width: 22,
                                height: 20,
                                position: 'absolute',
                                right: 10,
                                bottom: 0,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                    )}

                    <Text numberOfLines={1} ellipsizeMode='tail' style={{
                        position: 'absolute',
                        right: 0,
                        top: 10,
                        padding: 10,
                        alignSelf: 'center',
                        fontSize: 12,
                        overflow: 'hidden',
                        flex: 1,
                        fontWeight: messageUnread ? 700 : 400,
                        color: messageUnread ? '#FF0000' : '#90949c',
                    }}>
                        {item.invoiceNumber && item.stepIndicator.value > 2 ? item.invoiceNumber : ''}
                    </Text>

                    {isHovered && item.read && (
                        <Tooltip label="Mark as unread" placement='right' openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                            <Pressable
                                focusable={false}
                                onHoverIn={hoverUnreadIn}
                                onHoverOut={hoverUnreadOut}
                                onPress={updateChatToUnread}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: -10,
                                    padding: 10,
                                    alignSelf: 'center',
                                }}

                            >
                                <MaterialIcons name="mark-as-unread" size={22} color={isUnreadHovered ? "#1B81C2" : "#BABABA"} />
                            </Pressable>
                        </Tooltip>
                    )}

                    {isHovered && (
                        <Tooltip label="Open in new tab" placement='right' openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                            <Pressable
                                focusable={false}
                                onHoverIn={hoverOpenNewTabIn}
                                onHoverOut={hoverOpenNewTabOut}
                                onPress={handlePressNewTab}
                                style={{
                                    position: 'absolute',
                                    right: -22,
                                    top: -22,
                                    padding: 10,
                                    alignSelf: 'center',
                                }}

                            >
                                <MaterialIcons name="open-in-new" size={16} color={isOpenNewTabHovered ? "#1B81C2" : "#BABABA"} />
                            </Pressable>
                        </Tooltip>
                    )}
                </View>



            </Pressable>
        );
    }


};

const ChatList = ({ unreadButtonValue, activeButtonValue, }) => {

    const selectedChatData = useSelector((state) => state.selectedChatData);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const chatListData = useSelector((state) => state.chatListData);
    const chatListLastVisible = useSelector((state) => state.chatListLastVisible);
    const activeChatId = useSelector((state) => state.activeChatId);
    const loadMoreLoading = useSelector((state) => state.loadMoreLoading);
    const noMoreData = useSelector((state) => state.noMoreData);
    const renderFooterRef = useRef(null);
    const dispatch = useDispatch();

    const [imageUrl, setImageUrl] = useState('');

    const { chatId } = useParams();

    const navigate = useNavigate();

    const updateChatToRead = async () => {
        const docRef = doc(projectExtensionFirestore, "chats", activeChatId);
        const user = projectControlAuth.currentUser
        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';
        if (email !== '') {

            try {
                await updateDoc(docRef, {
                    read: true,
                    readBy: arrayUnion(email),
                });
            } catch (error) {
                console.error("Error updating document: ", error);
                dispatch(setActiveChatId(''));
                navigate(`/top/chat-messages`);

            }

        }

    };



    const fetchChatMessages = () => {
        if (!activeChatId) {
            // Handle the case where there's no active chat ID
        }
        else {
            dispatch(setChatMessagesData([]));
            dispatch(setChatMessageBoxLoading(true));
            updateChatToRead();

            try {
                // References to the document and its 'messages' subcollection
                let activeInvoiceNumer;
                const docRef = doc(projectExtensionFirestore, 'chats', activeChatId);

                const messagesRef = collection(docRef, 'messages');

                // Query for the 'messages' subcollection
                const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(10));

                // Listen to the document
                const unsubscribeDoc = onSnapshot(docRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        // Add the document ID to the data
                        const dataWithId = {
                            ...data,
                            id: docSnapshot.id
                        };
                        // Dispatch any action you need with the document data
                        dispatch(setSelectedChatData(dataWithId));

                        // Define and listen to the invoice document only after the chat document is confirmed to exist
                        if (dataWithId.invoiceNumber || dataWithId.invoiceNumber == '') {
                            const invoiceDocRef = doc(projectExtensionFirestore, 'IssuedInvoice', dataWithId.invoiceNumber);
                            const unsubscribeInvoice = onSnapshot(invoiceDocRef, (invoiceDocSnapshot) => {
                                if (invoiceDocSnapshot.exists()) {
                                    const invoiceData = invoiceDocSnapshot.data();
                                    // Add the document ID to the data
                                    const invoiceDataWithId = {
                                        ...invoiceData,
                                        id: invoiceDocSnapshot.id
                                    };
                                    // Dispatch any action you need with the invoice document data
                                    dispatch(setInvoiceData(invoiceDataWithId ? invoiceDataWithId : {}));

                                } else {
                                    // Handle the case where the invoice document does not exist
                                    console.log('No Invoice Yet');
                                    dispatch(setInvoiceData({}));
                                }
                            });

                            // Cleanup function for the invoice listener
                            return () => {
                                unsubscribeInvoice();

                            };
                        } else {
                            dispatch(setInvoiceData({}));
                            console.log('No Invoice Yet');
                        }

                    }

                });
                const unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
                    let messages = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const timestamp = data.timestamp ? data.timestamp.toString() : null;
                        messages.push({ id: doc.id, ...data, timestamp });
                    });

                    dispatch(setChatMessagesData(messages));
                    dispatch(setChatMessageBoxLoading(false));
                    globalMessagesLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                });

                // Return a cleanup function
                return () => {
                    unsubscribeDoc();
                    unsubscribeMessages();
                    // if (activeInvoiceNumer && activeInvoiceNumer !== '') {
                    //     unsubscribeInvoice();
                    // }
                };
            } catch (error) {
                console.error("Error setting up real-time messages: ", error);

            }
        }
    };

    const handleLoadMore = () => {
        dispatch(setLoadMoreLoading(true));

        let nextQuery;
        if (!globalLastVisible) {
            // No more data to load or globalLastVisible is undefined
            console.log("No more data to load or globalLastVisible is undefined");
            setTimeout(() => {
                dispatch(setLoadMoreLoading(false));
                dispatch(setNoMoreData(true));
            }, 0);
            return;
        }
        else {

            if (chatListData.length >= 10) {
                if (unreadButtonValue == true) {

                    if (activeButtonValue == 0) {
                        if (globalSearchText === '') {
                            dispatch(setLoadMoreLoading(true));
                            dispatch(setNoMoreData(false));
                            nextQuery = query(
                                collection(projectExtensionFirestore, 'chats'),
                                where('read', '==', false),
                                orderBy('lastMessageDate', 'desc'),
                                startAfter(globalLastVisible),
                                limit(10)
                            );
                        }

                        else {
                            dispatch(setLoadMoreLoading(true));
                            dispatch(setNoMoreData(false));
                            nextQuery = query(
                                collection(projectExtensionFirestore, 'chats'),
                                where('read', '==', false),
                                where('keywords', 'array-contains', globalSearchText.toUpperCase()),
                                orderBy('lastMessageDate', 'desc'),
                                startAfter(globalLastVisible),
                                limit(10)
                            );
                        }
                    }

                    else {
                        if (globalSearchText === '') {
                            dispatch(setLoadMoreLoading(true));
                            dispatch(setNoMoreData(false));
                            nextQuery = query(
                                collection(projectExtensionFirestore, 'chats'),
                                where('read', '==', false),
                                where('stepIndicator.value', '==', activeButtonValue),
                                orderBy('lastMessageDate', 'desc'),
                                startAfter(globalLastVisible),
                                limit(10)
                            );


                        }

                        else {
                            dispatch(setLoadMoreLoading(true));
                            dispatch(setNoMoreData(false));
                            nextQuery = query(
                                collection(projectExtensionFirestore, 'chats'),
                                where('stepIndicator.value', '==', activeButtonValue),
                                where('read', '==', false),
                                where('keywords', 'array-contains', globalSearchText.toUpperCase()),
                                orderBy('lastMessageDate', 'desc'),
                                startAfter(globalLastVisible),
                                limit(10)
                            );
                        }
                    }

                }

                else {

                    if (activeButtonValue == 0) {
                        if (globalSearchText === '') {
                            dispatch(setLoadMoreLoading(true));
                            dispatch(setNoMoreData(false));
                            nextQuery = query(
                                collection(projectExtensionFirestore, 'chats'),
                                orderBy('lastMessageDate', 'desc'),
                                startAfter(globalLastVisible),
                                limit(10)
                            );




                        }

                        else {
                            dispatch(setLoadMoreLoading(true));
                            dispatch(setNoMoreData(false));
                            nextQuery = query(
                                collection(projectExtensionFirestore, 'chats'),
                                where('keywords', 'array-contains', globalSearchText.toUpperCase()),
                                orderBy('lastMessageDate', 'desc'),
                                startAfter(globalLastVisible),
                                limit(10)
                            );
                        }
                    }

                    else {
                        if (globalSearchText === '') {
                            dispatch(setLoadMoreLoading(true));
                            dispatch(setNoMoreData(false));
                            nextQuery = query(
                                collection(projectExtensionFirestore, 'chats'),
                                where('stepIndicator.value', '==', activeButtonValue),
                                orderBy('lastMessageDate', 'desc'),
                                startAfter(globalLastVisible),
                                limit(10)
                            );



                        }

                        else {
                            dispatch(setLoadMoreLoading(true));
                            dispatch(setNoMoreData(false));
                            nextQuery = query(
                                collection(projectExtensionFirestore, 'chats'),
                                where('stepIndicator.value', '==', activeButtonValue),
                                where('keywords', 'array-contains', globalSearchText.toUpperCase()),
                                orderBy('lastMessageDate', 'desc'),
                                startAfter(globalLastVisible),
                                limit(10)
                            );
                        }
                    }
                }
            }

            else {
                dispatch(setNoMoreData(true));
                dispatch(setLoadMoreLoading(false));
            }




        }


        if (chatListData.length < 10) {
            setTimeout(() => {
                dispatch(setLoadMoreLoading(false));
                dispatch(setNoMoreData(true));
            }, 0);
        }

        else {
            try {
                const unsubscribe = onSnapshot(nextQuery, (snapshot) => {
                    if (snapshot.empty) {
                        // Handle the case when there's no more data
                        console.log("No more data to load");
                        setTimeout(() => {
                            dispatch(setLoadMoreLoading(false));
                            dispatch(setNoMoreData(true));
                            globalLastVisible = null;
                        }, 0);  // Delay setting loading and no more data flags
                        return;
                    }

                    const chatsData = [];
                    snapshot.forEach((doc) => {
                        chatsData.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });


                    // Append new data to the existing list

                    setTimeout(() => {
                        dispatch(setChatListData([...chatListData, ...chatsData]));
                        dispatch(setLoadMoreLoading(false));
                        globalLastVisible = snapshot.docs[snapshot.docs.length - 1];
                    }, 0);

                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
                setTimeout(() => dispatch(setLoadMoreLoading(false)), 0);  // Ensure loading is set to false even if there's an error
            }

        }

    };

    useEffect(() => {
        // dispatch(setCarImageUrl(''));
        dispatch(setMessageTextInputValue(''));

        if (chatId) {

            setTimeout(() => {
                const decodedChatId = decodeURIComponent(chatId);
                const decryptedChatId = decryptData(decodedChatId).toString();
                let parts = decryptedChatId.split('_');
                let stockIdPart = parts[1];
                let emailPart = parts[parts.length - 1];


                // console.log(decryptedChatId);

                if (!emailPart) {
                    console.error("Invalid email part:", emailPart);
                    return;
                }
                const folderName = selectedChatData.carData && selectedChatData.carData.stockID ? selectedChatData.carData.stockID : (selectedChatData.vehicle && selectedChatData.vehicle.carId ? selectedChatData.vehicle.carId : '');
                const storage = getStorage(projectExtensionFirebase);
                const imageRef = ref(storage, `${stockIdPart}/0`); // Ensure this path is correct

                // console.log('Folder Name: ', folderName)
                getDownloadURL(imageRef)
                    .then((url) => {
                        setImageUrl(url);
                        globalImageUrl = url;
                        dispatch(setCarImageUrl(url));

                    })
                    .catch((error) => {
                        if (error.code === 'storage/object-not-found') {
                            // Handle the 'object not found' error.
                            setImageUrl('https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FNo%20Car%20Image%20Found.png?alt=media&token=de86488c-73a6-4c04-811c-bc508a11123a');
                        } else {
                            // Handle other errors differently

                            setImageUrl('https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FNo%20Car%20Image%20Found.png?alt=media&token=de86488c-73a6-4c04-811c-bc508a11123a');

                        }
                    });


                if (selectedChatData) {
                    const collectionPath = 'accounts';
                    const docId = selectedChatData.participants?.customer; // Ensure this is a valid document ID

                    const docRef = doc(projectExtensionFirestore, collectionPath, emailPart);

                    const docRefVehicle = doc(projectExtensionFirestore, 'VehicleProducts', stockIdPart);

                    const unsubscribeVehicle = onSnapshot(docRefVehicle, (doc) => {
                        if (doc.exists()) {
                            const data = doc.data();
                            dispatch(setSelectedVehicleData(data ? data : {}));
                            // console.log(`Name: ${data.textFirst} ${data.textLast}`)

                            // globalCustomerCarName = carName;
                            // setTextFirst(data.textFirst ? data.textFirst : '');
                            // setTextLast(data.textLast ? data.textLast : '');


                        } else {
                            console.log("Document not found");
                        }
                    }, (error) => {
                        console.error("Error fetching document: ", error);
                    });

                    const unsubscribe = onSnapshot(docRef, (doc) => {
                        if (doc.exists()) {
                            const data = doc.data();
                            dispatch(setSelectedCustomerData(data ? data : {}));
                            globalCustomerFirstName = data.textFirst ? data.textFirst : '';
                            globalCustomerLastName = data.textLast ? data.textLast : '';
                            // console.log(`Name: ${data.textFirst} ${data.textLast}`)


                            // globalCustomerCarName = carName;
                            // setTextFirst(data.textFirst ? data.textFirst : '');
                            // setTextLast(data.textLast ? data.textLast : '');


                        } else {
                            console.log("Document not found");
                        }
                    }, (error) => {
                        console.error("Error fetching document: ", error);
                    });

                    // Clean up function to unsubscribe from the listener when the component unmounts
                    return () => {

                        unsubscribe()
                        unsubscribeVehicle()
                    };
                }




            }, 1);
        }

        const unsubscribe = fetchChatMessages();


        return () => {
            if (unsubscribe) {

                unsubscribe(); // Unsubscribe when the component unmounts
            }
        };

    }, [activeChatId]);




    useEffect(() => {

        if (chatId) {
            const decryptedChatId = decryptData(chatId).toString();

            setTimeout(() => {
                // console.log(decryptedChatId)
                dispatch(setActiveChatId(decryptedChatId));

            }, 1);


        }
    }, [chatId]);

    const handleChatPress = async (customerId, chatId) => {
        if (chatId !== activeChatId) {
            const encryptedChatId = encryptData(chatId);
            const encodedChatId = encodeURIComponent(encryptedChatId); // URL-encode the encrypted data
            navigate(`/top/chat-messages/${encodedChatId}`);
            // console.log(encodedChatId)
            // console.log(decodeURIComponent(encodedChatId))
            // console.log(decryptData(decodeURIComponent(encodedChatId)))

            // // Assuming chatId is already properly encoded and needs no further encoding
            // const path = `/devadmin/chat-messages/${encodedChatId}`;
            // // Construct the URL for hash-based routing
            // const baseUrl = window.location.origin + window.location.pathname;
            // const fullPath = `${baseUrl}#${path}`;
            // window.open(fullPath, '_blank');

            dispatch(setActiveChatId(chatId));

            globalCustomerId = customerId;
            globalChatId = chatId;

        }
    };

    const handleChatPressNewTab = async (customerId, chatId) => {
        const encryptedChatId = encryptData(chatId);
        const encodedChatId = encodeURIComponent(encryptedChatId); // URL-encode the encrypted data
        // navigate(`/devadmin/chat-messages/${encodedChatId}`);
        // console.log(encodedChatId)
        // console.log(decodeURIComponent(encodedChatId))
        // console.log(decryptData(decodeURIComponent(encodedChatId)))

        // Assuming chatId is already properly encoded and needs no further encoding
        const path = `/top/chat-messages/${encodedChatId}`;
        // Construct the URL for hash-based routing
        const baseUrl = window.location.origin + window.location.pathname;
        const fullPath = `${baseUrl}#${path}`;
        window.open(fullPath, '_blank');

        // dispatch(setActiveChatId(chatId));

        globalCustomerId = customerId;
        globalChatId = chatId;

    };

    useEffect(() => {
        dispatch(setActiveChatId(''));
    }, [unreadButtonValue])

    const renderFooter = () => {
        return (
            <>
                {!noMoreData && (
                    <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#DADDE1", height: 60, }}>
                        {loadMoreLoading && (
                            <Spinner
                                animating
                                size="sm"
                                color={'#7B9CFF'}
                            />
                        )}
                    </View>
                )}
            </>


        );
    };

    const renderItem = ({ item }) => {

        const isActive = item.id === activeChatId;
        const messageUnread = !item.read;
        const formattedDate = formatDate(item.lastMessageDate);

        return (
            <ChatListItem
                onPressNewTab={() => handleChatPressNewTab(item.participants.customer, item.id)}
                chatListData={chatListData}
                item={item}
                onPress={() => handleChatPress(item.participants.customer, item.id)}
                isActive={isActive}
                messageUnread={messageUnread}
                formattedDate={formattedDate}
            />
        );

    };

    if (chatListData.length < 1) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ fontWeight: 700, alignSelf: 'center', }}>{unreadButtonValue ? 'No unread messages to show' : 'No messages to show'}</Text>
            </View>
        );
    }

    else {
        return (
            <>
                <FlatList
                    style={{ height: 100, borderBottomLeftRadius: 5, }}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    data={chatListData}
                    initialNumToRender={1}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    onEndReachedThreshold={0.05}
                    removeClippedSubviews={true}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}  // Implement this function
                />

            </>

        );
    }

};


const SearchChat = ({ lastVisible, setLastVisible, unreadButtonValue, activeButtonValue }) => {

    const searchInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [clearVisible, setClearVisible] = useState('');
    const dispatch = useDispatch();

    const searchData = async ({ }) => {
        let q;

        const searchValue = searchInputRef.current?.value;
        if (unreadButtonValue == true) {

            if (activeButtonValue == 0) {
                if (searchValue === '') {
                    q = query(
                        collection(projectExtensionFirestore, 'chats'),
                        where('read', '==', false),
                        orderBy('lastMessageDate', 'desc'),
                        limit(10)
                    );

                    dispatch(setLoadingModalVisible(false));



                }

                else {
                    q = query(
                        collection(projectExtensionFirestore, 'chats'),
                        where('read', '==', false),
                        where('keywords', 'array-contains', searchValue.toUpperCase()),
                        orderBy('lastMessageDate', 'desc'),
                        limit(10)
                    );
                }
            }

            else {
                if (searchValue === '') {
                    q = query(
                        collection(projectExtensionFirestore, 'chats'),
                        where('read', '==', false),
                        where('stepIndicator.value', '==', activeButtonValue),
                        orderBy('lastMessageDate', 'desc'),
                        limit(10)
                    );

                    dispatch(setLoadingModalVisible(false));


                }

                else {
                    q = query(
                        collection(projectExtensionFirestore, 'chats'),
                        where('stepIndicator.value', '==', activeButtonValue),
                        where('read', '==', false),
                        where('keywords', 'array-contains', searchValue.toUpperCase()),
                        orderBy('lastMessageDate', 'desc'),
                        limit(10)
                    );
                }
            }

        }

        else {

            if (activeButtonValue == 0) {
                if (searchValue === '') {
                    q = query(
                        collection(projectExtensionFirestore, 'chats'),
                        orderBy('lastMessageDate', 'desc'),
                        limit(10)
                    );

                    dispatch(setLoadingModalVisible(false));



                }

                else {
                    q = query(
                        collection(projectExtensionFirestore, 'chats'),
                        where('keywords', 'array-contains', searchValue.toUpperCase()),
                        orderBy('lastMessageDate', 'desc'),
                        limit(10)
                    );
                }
            }

            else {
                if (searchValue === '') {
                    q = query(
                        collection(projectExtensionFirestore, 'chats'),
                        where('stepIndicator.value', '==', activeButtonValue),
                        orderBy('lastMessageDate', 'desc'),
                        limit(10)
                    );

                    dispatch(setLoadingModalVisible(false));


                }

                else {
                    q = query(
                        collection(projectExtensionFirestore, 'chats'),
                        where('stepIndicator.value', '==', activeButtonValue),
                        where('keywords', 'array-contains', searchValue.toUpperCase()),
                        orderBy('lastMessageDate', 'desc'),
                        limit(10)
                    );
                }
            }
        }






        try {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const chatsData = [];
                snapshot.forEach((doc) => {
                    chatsData.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                dispatch(setChatListData(chatsData));
                globalLastVisible = snapshot.docs[snapshot.docs.length - 1]


            });

            // Return the unsubscribe function to stop listening when necessary
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        } catch (error) {
            // Handle errors here
            console.error('Error fetching data from Firebase:', error);
        }

    };

    // useEffect(() => {

    //     searchData();

    // }, [searchText])

    useEffect(() => {
        setSearchText('');
        dispatch(setChatListSearchText(''));
        globalSearchText = '';
        searchInputRef.current.value = '';
        setClearVisible(false);

    }, [activeButtonValue, unreadButtonValue])

    const handleSearchEnter = () => {
        // setSortField('dateAdded');
        // setIsSortActive(false)
        if (searchInputRef.current?.value !== '') {
            dispatch(setChatListSearchText(searchInputRef.current.value.trim()));
            setSearchText(searchInputRef.current.value.trim());
            globalSearchText = searchInputRef.current.value.trim();
        }
        else {
            setSearchText('');
            globalSearchText = '';
            if (searchText == '') {
                dispatch(setChatListSearchText(''));
                searchData();

            }



        }

    }

    const handleClearText = () => {
        searchInputRef.current.clear();
        setClearVisible(false);
        if (searchText !== '') {
            setSearchText(''); // Clear the text
            dispatch(setChatListSearchText(''));
            dispatch(setActiveChatId(''));
            globalSearchText = '';
        }
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', alignSelf: 'center', borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 5, margin: 10 }}>
            <TextInput
                ref={searchInputRef}
                onSubmitEditing={handleSearchEnter}
                placeholder='Search'
                placeholderTextColor='#9B9E9F'
                underlineColorAndroid="transparent"
                style={{ flex: 1, height: 40, padding: 10, outlineStyle: 'none' }}
                onChangeText={() => setClearVisible(true)}
                keyboardType='search'
            />
            {clearVisible ? (
                <Pressable
                    focusable={false}
                    onPress={handleClearText}
                    style={({ pressed, hovered }) => [
                        {
                            borderRadius: 10,
                            marginRight: 10,
                            opacity: pressed ? 0.5 : 1, // Change opacity when pressed
                            // Add hover effect
                            backgroundColor: hovered ? '#ddd' : 'transparent',
                        },
                    ]}
                >
                    <MaterialIcons name="close" size={20} color="#000" />
                </Pressable>
            ) : null}
        </View>);
}

const timelineData = [
    { key: '1', title: 'Event 1', description: 'Description 1' },
    { key: '2', title: 'Event 2', description: 'Description 2' },
    // ... more events
];

// const TimelineItem = ({ title, description }) => (
//     <View style={{ alignItems: 'center', marginRight: 20 }}>
//         <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'blue', marginBottom: 5 }} />
//         <Text style={{ fontWeight: 'bold' }}>{title}</Text>
//         <Text style={{ textAlign: 'center' }}>{description}</Text>
//     </View>
// );

// const HorizontalTimeline = () => (
//     <FlatList
//         data={timelineData}
//         renderItem={({ item }) => <TimelineItem title={item.title} description={item.description} />}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={{ flexDirection: 'row', padding: 10 }}
//     />
// );

const ModalAddBank = () => {
    const [modalAddBankVisible, setModalAddBankVisible] = useState(false);
    const [isCancelHovered, setCancelHovered] = useState(false);
    const [isAddHovered, setAddHovered] = useState(false);




    const handleModalAddBankOpen = () => {
        setModalAddBankVisible(true);
    };

    const handleModalAddBankClose = () => {
        setModalAddBankVisible(false);
    };

    const bankNameRef = useRef(null);
    const branchNameRef = useRef(null);
    const swiftcodeRef = useRef(null);
    const addressRef = useRef(null);
    const accountHolderRef = useRef(null);
    const accountNumberRef = useRef(null);



    const addBankAccount = async () => {
        const docRef = doc(projectExtensionFirestore, 'DataForInvoice', 'BankAccounts');

        const bankNameValue = bankNameRef.current?.value;
        const branchNameValue = branchNameRef.current?.value;
        const swiftcodeValue = swiftcodeRef.current?.value;
        const addressValue = addressRef.current?.value;
        const accountHolderValue = accountHolderRef.current?.value;
        const accountNumberValue = accountNumberRef.current?.value;

        const elementToAdd = {
            bankName: bankNameValue,
            branchName: branchNameValue,
            swiftCode: swiftcodeValue,
            address: addressValue,
            accountHolder: accountHolderValue,
            accountNumberValue: accountNumberValue,
        }

        try {
            await updateDoc(docRef, {
                [bankNameValue]: elementToAdd,
            });
            console.log("Element added to the array field");
            handleModalAddBankClose();
        } catch (error) {
            console.error("Error adding element to the array", error);
        }
    }

    return (
        <>
            <Pressable onPress={handleModalAddBankOpen} style={{ alignSelf: 'center', marginHorizontal: 5, marginTop: 3, }}>
                <FontAwesome name={'plus-circle'} size={25} color='#16A34A' />
            </Pressable>

            <Modal isOpen={modalAddBankVisible} onClose={handleModalAddBankClose} useRNModal>
                <Modal.Content>
                    <Modal.Header>Add Bank Account</Modal.Header>
                    <Modal.Body>
                        <View style={{ height: '100%', flex: 1, }}>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Text style={{ width: '35%', fontWeight: 700, margin: 3, }}>Bank Name:</Text>
                                <TextInput
                                    ref={bankNameRef}
                                    placeholderTextColor='#9B9E9F'
                                    placeholder='Bank Name'
                                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Text style={{ width: '35%', fontWeight: 700, margin: 3, }}>Branch Name:</Text>
                                <TextInput
                                    ref={branchNameRef}
                                    placeholderTextColor='#9B9E9F'
                                    placeholder='Branch Name'
                                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Text style={{ width: '35%', fontWeight: 700, margin: 3, }}>SWIFTCODE:</Text>
                                <TextInput
                                    ref={swiftcodeRef}
                                    placeholderTextColor='#9B9E9F'
                                    placeholder='SWIFTCODE'
                                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Text style={{ width: '35%', fontWeight: 700, margin: 3, }}>Address:</Text>
                                <TextInput
                                    ref={addressRef}
                                    placeholderTextColor='#9B9E9F'
                                    placeholder='Address'
                                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Text style={{ width: '35%', fontWeight: 700, margin: 3, }}>Account Holder:</Text>
                                <TextInput
                                    ref={accountHolderRef}
                                    placeholderTextColor='#9B9E9F'
                                    placeholder='Account Holder'
                                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                <Text style={{ width: '35%', fontWeight: 700, margin: 3, }}>Account Number:</Text>
                                <TextInput
                                    ref={accountNumberRef}
                                    placeholderTextColor='#9B9E9F'
                                    placeholder='Account Number'
                                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                                />
                            </View>
                        </View>
                    </Modal.Body>

                    <Modal.Footer>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Pressable
                                style={{ width: 100, padding: 5, borderRadius: 3, backgroundColor: isCancelHovered ? '#686868' : '#525252' }}
                                onHoverIn={() => setCancelHovered(true)}
                                onHoverOut={() => setCancelHovered(false)}
                                onPress={handleModalAddBankClose}
                            >
                                <Text style={{ fontWeight: 500, textAlign: 'center', color: 'white', }}>Cancel</Text>
                            </Pressable>

                            <Pressable
                                onPress={addBankAccount}
                                style={{ width: 100, padding: 5, borderRadius: 3, backgroundColor: isAddHovered ? '#1B8B5A' : '#16A34A' }}
                                onHoverIn={() => setAddHovered(true)}
                                onHoverOut={() => setAddHovered(false)}
                            >
                                <Text style={{ fontWeight: 500, textAlign: 'center', color: 'white', }}>Add</Text>
                            </Pressable>
                        </View>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );


}

const BankInformation = () => {

    let invoiceSelectedDueDate = '';
    const currentDate = useSelector((state) => state.currentDate);
    const invoiceData = useSelector((state) => state.invoiceData);
    const [selectedDueDate, setSelectedDueDate] = useState('');
    const [bankAccountsData, setBankAccountsData] = useState({});
    const [selectedBank, setSelectedBank] = useState(invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.bankAccount.bankName ? invoiceData.bankInformations.bankAccount.bankName : "SUMITOMO MITSUI BANKING CORPORATION");
    let selectedBankData = {};

    const paymentTermsRef = useRef(null);
    const salesAgreementRef = useRef(null);


    useEffect(() => {

        const subscribeToBankAccounts = () => {
            const docRef = doc(projectExtensionFirestore, 'DataForInvoice', 'BankAccounts');

            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const bankAccounts = {};

                    // Assuming each entry in your document is a bank account
                    Object.entries(data).forEach(([key, value]) => {
                        if (value.bankName) {
                            bankAccounts[value.bankName] = value;
                        }
                    });

                    // console.log(bankAccounts);
                    setBankAccountsData(bankAccounts);
                    globalInvoiceVariable.bankInformations.bankAccount = bankAccounts["SUMITOMO MITSUI BANKING CORPORATION"];
                    // Use state or context to store selected bank data if needed
                    // setSelectedBank(bankAccounts["SUMITOMO MITSUI BANKING CORPORATION"]);
                    // console.log(bankAccounts["SUMITOMO MITSUI BANKING CORPORATION"]);
                } else {
                    console.log("No such document!");
                }
            }, (error) => {
                console.error("Error fetching document", error);
            });

            return unsubscribe; // Return the unsubscribe function to call it later to stop listening
        };


        if (currentDate) {
            const date = new Date(currentDate);

            // Check the day of the week
            const dayOfWeek = date.getDay();

            if (dayOfWeek === 5) { // Friday
                date.setDate(date.getDate() + 3); // Add 3 days to reach Monday
            } else if (dayOfWeek === 6) { // Saturday
                date.setDate(date.getDate() + 2); // Add 2 days to reach Monday
            } else {
                date.setDate(date.getDate() + 1); // Sunday to Thursday, add 1 day
            }

            // Format the date back to string
            const adjustedDate = date.toISOString().split('T')[0];
            setSelectedDueDate(invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.dueDate ? invoiceData.bankInformations.dueDate : adjustedDate);
            globalInvoiceVariable.bankInformations.dueDate = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.dueDate ? invoiceData.bankInformations.dueDate : adjustedDate;
            globalInvoiceVariable.bankInformations.paymentTerms = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.paymentTerms ? invoiceData.bankInformations.paymentTerms : paymentTermsRef.current?.value;
            // globalInvoiceVariable.bankInformations.salesAgreement = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.salesAgreement ? invoiceData.bankInformations.salesAgreement : salesAgreementRef.current?.value;
            globalInvoiceVariable.bankInformations.issuingDate = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.issuingDate ? invoiceData.bankInformations.issuingDate : currentDate;


        }

        const unsubscribe = subscribeToBankAccounts();
    }, [currentDate]);



    const ModalCalendar = ({ selectedDate, setSelectedDate, currentDate }) => {

        const [modalCalendarVisible, setModalCalendarVisible] = useState(false);


        const handleModalCalendarOpen = () => {
            setModalCalendarVisible(true);
        };

        const handleModalCalendarClose = () => {
            setModalCalendarVisible(false);
        };



        return (

            <>
                <Pressable style={{ height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    onPress={handleModalCalendarOpen}>
                    <TextInput value={selectedDate} onFocus={handleModalCalendarOpen} />
                </Pressable>

                <Modal isOpen={modalCalendarVisible} onClose={handleModalCalendarClose} useRNModal>
                    <Modal.CloseButton />
                    <Modal.Content>
                        <View style={{ height: '100%', flex: 1 }}>
                            <Calendar
                                onDayPress={useCallback(day => {
                                    setSelectedDate(day.dateString);
                                    invoiceSelectedDueDate = day.dateString;
                                    globalInvoiceVariable.bankInformations.dueDate = day.dateString;
                                    handleModalCalendarClose();
                                }, [])}
                                markedDates={{
                                    [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: '#7b9cff' }
                                }}
                                renderArrow={(direction) => (
                                    direction === 'left' ? <MaterialIcons name='arrow-back-ios' color='#7b9cff' /> : <MaterialIcons name='arrow-forward-ios' color='#7b9cff' />
                                )}
                                enableSwipeMonths={true}
                                initialDate={selectedDate}
                                // minDate={currentDate}
                                showSixWeeks />

                        </View>

                    </Modal.Content>

                </Modal>
            </>

        );

    }


    const handleValueChange = (selectedBankName) => {
        const selectedBankObj = bankAccountsData[selectedBankName];
        setSelectedBank(selectedBankName);
        globalInvoiceVariable.bankInformations.bankAccount = selectedBankObj;
        // console.log(selectedBankObj);
    };

    return (
        <>
            <View style={{ marginLeft: 2, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Due Date:</Text>
                <ModalCalendar currentDate={currentDate} selectedDate={selectedDueDate} setSelectedDate={setSelectedDueDate} />
            </View>

            <View style={{ marginLeft: 2, marginVertical: 10, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Bank Account: </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <Select
                        selectedValue={selectedBank}
                        onValueChange={handleValueChange}
                        bgColor={'#FAFAFA'}
                        accessibilityLabel="Choose Country"
                        placeholder="---"
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon />,
                        }}
                        height={9}
                        style={{ flex: 1, marginLeft: 10, marginRight: 10, paddingLeft: 1, }}
                    >
                        {Object.keys(bankAccountsData).map((bankName) => (
                            <Select.Item key={bankName} label={bankName} value={bankName} />
                        ))}
                    </Select>

                    <ModalAddBank />
                </View>


            </View>

            <View style={{ marginLeft: 2, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Payment Terms:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.bankInformations.paymentTerms = value;
                }} ref={paymentTermsRef} multiline defaultValue={invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.paymentTerms ? invoiceData.bankInformations.paymentTerms : "Full payment via Telegraphic Transfer (T/T) required before the due date."} placeholderTextColor='#9B9E9F' placeholder='Email'
                    style={{ height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>

            {/* <View style={{ flex: 4, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '20%', fontWeight: 700, margin: 3, }}>Sales Agreement:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.bankInformations.salesAgreement = value;
                }} ref={salesAgreementRef} multiline defaultValue={invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.salesAgreement ? invoiceData.bankInformations.salesAgreement : `Payment Information:
The customer is responsible for the bank charges incurred when the T/T (Telegraphic Transfer) is paid.
No warranty service is provided on used vehicles.

Conditions for order cancellation:
(1) Order Cancellation Penalty: If the order is cancelled after payment, a penalty of USD 220 will apply.
(2) Non-refund: Payment for vehicles purchased through pre-delivery inspection is non-refundable.

Intermediary Banking Information:
Bank Name: SUMITOMO MITSUI BANKING CORPORATION (THE NEW YORK AUTHORITY).
Swift code: SMBCUS33
Address: 277 Park Avenue
City: New York, NY
Postal Code: 10172
Country: United States
`}
                    placeholderTextColor='#9B9E9F' placeholder='Email'
                    style={{ width: '60%', height: 100, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View> */}
        </>
    );
}

const PaymentDetails = () => {
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const invoiceData = useSelector((state) => state.invoiceData);

    const fobPriceInput = useRef(null);
    const freightInput = useRef(null);
    const inspectionInput = useRef(null);
    const insuranceInput = useRef(null);

    const [totalAmountCalculated, setTotalAmountCalculated] = useState('0');
    const [selectedIncoterms, setSelectedIncoterms] = useState(invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.incoterms ? invoiceData.paymentDetails.incoterms :
        selectedChatData.insurance ? 'CIF' : 'C&F');

    const [inspectionIsChecked, setInspectionIsChecked] = useState(invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.inspectionIsChecked ? invoiceData.paymentDetails.inspectionIsChecked : (invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.paymentDetails.inspectionIsChecked : selectedChatData.inspection));
    const [inspectionName, setInspectionName] = useState(invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.inspectionName ? invoiceData.paymentDetails.inspectionName : selectedChatData.inspectionName);

    const [warrantyIsChecked, setWarrantyIsChecked] = useState(invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.warrantyIsCheck ? invoiceData.paymentDetails.warrantyIsCheck : selectedChatData.warranty);

    const warrantyPrice = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.warrantyPrice && invoiceData.paymentDetails.warrantyPrice ? invoiceData.paymentDetails.warrantyPrice : 150;
    const insurancePrice = 50;

    const additionalNameRef = useRef(null);
    const additionalPriceRef = useRef(null);

    const safelyParseNumber = (value) => {
        const number = Number(value.replace(/,/g, ''));
        return isNaN(number) ? 0 : number;
    };

    const calculateTotalAmount = () => {
        const fobPrice = safelyParseNumber(fobPriceInput.current?.value);
        const freight = safelyParseNumber(freightInput.current?.value);
        const inspection = safelyParseNumber(inspectionInput.current?.value);
        const insurance = safelyParseNumber(insuranceInput.current?.value);

        const additionalPricesTotal = globalAdditionalPriceArray.reduce((sum, value) => sum + safelyParseNumber(value), 0);

        // const total = Math.round(fobPrice + freight + inspection + (warrantyIsChecked ? warrantyPrice : 0) + insurance + additionalPricesTotal).toLocaleString();
        const total = Math.round(fobPrice + freight + inspection + insurance + additionalPricesTotal).toLocaleString();
        setTotalAmountCalculated(total);
        globalInvoiceVariable.paymentDetails.totalAmount = total;
    };

    useEffect(() => {

        additionalNameRef.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.additionalName ? invoiceData.paymentDetails.additionalName.join('\n') : '';
        additionalPriceRef.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.additionalPrice ? invoiceData.paymentDetails.additionalPrice.join('\n') : '';

        globalInvoiceVariable.paymentDetails.incoterms = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.incoterms ? invoiceData.paymentDetails.incoterms : selectedIncoterms;
        globalInvoiceVariable.paymentDetails.inspectionIsChecked = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.inspectionIsChecked ? invoiceData.paymentDetails.inspectionIsChecked : inspectionIsChecked;
        globalInvoiceVariable.paymentDetails.inspectionName = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.inspectionName ? invoiceData.paymentDetails.inspectionName : inspectionName;
        globalInvoiceVariable.paymentDetails.inspectionPrice = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.inspectionPrice ? invoiceData.paymentDetails.inspectionPrice : inspectionIsChecked ? 300 : 0;
        globalInvoiceVariable.paymentDetails.warrantyIsCheck = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.warrantyIsCheck ? invoiceData.paymentDetails.warrantyIsCheck : warrantyIsChecked;
        // globalInvoiceVariable.paymentDetails.warrantyPrice = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.warrantyPrice ? invoiceData.paymentDetails.warrantyPrice : warrantyIsChecked ? warrantyPrice : 0;
        globalInvoiceVariable.paymentDetails.fobPrice = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.fobPrice ? invoiceData.paymentDetails.fobPrice : fobPriceInput.current?.value;
        globalInvoiceVariable.paymentDetails.freightPrice = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.freightPrice ? invoiceData.paymentDetails.freightPrice : freightInput.current?.value;
        globalInvoiceVariable.paymentDetails.insurancePrice = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.insurancePrice ? invoiceData.paymentDetails.insurancePrice : selectedIncoterms == 'CIF' ? insuranceInput.current?.value : 0;
        globalInvoiceVariable.paymentDetails.additionalPrice = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.additionalPrice ? invoiceData.paymentDetails.additionalPrice : [];
        globalInvoiceVariable.paymentDetails.additionalName = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.additionalName ? invoiceData.paymentDetails.additionalName : [];
        globalAdditionalPriceArray = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.additionalPrice ? invoiceData.paymentDetails.additionalPrice : [];

        calculateTotalAmount();
    }, []);


    useEffect(() => {

        inspectionInput.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.inspectionPrice && invoiceData.paymentDetails.inspectionPrice == true ? invoiceData.paymentDetails.inspectionPrice : inspectionIsChecked ? 300 : 0;
        calculateTotalAmount();

    }, [inspectionIsChecked]);

    useEffect(() => {

        insuranceInput.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.insurancePrice && invoiceData.paymentDetails.incoterms == 'CIF' ? invoiceData.paymentDetails.insurancePrice : selectedIncoterms == 'CIF' ? 50 : 0;
        freightInput.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.freightPrice ? invoiceData.paymentDetails.freightPrice : selectedIncoterms == 'FOB' ? 0 : freightCalculation;

        calculateTotalAmount();

    }, [selectedIncoterms]);

    useEffect(() => {
        calculateTotalAmount();

    }, [warrantyIsChecked]);

    const freightCalculation = (
        (selectedChatData.m3 ? selectedChatData.m3 :
            (selectedChatData.carData && selectedChatData.carData.dimensionCubicMeters ?
                selectedChatData.carData.dimensionCubicMeters : 0)) *
        Number(selectedChatData.freightPrice)
    ).toFixed(2);

    const totalPriceCalculation = (
        (selectedChatData.fobPrice ? selectedChatData.fobPrice :
            (selectedChatData.carData && selectedChatData.carData.fobPrice ?
                selectedChatData.carData.fobPrice : 0) *
            (selectedChatData.jpyToUsd ? selectedChatData.jpyToUsd :
                (selectedChatData.currency && selectedChatData.currency.jpyToUsd ?
                    selectedChatData.currency.jpyToUsd : 0))) +
        parseFloat(freightCalculation)
    ).toFixed(2);

    const fobPriceDollars = (
        (selectedChatData.fobPrice ? selectedChatData.fobPrice :
            (selectedChatData.carData && selectedChatData.carData.fobPrice ?
                selectedChatData.carData.fobPrice : 0) *
            (selectedChatData.jpyToUsd ? selectedChatData.jpyToUsd :
                (selectedChatData.currency && selectedChatData.currency.jpyToUsd ?
                    selectedChatData.currency.jpyToUsd : 0))
        ).toFixed(2));


    const handleAdditionalPriceTextChange = (text) => {
        // Process and filter each line
        const filteredLines = text.split('\n').map(line => {
            let filteredLine = line.replace(/[^0-9.]/g, '');
            const parts = filteredLine.split('.');
            if (parts.length > 2) {
                filteredLine = parts[0] + '.' + parts[1];
            }
            return filteredLine;
        });

        // Update the ref and the state
        additionalPriceRef.current.value = filteredLines.join('\n');
        // setAdditionalPriceArray(filteredLines);
        globalAdditionalPriceArray = filteredLines;
        globalInvoiceVariable.paymentDetails.additionalPrice = filteredLines;
        calculateTotalAmount();

    };

    const handleAdditionalNameTextChange = (text) => {
        // Update the ref
        additionalNameRef.current.value = text;

        // Split the text into lines and update the state
        const lines = text.split('\n');
        // setAdditionalNameArray(lines);
        globalInvoiceVariable.paymentDetails.additionalName = lines;
    };


    const handleFobPriceInputChangeText = (text) => {
        const filteredText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        fobPriceInput.current.value = filteredText;
        globalInvoiceVariable.paymentDetails.fobPrice = filteredText;
        calculateTotalAmount();
    };

    const handleFreightInputChangeText = (text) => {
        const filteredText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        freightInput.current.value = filteredText;
        globalInvoiceVariable.paymentDetails.freightPrice = filteredText;
        calculateTotalAmount();
    };

    const handleInspectionInputChangeText = (text) => {
        const filteredText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        inspectionInput.current.value = filteredText;
        globalInvoiceVariable.paymentDetails.inspectionPrice = filteredText;

        calculateTotalAmount();
    };

    const handleInsuranceInputChangeText = (text) => {
        const filteredText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        insuranceInput.current.value = filteredText;
        globalInvoiceVariable.paymentDetails.insurancePrice = filteredText;
        calculateTotalAmount();
    };

    return (
        <>
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, alignSelf: 'center', }}>
                <Text style={{ fontWeight: 700, fontSize: 16, margin: 3, color: '#16A34A', }}>Payment Details</Text>
            </View>

            <View style={{ marginLeft: 2, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Incoterms:</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <Select
                        selectedValue={selectedIncoterms}
                        onValueChange={(value) => setSelectedIncoterms(value)}
                        bgColor={'#FAFAFA'}
                        accessibilityLabel="Choose Country"
                        placeholder="---"
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon />,
                        }}
                        height={9}
                        style={{ flex: 1, marginLeft: 10, marginRight: 10, paddingLeft: 1, }}
                    >
                        <Select.Item key={'C&F'} label={'C&F'} value={'C&F'} />
                        <Select.Item key={'CIF'} label={'CIF'} value={'CIF'} />
                        <Select.Item key={'FOB'} label={'FOB'} value={'FOB'} />
                    </Select>
                    <Text style={{ fontWeight: 700, margin: 3, }}>Rate: </Text>
                    <Text style={{ fontWeight: 700, margin: 3, color: '#16A34A', }}>
                        {selectedChatData.currency && selectedChatData.currency.usdToJpy
                            ? Number(selectedChatData.currency.usdToJpy).toFixed(2) : '0.00'}
                    </Text>
                </View>

            </View>

            <View style={{ flexDirection: 'row', marginLeft: 2, marginTop: 10, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Inspection:</Text>
                <Checkbox
                    isChecked={inspectionIsChecked}
                    onChange={value => {
                        setInspectionIsChecked(value)
                        globalInvoiceVariable.paymentDetails.inspectionIsChecked = value;
                    }}
                    style={{ margin: 2, borderColor: '#0A9FDC' }}
                    size="sm"
                    _text={{ fontWeight: 700 }}
                />
            </View>

            {/* <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Warranty:</Text>
                <Checkbox
                    isChecked={warrantyIsChecked}
                    onChange={value => setWarrantyIsChecked(value)}
                    style={{ margin: 2, borderColor: '#0A9FDC' }}
                    size="sm"
                    _text={{ fontWeight: 700 }}
                />
                <Text style={{ fontWeight: 700, margin: 3, color: '#16A34A', }}>${warrantyPrice}</Text>
            </View> */}

            <View style={{ marginLeft: 2 }}>
                <Text style={{ fontWeight: 700, margin: 3 }}>FOB Price:</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <Text style={{ fontWeight: 700, margin: 1, paddingTop: 1 }}>$</Text>
                    <TextInput
                        onChangeText={handleFobPriceInputChangeText}
                        ref={fobPriceInput}
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.paymentDetails.fobPrice : selectedIncoterms == 'FOB' ? 0 : fobPriceDollars}
                        placeholderTextColor='#9B9E9F'
                        placeholder='FOB Price'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />
                </View>

            </View>

            <View style={{ marginLeft: 2 }}>
                <Text style={{ fontWeight: 700, margin: 3 }}>Freight:</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <Text style={{ fontWeight: 700, margin: 1, paddingTop: 1 }}>$</Text>
                    <TextInput
                        onChangeText={handleFreightInputChangeText}
                        ref={freightInput}
                        defaultValue={freightCalculation}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Freight'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />
                </View>

            </View>

            <View style={{ marginLeft: 2, display: selectedIncoterms == 'CIF' ? 'flex' : 'none' }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Insurance:</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <Text style={{ fontWeight: 700, margin: 1, paddingTop: 1, }}>$</Text>
                    <TextInput
                        onChangeText={handleInsuranceInputChangeText}
                        ref={insuranceInput}
                        defaultValue={50}
                        placeholderTextColor='#9B9E9F'
                        placeholder={`Insurance`}
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />
                </View>

            </View>

            <View style={{ marginLeft: 2, display: inspectionIsChecked ? 'flex' : 'none' }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Inspection:</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <Text style={{ fontWeight: 700, margin: 1, paddingTop: 1, }}>$</Text>
                    <TextInput
                        onChangeText={handleInspectionInputChangeText}
                        ref={inspectionInput}
                        placeholderTextColor='#9B9E9F'
                        placeholder={`Inspection [${selectedChatData.inspectionName}]`}
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />
                    <Text style={{ fontWeight: 700, margin: 3, color: '#16A34A', }}>{`[${selectedChatData.inspectionName}]`}</Text>
                </View>

            </View>


            <View style={{ marginLeft: 2, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Additional:</Text>

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <TextInput ref={additionalNameRef} onChangeText={handleAdditionalNameTextChange} multiline placeholderTextColor='#9B9E9F' placeholder='Name'
                        style={{ flex: 1, height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                    <TextInput ref={additionalPriceRef} onChangeText={handleAdditionalPriceTextChange} multiline placeholderTextColor='#9B9E9F' placeholder='Price'
                        style={{ flex: 1, height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>


            </View>

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', }} />
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, alignItems: 'center', }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Total Amount:</Text>
                <Text style={{ fontWeight: 700, fontSize: 18, margin: 3, color: '#FF0000', }}>{`$${totalAmountCalculated}`}</Text>
            </View>
        </>
    );


}

const SelectPortOfDischarge = () => {
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const invoiceData = useSelector((state) => state.invoiceData);
    const [countriesDischarge, setCountriesDischarge] = useState([]);
    const [portsData, setPortsData] = useState({});
    const [nearestPorts, setNearestPorts] = useState([]);
    const [selectedPortCountry, setSelectedPortCountry] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.discharge.country : selectedChatData.country);
    const [selectedPort, setSelectedPort] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.discharge.port : selectedChatData.port);



    useEffect(() => {
        // console.log(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.discharge.port : selectedChatData.port);

        const fetchPorts = async () => {
            const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');

            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const sortedPorts = Object.keys(data)
                        .map(portName => ({
                            name: portName.replace(/_/g, '.'), // Replace '_' with '.'
                            ...data[portName]
                        }))
                        .sort((a, b) => a.sortOrder - b.sortOrder);
                    setNearestPorts(sortedPorts);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        const fetchPortsData = async () => {
            const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');

            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPortsData(data);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchPorts();
        fetchPortsData();
        // fetchCountries();

        globalInvoiceVariable.discharge.port = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.discharge.port ? invoiceData.discharge.port : selectedPort;
        globalInvoiceVariable.discharge.country = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.discharge.country ? invoiceData.discharge.country : selectedPortCountry;

    }, []);


    useEffect(() => {
        // When selectedCountry changes, update nearestPorts
        const selectedCountryData = countriesDischarge.find(country => country.name === selectedCountry);
        if (selectedCountryData && selectedCountryData.nearestPorts) {
            setNearestPorts(selectedCountryData.nearestPorts);
        } else {
            setNearestPorts([]); // Reset to empty if no ports or country not found
        }
    }, [selectedCountry, countriesDischarge]);

    useEffect(() => {
        const portData = portsData[selectedPort];
        if (portData && portData.country) {
            setSelectedPortCountry(portData.country);
            // console.log('Nagoya Price ', portData.nagoyaPrice);
            globalInvoiceVariable.discharge.country = portData.country;
        } else {
            setSelectedPortCountry(''); // Reset selected country if port not found or has no country
            console.log('Not found');
        }
    }, [selectedPort, portsData]);

    return (
        <>
            {/* <Select
                selectedValue={selectedCountry}
                onValueChange={(value) => {
                    setSelectedCountry(value)
                    globalInvoiceVariable.discharge.country = value;

                }}
                bgColor={'#FAFAFA'}
                flex={1}
                accessibilityLabel="Choose Country"
                placeholder="---"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon />,
                }}
                style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1 }}
            >
                {countriesDischarge.map((country) => (
                    <Select.Item key={country.name} label={country.name} value={country.name} />
                ))}
            </Select> */}
            <Select
                selectedValue={selectedPort}
                onValueChange={(value) => {
                    setSelectedPort(value)
                    globalInvoiceVariable.discharge.port = value;
                }}
                bgColor={'#FAFAFA'}
                accessibilityLabel="Choose Port"
                placeholder="Select port"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon />,
                }}
                style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1 }}
            >
                {nearestPorts.map((port, index) => (
                    <Select.Item key={index} label={port.name} value={port.name} />
                ))}
            </Select>
        </>
    );

}

const SelectSalesPerson = () => {
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const invoiceData = useSelector((state) => state.invoiceData);
    const [selectedSales, setSelectedSales] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.salesPerson : (selectedChatData.carData && selectedChatData.carData.sales ? selectedChatData.carData.sales : ''));
    const salesData = useSelector((state) => state.salesData);


    useEffect(() => {

        globalInvoiceVariable.salesPerson = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.salesPerson ? invoiceData.salesPerson : (selectedChatData.carData && selectedChatData.carData.sales ? selectedChatData.carData.sales : '');

    }, []);

    return (
        <Select
            selectedValue={selectedSales}
            onValueChange={(value) => {
                setSelectedSales(value);
                globalInvoiceVariable.salesPerson = value;
            }}
            bgColor={'#FAFAFA'}
            accessibilityLabel="---"
            placeholder="---"
            _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon />
            }}
            style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1 }}>
            {salesData.map((item) => (
                <Select.Item key={item.id} label={item.name} value={item.name} />
            ))}
        </Select>
    );
}

const SelectPortOfDeparture = () => {

    const selectedChatData = useSelector((state) => state.selectedChatData);
    const invoiceData = useSelector((state) => state.invoiceData);
    const portData = useSelector((state) => state.portData);
    const salesData = useSelector((state) => state.salesData);
    const [selectedPort, setSelectedPort] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.departurePort : (selectedChatData.carData && selectedChatData.carData.port ? selectedChatData.carData.port : ''));


    useEffect(() => {
        // console.log(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.departurePort : (selectedChatData.carData && selectedChatData.carData.port ? selectedChatData.carData.port : ''));

        globalInvoiceVariable.departurePort = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.departurePort ? invoiceData.departurePort : (selectedChatData.carData && selectedChatData.carData.port ? selectedChatData.carData.port : '');
        globalInvoiceVariable.departureCountry = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.departureCountry ? invoiceData.departureCountry : 'Japan';

    }, []);

    return (
        <View
            style={{
                flexDirection: 'row',
            }}
        >
            <Select
                focusable={false}
                selectedValue='Japan'
                onValueChange={(value) => {
                    globalInvoiceVariable.departureCountry = value;
                }}
                bgColor={'#FAFAFA'}
                flex={1}
                accessibilityLabel="---"
                placeholder="---"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon />
                }}
                style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1, outlineStyle: 'none', }}>
                <Select.Item key={'Japan'} label={'Japan'} value={'Japan'} />
            </Select>

            <Select
                focusable={false}
                selectedValue={selectedPort}
                onValueChange={(value) => {
                    setSelectedPort(value);
                    globalInvoiceVariable.departurePort = value;
                }}
                bgColor={'#FAFAFA'}
                flex={1}
                accessibilityLabel="---"
                placeholder="---"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon />
                }}
                style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1, outlineStyle: 'none' }}>
                {portData.map((item) => (
                    <Select.Item key={item.id} label={item.name} value={item.name} />
                ))}
            </Select>
        </View>
    );

}

const NotifyPartyInput = ({ accountData, setAccountData }) => {
    const invoiceData = useSelector((state) => state.invoiceData);

    const [isChecked, setIsChecked] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.notifyParty.sameAsConsignee : true);

    const notifyPartyName = useRef(null);
    const notifyPartyAddress = useRef(null);
    const notifyPartyCity = useRef(null);
    const notifyPartyCountry = useRef(null);
    const notifyPartyContactNumber = useRef(null);
    const notifyPartyFax = useRef(null);
    const notifyPartyEmail = useRef(null);

    useEffect(() => {

        notifyPartyName.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.name ? invoiceData.notifyParty.name : '';
        notifyPartyAddress.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.address ? invoiceData.notifyParty.address : '';
        notifyPartyCity.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.city ? invoiceData.notifyParty.city : '';
        notifyPartyCountry.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.country ? invoiceData.notifyParty.country : '';
        notifyPartyContactNumber.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.contactNumber ? invoiceData.notifyParty.contactNumber : '';
        notifyPartyFax.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.fax ? invoiceData.notifyParty.fax : '';
        notifyPartyEmail.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.email ? invoiceData.notifyParty.email : '';

        globalInvoiceVariable.notifyParty.name = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.name ? invoiceData.notifyParty.name : notifyPartyName.current?.value;
        globalInvoiceVariable.notifyParty.address = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.address ? invoiceData.notifyParty.address : notifyPartyAddress.current?.value;
        globalInvoiceVariable.notifyParty.city = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.city ? invoiceData.notifyParty.city : notifyPartyCity.current?.value;
        globalInvoiceVariable.notifyParty.country = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.country ? invoiceData.notifyParty.country : notifyPartyCountry.current?.value;
        globalInvoiceVariable.notifyParty.contactNumber = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.contactNumber ? invoiceData.notifyParty.contactNumber : notifyPartyContactNumber.current?.value;
        globalInvoiceVariable.notifyParty.fax = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.fax ? invoiceData.notifyParty.fax : notifyPartyFax.current?.value;
        globalInvoiceVariable.notifyParty.email = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.email ? invoiceData.notifyParty.email : notifyPartyEmail.current?.value;
        globalInvoiceVariable.notifyParty.sameAsConsignee = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.notifyParty.sameAsConsignee ? invoiceData.notifyParty.sameAsConsignee : isChecked;


    }, []);

    return (
        <>
            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', }} />{/* Horizontal Line */}

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, alignSelf: 'center', }}>
                <Text style={{ fontWeight: 700, fontSize: 16, margin: 3, color: '#FF0000', }}>Notify Party</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', margin: 5, }}>
                <Checkbox
                    isChecked={isChecked}
                    onChange={value => {
                        setIsChecked(value)
                        globalInvoiceVariable.notifyParty.sameAsConsignee = value;
                    }}
                    style={{ margin: 2, borderColor: '#0A9FDC' }}
                    size="sm"
                    _text={{ fontWeight: 700 }}
                >
                    Same as consignee
                </Checkbox>
            </View>

            <View style={{ display: isChecked ? 'none' : 'flex', }}>
                <View style={{ margin: 2, }}>
                    <Text style={{ fontWeight: 700, marginLeft: 3, }}>Name:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.name = value;
                    }}
                        ref={notifyPartyName} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Name'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ margin: 2, }}>
                    <Text style={{ fontWeight: 700, marginLeft: 3, }}>Address:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.address = value;
                    }} ref={notifyPartyAddress} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Address'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ margin: 2, }}>
                    <Text style={{ fontWeight: 700, marginLeft: 3, }}>City:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.city = value;
                    }} ref={notifyPartyCity} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='City'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ margin: 2, }}>
                    <Text style={{ fontWeight: 700, marginLeft: 3, }}>Country:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.country = value;
                    }} ref={notifyPartyCountry} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Country'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ margin: 2, }}>
                    <Text style={{ fontWeight: 700, marginLeft: 3, }}>Contact Number:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.contactNumber = value;
                    }} ref={notifyPartyContactNumber} disabled={isChecked} multiline placeholderTextColor='#9B9E9F' placeholder='Contact Number'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ margin: 2, }}>
                    <Text style={{ fontWeight: 700, marginLeft: 3, }}>FAX:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.fax = value;
                    }} ref={notifyPartyFax} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='FAX'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ margin: 2, }}>
                    <Text style={{ fontWeight: 700, marginLeft: 3, }}>Email:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.email = value;
                    }} ref={notifyPartyEmail} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Email'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
            </View>


            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', }} />{/* Horizontal Line */}
        </>
    )
}

const ConsigneeInput = () => {

    const selectedChatData = useSelector((state) => state.selectedChatData);
    const invoiceData = useSelector((state) => state.invoiceData);
    const [isChecked, setIsChecked] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.consignee.sameAsBuyer : true);
    const [accountData, setAccountData] = useState({});

    const consigneeName = useRef(null);
    const consigneeAddress = useRef(null);
    const consigneeCity = useRef(null);
    const consigneeCountry = useRef(null);
    const consigneeContactNumber = useRef(null);
    const consigneeFax = useRef(null);
    const consigneeEmail = useRef(null);


    useEffect(() => {
        const fetchAccountData = async () => {
            if (!selectedChatData.participants && selectedChatData.participants.customer) return; // Make sure there's a selected email
            const docRef = doc(projectExtensionFirestore, 'accounts', selectedChatData.participants.customer);

            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setAccountData(docSnap.data());
                    // console.log(docSnap.data());
                    consigneeName.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.name ? invoiceData.consignee.name : `${data.textFirst ? data.textFirst : ''} ${data.textLast ? data.textLast : ''}`;
                    consigneeAddress.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.address ? invoiceData.consignee.address : `${data.textStreet ? data.textStreet : ''} ${data.textZip ? data.textZip : ''}`;
                    consigneeCity.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.city ? invoiceData.consignee.city : `${data.city ? data.city : ''}`;
                    consigneeCountry.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.country ? invoiceData.consignee.country : `${data.country ? data.country : ''}`;
                    consigneeContactNumber.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.contactNumber ? invoiceData.consignee.contactNumber : `${data.textPhoneNumber ? data.textPhoneNumber : ''}`;
                    consigneeFax.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.fax ? invoiceData.consignee.fax : `${data.fax ? data.fax : ''}`;
                    consigneeEmail.current.value = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.email ? invoiceData.consignee.email : `${data.textEmail ? data.textEmail : ''}`;


                    globalInvoiceVariable.consignee.name = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.name ? invoiceData.consignee.name : `${data.textFirst ? data.textFirst : ''} ${data.textLast ? data.textLast : ''}`;
                    globalInvoiceVariable.consignee.address = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.address ? invoiceData.consignee.address : `${data.textStreet ? data.textStreet : ''} ${data.textZip ? data.textZip : ''}`;
                    globalInvoiceVariable.consignee.city = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.city ? invoiceData.consignee.city : `${data.city ? data.city : ''}`;
                    globalInvoiceVariable.consignee.country = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.country ? invoiceData.consignee.country : `${data.country ? data.country : ''}`;
                    globalInvoiceVariable.consignee.contactNumber = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.contactNumber ? invoiceData.consignee.contactNumber : `${data.textPhoneNumber ? data.textPhoneNumber : ''}`;
                    globalInvoiceVariable.consignee.fax = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.fax ? invoiceData.consignee.fax : `${data.fax ? data.fax : ''}`;
                    globalInvoiceVariable.consignee.email = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.email ? invoiceData.consignee.email : `${data.textEmail ? data.textEmail : ''}`;
                    globalInvoiceVariable.consignee.sameAsBuyer = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.consignee.sameAsBuyer ? invoiceData.consignee.sameAsBuyer : isChecked;

                    // console.log(accountData.length);
                } else {
                    console.log('No such document!');
                    setAccountData(null);
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };
        fetchAccountData();

    }, []);

    useEffect(() => {

        if (isChecked) {
            consigneeName.current.value = `${accountData.textFirst ? accountData.textFirst : ''} ${accountData.textLast ? accountData.textLast : ''}`;
            consigneeAddress.current.value = `${accountData.textStreet ? accountData.textStreet : ''} ${accountData.textZip ? accountData.textZip : ''}`;
            consigneeCity.current.value = `${accountData.city ? accountData.city : ''}`;
            consigneeCountry.current.value = `${accountData.country ? accountData.country : ''}`;
            consigneeContactNumber.current.value = `${accountData.textPhoneNumber ? accountData.textPhoneNumber : ''}`;
            consigneeFax.current.value = `${accountData.fax ? accountData.fax : ''}`;
            consigneeEmail.current.value = `${accountData.textEmail ? accountData.textEmail : ''}`;
        }

        // console.log(globalInvoiceVariable);


    }, [isChecked])


    return (
        <>
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, alignSelf: 'center', }}>
                <Text style={{ fontWeight: 700, fontSize: 16, margin: 3, color: '#0A78BE', }}>Consignee</Text>
            </View>
            <View style={{ flexDirection: 'row', margin: 5, }}>
                <Checkbox
                    isChecked={isChecked}
                    onChange={value => {
                        globalInvoiceVariable.consignee.sameAsBuyer = value;
                        setIsChecked(value)
                    }}
                    style={{ margin: 2, borderColor: '#0A9FDC' }}
                    size="sm"
                    _text={{ fontWeight: 700 }}
                >
                    Same as buyer
                </Checkbox>
            </View>
            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>Name:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.name = value;
                }} ref={consigneeName} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Name'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>Address:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.address = value;
                }} ref={consigneeAddress} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Address'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>City:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.city = value;
                }} ref={consigneeCity} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='City'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>Country:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.country = value;
                }} ref={consigneeCountry} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Country'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>Contact Number:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.contactNumber = value;
                }} ref={consigneeContactNumber} disabled={isChecked} multiline placeholderTextColor='#9B9E9F' placeholder='Contact Number'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>FAX:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.fax = value;
                }} ref={consigneeFax} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='FAX'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>Email:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.email = value;
                }} ref={consigneeEmail} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Email'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>

            <NotifyPartyInput accountData={accountData} setAccountData={setAccountData} />
        </>
    );
}

const InvoiceFeatures = ({ widthScaleFactor, heightScaleFactor }) => {
    const invoiceData = useSelector((state) => state.invoiceData);
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 495 * widthScaleFactor, }}>

            <View
                style={{
                    display: invoiceData.carData.SafetySystemAnBrSy ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Anti-Lock Braking System (ABS)</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SafetySystemDrAi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Driver Airbag</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.SafetySystemPaAi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Passenger Airbag</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.SafetySystemSiAi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Side Airbag</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortAiCoFr ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Air Conditioner (Front)</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortAiCoRe ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Air Conditioner (Rear)</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortAMFMRa ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>AM/FM Radio</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortAMFMSt ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>AM/FM Stereo</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortCDPl ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>CD Player</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortCDCh ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>CD Changer</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortCrSpCo ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Cruis Speed Control</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortDiSp ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}> Digital Speedometer</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.ComfortDVDPl ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>DVD Player</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ComfortHDD ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Hard Disk Drive</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ComfortNaSyGPS ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Navigation System (GPS)</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ComfortPoSt ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Power Steering</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ComfortPrAuSy ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Premium Audio System</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ComfortReKeSy ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Remote Keyless System</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ComfortTiStWh ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Tilt Steering Wheel</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.InteriorLeSe ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Leather Seats</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.InteriorPoDoLo ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Power Door Locks</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.InteriorPoMi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Power Mirrors</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.InteriorPoSe ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Power Seats</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.InteriorPoWi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Power Windows</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.InteriorReWiDe ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Rear Window Defroster</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.InteriorReWiWi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Rear Window Wiper</Text>
            </View>

            <View
                style={{
                    display: invoiceData.carData.InteriorThRoSe ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Third Row Seats</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.InteriorTiGl ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Tinted Glasses</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ExteriorAlWh ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Alloy Wheels</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ExteriorPoSlDo ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Power Sliding Door</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.ExteriorSuRo ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Sunroof</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsCuWh ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Customized Wheels</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsFuLo ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Fully Loaded</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsMaHiAv ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Maintenance History Available</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsBrNeTi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Brand New Tires</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsNoAcHi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>No Accident History</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsNoSmPrOw ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Non-Smoking Previous Owner</Text>
            </View>



            <View
                style={{
                    display: invoiceData.carData.SellingPointsOnOwHi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>One Owner History</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsPeRaTi ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Performance-rated Tires</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsReBo ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Repainted Body</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsTuEn ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Turbo Engine</Text>
            </View>


            <View
                style={{
                    display: invoiceData.carData.SellingPointsUpAuSy ? 'flex' : 'none',
                    borderRadius: 5 * widthScaleFactor,
                    width: 64 * widthScaleFactor,
                    height: 25 * heightScaleFactor,
                    backgroundColor: '#7B9CFF',
                    marginRight: 5 * widthScaleFactor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5 * heightScaleFactor,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 700, fontSize: 7 * widthScaleFactor, }}>Upgraded Audio System</Text>
            </View>
        </View>
    );
}

const createHmacSha256Hash = (data, secretKey) => {
    const hash = HmacSHA256(data, secretKey);
    return enc.Hex.stringify(hash);
};


const ConfirmPaymentModalContent = () => {
    const dispatch = useDispatch();
    const invoiceData = useSelector((state) => state.invoiceData);
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);


    const [historyModalVisible, setHistoryModalVisible] = useState(false);

    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    const totalAmountString = invoiceData.paymentDetails.totalAmount;
    const totalAmountNumber = parseFloat(totalAmountString.replace(/,/g, ''));

    const inputAmountRef = useRef(null);

    const handleHistoryModalOpen = () => {
        setHistoryModalVisible(true);

        // console.log(selectedChatData.payments);
    }

    const handleHistoryModalClose = () => {
        setHistoryModalVisible(false);

    }

    const handleInputAmountChangeText = (text) => {
        // Remove characters that are not digits, dot, or minus, and ensure minus is only at the start
        const filteredText = text
            .replace(/[^0-9.-]/g, '')  // Remove characters that are not digits, dot, or minus
            .replace(/(.)\-/g, '$1')   // Remove minus if not at the start
            .replace(/^-(?=\-)/, '')   // Remove extra minus at the start
            .replace(/(\..*)\./g, '$1'); // Allow only one dot

        // Update the input field
        inputAmountRef.current.value = filteredText;
    };



    const handleCompletePaymentPress = () => {
        const filteredText = invoiceData.paymentDetails.totalAmount.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') - totalValue;
        inputAmountRef.current.value = filteredText;
    }


    const fullPaymentMessage = async () => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

        try {
            // Adding the message to the 'messages' subcollection
            await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                text: `Full Payment Received

Dear Customer,

I hope this message finds you well. 

We are writing to confirm that we have received your full payment. 

Thank you for settling your account promptly.

Should you have any further questions or require assistance, please feel free to contact us.
                
Best regards,
Real Motor Japan`,
                sender: email,
                timestamp: formattedTime, // Using the fetched timestamp
                messageType: 'InputPayment',
                ip: ip, // IP Address
                ipCountry: ipCountry // Country of the IP Address
            });


            // Updating the main chat document with the latest message details
            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                lastMessageSender: email,
                lastMessage: `Full Payment Received

Dear Customer,

I hope this message finds you well. 

We are writing to confirm that we have received your full payment. 
                
Thank you for settling your account promptly.
                
Should you have any further questions or require assistance, please feel free to contact us.
                                
Best regards,
Real Motor Japan`,
                lastMessageDate: formattedTime,
                customerRead: false,
                read: true,
                readBy: [email],
            });

        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }


    const overBalanceMessage = async (amount) => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

        try {
            // Adding the message to the 'messages' subcollection
            await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                text: `Dear Customer,

Good day! 

We're writing to inform you about your account with us at Real Motor Japan.
                
You have an extra overbalance in your account.

Amount: $${amount}
                
Feel free to contact us if you have any questions. We're here to help.
                
Best regards,
Real Motor Japan`,
                sender: email,
                timestamp: formattedTime, // Using the fetched timestamp
                messageType: 'InputPayment',
                ip: ip, // IP Address
                ipCountry: ipCountry // Country of the IP Address
            });


            // Updating the main chat document with the latest message details
            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                lastMessageSender: email,
                lastMessage: `Dear Customer,

Good day! 
                
We're writing to inform you about your account with us at Real Motor Japan.
                                
You have an extra overbalance in your account.
                
Amount: $${amount}
                                
Feel free to contact us if you have any questions. We're here to help.
                                
Best regards,
Real Motor Japan`,
                lastMessageDate: formattedTime,
                customerRead: false,
                read: true,
                readBy: [email],
            });

        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }

    const paymentMessage = async (amount, transactionDate) => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

        try {
            // Adding the message to the 'messages' subcollection
            await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                text: `🌟 Payment Confirmation Alert 🌟

Dear Customer! 👋

We're thrilled to inform you that your recent payment has been successfully reflected in our bank account.

Your prompt and efficient transaction is greatly appreciated! 🎉

🔍 Payment Details:

Amount: $${amount}
Transaction Date: ${transactionDate}

Your account and services are now fully up-to-date. If you have any further questions or require assistance, feel free to reach out.

Thank you for your continued trust in us.
Looking forward to serving you more in the future! 😊

Best regards,
Real Motor Japan`,
                sender: email,
                timestamp: formattedTime, // Using the fetched timestamp
                messageType: 'InputPayment',
                ip: ip, // IP Address
                ipCountry: ipCountry // Country of the IP Address
            });


            // Updating the main chat document with the latest message details
            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                lastMessageSender: email,
                lastMessage: `🌟 Payment Confirmation Alert 🌟

Dear Customer! 👋

We're thrilled to inform you that your recent payment has been successfully reflected in our bank account.

Your prompt and efficient transaction is greatly appreciated! 🎉

🔍 Payment Details:

Amount: $${amount}
Transaction Date: ${transactionDate}

Your account and services are now fully up-to-date. If you have any further questions or require assistance, feel free to reach out.

Thank you for your continued trust in us.
Looking forward to serving you more in the future! 😊

Best regards,
Real Motor Japan`,
                lastMessageDate: formattedTime,
                customerRead: false,
                read: true,
                readBy: [email],
            });

        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }

    const confirmPayment = async () => {
        setIsConfirmLoading(true);

        const amountNeeded = invoiceData.paymentDetails.totalAmount ? invoiceData.paymentDetails.totalAmount.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') - totalValue : '';
        const docRef = doc(projectExtensionFirestore, 'chats', selectedChatData.id);
        const docRefCustomer = doc(projectExtensionFirestore, 'accounts', selectedChatData.participants.customer);
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');

        const newPayments = [
            { value: inputAmountRef.current.value, date: formattedTime },
        ];

        const newPaymentsAccount = [
            { value: inputAmountRef.current.value, date: formattedTime, vehicleRef: selectedChatData.carData.referenceNumber, vehicleName: selectedChatData.carData.carName, },
        ];

        const inputAmount = inputAmountRef.current.value;
        const numericInputAmount = Number(inputAmount);
        const formattedInputAmount = numericInputAmount.toLocaleString();
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        if (inputAmount === '' || inputAmount === '0') {
            setIsConfirmLoading(false);
            return;
        }

        try {
            if (!inputAmount.startsWith('-')) {
                // First, execute paymentMessage
                await paymentMessage(formattedInputAmount, formattedTime);
                await delay(10); //10ms delay

                if (numericInputAmount >= amountNeeded) {
                    // Once paymentMessage is successful, execute fullPaymentMessage
                    await fullPaymentMessage();
                    await delay(10); //10ms delay

                    if (numericInputAmount > amountNeeded) {
                        // Calculate overbalance and execute overBalanceMessage
                        const overBalance = numericInputAmount - amountNeeded;

                        if (overBalance > 0) {
                            await overBalanceMessage(selectedCustomerData.overBalance ? selectedCustomerData.overBalance + overBalance : '');
                            await delay(10); //10ms delay
                            await updateDoc(docRefCustomer, {
                                overBalance: increment(overBalance),
                            });

                        }


                    }

                    // Update step indicator for successful payment
                    await updateDoc(docRef, {
                        'stepIndicator.value': 4,
                        'stepIndicator.status': 'Payment Confirmed',
                    });

                } else {
                    // Handle the case where the payment is less than the amount needed
                    console.log('Partial payment received');
                }

                // Update payments and payments history

                await updateDoc(docRef, {
                    payments: arrayUnion(...newPayments)
                });

                await updateDoc(docRefCustomer, {
                    paymentsHistory: arrayUnion(...newPaymentsAccount)
                });

            } else {
                console.error('Negative value entered');
            }

        } catch (error) {
            console.error('Error processing payment: ', error);
        } finally {
            setIsConfirmLoading(false);
            dispatch(setTransactionModalVisible(false));
        }



    }

    function formatDate(dateString) {
        // Remove ' at ' from the date string
        const cleanedDateString = dateString.replace(' at ', ' ');
        const date = new Date(cleanedDateString);

        if (isNaN(date.getTime())) {
            // Date is not valid
            console.error("Invalid Date:", dateString);
            return "Invalid Date";
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        return `${year} ${month} ${day} at ${hours}:${minutes}${ampm}`;
    }

    const PaymentHistoryModal = ({ historyModalVisible, handleHistoryModalClose, payments }) => {
        // Create a copy of payments and sort it by date in descending order
        const sortedPayments = [...payments].sort((a, b) => {
            const dateA = a.date;
            const dateB = b.date;
            return dateB - dateA; // Sorts in descending order
        });

        // console.log(sortedPayments);

        return (
            <Modal isOpen={historyModalVisible} onClose={handleHistoryModalClose} useRNModal>
                <Modal.Content style={{ backgroundColor: 'white', borderRadius: 10 }}>
                    <Modal.CloseButton />
                    <Modal.Header style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                        Payment History
                    </Modal.Header>
                    <Modal.Body>
                        <ScrollView style={{ flex: 1, paddingHorizontal: 15, maxHeight: 500, }}>
                            {
                                sortedPayments.length > 0 ?
                                    sortedPayments.map((payment, index) => (
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
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE', }}>Date: </Text>
                                                <Text style={{ color: '#333' }}>
                                                    {formatDate(sortedPayments[sortedPayments.length - 1 - index].date)}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE', }}>Value: </Text>
                                                <Text style={{ color: Number(sortedPayments[sortedPayments.length - 1 - index].value).toLocaleString().startsWith('-') ? '#FF0000' : '#16A34A' }}>
                                                    ${Number(sortedPayments[sortedPayments.length - 1 - index].value).toLocaleString()}
                                                </Text>
                                            </Text>

                                        </View>
                                    )) :
                                    <Text style={{ fontWeight: 'bold', alignSelf: 'center', }} italic>No history to show</Text>
                            }
                        </ScrollView>

                    </Modal.Body>
                </Modal.Content>
            </Modal>
        );
    };

    const totalValue = selectedChatData.payments
        ? selectedChatData.payments.reduce((sum, payment) => {
            const value = Number(payment.value);
            return sum + (isNaN(value) ? 0 : value);
        }, 0)
        : 0;

    const isTotalValueGreater = Number(totalValue) < Number(invoiceData.paymentDetails.totalAmount.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    const displayedAmount = isTotalValueGreater ? Number(totalValue).toLocaleString() : invoiceData.paymentDetails.totalAmount;

    return (

        <View style={{ flex: 1, }}>

            <View style={{ marginLeft: 5, }}>

                <Text style={{ fontWefight: 700, fontSize: 14, }}>Total Paid:</Text>

                <Progress w="90%" shadow={2} value={Number(totalValue)} max={totalAmountNumber} _filledTrack={{
                    bg: "lime.500"
                }} />

                <Text style={{ fontWeight: 700, fontSize: 14, color: '#FF0000', }}>${displayedAmount}
                    <Text style={{ fontWeight: 700, fontSize: 14, color: '#8D7777', }}> out of </Text>
                    <Text style={{ fontWeight: 700, fontSize: 14, color: '#16A34A', }}>{`$${invoiceData.paymentDetails.totalAmount}`}</Text>
                </Text>

            </View>

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />{/* Horizontal Line */}

            <View style={{ marginLeft: 5, }}>

                <Pressable
                    onPress={handleHistoryModalOpen}
                    style={{ width: 'fit-content', }}>
                    <Text style={{ fontWeight: 700, fontSize: 14, color: '#0A78BE', }} underline selectable={false}>Payments History</Text>
                </Pressable>

            </View>

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />{/* Horizontal Line */}

            <View style={{ marginLeft: 5, marginTop: 5, }}>

                <Text style={{ fontWeight: 700, fontSize: 14, }}>Input Amount:</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                    <Text style={{ fontWeight: 700, fontSize: 18, }}>$</Text>

                    <TextInput
                        ref={inputAmountRef}
                        placeholderTextColor='#9B9E9F' placeholder='Input Amount'
                        style={{ height: 35, width: 300, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                        onChangeText={handleInputAmountChangeText}
                    />

                </View>

                <Pressable
                    onPress={handleCompletePaymentPress}
                    style={{ width: 'fit-content', }}>
                    <Text style={{ fontWeight: 700, fontSize: 14, color: '#16A34A', }} underline selectable={false}>Complete Payment</Text>
                </Pressable>

            </View>

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />{/* Horizontal Line */}

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5, }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#16A34A', // Change color on hover
                        borderRadius: 5,
                        padding: 5,
                    }}
                >
                    {!isConfirmLoading ? (
                        <Pressable
                            onPress={() => confirmPayment()}
                        >
                            <Text style={{ alignSelf: 'center', color: 'white' }}>
                                Confirm
                            </Text>
                        </Pressable>
                    ) : (
                        <Spinner size={'sm'} color={'white'} />)}

                </View>
            </View>

            <PaymentHistoryModal
                historyModalVisible={historyModalVisible}
                handleHistoryModalClose={handleHistoryModalClose}
                payments={selectedChatData.payments ? selectedChatData.payments : []} />

        </View>

    );

}

const IssueProformaInvoiceModalContent = () => {
    const dispatch = useDispatch();
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const invoiceData = useSelector((state) => state.invoiceData);
    const currentDate = useSelector((state) => state.currentDate);
    const [isConfirmHovered, setIsConfirmHovered] = useState(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    const cfsInputRef = useRef(null);
    const placeOfDeliveryInputRef = useRef(null);
    const secretKey = CRYPTO_KEY.toString();



    const invoiceMessage = async () => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

        try {
            // Adding the message to the 'messages' subcollection
            await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                text: 'Issued Invoice',
                sender: email,
                timestamp: formattedTime, // Using the fetched timestamp
                messageType: 'IssuedInvoice',
                ip: ip, // IP Address
                ipCountry: ipCountry // Country of the IP Address
            });


            // Updating the main chat document with the latest message details
            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                lastMessageSender: email,
                lastMessage: 'Issued Invoice',
                lastMessageDate: formattedTime,
                customerRead: false,
                read: true,
                readBy: [email],
            });

        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }



    const confirmInvoice = async () => {
        setIsConfirmLoading(true);
        const year = currentDate.split('-')[0]; // Split the date and get the year
        const yearSuffix = year.slice(-2); // Get last 2 digits of the year
        const collectionRef = collection(projectExtensionFirestore, "IssuedInvoice");

        try {
            // Retrieve all documents for the current yearF
            const querySnapshot = await getDocs(collectionRef);
            let maxNumber = 0;

            querySnapshot.forEach((doc) => {
                const docName = doc.id;
                if (docName.startsWith(yearSuffix)) {
                    const number = parseInt(docName.substring(2), 10);
                    if (number > maxNumber) {
                        maxNumber = number;
                    }
                }
            });

            const nextNumber = maxNumber + 1;
            const docName = `${yearSuffix}${nextNumber}`;
            const docRef = doc(projectExtensionFirestore, "IssuedInvoice", docName);
            const docRefChatId = doc(projectExtensionFirestore, "chats", selectedChatData.id);

            const hashedData = createHmacSha256Hash(docName, secretKey);

            // Create a new document with the globalInvoiceVariable object
            if (selectedChatData.invoiceNumber) {
                const updateDocRef = doc(projectExtensionFirestore, "IssuedInvoice", selectedChatData.invoiceNumber);

                await setDoc(updateDocRef, {
                    ...globalInvoiceVariable,
                    isCancelled: false,
                    customerEmail: selectedCustomerData.textEmail,
                    chatId: selectedChatData.id,
                    carData: selectedChatData.carData,
                }, { merge: true });

                if (selectedChatData.stepIndicator.value == 1) {
                    await updateDoc(docRefChatId, {
                        'stepIndicator.status': 'Issue Proforma Invoice',
                        'stepIndicator.value': 2,
                        // finalPrice: globalInvoiceVariable.paymentDetails.totalAmount.replace(/,/g, ''),
                    });
                }

                invoiceMessage();
                setIsConfirmLoading(false);
                dispatch(setTransactionModalVisible(false));
            }

            else {

                await setDoc(docRef, {
                    ...globalInvoiceVariable,
                    isCancelled: false,
                    customerEmail: selectedCustomerData.textEmail,
                    chatId: selectedChatData.id,
                    cryptoNumber: hashedData,
                    carData: selectedChatData.carData,
                });

                await updateDoc(docRefChatId, {
                    keywords: arrayUnion(docName),
                    invoiceNumber: docName,
                    'stepIndicator.status': 'Issue Proforma Invoice',
                    'stepIndicator.value': 2,
                    // finalPrice: globalInvoiceVariable.paymentDetails.totalAmount.replace(/,/g, ''),
                });

                invoiceMessage();
                setIsConfirmLoading(false);
                dispatch(setTransactionModalVisible(false));


            }


        } catch (error) {
            console.error("Error creating document: ", error);
        }
    };

    // useEffect(() => {
    //     calculateTotalAmount();
    // }, [additionalPriceArray]);


    useEffect(() => {

        globalInvoiceVariable.cfs = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.cfs ? invoiceData.cfs : cfsInputRef.current?.value;
        globalInvoiceVariable.placeOfDelivery = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.placeOfDelivery ? invoiceData.placeOfDelivery : placeOfDeliveryInputRef.current?.value;

    }, []);


    return (
        <ScrollView style={{ flex: 1, maxHeight: 500, }}>

            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>CFS:</Text>
                <TextInput
                    defaultValue={invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.cfs ? invoiceData.cfs : ''}
                    ref={cfsInputRef} placeholderTextColor='#9B9E9F' placeholder='Input CFS (Optional)'
                    style={{ height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    onChangeText={(value) => globalInvoiceVariable.cfs = value} />
            </View>

            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, marginLeft: 3, }}>Place of Delivery:</Text>
                <TextInput
                    defaultValue={invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.placeOfDelivery ? invoiceData.placeOfDelivery : ''}
                    ref={placeOfDeliveryInputRef} placeholderTextColor='#9B9E9F' placeholder='Place of Delivery (Optional)'
                    style={{ height: 25, width: 200, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    onChangeText={(value) => globalInvoiceVariable.placeOfDelivery = value} />
            </View>

            <View style={{ margin: 5, }}>
                <Text style={{ fontWeight: 700, margin: 3 }}>Port of Departure:</Text>
                <SelectPortOfDeparture />
            </View>

            <View style={{ margin: 5, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Sales Person:</Text>
                <SelectSalesPerson />
            </View>

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 5, }} />

            <View style={{ margin: 2, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Port of Discharge:</Text>
                {/*Select Discharge*/}
                <SelectPortOfDischarge />
            </View>

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 5, }} />

            <ConsigneeInput />

            <PaymentDetails />

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', }} />

            <BankInformation />

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />{/* Horizontal Line */}

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5, }}>
                <View

                    // onTouchEnd={() => confirmInvoice()}
                    style={{
                        flex: 1,
                        backgroundColor: isConfirmHovered ? '#145A32' : '#16A34A', // Change color on hover
                        borderRadius: 5,
                        padding: 5,
                    }}

                // onMouseEnter={() => setIsConfirmHovered(true)}
                // onMouseLeave={() => setIsConfirmHovered(false)}
                >
                    {!isConfirmLoading ? (
                        <Pressable onPress={() => confirmInvoice()}>
                            <Text style={{ alignSelf: 'center', color: 'white' }}>
                                Confirm
                            </Text>
                        </Pressable>

                    ) : (
                        <Spinner size={'sm'} color={'white'} />)}

                </View>
            </View>
        </ScrollView>
    );
}


const ProfitCalculator = () => {

    const selectedChatData = useSelector((state) => state.selectedChatData);
    const invoiceData = useSelector((state) => state.invoiceData);

    const [totalSCCAmount, setTotalSCCAmount] = useState(0);
    const [formattedTotalSCCAmount, setFormattedTotalSCCAmount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [totalProfitAmountDollars, setTotalProfitAmountDollars] = useState(0);
    const hoverIn = () => setIsHovered(true);
    const hoverOut = () => setIsHovered(false);

    const inputPriceRef = useRef(null);


    const [portsData, setPortsData] = useState({});
    const [origFreight, setOrigFreight] = useState(0);
    const [lastFetchedPort, setLastFetchedPort] = useState('');


    // Function to fetch ports data from Firestore
    const fetchPortsData = async () => {
        const currentPort = invoiceData.discharge.port;
        const freightOrigPrice = selectedChatData.freightOrigPrice;

        // Fetch data if the current port is different from the last fetched port
        // and if freightOrigPrice is valid (exists, not an empty string, and not 0)
        if (currentPort !== lastFetchedPort && !freightOrigPrice) {

            const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');
            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data[currentPort]?.kobePrice !== undefined) {

                        if (invoiceData.departurePort == "Nagoya") {

                            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                                freightOrigPrice: data[currentPort].nagoyaPrice,
                            });
                            // console.log("Nagoya Price ", data[currentPort].nagoyaPrice);

                        }
                        else if (invoiceData.departurePort == "Yokohama") {
                            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                                freightOrigPrice: data[currentPort].yokohamaPrice,
                            });
                            // console.log("Yokohama Price ", data[currentPort].yokohamaPrice);

                        }
                        else if (invoiceData.departurePort == "Kyushu") {
                            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                                freightOrigPrice: data[currentPort].kyushuPrice,
                            });
                            // console.log("Kyushu Price ", data[currentPort].kyushuPrice);

                        }
                        else if (invoiceData.departurePort == "Kobe") {
                            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                                freightOrigPrice: data[currentPort].kobePrice,
                            });
                            // console.log("Kobe Price ", data[currentPort].kobePrice);

                        }

                        setLastFetchedPort(currentPort); // Update last fetched port
                    } else {
                        console.log('Port data not found for the given port');
                    }
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        } else {
            console.log('No need to fetch new data');
        }
    };


    // useEffect for fetching ports data
    // useEffect(() => {
    //     // Fetch ports data
    //     const fetchPortsData = async () => {
    //         const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');

    //         try {
    //             const docSnap = await getDoc(docRef);

    //             if (docSnap.exists()) {
    //                 const data = docSnap.data();
    //                 setPortsData(data[invoiceData.discharge.port].kobePrice);
    //                 console.log(data[invoiceData.discharge.port].kobePrice);
    //             } else {
    //                 console.log('No such document!');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching document:', error);
    //         }
    //     };

    //     fetchPortsData();

    // }, [invoiceData]);


    const handleModalOpen = () => {
        setModalVisible(true);
        inputPriceRef.current.value = defaultInputPrice;
        calculateTotalAmount();

    };

    const handleModalClose = () => {
        setModalVisible(false);

    };


    const fee = {
        auction: 10000,
        transport: 10000,
        shippingAgent: 15000,
    };

    const purchasedPrice = Number(selectedChatData.carData && selectedChatData.carData.purchasedPrice ? selectedChatData.carData.purchasedPrice : 0);
    const formattedPurchasedPrice = Number(purchasedPrice).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const auctionFee = Number(fee.auction);
    const formattedAuctionFee = Number(auctionFee).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const transportFee = Number(fee.transport);
    const formattedTransportFee = Number(transportFee).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const shippingAgentFee = Number(fee.shippingAgent);
    const formattedShippingAgentFee = Number(shippingAgentFee).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const cubicMeter = Number(selectedChatData.carData && selectedChatData.carData.dimensionCubicMeters ? selectedChatData.carData.dimensionCubicMeters : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const costPerCubicMeter = Number(selectedChatData && selectedChatData.freightOrigPrice ? selectedChatData.freightOrigPrice : 0);
    const formattedCostPerCubicMeter = Number(costPerCubicMeter).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const totalCubicMeterCostDollars = Number(costPerCubicMeter * cubicMeter);
    const formattedTotalCubicMeterCostDollars = Number(costPerCubicMeter * cubicMeter).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const totalCubicMeterCostYen = Number(totalCubicMeterCostDollars * selectedChatData.currency.usdToJpy);
    const formattedTotalCubicMeterCostYen = Number(totalCubicMeterCostYen).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const realTotalPriceYen = (purchasedPrice + auctionFee + transportFee + shippingAgentFee + totalSCCAmount + totalCubicMeterCostYen)
    const formattedRealTotalPriceYen = Number(realTotalPriceYen).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const realTotalPriceDollars = realTotalPriceYen * selectedChatData.currency.jpyToUsd;
    const formattedRealTotalPriceDollars = realTotalPriceDollars.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });


    const freightCalculation = ((selectedChatData.m3 ? selectedChatData.m3 :
        (selectedChatData.carData && selectedChatData.carData.dimensionCubicMeters ?
            selectedChatData.carData.dimensionCubicMeters : 0)) *
        Number(selectedChatData.freightPrice));


    const totalPriceCalculation = (selectedChatData.fobPrice ? selectedChatData.fobPrice :
        (selectedChatData.carData && selectedChatData.carData.fobPrice ?
            selectedChatData.carData.fobPrice : 0) *
        (selectedChatData.jpyToUsd ? selectedChatData.jpyToUsd :
            (selectedChatData.currency && selectedChatData.currency.jpyToUsd ?
                selectedChatData.currency.jpyToUsd : 0))) + freightCalculation;

    const defaultInputPrice = Math.round(
        invoiceData && invoiceData.paymentDetails && invoiceData.paymentDetails.totalAmount
            ? Number(invoiceData.paymentDetails.totalAmount.replace(/,/g, ''))
            : totalPriceCalculation
    );




    const safelyParseNumber = (value) => {
        const number = Number(value.replace(/,/g, ''));
        return isNaN(number) ? 0 : number;
    };

    const calculateTotalAmount = () => {

        const inputPrice = safelyParseNumber(inputPriceRef.current?.value);

        const totalAmountDollars = Math.round(inputPrice - realTotalPriceDollars);
        setTotalProfitAmountDollars(totalAmountDollars);
        // const total = Math.round(fobPrice + freight + inspection + insurance + additionalPricesTotal).toLocaleString();
        // setTotalAmountCalculated(total);
        // globalInvoiceVariable.paymentDetails.totalAmount = total;
    };

    const handleInputPriceChangeText = (text) => {
        const filteredText = text.replace(/[^0-9]/g, '');
        inputPriceRef.current.value = filteredText;

        calculateTotalAmount();
    };

    useEffect(() => {

        if (selectedChatData.carData && selectedChatData.carData.supplyChainsCostsData) {

            const amounts = selectedChatData.carData.supplyChainsCostsData.map((item) => {
                const expenseName = Object.keys(item)[0];
                const expenseData = item[expenseName];
                return parseFloat(expenseData.amount.replace(',', '')) || 0;
            });

            // Use reduce to add up all the amounts
            const totalAmount = amounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const formattedTotalAmount = totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 });

            setTotalSCCAmount(totalAmount);
            setFormattedTotalSCCAmount(formattedTotalAmount);


            // console.log(defaultInputPrice);
            // console.log(realTotalPriceDollars);
            // console.log(formattedRealTotalPriceDollars);
            // console.log(realTotalPriceYen);

        }




    }, []);

    useEffect(() => {
        const freightOrigPrice = selectedChatData.freightOrigPrice;

        if (modalVisible && !freightOrigPrice) {
            fetchPortsData();
        }


    }, [modalVisible]);

    useEffect(() => {

        if (totalSCCAmount !== 0 || totalSCCAmount !== '') {
            const totalAmountDollars = Math.round(defaultInputPrice - realTotalPriceDollars);
            setTotalProfitAmountDollars(totalAmountDollars);
        }


    }, [totalSCCAmount]);

    return (

        <>
            <Pressable
                onPress={handleModalOpen}
                focusable={false}
                variant='ghost'
                onHoverIn={hoverIn}
                onHoverOut={hoverOut}
                style={{
                    marginTop: 3,
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                    flexDirection: 'row', // Align items in a row
                    alignItems: 'center', // Center items vertically
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: isHovered ? '#4c555c' : '#6e7a83',
                }}>
                <Ionicons size={15} color={'white'} name='calculator' />
                <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', }} >Profit Calculator</Text>
            </Pressable>

            <Modal
                isOpen={modalVisible}
                onClose={() => {
                    handleModalClose()
                }}
                initialFocusRef={inputPriceRef}
                size={'lg'}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Profit Calculator</Modal.Header>
                    <Modal.Body style={{ flexDirection: 'row', backgroundColor: '#fafafa', }}>

                        <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#DADDE1', maxHeight: 500, }}>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 20, }}>Profit (Yen):</Text>
                                <Text selectable style={{
                                    fontWeight: '700', fontSize: 18,
                                    color: Number(totalProfitAmountDollars * selectedChatData.currency.usdToJpy) < 0 ? '#FF0000' : '#8D7777',
                                }}>
                                    {`${Number(totalProfitAmountDollars * selectedChatData.currency.usdToJpy).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 20, }}>Profit (US Dollars):</Text>
                                <Text selectable style={{
                                    fontWeight: '700', fontSize: 18,
                                    color: Number(totalProfitAmountDollars) < 0 ? '#FF0000' : '#16A34A',
                                }}>
                                    {`${Number(totalProfitAmountDollars).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 20, }}>Profit (Percentage):</Text>
                                <Text selectable style={{
                                    fontWeight: '700', fontSize: 18,
                                    color: Number(((totalProfitAmountDollars * selectedChatData.currency.usdToJpy) / purchasedPrice) * 100) <= 10.5 ? '#FF0000' : '#336699',
                                }}>
                                    {`${Number(((totalProfitAmountDollars * selectedChatData.currency.usdToJpy) / purchasedPrice) * 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: '#6E7A83', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 20, color: 'white', }}>Price to calculate:</Text>
                                <TextInput
                                    onChangeText={handleInputPriceChangeText}
                                    defaultValue={defaultInputPrice}
                                    ref={inputPriceRef}
                                    placeholderTextColor='#9B9E9F' placeholder='Input Price'
                                    style={{
                                        backgroundColor: 'white',
                                        height: 25,
                                        margin: 2,
                                        padding: 1,
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: 'white',
                                        outlineStyle: 'none',
                                        fontSize: 18,
                                        fontWeight: '700',
                                    }}
                                />
                            </View>

                        </View>


                        <View style={{ flex: 1, marginLeft: 3 }}>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 16, }}>Purchased Price:</Text>
                                <Text selectable style={{ fontWeight: '400', fontSize: 14, }}>
                                    {`${formattedPurchasedPrice}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 16, }}>Auction Fee:</Text>
                                <Text selectable style={{ fontWeight: '400', fontSize: 14, }}>
                                    {`${formattedAuctionFee}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 16, }}>Transport Fee:</Text>
                                <Text selectable style={{ fontWeight: '400', fontSize: 14, }}>
                                    {`${formattedTransportFee}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 16, }}>Shipping Agent Fee:</Text>
                                <Text selectable style={{ fontWeight: '400', fontSize: 14, }}>
                                    {`${formattedShippingAgentFee}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 16, }}>Supply Chains Costs:</Text>
                                <Text selectable style={{ fontWeight: '400', fontSize: 14, }}>
                                    {`${formattedTotalSCCAmount}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 16, }}>Cubic Meter:</Text>
                                <Text selectable style={{ fontWeight: '400', fontSize: 14, }}>
                                    {`${cubicMeter}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 16, }}>Cost per Cubic Meter:</Text>
                                <Text selectable style={{ fontWeight: '400', fontSize: 14, }}>
                                    {`${formattedCostPerCubicMeter} x ${cubicMeter}`}
                                </Text>
                                <Text selectable style={{ fontWeight: '700', fontSize: 14, color: '#16A34A', }}>
                                    {`${formattedTotalCubicMeterCostDollars}`}
                                </Text>
                                <Text selectable style={{ fontWeight: '700', fontSize: 14, color: '#8D7777', }}>
                                    {`${formattedTotalCubicMeterCostYen}`}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#DADDE1', borderRadius: 5, marginRight: 3, padding: 3, backgroundColor: 'white', }}>
                                <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 20, }}>Total:</Text>
                                <Text selectable style={{ fontWeight: '700', fontSize: 18, color: '#8D7777', }}>
                                    {`${formattedRealTotalPriceYen}`}
                                </Text>
                                <Text selectable style={{ fontWeight: '700', fontSize: 18, color: '#16A34A', }}>
                                    {`${formattedRealTotalPriceDollars}`}
                                </Text>
                            </View>

                        </View>



                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>

    );
}



const GenerateCustomInvoice = () => {

    // npm install html2canvas jspdf
    // import jsPDF from 'jspdf';
    // import html2canvas from 'html2canvas';
    const dispatch = useDispatch();
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const [modalVisible, setModalVisible] = useState(false);
    const invoiceData = useSelector((state) => state.invoiceData);
    const [isPreviewHovered, setIsPreviewHovered] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const invoiceRef = useRef(null);
    const qrCodeRef = useRef(null);
    const [capturedImageUri, setCapturedImageUri] = useState('');
    const [isChecked, setIsChecked] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.notifyParty.sameAsConsignee : false);




    const handleModalOpen = () => {
        setModalVisible(true);

    };

    const handleModalClose = () => {
        setModalVisible(false);
        setCapturedImageUri('');
    }

    function countTrueValuesInCarData(invoiceData) {
        let count = 0;

        // Check if carData exists in invoiceData
        if (invoiceData.carData) {
            // List of fields to check within carData
            const fields = ['interior', 'exterior', 'safetySystem', 'comfort', 'sellingPoints'];

            fields.forEach(field => {
                if (invoiceData.carData[field]) {
                    // Count true values in each field of carData
                    count += Object.values(invoiceData.carData[field]).filter(value => value === true).length;
                }
            });
        }

        return count;
    }



    useEffect(() => {
        let generatedImageUri = '';
        const captureImageAsync = async () => {
            try {
                if (invoiceRef.current && modalVisible == true) {
                    // Adjust the scale to control the captured image resolution
                    const scale = 0.85; // Experiment with different scale values
                    const width = 2480 * scale;
                    const height = 3508 * scale;

                    const imageUri = await captureRef(invoiceRef, {
                        format: 'jpg',
                        quality: 1, // Adjust quality if needed
                        result: 'base64',
                        width: width,
                        height: height,
                    });

                    generatedImageUri = `data:image/jpeg;base64,${imageUri}`
                    setCapturedImageUri(`data:image/jpeg;base64,${imageUri}`);

                    // console.log(`data:image/jpeg;base64,${imageUri}`);
                }
            } catch (error) {
                console.error("Error capturing view:", error);
            }
        };

        captureImageAsync();

    }, [invoiceRef.current, invoiceData, modalVisible]);

    useEffect(() => {
        setCapturedImageUri(capturedImageUri);
    }, [capturedImageUri])

    const captureImage = async () => {
        try {
            // Adjust the scale to control the captured image resolution
            const scale = 0.9; // Experiment with different scale values
            const width = 2480 * scale;
            const height = 3508 * scale;

            const imageUri = await captureRef(invoiceRef, {
                format: 'jpg',
                quality: 1, // Adjust quality if needed
                result: 'base64',
                width: width,
                height: height,
            });
            return `data:image/jpeg;base64,${imageUri}`;
        } catch (error) {
            console.error("Error capturing view:", error);
        }
    };

    const createPDF = async () => {
        const element = invoiceRef.current;
        if (element) {
            // Reduce the scale slightly for smaller file size
            const scale = 1; // Fine-tune this value for balance

            const canvas = await html2canvas(element, {
                scale: scale,
            });

            // Experiment with JPEG quality for a balance between quality and file size
            const imageData = canvas.toDataURL('image/jpeg', 0.9);

            // A4 size dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Adjust PDF compression settings
            const options = {
                imageCompression: 'JPEG',
                imageQuality: 1, // Fine-tune this value as well
            };

            const imgProps = pdf.getImageProperties(imageData);
            const pdfWidthFit = pdfWidth;
            const pdfHeightFit = (imgProps.height * pdfWidthFit) / imgProps.width;

            pdf.addImage(imageData, 'JPEG', 0, 0, pdfWidthFit, pdfHeightFit, undefined, 'FAST', 0, options);

            // Filename logic
            selectedChatData.stepIndicator.value < 3 ?
                pdf.save(`Proforma Invoice (${invoiceData.carData.carName} [${invoiceData.carData.referenceNumber}]) (A4 Paper Size).pdf`) :
                pdf.save(`Invoice No. ${invoiceData.id} (A4 Paper Size).pdf`);
        } else {
            console.error("No element to capture");
        }
    };


    const handleCaptureAndCreatePDF = async () => {
        const capturedImageUri = await captureImage();
        if (capturedImageUri) {
            await createPDF(capturedImageUri);
        }
    };



    if (invoiceData && Object.keys(invoiceData).length > 0) {
        const issuingDateString = invoiceData.bankInformations.issuingDate;
        const dueDateString = invoiceData.bankInformations.dueDate;
        const issuingDateObject = new Date(issuingDateString);
        const dueDateObject = new Date(dueDateString);


        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        formattedIssuingDate = issuingDateObject.toLocaleDateString(undefined, options);
        formattedDueDate = dueDateObject.toLocaleDateString(undefined, options);

    }

    const originalWidth = 794;
    const originalHeight = 1123;


    const originalSmallWidth = 794;
    const originalSmallHeight = 1123;

    const newWidth = 2480;
    const newHeight = 3508;

    const smallWidth = 377;
    const smallHeight = 541;

    const smallWidthScaleFactor = smallWidth / originalSmallWidth;
    const smallHeightScaleFactor = smallHeight / originalSmallHeight;

    const widthScaleFactor = newWidth / originalWidth;
    const heightScaleFactor = newHeight / originalHeight;



    const FormContent = () => {


        return (

            <View
                style={{
                    width: screenWidth < mobileViewBreakpoint ? '98%' : 500
                }}
            >
                <View
                    style={{
                        flex: 1
                    }}
                >

                    <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 10, alignSelf: 'center', }}>Generate Custom Invoice</Text>

                    <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />

                    <Text style={{ margin: 2, fontWeight: 'bold', }}>Issuing Date:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.bankInformations.issuingDate : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Issuing Date'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, fontWeight: 'bold', }}>Due Date:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.bankInformations.dueDate : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Due Date'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Shipped from:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? `${invoiceData.departurePort}, ${invoiceData.departureCountry}` : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Date'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Shipped to:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? `${invoiceData.discharge.port}, ${invoiceData.discharge.country}` : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Date'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Place of Delivery:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length && invoiceData.placeOfDelivery > 0 ? invoiceData.placeOfDelivery : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Place of Delivery'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>CFS:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length && invoiceData.cfs > 0 ? invoiceData.cfs : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='CFS'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />

                    <Text style={{ fontSize: 16, fontWeight: 'bold', alignSelf: 'center', color: '#0A78BE', }}>Consignee</Text>

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Name:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.consignee.name : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Name'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Address:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.consignee.address : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Address'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Email:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.consignee.email : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Email'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Contact Number:</Text>

                    <TextInput
                        multiline
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.consignee.contactNumber : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Contact Number'
                        style={{ flex: 1, height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Fax:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.consignee.fax : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Fax'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />

                    <Text style={{ fontSize: 16, fontWeight: 'bold', alignSelf: 'center', color: '#FF0000', }}>Notify Party</Text>


                    <Checkbox
                        isChecked={isChecked}
                        onChange={value => {
                            setIsChecked(value)
                            globalInvoiceVariable.consignee.sameAsBuyer = value;
                        }}
                        style={{ margin: 2, borderColor: '#0A9FDC' }}
                        size="sm"
                        _text={{ fontWeight: 700 }}
                    >
                        Same as consignee
                    </Checkbox>
                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Name:</Text>

                    <TextInput
                        disabled={isChecked}
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.notifyParty.name : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Name'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, backgroundColor: isChecked ? '#F1F1F1' : '#FFFFFF', borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Address:</Text>

                    <TextInput
                        disabled={isChecked}
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.notifyParty.address : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Address'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, backgroundColor: isChecked ? '#F1F1F1' : '#FFFFFF', borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Email:</Text>

                    <TextInput
                        disabled={isChecked}
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.notifyParty.email : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Email'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, backgroundColor: isChecked ? '#F1F1F1' : '#FFFFFF', borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Contact Number:</Text>

                    <TextInput
                        disabled={isChecked}
                        multiline
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.notifyParty.contactNumber : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Contact Number'
                        style={{ flex: 1, height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, backgroundColor: isChecked ? '#F1F1F1' : '#FFFFFF', borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Fax:</Text>

                    <TextInput
                        disabled={isChecked}
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.notifyParty.fax : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Fax'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, backgroundColor: isChecked ? '#F1F1F1' : '#FFFFFF', borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Car name:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.carData.carName : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Date'
                        style={{ height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Specifications:</Text>

                    <TextInput
                        multiline
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? `${invoiceData.carData.chassisNumber}\n${invoiceData.carData.exteriorColor}\n${Number(invoiceData.carData.engineDisplacement).toLocaleString('en-US')} cc\n${Number(invoiceData.carData.mileage).toLocaleString('en-US')} km\n${invoiceData.carData.fuel}\n${invoiceData.carData.transmission}` : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Date'
                        style={{ height: 120, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Item note:</Text>

                    <TextInput
                        defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? `${invoiceData.paymentDetails.incoterms} ${invoiceData.discharge.port}` : ''}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Item note'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />

                    <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 2, }} />

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>FOB:</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <TextInput
                            defaultValue={'FOB'}
                            placeholderTextColor='#9B9E9F'
                            placeholder='Fob'
                            style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                        />

                        <Text style={{ marginLeft: 2, paddingTop: 5, fontWeight: 'bold', }}>$</Text>
                        <TextInput
                            defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? Math.round(Number(invoiceData.paymentDetails.fobPrice)) : ''}
                            placeholderTextColor='#9B9E9F'
                            placeholder='FOB Price'
                            style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                        />
                    </View>

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Freight:</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <TextInput
                            defaultValue={'Freight'}
                            placeholderTextColor='#9B9E9F'
                            placeholder='Freight'
                            style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                        />

                        <Text style={{ marginLeft: 2, paddingTop: 5, fontWeight: 'bold', }}>$</Text>
                        <TextInput
                            defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? Math.round(Number(invoiceData.paymentDetails.freightPrice)) : ''}
                            placeholderTextColor='#9B9E9F'
                            placeholder='Freight Price'
                            style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                        />
                    </View>

                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Inspection:</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <TextInput
                            defaultValue={'Inspection'}
                            placeholderTextColor='#9B9E9F'
                            placeholder='Inspection'
                            style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                        />

                        <Text style={{ marginLeft: 2, paddingTop: 5, fontWeight: 'bold', }}>$</Text>
                        <TextInput
                            defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.paymentDetails.inspectionPrice : ''}
                            placeholderTextColor='#9B9E9F'
                            placeholder='Inspection Price'
                            style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                        />
                    </View>


                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Total price:</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Text style={{ marginLeft: 2, paddingTop: 5, fontWeight: 'bold', }}>$</Text>
                        <TextInput
                            defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? `${(invoiceData.paymentDetails.totalAmount).replace(/,/g, '')}` : ''}
                            placeholderTextColor='#9B9E9F'
                            placeholder='Total price'
                            style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                        />
                    </View>



                    <Text style={{ margin: 2, paddingTop: 5, fontWeight: 'bold', }}>Divided by:</Text>

                    <TextInput
                        defaultValue={'1'}
                        placeholderTextColor='#9B9E9F'
                        placeholder='Total price'
                        style={{ flex: 1, height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    />



                </View>
            </View>
        )
    }

    return (
        <> {invoiceData && Object.keys(invoiceData).length > 0 &&

            <>{!selectedChatData.isCancelled && <Pressable
                onPress={handleModalOpen}
                focusable={false}
                variant='ghost'
                style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: '#0A8DD5',
                }}>
                <MaterialCommunityIcons size={20} name='file-document-edit' color='white' />
                <Text style={{ fontWeight: 400, color: 'white', }}>
                    {`Generate Custom Invoice`}
                </Text>
            </Pressable>}

                <Modal
                    isOpen={modalVisible}
                    onClose={() => {
                        handleModalClose();
                    }}
                    size={'full'}
                    useRNModal
                >
                    <View style={{ flexDirection: 'row', margin: 2, }}>
                        <Pressable onPress={() => {
                            capturedImageUri ? handleCaptureAndCreatePDF() : null;
                        }}
                            style={{ justifyContent: 'center', flexDirection: 'row', padding: 5, borderRadius: 5, backgroundColor: '#16A34A', }}>
                            <MaterialCommunityIcons size={20} name='download' color='white' />
                            <Text style={{ color: 'white', }}>Download as PDF</Text>
                        </Pressable>
                    </View>

                    {modalVisible &&
                        <ScrollView
                            style={{ maxHeight: 600, maxWidth: screenWidth < mobileViewBreakpoint ? '90%' : 520, }}
                        >
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                left: 0,
                                backgroundColor: 'white',
                                zIndex: 999,
                                flex: 1,
                                alignItems: 'center', // Center horizontally
                            }}>
                                <FormContent />
                            </View>

                            {/* Main content with invoice details */}
                            {

                                <View ref={invoiceRef}
                                    style={{
                                        width: newWidth,
                                        height: newHeight,
                                        backgroundColor: 'white',
                                        zIndex: 1
                                    }}>

                                    <View style={{ position: 'absolute', left: 38 * widthScaleFactor, top: 38 * heightScaleFactor }}>
                                        <NativeImage
                                            source={require('../../assets/RMJ logo for invoice.png')}
                                            style={{
                                                width: 95 * widthScaleFactor,
                                                height: 85 * heightScaleFactor,
                                                resizeMode: 'stretch',
                                            }}
                                        />
                                    </View>

                                    <View style={{ position: 'absolute', alignSelf: 'center', top: 80 * heightScaleFactor }}>
                                        {/* Title */}
                                        {selectedChatData.stepIndicator.value < 3 ?
                                            <Text style={{ fontWeight: 700, fontSize: 25 * widthScaleFactor }}>{`PROFORMA INVOICE`}</Text> :
                                            <Text style={{ fontWeight: 700, fontSize: 25 * widthScaleFactor }}>{`INVOICE`}</Text>
                                        }
                                    </View>

                                    <View style={{ position: 'absolute', right: 38 * widthScaleFactor, top: 38 * heightScaleFactor }}>
                                        {/* QR CODE */}
                                        {selectedChatData.stepIndicator.value < 3 ?
                                            null :
                                            <View
                                                ref={qrCodeRef}
                                            >
                                                <QRCode
                                                    value={invoiceData.cryptoNumber}
                                                    size={80 * widthScaleFactor}
                                                    color="black"
                                                    backgroundColor="white"
                                                />
                                            </View>

                                        }
                                    </View>

                                    <View style={{ position: 'absolute', right: 121 * widthScaleFactor, top: 34 * heightScaleFactor }}>
                                        {/* Invoice Number */}
                                        {selectedChatData.stepIndicator.value < 3 ?
                                            null :
                                            <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor }}>{`Invoice No. RMJ-${invoiceData.id}`}</Text>
                                        }
                                    </View>

                                    {selectedChatData.stepIndicator.value < 3 ?
                                        <View style={{ position: 'absolute', right: 38 * widthScaleFactor, top: 34 * heightScaleFactor, }}>
                                            {/* Issuing Date */}
                                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', }}>
                                                <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor }}>{`Issuing Date: `}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor }}>{`${formattedIssuingDate}`}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', }}>
                                                <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor, color: '#F00A0A', }}>{`Valid Until: `}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor }}>{`${formattedDueDate}`}</Text>
                                            </View>

                                        </View>
                                        :
                                        <View style={{ position: 'absolute', right: 121 * widthScaleFactor, top: 49 * heightScaleFactor, flexDirection: 'row' }}>
                                            {/* Issuing Date */}
                                            <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor }}>{`Issuing Date: `}</Text>
                                            <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor }}>{`${formattedIssuingDate}`}</Text>
                                        </View>
                                    }

                                    <View style={{
                                        position: 'absolute',
                                        left: 40 * widthScaleFactor,
                                        top: 134 * heightScaleFactor,
                                        width: 280 * widthScaleFactor,
                                    }}>
                                        {/* Shipper */}
                                        <Text style={{
                                            fontWeight: 750,
                                            fontSize: 16 * widthScaleFactor,
                                            borderBottomWidth: 3, // Adjust the thickness of the underline
                                            width: 'fit-content', // Make the underline cover the text width
                                            marginBottom: 5, // Add some space between text and underline
                                        }}>
                                            {`Shipper`}
                                        </Text>
                                        <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`Real Motor Japan (YANAGISAWA HD CO.,LTD)`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`26-2 Takara Tsutsumi-cho Toyota City, Aichi Prefecture, Japan, 473-0932`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: +81565850606`}</Text>

                                        <Text style={{ fontWeight: 700, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Shipped From:`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.departurePort}, ${invoiceData.departureCountry}`}</Text>

                                        <Text style={{ fontWeight: 700, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Shipped To:`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.discharge.port}, ${invoiceData.discharge.country}`}</Text>
                                        {invoiceData.placeOfDelivery && invoiceData.placeOfDelivery !== '' ?
                                            <>
                                                <Text style={{ fontWeight: 700, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Place of Delivery:`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.placeOfDelivery}`}</Text>
                                            </>
                                            : null}
                                        {invoiceData.cfs && invoiceData.cfs !== '' ?
                                            <>
                                                <Text style={{ fontWeight: 700, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`CFS:`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.cfs}`}</Text>
                                            </>
                                            : null}

                                        <View style={{ flex: 1, flexDirection: 'row', width: 715 * widthScaleFactor, }}>

                                            <View style={{
                                                flex: 1, width: 280 * widthScaleFactor,
                                            }}>
                                                {/* Buyer Information */}
                                                <Text style={{
                                                    fontWeight: 750,
                                                    fontSize: 18 * widthScaleFactor,
                                                    borderBottomWidth: 3, // Adjust the thickness of the underline
                                                    borderBottomColor: '#0A78BE',
                                                    width: 'fit-content', // Make the underline cover the text width
                                                    marginBottom: 5, // Add some space between text and underline
                                                    color: '#0A78BE',
                                                    marginTop: 25 * heightScaleFactor,

                                                }}>
                                                    {`Buyer Information`}
                                                </Text>
                                                <Text style={{ fontWeight: 750, fontSize: 16 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.name}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.address}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.email}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.contactNumber}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: ${invoiceData.consignee.fax == '' ? 'N/A' : invoiceData.consignee.fax}`}</Text>

                                            </View>

                                            <View style={{ flex: 1, paddingLeft: 20 * widthScaleFactor, width: 280 * widthScaleFactor, }}>
                                                {/* Notify Party */}
                                                <Text style={{
                                                    fontWeight: 750,
                                                    fontSize: 18 * widthScaleFactor,
                                                    borderBottomWidth: 3, // Adjust the thickness of the underline
                                                    borderBottomColor: '#FF0000',
                                                    width: 'fit-content', // Make the underline cover the text width
                                                    marginBottom: 5, // Add some space between text and underline
                                                    color: '#FF0000',
                                                    marginTop: 25 * heightScaleFactor,
                                                }}>
                                                    {`Notify Party`}
                                                </Text>
                                                {invoiceData.notifyParty.sameAsConsignee == true ? (
                                                    <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, }}>{`Same as consignee / buyer`}</Text>) :
                                                    (<>
                                                        <Text style={{ fontWeight: 750, fontSize: 16 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.name}`}</Text>
                                                        <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.address}`}</Text>
                                                        <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.email}`}</Text>
                                                        <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.contactNumber}`}</Text>
                                                        <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: ${invoiceData.notifyParty.fax == '' ? 'N/A' : invoiceData.notifyParty.fax}`}</Text>
                                                    </>)}
                                            </View>

                                        </View>


                                    </View>
                                    {selectedChatData.stepIndicator.value < 3 ?

                                        <View style={{ position: 'absolute', right: 38 * widthScaleFactor, top: 130 * heightScaleFactor, borderWidth: 3, width: 430 * widthScaleFactor, borderColor: '#FF5C00', height: 194 * heightScaleFactor, }}>
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
                                                <Entypo size={50 * widthScaleFactor} name='warning' color={'#FF0000'} />
                                                <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, color: '#FF0000', marginLeft: 20 * widthScaleFactor, }}>{`Bank Information will be provided after placing an order.`}</Text>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ position: 'absolute', right: 38 * widthScaleFactor, top: 130 * heightScaleFactor, borderWidth: 3, width: 430 * widthScaleFactor, borderColor: '#1ABA3D', }}>

                                            <View style={{ flex: 1, alignItems: 'center', }}>
                                                <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor, color: '#114B33', }}>{`Bank Information`}</Text>
                                            </View>

                                            <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 5 * widthScaleFactor, marginBottom: 5 * heightScaleFactor, }}>
                                                <View style={{ flex: 1, marginRight: 50 * widthScaleFactor, }}>
                                                    <Text style={{
                                                        fontWeight: 750,
                                                        fontSize: 14 * widthScaleFactor,
                                                        borderBottomWidth: 3, // Adjust the thickness of the underline
                                                        width: 'fit-content', // Make the underline cover the text width
                                                        marginBottom: 2, // Add some space between text and underline
                                                    }}>
                                                        {`Bank Account`}
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Bank Name: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.bankName}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Branch Name: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.branchName}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`SWIFTCODE: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.swiftCode}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Address: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.address}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Name of Account Holder: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.accountHolder}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Account Number: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.accountNumberValue}`}</Text>
                                                    </Text>
                                                </View>

                                                <View style={{ flex: 1 }}>

                                                    <Text style={{
                                                        fontWeight: 750,
                                                        fontSize: 14 * widthScaleFactor,
                                                        borderBottomWidth: 3, // Adjust the thickness of the underline
                                                        width: 'fit-content', // Make the underline cover the text width
                                                        marginBottom: 2, // Add some space between text and underline
                                                    }}>
                                                        {`Payment Terms`}
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`Terms: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.paymentTerms}`}</Text>
                                                    </Text>

                                                    <View style={{ paddingTop: 30 * heightScaleFactor, }}>

                                                        <Text style={{
                                                            fontWeight: 750,
                                                            fontSize: 14 * widthScaleFactor,
                                                            borderBottomWidth: 3, // Adjust the thickness of the underline
                                                            width: 'fit-content', // Make the underline cover the text width
                                                            marginBottom: 2, // Add some space between text and underline
                                                            color: '#F00A0A',
                                                            borderBottomColor: '#F00A0A',
                                                        }}>
                                                            {`Payment Due`}
                                                        </Text>

                                                        <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, color: '#F00A0A', lineHeight: 14 * widthScaleFactor }}>{`Due Date: `}
                                                            <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, color: 'black', lineHeight: 14 * widthScaleFactor }}>{`${formattedDueDate}`}</Text>
                                                        </Text>

                                                    </View>

                                                </View>

                                            </View>

                                        </View>}





                                    <View style={{
                                        position: 'absolute',
                                        left: 38 * widthScaleFactor,
                                        top: (invoiceData.placeOfDelivery && invoiceData.cfs) || (invoiceData.placeOfDelivery !== '' && invoiceData.cfs !== '') ? 577 * heightScaleFactor : 537 * heightScaleFactor,
                                        width: 718 * widthScaleFactor,
                                        borderWidth: 1 * widthScaleFactor,
                                        borderColor: '#C2E2F4',
                                        alignSelf: 'center',
                                    }}>
                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{ flex: 2, justifyContent: 'center', }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        color: '#008AC6',
                                                    }}>
                                                    {`Description`}
                                                </Text>

                                            </View>

                                            <View style={{ flex: 2, justifyContent: 'center', }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        color: '#008AC6',
                                                    }}>
                                                    {`Notes`}
                                                </Text>
                                            </View>

                                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        color: '#008AC6',
                                                    }}>
                                                    {`Quantity`}
                                                </Text>
                                            </View>

                                            <View style={{ flex: 2, justifyContent: 'center', }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        color: '#008AC6',
                                                    }}>
                                                    {`Amount`}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 5,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                    {`FOB`}
                                                </Text>
                                            </View>


                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                    {`$${Math.round(Number(invoiceData.paymentDetails.fobPrice)).toLocaleString('en-US', { useGrouping: true })}`}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 5,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                    {`Freight`}
                                                </Text>
                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                    {`$${Math.round(Number(invoiceData.paymentDetails.freightPrice)).toLocaleString('en-US', { useGrouping: true })}`}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 5,
                                                flexDirection: 'row',
                                            }}>
                                                {invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") && <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                    {invoiceData.paymentDetails.inspectionIsChecked ? `Inspection [${invoiceData.paymentDetails.inspectionName}]` : ' '}
                                                </Text>}

                                                {invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                                    <>
                                                        <Text
                                                            style={{
                                                                fontWeight: 400,
                                                                fontSize: 12 * widthScaleFactor,
                                                                lineHeight: 14 * widthScaleFactor,
                                                                marginBottom: 3 * heightScaleFactor,
                                                                marginLeft: 2 * widthScaleFactor,
                                                            }}>
                                                            {invoiceData.paymentDetails.inspectionIsChecked ? `Inspection [${invoiceData.paymentDetails.inspectionName}]` : ' '}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontWeight: 400,
                                                                fontSize: 12 * widthScaleFactor,
                                                                lineHeight: 14 * widthScaleFactor,
                                                                marginBottom: 3 * heightScaleFactor,
                                                                marginLeft: 2 * widthScaleFactor,
                                                            }}>
                                                            {invoiceData.paymentDetails.incoterms == "CIF" ? ` + Insurance` : ' '}
                                                        </Text>
                                                    </>
                                                }

                                                {!invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                                    <Text
                                                        style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            marginLeft: 2 * widthScaleFactor,
                                                        }}>
                                                        {invoiceData.paymentDetails.incoterms == "CIF" ? `Insurance` : ' '}
                                                    </Text>
                                                }

                                                {!invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") &&
                                                    <Text
                                                        style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                        }}>
                                                        {' '}
                                                    </Text>
                                                }


                                            </View>


                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                            }}>

                                                {invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") && <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                    {invoiceData.paymentDetails.inspectionIsChecked ? `$${Number(invoiceData.paymentDetails.inspectionPrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                                </Text>}

                                                {invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                                    <Text
                                                        style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                        {invoiceData.paymentDetails.inspectionIsChecked ? `$${Number(invoiceData.paymentDetails.inspectionPrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                                        <Text
                                                            style={{
                                                                fontWeight: 400,
                                                                fontSize: 12 * widthScaleFactor,
                                                                lineHeight: 14 * widthScaleFactor,
                                                                marginBottom: 3 * heightScaleFactor,
                                                            }}>
                                                            {invoiceData.paymentDetails.incoterms === "CIF" ? ` + $${Number(invoiceData.paymentDetails.insurancePrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                                        </Text>
                                                    </Text>

                                                }

                                                {!invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                                    <Text
                                                        style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',

                                                        }}>
                                                        {invoiceData.paymentDetails.incoterms == "CIF" ? `$${Number(invoiceData.paymentDetails.insurancePrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                                    </Text>
                                                }

                                            </View>


                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 5,
                                                flexDirection: 'row',
                                            }}>
                                                {invoiceData.paymentDetails.additionalName && (invoiceData.paymentDetails.additionalName).length > 0 && <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                    {invoiceData.paymentDetails.additionalName && (invoiceData.paymentDetails.additionalName).length > 0 ? `${invoiceData.paymentDetails.additionalName.join(' + ')}` : ' '}
                                                </Text>}


                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                    {invoiceData.paymentDetails.additionalPrice && invoiceData.paymentDetails.additionalPrice.length > 0
                                                        ? invoiceData.paymentDetails.additionalPrice.map(price =>
                                                            `$${parseFloat(price).toLocaleString('en-US', {
                                                                style: 'currency',
                                                                currency: 'USD',
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 0
                                                            }).slice(1)}`
                                                        ).join(' + ')
                                                        : ' '}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                                flexDirection: 'row',
                                                paddingVertical: 2 * heightScaleFactor,

                                            }}>
                                                {invoiceData.carData && invoiceData.carData.carName ? (
                                                    <Text style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                        {"Used Vehicle\n"}
                                                        <Text style={{
                                                            fontWeight: 700,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.carName}\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.chassisNumber}\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.exteriorColor}\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${Number(invoiceData.carData.engineDisplacement).toLocaleString('en-US')} cc\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${Number(invoiceData.carData.mileage).toLocaleString('en-US')} km\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.fuel}\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.transmission}\n`}
                                                        </Text>
                                                    </Text>

                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}


                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            }}>
                                                {invoiceData.paymentDetails && invoiceData.paymentDetails.incoterms && invoiceData.discharge.port && invoiceData.discharge ? (
                                                    <Text style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                        {`${invoiceData.paymentDetails.incoterms} ${invoiceData.discharge.port}`}
                                                    </Text>
                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}
                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            }}>
                                                {invoiceData.carData && invoiceData.carData.carName ? (
                                                    <Text style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                        {'1'}
                                                    </Text>
                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}


                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                                justifyContent: 'center',
                                                flexDirection: 'row',
                                            }}>
                                                {invoiceData.paymentDetails && invoiceData.paymentDetails.totalAmount ? (
                                                    <>
                                                        <Text style={{
                                                            fontWeight: 700,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            color: '#008AC6',
                                                            marginRight: 10 * widthScaleFactor,
                                                            top: 51 * heightScaleFactor,
                                                            left: 50 * widthScaleFactor,
                                                            position: 'absolute',
                                                        }}>
                                                            {"Total"}
                                                            <Text style={{
                                                                fontWeight: 700,
                                                                fontSize: 12 * widthScaleFactor,
                                                                lineHeight: 14 * widthScaleFactor,
                                                                marginBottom: 3 * heightScaleFactor,
                                                                alignSelf: 'center',
                                                                color: '#00720B',
                                                                marginLeft: 5 * widthScaleFactor,
                                                            }}>
                                                                {`$${invoiceData.paymentDetails.totalAmount}`}
                                                            </Text>
                                                        </Text>

                                                    </>
                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}
                                            </View>

                                        </View>

                                    </View>

                                    <View style={{ position: 'absolute', left: 38 * widthScaleFactor, top: 825 * heightScaleFactor, width: 350 * widthScaleFactor, }}>
                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Payment Information:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'The customer is responsible for the bank charges incurred when the T/T (Telegraphic Transfer) is paid.'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                            marginBottom: 5 * heightScaleFactor,
                                        }}>
                                            {'No warranty service is provided on used vehicles.'}
                                        </Text>

                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Conditions for order cancellation:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'(1) Order Cancellation Penalty: If the order is cancelled after payment, a penalty of USD 220 will apply.'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                            marginBottom: 5 * heightScaleFactor,

                                        }}>
                                            {'(2) Non-refund: Payment for vehicles purchased through pre-delivery inspection is non-refundable.'}
                                        </Text>

                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Intermediary Banking Information:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Bank Name: SUMITOMO MITSUI BANKING CORPORATION (NEW YORK BRANCH).'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'Swift code: SMBCUS33'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Address: 277 Park Avenue'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'City: New York, NY'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'Postal Code: 10172'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                            marginBottom: 5 * heightScaleFactor,

                                        }}>
                                            {'Country: United States'}
                                        </Text>
                                    </View>

                                    {selectedChatData.stepIndicator.value < 3 ? null :
                                        <View style={{ position: 'absolute', right: 39 * widthScaleFactor, top: 835 * heightScaleFactor, width: 300 * widthScaleFactor, }}>
                                            <View style={{
                                                width: 300 * widthScaleFactor,
                                                alignItems: 'center',
                                                paddingBottom: 80 * heightScaleFactor, // Adjust this value to control space between image and line
                                            }}>
                                                <NativeImage
                                                    source={require('../../assets/RMJ Invoice Signature with Hanko.png')}
                                                    style={{
                                                        width: 276 * widthScaleFactor,
                                                        height: 81 * heightScaleFactor,
                                                        resizeMode: 'contain',
                                                        alignSelf: 'center',
                                                        marginBottom: 0, // Minimize margin to keep the line close
                                                    }}
                                                />
                                                <View style={{
                                                    borderBottomWidth: 1 * heightScaleFactor,
                                                    borderColor: 'black', // Change the color as needed
                                                    width: '100%', // Line width as per your requirement
                                                }} />
                                                <Text italic style={{
                                                    fontWeight: 700,
                                                    fontSize: 16 * widthScaleFactor,
                                                }}>
                                                    {'Real Motor Japan'}
                                                </Text>
                                            </View>

                                            <View style={{
                                                width: 300 * widthScaleFactor,
                                                alignItems: 'center',
                                                paddingBottom: 5 * heightScaleFactor, // Adjust this value to control space between image and line
                                            }}>

                                                <View style={{
                                                    borderBottomWidth: 1 * heightScaleFactor,
                                                    borderColor: 'black', // Change the color as needed
                                                    width: '100%', // Line width as per your requirement
                                                }} />
                                                <Text italic style={{
                                                    fontWeight: 700,
                                                    fontSize: 16 * widthScaleFactor,
                                                }}>
                                                    {'Your Signature'}
                                                </Text>
                                            </View>
                                        </View>}


                                </View>
                            }


                        </ScrollView>

                    }

                </Modal>
            </>
        }
        </>
    );

}


const PreviewInvoice = () => {

    // npm install html2canvas jspdf
    // import jsPDF from 'jspdf';
    // import html2canvas from 'html2canvas';
    const dispatch = useDispatch();
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const previewInvoiceVisible = useSelector((state) => state.previewInvoiceVisible);
    const invoiceData = useSelector((state) => state.invoiceData);
    const [isPreviewHovered, setIsPreviewHovered] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const invoiceRef = useRef(null);
    const qrCodeRef = useRef(null);
    const [invoiceImageUri, setInvoiceImageUri] = useState('');
    const hoverPreviewIn = () => setIsPreviewHovered(true);
    const hoverPreviewOut = () => setIsPreviewHovered(false);
    const [firstCaptureUri, setFirstCaptureUri] = useState('');
    const [capturedImageUri, setCapturedImageUri] = useState('');
    const [vehicleImageUri, setVehicleImageUri] = useState(globalImageUrl);
    const [featuresTrueCount, setFeaturesTrueCount] = useState(0);
    const [rerenderState, setRerenderState] = useState(0);
    const [imagePreviewKey, setImagePreviewKey] = useState(0);
    const handlePreviewInvoiceModalOpen = () => {
        dispatch(setPreviewInvoiceVisible(true));
    };

    const handlePreviewInvoiceModalClose = () => {
        dispatch(setPreviewInvoiceVisible(false));
        setCapturedImageUri('');
    }

    function countTrueValuesInCarData(invoiceData) {
        let count = 0;

        // Check if carData exists in invoiceData
        if (invoiceData.carData) {
            // List of fields to check within carData
            const fields = ['interior', 'exterior', 'safetySystem', 'comfort', 'sellingPoints'];

            fields.forEach(field => {
                if (invoiceData.carData[field]) {
                    // Count true values in each field of carData
                    count += Object.values(invoiceData.carData[field]).filter(value => value === true).length;
                }
            });
        }

        return count;
    }

    useEffect(() => {

        if (previewInvoiceVisible) {
            setRerenderState(rerenderState + 1);
        }
    }, [previewInvoiceVisible])


    useEffect(() => {
        let generatedImageUri = '';
        const captureImageAsync = async () => {
            try {
                if (invoiceRef.current) {
                    // Adjust the scale to control the captured image resolution
                    const scale = 0.85; // Experiment with different scale values
                    const width = 2480 * scale;
                    const height = 3508 * scale;


                    const imageUri = await captureRef(invoiceRef, {
                        format: 'jpg',
                        quality: 1, // Adjust quality if needed
                        result: 'base64',
                        width: width,
                        height: height,
                    });

                    const trueCount = countTrueValuesInCarData(invoiceData);
                    setFeaturesTrueCount(trueCount);
                    generatedImageUri = `data:image/jpeg;base64,${imageUri}`
                    setCapturedImageUri(`data:image/jpeg;base64,${imageUri}`);

                    // console.log(`data:image/jpeg;base64,${imageUri}`);
                }
            } catch (error) {
                console.error("Error capturing view:", error);
            }
        };


        captureImageAsync();


    }, [invoiceRef.current, invoiceData]);

    useEffect(() => {
        setCapturedImageUri(capturedImageUri);
    }, [capturedImageUri])

    const captureImage = async () => {
        try {
            // Adjust the scale to control the captured image resolution
            const scale = 0.9; // Experiment with different scale values
            const width = 2480 * scale;
            const height = 3508 * scale;

            const imageUri = await captureRef(invoiceRef, {
                format: 'jpg',
                quality: 1, // Adjust quality if needed
                result: 'base64',
                width: width,
                height: height,
            });
            return `data:image/jpeg;base64,${imageUri}`;
        } catch (error) {
            console.error("Error capturing view:", error);
        }
    };

    const createPDF = async () => {
        const element = invoiceRef.current;
        if (element) {
            // Reduce the scale slightly for smaller file size
            const scale = 1; // Fine-tune this value for balance

            const canvas = await html2canvas(element, {
                scale: scale,
            });

            // Experiment with JPEG quality for a balance between quality and file size
            const imageData = canvas.toDataURL('image/jpeg', 0.9);

            // A4 size dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Adjust PDF compression settings
            const options = {
                imageCompression: 'JPEG',
                imageQuality: 1, // Fine-tune this value as well
            };

            const imgProps = pdf.getImageProperties(imageData);
            const pdfWidthFit = pdfWidth;
            const pdfHeightFit = (imgProps.height * pdfWidthFit) / imgProps.width;

            pdf.addImage(imageData, 'JPEG', 0, 0, pdfWidthFit, pdfHeightFit, undefined, 'FAST', 0, options);

            // Filename logic
            selectedChatData.stepIndicator.value < 3 ?
                pdf.save(`Proforma Invoice (${invoiceData.carData.carName} [${invoiceData.carData.referenceNumber}]) (A4 Paper Size).pdf`) :
                pdf.save(`Invoice No. ${invoiceData.id} (A4 Paper Size).pdf`);
        } else {
            console.error("No element to capture");
        }
    };


    const handleCaptureAndCreatePDF = async () => {
        const capturedImageUri = await captureImage();
        if (capturedImageUri) {
            await createPDF(capturedImageUri);
        }
    };



    if (invoiceData && Object.keys(invoiceData).length > 0) {
        const issuingDateString = invoiceData.bankInformations.issuingDate;
        const dueDateString = invoiceData.bankInformations.dueDate;
        const issuingDateObject = new Date(issuingDateString);
        const dueDateObject = new Date(dueDateString);


        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        formattedIssuingDate = issuingDateObject.toLocaleDateString(undefined, options);
        formattedDueDate = dueDateObject.toLocaleDateString(undefined, options);

    }

    const originalWidth = 794;
    const originalHeight = 1123;


    const originalSmallWidth = 794;
    const originalSmallHeight = 1123;

    const newWidth = 2480;
    const newHeight = 3508;

    const smallWidth = 377;
    const smallHeight = 541;

    const smallWidthScaleFactor = smallWidth / originalSmallWidth;
    const smallHeightScaleFactor = smallHeight / originalSmallHeight;

    const widthScaleFactor = newWidth / originalWidth;
    const heightScaleFactor = newHeight / originalHeight;

    const openImage = () => {
        if (Platform.OS === 'web') {
            const imageWindow = window.open();
            imageWindow.document.write(`
                <style>
                    body {
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        overflow: hidden;
                    }
                    img {
                        width: 595px;
                        height: 842px;
                        object-fit: contain;
                        transition: transform 0.25s ease;
                        cursor: zoom-in; /* Set cursor to magnifying glass */
                    }
                    .zoomed {
                        transform: scale(3);
                        transform-origin: center;
                        cursor: zoom-out; /* Change cursor to indicate zooming out */
                    }
                </style>
                <img id="zoomableImage" src="${capturedImageUri}" alt="Base64 Image" draggable="false" />
                <script>
                    const image = document.getElementById('zoomableImage');
    
                    image.addEventListener('mousedown', function(e) {
                        const rect = this.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
    
                        // Set the transform origin to the mouse position
                        this.style.transformOrigin = \`\${x}px \${y}px\`;
                        this.classList.add('zoomed');
                    });
    
                    document.addEventListener('mouseup', function() {
                        image.classList.remove('zoomed');
                    });
                </script>
            `);
        } else {
            console.log('This feature is only available in a web environment');
        }
    };


    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    const modifyAndDownloadExcel = (file, dataToInsert) => {
        // Read the file using SheetJS
        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });

            // Assuming the data is for the first sheet
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Insert your data into the sheet
            // Example: Inserting data starting from the second row, in columns A, B, and C
            dataToInsert.forEach((row, index) => {
                const rowIndex = index + 2; // Adjust based on where you want to start inserting data
                ['A', 'B', 'C'].forEach((col, colIndex) => {
                    const cellRef = `${col}${rowIndex}`;
                    XLSX.utils.sheet_add_aoa(sheet, [[row[colIndex]]], { origin: cellRef });
                });
            });

            // Write the modified workbook to a binary string
            const wbOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

            // Convert the binary string to a Blob and trigger a download
            const blob = new Blob([s2ab(wbOut)], { type: 'application/octet-stream' });
            saveAs(blob, `Invoice No.${selectedChatData.invoiceNumber} Excel.xlsx`);
        };
        reader.readAsBinaryString(file);
    };


    const PreviewInvoiceForMobile = () => {

        return (
            <View
                style={{
                    width: smallWidth,
                    height: smallHeight,
                    backgroundColor: 'white',
                    zIndex: 1
                }}>

                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 999,
                    }}
                />

                <View style={{ position: 'absolute', left: 38 * smallWidthScaleFactor, top: 38 * smallHeightScaleFactor }}>
                    <NativeImage
                        source={require('../../assets/RMJ logo for invoice.png')}
                        style={{
                            width: 95 * smallWidthScaleFactor,
                            height: 85 * smallHeightScaleFactor,
                            resizeMode: 'stretch',
                        }}
                    />
                </View>

                <View style={{ position: 'absolute', alignSelf: 'center', top: 80 * smallHeightScaleFactor }}>
                    {/* Title */}
                    {selectedChatData.stepIndicator.value < 3 ?
                        <Text style={{ fontWeight: 700, fontSize: 25 * smallWidthScaleFactor }}>{`PROFORMA INVOICE`}</Text> :
                        <Text style={{ fontWeight: 700, fontSize: 25 * smallWidthScaleFactor }}>{`INVOICE`}</Text>
                    }
                </View>

                <View style={{ position: 'absolute', right: 38 * smallWidthScaleFactor, top: 38 * smallHeightScaleFactor }}>
                    {/* QR CODE */}
                    {selectedChatData.stepIndicator.value < 3 ?
                        null :
                        <QRCode
                            value={invoiceData.cryptoNumber}
                            size={80 * smallWidthScaleFactor}
                            color="black"
                            backgroundColor="white"
                        />
                    }
                </View>

                <View style={{ position: 'absolute', right: 121 * smallWidthScaleFactor, top: 34 * smallHeightScaleFactor }}>
                    {/* Invoice Number */}
                    {selectedChatData.stepIndicator.value < 3 ?
                        null :
                        <Text style={{ fontWeight: 750, fontSize: 14 * smallWidthScaleFactor }}>{`Invoice No. RMJ-${invoiceData.id}`}</Text>
                    }
                </View>

                {selectedChatData.stepIndicator.value < 3 ?
                    <View style={{ position: 'absolute', right: 38 * smallWidthScaleFactor, top: 34 * smallHeightScaleFactor, }}>
                        {/* Issuing Date */}
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', }}>
                            <Text style={{ fontWeight: 750, fontSize: 14 * smallWidthScaleFactor }}>{`Issuing Date: `}</Text>
                            <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor }}>{`${formattedIssuingDate}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', }}>
                            <Text style={{ fontWeight: 750, fontSize: 14 * smallWidthScaleFactor, color: '#F00A0A', }}>{`Valid Until: `}</Text>
                            <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor }}>{`${formattedDueDate}`}</Text>
                        </View>

                    </View>
                    :
                    <View style={{ position: 'absolute', right: 121 * smallWidthScaleFactor, top: 49 * smallHeightScaleFactor, flexDirection: 'row' }}>
                        {/* Issuing Date */}
                        <Text style={{ fontWeight: 750, fontSize: 14 * smallWidthScaleFactor }}>{`Issuing Date: `}</Text>
                        <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor }}>{`${formattedIssuingDate}`}</Text>
                    </View>
                }

                <View style={{
                    position: 'absolute',
                    left: 40 * smallWidthScaleFactor,
                    top: 134 * smallHeightScaleFactor,
                    width: 280 * smallWidthScaleFactor,
                }}>
                    {/* Shipper */}
                    <Text style={{
                        fontWeight: 750,
                        fontSize: 16 * smallWidthScaleFactor,
                        borderBottomWidth: 3 * smallWidthScaleFactor, // Adjust the thickness of the underline
                        width: 'fit-content', // Make the underline cover the text width
                        marginBottom: 5 * smallHeightScaleFactor, // Add some space between text and underline
                    }}>
                        {`Shipper`}
                    </Text>
                    <Text style={{ fontWeight: 750, fontSize: 14 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`Real Motor Japan (YANAGISAWA HD CO.,LTD)`}</Text>
                    <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`26-2 Takara Tsutsumi-cho Toyota City, Aichi Prefecture, Japan, 473-0932`}</Text>
                    <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`FAX: +81565850606`}</Text>

                    <Text style={{ fontWeight: 700, fontSize: 14 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`Shipped From:`}</Text>
                    <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.departurePort}, ${invoiceData.departureCountry}`}</Text>

                    <Text style={{ fontWeight: 700, fontSize: 14 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`Shipped To:`}</Text>
                    <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.discharge.port}, ${invoiceData.discharge.country}`}</Text>
                    {invoiceData.placeOfDelivery && invoiceData.placeOfDelivery !== '' ?
                        <>
                            <Text style={{ fontWeight: 700, fontSize: 14 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`Place of Delivery:`}</Text>
                            <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor, lineHeight: 12 * smallHeightScaleFactor }}>{`${invoiceData.placeOfDelivery}`}</Text>
                        </>
                        : null}
                    {invoiceData.cfs && invoiceData.cfs !== '' ?
                        <>
                            <Text style={{ fontWeight: 700, fontSize: 14 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`CFS:`}</Text>
                            <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.cfs}`}</Text>
                        </>
                        : null}

                    <View style={{ flex: 1, flexDirection: 'row', width: 715 * smallWidthScaleFactor, }}>

                        <View style={{
                            flex: 1, width: 280 * smallWidthScaleFactor,
                        }}>
                            {/* Buyer Information */}
                            <Text style={{
                                fontWeight: 750,
                                fontSize: 18 * smallWidthScaleFactor,
                                borderBottomWidth: 3 * smallHeightScaleFactor, // Adjust the thickness of the underline
                                borderBottomColor: '#0A78BE',
                                width: 'fit-content', // Make the underline cover the text width
                                marginBottom: 5 * smallHeightScaleFactor, // Add some space between text and underline
                                color: '#0A78BE',
                                marginTop: 45 * smallHeightScaleFactor,

                            }}>
                                {`Buyer Information`}
                            </Text>
                            <Text style={{ fontWeight: 750, fontSize: 16 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.consignee.name}`}</Text>
                            <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.consignee.address}`}</Text>
                            <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.consignee.email}`}</Text>
                            <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.consignee.contactNumber}`}</Text>
                            <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`FAX: ${invoiceData.consignee.fax == '' ? 'N/A' : invoiceData.consignee.fax}`}</Text>

                        </View>

                        <View style={{ flex: 1, paddingLeft: 20 * smallWidthScaleFactor, width: 280 * smallWidthScaleFactor, }}>
                            {/* Notify Party */}
                            <Text style={{
                                fontWeight: 750,
                                fontSize: 18 * smallWidthScaleFactor,
                                borderBottomWidth: 3 * smallHeightScaleFactor, // Adjust the thickness of the underline
                                borderBottomColor: '#FF0000',
                                width: 'fit-content', // Make the underline cover the text width
                                marginBottom: 5 * smallHeightScaleFactor, // Add some space between text and underline
                                color: '#FF0000',
                                marginTop: 45 * smallHeightScaleFactor,
                            }}>
                                {`Notify Party`}
                            </Text>
                            {invoiceData.notifyParty.sameAsConsignee == true ? (
                                <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, }}>{`Same as consignee / buyer`}</Text>) :
                                (<>
                                    <Text style={{ fontWeight: 750, fontSize: 16 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.notifyParty.name}`}</Text>
                                    <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 20 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.notifyParty.address}`}</Text>
                                    <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 20 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.notifyParty.email}`}</Text>
                                    <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 20 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.notifyParty.contactNumber}`}</Text>
                                    <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 20 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`FAX: ${invoiceData.notifyParty.fax == '' ? 'N/A' : invoiceData.notifyParty.fax}`}</Text>
                                </>)}
                        </View>

                    </View>


                </View>
                {selectedChatData.stepIndicator.value < 3 ?

                    <View style={{ position: 'absolute', right: 38 * smallWidthScaleFactor, top: 130 * smallHeightScaleFactor, borderWidth: 3 * smallWidthScaleFactor, width: 430 * smallWidthScaleFactor, borderColor: '#FF5C00', height: 194 * smallHeightScaleFactor, }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
                            <Entypo size={50 * smallWidthScaleFactor} name='warning' color={'#FF0000'} style={{ marginLeft: 15 * smallWidthScaleFactor, }} />
                            <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, color: '#FF0000', marginLeft: 20 * smallWidthScaleFactor, }}>{`Bank Information will be provided after placing an order.`}</Text>
                        </View>
                    </View>
                    :
                    <View style={{ position: 'absolute', right: 38 * smallWidthScaleFactor, top: 130 * smallHeightScaleFactor, borderWidth: 3 * smallWidthScaleFactor, width: 430 * smallWidthScaleFactor, borderColor: '#1ABA3D', }}>

                        <View style={{ flex: 1, alignItems: 'center', }}>
                            <Text style={{ fontWeight: 750, fontSize: 14 * smallWidthScaleFactor, color: '#114B33', }}>{`Bank Information`}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 5 * smallWidthScaleFactor, marginBottom: 5 * smallHeightScaleFactor, }}>
                            <View style={{ flex: 1, marginRight: 50 * smallWidthScaleFactor, }}>
                                <Text style={{
                                    fontWeight: 750,
                                    fontSize: 14 * smallWidthScaleFactor,
                                    borderBottomWidth: 3 * smallHeightScaleFactor, // Adjust the thickness of the underline
                                    width: 'fit-content', // Make the underline cover the text width
                                    marginBottom: 2 * smallHeightScaleFactor, // Add some space between text and underline
                                }}>
                                    {`Bank Account`}
                                </Text>

                                <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor, marginTop: 3 * smallHeightScaleFactor, }}>{`Bank Name: `}
                                    <Text style={{ fontWeight: 400, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.bankName}`}</Text>
                                </Text>

                                <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor, marginTop: 3 * smallHeightScaleFactor, }}>{`Branch Name: `}
                                    <Text style={{ fontWeight: 400, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.branchName}`}</Text>
                                </Text>

                                <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor, marginTop: 3 * smallHeightScaleFactor, }}>{`SWIFTCODE: `}
                                    <Text style={{ fontWeight: 400, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.swiftCode}`}</Text>
                                </Text>

                                <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor, marginTop: 3 * smallHeightScaleFactor, }}>{`Address: `}
                                    <Text style={{ fontWeight: 400, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.address}`}</Text>
                                </Text>

                                <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor, marginTop: 3 * smallHeightScaleFactor, }}>{`Name of Account Holder: `}
                                    <Text style={{ fontWeight: 400, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.accountHolder}`}</Text>
                                </Text>

                                <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor, marginTop: 3 * smallHeightScaleFactor, }}>{`Account Number: `}
                                    <Text style={{ fontWeight: 400, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.accountNumberValue}`}</Text>
                                </Text>
                            </View>

                            <View style={{ flex: 1 }}>

                                <Text style={{
                                    fontWeight: 750,
                                    fontSize: 14 * smallWidthScaleFactor,
                                    borderBottomWidth: 3 * smallWidthScaleFactor, // Adjust the thickness of the underline
                                    width: 'fit-content', // Make the underline cover the text width
                                    marginBottom: 2 * smallHeightScaleFactor, // Add some space between text and underline
                                }}>
                                    {`Payment Terms`}
                                </Text>

                                <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`Terms: `}
                                    <Text style={{ fontWeight: 400, fontSize: 12 * smallWidthScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.bankInformations.paymentTerms}`}</Text>
                                </Text>

                                <View style={{ paddingTop: 30 * smallHeightScaleFactor, }}>

                                    <Text style={{
                                        fontWeight: 750,
                                        fontSize: 14 * smallWidthScaleFactor,
                                        borderBottomWidth: 3 * smallWidthScaleFactor, // Adjust the thickness of the underline
                                        width: 'fit-content', // Make the underline cover the text width
                                        marginBottom: 2 * smallHeightScaleFactor, // Add some space between text and underline
                                        color: '#F00A0A',
                                        borderBottomColor: '#F00A0A',
                                    }}>
                                        {`Payment Due`}
                                    </Text>

                                    <Text style={{ fontWeight: 750, fontSize: 12 * smallWidthScaleFactor, color: '#F00A0A', lineHeight: 14 * smallWidthScaleFactor }}>{`Due Date: `}
                                        <Text style={{ fontWeight: 400, fontSize: 12 * smallWidthScaleFactor, color: 'black', lineHeight: 14 * smallWidthScaleFactor }}>{`${formattedDueDate}`}</Text>
                                    </Text>

                                </View>

                            </View>

                        </View>

                    </View>}



                <View style={{
                    position: 'absolute',
                    left: 38 * smallWidthScaleFactor,
                    top: (invoiceData.placeOfDelivery && invoiceData.cfs) || (invoiceData.placeOfDelivery !== '' && invoiceData.cfs !== '') ? 577 * smallHeightScaleFactor : 537 * smallHeightScaleFactor,
                    width: 718 * smallWidthScaleFactor,
                    borderWidth: 1 * smallWidthScaleFactor,
                    borderColor: '#C2E2F4',
                    alignSelf: 'center',
                }}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>

                        <View style={{ flex: 2, justifyContent: 'center', }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                    color: '#008AC6',
                                }}>
                                {`Description`}
                            </Text>

                        </View>

                        <View style={{ flex: 2, justifyContent: 'center', }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                    color: '#008AC6',
                                }}>
                                {`Notes`}
                            </Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                    color: '#008AC6',
                                }}>
                                {`Quantity`}
                            </Text>
                        </View>

                        <View style={{ flex: 2, justifyContent: 'center', }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                    color: '#008AC6',
                                }}>
                                {`Amount`}
                            </Text>
                        </View>

                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', }}>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 5,
                        }}>
                            <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    marginLeft: 2 * smallWidthScaleFactor,
                                }}>
                                {`FOB`}
                            </Text>
                        </View>


                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 2,
                        }}>
                            <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                }}>
                                {`$${Math.round(Number(invoiceData.paymentDetails.fobPrice)).toLocaleString('en-US', { useGrouping: true })}`}
                            </Text>
                        </View>

                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', }}>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 5,
                        }}>
                            <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    marginLeft: 2 * smallWidthScaleFactor,
                                }}>
                                {`Freight`}
                            </Text>
                        </View>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 2,
                        }}>
                            <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                }}>
                                {`$${Math.round(Number(invoiceData.paymentDetails.freightPrice)).toLocaleString('en-US', { useGrouping: true })}`}
                            </Text>
                        </View>

                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', }}>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 5,
                            flexDirection: 'row',
                        }}>
                            {invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") && <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    marginLeft: 2 * smallWidthScaleFactor,
                                }}>
                                {invoiceData.paymentDetails.inspectionIsChecked ? `Inspection [${invoiceData.paymentDetails.inspectionName}]` : ' '}
                            </Text>}

                            {invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                <>
                                    <Text
                                        style={{
                                            fontWeight: 400,
                                            fontSize: 12 * smallWidthScaleFactor,
                                            lineHeight: 14 * smallWidthScaleFactor,
                                            marginBottom: 3 * smallHeightScaleFactor,
                                            marginLeft: 2 * smallWidthScaleFactor,
                                        }}>
                                        {invoiceData.paymentDetails.inspectionIsChecked ? `Inspection [${invoiceData.paymentDetails.inspectionName}]` : ' '}
                                    </Text>
                                    <Text
                                        style={{
                                            fontWeight: 400,
                                            fontSize: 12 * smallWidthScaleFactor,
                                            lineHeight: 14 * smallWidthScaleFactor,
                                            marginBottom: 3 * smallHeightScaleFactor,
                                            marginLeft: 2 * smallWidthScaleFactor,
                                        }}>
                                        {invoiceData.paymentDetails.incoterms == "CIF" ? ` + Insurance` : ' '}
                                    </Text>
                                </>
                            }

                            {!invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                <Text
                                    style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        marginLeft: 2 * smallWidthScaleFactor,
                                    }}>
                                    {invoiceData.paymentDetails.incoterms == "CIF" ? `Insurance` : ' '}
                                </Text>
                            }

                            {!invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") &&
                                <Text
                                    style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                    }}>
                                    {' '}
                                </Text>
                            }


                        </View>


                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 2,
                        }}>

                            {invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") && <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                }}>
                                {invoiceData.paymentDetails.inspectionIsChecked ? `$${Number(invoiceData.paymentDetails.inspectionPrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                            </Text>}

                            {invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                <Text
                                    style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',
                                    }}>
                                    {invoiceData.paymentDetails.inspectionIsChecked ? `$${Number(invoiceData.paymentDetails.inspectionPrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                    <Text
                                        style={{
                                            fontWeight: 400,
                                            fontSize: 12 * smallWidthScaleFactor,
                                            lineHeight: 14 * smallWidthScaleFactor,
                                            marginBottom: 3 * smallHeightScaleFactor,
                                        }}>
                                        {invoiceData.paymentDetails.incoterms === "CIF" ? ` + $${Number(invoiceData.paymentDetails.insurancePrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                    </Text>
                                </Text>

                            }

                            {!invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                <Text
                                    style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',

                                    }}>
                                    {invoiceData.paymentDetails.incoterms == "CIF" ? `$${Number(invoiceData.paymentDetails.insurancePrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                </Text>
                            }

                        </View>


                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', }}>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 5,
                            flexDirection: 'row',
                        }}>
                            {invoiceData.paymentDetails.additionalName && (invoiceData.paymentDetails.additionalName).length > 0 && <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    marginLeft: 2 * smallWidthScaleFactor,
                                }}>
                                {invoiceData.paymentDetails.additionalName && (invoiceData.paymentDetails.additionalName).length > 0 ? `${invoiceData.paymentDetails.additionalName.join(' + ')}` : ' '}
                            </Text>}


                        </View>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 2,
                        }}>
                            <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                }}>
                                {invoiceData.paymentDetails.additionalPrice && invoiceData.paymentDetails.additionalPrice.length > 0
                                    ? invoiceData.paymentDetails.additionalPrice.map(price =>
                                        `$${parseFloat(price).toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).slice(1)}`
                                    ).join(' + ')
                                    : ' '}
                            </Text>
                        </View>

                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', }}>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 2,
                            flexDirection: 'row',
                            paddingVertical: 2 * smallHeightScaleFactor,

                        }}>
                            {invoiceData.carData && invoiceData.carData.carName ? (
                                <Text style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                    marginLeft: 2 * smallWidthScaleFactor,
                                }}>
                                    {"Used Vehicle\n"}
                                    <Text style={{
                                        fontWeight: 700,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',
                                    }}>
                                        {`${invoiceData.carData.carName}\n`}
                                    </Text>
                                    <Text style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',
                                    }}>
                                        {`${invoiceData.carData.chassisNumber}\n`}
                                    </Text>
                                    <Text style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',
                                    }}>
                                        {`${invoiceData.carData.exteriorColor}\n`}
                                    </Text>
                                    <Text style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',
                                    }}>
                                        {`${Number(invoiceData.carData.engineDisplacement).toLocaleString('en-US')} cc\n`}
                                    </Text>
                                    <Text style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',
                                    }}>
                                        {`${Number(invoiceData.carData.mileage).toLocaleString('en-US')} km\n`}
                                    </Text>
                                    <Text style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',
                                    }}>
                                        {`${invoiceData.carData.fuel}\n`}
                                    </Text>
                                    <Text style={{
                                        fontWeight: 400,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        alignSelf: 'center',
                                    }}>
                                        {`${invoiceData.carData.transmission}\n`}
                                    </Text>
                                </Text>

                            ) : (
                                <Text>{' '}</Text>
                            )}


                        </View>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 2,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                            {invoiceData.paymentDetails && invoiceData.paymentDetails.incoterms && invoiceData.discharge.port && invoiceData.discharge ? (
                                <Text style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                }}>
                                    {`${invoiceData.paymentDetails.incoterms} ${invoiceData.discharge.port}`}
                                </Text>
                            ) : (
                                <Text>{' '}</Text>
                            )}
                        </View>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                            {invoiceData.carData && invoiceData.carData.carName ? (
                                <Text style={{
                                    fontWeight: 400,
                                    fontSize: 12 * smallWidthScaleFactor,
                                    lineHeight: 14 * smallWidthScaleFactor,
                                    marginBottom: 3 * smallHeightScaleFactor,
                                    alignSelf: 'center',
                                }}>
                                    {'1'}
                                </Text>
                            ) : (
                                <Text>{' '}</Text>
                            )}


                        </View>

                        <View style={{
                            borderTopWidth: 1 * smallWidthScaleFactor,
                            borderColor: '#C2E2F4',
                            flex: 2,
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>
                            {invoiceData.paymentDetails && invoiceData.paymentDetails.totalAmount ? (
                                <>
                                    <Text style={{
                                        fontWeight: 700,
                                        fontSize: 12 * smallWidthScaleFactor,
                                        lineHeight: 14 * smallWidthScaleFactor,
                                        marginBottom: 3 * smallHeightScaleFactor,
                                        color: '#008AC6',
                                        marginRight: 10 * smallWidthScaleFactor,
                                        top: 51 * smallHeightScaleFactor,
                                        left: 50 * smallWidthScaleFactor,
                                        position: 'absolute',
                                    }}>
                                        {"Total"}
                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 12 * smallWidthScaleFactor,
                                            lineHeight: 14 * smallWidthScaleFactor,
                                            marginBottom: 3 * smallHeightScaleFactor,
                                            alignSelf: 'center',
                                            color: '#00720B',
                                            marginLeft: 5 * smallWidthScaleFactor,
                                        }}>
                                            {`$${invoiceData.paymentDetails.totalAmount}`}
                                        </Text>
                                    </Text>

                                </>
                            ) : (
                                <Text>{' '}</Text>
                            )}
                        </View>

                    </View>

                </View>

                <View style={{ position: 'absolute', left: 38 * smallWidthScaleFactor, top: 825 * smallHeightScaleFactor, width: 350 * smallWidthScaleFactor, }}>
                    <Text style={{
                        fontWeight: 700,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                    }}>
                        {'Payment Information:'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                    }}>
                        {'The customer is responsible for the bank charges incurred when the T/T (Telegraphic Transfer) is paid.'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                        marginBottom: 5 * smallHeightScaleFactor,
                    }}>
                        {'No warranty service is provided on used vehicles.'}
                    </Text>

                    <Text style={{
                        fontWeight: 700,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                    }}>
                        {'Conditions for order cancellation:'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                    }}>
                        {'(1) Order Cancellation Penalty: If the order is cancelled after payment, a penalty of USD 220 will apply.'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                        marginBottom: 5 * smallHeightScaleFactor,

                    }}>
                        {'(2) Non-refund: Payment for vehicles purchased through pre-delivery inspection is non-refundable.'}
                    </Text>

                    <Text style={{
                        fontWeight: 700,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                    }}>
                        {'Intermediary Banking Information:'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                    }}>
                        {'Bank Name: SUMITOMO MITSUI BANKING CORPORATION (NEW YORK BRANCH).'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,

                    }}>
                        {'Swift code: SMBCUS33'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                    }}>
                        {'Address: 277 Park Avenue'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,

                    }}>
                        {'City: New York, NY'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,

                    }}>
                        {'Postal Code: 10172'}
                    </Text>
                    <Text style={{
                        fontWeight: 400,
                        fontSize: 12 * smallWidthScaleFactor,
                        lineHeight: 14 * smallHeightScaleFactor,
                        marginBottom: 5 * smallHeightScaleFactor,

                    }}>
                        {'Country: United States'}
                    </Text>
                </View>

                {selectedChatData.stepIndicator.value < 3 ? null :
                    <View style={{ position: 'absolute', right: 39 * smallWidthScaleFactor, top: 835 * smallHeightScaleFactor, width: 300 * smallWidthScaleFactor, }}>
                        <View style={{
                            width: 300 * smallWidthScaleFactor,
                            alignItems: 'center',
                            paddingBottom: 80 * smallHeightScaleFactor, // Adjust this value to control space between image and line
                        }}>
                            <NativeImage
                                source={require('../../assets/RMJ Invoice Signature with Hanko.png')}
                                style={{
                                    width: 276 * smallWidthScaleFactor,
                                    height: 81 * smallHeightScaleFactor,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                    marginBottom: 0, // Minimize margin to keep the line close
                                }}
                            />
                            <View style={{
                                borderBottomWidth: 1 * smallHeightScaleFactor,
                                borderColor: 'black', // Change the color as needed
                                width: '100%', // Line width as per your requirement
                            }} />
                            <Text italic style={{
                                fontWeight: 700,
                                fontSize: 16 * smallWidthScaleFactor,
                            }}>
                                {'Real Motor Japan'}
                            </Text>
                        </View>

                        <View style={{
                            width: 300 * smallWidthScaleFactor,
                            alignItems: 'center',
                            paddingBottom: 5 * smallHeightScaleFactor, // Adjust this value to control space between image and line
                        }}>

                            <View style={{
                                borderBottomWidth: 1 * smallHeightScaleFactor,
                                borderColor: 'black', // Change the color as needed
                                width: '100%', // Line width as per your requirement
                            }} />
                            <Text italic style={{
                                fontWeight: 700,
                                fontSize: 16 * smallWidthScaleFactor,
                            }}>
                                {'Your Signature'}
                            </Text>
                        </View>
                    </View>}


            </View>
        )
    }



    const handleSaveAsExcel = async () => {

        const formData = {
            qrCodeData: invoiceData.cryptoNumber || '',

            invoiceNumber: invoiceData.id || '',
            issuingDate: invoiceData.bankInformations.issuingDate || '',
            shippedFrom: `${invoiceData.departurePort || ''}, ${invoiceData.departureCountry || ''}`,
            shippedTo: `${invoiceData.discharge.port || ''}, ${invoiceData.discharge.country || ''}`,
            placeOfDelivery: invoiceData.placeOfDelivery ? invoiceData.placeOfDelivery : '',
            cfs: invoiceData.cfs ? invoiceData.cfs : '',

            buyerName: invoiceData.consignee.name || '',
            buyerAddress: invoiceData.consignee.address || '',
            buyerEmail: invoiceData.consignee.email || '',
            buyerContact: invoiceData.consignee.contactNumber || '',
            buyerFax: `FAX: ${invoiceData.consignee.fax || 'N/A'}`,

            notifyName: invoiceData.sameAsConsignee ? `Same as consignee / buyer` : (invoiceData.notifyParty.name || ''),
            notifyAddress: invoiceData.notifyParty.address || '',
            notifyEmail: invoiceData.notifyParty.email || '',
            notifyContact: invoiceData.notifyParty.contactNumber || '',
            notifyFax: invoiceData.sameAsConsignee ? `FAX: ${invoiceData.notifyParty.fax || 'N/A'}` : '',

            bankName: invoiceData.bankInformations.bankAccount.bankName || '',
            branchName: invoiceData.bankInformations.bankAccount.branchName || '',
            swiftcode: invoiceData.bankInformations.bankAccount.swiftCode || '',
            bankAddress: invoiceData.bankInformations.bankAccount.address || '',
            nameOfAccountHolder: invoiceData.bankInformations.bankAccount.accountHolder || '',
            accountNumber: invoiceData.bankInformations.bankAccount.accountNumberValue || '',
            dueDate: invoiceData.bankInformations.dueDate || '',

            fobText: 'FOB',
            freightText: 'Freight',
            inspectionText: `Inspection [${invoiceData.paymentDetails.inspectionName || ''}]`,
            fobAmount: Math.round(Number(invoiceData.paymentDetails.fobPrice)),
            freightAmount: Math.round(Number(invoiceData.paymentDetails.freightPrice)),
            inspectionAmount: Math.round(Number(invoiceData.paymentDetails.inspectionPrice)),


            usedVehicle: `Used Vehicle`,
            carName: invoiceData.carData.carName || '',
            chassisNumber: invoiceData.carData.chassisNumber || '',
            color: invoiceData.carData.exteriorColor || '',
            displacement: `${Number(invoiceData.carData.engineDisplacement || 0).toLocaleString('en-US')} cc`,
            mileage: `${Number(invoiceData.carData.mileage || 0).toLocaleString('en-US')} km`,
            fuel: invoiceData.carData.fuel || '',
            transmission: invoiceData.carData.transmission || '',
            notes: `${invoiceData.paymentDetails.incoterms || ''} ${invoiceData.discharge.port || ''}`,
        };

        try {
            const response = await axios.post('http://localhost:4000/generate-excel', formData, {
                responseType: 'blob', // Important for handling the binary Excel file
            });

            // Create a Blob from the PDF Stream
            const file = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Build a URL from the file
            const fileURL = URL.createObjectURL(file);

            // Open the URL on new Window
            window.open(fileURL);
        } catch (error) {
            console.error('Error generating Excel:', error);
        }
    };

    return (
        <> {invoiceData && Object.keys(invoiceData).length > 0 &&

            <>{!selectedChatData.isCancelled && <Pressable
                onPress={handlePreviewInvoiceModalOpen}
                focusable={false}
                variant='ghost'
                onHoverIn={hoverPreviewIn}
                onHoverOut={hoverPreviewOut}
                style={{
                    marginTop: 3,
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                    flexDirection: 'row', // Align items in a row
                    alignItems: 'center', // Center items vertically
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: isPreviewHovered ? '#0772ad' : '#0A8DD5',
                }}>

                {selectedChatData.invoiceNumber && selectedChatData.stepIndicator.value > 2 ?
                    <Text style={{ fontWeight: 700, color: 'white', }}>
                        {`Preview Invoice No. ${selectedChatData.invoiceNumber}`}
                    </Text>
                    :
                    <Text style={{ fontWeight: 700, color: 'white', }}>
                        {`Preview Invoice`}
                    </Text>}
            </Pressable>}

                <Modal
                    isOpen={previewInvoiceVisible}
                    onClose={() => {
                        handlePreviewInvoiceModalClose();
                    }}
                    size={'full'}
                    useRNModal
                >
                    <View style={{ flexDirection: 'row', margin: 2, }}>
                        <Pressable onPress={() => {
                            capturedImageUri ? handleCaptureAndCreatePDF() : null;
                        }}
                            style={{ justifyContent: 'center', flexDirection: 'row', padding: 5, borderRadius: 5, marginRight: 5, backgroundColor: '#16A34A', }}>
                            <MaterialCommunityIcons size={20} name='download' color='white' />
                            <Text style={{ color: 'white', }}>Download as PDF</Text>
                        </Pressable>

                        {selectedChatData.stepIndicator.value < 3 ?
                            null :
                            <GenerateCustomInvoice />
                        }

                        <Pressable
                            onPress={() => {
                                capturedImageUri ? openImage() : null;
                            }}
                            style={{ position: 'absolute', top: -2, right: selectedChatData.stepIndicator.value < 3 ? -375 : -285, flexDirection: 'row', padding: 5, borderRadius: 5, backgroundColor: '#0A8DD5', }}>
                            <Entypo size={20} name='images' color='white' />
                            <Text style={{ color: 'white', }}>View Image</Text>
                        </Pressable>

                    </View>
                    <Modal.CloseButton />
                    {previewInvoiceVisible &&
                        <ScrollView
                            style={{ maxHeight: screenWidth < 960 ? 520 : 720, maxWidth: screenWidth < 960 ? '90%' : 900 }}
                        >
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                left: 0,
                                backgroundColor: 'white',
                                zIndex: 999,
                                flex: 1,
                                alignItems: 'center', // Center horizontally
                            }}>
                                {capturedImageUri ? (
                                    (screenWidth < mobileViewBreakpoint ? <PreviewInvoiceForMobile /> :
                                        <RNImage
                                            key={imagePreviewKey}
                                            source={{ uri: capturedImageUri.toString() }}
                                            style={{
                                                marginTop: 5,
                                                width: screenWidth < mobileViewBreakpoint ? 377 : 595,
                                                height: screenWidth < mobileViewBreakpoint ? 541 : 842,
                                                resizeMode: 'stretch',
                                                borderWidth: 1,
                                                borderColor: '#DADDE1',
                                            }}
                                        />
                                    )
                                ) : (
                                    <Spinner size={'lg'} color={'#0A9FDC'} style={{ alignSelf: 'center', paddingTop: 80 * heightScaleFactor, }} />
                                )}
                            </View>

                            {/* Main content with invoice details */}
                            {

                                <View ref={invoiceRef}
                                    style={{
                                        width: newWidth,
                                        height: newHeight,
                                        backgroundColor: 'white',
                                        zIndex: 1
                                    }}>

                                    <View style={{ position: 'absolute', left: 38 * widthScaleFactor, top: 38 * heightScaleFactor }}>
                                        <NativeImage
                                            source={require('../../assets/RMJ logo for invoice.png')}
                                            style={{
                                                width: 95 * widthScaleFactor,
                                                height: 85 * heightScaleFactor,
                                                resizeMode: 'stretch',
                                            }}
                                        />
                                    </View>

                                    <View style={{ position: 'absolute', alignSelf: 'center', top: 80 * heightScaleFactor }}>
                                        {/* Title */}
                                        {selectedChatData.stepIndicator.value < 3 ?
                                            <Text style={{ fontWeight: 700, fontSize: 25 * widthScaleFactor }}>{`PROFORMA INVOICE`}</Text> :
                                            <Text style={{ fontWeight: 700, fontSize: 25 * widthScaleFactor }}>{`INVOICE`}</Text>
                                        }
                                    </View>

                                    <View style={{ position: 'absolute', right: 38 * widthScaleFactor, top: 38 * heightScaleFactor }}>
                                        {/* QR CODE */}
                                        {selectedChatData.stepIndicator.value < 3 ?
                                            null :
                                            <View
                                                ref={qrCodeRef}
                                            >
                                                <QRCode
                                                    value={invoiceData.cryptoNumber}
                                                    size={80 * widthScaleFactor}
                                                    color="black"
                                                    backgroundColor="white"
                                                />
                                            </View>

                                        }
                                    </View>

                                    <View style={{ position: 'absolute', right: 121 * widthScaleFactor, top: 34 * heightScaleFactor }}>
                                        {/* Invoice Number */}
                                        {selectedChatData.stepIndicator.value < 3 ?
                                            null :
                                            <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor }}>{`Invoice No. RMJ-${invoiceData.id}`}</Text>
                                        }
                                    </View>

                                    {selectedChatData.stepIndicator.value < 3 ?
                                        <View style={{ position: 'absolute', right: 38 * widthScaleFactor, top: 34 * heightScaleFactor, }}>
                                            {/* Issuing Date */}
                                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', }}>
                                                <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor }}>{`Issuing Date: `}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor }}>{`${formattedIssuingDate}`}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', }}>
                                                <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor, color: '#F00A0A', }}>{`Valid Until: `}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor }}>{`${formattedDueDate}`}</Text>
                                            </View>

                                        </View>
                                        :
                                        <View style={{ position: 'absolute', right: 121 * widthScaleFactor, top: 49 * heightScaleFactor, flexDirection: 'row' }}>
                                            {/* Issuing Date */}
                                            <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor }}>{`Issuing Date: `}</Text>
                                            <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor }}>{`${formattedIssuingDate}`}</Text>
                                        </View>
                                    }

                                    <View style={{
                                        position: 'absolute',
                                        left: 40 * widthScaleFactor,
                                        top: 134 * heightScaleFactor,
                                        width: 280 * widthScaleFactor,
                                    }}>
                                        {/* Shipper */}
                                        <Text style={{
                                            fontWeight: 750,
                                            fontSize: 16 * widthScaleFactor,
                                            borderBottomWidth: 3, // Adjust the thickness of the underline
                                            width: 'fit-content', // Make the underline cover the text width
                                            marginBottom: 5, // Add some space between text and underline
                                        }}>
                                            {`Shipper`}
                                        </Text>
                                        <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`Real Motor Japan (YANAGISAWA HD CO.,LTD)`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`26-2 Takara Tsutsumi-cho Toyota City, Aichi Prefecture, Japan, 473-0932`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: +81565850606`}</Text>

                                        <Text style={{ fontWeight: 700, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Shipped From:`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.departurePort}, ${invoiceData.departureCountry}`}</Text>

                                        <Text style={{ fontWeight: 700, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Shipped To:`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.discharge.port}, ${invoiceData.discharge.country}`}</Text>
                                        {invoiceData.placeOfDelivery && invoiceData.placeOfDelivery !== '' ?
                                            <>
                                                <Text style={{ fontWeight: 700, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Place of Delivery:`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.placeOfDelivery}`}</Text>
                                            </>
                                            : null}
                                        {invoiceData.cfs && invoiceData.cfs !== '' ?
                                            <>
                                                <Text style={{ fontWeight: 700, fontSize: 14 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`CFS:`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 14 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.cfs}`}</Text>
                                            </>
                                            : null}

                                        <View style={{ flex: 1, flexDirection: 'row', width: 715 * widthScaleFactor, }}>

                                            <View style={{
                                                flex: 1, width: 280 * widthScaleFactor,
                                            }}>
                                                {/* Buyer Information */}
                                                <Text style={{
                                                    fontWeight: 750,
                                                    fontSize: 18 * widthScaleFactor,
                                                    borderBottomWidth: 3, // Adjust the thickness of the underline
                                                    borderBottomColor: '#0A78BE',
                                                    width: 'fit-content', // Make the underline cover the text width
                                                    marginBottom: 5, // Add some space between text and underline
                                                    color: '#0A78BE',
                                                    marginTop: 25 * heightScaleFactor,

                                                }}>
                                                    {`Buyer Information`}
                                                </Text>
                                                <Text style={{ fontWeight: 750, fontSize: 16 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.name}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.address}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.email}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.contactNumber}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: ${invoiceData.consignee.fax == '' ? 'N/A' : invoiceData.consignee.fax}`}</Text>

                                            </View>

                                            <View style={{ flex: 1, paddingLeft: 20 * widthScaleFactor, width: 280 * widthScaleFactor, }}>
                                                {/* Notify Party */}
                                                <Text style={{
                                                    fontWeight: 750,
                                                    fontSize: 18 * widthScaleFactor,
                                                    borderBottomWidth: 3, // Adjust the thickness of the underline
                                                    borderBottomColor: '#FF0000',
                                                    width: 'fit-content', // Make the underline cover the text width
                                                    marginBottom: 5, // Add some space between text and underline
                                                    color: '#FF0000',
                                                    marginTop: 25 * heightScaleFactor,
                                                }}>
                                                    {`Notify Party`}
                                                </Text>
                                                {invoiceData.notifyParty.sameAsConsignee == true ? (
                                                    <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, }}>{`Same as consignee / buyer`}</Text>) :
                                                    (<>
                                                        <Text style={{ fontWeight: 750, fontSize: 16 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.name}`}</Text>
                                                        <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.address}`}</Text>
                                                        <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.email}`}</Text>
                                                        <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.contactNumber}`}</Text>
                                                        <Text style={{ fontWeight: 400, fontSize: 16 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: ${invoiceData.notifyParty.fax == '' ? 'N/A' : invoiceData.notifyParty.fax}`}</Text>
                                                    </>)}
                                            </View>

                                        </View>


                                    </View>
                                    {selectedChatData.stepIndicator.value < 3 ?

                                        <View style={{ position: 'absolute', right: 38 * widthScaleFactor, top: 130 * heightScaleFactor, borderWidth: 3, width: 430 * widthScaleFactor, borderColor: '#FF5C00', height: 194 * heightScaleFactor, }}>
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
                                                <Entypo size={50 * widthScaleFactor} name='warning' color={'#FF0000'} />
                                                <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, color: '#FF0000', marginLeft: 20 * widthScaleFactor, }}>{`Bank Information will be provided after placing an order.`}</Text>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ position: 'absolute', right: 38 * widthScaleFactor, top: 130 * heightScaleFactor, borderWidth: 3, width: 430 * widthScaleFactor, borderColor: '#1ABA3D', }}>

                                            <View style={{ flex: 1, alignItems: 'center', }}>
                                                <Text style={{ fontWeight: 750, fontSize: 14 * widthScaleFactor, color: '#114B33', }}>{`Bank Information`}</Text>
                                            </View>

                                            <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 5 * widthScaleFactor, marginBottom: 5 * heightScaleFactor, }}>
                                                <View style={{ flex: 1, marginRight: 50 * widthScaleFactor, }}>
                                                    <Text style={{
                                                        fontWeight: 750,
                                                        fontSize: 14 * widthScaleFactor,
                                                        borderBottomWidth: 3, // Adjust the thickness of the underline
                                                        width: 'fit-content', // Make the underline cover the text width
                                                        marginBottom: 2, // Add some space between text and underline
                                                    }}>
                                                        {`Bank Account`}
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Bank Name: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.bankName}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Branch Name: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.branchName}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`SWIFTCODE: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.swiftCode}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Address: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.address}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Name of Account Holder: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.accountHolder}`}</Text>
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginTop: 3 * heightScaleFactor, }}>{`Account Number: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.bankAccount.accountNumberValue}`}</Text>
                                                    </Text>
                                                </View>

                                                <View style={{ flex: 1 }}>

                                                    <Text style={{
                                                        fontWeight: 750,
                                                        fontSize: 14 * widthScaleFactor,
                                                        borderBottomWidth: 3, // Adjust the thickness of the underline
                                                        width: 'fit-content', // Make the underline cover the text width
                                                        marginBottom: 2, // Add some space between text and underline
                                                    }}>
                                                        {`Payment Terms`}
                                                    </Text>

                                                    <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`Terms: `}
                                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.bankInformations.paymentTerms}`}</Text>
                                                    </Text>

                                                    <View style={{ paddingTop: 30 * heightScaleFactor, }}>

                                                        <Text style={{
                                                            fontWeight: 750,
                                                            fontSize: 14 * widthScaleFactor,
                                                            borderBottomWidth: 3, // Adjust the thickness of the underline
                                                            width: 'fit-content', // Make the underline cover the text width
                                                            marginBottom: 2, // Add some space between text and underline
                                                            color: '#F00A0A',
                                                            borderBottomColor: '#F00A0A',
                                                        }}>
                                                            {`Payment Due`}
                                                        </Text>

                                                        <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, color: '#F00A0A', lineHeight: 14 * widthScaleFactor }}>{`Due Date: `}
                                                            <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, color: 'black', lineHeight: 14 * widthScaleFactor }}>{`${formattedDueDate}`}</Text>
                                                        </Text>

                                                    </View>

                                                </View>

                                            </View>

                                        </View>}



                                    {/* <View style={{ position: 'absolute', left: 260 * widthScaleFactor, top: 335 * heightScaleFactor }}>

                                        <View style={{ flexDirection: 'row' }}>
                                            {vehicleImageUri ? (
                                                <NativeImage
                                                    source={{ uri: vehicleImageUri }}
                                                    style={{
                                                        width: 99 * widthScaleFactor,
                                                        height: 70 * heightScaleFactor,
                                                        resizeMode: 'stretch',
                                                    }}
                                                />
                                            ) : (
                                                <View
                                                    style={{
                                                        width: 99 * widthScaleFactor,
                                                        height: 70 * heightScaleFactor,
                                                        backgroundColor: '#e0e0e0',
                                                        marginRight: 12,
                                                    }}
                                                />
                                            )}
                                            <View style={{ flex: 1, top: -2 * heightScaleFactor, marginLeft: 5 * widthScaleFactor, height: 59 * heightScaleFactor }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 14 * widthScaleFactor, lineHeight: 16 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.carName}`}
                                                </Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                    {`Reference No.: `}
                                                    <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                        {`${invoiceData.carData.referenceNumber}`}
                                                    </Text>
                                                </Text>

                                                <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                    {`Year/Month: `}
                                                    <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                        {`${invoiceData.carData.regYear}/${invoiceData.carData.regMonth}`}
                                                    </Text>
                                                </Text>

                                                <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                    {`Mileage: `}
                                                    <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                        {`${Number(invoiceData.carData.mileage).toLocaleString('en-US')} km`}
                                                    </Text>
                                                </Text>

                                                <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                    {`Chassis No.: `}
                                                    <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                        {`${invoiceData.carData.chassisNumber}`}
                                                    </Text>
                                                </Text>
                                            </View>

                                        </View>


                                    </View>

                                    <View style={{ position: 'absolute', left: 260 * widthScaleFactor, top: 410 * heightScaleFactor, flexDirection: 'row', width: 495 * widthScaleFactor, }}>
                                        <View style={{ flex: 1 }}>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Model Code: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.modelCode}`}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Fuel: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.fuel}`}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Transmission: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.transmission}`}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Steering: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.steering}`}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Displacement: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${Number(invoiceData.carData.engineDisplacement).toLocaleString('en-US')} cc`}
                                                </Text>
                                            </Text>
                                        </View>

                                        <View style={{ flex: 1 }}>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Doors: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.doors ? invoiceData.carData.doors : 'N/A'}`}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Drive Type: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.driveType ? invoiceData.carData.driveType : 'N/A'}`}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Exterior Color: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.exteriorColor}`}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Number of Seats: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.numberOfSeats ? invoiceData.carData.numberOfSeats : 'N/A'}`}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>
                                                {`Body Type: `}
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 * widthScaleFactor }}>
                                                    {`${invoiceData.carData.bodyType}`}
                                                </Text>
                                            </Text>
                                        </View>

                                    </View>

                                    <View style={{ position: 'absolute', left: 260 * widthScaleFactor, top: 484 * heightScaleFactor, width: 495 * widthScaleFactor, }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor, marginBottom: 3 * heightScaleFactor, }}>
                                            {`Features: `}
                                        </Text>

                                        <InvoiceFeatures widthScaleFactor={widthScaleFactor} heightScaleFactor={heightScaleFactor} />

                                    </View> */}

                                    <View style={{
                                        position: 'absolute',
                                        left: 38 * widthScaleFactor,
                                        top: (invoiceData.placeOfDelivery && invoiceData.cfs) || (invoiceData.placeOfDelivery !== '' && invoiceData.cfs !== '') ? 577 * heightScaleFactor : 537 * heightScaleFactor,
                                        width: 718 * widthScaleFactor,
                                        borderWidth: 1 * widthScaleFactor,
                                        borderColor: '#C2E2F4',
                                        alignSelf: 'center',
                                    }}>
                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{ flex: 2, justifyContent: 'center', }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        color: '#008AC6',
                                                    }}>
                                                    {`Description`}
                                                </Text>

                                            </View>

                                            <View style={{ flex: 2, justifyContent: 'center', }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        color: '#008AC6',
                                                    }}>
                                                    {`Notes`}
                                                </Text>
                                            </View>

                                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        color: '#008AC6',
                                                    }}>
                                                    {`Quantity`}
                                                </Text>
                                            </View>

                                            <View style={{ flex: 2, justifyContent: 'center', }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        color: '#008AC6',
                                                    }}>
                                                    {`Amount`}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 5,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                    {`FOB`}
                                                </Text>
                                            </View>


                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                    {`$${Math.round(Number(invoiceData.paymentDetails.fobPrice)).toLocaleString('en-US', { useGrouping: true })}`}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 5,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                    {`Freight`}
                                                </Text>
                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                    {`$${Math.round(Number(invoiceData.paymentDetails.freightPrice)).toLocaleString('en-US', { useGrouping: true })}`}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 5,
                                                flexDirection: 'row',
                                            }}>
                                                {invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") && <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                    {invoiceData.paymentDetails.inspectionIsChecked ? `Inspection [${invoiceData.paymentDetails.inspectionName}]` : ' '}
                                                </Text>}

                                                {invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                                    <>
                                                        <Text
                                                            style={{
                                                                fontWeight: 400,
                                                                fontSize: 12 * widthScaleFactor,
                                                                lineHeight: 14 * widthScaleFactor,
                                                                marginBottom: 3 * heightScaleFactor,
                                                                marginLeft: 2 * widthScaleFactor,
                                                            }}>
                                                            {invoiceData.paymentDetails.inspectionIsChecked ? `Inspection [${invoiceData.paymentDetails.inspectionName}]` : ' '}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontWeight: 400,
                                                                fontSize: 12 * widthScaleFactor,
                                                                lineHeight: 14 * widthScaleFactor,
                                                                marginBottom: 3 * heightScaleFactor,
                                                                marginLeft: 2 * widthScaleFactor,
                                                            }}>
                                                            {invoiceData.paymentDetails.incoterms == "CIF" ? ` + Insurance` : ' '}
                                                        </Text>
                                                    </>
                                                }

                                                {!invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                                    <Text
                                                        style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            marginLeft: 2 * widthScaleFactor,
                                                        }}>
                                                        {invoiceData.paymentDetails.incoterms == "CIF" ? `Insurance` : ' '}
                                                    </Text>
                                                }

                                                {!invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") &&
                                                    <Text
                                                        style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                        }}>
                                                        {' '}
                                                    </Text>
                                                }


                                            </View>


                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                            }}>

                                                {invoiceData.paymentDetails.inspectionIsChecked && (invoiceData.paymentDetails.incoterms == "C&F" || invoiceData.paymentDetails.incoterms == "FOB") && <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                    {invoiceData.paymentDetails.inspectionIsChecked ? `$${Number(invoiceData.paymentDetails.inspectionPrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                                </Text>}

                                                {invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                                    <Text
                                                        style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                        {invoiceData.paymentDetails.inspectionIsChecked ? `$${Number(invoiceData.paymentDetails.inspectionPrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                                        <Text
                                                            style={{
                                                                fontWeight: 400,
                                                                fontSize: 12 * widthScaleFactor,
                                                                lineHeight: 14 * widthScaleFactor,
                                                                marginBottom: 3 * heightScaleFactor,
                                                            }}>
                                                            {invoiceData.paymentDetails.incoterms === "CIF" ? ` + $${Number(invoiceData.paymentDetails.insurancePrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                                        </Text>
                                                    </Text>

                                                }

                                                {!invoiceData.paymentDetails.inspectionIsChecked && invoiceData.paymentDetails.incoterms == "CIF" &&
                                                    <Text
                                                        style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',

                                                        }}>
                                                        {invoiceData.paymentDetails.incoterms == "CIF" ? `$${Number(invoiceData.paymentDetails.insurancePrice).toLocaleString('en-US', { useGrouping: true }).split('.')[0]}` : ' '}
                                                    </Text>
                                                }

                                            </View>


                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 5,
                                                flexDirection: 'row',
                                            }}>
                                                {invoiceData.paymentDetails.additionalName && (invoiceData.paymentDetails.additionalName).length > 0 && <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                    {invoiceData.paymentDetails.additionalName && (invoiceData.paymentDetails.additionalName).length > 0 ? `${invoiceData.paymentDetails.additionalName.join(' + ')}` : ' '}
                                                </Text>}


                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                            }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                    {invoiceData.paymentDetails.additionalPrice && invoiceData.paymentDetails.additionalPrice.length > 0
                                                        ? invoiceData.paymentDetails.additionalPrice.map(price =>
                                                            `$${parseFloat(price).toLocaleString('en-US', {
                                                                style: 'currency',
                                                                currency: 'USD',
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 0
                                                            }).slice(1)}`
                                                        ).join(' + ')
                                                        : ' '}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', }}>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                                flexDirection: 'row',
                                                paddingVertical: 2 * heightScaleFactor,

                                            }}>
                                                {invoiceData.carData && invoiceData.carData.carName ? (
                                                    <Text style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                        marginLeft: 2 * widthScaleFactor,
                                                    }}>
                                                        {"Used Vehicle\n"}
                                                        <Text style={{
                                                            fontWeight: 700,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.carName}\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.chassisNumber}\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.exteriorColor}\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${Number(invoiceData.carData.engineDisplacement).toLocaleString('en-US')} cc\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${Number(invoiceData.carData.mileage).toLocaleString('en-US')} km\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.fuel}\n`}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 400,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                        }}>
                                                            {`${invoiceData.carData.transmission}\n`}
                                                        </Text>
                                                    </Text>

                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}


                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            }}>
                                                {invoiceData.paymentDetails && invoiceData.paymentDetails.incoterms && invoiceData.discharge.port && invoiceData.discharge ? (
                                                    <Text style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                        {`${invoiceData.paymentDetails.incoterms} ${invoiceData.discharge.port}`}
                                                    </Text>
                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}
                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            }}>
                                                {invoiceData.carData && invoiceData.carData.carName ? (
                                                    <Text style={{
                                                        fontWeight: 400,
                                                        fontSize: 12 * widthScaleFactor,
                                                        lineHeight: 14 * widthScaleFactor,
                                                        marginBottom: 3 * heightScaleFactor,
                                                        alignSelf: 'center',
                                                    }}>
                                                        {'1'}
                                                    </Text>
                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}


                                            </View>

                                            <View style={{
                                                borderTopWidth: 1 * widthScaleFactor,
                                                borderColor: '#C2E2F4',
                                                flex: 2,
                                                justifyContent: 'center',
                                                flexDirection: 'row',
                                            }}>
                                                {invoiceData.paymentDetails && invoiceData.paymentDetails.totalAmount ? (
                                                    <>
                                                        <Text style={{
                                                            fontWeight: 700,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            color: '#008AC6',
                                                            marginRight: 10 * widthScaleFactor,
                                                            top: 51 * heightScaleFactor,
                                                            left: 50 * widthScaleFactor,
                                                            position: 'absolute',
                                                        }}>
                                                            {"Total"}
                                                            <Text style={{
                                                                fontWeight: 700,
                                                                fontSize: 12 * widthScaleFactor,
                                                                lineHeight: 14 * widthScaleFactor,
                                                                marginBottom: 3 * heightScaleFactor,
                                                                alignSelf: 'center',
                                                                color: '#00720B',
                                                                marginLeft: 5 * widthScaleFactor,
                                                            }}>
                                                                {`$${invoiceData.paymentDetails.totalAmount}`}
                                                            </Text>
                                                        </Text>

                                                    </>
                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}
                                            </View>

                                        </View>

                                    </View>

                                    <View style={{ position: 'absolute', left: 38 * widthScaleFactor, top: 825 * heightScaleFactor, width: 350 * widthScaleFactor, }}>
                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Payment Information:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'The customer is responsible for the bank charges incurred when the T/T (Telegraphic Transfer) is paid.'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                            marginBottom: 5 * heightScaleFactor,
                                        }}>
                                            {'No warranty service is provided on used vehicles.'}
                                        </Text>

                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Conditions for order cancellation:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'(1) Order Cancellation Penalty: If the order is cancelled after payment, a penalty of USD 220 will apply.'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                            marginBottom: 5 * heightScaleFactor,

                                        }}>
                                            {'(2) Non-refund: Payment for vehicles purchased through pre-delivery inspection is non-refundable.'}
                                        </Text>

                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Intermediary Banking Information:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Bank Name: SUMITOMO MITSUI BANKING CORPORATION (NEW YORK BRANCH).'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'Swift code: SMBCUS33'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Address: 277 Park Avenue'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'City: New York, NY'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'Postal Code: 10172'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 12 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                            marginBottom: 5 * heightScaleFactor,

                                        }}>
                                            {'Country: United States'}
                                        </Text>
                                    </View>

                                    {selectedChatData.stepIndicator.value < 3 ? null :
                                        <View style={{ position: 'absolute', right: 39 * widthScaleFactor, top: 835 * heightScaleFactor, width: 300 * widthScaleFactor, }}>
                                            <View style={{
                                                width: 300 * widthScaleFactor,
                                                alignItems: 'center',
                                                paddingBottom: 80 * heightScaleFactor, // Adjust this value to control space between image and line
                                            }}>
                                                <NativeImage
                                                    source={require('../../assets/RMJ Invoice Signature with Hanko.png')}
                                                    style={{
                                                        width: 276 * widthScaleFactor,
                                                        height: 81 * heightScaleFactor,
                                                        resizeMode: 'contain',
                                                        alignSelf: 'center',
                                                        marginBottom: 0, // Minimize margin to keep the line close
                                                    }}
                                                />
                                                <View style={{
                                                    borderBottomWidth: 1 * heightScaleFactor,
                                                    borderColor: 'black', // Change the color as needed
                                                    width: '100%', // Line width as per your requirement
                                                }} />
                                                <Text italic style={{
                                                    fontWeight: 700,
                                                    fontSize: 16 * widthScaleFactor,
                                                }}>
                                                    {'Real Motor Japan'}
                                                </Text>
                                            </View>

                                            <View style={{
                                                width: 300 * widthScaleFactor,
                                                alignItems: 'center',
                                                paddingBottom: 5 * heightScaleFactor, // Adjust this value to control space between image and line
                                            }}>

                                                <View style={{
                                                    borderBottomWidth: 1 * heightScaleFactor,
                                                    borderColor: 'black', // Change the color as needed
                                                    width: '100%', // Line width as per your requirement
                                                }} />
                                                <Text italic style={{
                                                    fontWeight: 700,
                                                    fontSize: 16 * widthScaleFactor,
                                                }}>
                                                    {'Your Signature'}
                                                </Text>
                                            </View>
                                        </View>}


                                </View>
                            }


                        </ScrollView>

                    }

                </Modal>
            </>
        }
        </>
    );

}

const ReopenTransaction = () => {
    const selectedChatData = useSelector((state) => state.selectedChatData)
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData)
    const [isHovered, setIsHovered] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isYesHovered, setIsYesHovered] = useState(false);
    const [isNoHovered, setIsNoHovered] = useState(false);
    const [isYesLoading, setIsYesLoading] = useState(false);

    const hoverIn = () => setIsHovered(true);
    const hoverOut = () => setIsHovered(false);


    const yesHoverIn = () => setIsYesHovered(true);
    const yesHoverOut = () => setIsYesHovered(false);

    const noHoverIn = () => setIsNoHovered(true);
    const noHoverOut = () => setIsNoHovered(false);

    const handleModalOpen = () => {
        setIsModalVisible(true);

    }

    const handleModalClose = () => {
        setIsModalVisible(false);

    }


    const reopenTransactionMessage = async () => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

        try {

            // Adding the message to the 'messages' subcollection
            await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                text: `The transaction has been reopened by the seller.`,
                sender: email,
                timestamp: formattedTime, // Using the fetched timestamp
                ip: ip, // IP Address
                ipCountry: ipCountry // Country of the IP Address
            });


            // Updating the main chat document with the latest message details
            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                lastMessageSender: email,
                lastMessage: `The transaction has been reopened by the seller.`,
                lastMessageDate: formattedTime,
                customerRead: false,
                read: true,
                readBy: [email],
            });

        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }

    const handleReopenTransaction = async () => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const formattedTimeEmail = moment(datetime).format('MMMM D, YYYY');

        const docRef = doc(projectExtensionFirestore, "IssuedInvoice", selectedChatData.invoiceNumber);
        const docRefChatId = doc(projectExtensionFirestore, "chats", selectedChatData.id);
        const docRefVehicle = doc(projectExtensionFirestore, "VehicleProducts", selectedChatData.carData.stockID);

        setIsYesLoading(true);
        try {
            await updateDoc(docRef, {
                'isCancelled': false, // Update the specific field
                'orderPlaced': true
            });
            try {
                await updateDoc(docRefChatId, {
                    'isCancelled': false // Update the specific field
                });

                try {
                    await updateDoc(docRefVehicle, {
                        'stockStatus': 'Reserved', // Update the specific field
                        'reservedTo': selectedCustomerData.textEmail,
                    });
                } catch (error) {
                    console.error("Error updating document: ", error);
                }
                await reopenTransactionMessage();

                setIsYesLoading(false);
                console.log("Document successfully updated");
            } catch (error) {
                console.error("Error updating document: ", error);
            }
            console.log("Document successfully updated");
        } catch (error) {
            console.error("Error updating document: ", error);
        }


    };

    return (
        <>
            <Pressable
                focusable={false}
                variant='ghost'
                onPress={handleModalOpen}
                onHoverIn={hoverIn}
                onHoverOut={hoverOut}
                style={{
                    marginTop: 3,
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                    flexDirection: 'row', // Align items in a row
                    alignItems: 'center', // Center items vertically
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: isHovered ? '#0772ad' : '#0A8DD5',
                    padding: 10,
                }}>

                <MaterialCommunityIcons name='restart' size={15} color={'white'} />
                <Text color={'white'} style={{ fontWeight: 700, marginLeft: 5, }}>{`Reopen Transaction`}</Text>
            </Pressable>

            <Modal
                isOpen={isModalVisible}
                onClose={() => {
                    handleModalClose()
                }}

            >
                <Modal.Content>
                    <Modal.Header>Reopen Transaction</Modal.Header>
                    <Modal.Body>
                        Do you want to reopen the transaction?
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Pressable
                                focusable={false}
                                variant='ghost'
                                onPress={handleModalClose}
                                onHoverIn={noHoverIn}
                                onHoverOut={noHoverOut}
                                style={{
                                    marginTop: 3,
                                    paddingVertical: 3,
                                    alignItems: 'center', // Center items vertically
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    backgroundColor: isNoHovered ? '#3F3F46' : '#52525B',
                                    flex: 1,
                                }}
                            >
                                <Text color={'white'} style={{ fontWeight: 700, }}>No</Text>
                            </Pressable>

                            <View style={{ flex: 1 }} />

                            <Pressable
                                onPress={handleReopenTransaction}
                                focusable={false}
                                variant='ghost'
                                onHoverIn={yesHoverIn}
                                onHoverOut={yesHoverOut}
                                disabled={isYesLoading}
                                style={{
                                    marginTop: 3,
                                    paddingVertical: 3,
                                    alignItems: 'center', // Center items vertically
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    backgroundColor: isYesHovered ? '#0772ad' : '#0A8DD5',
                                    flex: 1,
                                }}
                            >
                                {!isYesLoading ? <Text color={'white'} style={{ fontWeight: 700, }}>Yes</Text> : <Spinner size={'sm'} color={'white'} />}
                            </Pressable>
                        </View>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>


    );
}



const CancelTransaction = () => {
    const selectedChatData = useSelector((state) => state.selectedChatData)
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData)
    const [isHovered, setIsHovered] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isYesHovered, setIsYesHovered] = useState(false);
    const [isNoHovered, setIsNoHovered] = useState(false);
    const [isYesLoading, setIsYesLoading] = useState(false);

    const hoverIn = () => setIsHovered(true);
    const hoverOut = () => setIsHovered(false);


    const yesHoverIn = () => setIsYesHovered(true);
    const yesHoverOut = () => setIsYesHovered(false);

    const noHoverIn = () => setIsNoHovered(true);
    const noHoverOut = () => setIsNoHovered(false);

    const handleModalOpen = () => {
        setIsModalVisible(true);

    }

    const handleModalClose = () => {
        setIsModalVisible(false);

    }


    const sendEmail = async (to, subject, htmlContent) => {
        try {
            const response = await fetch('https://rmjsmtp.duckdns.org/emailServer/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to,
                    subject,
                    htmlContent,
                }),
            });

            if (response.ok) {
                console.log('Email sent successfully');
            } else {
                console.error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const htmlContent = `<html><head>
    <title>Transaction Cancellation Notice</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 10px;
            margin: 0;
        }
        .container {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin: 20px auto;
            max-width: 600px;
            padding: 20px;
        }
        .highlight-red {
            color: #FF0000; /* Red */
            font-weight: bold;
        }
        .highlight-bold {
            font-weight: bold;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0 20px;
        }
        .signature {
            font-weight: bold;
            margin-top: 40px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <p><strong>Dear Valued Customer,</strong></p>

        <p>I hope this message finds you well.</p>
        
        <p>I wanted to inform you that unfortunately, due to the non-receipt of payment for <span class="highlight-bold">Invoice No. <span class="highlight-red">${selectedChatData.invoiceNumber}</span></span> by the due date, </p>

        <p>We had to proceed with the <span class="highlight-red">cancellation of the transaction.</span></p>

        <p>We understand that unforeseen circumstances can arise, and we're here to discuss any concerns or possible ways to support you moving forward.</p>

        <p>Please reach out if you have any questions or require assistance.</p>

        <p>Thank you for your understanding.</p>
        
        <p class="signature">Best regards,<br>Real Motor Japan</p>
    </div>

</body></html>`;

    const cancelTransactionMessage = async () => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

        try {

            // Adding the message to the 'messages' subcollection
            await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                text: `The transaction has been cancelled.`,
                sender: email,
                timestamp: formattedTime, // Using the fetched timestamp
                ip: ip, // IP Address
                ipCountry: ipCountry // Country of the IP Address
            });


            // Updating the main chat document with the latest message details
            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                lastMessageSender: email,
                lastMessage: `The transaction has been cancelled.`,
                lastMessageDate: formattedTime,
                customerRead: false,
                read: true,
                readBy: [email],
            });
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }

    const handleCancelTransaction = async () => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const formattedTimeEmail = moment(datetime).format('MMMM D, YYYY');

        const docRef = doc(projectExtensionFirestore, "IssuedInvoice", selectedChatData.invoiceNumber);
        const docRefChatId = doc(projectExtensionFirestore, "chats", selectedChatData.id);
        const docRefVehicle = doc(projectExtensionFirestore, "VehicleProducts", selectedChatData.carData.stockID);

        setIsYesLoading(true);
        try {
            await updateDoc(docRef, {
                'isCancelled': true, // Update the specific field
                'orderPlaced': false
            });
            try {
                await updateDoc(docRefChatId, {
                    'isCancelled': true // Update the specific field
                });

                try {
                    await updateDoc(docRefVehicle, {
                        'stockStatus': 'On-Sale', // Update the specific field
                        'reservedTo': ''
                    });
                } catch (error) {
                    console.error("Error updating document: ", error);
                }
                await cancelTransactionMessage();

                await sendEmail(selectedCustomerData.textEmail, `Transaction Cancelled | Real Motor Japan | Invoice No. ${selectedChatData.invoiceNumber}  (${formattedTimeEmail})`, htmlContent);

                setIsYesLoading(false);
                console.log("Document successfully updated");
            } catch (error) {
                console.error("Error updating document: ", error);
            }
            console.log("Document successfully updated");
        } catch (error) {
            console.error("Error updating document: ", error);
        }


    };

    return (
        <>

            <Pressable
                focusable={false}
                variant='ghost'
                onPress={handleModalOpen}
                onHoverIn={hoverIn}
                onHoverOut={hoverOut}
                style={{
                    marginTop: 3,
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                    flexDirection: 'row', // Align items in a row
                    alignItems: 'center', // Center items vertically
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: isHovered ? '#AAAAAA' : '#CCCCCC',
                }}
            >
                <MaterialIcons name='cancel' size={15} color={'#52525B'} />
                <Text color={'#52525B'} style={{ fontWeight: 700, marginLeft: 5, }}>{`Cancel Transaction`}</Text>
            </Pressable>


            <Modal
                isOpen={isModalVisible}
                onClose={() => {
                    handleModalClose()
                }}
            >
                <Modal.Content>
                    <Modal.Header>Cancel Transaction</Modal.Header>
                    <Modal.Body>
                        Do you want to cancel the transation?
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Pressable
                                focusable={false}
                                variant='ghost'
                                onPress={handleModalClose}
                                onHoverIn={noHoverIn}
                                onHoverOut={noHoverOut}
                                style={{
                                    marginTop: 3,
                                    paddingVertical: 3,
                                    alignItems: 'center', // Center items vertically
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    backgroundColor: isNoHovered ? '#3F3F46' : '#52525B',
                                    flex: 1,
                                }}
                            >
                                <Text color={'white'} style={{ fontWeight: 700, }}>No</Text>
                            </Pressable>

                            <View style={{ flex: 1 }} />

                            <Pressable
                                onPress={handleCancelTransaction}
                                focusable={false}
                                variant='ghost'
                                onHoverIn={yesHoverIn}
                                onHoverOut={yesHoverOut}
                                disabled={isYesLoading}
                                style={{
                                    marginTop: 3,
                                    paddingVertical: 3,
                                    alignItems: 'center', // Center items vertically
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    backgroundColor: isYesHovered ? '#800101' : '#FF0000',
                                    flex: 1,
                                }}
                            >
                                {!isYesLoading ? <Text color={'white'} style={{ fontWeight: 700, }}>Yes</Text> : <Spinner size={'sm'} color={'white'} />}
                            </Pressable>
                        </View>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

        </>


    )
}

const ExtendDueDateButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isConfirmHovered, setIsConfirmHovered] = useState(false);
    const [isCancelHovered, setIsCancelHovered] = useState(false);
    const [selectedDueDate, setSelectedDueDate] = useState('');
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    let invoiceSelectedDueDate = '';

    const currentDate = useSelector((state) => state.currentDate);
    const selectedChatData = useSelector((state) => state.selectedChatData);


    const hoverIn = () => setIsHovered(true);
    const hoverOut = () => setIsHovered(false);


    const confirmHoverIn = () => setIsConfirmHovered(true);
    const confirmHoverOut = () => setIsConfirmHovered(false);

    const cancelHoverIn = () => setIsCancelHovered(true);
    const cancelHoverOut = () => setIsCancelHovered(false);

    const [modalVisible, setModalVisible] = useState(false);
    const invoiceData = useSelector((state) => state.invoiceData);
    const dispatch = useDispatch();

    const handleModalOpen = () => {
        setModalVisible(true);
    }

    const handleModalClose = () => {
        setModalVisible(false);
    }

    const handleConfirm = async () => {

        try {
            await confirmExtendDueDate();
            handleModalClose();
        } catch (error) {

        }

    }


    const extendDueDateMessage = async () => {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss.SSS');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

        try {

            // Adding the message to the 'messages' subcollection
            await addDoc(collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'), {
                text: `The due date has been changed to ${selectedDueDate
                    ? new Date(selectedDueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                    : 'Invalid Date'
                    }`,
                sender: email,
                timestamp: formattedTime, // Using the fetched timestamp
                ip: ip, // IP Address
                ipCountry: ipCountry // Country of the IP Address
            });


            // Updating the main chat document with the latest message details
            await updateDoc(doc(projectExtensionFirestore, 'chats', selectedChatData.id), {
                lastMessageSender: email,
                lastMessage: `The due date has been changed to ${selectedDueDate
                    ? new Date(selectedDueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                    : 'Invalid Date'
                    }`,
                lastMessageDate: formattedTime,
                customerRead: false,
                read: true,
                readBy: [email],
            });

        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }

    const confirmExtendDueDate = async () => {
        const docRef = doc(projectExtensionFirestore, "IssuedInvoice", selectedChatData.invoiceNumber);
        setIsConfirmLoading(true);
        try {
            await updateDoc(docRef, {
                'bankInformations.dueDate': selectedDueDate // Update the specific field
            });
            await extendDueDateMessage();
            setIsConfirmLoading(false);
            console.log("Document successfully updated");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const ModalCalendar = ({ selectedDate, setSelectedDate, currentDate }) => {

        const [modalCalendarVisible, setModalCalendarVisible] = useState(false);

        const handleModalCalendarOpen = () => {
            setModalCalendarVisible(true);
        };

        const handleModalCalendarClose = () => {
            setModalCalendarVisible(false);
        };


        return (

            <>
                <Pressable style={{ height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    onPress={handleModalCalendarOpen}>
                    <Text style={{ flex: 1, }} >{selectedDate}</Text>
                </Pressable>

                <Modal isOpen={modalCalendarVisible} onClose={handleModalCalendarClose} useRNModal>
                    <Modal.CloseButton />
                    <Modal.Content>
                        <View style={{ height: '100%', flex: 1 }}>
                            <Calendar
                                onDayPress={useCallback(day => {
                                    setSelectedDate(day.dateString);
                                    invoiceSelectedDueDate = day.dateString;
                                    globalInvoiceVariable.bankInformations.dueDate = day.dateString;
                                    handleModalCalendarClose();
                                }, [])}
                                markedDates={{
                                    [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: '#7b9cff' }
                                }}
                                renderArrow={(direction) => (
                                    direction === 'left' ? <MaterialIcons name='arrow-back-ios' color='#7b9cff' /> : <MaterialIcons name='arrow-forward-ios' color='#7b9cff' />
                                )}
                                enableSwipeMonths={true}
                                initialDate={selectedDate}
                                // minDate={currentDate}
                                showSixWeeks />

                        </View>

                    </Modal.Content>

                </Modal>
            </>

        );

    }

    useEffect(() => {

        if (currentDate) {
            const date = new Date(currentDate);

            // Check the day of the week
            const dayOfWeek = date.getDay();

            if (dayOfWeek === 5) { // Friday
                date.setDate(date.getDate() + 3); // Add 3 days to reach Monday
            } else if (dayOfWeek === 6) { // Saturday
                date.setDate(date.getDate() + 2); // Add 2 days to reach Monday
            } else {
                date.setDate(date.getDate() + 1); // Sunday to Thursday, add 1 day
            }

            // Format the date back to string
            const adjustedDate = date.toISOString().split('T')[0];
            setSelectedDueDate(adjustedDate);
        }

    }, []);

    return (
        <>
            <Pressable
                focusable={false}
                variant='ghost'
                onPress={handleModalOpen}
                onHoverIn={hoverIn}
                onHoverOut={hoverOut}
                style={{
                    marginTop: 3,
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                    flexDirection: 'row', // Align items in a row
                    alignItems: 'center', // Center items vertically
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: isHovered ? '#a8720a' : '#D38F0D',
                }}
            >
                <FontAwesome name='calendar-plus-o' size={15} color={'white'} />
                <Text color={'white'} style={{ fontWeight: 700, marginLeft: 5, }}>{`Extend Due Date`}</Text>
            </Pressable>

            <Modal
                isOpen={modalVisible}
                onClose={handleModalClose}
                useRNModal
            >
                <Modal.Content>
                    <Modal.Header >Extend Due Date</Modal.Header>
                    <View style={{ margin: 2, }}>
                        <Text style={{ fontWeight: 700, marginLeft: 3, }}>Due Date:</Text>
                        <ModalCalendar currentDate={currentDate} selectedDate={selectedDueDate} setSelectedDate={setSelectedDueDate} />
                    </View>
                    <Modal.Footer>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Pressable
                                focusable={false}
                                variant='ghost'
                                onPress={handleModalClose}
                                onHoverIn={cancelHoverIn}
                                onHoverOut={cancelHoverOut}
                                style={{
                                    marginTop: 3,
                                    paddingVertical: 3,
                                    alignItems: 'center', // Center items vertically
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    backgroundColor: isCancelHovered ? '#3F3F46' : '#52525B',
                                    flex: 1,
                                }}
                            >
                                <Text color={'white'} style={{ fontWeight: 700, }}>Cancel</Text>
                            </Pressable>

                            <View style={{ flex: 1 }} />

                            <Pressable
                                onPress={handleConfirm}
                                focusable={false}
                                variant='ghost'
                                onHoverIn={confirmHoverIn}
                                onHoverOut={confirmHoverOut}
                                disabled={isConfirmLoading}
                                style={{
                                    marginTop: 3,
                                    paddingVertical: 3,
                                    alignItems: 'center', // Center items vertically
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    backgroundColor: isConfirmHovered ? '#0f7534' : '#16A34A',
                                    flex: 1,
                                }}
                            >
                                {!isConfirmLoading ? <Text color={'white'} style={{ fontWeight: 700, }}>Confirm</Text> : <Spinner size={'sm'} color={'white'} />}
                            </Pressable>
                        </View>


                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>



    )
}

const TransactionModal = () => {
    const transactionModalVisible = useSelector((state) => state.transactionModalVisible);
    const dispatch = useDispatch();


    const handleTransactionModalClose = () => {
        dispatch(setTransactionModalVisible(false));
    }
    return (

        <Modal
            isOpen={transactionModalVisible}
            onClose={() => {
                handleTransactionModalClose()
            }}
            size={'lg'}
            useRNModal
        >
            {transactionModalVisible &&
                <Modal.Content>
                    <Modal.CloseButton />

                    <Modal.Header style={{ borderBottomWidth: 2, borderColor: '#0A9FDC', }} >{transactionModalTitle}</Modal.Header>

                    {transactionModalContentValue == 1 || transactionModalContentValue == 2 &&
                        <IssueProformaInvoiceModalContent />
                    }

                    {transactionModalContentValue == 3 &&
                        <ConfirmPaymentModalContent />
                    }
                </Modal.Content>
            }
        </Modal>
    )
}

const TransactionButton = ({ title, buttonValue, transactionValue, colorHoverIn, colorHoverOut }) => {

    const [isHovered, setIsHovered] = useState(false);


    const hoverIn = () => setIsHovered(true);
    const hoverOut = () => setIsHovered(false);
    const invoiceData = useSelector((state) => state.invoiceData);
    const dispatch = useDispatch();


    const handleTransactionModalOpen = () => {
        dispatch(setTransactionModalVisible(true));
        transactionModalTitle = title;
        transactionModalContentValue = transactionValue;
    }


    return (
        <>
            <Pressable
                focusable={false}
                variant='ghost'
                onPress={handleTransactionModalOpen}
                onHoverIn={hoverIn}
                onHoverOut={hoverOut}
                style={{
                    marginTop: 3,
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                    flexDirection: 'row', // Align items in a row
                    alignItems: 'center', // Center items vertically
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: isHovered ? colorHoverIn : colorHoverOut,
                }}
            >
                <FastImage
                    source={{
                        uri: require(`../../assets/chat_step/chat_step_${buttonValue}_on.png`),
                        priority: FastImage.priority.normal
                    }}
                    style={{
                        tintColor: 'rgba(128, 128, 128, 1)',
                        width: 15,
                        height: 15,
                        alignSelf: 'center',
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                <Text color={'white'} style={{ fontWeight: 700, marginLeft: 5, }}>{title}</Text>
            </Pressable>

        </>

    );
};


const TransactionList = ({ displayedTransactions, handleChatPress, selectedCustomerData }) => {
    // Assuming an environment that supports onMouseEnter and onMouseLeave
    return (
        Array.isArray(selectedCustomerData.transactions) && selectedCustomerData.transactions.length > 0 ? (
            displayedTransactions.map((transaction, index) => {
                const [isHovered, setIsHovered] = useState(false); // This won't work as expected due to scope

                return (
                    <Pressable
                        key={index}
                        onPress={() => handleChatPress(`chat_${transaction.stockId}_${selectedCustomerData.textEmail}`)}
                        onMouseEnter={() => setIsHovered(true)} // These events are not native to React Native
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            marginBottom: 15,
                            backgroundColor: isHovered ? '#F2F2F2' : '#FFFFFF', // Change color on hover
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
                                <Text style={{ color: '#0A78BE' }} selectable={false}>
                                    {transaction.carName}
                                </Text>
                            </Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                <Text style={{ color: '#333' }} selectable={false}>{transaction.referenceNumber}</Text>
                            </Text>
                        </View>
                    </Pressable>
                );
            })
        ) : (
            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }} italic>No history to show</Text>
        )
    );
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



const PaymentHistoryModal = () => {

    const [paymentHistoryVisible, setPaymentHistoryVisible] = useState(false);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const screenWidth = Dimensions.get('window').width;

    const sortedPayments = selectedCustomerData.paymentsHistory
        ? [...selectedCustomerData.paymentsHistory].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
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
        // Remove ' at ' from the date string
        const cleanedDateString = dateString.replace(' at ', ' ');
        const date = new Date(cleanedDateString);

        if (isNaN(date.getTime())) {
            // Date is not valid
            console.error("Invalid Date:", dateString);
            return "Invalid Date";
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        return `${year} ${month} ${day} at ${hours}:${minutes}${ampm}`;
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    };

    return (

        <>
            <Pressable onPress={handlePaymentHistoryModalOpen}>
                <Text style={{ fontSize: screenWidth < mobileViewBreakpoint ? 10 : 14, color: '#0A78BE', textAlign: 'center', }} underline>
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
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE', }}>Date: </Text>
                                                <Text style={{ color: '#333' }}>
                                                    {formatDate(sortedPayments[sortedPayments.length - 1 - index].date)}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE', }}>Value: </Text>
                                                <Text style={{ color: Number(sortedPayments[sortedPayments.length - 1 - index].value).toLocaleString().startsWith('-') ? '#FF0000' : '#16A34A' }}>
                                                    ${Number(sortedPayments[sortedPayments.length - 1 - index].value).toLocaleString()}
                                                </Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE', }}>Vehicle Name: </Text>
                                                <Text style={{ color: '#333' }}>{sortedPayments[sortedPayments.length - 1 - index].vehicleName}</Text>
                                            </Text>

                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 5 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#0A78BE', }}>Reference Number: </Text>
                                                <Text style={{ color: '#333' }}>{sortedPayments[sortedPayments.length - 1 - index].vehicleRef}</Text>
                                            </Text>

                                        </View>

                                    )) :
                                    <Text style={{ fontWeight: 'bold', alignSelf: 'center', }} italic>No history to show</Text>
                            }
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

const CustomerProfileModal = () => {
    const [customerModalVisible, setCustomerModalVisible] = useState(false);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const screenWidth = Dimensions.get('window').width;


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


    return (
        <>
            <Pressable
                onPress={handleModalOpen}
                style={{ width: 'fit-content', }}
            >
                <Text style={{ fontWeight: 700, }} underline>{`${globalCustomerFirstName} ${globalCustomerLastName}`}</Text>
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
                                    {`${globalCustomerFirstName} ${globalCustomerLastName}`}
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

                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 20 : 24, color: '#009922', textAlign: 'center', }} selectable>
                                    {`$${(totalPaymentValue).toLocaleString('en-US')}`}
                                </Text>

                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 12 : 16, color: '#5E4343', textAlign: 'center', }}>
                                    {`Total Payment`}
                                </Text>

                                <PaymentHistoryModal />


                            </View>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 20 : 24, color: '#990000', textAlign: 'center', }} selectable>
                                    {`$${selectedCustomerData.overBalance ? Number(selectedCustomerData.overBalance).toLocaleString('en-US') : 0}`}
                                </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 12 : 16, color: '#5E4343', textAlign: 'center', }}>
                                    {`Overbalance`}
                                </Text>

                                <Text style={{ fontSize: 14, color: 'transparent', textAlign: 'center', }} underline selectable={false}>
                                    {`-----`}
                                </Text>


                            </View>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold', fontSize: screenWidth < mobileViewBreakpoint ? 20 : 24, color: '#0029A3', textAlign: 'center', }} selectable>
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

const ChatMessageHeader = () => {

    const chatMessagesData = useSelector((state) => state.chatMessagesData);
    const selectedVehicleData = useSelector((state) => state.selectedVehicleData);
    const selectedCustomerData = useSelector((state) => state.selectedCustomerData);
    const activeChatId = useSelector((state) => state.activeChatId);

    const selectedChatData = useSelector((state) => state.selectedChatData);
    const invoiceData = useSelector((state) => state.invoiceData);
    const carImageUrl = useSelector((state) => state.carImageUrl);
    const dispatch = useDispatch();
    const [reRenderKey, setReRenderKey] = useState(0);
    const totalPriceCondition = selectedChatData.fobPrice && selectedChatData.jpyToUsd && selectedChatData.m3 && selectedChatData.freightPrice;
    const screenWidth = Dimensions.get('window').width;

    const freightCalculation = ((selectedChatData.m3 ? selectedChatData.m3 :
        (selectedChatData.carData && selectedChatData.carData.dimensionCubicMeters ?
            selectedChatData.carData.dimensionCubicMeters : 0)) *
        Number(selectedChatData.freightPrice));

    const totalPriceCalculation = (selectedChatData.fobPrice ? selectedChatData.fobPrice :
        (selectedChatData.carData && selectedChatData.carData.fobPrice ?
            selectedChatData.carData.fobPrice : 0) *
        (selectedChatData.jpyToUsd ? selectedChatData.jpyToUsd :
            (selectedChatData.currency && selectedChatData.currency.jpyToUsd ?
                selectedChatData.currency.jpyToUsd : 0))) + freightCalculation;

    const fobPriceDollars = (selectedChatData.fobPrice ? selectedChatData.fobPrice :
        (selectedChatData.carData && selectedChatData.carData.fobPrice ?
            selectedChatData.carData.fobPrice : 0) *
        (selectedChatData.jpyToUsd ? selectedChatData.jpyToUsd :
            (selectedChatData.currency && selectedChatData.currency.jpyToUsd ?
                selectedChatData.currency.jpyToUsd : 0)));

    const carName = selectedChatData.carData && selectedChatData.carData.carName ? selectedChatData.carData.carName : (selectedChatData.vehicle && selectedChatData.vehicle.carName ? selectedChatData.vehicle.carName : '');

    const freightPriceYen = freightCalculation / selectedChatData.currency.jpyToUsd;


    useEffect(() => {

        setReRenderKey(reRenderKey + 1)
        dispatch(setChatMessageBoxLoading(false));

    }, [activeChatId]);



    return (

        <View style={{
            flex: 1,
            alignSelf: 'flex-start',
            flexDirection: 'row',
        }}>


            {carImageUrl ? (
                <FastImage
                    source={{ uri: carImageUrl, priority: FastImage.priority.normal }}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        alignSelf: 'center',
                        margin: 10,
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                />
            ) : (
                <View
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        alignSelf: 'center',
                        backgroundColor: '#e0e0e0',
                        marginRight: 10,
                    }}
                />
            )}

            <View style={{ alignSelf: 'center', paddingRight: 10, }}>
                <Text style={{ fontWeight: 700, color: '#0A78BE', }}>{carName}</Text>

                <CustomerProfileModal />

                <View style={{ flexDirection: 'row', }}>
                    <Text selectable style={{ fontWeight: 700, fontSize: 12, paddingTop: 0, marginLeft: 1, color: '#8D7777', }}>
                        {selectedChatData.carData && selectedChatData.carData.referenceNumber ? selectedChatData.carData.referenceNumber : 'Chassis N/A'}
                    </Text>
                </View>

                {/* <Text style={{ fontWeight: 700, color: "#16A34A", }}>{`$${selectedChatData.offerPrice ? selectedChatData.offerPrice : 0}`}</Text> */}
                <TimelineStatus data={statusData} />

            </View>

            {/* <HorizontalTimeline /> */}

            <View style={{ alignSelf: 'center', justifyContent: 'center', paddingLeft: 10, }}>

                <View style={{ flexDirection: 'row', }}>
                    <Text selectable style={{ fontWeight: 700, fontSize: 12, paddingTop: 0, marginLeft: 2, }}>
                        {selectedChatData.carData && selectedChatData.carData.chassisNumber ? selectedChatData.carData.chassisNumber : 'Chassis N/A'}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text selectable style={{ fontWeight: 700, fontSize: 12, paddingTop: 0, marginLeft: 2, }}>
                        {selectedChatData.carData && selectedChatData.carData.modelCode ? selectedChatData.carData.modelCode : 'Model Code N/A'}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text selectable style={{ fontWeight: 700, fontSize: 12, paddingTop: 0, marginLeft: 2, }}>
                        {selectedChatData.carData && selectedChatData.carData.mileage
                            ? Number(selectedChatData.carData.mileage).toLocaleString('en-US')
                            : 'Mileage N/A'} km
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text selectable style={{ fontWeight: 700, fontSize: 12, paddingTop: 0, marginLeft: 2, }}>
                        {selectedChatData.carData && selectedChatData.carData.fuel ? selectedChatData.carData.fuel : 'Fuel N/A'}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text selectable style={{ fontWeight: 700, fontSize: 12, paddingTop: 0, marginLeft: 2, }}>
                        {selectedChatData.carData && selectedChatData.carData.transmission ? selectedChatData.carData.transmission : 'Transmission N/A'}
                    </Text>
                </View>

            </View>

            <View style={{ alignSelf: 'center', justifyContent: 'center', paddingLeft: 15, }}>

                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ fontSize: 18, }} bold>Total Price: </Text>
                    <Text selectable style={{ fontSize: 18, color: "#16A34A", textAlign: 'right', }} bold>
                        {`$${Number(totalPriceCalculation).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    </Text>
                    <Text selectable style={{ fontWeight: 400, fontSize: 12, color: "#8D7777", paddingTop: 4, marginLeft: 2, }}>
                        ({`¥${Number(
                            totalPriceCalculation /
                            ((selectedChatData && selectedChatData.jpyToUsd) ? Number(selectedChatData.jpyToUsd) :
                                (selectedChatData && selectedChatData.currency && selectedChatData.currency.jpyToUsd) ? selectedChatData.currency.jpyToUsd :
                                    0)
                        ).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`})
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ fontWeight: 700, }}>FOB Price: </Text>
                    <Text selectable style={{ fontWeight: 700, color: "#8D7777", textAlign: 'right', }}>
                        {`${Number(fobPriceDollars).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    </Text>
                    <Text selectable style={{ fontWeight: 400, fontSize: 12, color: "#8D7777", paddingTop: 2, marginLeft: 2, }}>
                        ({`${(selectedChatData.fobPrice ? selectedChatData.fobPrice : Number(selectedChatData.carData && selectedChatData.carData.fobPrice ? selectedChatData.carData.fobPrice : 0)).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 })}`})
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ fontWeight: 700, }}>Freight Price: </Text>
                    <Text selectable style={{ fontWeight: 700, color: "#8D7777", textAlign: 'right', }}>
                        {`${Number(freightCalculation).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    </Text>
                    <Text selectable style={{ fontWeight: 400, fontSize: 12, color: "#8D7777", paddingTop: 2, marginLeft: 2, }}>
                        ({`${(selectedChatData.freightPrice ? freightPriceYen : Number(selectedChatData.carData && selectedChatData.carData.freightPrice ? freightPriceYen : 0)).toLocaleString('en-US', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 })}`})
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text selectable style={{ fontWeight: 700, textAlign: 'right', }}>
                        {`${selectedChatData.country && selectedChatData.port ? `${selectedChatData.country} / ${selectedChatData.port}` : 'N/A'}`}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ fontWeight: 700, color: "#16A34A", }}>{selectedChatData.insurance ? 'CIF' : 'C&F'}
                        {selectedChatData.inspection ? ` + Inpection[${selectedChatData.inspectionName}]` : ''}</Text>
                </View>
            </View>

            {(chatMessagesData.length > 0 && selectedVehicleData.stockStatus == 'Reserved' &&
                selectedVehicleData.reservedTo !== selectedCustomerData.textEmail) ?
                null :
                (<View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 2, }}>
                    {(selectedChatData.stepIndicator.value == 1 || selectedChatData.stepIndicator.value == 2) &&
                        <>
                            <ProfitCalculator />

                            <TransactionButton
                                key={'Issue Proforma Invoice'}
                                title={selectedChatData.stepIndicator.value == 1 ? 'Issue Proforma Invoice' : selectedChatData.stepIndicator.value == 2 ? 'Update Invoice' : ''}
                                colorHoverIn={'#0f7534'}
                                colorHoverOut={'#16A34A'}
                                transactionValue={2}
                                buttonValue={2}
                                iconActive={<FontAwesome5 name="file-invoice-dollar" color="#1C2B33" size={14} />} />

                            <PreviewInvoice />

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 700, fontSize: 18 }}>Final Price: </Text>
                                <Text selectable style={{ fontWeight: 700, fontSize: 18, color: "#FF0000", textAlign: 'right' }}>
                                    {`$${(invoiceData && invoiceData.paymentDetails && invoiceData.paymentDetails.totalAmount ? Number(invoiceData.paymentDetails.totalAmount.replace(/,/g, '')) : 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                                </Text>
                                <Text selectable style={{ fontWeight: 400, fontSize: 12, color: "#8D7777", paddingTop: 4, marginLeft: 2 }}>
                                    ({`¥${(invoiceData && invoiceData.paymentDetails && invoiceData.paymentDetails.totalAmount && selectedChatData && selectedChatData.currency && selectedChatData.currency.jpyToUsd ? (Number(invoiceData.paymentDetails.totalAmount.replace(/,/g, '')) / Number(selectedChatData.currency.jpyToUsd)) : 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`})
                                </Text>
                            </View>
                        </>
                    }

                    {(selectedChatData.stepIndicator.value == 3) &&


                        (
                            <View style={{ flexDirection: 'row', paddingRight: 10, paddingTop: 2, }}>
                                {
                                    selectedChatData.isCancelled == true && (
                                        <View style={{ flexDirection: 'row', paddingRight: 10, }}>
                                            <View style={{ paddingLeft: 10, }}>
                                                <ReopenTransaction />
                                            </View>
                                        </View>
                                    )
                                }
                                <View style={{ paddingLeft: 10, }}>
                                    {!selectedChatData.isCancelled && <ProfitCalculator />}

                                    {!selectedChatData.isCancelled && <TransactionButton
                                        key={'Input Payment'}
                                        title={'Input Payment'}
                                        colorHoverOut={'#FF0000'}
                                        colorHoverIn={'#800101'}
                                        transactionValue={3}
                                        buttonValue={4}
                                        iconActive={<FontAwesome5 name="file-invoice-dollar" color="#1C2B33" size={14} />} />}

                                    <PreviewInvoice />

                                    {!selectedChatData.isCancelled && <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 700, fontSize: 18 }}>Final Price: </Text>
                                        <Text selectable style={{ fontWeight: 700, fontSize: 18, color: "#FF0000", textAlign: 'right' }}>
                                            {`$${(invoiceData && invoiceData.paymentDetails && invoiceData.paymentDetails.totalAmount ? Number(invoiceData.paymentDetails.totalAmount.replace(/,/g, '')) : 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                                        </Text>
                                        <Text selectable style={{ fontWeight: 400, fontSize: 12, color: "#8D7777", paddingTop: 4, marginLeft: 2 }}>
                                            ({`¥${(invoiceData && invoiceData.paymentDetails && invoiceData.paymentDetails.totalAmount && selectedChatData && selectedChatData.currency && selectedChatData.currency.jpyToUsd ? (Number(invoiceData.paymentDetails.totalAmount.replace(/,/g, '')) / Number(selectedChatData.currency.jpyToUsd)) : 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`})
                                        </Text>
                                    </View>}
                                </View>

                                <View style={{ paddingLeft: 10, }}>

                                    {!selectedChatData.isCancelled && <TransactionButton
                                        key={'Issue Proforma Invoice'}
                                        title={selectedChatData.stepIndicator.value == 1 ? 'Issue Proforma Invoice' : 'Update Invoice'}
                                        colorHoverIn={'#0f7534'}
                                        colorHoverOut={'#16A34A'}
                                        transactionValue={2}
                                        buttonValue={2}
                                        iconActive={<FontAwesome5 name="file-invoice-dollar" color="#1C2B33" size={14} />} />}

                                    {!selectedChatData.isCancelled && <ExtendDueDateButton />}

                                    {!selectedChatData.isCancelled && <CancelTransaction />}

                                    {!selectedChatData.isCancelled && <View style={{ flexDirection: 'row', }}>
                                        {invoiceData && invoiceData.bankInformations && invoiceData.bankInformations.dueDate &&
                                            <>
                                                <Text style={{ fontWeight: 700, fontSize: 14, }}>Due Date: </Text>
                                                <Text selectable style={{ fontWeight: 700, fontSize: 14, textAlign: 'right', color: '#FF0000', }}>
                                                    {
                                                        invoiceData.bankInformations.dueDate
                                                            ? new Date(invoiceData.bankInformations.dueDate).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })
                                                            : 'Invalid Date'
                                                    }
                                                </Text>
                                            </>}
                                    </View>}

                                </View>
                            </View>)
                    }
                </View>)

            }


            <TransactionModal />
        </View>

    );
};


const ReadByListModal = ({ userEmail, handleReadByListModalClose }) => {

    const readByListModalVisible = useSelector((state) => state.readByListModalVisible)
    const selectedChatData = useSelector((state) => state.selectedChatData)
    // const [email, setEmail] = useState(projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '');

    const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';

    return (

        <Modal
            isOpen={readByListModalVisible}
            onClose={() => handleReadByListModalClose()}
            useRNModal
            size={'xs'}
        >
            <Modal.Content borderRadius={0} style={{ padding: 15, backgroundColor: '#f8f8f8', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
                <Modal.CloseButton />

                <Modal.Header style={{ fontSize: 22, fontWeight: '600', textAlign: 'center', color: '#333', }}>Read List</Modal.Header>

                <Modal.Body>
                    {
                        selectedChatData.readBy.length > 0 ? (
                            <ScrollView style={{ maxHeight: 250, borderRadius: 10 }}>
                                {/* Sort and map over the readBy list */}
                                {
                                    [...selectedChatData.readBy]
                                        .sort((a, b) => a === email ? -1 : b === email ? 1 : 0)
                                        .map(item => (
                                            <View key={item} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: 8, borderBottomWidth: 0.5, borderColor: '#ddd', paddingBottom: 8 }}>
                                                {item === 'RMJ-Bot' ?
                                                    <FontAwesome5 name="robot" size={24} color="#4A90E2" style={{ marginRight: 12 }} /> :
                                                    <FontAwesome name="user-circle" size={24} color="#4A90E2" style={{ marginRight: 12 }} />}
                                                <View style={{ flex: 1 }}> {/* Ensure text has its own block and can wrap */}
                                                    <Text style={{ color: '#555', flexWrap: 'wrap' }}>{email === item ? 'You' : item}</Text>
                                                </View>
                                            </View>
                                        ))
                                }
                            </ScrollView>
                        ) : (
                            <Text style={{ textAlign: 'center', color: 'grey', fontSize: 16 }}>No one has read this message yet.</Text>
                        )
                    }
                </Modal.Body>
            </Modal.Content>
        </Modal>

    );
}

const ImagePreviewModal = ({ isVisible, onClose, imageUrl }) => {
    return (
        <Modal isOpen={isVisible} onClose={onClose} size="full" useRNModal>
            <Modal.Content
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: '80%',
                    height: '80%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                }}>
                <Modal.CloseButton />
                <FastImage
                    source={{ uri: imageUrl, priority: FastImage.priority.normal }}
                    style={{ width: '100%', height: '100%', borderRadius: 10 }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </Modal.Content>
        </Modal>
    );
};


const HoverablePressable = ({ url, printComponent }) => {
    const [isHoveredDownload, setIsHoveredDownload] = useState(false);
    const [isHoveredPrint, setIsHoveredPrint] = useState(false);
    const baseStyle = {
        marginRight: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'white',
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
    };

    const hoverStyle = {
        backgroundColor: '#ddd', // Example hover style
    };

    return (
        <>
            <Tooltip label="Download" openDelay={200} bgColor={'white'} _text={{ color: '#1C2B33', }}>
                <Pressable
                    style={{
                        marginRight: 8,
                        borderRadius: 16,
                        width: 32,
                        height: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: isHoveredDownload ? '#424649' : 'transparent',
                    }}
                    onPress={async () => {
                        await Linking.openURL(url);
                    }}
                    onMouseEnter={() => setIsHoveredDownload(true)}
                    onMouseLeave={() => setIsHoveredDownload(false)}
                >
                    <MaterialCommunityIcons name="download" size={20} color={'#F1F1F1'} />
                </Pressable>
            </Tooltip>

            {/* <Tooltip label="Print" openDelay={200} bgColor={'white'} _text={{ color: '#1C2B33', }}>
                <Pressable
                    style={{
                        marginRight: 8,
                        borderRadius: 16,
                        width: 32,
                        height: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: isHoveredPrint ? '#424649' : 'transparent',
                    }}
                    onMouseEnter={() => setIsHoveredPrint(true)}
                    onMouseLeave={() => setIsHoveredPrint(false)}
                    onPress={printComponent}
                >
                    <MaterialCommunityIcons name="printer" size={20} color={'#F1F1F1'} />
                </Pressable>
            </Tooltip> */}
        </>
    );
};

const DocumentPreviewModal = () => {

    const dispatch = useDispatch();
    const selectedFileUrl = useSelector((state) => state.selectedFileUrl);
    const pdfViewerModalVisible = useSelector((state) => state.pdfViewerModalVisible);
    const screenWidth = Dimensions.get('window').width;

    const [iframeKey, setIframeKey] = useState(0);


    const url = 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/ChatFiles%2Fchat_2023090239_marcvan14%40gmail.com%2FC-HUB_01312024153002.887%2FDAILY%20REPORT%202024-01-29.pdf?alt=media&token=88b7be9b-17ef-48d3-b5b3-6f7f0d317b7c'
    const urlDocx = 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/ChatFiles%2Fchat_2023090239_marcvan14%40gmail.com%2FC-HUB_01312024170117.701%2FDAILY%20REPORT%202024-01-29.docx?alt=media&token=9bf45632-e192-45bf-8b40-9fd5cdb9368e';
    const [isLoading, setLoading] = useState(true); // Loading state

    // console.log(`https://docs.google.com/viewer?url=${encodeURIComponent(urlDocx)}&embedded=true`);


    const handleIframeLoad = () => {
        setLoading(false); // Set loading to false when iframe content is loaded
    };

    const handleModalClose = () => {

        dispatch(setPdfViewerModalVisible(false))
        dispatch(setSelectedFileUrl(''))
        setLoading(true);
        globalSelectedFileType = '';
        globalSelectedPDFUrl = '';
    }

    const printIframe = () => {
        // const iframe = document.getElementById('documentIframe');
        // iframe.contentWindow.print();
        const printWindow = window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(selectedFileUrl)}&embedded=true`, '_blank');
        printWindow.focus();
        printWindow.print();

    };

    useEffect(() => {

        const timeout = setTimeout(() => {

            if (isLoading) {
                console.log("Iframe is taking too long to load. Attempting to reload.");
                console.log("Current URL:", selectedFileUrl);
                console.log("Current Global URL:", globalSelectedPDFUrl);

                setIsLoading(false);
                setIframeKey(prevKey => prevKey + 1);
                dispatch(setSelectedFileUrl(globalSelectedPDFUrl));

            }

        }, 5000); // Timeout set to 5 seconds

        return () => clearTimeout(timeout);

    }, [isLoading,]);



    return (
        <Modal isOpen={pdfViewerModalVisible}
            onClose={() => {
                handleModalClose();
            }
            } size="xl">
            <Modal.Content>
                {globalSelectedFileType !== 'pdf' ?

                    (<>
                        {isLoading && (
                            <View style={{
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                position: 'absolute',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '700px'  // Same height as the iframe for consistent layout
                            }}>
                                <Spinner
                                    animating
                                    size="lg"
                                    color={'#7B9CFF'}
                                />
                            </View>
                        )}
                        {selectedFileUrl !== '' &&
                            <>
                                {!isLoading &&
                                    <View style={{ flexDirection: 'row', width: '100%', height: 57, borderRadius: 0, backgroundColor: '#323639', justifyContent: 'flex-end', alignItems: 'center', }}>
                                        <HoverablePressable url={globalSelectedPDFUrl} printComponent={printIframe} />
                                    </View>
                                }

                                <iframe
                                    key={iframeKey}
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedFileUrl)}&embedded=true`}
                                    id='documentIframe'
                                    style={{ width: '100%', height: '700px' }}
                                    title="Document Viewer"
                                    onLoad={() => {
                                        handleIframeLoad();
                                    }}
                                />
                            </>
                        }
                    </>
                    )

                    : (
                        <>
                            {isLoading && (
                                <View style={{
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    position: 'absolute',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '700px'  // Same height as the iframe for consistent layout
                                }}>
                                    <Spinner
                                        animating
                                        size="lg"
                                        color={'#7B9CFF'}
                                    />
                                </View>
                            )}
                            {selectedFileUrl !== '' &&
                                (
                                    screenWidth < mobileViewBreakpoint ?
                                        (<>
                                            {!isLoading &&
                                                <View style={{ flexDirection: 'row', width: '100%', height: 57, borderRadius: 0, backgroundColor: '#323639', justifyContent: 'flex-end', alignItems: 'center', }}>

                                                    <HoverablePressable url={globalSelectedPDFUrl} printComponent={printIframe} />
                                                </View>
                                            }

                                            <iframe
                                                key={iframeKey}
                                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedFileUrl)}&embedded=true`}
                                                id='mobilePdfIframe'
                                                style={{ width: '100%', height: '700px' }}
                                                title="PDF Viewer"
                                                onLoad={handleIframeLoad}
                                            />
                                        </>) :
                                        (<iframe
                                            src={selectedFileUrl}
                                            style={{ width: '100%', height: '700px' }}
                                            title="PDF Viewer"
                                            onLoad={handleIframeLoad} // Event when iframe has loaded
                                        />)
                                )
                            }
                        </>
                    )


                }

            </Modal.Content>
        </Modal>
    );

};

const ChatMessageBox = ({ activeButtonValue, userEmail }) => {
    const chatListData = useSelector((state) => state.chatListData);
    const chatMessagesData = useSelector((state) => state.chatMessagesData);
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const activeChatId = useSelector((state) => state.activeChatId);
    const loadMoreMessagesLoading = useSelector((state) => state.loadMoreMessagesLoading);
    const noMoreMessagesData = useSelector((state) => state.noMoreMessagesData);
    const [isEyeHovered, setIsEyeHovered] = useState(false);
    const flatListRef = useRef();
    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);

    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Store the current path
        const handlePopState = () => {
            if (screenWidth < mobileViewBreakpoint && activeChatId !== '') {
                dispatch(setMessageTextInputValue(''));
                dispatch(setChatMessagesData([]));
                dispatch(setActiveChatId(''));
                navigate('/top/chat-messages');
            }
        };

        // Add event listener when component mounts or when dependencies change
        window.addEventListener('popstate', handlePopState);

        // Cleanup function to remove event listener when component unmounts or dependencies change
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };

    }, []);

    const openPreview = (index) => {
        setSelectedImageIndex(index);
        setIsPreviewVisible(true);
    };

    const closePreview = () => {
        setIsPreviewVisible(false);
        setSelectedImageIndex(null);
    };

    const handleImageMessageMouseEnter = (index) => {
        setHoveredImageIndex(index);
    };

    const handleImageMessageMouseLeave = () => {
        setHoveredImageIndex(null);
    };

    const dispatch = useDispatch();

    const [read, setRead] = useState(selectedChatData.read);

    const handleReadByListModalOpen = () => {
        dispatch(setReadByListModalVisible(true));
    };

    const handleReadByListModalClose = () => {
        dispatch(setReadByListModalVisible(false));
    };

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, [selectedChatData, chatMessagesData, animatedValue]);

    const borderColor = animatedValue.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
            'rgb(255, 100, 100)', // Red
            'rgb(100, 255, 100)', // Green
            'rgb(100, 100, 255)', // Blue
            'rgb(255, 255, 100)', // Yellow
            'rgb(255, 100, 255)'  // Magenta
        ]
    });

    const renderFooter = () => {
        return (
            <>
                {!noMoreMessagesData && (
                    <View style={{ paddingVertical: 20, height: 60, }}>
                        {loadMoreMessagesLoading && (
                            <Spinner
                                animating
                                size="sm"
                                color={'#7B9CFF'}
                            />
                        )}
                    </View>
                )}
            </>

        );
    };

    const handleLoadMoreMessages = async () => {
        dispatch(setLoadMoreMessagesLoading(true));
        dispatch(setNoMoreMessagesData(false));

        let nextQuery;
        if (!globalMessagesLastVisible) {
            // No more data to load or globalLastVisible is undefined
            dispatch(setLoadMoreMessagesLoading(false));
            dispatch(setNoMoreMessagesData(true));
        }

        else {
            dispatch(setLoadMoreMessagesLoading(true));
            dispatch(setNoMoreMessagesData(false));

            nextQuery = query(
                collection(projectExtensionFirestore, 'chats', selectedChatData.id, 'messages'),
                orderBy('timestamp', 'desc'),
                startAfter(globalMessagesLastVisible),
                limit(10)
            );
            try {
                const unsubscribe = onSnapshot(nextQuery, (snapshot) => {
                    if (snapshot.empty) {
                        // Handle the case when there's no more data
                        console.log("No more data to load");
                        setTimeout(() => {
                            dispatch(setLoadMoreMessagesLoading(false));
                            dispatch(setNoMoreMessagesData(true));
                            globalMessagesLastVisible = null;
                        }, 0);  // Delay setting loading and no more data flags
                        return;
                    }

                    const chatsData = [];
                    snapshot.forEach((doc) => {
                        chatsData.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });


                    // Append new data to the existing list

                    setTimeout(() => {
                        dispatch(setChatMessagesData([...chatMessagesData, ...chatsData]));
                        dispatch(setLoadMoreMessagesLoading(false));
                        globalMessagesLastVisible = snapshot.docs[snapshot.docs.length - 1];
                    }, 0);

                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
                setTimeout(() => dispatch(setLoadMoreMessagesLoading(false)), 0);  // Ensure loading is set to false even if there's an error
            }

        }

    };

    const updateChatToRead = async () => {
        const email = projectControlAuth.currentUser ? projectControlAuth.currentUser.email : '';
        const docRef = doc(projectExtensionFirestore, "chats", activeChatId);
        if (email !== '') {
            try {

                await updateDoc(docRef, {
                    read: true,
                    readBy: arrayUnion(email),
                });
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }

    };

    useEffect(() => {
        if (activeChatId == selectedChatData.id) {
            if (selectedChatData.stepIndicator.value !== activeButtonValue && activeButtonValue !== 0) {
                dispatch(setChatMessagesData([]));
                dispatch(setMessageTextInputValue(''));
                dispatch(setActiveChatId(''));
            }
            else {
                updateChatToRead();
            }

        }


    }, [selectedChatData]);

    const handlePreviewInvoiceModalOpen = () => {
        dispatch(setPreviewInvoiceVisible(true));
    };

    const formatDate = (timestamp) => {
        // Parse the original timestamp
        // Expected format: "2024/01/15 at 12:17:50"
        const parts = timestamp.match(/(\d{4})\/(\d{2})\/(\d{2}) at (\d{2}):(\d{2}):(\d{2})/);
        if (!parts) return timestamp; // Return original if parsing fails

        // Create a new Date object
        const date = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);

        // Format month names
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Convert to 12-hour format and determine AM or PM
        const hours = date.getHours();
        const isPM = hours >= 12;
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        const amPm = isPM ? 'PM' : 'AM';

        // Construct the new format with year at the beginning
        return `${date.getFullYear().toString().substr(-2)} ${months[date.getMonth()]} ${date.getDate()}, ${formattedHours}:${date.getMinutes().toString().padStart(2, '0')} ${amPm}`;
    };

    const extractUsernameFromEmail = (email) => {
        const [username] = email.split('@');
        return username;
    };


    const breakUrl = (url, maxUrlLength = 30) => {
        let brokenUrl = '';
        while (url.length > 0) {
            brokenUrl += url.substring(0, maxUrlLength);
            if (url.length > maxUrlLength) {
                brokenUrl += '\u200B'; // Zero-width space
            }
            url = url.substring(maxUrlLength);
        }
        return brokenUrl;
    };

    const isUrl = (text) => {
        // Simple URL check
        const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!urlPattern.test(text);
    };

    const handleLinkPress = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    };

    const cleanUrl = (url) => {
        // Removing Zero Width Space and other potential invisible characters
        return url.replace(/[\u200B-\u200D\uFEFF]/g, '');
    };


    const renderItemText = (isGlobalCustomerSender, text) => {
        const urlPattern = new RegExp('(https?:\\/\\/[^\\s]+)', 'g');
        let segments = text.split(urlPattern);

        const insertBreaks = (str, n) => {
            // Inserts a zero-width space every 'n' characters in 'str'
            let result = '';
            while (str.length > 0) {
                result += str.substring(0, n) + '\u200B';
                str = str.substring(n);
            }
            return result;
        };

        return segments.map((segment, index) => {
            const segmentWithBreaks = segment.length > 30 && !segment.includes(' ') ? insertBreaks(segment, 30) : segment;

            if (isUrlForText(segment)) {
                // Apply breaks for long URLs
                return (
                    <Pressable key={index} onPress={() => handleLinkPress(segment)}>
                        <Text
                            selectable
                            style={{
                                fontWeight: '400',
                                color: isGlobalCustomerSender ? '#555659' : '#555659',
                                fontSize: 16,
                                flexShrink: 1,
                                textDecorationLine: 'underline',
                                flexWrap: 'wrap',
                            }}
                        >
                            {segmentWithBreaks}
                        </Text>
                    </Pressable>
                );
            } else {
                return (
                    <Text
                        selectable
                        key={index}
                        style={{
                            fontWeight: '400',
                            color: isGlobalCustomerSender ? '#555659' : '#555659',
                            fontSize: screenWidth < mobileViewBreakpoint ? 14 : 16,
                            flexShrink: 1,
                            flexWrap: 'wrap',
                        }}
                    >
                        {segmentWithBreaks}
                    </Text>
                );
            }
        });
    };



    const getFileIcon = (fileName) => {
        const iconSize = 24;
        const lowerFileName = fileName.toLowerCase();

        if (lowerFileName.endsWith('.pdf')) {
            return <MaterialIcons name={'picture-as-pdf'} size={iconSize} color="#fca19a" />;
        }
        // Add more conditions for other file types as needed
        // Example for .docx files
        if (lowerFileName.endsWith('.docx') || lowerFileName.endsWith('.doc')) {
            return <MaterialCommunityIcons name={'microsoft-word'} size={iconSize} color="#7B9CFF" />;
        }
        if (lowerFileName.endsWith('.xlsx') || lowerFileName.endsWith('.xls') || lowerFileName.endsWith('.csv')) {
            return <MaterialCommunityIcons name={'microsoft-excel'} size={iconSize} color="#6db375" />;
        }

        if (lowerFileName.endsWith('.rar') || lowerFileName.endsWith('.zip')) {
            return <FastImage
                source={{ uri: require('../../assets/rar_icon.png'), priority: FastImage.priority.high }}
                style={{
                    width: iconSize,
                    height: iconSize,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />;
        }
        // Default icon if no specific type is matched
        return <MaterialIcons name="insert-drive-file" size={iconSize} color="#b3afaf" />;
    };

    const isUrlForText = (text) => {
        const urlPattern = new RegExp('^(http://www\\.|https://www\\.|http://|https://)[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$');
        return urlPattern.test(text);
    }

    const renderItem = ({ item, index }) => {
        const isGlobalCustomerSender = item.sender === globalCustomerId;
        const isLastMessage = index === 0; // Since the list is inverted, the first item is actually the last message
        const isHovered = hoveredImageIndex === index;
        const textFontSize = screenWidth < mobileViewBreakpoint ? 14 : 16;

        return (
            <View style={{
                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                width: '100%',
                height: '100%',
                alignSelf: isGlobalCustomerSender ? 'flex-start' : 'flex-end',
                marginVertical: 4,
                maxWidth: screenWidth < mobileViewBreakpoint ? '80%' : '60%', // Max width for long messages
                // borderWidth: 1,
                // borderColor: 'red',
            }}>
                {item.messageType == 'IssuedInvoice' &&
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end', flex: 1 }}>
                        <View style={{ flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse', flex: 1, }}>
                            <Animated.View style={{
                                padding: 7,
                                flex: 1,
                                borderRadius: 5,
                                backgroundColor: isGlobalCustomerSender ? '#FFFFFF' : '#f1f5ff',
                                marginRight: isGlobalCustomerSender ? 0 : 10,
                                borderWidth: 3,
                                borderColor: borderColor,
                            }}>
                                <Pressable onPress={handlePreviewInvoiceModalOpen}>
                                    <Text underline selectable style={{
                                        fontWeight: 400,
                                        color: isGlobalCustomerSender ? '#555659' : '#555659',
                                        fontSize: textFontSize,
                                    }}>
                                        {item.text.trim()}
                                    </Text>
                                </Pressable>
                            </Animated.View>
                            <View style={{
                                position: 'absolute',
                                left: -60,
                                top: '50%',
                                bottom: '50%',
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                            }}>
                                {/* Display read status text outside of the message bubble */}
                                {isLastMessage && selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Already read by the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail-open" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}

                                {isLastMessage && !selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Message sent to the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}
                                {isLastMessage && selectedChatData.readBy.length > 0 && (
                                    <View style={{
                                        alignSelf: 'flex-end',
                                        marginLeft: isGlobalCustomerSender ? 8 : 0,
                                        marginRight: isGlobalCustomerSender ? 0 : 8,
                                        alignSelf: 'center',
                                    }}>
                                        <Pressable
                                            focusable={false}
                                            onHoverIn={() => setIsEyeHovered(true)}
                                            onHoverOut={() => setIsEyeHovered(false)}
                                            onPress={handleReadByListModalOpen}
                                        >
                                            <Entypo name="eye" size={20} color={isEyeHovered ? '#c5d1ce' : '#75A99C'} />
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Additional message properties like timestamp and sender */}
                        <Text style={{
                            fontWeight: '300',
                            color: '#888c96',
                            fontSize: screenWidth < mobileViewBreakpoint ? 9 : 11,
                            marginTop: 4,
                            marginBottom: 4,
                            marginLeft: isGlobalCustomerSender ? 15 : 0,
                            marginRight: isGlobalCustomerSender ? 0 : 15,
                        }}
                            selectable>
                            {!isGlobalCustomerSender ?
                                (`${formatDate(item.timestamp)} - ${extractUsernameFromEmail(item.sender)}${item.ip ? ` - ${item.ip}` : ''}${item.ipCountry ? ` - ${item.ipCountry}` : ''}`)
                                : (`${formatDate(item.timestamp)}${item.ip ? ` - ${item.ip}${item.ipCountry ? ` - ${item.ipCountry}` : ''}` : ''}`)
                            }
                        </Text>

                    </View>
                }


                {item.messageType == 'InputPayment' &&
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end', flex: 1 }}>
                        <View style={{ flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse', flex: 1, }}>
                            <Animated.View style={{
                                padding: 7,
                                flex: 1,
                                borderRadius: 5,
                                backgroundColor: isGlobalCustomerSender ? '#FFFFFF' : '#f1f5ff',
                                marginRight: isGlobalCustomerSender ? 0 : 10,
                                borderWidth: 3,
                                borderColor: borderColor,
                            }}>
                                <Text selectable style={{
                                    fontWeight: 400,
                                    color: isGlobalCustomerSender ? '#555659' : '#555659',
                                    fontSize: textFontSize,
                                }}>
                                    {item.text.trim()}
                                </Text>
                            </Animated.View>
                            <View style={{
                                position: 'absolute',
                                left: -60,
                                top: '50%',
                                bottom: '50%',
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                            }}>
                                {/* Display read status text outside of the message bubble */}
                                {isLastMessage && selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Already read by the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail-open" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}

                                {isLastMessage && !selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Message sent to the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}
                                {isLastMessage && selectedChatData.readBy.length > 0 && (
                                    <View style={{
                                        alignSelf: 'flex-end',
                                        marginLeft: isGlobalCustomerSender ? 8 : 0,
                                        marginRight: isGlobalCustomerSender ? 0 : 8,
                                        alignSelf: 'center',
                                    }}>
                                        <Pressable
                                            focusable={false}
                                            onHoverIn={() => setIsEyeHovered(true)}
                                            onHoverOut={() => setIsEyeHovered(false)}
                                            onPress={handleReadByListModalOpen}
                                        >
                                            <Entypo name="eye" size={20} color={isEyeHovered ? '#c5d1ce' : '#75A99C'} />
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Additional message properties like timestamp, sender email, IP, and country */}
                        <Text style={{
                            fontWeight: '300',
                            color: 'gray',
                            fontSize: 11,
                            marginTop: 4,
                            marginBottom: 4,
                            marginLeft: isGlobalCustomerSender ? 15 : 0,
                            marginRight: isGlobalCustomerSender ? 0 : 15,
                        }}
                            selectable>
                            {!isGlobalCustomerSender ?
                                (`${formatDate(item.timestamp)} - ${extractUsernameFromEmail(item.sender)}${item.ip ? ` - ${item.ip}` : ''}${item.ipCountry ? ` - ${item.ipCountry}` : ''}`)
                                : (`${formatDate(item.timestamp)}${item.ip ? ` - ${item.ip}${item.ipCountry ? ` - ${item.ipCountry}` : ''}` : ''}`)
                            }
                        </Text>
                    </View>
                }


                {!item.messageType && item.file && item.file.type == 'attachment' &&
                    <View style={{ flexDirection: 'column', alignItems: isGlobalCustomerSender ? 'flex-start' : 'flex-end', flex: 1 }}>
                        {item.text && item.text !== '' &&
                            <View style={{
                                marginBottom: 5,
                                padding: 10,
                                borderRadius: 5,
                                backgroundColor: isGlobalCustomerSender ? '#FFFFFF' : '#f1f5ff',
                                marginLeft: isGlobalCustomerSender ? 10 : 0,
                                marginRight: isGlobalCustomerSender ? 0 : 10,
                                flexShrink: 1,
                            }}>
                                {renderItemText(isGlobalCustomerSender, item.text.trim())}
                            </View>
                        }
                        <View style={{ flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse', flex: 1, }}>

                            <View style={{
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                                flex: 1,
                            }}>
                                <View style={{
                                    marginBottom: 5,
                                    padding: 10,
                                    borderRadius: 5,
                                    backgroundColor: isGlobalCustomerSender ? '#FFFFFF' : '#f1f5ff',
                                    marginLeft: isGlobalCustomerSender ? 10 : 0,
                                    marginRight: isGlobalCustomerSender ? 0 : 10,
                                    flexShrink: 1,
                                }}>
                                    <Pressable
                                        onPress={() => {
                                            if (item.file.name.endsWith('.pdf')) {
                                                globalSelectedFileType = 'pdf'
                                                dispatch(setPdfViewerModalVisible(true));
                                                dispatch(setSelectedFileUrl(item.file.url));
                                                globalSelectedPDFUrl = item.file.url;

                                            }
                                            else {
                                                globalSelectedFileType = 'not-pdf'
                                                dispatch(setPdfViewerModalVisible(true));
                                                dispatch(setSelectedFileUrl(item.file.url));
                                                globalSelectedPDFUrl = item.file.url;



                                            }
                                            // dispatch(setSelectedFileUrl(item.file.url));
                                            // // globalSelectedPDFUrl = item.file.url
                                            // dispatch(setPdfViewerModalVisible(true));

                                        }}
                                        style={{ flexDirection: 'row', }}
                                    >
                                        <View style={{ marginRight: 5, }}>
                                            {getFileIcon(item.file.name)}
                                        </View>

                                        <Text underline selectable style={{
                                            fontWeight: 400,
                                            color: isGlobalCustomerSender ? '#555659' : '#555659',
                                            fontSize: textFontSize,
                                        }}>
                                            {item.file.name.trim()}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>

                            <View style={{
                                position: 'absolute',
                                left: -60,
                                top: '50%',
                                bottom: '50%',
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                            }}>
                                {/* Display read status text outside of the message bubble */}
                                {isLastMessage && selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Already read by the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail-open" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}

                                {isLastMessage && !selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Message sent to the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}
                                {isLastMessage && selectedChatData.readBy.length > 0 && (
                                    <View style={{
                                        alignSelf: 'flex-end',
                                        marginLeft: isGlobalCustomerSender ? 8 : 0,
                                        marginRight: isGlobalCustomerSender ? 0 : 8,
                                        alignSelf: 'center',
                                    }}>
                                        <Pressable
                                            focusable={false}
                                            onHoverIn={() => setIsEyeHovered(true)}
                                            onHoverOut={() => setIsEyeHovered(false)}
                                            onPress={handleReadByListModalOpen}
                                        >
                                            <Entypo name="eye" size={20} color={isEyeHovered ? '#c5d1ce' : '#75A99C'} />
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Additional message properties like timestamp and sender */}
                        <Text style={{
                            fontWeight: '300',
                            color: '#888c96',
                            fontSize: screenWidth < mobileViewBreakpoint ? 9 : 11,
                            marginTop: 4,
                            marginBottom: 4,
                            marginLeft: isGlobalCustomerSender ? 15 : 0,
                            marginRight: isGlobalCustomerSender ? 0 : 15,
                        }}
                            selectable>
                            {!isGlobalCustomerSender ?
                                (`${formatDate(item.timestamp)} - ${extractUsernameFromEmail(item.sender)}${item.ip ? ` - ${item.ip}` : ''}${item.ipCountry ? ` - ${item.ipCountry}` : ''}`)
                                : (`${formatDate(item.timestamp)}${item.ip ? ` - ${item.ip}${item.ipCountry ? ` - ${item.ipCountry}` : ''}` : ''}`)
                            }
                        </Text>


                    </View>}


                {!item.messageType && item.file && item.file.type == 'image' &&
                    <View style={{ flexDirection: 'column', alignItems: isGlobalCustomerSender ? 'flex-start' : 'flex-end', flex: 1 }}>
                        {item.text && item.text !== '' &&
                            <View style={{
                                marginBottom: 5,
                                padding: 10,
                                borderRadius: 5,
                                backgroundColor: isGlobalCustomerSender ? '#FFFFFF' : '#f1f5ff',
                                marginLeft: isGlobalCustomerSender ? 10 : 0,
                                marginRight: isGlobalCustomerSender ? 0 : 10,
                                flexShrink: 1,
                            }}>
                                {renderItemText(isGlobalCustomerSender, item.text.trim())}
                            </View>
                        }
                        <View style={{ flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse', flex: 1, }}>
                            <View style={{
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                                flex: 1,
                            }}>
                                <View style={{
                                    padding: 0,
                                    borderRadius: 10,
                                    marginLeft: isGlobalCustomerSender ? 10 : 0,
                                    marginRight: isGlobalCustomerSender ? 0 : 10,
                                    flexShrink: 1,
                                }}>
                                    <Pressable
                                        onMouseEnter={() => handleImageMessageMouseEnter(index)}
                                        onMouseLeave={handleImageMessageMouseLeave}
                                        onPress={() => openPreview(index)}
                                        style={{
                                            position: 'relative', // Ensure relative positioning for the overlay
                                            width: 250,
                                            height: 250,
                                            alignSelf: 'center',
                                        }}
                                    >
                                        <FastImage
                                            source={{ uri: item.file.url, priority: FastImage.priority.normal }}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                borderColor: '#DADDE1',
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        {isHovered && (
                                            <View style={{
                                                ...StyleSheet.absoluteFillObject, // Make overlay cover the entire image
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent black
                                                borderRadius: 10, // Match the border radius of the image
                                            }} />
                                        )}
                                    </Pressable>
                                </View>
                            </View>

                            <View style={{
                                position: 'absolute',
                                left: -60,
                                top: '50%',
                                bottom: '50%',
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                            }}>
                                {/* Display read status text outside of the message bubble */}
                                {isLastMessage && selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Already read by the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail-open" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}

                                {isLastMessage && !selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Message sent to the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}
                                {isLastMessage && selectedChatData.readBy.length > 0 && (
                                    <View style={{
                                        alignSelf: 'flex-end',
                                        marginLeft: isGlobalCustomerSender ? 8 : 0,
                                        marginRight: isGlobalCustomerSender ? 0 : 8,
                                        alignSelf: 'center',
                                    }}>
                                        <Pressable
                                            focusable={false}
                                            onHoverIn={() => setIsEyeHovered(true)}
                                            onHoverOut={() => setIsEyeHovered(false)}
                                            onPress={handleReadByListModalOpen}
                                        >
                                            <Entypo name="eye" size={20} color={isEyeHovered ? '#c5d1ce' : '#75A99C'} />
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Additional message properties like timestamp and sender */}
                        <Text style={{
                            fontWeight: '300',
                            color: '#888c96',
                            fontSize: screenWidth < mobileViewBreakpoint ? 9 : 11,
                            marginTop: 4,
                            marginBottom: 4,
                            marginLeft: isGlobalCustomerSender ? 15 : 0,
                            marginRight: isGlobalCustomerSender ? 0 : 15,
                        }}
                            selectable>
                            {!isGlobalCustomerSender ?
                                (`${formatDate(item.timestamp)} - ${extractUsernameFromEmail(item.sender)}${item.ip ? ` - ${item.ip}` : ''}${item.ipCountry ? ` - ${item.ipCountry}` : ''}`)
                                : (`${formatDate(item.timestamp)}${item.ip ? ` - ${item.ip}${item.ipCountry ? ` - ${item.ipCountry}` : ''}` : ''}`)
                            }
                        </Text>


                    </View>}

                {!item.messageType && !item.file &&
                    <View style={{ flexDirection: 'column', alignItems: isGlobalCustomerSender ? 'flex-start' : 'flex-end', flex: 1 }}>
                        <View style={{ flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse', flex: 1, }}>
                            <View style={{
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                                flex: 1,
                            }}>
                                <View style={{
                                    padding: 10,
                                    borderRadius: 5,
                                    backgroundColor: isGlobalCustomerSender ? '#FFFFFF' : '#f1f5ff',
                                    marginLeft: isGlobalCustomerSender ? 10 : 0,
                                    marginRight: isGlobalCustomerSender ? 0 : 10,
                                    flexShrink: 1,
                                }}>
                                    {renderItemText(isGlobalCustomerSender, item.text.trim())}
                                </View>
                            </View>

                            <View style={{
                                position: 'absolute',
                                left: -60,
                                top: '50%',
                                bottom: '50%',
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                            }}>
                                {/* Display read status text outside of the message bubble */}
                                {isLastMessage && selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Already read by the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail-open" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}

                                {isLastMessage && !selectedChatData.customerRead && !isGlobalCustomerSender && (
                                    <Tooltip label="Message sent to the customer" openDelay={200} bgColor={'#FAFAFA'} _text={{ color: '#1C2B33', }}>
                                        <View style={{
                                            alignSelf: 'flex-end',
                                            marginLeft: isGlobalCustomerSender ? 8 : 0,
                                            marginRight: isGlobalCustomerSender ? 0 : 8,
                                            alignSelf: 'center',
                                        }}>
                                            <Ionicons name="mail" size={20} color={'#1B81C2'} />
                                        </View>
                                    </Tooltip>
                                )}
                                {isLastMessage && selectedChatData.readBy.length > 0 && (
                                    <View style={{
                                        alignSelf: 'flex-end',
                                        marginLeft: isGlobalCustomerSender ? 8 : 0,
                                        marginRight: isGlobalCustomerSender ? 0 : 8,
                                        alignSelf: 'center',
                                    }}>
                                        <Pressable
                                            focusable={false}
                                            onHoverIn={() => setIsEyeHovered(true)}
                                            onHoverOut={() => setIsEyeHovered(false)}
                                            onPress={handleReadByListModalOpen}
                                        >
                                            <Entypo name="eye" size={20} color={isEyeHovered ? '#c5d1ce' : '#75A99C'} />
                                        </Pressable>
                                    </View>
                                )}
                            </View>

                        </View>

                        {/* Additional message properties like timestamp and sender */}
                        <Text style={{
                            fontWeight: '300',
                            color: '#888c96',
                            fontSize: screenWidth < mobileViewBreakpoint ? 9 : 11,
                            marginTop: 4,
                            marginBottom: 4,
                            marginLeft: isGlobalCustomerSender ? 15 : 0,
                            marginRight: isGlobalCustomerSender ? 0 : 15,
                        }}
                            selectable>
                            {!isGlobalCustomerSender ?
                                (`${formatDate(item.timestamp)} - ${extractUsernameFromEmail(item.sender)}${item.ip ? ` - ${item.ip}` : ''}${item.ipCountry ? ` - ${item.ipCountry}` : ''}`)
                                : (`${formatDate(item.timestamp)}${item.ip ? ` - ${item.ip}${item.ipCountry ? ` - ${item.ipCountry}` : ''}` : ''}`)
                            }
                        </Text>

                    </View>}

            </View>
        );
    };


    return (
        chatMessagesData.length > 0 ? (
            <>
                <FlatList
                    style={{ height: 100 }}
                    ref={flatListRef}
                    data={chatMessagesData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    initialNumToRender={10} // Adjust based on your average message size and performance
                    maxToRenderPerBatch={10}
                    windowSize={100}
                    onEndReachedThreshold={0.05}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMoreMessages}
                    inverted
                />
                {selectedImageIndex !== null && (
                    <ImagePreviewModal
                        isVisible={isPreviewVisible}
                        onClose={closePreview}
                        imageUrl={chatMessagesData[selectedImageIndex].file.url}
                    />
                )}
                <ReadByListModal userEmail={userEmail} handleReadByListModalClose={handleReadByListModalClose} />
            </>
        ) : null
    );
};


const ReservedStatusViewForHeader = () => {

    return (
        <View style={{
            zIndex: 999,
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFFFCC',
            padding: 10,
            borderRadius: 5,
            opacity: 0.7, // Set border color
        }}>
            <Text style={{ color: '#FF0000', fontSize: 16, fontWeight: 'bold', textAlign: 'center', }} selectable={false}>The vehicle is reserved to a customer</Text>
        </View>
    );
};

const CancelledViewForHeader = () => {

    return (
        <View style={{
            zIndex: 999,
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5,
            opacity: 0.7, // Set border color
        }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center', }} selectable={false}>Cancelled Transaction</Text>
        </View>
    );
};

export default function ChatMessages() {
    const navigate = useNavigate();
    const selectedChatData = useSelector(state => state.selectedChatData);
    const selectedVehicleData = useSelector(state => state.selectedVehicleData);
    const selectedCustomerData = useSelector(state => state.selectedCustomerData);
    const [email, setEmail] = useState('');
    const chatListData = useSelector((state) => state.chatListData);
    const activeChatId = useSelector((state) => state.activeChatId);
    const chatMessageBoxLoading = useSelector((state) => state.chatMessageBoxLoading);
    const chatListSearchText = useSelector((state) => state.chatListSearchText);
    const chatMessagesData = useSelector((state) => state.chatMessagesData);
    const loginName = useSelector((state) => state.loginName);

    const [name, setName] = useState(loginName);

    // const screenWidth = Dimensions.get('window').width;

    const [activeButton, setActiveButton] = useState('All messages');
    const [activeButtonValue, setActiveButtonValue] = useState(0);

    const [activeFilterButton, setActiveFilterButton] = useState('');
    const [unreadButtonValue, setUnreadButtonValue] = useState(false);
    const [readButtonValue, setReadButtonValue] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const dispatch = useDispatch();

    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);




    useEffect(() => {
        // globalImageUrl = '';
        // navigate(`/devadmin/chat-messages/#`);
        console.log(encryptDataAPI('rmj-marc'));

        const updateWidth = () => {
            const newWidth = Dimensions.get('window').width;
            setScreenWidth(newWidth); // Update the screenWidth state
        };

        // Add event listener for window resize
        Dimensions.addEventListener('change', updateWidth);

        // Clean up the event listener when the component unmounts or re-renders

        const fetchIpAndCountry = async () => {
            try {
                // dispatch(setChatMessageBoxLoading(true));
                // Fetch IP Address
                const ipResponse = await axios.get('https://api.ipify.org?format=json');
                const fetchedIp = ipResponse.data.ip;
                ip = fetchedIp;

                // Fetch IP Country
                if (fetchedIp) {
                    const countryResponse = await axios.get(`https://ipapi.co/${fetchedIp}/json/`);
                    const fetchedIpCountry = countryResponse.data.country_name;
                    ipCountry = fetchedIpCountry;
                    // dispatch(setChatMessageBoxLoading(false));
                }

            } catch (error) {
                console.error('Error fetching IP data:', error);
            }
        };
        const collectionRef = collection(projectExtensionFirestore, 'chats'); // Replace with your collection name
        const unrepliedQuery = query(
            collectionRef,
            where('read', '==', false),
            limit(10) // Limit the query to 10 documents
        );

        const unsubscribe = onSnapshot(unrepliedQuery, (querySnapshot) => {
            setUnreadCount(querySnapshot.size); // Update state with the new count
            fetchIpAndCountry();

        }, (error) => {
            console.error("Error fetching documents: ", error);
        });



        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => {
            Dimensions.removeEventListener('change', updateWidth);
            unsubscribe();
        };

    }, []);

    const handlePress = (buttonTitle, buttonTitleValue) => {
        if (activeButton == buttonTitle) {
        }
        else {
            setActiveButton(buttonTitle);
            setActiveButtonValue(buttonTitleValue);
            setActiveFilterButton('');
            setUnreadButtonValue(false);

            dispatch(setActiveChatId(''));

            dispatch(setLoadMoreLoading(false));
            dispatch(setNoMoreData(false));
        }
    };


    const handleUnreadPress = (buttonTitle) => {

        setActiveFilterButton(prevState => prevState === buttonTitle ? '' : buttonTitle);
        setUnreadButtonValue(prevState => !prevState);
        setReadButtonValue(false);
    };

    const handleReadPress = (buttonTitle) => {

        setActiveFilterButton(prevState => prevState === buttonTitle ? '' : buttonTitle);
        setReadButtonValue(prevState => !prevState);
        setUnreadButtonValue(false);

    };


    //Main fetch
    useEffect(() => {
        let queryRef;
        dispatch(setMessageTextInputValue(''));
        dispatch(setChatMessagesData([]));
        dispatch(setChatMessageBoxLoading(false));
        dispatch(setActiveChatId(''));

        // Helper function to build the query
        const buildQuery = () => {
            const searchValue = chatListSearchText.toUpperCase();

            if (unreadButtonValue) {
                if (activeButtonValue === 0) {
                    return searchValue === '' ?
                        query(collection(projectExtensionFirestore, 'chats'), where('read', '==', false), orderBy('lastMessageDate', 'desc'), limit(10)) :
                        query(collection(projectExtensionFirestore, 'chats'), where('read', '==', false), where('keywords', 'array-contains', searchValue), orderBy('lastMessageDate', 'desc'), limit(10));
                } else {
                    return searchValue === '' ?
                        query(collection(projectExtensionFirestore, 'chats'), where('read', '==', false), where('stepIndicator.value', '==', activeButtonValue), orderBy('lastMessageDate', 'desc'), limit(10)) :
                        query(collection(projectExtensionFirestore, 'chats'), where('stepIndicator.value', '==', activeButtonValue), where('read', '==', false), where('keywords', 'array-contains', searchValue), orderBy('lastMessageDate', 'desc'), limit(10));
                }
            }
            else if (readButtonValue) {
                if (activeButtonValue === 0) {
                    return searchValue === '' ?
                        query(collection(projectExtensionFirestore, 'chats'), where('read', '==', true), orderBy('lastMessageDate', 'desc'), limit(10)) :
                        query(collection(projectExtensionFirestore, 'chats'), where('read', '==', true), where('keywords', 'array-contains', searchValue), orderBy('lastMessageDate', 'desc'), limit(10));
                } else {
                    return searchValue === '' ?
                        query(collection(projectExtensionFirestore, 'chats'), where('read', '==', true), where('stepIndicator.value', '==', activeButtonValue), orderBy('lastMessageDate', 'desc'), limit(10)) :
                        query(collection(projectExtensionFirestore, 'chats'), where('stepIndicator.value', '==', activeButtonValue), where('read', '==', true), where('keywords', 'array-contains', searchValue), orderBy('lastMessageDate', 'desc'), limit(10));
                }
            }
            else {
                if (activeButtonValue === 0) {
                    return searchValue === '' ?
                        query(collection(projectExtensionFirestore, 'chats'), orderBy('lastMessageDate', 'desc'), limit(10)) :
                        query(collection(projectExtensionFirestore, 'chats'), where('keywords', 'array-contains', searchValue), orderBy('lastMessageDate', 'desc'), limit(10));
                } else {
                    return searchValue === '' ?
                        query(collection(projectExtensionFirestore, 'chats'), where('stepIndicator.value', '==', activeButtonValue), orderBy('lastMessageDate', 'desc'), limit(10)) :
                        query(collection(projectExtensionFirestore, 'chats'), where('stepIndicator.value', '==', activeButtonValue), where('keywords', 'array-contains', searchValue), orderBy('lastMessageDate', 'desc'), limit(10));
                }
            }
        };

        // Build and execute the query
        queryRef = buildQuery();

        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            const chatsData = [];
            snapshot.forEach((doc) => {
                chatsData.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            dispatch(setChatListData(chatsData));
            globalLastVisible = snapshot.docs[snapshot.docs.length - 1];
            dispatch(setNoMoreData(false));
            dispatch(setLoadMoreLoading(false));
            dispatch(setLoadingModalVisible(false));

        }, (error) => {
            console.error('Error fetching data from Firebase:', error);
        });

        // Cleanup function
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [unreadButtonValue, readButtonValue, activeButtonValue, chatListSearchText]);


    useEffect(() => {
        const unsubscribe = projectControlAuth.onAuthStateChanged(user => {
            if (!user) {
                navigate("/login")
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
                        navigate("/login")
                    })
                    .catch((error) => {
                        console.error('Error signing out:', error);
                    });
            }
        } else {
            signOut(projectControlAuth)
                .then(() => {
                    navigate("/login")
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


    const listenForNameChange = (documentId) => {


        // To stop listening for updates, you can call unsubscribe()
        // unsubscribe();
    };

    const getFieldValueByEmail = async (email) => {
        try {
            const accountDocRef = doc(firestore, 'accounts', email);
            const accountDocSnapshot = await getDoc(accountDocRef);

            onSnapshot(accountDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const fieldType = data.type;
                    const fieldName = data.name;
                    dispatch(setLoginName(fieldName));

                } else {
                    // Handle the case where the document does not exist
                }
            });
        } catch (error) {
            console.error('Error fetching field value:', error);
        }
    };


    const handleSignOut = () => {
        // Check if currentUser exists before signing out
        if (projectControlAuth.currentUser) {
            signOut(projectControlAuth).then(() => {
                navigate("/login")
                setEmail('');
                setName('');
            }).catch(() => {
                // Handle any sign out errors here
            });
        } else {
            // Handle the case where there is no user currently signed in
            console.log('No user signed in to sign out');
            // Optionally navigate to the login screen or show a message
            navigate("/login")
        }
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

    const slideAnim = useRef(new Animated.Value(screenWidth)).current;
    const isVisible = chatMessagesData.length > 0;

    useEffect(() => {
        if (isVisible) {
            // Delayed slide in from right to left with smooth easing
            Animated.timing(slideAnim, {
                toValue: 0, // Final position on the screen
                duration: 300, // Slightly longer duration for smoother effect
                useNativeDriver: true, // Use native driver for better performance
                easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Smooth and natural easing curve
                delay: 100, // Start with a slight delay for a smoother transition
            }).start();
        } else {
            // Delayed slide out to the right with smooth easing when not visible
            Animated.timing(slideAnim, {
                toValue: screenWidth,
                duration: 300, // Slightly longer duration for smoother effect
                useNativeDriver: true,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Smooth and natural easing curve
                delay: 100, // Start with a slight delay for a smoother transition
            }).start();
        }
    }, [isVisible, screenWidth, slideAnim]);

    const handlePressBack = () => {
        dispatch(setMessageTextInputValue(''));
        dispatch(setChatMessagesData([]));
        dispatch(setActiveChatId(''));
        navigate(`/top/chat-messages`);
    }

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
            <NativeBaseProvider>
                <View style={{ backgroundColor: "white", height: '100%', width: '100%', flexDirection: 'column', maxHeight: '100vh', overflow: 'hidden', }} >
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
                            selectedScreen={selectedScreen} />

                        <Box w={screenWidth <= 960 ? 0 : 850} h={[10, 10, 10, 10]} marginBottom={1.5} marginTop={1.5} paddingLeft={5}>

                            <FastImage
                                source={{
                                    uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FC-HUB%20LOGO%20FULL.png?alt=media&token=79ed34a5-f960-4154-b4e8-897b0f3248d4',
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.stretch}
                                style={styles.image} />
                        </Box>

                        {/* {screenWidth <= 960 && <MobileViewDrawer
                            selectedScreen={selectedScreen} />} */}


                        <Box w={screenWidth <= 960 ? 120 : 0} h={screenWidth <= 960 ? 6 : 10} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]}>

                            {/* <FastImage
                                source={{
                                    uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FC-HUB%20LOGO%20HALF.png?alt=media&token=7ce6aef2-0527-40c7-b1ce-e47079e144df',
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.stretch}
                                style={styles.image} /> */}
                        </Box>
                        <NamePopover name={loginName} handleSignOut={handleSignOut} />


                    </Box>

                    {/* Content */}
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {/* Sidebar */}
                        {/* <SideDrawer
                            selectedScreen={selectedScreen} /> */}

                        {/* Main Content */}
                        {/* <Box flex={1} flexGrow={1} minHeight={0}> */}
                        {/* Main Content Content */}

                        {/* <Box px="3" bgColor="#A6BCFE" height="full" > */}
                        <View style={{ flex: 1, backgroundColor: "white", height: '100%' }}>
                            <View style={{ flex: 1, height: '100%' }}>

                                <View style={{
                                    display: screenWidth < mobileViewBreakpoint && activeChatId !== '' ? 'none' : 'flex',
                                    borderBottomWidth: 1,
                                    borderColor: '#f5f5f5',
                                    width: '100%',
                                    backgroundColor: 'white',
                                    height: 60,
                                }}>
                                    {/* Chat Header */}
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                        }}>
                                            <ScrollView scrollEnabled horizontal>

                                                <HeaderButton
                                                    key={'All messages'}
                                                    title={'All messages'}
                                                    onPress={() => handlePress('All messages', 0)}
                                                    isActive={activeButton === 'All messages'}
                                                    headerCount={
                                                        unreadCount > 0 ?
                                                            (<View style={{
                                                                backgroundColor: '#FF0000',
                                                                borderRadius: 100, // Half of width and height
                                                                width: 20,
                                                                height: 20, // Same as width for a perfect circle
                                                                marginLeft: 10,
                                                                justifyContent: 'center', // Center children vertically
                                                                alignItems: 'center', // Center children horizontally
                                                            }}>
                                                                <Text style={{
                                                                    color: 'white',
                                                                    fontWeight: 700,
                                                                    fontSize: 14,
                                                                }}>{unreadCount > 9 ? `9+` : unreadCount}</Text>
                                                            </View>) : (<></>)}
                                                />

                                                <HeaderButton
                                                    key={'Negotiation'}
                                                    title={'Negotiation'}
                                                    onPress={() => handlePress('Negotiation', 1)}
                                                    isActive={activeButton === 'Negotiation'}
                                                />

                                                <HeaderButton
                                                    key={'Issued Proforma Invoice'}
                                                    title={'Issued Proforma Invoice'}
                                                    onPress={() => handlePress('Issued Proforma Invoice', 2)}
                                                    isActive={activeButton === 'Issued Proforma Invoice'}
                                                />

                                                <HeaderButton
                                                    key={'Order Item'}
                                                    title={'Order Item'}
                                                    onPress={() => handlePress('Order Item', 3)}
                                                    isActive={activeButton === 'Order Item'}
                                                />

                                                <HeaderButton
                                                    key={'Payment Confirmed'}
                                                    title={'Payment Confirmed'}
                                                    onPress={() => handlePress('Payment Confirmed', 4)}
                                                    isActive={activeButton === 'Payment Confirmed'}
                                                />

                                                <HeaderButton
                                                    key={'Shipping Schedule'}
                                                    title={'Shipping Schedule'}
                                                    onPress={() => handlePress('Shipping Schedule', 5)}
                                                    isActive={activeButton === 'Shipping Schedule'}
                                                />

                                                <HeaderButton
                                                    key={'Documents'}
                                                    title={'Documents'}
                                                    onPress={() => handlePress('Documents', 6)}
                                                    isActive={activeButton === 'Documents'}
                                                />

                                                <HeaderButton
                                                    key={'Vehicle Received'}
                                                    title={'Vehicle Received'}
                                                    onPress={() => handlePress('Vehicle Received', 7)}
                                                    isActive={activeButton === 'Vehicle Received'}
                                                />
                                            </ScrollView>
                                        </View>

                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', height: '100%', }}>
                                    {/* Chat Body */}

                                    <View style={{ flex: screenWidth > mobileViewBreakpoint ? '' : 1, display: screenWidth < mobileViewBreakpoint && activeChatId !== '' ? 'none' : 'flex', }}>

                                        <View style={{ flex: 1, maxWidth: screenWidth > mobileViewBreakpoint ? 380 : '100%', minWidth: screenWidth > mobileViewBreakpoint ? 380 : '100%', borderRightWidth: 0, borderColor: '#DADDE1', maxHeight: 100, minHeight: 100, backgroundColor: 'white', }}>
                                            {/* Chat Search */}
                                            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                                <SearchChat lastVisible={lastVisible} setLastVisible={setLastVisible} unreadButtonValue={unreadButtonValue} activeButtonValue={activeButtonValue} />
                                                {/* <Pressable
                                                variant="ghost"
                                                style={{
                                                    padding: 3,
                                                    width: 100,
                                                    flexDirection: 'row', // Align items in a row
                                                    alignItems: 'center', // Center items vertically
                                                    borderRadius: 5,
                                                }}
                                                backgroundColor='#ECEDF0'
                                                _hover={{ backgroundColor: '#d7d7d9' }}
                                            >
                                                <MaterialIcons name="mark-email-unread" color="#1C2B33" size={20} />
                                                <Text style={{ color: '#1C2B33', marginLeft: 5 }}>Unreplied</Text>
                                            </Pressable> */}
                                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                                    <FilterButton
                                                        key={'Unread'}
                                                        title={'Unread '}
                                                        onPress={() => handleUnreadPress('Unread')}
                                                        isActive={activeFilterButton === 'Unread'}
                                                        iconActive={<MaterialIcons name="mark-email-unread" color="#0A78BE" size={16} />}
                                                        iconNotActive={<MaterialIcons name="mark-email-unread" color="#1C2B33" size={16} />}
                                                    />

                                                    <FilterButton
                                                        key={'Read'}
                                                        title={'Read '}
                                                        onPress={() => handleReadPress('Read')}
                                                        isActive={activeFilterButton === 'Read'}
                                                        iconActive={<MaterialIcons name="mark-email-read" color="#0A78BE" size={16} />}
                                                        iconNotActive={<MaterialIcons name="mark-email-read" color="#1C2B33" size={16} />}
                                                    />

                                                </View>

                                            </View>
                                        </View>

                                        <View style={{ flex: 1, maxWidth: screenWidth > mobileViewBreakpoint ? 380 : '100%', minWidth: screenWidth > mobileViewBreakpoint ? 380 : '100%', borderRightWidth: 0, borderColor: '#DADDE1', backgroundColor: 'white', }}>
                                            {/* Chat List */}
                                            <ChatList unreadButtonValue={unreadButtonValue} activeButtonValue={activeButtonValue} />
                                        </View>

                                    </View>

                                    {screenWidth > mobileViewBreakpoint && (chatMessageBoxLoading ? (
                                        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: '100%', }}>
                                            <Spinner
                                                animating
                                                size="lg"
                                                color={'#7B9CFF'}
                                            />
                                        </View>) : (
                                        <View style={{ flex: 1, }}>

                                            <View style={{ flex: 1, minHeight: 90, maxHeight: screenWidth < 1281 ? 130 : 125, borderBottomWidth: 0, borderColor: '#DADDE1', backgroundColor: 'white', justifyContent: 'center', flexDirection: 'row', }}>
                                                {/* Chat Message Header */}

                                                <ScrollView scrollEnabled horizontal>
                                                    {chatMessagesData.length < 1 ? null : (<ChatMessageHeader />)}
                                                </ScrollView>

                                            </View>

                                            <View style={{ flex: 1, borderColor: '#DADDE1', backgroundColor: chatMessagesData.length < 1 ? 'white' : '#e5ebfe', paddingBottom: 10, }}>

                                                <View style={{ flex: 1, }}>

                                                    {(selectedChatData && chatMessagesData.length > 0 && selectedCustomerData && selectedVehicleData) &&
                                                        (selectedChatData && chatMessagesData.length > 0 && selectedVehicleData.stockStatus == 'Reserved' &&
                                                            (selectedVehicleData.reservedTo !== selectedCustomerData.textEmail))
                                                        ? <ReservedStatusViewForHeader /> :
                                                        (selectedChatData.isCancelled && chatMessagesData.length > 0 && <CancelledViewForHeader />)
                                                    }

                                                    {/* Chat Message Box */}
                                                    <ChatMessageBox activeButtonValue={activeButtonValue} userEmail={email} />
                                                    <DocumentPreviewModal />
                                                </View>

                                                <View style={{ maxHeight: 180, justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    {/* Chat Input Text */}
                                                    {chatMessagesData.length < 1 ? null : (<ChatInputText />)}
                                                </View>

                                            </View>

                                        </View>
                                    ))}

                                    {screenWidth < mobileViewBreakpoint && activeChatId !== '' && (chatMessageBoxLoading ? (

                                        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', }}>
                                            <Spinner
                                                animating
                                                size="lg"
                                                color={'#7B9CFF'}
                                            />
                                        </View>) : (

                                        <Animated.View
                                            style={{
                                                backgroundColor: '#E5EBFE',
                                                height: '100%',
                                                flex: 1,
                                                transform: [{ translateX: slideAnim }]
                                            }}

                                        >

                                            <View style={{ flex: 1 }}>
                                                <View style={{ flex: 1, minHeight: 90, maxHeight: screenWidth < 1281 ? 130 : 125, borderBottomWidth: 0, borderColor: '#DADDE1', backgroundColor: 'white', justifyContent: 'center', flexDirection: 'row', }}>
                                                    {/* Chat Message Header */}
                                                    {(screenWidth < mobileViewBreakpoint && chatMessagesData.length > 0) &&
                                                        <Pressable onPress={handlePressBack} style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                            <Ionicons name="chevron-back" size={40} color='black' />
                                                        </Pressable>
                                                    }

                                                    <ScrollView scrollEnabled horizontal>
                                                        {chatMessagesData.length < 1 ? null : (<ChatMessageHeader />)}
                                                    </ScrollView>
                                                </View>

                                                <View style={{ flex: 1, borderColor: '#DADDE1', backgroundColor: chatMessagesData.length < 1 ? 'white' : '#e5ebfe', paddingBottom: 10, }}>
                                                    <View style={{ flex: 1, }}>
                                                        {(chatMessagesData.length > 0 && selectedVehicleData.stockStatus == 'Reserved' &&
                                                            selectedVehicleData.reservedTo !== selectedCustomerData.textEmail)
                                                            ? <ReservedStatusViewForHeader /> :
                                                            (selectedChatData.isCancelled && chatMessagesData.length > 0 && <CancelledViewForHeader />)
                                                        }
                                                        {/* Chat Message Box */}
                                                        <ChatMessageBox activeButtonValue={activeButtonValue} userEmail={email} />
                                                        <DocumentPreviewModal />
                                                    </View>
                                                </View>
                                            </View>

                                            {/* Absolute Positioned Chat Input Text at the Bottom */}
                                            <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                                                {chatMessagesData.length < 1 ? null : (<ChatInputText />)}
                                            </View>

                                        </Animated.View>
                                    ))}
                                </View>
                            </View>
                            {/* <SuccessModal /> */}
                        </View>
                    </View>
                </View>
                <LoadingModal />
            </NativeBaseProvider>


        </>

    );
}