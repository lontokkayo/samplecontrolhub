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
    useToast,
    Tooltip,
    Progress
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
    Image as RNImage,
    Pressable,
    Linking,
    Modal as RNModal,
    Platform,
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
} from './redux/store';
// import { TextInput } from 'react-native-gesture-handler';
import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';
import StickyHeader from './Header/StickyHeader';
import { UsePagination } from './VehicleListComponent/UsePagination';
import Hyperlink from 'react-native-hyperlink';
import { HmacSHA256, enc } from 'crypto-js';
import { CRYPTO_KEY } from '@env';
import { captureRef } from 'react-native-view-shot';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'react-native-qrcode-svg';

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

let userEmail = projectControlAuth.currentUser.email;

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
                <Text style={{ color: 'white' }}>Loading, please wait!</Text>
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
        textInputRef.current.value = item.value;
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
                initialFocusRef={searchInputRef}
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
                <Popover.Content w={400} marginRight={10} >
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

const ChatInputText = () => {
    const selectedChatData = useSelector((state) => state.selectedChatData);

    const [isSendHovered, setIsSendHovered] = useState(false);


    const textInputRef = useRef(null);



    const addMessage = async () => {

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

        const inputValue = textInputRef.current?.value;

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

            } catch (e) {
                console.error('Error adding document: ', e);
            }
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
                addMessage();
            }
        }
    };

    return (

        <View style={{ width: '98%', flexDirection: 'row', borderWidth: 1, borderColor: '#D9D9D9', borderRadius: 10, }}>
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

            <TextInput
                ref={textInputRef}
                multiline
                placeholder='Send a message...'
                placeholderTextColor={'#9B9E9F'}
                onKeyPress={handleKeyPress}
                style={{ outlineStyle: 'none', width: '100%', height: 80, alignSelf: 'center', padding: 10 }}
            />

            <Pressable
                focusable={false}
                onPress={addMessage}
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
                <MaterialIcons name="send" size={24} color="#95BCF9" />
            </Pressable>

            <MessageTemplate textInputRef={textInputRef} />
        </View>

    );
}

const ChatListItem = ({ item, onPress, isActive, messageUnread, formattedDate, chatListData }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [chatListStepImageUrl, setChatListStepImageUrl] = useState(null);
    const [textFirst, setTextFirst] = useState('');
    const [textLast, setTextLast] = useState('');
    const dispatch = useDispatch();
    const [isUnreadHovered, setIsUnreadHovered] = useState(false);
    const [isUnreadVisible, setIsUnreadVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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
                dispatch(setSelectedCustomerData(data));
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

        globalCustomerFirstName = textFirst ? textFirst : '';
        globalCustomerLastName = textLast ? textLast : '';
        globalImageUrl = imageUrl ? imageUrl : '';
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
                <View style={{ width: '20%', justifyContent: 'center', }}>
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
                </View>



            </Pressable>
        );
    }


};

const ChatsList = ({ unreadButtonValue, activeButtonValue, }) => {

    const chatListData = useSelector((state) => state.chatListData);
    const chatListLastVisible = useSelector((state) => state.chatListLastVisible);
    const activeChatId = useSelector((state) => state.activeChatId);
    const loadMoreLoading = useSelector((state) => state.loadMoreLoading);
    const noMoreData = useSelector((state) => state.noMoreData);
    const renderFooterRef = useRef(null);
    const dispatch = useDispatch();

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

        const unsubscribe = fetchChatMessages();

        return () => {
            if (unsubscribe) {
                unsubscribe(); // Unsubscribe when the component unmounts
            }
        };

    }, [activeChatId]);

    const handleChatPress = async (customerId, chatId) => {
        dispatch(setActiveChatId(chatId));
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

                    console.log(bankAccounts);
                    setBankAccountsData(bankAccounts);
                    globalInvoiceVariable.bankInformations.bankAccount = bankAccounts["SUMITOMO MITSUI BANKING CORPORATION"];
                    // Use state or context to store selected bank data if needed
                    // setSelectedBank(bankAccounts["SUMITOMO MITSUI BANKING CORPORATION"]);
                    console.log(bankAccounts["SUMITOMO MITSUI BANKING CORPORATION"]);
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
                <Pressable style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
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
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '20%', fontWeight: 700, margin: 3, }}>Due Date:</Text>
                <ModalCalendar currentDate={currentDate} selectedDate={selectedDueDate} setSelectedDate={setSelectedDueDate} />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, marginVertical: 10, }}>
                <Text style={{ width: '20%', fontWeight: 700, margin: 3, }}>Bank Account: </Text>
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
                    width={300}
                    style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1, }}
                >
                    {Object.keys(bankAccountsData).map((bankName) => (
                        <Select.Item key={bankName} label={bankName} value={bankName} />
                    ))}
                </Select>

                <ModalAddBank />

            </View>

            <View style={{ flex: 3, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '20%', fontWeight: 700, margin: 3, }}>Payment Terms:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.bankInformations.paymentTerms = value;
                }} ref={paymentTermsRef} multiline defaultValue={invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.paymentTerms ? invoiceData.bankInformations.paymentTerms : "Full payment via Telegraphic Transfer (T/T) required before the due date."} placeholderTextColor='#9B9E9F' placeholder='Email'
                    style={{ width: '60%', height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>

            {/* <View style={{ flex: 4, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '20%', fontWeight: 700, margin: 3, }}>Sales Agreement:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.bankInformations.salesAgreement = value;
                }} ref={salesAgreementRef} multiline defaultValue={invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.bankInformations.salesAgreement ? invoiceData.bankInformations.salesAgreement : `Payment Information:
The customer is responsible for the bank charges incurred when the T/T (Telegraphic Transfer) is paid.
No warranty service is provided on used vehicles.

Conditions for order cancellation:
(1) Order Cancellation Penalty: If the order is canceled after payment, a penalty of USD 220 will apply.
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
    const [selectedIncoterms, setSelectedIncoterms] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.paymentDetails.incoterms :
        selectedChatData.insurance ? 'CIF' : 'C&F');

    const [inspectionIsChecked, setInspectionIsChecked] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.paymentDetails.inspectionIsChecked : selectedChatData.inspection);
    const [inspectionName, setInspectionName] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.paymentDetails.inspectionName : selectedChatData.inspectionName);

    const [warrantyIsChecked, setWarrantyIsChecked] = useState(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.paymentDetails.warrantyIsCheck : selectedChatData.warranty);

    const warrantyPrice = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.paymentDetails.warrantyPrice ? invoiceData.paymentDetails.warrantyPrice : 150;
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

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Incoterms:</Text>
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
                    style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1, }}
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

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, marginTop: 10, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Inspection:</Text>
                <Checkbox
                    isChecked={inspectionIsChecked}
                    onChange={value => setInspectionIsChecked(value)}
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

            <View style={{ flex: 1, flexDirection: 'row', margin: 2 }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3 }}>FOB Price:</Text>
                <Text style={{ fontWeight: 700, margin: 1, paddingTop: 1 }}>$</Text>
                <TextInput
                    onChangeText={handleFobPriceInputChangeText}
                    ref={fobPriceInput}
                    defaultValue={invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.paymentDetails.fobPrice : selectedIncoterms == 'FOB' ? 0 : fobPriceDollars}
                    placeholderTextColor='#9B9E9F'
                    placeholder='FOB Price'
                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', margin: 2 }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3 }}>Freight:</Text>
                <Text style={{ fontWeight: 700, margin: 1, paddingTop: 1 }}>$</Text>
                <TextInput
                    onChangeText={handleFreightInputChangeText}
                    ref={freightInput}
                    defaultValue={freightCalculation}
                    placeholderTextColor='#9B9E9F'
                    placeholder='Freight'
                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, display: selectedIncoterms == 'CIF' ? 'flex' : 'none' }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Insurance:</Text>
                <Text style={{ fontWeight: 700, margin: 1, paddingTop: 1, }}>$</Text>
                <TextInput
                    onChangeText={handleInsuranceInputChangeText}
                    ref={insuranceInput}
                    defaultValue={50}
                    placeholderTextColor='#9B9E9F'
                    placeholder={`Insurance`}
                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, display: inspectionIsChecked ? 'flex' : 'none' }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Inspection:</Text>
                <Text style={{ fontWeight: 700, margin: 1, paddingTop: 1, }}>$</Text>
                <TextInput
                    onChangeText={handleInspectionInputChangeText}
                    ref={inspectionInput}
                    placeholderTextColor='#9B9E9F'
                    placeholder={`Inspection [${selectedChatData.inspectionName}]`}
                    style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                />
                <Text style={{ fontWeight: 700, margin: 3, color: '#16A34A', }}>{`[${selectedChatData.inspectionName}]`}</Text>
            </View>


            <View style={{ flex: 3, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Additional:</Text>
                <TextInput ref={additionalNameRef} onChangeText={handleAdditionalNameTextChange} multiline placeholderTextColor='#9B9E9F' placeholder='Name'
                    style={{ width: '60%', height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                <TextInput ref={additionalPriceRef} onChangeText={handleAdditionalPriceTextChange} multiline placeholderTextColor='#9B9E9F' placeholder='Price'
                    style={{ width: '60%', height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
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
        console.log(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.discharge.port : selectedChatData.port);

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


        // const fetchCountries = async () => {
        //     const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');

        //     try {
        //         const docSnap = await getDoc(docRef);

        //         if (docSnap.exists()) {
        //             const data = docSnap.data();
        //             const sortedCountries = Object.keys(data)
        //                 .map(countryName => ({
        //                     name: countryName.replace(/_/g, '.'), // Replace '_' with '.'
        //                     ...data[countryName]
        //                 }))
        //                 .sort((a, b) => a.sortOrder - b.sortOrder);
        //             setCountriesDischarge(sortedCountries);
        //         } else {
        //             console.log('No such document!');
        //         }
        //     } catch (error) {
        //         console.error('Error fetching document:', error);
        //     }
        // };

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
        console.log(invoiceData && Object.keys(invoiceData).length > 0 ? invoiceData.departurePort : (selectedChatData.carData && selectedChatData.carData.port ? selectedChatData.carData.port : ''));

        globalInvoiceVariable.departurePort = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.departurePort ? invoiceData.departurePort : (selectedChatData.carData && selectedChatData.carData.port ? selectedChatData.carData.port : '');
        globalInvoiceVariable.departureCountry = invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.departureCountry ? invoiceData.departureCountry : 'Japan';

    }, []);

    return (
        <>
            <Select
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
                style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1 }}>
                <Select.Item key={'Japan'} label={'Japan'} value={'Japan'} />
            </Select>

            <Select
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
                style={{ marginLeft: 10, marginRight: 10, paddingLeft: 1 }}>
                {portData.map((item) => (
                    <Select.Item key={item.id} label={item.name} value={item.name} />
                ))}
            </Select>
        </>
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
                        globalInvoiceVariable.consignee.sameAsBuyer = value;
                    }}
                    style={{ margin: 2, borderColor: '#0A9FDC' }}
                    size="sm"
                    _text={{ fontWeight: 700 }}
                >
                    Same as consignee
                </Checkbox>
            </View>

            <View style={{ display: isChecked ? 'none' : 'flex', }}>
                <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                    <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Name:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.name = value;
                    }}
                        ref={notifyPartyName} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Name'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                    <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Address:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.address = value;
                    }} ref={notifyPartyAddress} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Address'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                    <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>City:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.city = value;
                    }} ref={notifyPartyCity} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='City'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                    <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Country:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.country = value;
                    }} ref={notifyPartyCountry} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Country'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ flex: 3, flexDirection: 'row', margin: 2, }}>
                    <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Contact Number:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.contactNumber = value;
                    }} ref={notifyPartyContactNumber} disabled={isChecked} multiline placeholderTextColor='#9B9E9F' placeholder='Contact Number'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                    <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>FAX:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.fax = value;
                    }} ref={notifyPartyFax} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='FAX'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                    <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Email:</Text>
                    <TextInput onChangeText={(value) => {
                        globalInvoiceVariable.notifyParty.email = value;
                    }} ref={notifyPartyEmail} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Email'
                        style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
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
            <View style={{ flex: 1, flexDirection: 'row', margin: 5, }}>
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
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Name:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.name = value;
                }} ref={consigneeName} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Name'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Address:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.address = value;
                }} ref={consigneeAddress} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Address'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>City:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.city = value;
                }} ref={consigneeCity} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='City'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Country:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.country = value;
                }} ref={consigneeCountry} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Country'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ flex: 3, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Contact Number:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.contactNumber = value;
                }} ref={consigneeContactNumber} disabled={isChecked} multiline placeholderTextColor='#9B9E9F' placeholder='Contact Number'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 75, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>FAX:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.fax = value;
                }} ref={consigneeFax} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='FAX'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ width: '15%', fontWeight: 700, margin: 3, }}>Email:</Text>
                <TextInput onChangeText={(value) => {
                    globalInvoiceVariable.consignee.email = value;
                }} ref={consigneeEmail} disabled={isChecked} placeholderTextColor='#9B9E9F' placeholder='Email'
                    style={{ backgroundColor: isChecked ? '#F1F1F1' : 'default', width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }} />
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

        console.log(selectedChatData.payments);
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

    const PaymentHistoryModal = ({ historyModalVisible, handleHistoryModalClose, payments }) => {
        // Create a copy of payments and sort it by date in descending order
        const sortedPayments = [...payments].sort((a, b) => {
            const dateA = a.date;
            const dateB = b.date;
            return dateB - dateA; // Sorts in descending order
        });

        console.log(sortedPayments);

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
                                        <View key={index} style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Date: </Text>
                                                {/* Use the reversed index for displaying the date */}
                                                <Text style={{ color: '#FF0000' }}>{sortedPayments[sortedPayments.length - 1 - index].date}</Text>
                                            </Text>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Value: </Text>
                                                {/* Use the reversed index for displaying the value */}
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

                <Progress w="300" shadow={2} value={Number(totalValue)} max={totalAmountNumber} _filledTrack={{
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

                await updateDoc(updateDocRef, {
                    ...globalInvoiceVariable,
                    carData: selectedChatData.carData,
                });

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

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>CFS:</Text>
                <TextInput
                    defaultValue={invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.cfs ? invoiceData.cfs : ''}
                    ref={cfsInputRef} placeholderTextColor='#9B9E9F' placeholder='Input CFS (Optional)'
                    style={{ height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    onChangeText={(value) => globalInvoiceVariable.cfs = value} />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Place of Delivery:</Text>
                <TextInput
                    defaultValue={invoiceData && Object.keys(invoiceData).length > 0 && invoiceData.placeOfDelivery ? invoiceData.placeOfDelivery : ''}
                    ref={placeOfDeliveryInputRef} placeholderTextColor='#9B9E9F' placeholder='Place of Delivery (Optional)'
                    style={{ height: 25, width: 200, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
                    onChangeText={(value) => globalInvoiceVariable.placeOfDelivery = value} />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                <Text style={{ fontWeight: 700, margin: 3 }}>Port of Departure:</Text>
                <SelectPortOfDeparture />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', margin: 5, }}>
                <Text style={{ fontWeight: 700, margin: 3, }}>Sales Person:</Text>
                <SelectSalesPerson />
            </View>

            <View style={{ width: '100%', borderBottomWidth: 2, borderColor: '#0A9FDC', alignSelf: 'center', margin: 5, }} />

            <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
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
    const [invoiceImageUri, setInvoiceImageUri] = useState('');
    const hoverPreviewIn = () => setIsPreviewHovered(true);
    const hoverPreviewOut = () => setIsPreviewHovered(false);
    const [capturedImageUri, setCapturedImageUri] = useState('');
    const [vehicleImageUri, setVehicleImageUri] = useState(globalImageUrl);
    const [featuresTrueCount, setFeaturesTrueCount] = useState(0);
    const [rerenderState, setRerenderState] = useState(0);

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
                    setCapturedImageUri(`data:image/jpeg;base64,${imageUri}`);
                    const trueCount = countTrueValuesInCarData(invoiceData);
                    setFeaturesTrueCount(trueCount);
                }
            } catch (error) {
                console.error("Error capturing view:", error);
            }
        };

        const convertImageToBase64 = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error('Fetch error:', error.message);
                return null;
            }
        };
        convertImageToBase64(globalImageUrl)
            .then(base64String => {
                setVehicleImageUri(base64String);
            });
        // Trigger image capture when invoiceRef changes
        captureImageAsync();

        if (screenWidth < 960) {
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
                        setCapturedImageUri(`data:image/jpeg;base64,${imageUri}`);
                        const trueCount = countTrueValuesInCarData(invoiceData);
                        setFeaturesTrueCount(trueCount);
                    }
                } catch (error) {
                    console.error("Error capturing view:", error);
                }
            };

            const convertImageToBase64 = async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const blob = await response.blob();
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                } catch (error) {
                    console.error('Fetch error:', error.message);
                    return null;
                }
            };
            convertImageToBase64(globalImageUrl)
                .then(base64String => {
                    setVehicleImageUri(base64String);
                });
            // Trigger image capture when invoiceRef changes
            captureImageAsync();
        }

    }, [invoiceRef.current, vehicleImageUri]);

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

    const newWidth = 2480;
    const newHeight = 3508;

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



    return (
        <> {invoiceData && Object.keys(invoiceData).length > 0 &&

            <>
                <Pressable
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

                </Pressable>

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
                            capturedImageUri && vehicleImageUri ? handleCaptureAndCreatePDF() : null;
                        }}
                            style={{ justifyContent: 'center', flexDirection: 'row', padding: 5, borderRadius: 5, backgroundColor: '#16A34A', }}>
                            <MaterialCommunityIcons size={20} name='download' color='white' />
                            <Text style={{ color: 'white', }}>Download as PDF</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                capturedImageUri && vehicleImageUri ? openImage() : null;
                            }}
                            style={{ position: 'absolute', top: -2, right: -380, flexDirection: 'row', padding: 5, borderRadius: 5, backgroundColor: '#0A8DD5', }}>
                            <Entypo size={20} name='images' color='white' />
                            <Text style={{ color: 'white', }}>View Image</Text>
                        </Pressable>
                    </View>
                    <Modal.CloseButton />
                    {previewInvoiceVisible &&
                        <ScrollView
                            style={{ maxHeight: screenWidth < 960 ? 480 : 720, maxWidth: screenWidth < 960 ? 320 : 900 }}
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
                                {capturedImageUri && vehicleImageUri ? (
                                    <NativeImage
                                        source={{ uri: capturedImageUri }}
                                        style={{
                                            marginTop: 5,
                                            width: screenWidth < 960 ? 320 : 595,
                                            height: screenWidth < 960 ? 480 : 842,
                                            resizeMode: 'stretch',
                                            borderWidth: 1,
                                            borderColor: '#DADDE1',
                                        }}
                                    />
                                ) : (<Spinner size={'lg'} color={'#0A9FDC'} style={{ alignSelf: 'center', paddingTop: 80 * heightScaleFactor, }} />)}
                            </View>

                            {/* Main content with invoice details */}
                            {vehicleImageUri !== '' &&
                                <View ref={invoiceRef} style={{ width: 2480, height: 3508, backgroundColor: 'white', zIndex: 1 }}>

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
                                            <QRCode
                                                value={invoiceData.cryptoNumber}
                                                size={80 * widthScaleFactor}
                                                color="black"
                                                backgroundColor="white"
                                            />
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

                                    <View style={{ position: 'absolute', left: 40 * widthScaleFactor, top: 134 * heightScaleFactor, maxWidth: 220 * widthScaleFactor, }}>
                                        {/* Shipper */}
                                        <Text style={{
                                            fontWeight: 750,
                                            fontSize: 14 * widthScaleFactor,
                                            borderBottomWidth: 3, // Adjust the thickness of the underline
                                            width: 'fit-content', // Make the underline cover the text width
                                            marginBottom: 5, // Add some space between text and underline
                                        }}>
                                            {`Shipper`}
                                        </Text>
                                        <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`Real Motor Japan`}</Text>
                                        <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`(YANAGISAWA HD CO.,LTD)`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`26-2 Takara Tsutsumi-cho Toyota City, Aichi Prefecture, Japan, 473-0932`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: +81565850606`}</Text>

                                        <Text style={{ fontWeight: 700, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Shipped From:`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.departurePort}, ${invoiceData.departureCountry}`}</Text>

                                        <Text style={{ fontWeight: 700, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Shipped To:`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.discharge.port}, ${invoiceData.discharge.country}`}</Text>
                                        {invoiceData.placeOfDelivery && invoiceData.placeOfDelivery !== '' ?
                                            <>
                                                <Text style={{ fontWeight: 700, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`Place of Delivery:`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.placeOfDelivery}`}</Text>
                                            </>
                                            : null}
                                        {invoiceData.cfs && invoiceData.cfs !== '' ?
                                            <>
                                                <Text style={{ fontWeight: 700, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`CFS:`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.cfs}`}</Text>
                                            </>
                                            : null}

                                        {/* Buyer Information */}
                                        <Text style={{
                                            fontWeight: 750,
                                            fontSize: 14 * widthScaleFactor,
                                            borderBottomWidth: 3, // Adjust the thickness of the underline
                                            borderBottomColor: '#0A78BE',
                                            width: 'fit-content', // Make the underline cover the text width
                                            marginBottom: 5, // Add some space between text and underline
                                            color: '#0A78BE',
                                            marginTop: 20,
                                        }}>
                                            {`Buyer Information`}
                                        </Text>
                                        <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.name}`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.address}`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.email}`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.consignee.contactNumber}`}</Text>
                                        <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: ${invoiceData.consignee.fax == '' ? 'N/A' : invoiceData.consignee.fax}`}</Text>

                                        {/* Notify Party */}
                                        <Text style={{
                                            fontWeight: 750,
                                            fontSize: 14 * widthScaleFactor,
                                            borderBottomWidth: 3, // Adjust the thickness of the underline
                                            borderBottomColor: '#FF0000',
                                            width: 'fit-content', // Make the underline cover the text width
                                            marginBottom: 5, // Add some space between text and underline
                                            color: '#FF0000',
                                            marginTop: 20,
                                        }}>
                                            {`Notify Party`}
                                        </Text>
                                        {invoiceData.notifyParty.sameAsConsignee == true ? (
                                            <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, }}>{`Same as consignee / buyer`}</Text>) :
                                            (<>
                                                <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.name}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.address}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.email}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`${invoiceData.notifyParty.contactNumber}`}</Text>
                                                <Text style={{ fontWeight: 400, fontSize: 12 * widthScaleFactor, marginTop: 20, lineHeight: 14 * widthScaleFactor }}>{`FAX: ${invoiceData.notifyParty.fax == '' ? 'N/A' : invoiceData.notifyParty.fax}`}</Text>
                                            </>)}
                                    </View>
                                    {selectedChatData.stepIndicator.value < 3 ?

                                        <View style={{ position: 'absolute', left: 260 * widthScaleFactor, top: 130 * heightScaleFactor, borderWidth: 3, width: 495 * widthScaleFactor, borderColor: '#FF5C00', height: 194 * heightScaleFactor, }}>
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
                                                <Entypo size={50 * widthScaleFactor} name='warning' color={'#FF0000'} />
                                                <Text style={{ fontWeight: 750, fontSize: 12 * widthScaleFactor, color: '#FF0000', marginLeft: 20 * widthScaleFactor, }}>{`Bank Information will be provided after placing an order.`}</Text>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ position: 'absolute', left: 260 * widthScaleFactor, top: 130 * heightScaleFactor, borderWidth: 3, width: 495 * widthScaleFactor, borderColor: '#1ABA3D', }}>

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



                                    <View style={{ position: 'absolute', left: 260 * widthScaleFactor, top: 335 * heightScaleFactor }}>

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

                                    </View>

                                    <View style={{
                                        position: 'absolute',
                                        left: 38 * widthScaleFactor,
                                        top: featuresTrueCount < 36 ? 657 * heightScaleFactor : 689 * heightScaleFactor,
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
                                                        fontSize: 10 * widthScaleFactor,
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
                                                        fontSize: 10 * widthScaleFactor,
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
                                                        fontSize: 10 * widthScaleFactor,
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
                                                        fontSize: 10 * widthScaleFactor,
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
                                                            {invoiceData.carData.carName}
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
                                                            top: 7 * heightScaleFactor,
                                                            left: 50 * widthScaleFactor,
                                                            position: 'absolute',
                                                        }}>{"Total"}
                                                        </Text>
                                                        <Text style={{
                                                            fontWeight: 700,
                                                            fontSize: 12 * widthScaleFactor,
                                                            lineHeight: 14 * widthScaleFactor,
                                                            marginBottom: 3 * heightScaleFactor,
                                                            alignSelf: 'center',
                                                            color: '#00720B',
                                                        }}>
                                                            {`$${invoiceData.paymentDetails.totalAmount}`}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <Text>{' '}</Text>
                                                )}
                                            </View>

                                        </View>

                                    </View>

                                    <View style={{ position: 'absolute', left: 38 * widthScaleFactor, top: 835 * heightScaleFactor, width: 350 * widthScaleFactor, }}>
                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Payment Information:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'The customer is responsible for the bank charges incurred when the T/T (Telegraphic Transfer) is paid.'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                            marginBottom: 5 * heightScaleFactor,
                                        }}>
                                            {'No warranty service is provided on used vehicles.'}
                                        </Text>

                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Conditions for order cancellation:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'(1) Order Cancellation Penalty: If the order is canceled after payment, a penalty of USD 220 will apply.'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                            marginBottom: 5 * heightScaleFactor,

                                        }}>
                                            {'(2) Non-refund: Payment for vehicles purchased through pre-delivery inspection is non-refundable.'}
                                        </Text>

                                        <Text style={{
                                            fontWeight: 700,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Intermediary Banking Information:'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Bank Name: SUMITOMO MITSUI BANKING CORPORATION (NEW YORK BRANCH).'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'Swift code: SMBCUS33'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,
                                        }}>
                                            {'Address: 277 Park Avenue'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'City: New York, NY'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
                                            lineHeight: 14 * heightScaleFactor,

                                        }}>
                                            {'Postal Code: 10172'}
                                        </Text>
                                        <Text style={{
                                            fontWeight: 400,
                                            fontSize: 10 * widthScaleFactor,
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


                                </View>}


                        </ScrollView>

                    }

                </Modal>
            </>
        }
        </>
    );

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
                <Pressable style={{ width: '60%', height: 25, margin: 2, padding: 1, borderRadius: 2, borderWidth: 1, borderColor: '#D9D9D9', outlineStyle: 'none', }}
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
                    <View style={{ flex: 1, flexDirection: 'row', margin: 2, }}>
                        <Text style={{ width: '20%', fontWeight: 700, margin: 3, }}>Due Date:</Text>
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

const ChatMessageHeader = () => {
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const invoiceData = useSelector((state) => state.invoiceData);


    const totalPriceCondition = selectedChatData.fobPrice && selectedChatData.jpyToUsd && selectedChatData.m3 && selectedChatData.freightPrice;
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
                selectedChatData.currency.jpyToUsd : 0))); const carName = selectedChatData.carData && selectedChatData.carData.carName ? selectedChatData.carData.carName : (selectedChatData.vehicle && selectedChatData.vehicle.carName ? selectedChatData.vehicle.carName : '');

    return (
        <View style={{
            flex: 1,
            alignSelf: 'flex-start',
            flexDirection: 'row',
        }}>

            {globalImageUrl ? (
                <FastImage
                    source={{ uri: globalImageUrl, priority: FastImage.priority.normal }}
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
                        backgroundColor: '#e0e0e0',
                        marginRight: 12,
                    }}
                />
            )}

            <View style={{ alignSelf: 'center', paddingRight: 10, }}>
                <Text style={{ fontWeight: 700, color: '#0A78BE', }}>{carName}</Text>
                <Text style={{ fontWeight: 700, }}>{`${globalCustomerFirstName} ${globalCustomerLastName}`}</Text>
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
                    <Text selectable style={{ fontWeight: 700, textAlign: 'right', }}>
                        {`${selectedChatData.country && selectedChatData.port ? `${selectedChatData.country} / ${selectedChatData.port}` : 'N/A'}`}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ fontWeight: 700, color: "#16A34A", }}>{selectedChatData.insurance ? 'CIF' : 'C&F'}
                        {selectedChatData.inspection ? ` + Inpection[${selectedChatData.inspectionName}]` : ''}</Text>
                </View>
            </View>

            <View style={{ paddingLeft: 20, paddingRight: 10, paddingTop: 2, }}>
                {(selectedChatData.stepIndicator.value == 1 || selectedChatData.stepIndicator.value == 2) &&
                    <>
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

                    <View style={{ flexDirection: 'row', paddingRight: 10, paddingTop: 2, }}>

                        <View style={{ paddingLeft: 20, }}>

                            <TransactionButton
                                key={'Input Payment'}
                                title={'Input Payment'}
                                colorHoverOut={'#FF0000'}
                                colorHoverIn={'#800101'}
                                transactionValue={3}
                                buttonValue={4}
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
                        </View>

                        <View style={{ paddingLeft: 20, }}>

                            <TransactionButton
                                key={'Issue Proforma Invoice'}
                                title={selectedChatData.stepIndicator.value == 1 ? 'Issue Proforma Invoice' : 'Update Invoice'}
                                colorHoverIn={'#0f7534'}
                                colorHoverOut={'#16A34A'}
                                transactionValue={2}
                                buttonValue={2}
                                iconActive={<FontAwesome5 name="file-invoice-dollar" color="#1C2B33" size={14} />} />

                            <ExtendDueDateButton />

                            <View style={{ flexDirection: 'row', }}>
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
                            </View>

                        </View>
                    </View>

                }

            </View>
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
                                            <View key={item} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, borderBottomWidth: 0.5, borderColor: '#ddd', paddingBottom: 8 }}>
                                                <FontAwesome name="user-circle" size={24} color="#4A90E2" style={{ marginRight: 12 }} />
                                                <Text style={{ flex: 1, color: '#555' }}>{email === item ? 'You' : item}</Text>
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

const ChatMessageBox = ({ activeButtonValue, userEmail }) => {
    const chatListData = useSelector((state) => state.chatListData);
    const chatMessagesData = useSelector((state) => state.chatMessagesData);
    const selectedChatData = useSelector((state) => state.selectedChatData);
    const activeChatId = useSelector((state) => state.activeChatId);
    const loadMoreMessagesLoading = useSelector((state) => state.loadMoreMessagesLoading);
    const noMoreMessagesData = useSelector((state) => state.noMoreMessagesData);
    const [isEyeHovered, setIsEyeHovered] = useState(false);
    const flatListRef = useRef();

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
                    useNativeDriver: false
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false
                })
            ])
        ).start();
    }, [animatedValue]);

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

        return segments.map((segment, index) => {
            if (isUrlForText(segment)) {
                const sanitizedUrl = cleanUrl(segment); // Clean the URL before rendering
                return (
                    <Pressable key={index} onPress={() => handleLinkPress(sanitizedUrl)}>
                        <Text
                            selectable
                            style={{
                                fontWeight: '400',
                                color: isGlobalCustomerSender ? 'black' : 'white',
                                fontSize: 16,
                                flexShrink: 1,
                                textDecorationLine: 'underline',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {sanitizedUrl}
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
                            color: isGlobalCustomerSender ? 'black' : 'white',
                            fontSize: 16,
                            flexShrink: 1,
                        }}
                    >
                        {segment}
                    </Text>
                );
            }
        });
    };



    const isUrlForText = (text) => {
        const urlPattern = new RegExp('^(http://www\\.|https://www\\.|http://|https://)[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$');
        return urlPattern.test(text);
    }

    const renderItem = ({ item, index }) => {
        const isGlobalCustomerSender = item.sender === globalCustomerId;
        const isLastMessage = index === 0; // Since the list is inverted, the first item is actually the last message


        return (
            <View style={{
                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                width: '100%',
                alignSelf: isGlobalCustomerSender ? 'flex-start' : 'flex-end',
                marginVertical: 4,
                maxWidth: '60%', // Max width for long messages
                // borderWidth: 1,
                // borderColor: 'red',
            }}>
                {item.messageType == 'IssuedInvoice' &&
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end', flex: 1 }}>
                        <View style={{ flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse', flex: 1, }}>
                            <Animated.View style={{
                                padding: 7,
                                flex: 1,
                                borderRadius: 20,
                                backgroundColor: isGlobalCustomerSender ? '#EFEFEF' : '#0A7CFF',
                                marginRight: isGlobalCustomerSender ? 0 : 10,
                                borderWidth: 3,
                                borderColor: borderColor,
                            }}>
                                <Pressable onPress={handlePreviewInvoiceModalOpen}>
                                    <Text underline selectable style={{
                                        fontWeight: 400,
                                        color: isGlobalCustomerSender ? 'black' : 'white',
                                        fontSize: 16,
                                    }}>
                                        {item.text.trim()}
                                    </Text>
                                </Pressable>
                            </Animated.View>
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


                {item.messageType == 'InputPayment' &&
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end', flex: 1 }}>
                        <View style={{ flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse', flex: 1, }}>
                            <Animated.View style={{
                                padding: 7,
                                flex: 1,
                                borderRadius: 20,
                                backgroundColor: isGlobalCustomerSender ? '#EFEFEF' : '#0A7CFF',
                                marginRight: isGlobalCustomerSender ? 0 : 10,
                                borderWidth: 3,
                                borderColor: borderColor,
                            }}>
                                <Text selectable style={{
                                    fontWeight: 400,
                                    color: isGlobalCustomerSender ? 'black' : 'white',
                                    fontSize: 16,
                                }}>
                                    {item.text.trim()}
                                </Text>
                            </Animated.View>
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



                {!item.messageType &&
                    <View style={{ flexDirection: 'column', alignItems: isGlobalCustomerSender ? 'flex-start' : 'flex-end', flex: 1 }}>
                        <View style={{ flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse', flex: 1, }}>
                            <View style={{
                                flexDirection: isGlobalCustomerSender ? 'row' : 'row-reverse',
                                flex: 1,
                            }}>
                                <View style={{
                                    padding: 10,
                                    borderRadius: 20,
                                    backgroundColor: isGlobalCustomerSender ? '#EFEFEF' : '#0A7CFF',
                                    marginLeft: isGlobalCustomerSender ? 10 : 0,
                                    marginRight: isGlobalCustomerSender ? 0 : 10,
                                    flexShrink: 1,
                                }}>
                                    {isUrl(item.text.trim()) ?
                                        <Pressable onPress={() => isUrlForText(item.text.trim()) && handleLinkPress(item.text.trim())}>
                                            <Text
                                                selectable
                                                style={{
                                                    fontWeight: '400',
                                                    color: isGlobalCustomerSender ? 'black' : 'white',
                                                    fontSize: 16,
                                                    flexShrink: 1,
                                                    wordWrap: 'break-word',
                                                    whiteSpace: 'pre-wrap',
                                                }}
                                                underline
                                            >
                                                {breakUrl(item.text.trim())}
                                            </Text>
                                        </Pressable>
                                        :
                                        renderItemText(isGlobalCustomerSender, item.text.trim())}
                                </View>
                            </View>

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

                        {/* Additional message properties like timestamp and sender */}
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

                    </View>}

            </View>
        );
    };


    return (
        chatMessagesData.length > 0 ? (
            <>
                <FlatList
                    ref={flatListRef}
                    data={chatMessagesData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    initialNumToRender={10} // Adjust based on your average message size and performance
                    maxToRenderPerBatch={10}
                    windowSize={200}
                    onEndReachedThreshold={0.05}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMoreMessages}
                    inverted
                />
                <ReadByListModal userEmail={userEmail} handleReadByListModalClose={handleReadByListModalClose} />
            </>
        ) : null
    );
};



export default function ChatMessages() {

    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const chatListData = useSelector((state) => state.chatListData);
    const activeChatId = useSelector((state) => state.activeChatId);
    const chatMessageBoxLoading = useSelector((state) => state.chatMessageBoxLoading);
    const chatListSearchText = useSelector((state) => state.chatListSearchText);
    const chatMessagesData = useSelector((state) => state.chatMessagesData);
    const loginName = useSelector((state) => state.loginName);

    const [name, setName] = useState(loginName);

    const screenWidth = Dimensions.get('window').width;

    const [activeButton, setActiveButton] = useState('All messages');
    const [activeButtonValue, setActiveButtonValue] = useState(0);

    const [activeFilterButton, setActiveFilterButton] = useState('');
    const [unreadButtonValue, setUnreadButtonValue] = useState(false);
    const [readButtonValue, setReadButtonValue] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const dispatch = useDispatch();


    useEffect(() => {
        const fetchIpAndCountry = async () => {
            try {
                dispatch(setChatMessageBoxLoading(true));
                // Fetch IP Address
                const ipResponse = await axios.get('https://api.ipify.org?format=json');
                const fetchedIp = ipResponse.data.ip;
                ip = fetchedIp;

                // Fetch IP Country
                if (fetchedIp) {
                    const countryResponse = await axios.get(`https://ipapi.co/${fetchedIp}/json/`);
                    const fetchedIpCountry = countryResponse.data.country_name;
                    ipCountry = fetchedIpCountry;
                    dispatch(setChatMessageBoxLoading(false));
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
        return () => unsubscribe();
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
        // Check if currentUser exists before signing out
        if (projectControlAuth.currentUser) {
            signOut(projectControlAuth).then(() => {
                navigation.navigate('Login');
                setEmail('');
                setName('');
            }).catch(() => {
                // Handle any sign out errors here
            });
        } else {
            // Handle the case where there is no user currently signed in
            console.log('No user signed in to sign out');
            // Optionally navigate to the login screen or show a message
            navigation.navigate('Login');
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
            <NativeBaseProvider>
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

                        {screenWidth <= 960 && <MobileViewDrawer
                            selectedScreen={selectedScreen} />}


                        <Box w={screenWidth <= 960 ? 120 : 0} h={screenWidth <= 960 ? 6 : 10} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]}>

                            <FastImage
                                source={{
                                    uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FC-HUB%20LOGO%20HALF.png?alt=media&token=7ce6aef2-0527-40c7-b1ce-e47079e144df',
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
                        {/* <SideDrawer
                            selectedScreen={selectedScreen} /> */}

                        {/* Main Content */}
                        {/* <Box flex={1} flexGrow={1} minHeight={0}> */}
                        {/* Main Content Content */}


                        {/* <Box px="3" bgColor="#A6BCFE" height="full" > */}
                        <View style={{ flex: 1, backgroundColor: "#A6BCFE", height: '100%' }}>
                            <View style={{ flex: 1, margin: 10, }}>

                                <View style={{
                                    borderBottomWidth: 1,
                                    borderColor: '#DADDE1',
                                    width: '100%',
                                    backgroundColor: 'white',
                                    height: 60,
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 5,
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

                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    {/* Chat Body */}

                                    <View>

                                        <View style={{ flex: 1, maxWidth: 380, minWidth: 380, borderRightWidth: 1, borderColor: '#DADDE1', maxHeight: 100, minHeight: 100, backgroundColor: 'white', }}>
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

                                        <View style={{ flex: 1, maxWidth: 380, minWidth: 380, borderRightWidth: 1, borderColor: '#DADDE1', backgroundColor: 'white', borderBottomLeftRadius: 5, }}>
                                            {/* Chat List */}
                                            <ChatsList unreadButtonValue={unreadButtonValue} activeButtonValue={activeButtonValue} />
                                        </View>

                                    </View>

                                    {chatMessageBoxLoading ? (
                                        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', }}>
                                            <Spinner
                                                animating
                                                size="lg"
                                                color={'#7B9CFF'}
                                            />
                                        </View>) : (
                                        <View style={{ flex: 1, }}>

                                            <View style={{ flex: 1, minHeight: 90, maxHeight: screenWidth < 1110 ? 110 : 90, borderBottomWidth: 1, borderColor: '#DADDE1', backgroundColor: 'white', }}>
                                                {/* Chat Message Header */}
                                                <ScrollView scrollEnabled horizontal>
                                                    {chatMessagesData.length < 1 ? null : (<ChatMessageHeader />)}
                                                </ScrollView>
                                            </View>

                                            <View style={{ flex: 1, borderColor: '#DADDE1', backgroundColor: 'white', borderBottomRightRadius: 5, }}>


                                                <View style={{ flex: 1 }}>
                                                    {/* Chat Message Box */}
                                                    <ChatMessageBox activeButtonValue={activeButtonValue} userEmail={email} />
                                                </View>

                                                <View style={{ flex: 1, minHeight: 110, maxHeight: 110, justifyContent: 'center', alignItems: 'center' }}>
                                                    {/* Chat Input Text */}
                                                    {chatMessagesData.length < 1 ? null : (<ChatInputText />)}
                                                </View>

                                            </View>

                                        </View>)}




                                </View>


                            </View>
                            {/* <SuccessModal /> */}

                        </View>


                        {/* </Box> */}

                        {/* </Box> */}
                    </View>

                </View>
                <LoadingModal />
            </NativeBaseProvider>


        </>
    );
}