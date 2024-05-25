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
    useToast,
} from 'native-base';
import { DataTable } from 'react-native-paper';

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
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, setDoc, arrayUnion, updateDoc, deleteField } from 'firebase/firestore';
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
    setSelectedButton,
    setAddCountryModalVisible,
    setAddPortModalVisible,
    setDeletePortModalVisible,
    setAddPortsForCountriesModalVisible,
    setCountryPortsData,
    setDeleteCountryModalVisible,
    setLoginName
} from './redux/store';
import BouncyCheckbox from "react-native-bouncy-checkbox";
// import { TextInput } from 'react-native-gesture-handler';
import { nanoid } from 'nanoid';
import { cloneDeep, merge } from 'lodash';
import StickyHeader from './Header/StickyHeader';
import { UsePagination } from './VehicleListComponent/UsePagination';
import { useNavigate } from 'react-router-dom';
import QRCodeScanner from './QrCodeScanner/QrCodeScanner';

// import { CollectionGroup } from 'firebase-admin/firestore';
const { width } = Dimensions.get('window');
let selectedScreen = 'FREIGHT'

let nameVariable = {
    text: ''
}

let defaultSelectedButton = 'countries';

let selectedPort = '';
let selectedCountry = '';
let selectedPortForCountry = '';

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

const SearchablePortDropdown = ({ modalAddOpen }) => {
    // const [selectedItem, setSelectedItem] = useState(null);
    const [query, setQuery] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [data, setData] = useState([]); // Initialize data state with an empty array
    const searchRef = useRef(null);

    useEffect(() => {
        // Your data fetching logic here
        const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');

        // This will start the listener
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const formattedData = Object.keys(data)
                    .map((key) => ({
                        ports: key.replace(/_/g, '.'),
                        ...data[key],
                    }))
                    .sort((a, b) => a.sortOrder - b.sortOrder); // Sorting based on the sortOrder field
                setData(formattedData);
            } else {
                console.log('No such document!');
            }
        }, (error) => {
            console.error('Error fetching countries: ', error);
        });

        // This will unsubscribe from the listener when the component is unmounted
        return () => unsubscribe();
    }, []);

    const filteredData = data.filter((item) =>
        item.ports.toLowerCase().includes(query.toLowerCase().trim()) ||
        item.country.toLowerCase().includes(query.toLowerCase().trim())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                width: '100%',
                backgroundColor: '#85929F',
            }}
            onPress={() => {
                // setSelectedItem(item);
                selectedPortForCountry = item;
                setQuery('');
                setIsDropdownVisible(false);

            }}
        >
            <Text style={{ color: 'white', }}>{item.ports}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {

        searchRef.current.focus();

    }, [isDropdownVisible])

    useEffect(() => {

        searchRef.current.focus();
        setIsDropdownVisible(false);
        selectedPortForCountry = '';

    }, [modalAddOpen])

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <Button
                title="Show Dropdown"
                onPress={() => {
                    setIsDropdownVisible(!isDropdownVisible)

                }}
                bgColor={'#102A43'}
                style={{ borderWidth: 1 }}
                flex={1}
            >
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between', // This will position the children at opposite ends
                }}>
                    <Text style={{ color: 'white', flex: 1, alignSelf: 'flex-start' }}>{selectedPortForCountry ? selectedPortForCountry.ports : 'Select Port'}</Text>
                    <MaterialIcons style={{ alignSelf: 'flex-end' }} name={isDropdownVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color='white' size={22} />
                </View>
            </Button>
            <View style={{ display: isDropdownVisible ? 'flex' : 'none' }}>
                <TextInput
                    ref={searchRef}
                    style={{
                        outlineStyle: 'none',
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#102A43',
                        flex: 1,
                    }}
                    placeholder="Search..."
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                />
                <FlatList
                    style={{ height: 150, width: '100%', borderWidth: 1, borderColor: '#102A43', borderRadius: 5, }}
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.ports.toString()}
                />
            </View>

        </View>
    );
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


//     const dispatch = useDispatch();
//     const toast = useToast();
//     const [inspectionData, setInspectionData] = useState(['Required', 'Not-Required', 'Optional']);
//     const [key, setKey] = useState(nanoid());

//     const [selectedStockStatusValue, setSelectedStockStatusValue] = useState(selectedValue);
//     const screenWidth = Dimensions.get('window').width;



//     const handleSaveStockStatus = async () => {

//         dispatch(setLoadingModalVisible(true));

//        const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo');
//         const { datetime } = response.data;
//         const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
//         const year = moment(datetime).format('YYYY');
//         const month = moment(datetime).format('MM');
//         const monthWithDay = moment(datetime).format('MM/DD');
//         const date = moment(datetime).format('YYYY/MM/DD');
//         const day = moment(datetime).format('DD');
//         const time = moment(datetime).format('HH:mm');

//         const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

//         if (item.stockStatus == selectedStockStatusValue || selectedStockStatusValue == '' || selectedStockStatusValue == '__NativeBasePlaceHolder__') {
//             dispatch(setLoadingModalVisible(false));
//         }

//         else {

//             const stockStatusHistoryData = {
//                 date: formattedTime,
//                 stockStatus: selectedStockStatusValue,
//                 changedBy: nameVariable.text,
//             };
//             const vehicleProductRef = doc(collection(projectExtensionFirestore, 'VehicleProducts'), item.stockID);

//             try {
//                 await updateDoc(vehicleProductRef, {
//                     stockStatus: selectedStockStatusValue,
//                     stockStatusHistory: arrayUnion(stockStatusHistoryData)
//                 });
//                 const logData = {
//                     message: `Stock Status Updated: "${nameVariable.text}" updated "${item.carName}" stock status to "${selectedStockStatusValue}" with a reference number of "${item.referenceNumber}" using Vehicle List.`,
//                     timestamp: formattedTime,
//                     colorScheme: true,
//                     keywords: [
//                         formattedTime.toLowerCase(),
//                         globalCurrentStockID.toLowerCase(),
//                         `Stock Status Updated: "${nameVariable.text}" updated "${item.carName}" stock status to ${selectedStockStatusValue} with a reference number of "${item.referenceNumber}" using Vehicle List`.toLowerCase(),
//                         'Stock Status'.toLowerCase(),
//                         'Stock Status Updated'.toLowerCase(),
//                         'Stock'.toLowerCase(),
//                         'Status Updated'.toLowerCase(),
//                         'Updated'.toLowerCase(),
//                         globalSelectedCarName.toLowerCase(),
//                         globalSelectedVehicleReferenceNumber.toLowerCase(),
//                         nameVariable.text.toLowerCase(),
//                         year.toLowerCase(),
//                         month.toLowerCase(),
//                         monthWithDay.toLowerCase(),
//                         date.toLowerCase(),
//                         day.toLowerCase(),
//                         time.toLowerCase(),
//                         timeWithMinutesSeconds.toLowerCase(),
//                     ],
//                 };
//                 addLogToCollection(logData);
//                 dispatch(setLoadingModalVisible(false));

//                 // console.log('FOB Price updated successfully');
//                 toast.show({
//                     render: () => {
//                         return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
//                             <Text style={{ color: 'white' }}>Stock Status updated successfully!</Text>
//                         </View>;
//                     }
//                 })
//             } catch (error) {
//                 console.error(error);
//                 toast.show({
//                     render: () => {
//                         return <View style={{ backgroundColor: '#DC2626', padding: 5, borderRadius: 5 }}>
//                             <Text style={{ color: 'white' }}>Error updating: {error}</Text>
//                         </View>;
//                     }
//                 })
//             }
//         }
//     }

//     return (
//         <View style={{ flex: 1, flexDirection: 'row' }}>
//             <View style={{ width: screenWidth >= 1360 ? '70%' : '88%', backgroundColor: 'white', }}>
//                 <Select
//                     selectedValue={selectedStockStatusValue}
//                     onValueChange={(value) => {
//                         setSelectedStockStatusValue(value);
//                     }}
//                     flex={3}
//                     accessibilityLabel="---"
//                     placeholder="---"
//                     _selectedItem={{
//                         bg: "teal.600",
//                         endIcon: <CheckIcon size="5" />
//                     }}
//                 >
//                     {stockStatusData.map((item) => (
//                         <Select.Item key={item} label={item} value={item} />
//                     ))}
//                 </Select>
//             </View>

//             <TouchableHighlight
//                 underlayColor={'rgba(22, 163, 74, 0.3)'}
//                 onPress={handleSaveStockStatus}
//                 style={{
//                     backgroundColor: '#16A34A',
//                     borderRadius: 5,
//                     padding: 3,
//                     margin: 2,
//                     alignSelf: 'center',
//                 }}>
//                 <MaterialIcons name='update' color='white' size={22} />
//             </TouchableHighlight>
//         </View>




//     );
// };

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


const SortAndAddModal = ({ headerText, data, title, dataName, databaseInit, textAreaAdd, handleAddTextChange, docName, collectionName, handleFirstModalClose, handleFirstModalOpen }) => {
    const [modalSortOpen, setModalSortOpen] = useState(false);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalAddSuccess, setModalAddSuccess] = useState(false);
    const [modalSave, setModalSave] = useState(false);
    const [modalSaveLoading, setModalSaveLoading] = useState(false);
    const [modalData, setModalData] = useState(data);
    const [modalIsLoading, setModalIsLoading] = useState(false);

    const handleDeleteItemPress = useCallback(
        (item) => {
            setModalData((prevData) => {
                const updatedData = prevData.filter((value) => value !== item);
                return updatedData;
            });
        },
        []
    );

    // useEffect(() => {

    //   fetchData();

    // }, [modalSortOpen]);



    const fetchData = useCallback(async () => {
        const modalDocRef = doc(collection(databaseInit, collectionName), docName);
        const modalDocSnap = await getDoc(modalDocRef);
        if (modalDocSnap.exists()) {
            // setModalData(modalDocSnap.data()?.dataName || []);
            setModalData(modalDocSnap.data()?.[dataName] || []);
        }
    }, [databaseInit, modalData]);

    // useEffect(() => {
    //   const unsubscribe = onSnapshot(doc(collection(databaseInit, docName), docName), (snapshot) => {
    //     setModalData(snapshot.data()?.[dataName] || []);
    //   });

    //   return () => unsubscribe();
    // }, [dataName, databaseInit, docName]);

    const handleSave = useCallback(async () => {
        setModalSaveLoading(true);

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

        try {
            await updateDoc(doc(collection(databaseInit, collectionName), docName), { [dataName]: modalData });
            setModalSaveLoading(false);
            setModalSortOpen(true);
            setModalSave(false);


            const logData = {
                message: `"${title}" updated: "${nameVariable.text}" updated "${title}"`,
                timestamp: formattedTime,
                colorScheme: true,
                keywords: [
                    formattedTime.toLowerCase(),
                    `"${title}" updated: "${nameVariable.text}" updated "${title}"`.toLowerCase(),
                    `${title} updated`.toLowerCase(),
                    `"${title}" updated`.toLowerCase(),
                    'updated'.toLowerCase(),
                    title.toLowerCase(),
                    nameVariable.text.toLowerCase(),
                    year.toLowerCase(),
                    month.toLowerCase(),
                    monthWithDay.toLowerCase(),
                    date.toLowerCase(),
                    day.toLowerCase(),
                    time.toLowerCase(),
                    timeWithMinutesSeconds.toLowerCase(),
                ],
            };

            addLogToCollection(logData);

        } catch (error) {
            setModalSaveLoading(false);
            handleModalSaveClose();
            console.error(error);
        }


    }, [databaseInit, modalData, dataName, docName]);


    const handleSortModalOpen = useCallback(() => {
        setModalIsLoading(true);
        fetchData();
        setModalSortOpen(true);
        // handleFirstModalClose();
    }, [modalSortOpen, modalIsLoading]);

    const handleSortModalClose = useCallback(async () => {
        setModalSortOpen(false);
        setModalIsLoading(false);
        // handleFirstModalOpen();
    }, [modalSortOpen, modalIsLoading]);

    // const handleAddTextChange = () => {
    //   const newText = textAreaAdd.current?.value?.toUpperCase();
    //   textAreaAdd.current?.setNativeProps({ text: newText });
    // };


    const handleModalAddOpen = useCallback(() => {
        setModalAddOpen(true);
        handleSortModalClose();
        setModalIsLoading(true);
        // handleFirstModalClose();

    }, [])

    const handleModalAddClose = useCallback(() => {
        setModalAddOpen(false);
        handleSortModalOpen();
        textAreaAdd.current?.clear();
    }, [modalAddOpen])

    const handleModalAddSuccessClose = useCallback(() => {
        setModalAddSuccess(false);
        // setIsLoading(false);
        handleSortModalOpen();
    }, [modalAddSuccess])

    const handleModalAddSuccessOpen = useCallback(() => {
        setModalAddSuccess(true);
        handleSortModalClose();
        setModalAddOpen(false);
        setModalIsLoading(true);
        // handleFirstModalClose();

    }, [modalAddSuccess, modalAddOpen, modalIsLoading])

    const handleModalSaveOpen = useCallback(() => {
        setModalSave(true);
        setModalSortOpen(false);
        setModalIsLoading(true);
    }, [modalSave, modalSortOpen, modalIsLoading])

    const handleModalSaveClose = useCallback(() => {
        setModalSave(false);
        setModalSortOpen(true);
    }, [modalSave, modalSortOpen]);

    const handleAddSubmit = async () => {

        const data = textAreaAdd.current?.value;
        const dataArray = data.split('\n').map((item) => item.trim());

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

        if (data !== '') {

            setModalSaveLoading(true);

            try {
                const modalCollectionRef = collection(databaseInit, collectionName);
                const modalDocRef = doc(modalCollectionRef, docName);
                await setDoc(modalDocRef, { [dataName]: arrayUnion(...dataArray) }, { merge: true });

                const logData = {
                    message: `"${title}" added: "${nameVariable.text}" added "${title}"(s).`,
                    timestamp: formattedTime,
                    colorScheme: true,
                    keywords: [
                        formattedTime.toLowerCase(),
                        `"${title}" added: "${nameVariable.text}" added "${title}"(s).`.toLowerCase(),
                        `${title} added`.toLowerCase(),
                        `"${title}" added`.toLowerCase(),
                        'added'.toLowerCase(),
                        title.toLowerCase(),
                        nameVariable.text.toLowerCase(),
                        year.toLowerCase(),
                        month.toLowerCase(),
                        monthWithDay.toLowerCase(),
                        date.toLowerCase(),
                        day.toLowerCase(),
                        time.toLowerCase(),
                        timeWithMinutesSeconds.toLowerCase(),
                    ],
                };
                addLogToCollection(logData);
                setModalSaveLoading(false);

                handleModalAddSuccessOpen();



                console.log('Data added to Firestore');
            } catch (error) {
                console.error('Error adding data to Firestore:', error);
                setModalSaveLoading(false);
            }
        }
        else {

        }


    };

    return (
        <>
            <Box justifyContent="center" alignItems={'flex-start'} marginRight={1}>

                {!modalIsLoading ? (
                    <TouchableOpacity onPress={handleSortModalOpen} >
                        <Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" />
                    </TouchableOpacity>
                ) : (
                    <Spinner color="white" size={20} />
                )}


            </Box>

            <Modal
                isOpen={modalSortOpen}
                onClose={handleSortModalClose}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header borderBottomWidth={0}>
                        <Text color={'#102A43'} bold>{headerText}</Text>
                    </Modal.Header>
                    <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1}>
                        <Box w={'full'} flexDir={'column'}>
                            <Box alignItems={'flex-end'}>
                                <Pressable onPress={handleModalAddOpen} ><Icon as={<FontAwesome name="plus-circle" />} size={5} color="#102A43" /></Pressable>
                            </Box>

                            <Box flex={1} borderWidth={1} borderColor={'#102A43'} borderRadius={5}>

                                <DraggableFlatList
                                    style={{ alignContent: 'center', flex: 1, }}
                                    data={modalData}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item, drag }) => (

                                        <Box flex={1} bgColor={'rgba(16,42,67, 0.5)'} borderBottomWidth={1} borderBottomColor={'warmGray.400'} flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                                            <Pressable onPress={() => handleDeleteItemPress(item)}><Icon as={<AntDesign name="minuscircle" />} size={4} color="#102A43" /></Pressable>

                                            <Text flex={1} textAlign={'center'} color={'white'}>{item}</Text>
                                            <Pressable onPressIn={drag}><Icon as={<Entypo name="menu" />} size={4} color="#102A43" /></Pressable>
                                        </Box>

                                    )}
                                    onDragEnd={useCallback(({ data }) => setModalData(data), [])} />

                            </Box>

                        </Box>

                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0}>
                        <HStack space={5} flex={1}>
                            <Button onPress={handleSortModalClose} colorScheme={'muted'} flex={1} size={'sm'} borderRadius={5}>Close</Button>
                            <Button onPress={handleModalSaveOpen} flex={1} size={'sm'} borderRadius={5}>Save</Button>
                        </HStack>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>


            <Modal
                isOpen={modalSave}
                onClose={handleModalSaveClose}>
                <Modal.Content >
                    <Modal.CloseButton />
                    <Modal.Header borderBottomWidth={0}>
                        <Text color={'#102A43'} bold>Save Order?</Text>
                    </Modal.Header>
                    <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1} >

                        <Text>Are you sure you want to save changes?</Text>

                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0} >
                        <HStack space={5} flex={1}>
                            <Button onPress={handleModalSaveClose} colorScheme={'muted'} flex={1} size={'sm'} borderRadius={5}>No</Button>
                            <Button onPress={handleSave} flex={1} size={'sm'} borderRadius={5} isLoading={modalSaveLoading ? true : false}>Yes</Button>
                        </HStack>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>


            <Modal
                isOpen={modalAddOpen}
                onClose={handleModalAddClose}
                initialFocusRef={textAreaAdd}>
                <Modal.Content >
                    <Modal.CloseButton />
                    <Modal.Header borderBottomWidth={0}>
                        <Text color={'#102A43'} bold>Add {title}</Text>
                    </Modal.Header>
                    <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1} >

                        <TextArea
                            textAlign={'center'}
                            w={'full'}
                            ref={textAreaAdd}
                            multiline
                            onChangeText={handleAddTextChange}
                            totalLines={4}
                            placeholder="Enter your data, separated by new lines" />

                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0} >
                        <HStack space={5} flex={1}>
                            <Button onPress={handleModalAddClose} colorScheme={'muted'} flex={1} size={'sm'} borderRadius={5}>Close</Button>
                            <Button onPress={handleAddSubmit} isLoading={modalSaveLoading ? true : false} flex={1} size={'sm'} borderRadius={5}>Add</Button>
                        </HStack>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {/* <SuccessModal isOpen={modalAddMakeSuccess} onClose={handleModalAddMakeSuccessClose} headerText={'Added successfully!'} bodyText={'Added successfully!'}/> */}
            <Modal isOpen={modalAddSuccess} onClose={handleModalAddSuccessClose} >
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
                                Added successfully!
                            </Text>
                            <Text color={'green.600'}>
                                Added successfully!
                            </Text>
                        </Box>
                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0} bgColor={'green.100'}>
                        <HStack space={5} flex={1}>
                            <Button colorScheme={'success'} flex="1" onPress={handleModalAddSuccessClose} _text={{ color: 'white' }}>
                                Ok
                            </Button>
                        </HStack>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>


        </>


    );
};



const FreightNavigation = () => {

    const screenWidth = Dimensions.get('window').width;

    const dispatch = useDispatch();
    const [selectedButtonState, setSelectedButtonState] = useState(defaultSelectedButton);


    const handlePress = (button) => {
        if (button !== selectedButtonState) {
            dispatch(setLoadingModalVisible(true));
        }
        dispatch(setSelectedButton(button));
        setSelectedButtonState(button);
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: screenWidth >= 960 ? '50%' : '90%' }}>

            <TouchableOpacity
                onPress={() => handlePress('countries')}
                style={{
                    borderRadius: 5,
                    flex: 1,
                    padding: 10,
                    margin: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: selectedButtonState === 'countries' ? '#0642F4' : 'transparent',
                    flexDirection: 'row',
                }}
            >
                <MaterialIcons
                    name="flag" // The icon name from MaterialIcons
                    size={20} // Set the size of the icon
                    color={selectedButtonState === 'countries' ? 'white' : 'black'} // Set the color based on active state
                />
                <Text style={{ color: selectedButtonState === 'countries' ? 'white' : 'black', fontWeight: 'bold', marginLeft: 5, }}>Countries</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handlePress('ports')}
                style={{
                    borderRadius: 5,
                    flex: 1,
                    padding: 10,
                    margin: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: selectedButtonState === 'ports' ? '#0642F4' : 'transparent',
                    flexDirection: 'row',
                }}
            >
                <MaterialIcons
                    name="directions-boat" // The icon name from MaterialIcons
                    size={20} // Set the size of the icon
                    color={selectedButtonState === 'ports' ? 'white' : 'black'} // Set the color based on active state
                />
                <Text style={{ color: selectedButtonState === 'ports' ? 'white' : 'black', fontWeight: 'bold', marginLeft: 5, }}>Ports</Text>
            </TouchableOpacity>

        </View>
    );
}

const SelectMethod = ({ defaultValue, portCode, page, searchQuery }) => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const methodData = useSelector((state) => state.methodData);

    const dispatch = useDispatch();
    const toast = useToast();
    let currentValue = '';




    const updatePortMethod = async (portCode, newValue) => {
        // Specify the document reference
        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');
        dispatch(setLoadingModalVisible(true));
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');

        if (newValue !== '' && newValue !== '__NativeBasePlaceHolder__') {
            // Replace dots with underscores in the countryCode if the keys in Firestore use underscores
            // If your keys can contain dots and are used as such in Firestore, do not replace with underscores.
            const formattedCountryCode = portCode.replace(/\./g, '_'); // Replace dots with underscores or any other valid character

            // Specify the field using dot notation for the nested field
            const methodField = `${formattedCountryCode}.method`;

            try {
                if (currentValue == selectedMethod) {

                    dispatch(setLoadingModalVisible(false));

                }
                else {

                    await updateDoc(documentRef, {
                        [methodField]: newValue
                    });

                    dispatch(setLoadingModalVisible(false));
                    const logData = {
                        message: `Method Updated: "${nameVariable.text}" updated "${portCode}" method to "${newValue}"`,
                        timestamp: formattedTime,
                        colorScheme: true,
                        keywords: [
                            formattedTime.toLowerCase(),
                            `Method Updated: "${nameVariable.text}" updated "${portCode}" inspection to "${newValue}"`.toLowerCase(),
                            'Method'.toLowerCase(),
                            'Method Updated'.toLowerCase(),
                            'Updated'.toLowerCase(),
                            portCode.toLowerCase(),
                            newValue.toLowerCase(),
                            nameVariable.text.toLowerCase(),
                            year.toLowerCase(),
                            month.toLowerCase(),
                            monthWithDay.toLowerCase(),
                            date.toLowerCase(),
                            day.toLowerCase(),
                            time.toLowerCase(),
                        ],
                    };
                    addLogToCollection(logData);
                    toast.show({
                        render: () => {
                            return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                                <Text style={{ color: 'white' }}>Method updated successfully</Text>
                            </View>;
                        }
                    })
                    console.log('Method updated successfully');
                }
                // Perform the update

            } catch (error) {
                console.error('Error updating method:', error);
            }
        }
        else {
            dispatch(setLoadingModalVisible(false));

        }

    };



    useEffect(() => {
        // Replace dots with underscores in the country code
        const formattedPortCode = portCode.replace(/\./g, '_');
        // Reference to your document
        const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');

        // Listen for document updates
        const unsubscribe = onSnapshot(docRef, (documentSnapshot) => {
            if (documentSnapshot.exists()) {
                // Use bracket notation to access the property using the variable
                const portData = documentSnapshot.data()[formattedPortCode];
                // Make sure to check if portData exists before trying to access its properties
                if (portData && portData.method) {
                    const method = portData.method;
                    setSelectedMethod(method);
                    currentValue = method;
                }
                else {
                    setSelectedMethod('__NativeBasePlaceHolder__');
                }
            } else {
                // documentSnapshot.data() will be undefined in this case
                console.log('No such document!');
            }
        },
            (error) => {
                // Handle the error
                console.error("Error getting document: ", error);
            });

        // Detach the listener when the component unmounts
        return () => unsubscribe();
    }, [page, searchQuery]);

    return (
        <View style={{ flexDirection: 'row', width: '100%', }}>


            <Select
                selectedValue={selectedMethod}
                onValueChange={(value) => {
                    setSelectedMethod(value);
                }}
                bgColor={'white'}
                flex={1}
                accessibilityLabel="---"
                placeholder="---"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon />
                }}
            >
                {methodData.map((item) => (
                    <Select.Item key={item} label={item} value={item} />
                ))}
            </Select>
            <TouchableHighlight
                onPress={() => updatePortMethod(portCode, selectedMethod)}
                underlayColor={'rgba(22, 163, 74, 0.3)'}
                style={{
                    backgroundColor: '#16A34A',
                    borderRadius: 5,
                    padding: 5,
                    margin: 2,
                    alignSelf: 'center',
                }}>
                <MaterialIcons name='update' color='white' size={22} />
            </TouchableHighlight>
        </View>
    );
}

const SelectInspectionIsRequired = ({ width, defaultValue, countryCode, page, searchQuery }) => {
    const [selectedInspectionIsRequired, setSelectedInspectionIsRequired] = useState('');
    const inspectionIsRequiredData = useSelector((state) => state.inspectionIsRequiredData);

    const dispatch = useDispatch();
    const toast = useToast();
    let currentValue = '';




    const updateCountryInspection = async (countryCode, newValue) => {
        // Specify the document reference
        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');
        dispatch(setLoadingModalVisible(true));
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        if (newValue !== '') {
            // Replace dots with underscores in the countryCode if the keys in Firestore use underscores
            // If your keys can contain dots and are used as such in Firestore, do not replace with underscores.
            const formattedCountryCode = countryCode.replace(/\./g, '_'); // Replace dots with underscores or any other valid character

            // Specify the field using dot notation for the nested field
            const inspectionIsRequiredField = `${formattedCountryCode}.inspectionIsRequired`;

            try {
                if (currentValue == selectedInspectionIsRequired) {

                    dispatch(setLoadingModalVisible(false));

                }
                else {

                    await updateDoc(documentRef, {
                        [inspectionIsRequiredField]: newValue
                    });

                    dispatch(setLoadingModalVisible(false));
                    const logData = {
                        message: `Inspection Updated: "${nameVariable.text}" updated "${countryCode}" inspection to "${newValue}"`,
                        timestamp: formattedTime,
                        colorScheme: true,
                        keywords: [
                            formattedTime.toLowerCase(),
                            `Inspection Updated: "${nameVariable.text}" updated "${countryCode}" inspection to "${newValue}"`.toLowerCase(),
                            'Inspection'.toLowerCase(),
                            'Inspection Updated'.toLowerCase(),
                            'Updated'.toLowerCase(),
                            countryCode.toLowerCase(),
                            newValue.toLowerCase(),
                            nameVariable.text.toLowerCase(),
                            year.toLowerCase(),
                            month.toLowerCase(),
                            monthWithDay.toLowerCase(),
                            date.toLowerCase(),
                            day.toLowerCase(),
                            time.toLowerCase(),
                        ],
                    };
                    addLogToCollection(logData);
                    toast.show({
                        render: () => {
                            return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                                <Text style={{ color: 'white' }}>Inspection updated successfully</Text>
                            </View>;
                        }
                    })
                    console.log('Inspection updated successfully');
                }
                // Perform the update

            } catch (error) {
                console.error('Error updating inspection:', error);
            }
        }
        else {
            dispatch(setLoadingModalVisible(false));

        }

    };



    useEffect(() => {
        // Replace dots with underscores in the country code
        const formattedCountryCode = countryCode.replace(/\./g, '_');
        // Reference to your document
        const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');

        // Listen for document updates
        const unsubscribe = onSnapshot(docRef, (documentSnapshot) => {
            if (documentSnapshot.exists()) {
                // Use bracket notation to access the property using the variable
                const countryData = documentSnapshot.data()[formattedCountryCode];
                // Make sure to check if countryData exists before trying to access its properties
                if (countryData && countryData.inspectionIsRequired) {
                    const inspectionIsRequired = countryData.inspectionIsRequired;
                    setSelectedInspectionIsRequired(inspectionIsRequired);
                    currentValue = inspectionIsRequired;


                }
            } else {
                // documentSnapshot.data() will be undefined in this case
                console.log('No such document!');
            }
        },
            (error) => {
                // Handle the error
                console.error("Error getting document: ", error);
            });

        // Detach the listener when the component unmounts
        return () => unsubscribe();
    }, [page, searchQuery]);

    return (
        <View style={{ flexDirection: 'row', width: width, }}>


            <Select
                selectedValue={selectedInspectionIsRequired}
                onValueChange={(value) => {
                    setSelectedInspectionIsRequired(value);
                }}
                bgColor={'white'}
                flex={1}
                accessibilityLabel="---"
                placeholder="---"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon />
                }}
            >
                {inspectionIsRequiredData.map((item) => (
                    <Select.Item key={item} label={item} value={item} />
                ))}
            </Select>
            <TouchableHighlight
                onPress={() => updateCountryInspection(countryCode, selectedInspectionIsRequired)}
                underlayColor={'rgba(22, 163, 74, 0.3)'}
                style={{
                    backgroundColor: '#16A34A',
                    borderRadius: 5,
                    padding: 5,
                    margin: 2,
                    alignSelf: 'center',
                }}>
                <MaterialIcons name='update' color='white' size={22} />
            </TouchableHighlight>
        </View>
    );
}

const SelectInspectionName = ({ width, defaultValue, countryCode, page, searchQuery }) => {
    const [selectedInspectionName, setSelectedInspectionName] = useState('');
    const inspectionNameData = useSelector((state) => state.inspectionNameData);
    const dispatch = useDispatch();
    const toast = useToast();
    let currentValue = '';




    const updateCountryInspectionName = async (countryCode, newValue) => {
        // Specify the document reference
        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');
        dispatch(setLoadingModalVisible(true));
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        if (newValue !== '') {
            // Replace dots with underscores in the countryCode if the keys in Firestore use underscores
            // If your keys can contain dots and are used as such in Firestore, do not replace with underscores.
            const formattedCountryCode = countryCode.replace(/\./g, '_'); // Replace dots with underscores or any other valid character

            // Specify the field using dot notation for the nested field
            const inspectionNameField = `${formattedCountryCode}.inspectionName`;

            try {
                if (currentValue == selectedInspectionName) {

                    dispatch(setLoadingModalVisible(false));

                }
                else {

                    await updateDoc(documentRef, {
                        [inspectionNameField]: newValue
                    });

                    dispatch(setLoadingModalVisible(false));
                    const logData = {
                        message: `Inspection Name Updated: "${nameVariable.text}" updated "${countryCode}" inspection name to "${newValue}"`,
                        timestamp: formattedTime,
                        colorScheme: true,
                        keywords: [
                            formattedTime.toLowerCase(),
                            `Inspection Name Updated: "${nameVariable.text}" updated "${countryCode}" inspection name to "${newValue}"`.toLowerCase(),
                            'Inspection Name'.toLowerCase(),
                            'Inspection'.toLowerCase(),
                            'Inspection Name Updated'.toLowerCase(),
                            'Name'.toLowerCase(),
                            'Updated'.toLowerCase(),
                            newValue.toLowerCase(),
                            countryCode.toLowerCase(),
                            nameVariable.text.toLowerCase(),
                            year.toLowerCase(),
                            month.toLowerCase(),
                            monthWithDay.toLowerCase(),
                            date.toLowerCase(),
                            day.toLowerCase(),
                            time.toLowerCase(),
                        ],
                    };
                    addLogToCollection(logData);
                    toast.show({
                        render: () => {
                            return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                                <Text style={{ color: 'white' }}>Inspection Name updated successfully</Text>
                            </View>;
                        }
                    })
                    console.log('Inspection Name updated successfully');
                }
                // Perform the update

            } catch (error) {
                console.error('Error updating inspection:', error);
            }
        }
        else {
            dispatch(setLoadingModalVisible(false));

        }

    };

    useEffect(() => {
        // Replace dots with underscores in the country code
        const formattedCountryCode = countryCode.replace(/\./g, '_');

        // Reference to your document
        const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');

        // Listen for document updates
        const unsubscribe = onSnapshot(docRef, (documentSnapshot) => {
            if (documentSnapshot.exists()) {
                // Use bracket notation to access the property using the variable
                const countryData = documentSnapshot.data()[formattedCountryCode];
                // Make sure to check if countryData exists before trying to access its properties
                if (countryData && countryData.inspectionName) {
                    const inspectionName = countryData.inspectionName;
                    setSelectedInspectionName(inspectionName);
                    currentValue = inspectionName;

                }
                else {
                    setSelectedInspectionName('__NativeBasePlaceHolder__');
                    currentValue = '__NativeBasePlaceHolder__';
                }
            } else {
                // documentSnapshot.data() will be undefined in this case

                console.log('No such document!');
            }
        },
            (error) => {
                // Handle the error
                console.error("Error getting document: ", error);
            });

        // Detach the listener when the component unmounts
        return () => unsubscribe();
    }, [page, searchQuery]);

    return (
        <View style={{ flexDirection: 'row', width: width, }}>
            <Select
                selectedValue={selectedInspectionName}
                onValueChange={(value) => {
                    setSelectedInspectionName(value);
                }}
                bgColor={'white'}
                flex={1}
                accessibilityLabel="---"
                placeholder="---"
                _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon />
                }}
            >
                {inspectionNameData.map((item) => (
                    <Select.Item key={item} label={item} value={item} />
                ))}
            </Select>
            <TouchableHighlight
                onPress={() => updateCountryInspectionName(countryCode, selectedInspectionName)}
                underlayColor={'rgba(22, 163, 74, 0.3)'}
                style={{
                    backgroundColor: '#16A34A',
                    borderRadius: 5,
                    padding: 5,
                    margin: 2,
                    alignSelf: 'center',
                }}>
                <MaterialIcons name='update' color='white' size={22} />
            </TouchableHighlight>
        </View>
    );
}


const countriesList = [
    "Zambia",
    "D.R.Congo",
    "Mozambique",
    "Zimbabwe",
    "Uganda",
    "Tanzania",
    "Malawi",
    "Burundi",
    "Lesotho",
    "South Sudan",
    "Botswana",
    "Kenya",
    "Republic of South Africa",
    "Djibouti",
    "Ethiopia",
    "Angola",
    "Benin",
    "Cameroon",
    "Gabon",
    "Ghana",
    "Guinea",
    "Madagascar",
    "Mali",
    "Namibia",
    "Nigeria",
    "Rwanda",
    "Sierra Leone",
    "Sudan",
    "Algeria",
    "Canary Islands",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Equatorial Guinea",
    "Eritrea",
    "Gambia",
    "Liberia",
    "Mahe",
    "Maldives",
    "Mauritania",
    "Mayotte",
    "Morocco",
    "Niger",
    "Republic of Guinea-Bissau",
    "Republic of the Congo",
    "Reunion",
    "Saint Helena",
    "Sao Tome and Principe",
    "Seychelles",
    "Swaziland",
    "Tunisia",
    "Afghanistan",
    "Albania",
    "American Samoa",
    "Anguilla",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belgium",
    "Belize",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bonaire/Netherlands Antilles",
    "Brazil",
    "British Virgin Islands",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Cambodia",
    "Canada",
    "Cayman Islands",
    "Chile",
    "Colombia",
    "Commonwealth of Dominica",
    "Comoros",
    "Cook Islands",
    "Costa Rica",
    "Cote D'Ivoire",
    "Croatia",
    "Cuba",
    "Curacao/Netherlands Antilles",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "Estonia",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "Georgia",
    "Germany",
    "Greece",
    "Grenada",
    "Guadeloupe",
    "Guatemala",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kiribati",
    "Korea",
    "Kuwait",
    "Kyrgyzstan",
    "LAO PDR",
    "Latvia",
    "Lebanon",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Malaysia",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Myanmar",
    "Nauru",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Niue",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "People's Republic of China",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of Belarus",
    "Republic of El Salvador",
    "Republic of Macedonia",
    "Republic of Nicaragua",
    "Romania",
    "Russian Federation",
    "Saba Island",
    "Saint Eustatius",
    "Saint Kitts And Nevis",
    "Samoa",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Singapore",
    "Slovak Republic",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "Spain",
    "Sri Lanka",
    "St. Barthelemy",
    "St. Croix",
    "St. Lucia",
    "St. Maarten",
    "St. Thomas",
    "St. Vincent",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Thailand",
    "Togo",
    "Tonga",
    "Tortola",
    "Trinidad and Tobago",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "UAE",
    "Ukraine",
    "United Kingdom",
    "Uruguay",
    "US Virgin Islands",
    "USA",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Wallis et Futuna",
    "Yemen",
    "Somaliland",

];


const addPort = async (portName, country, sortOrder) => {
    const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');

    // New country data
    const newCountryData = {
        [portName]: {
            country: country,
            sortOrder: sortOrder,
            method: '',
        }
    };

    // Set document with merge option
    try {
        await setDoc(docRef, newCountryData, { merge: true });
        console.log("Country added/updated successfully!");

    } catch (error) {
        console.error("Error adding/updating country: ", error);
    }
};


const addCountry = async (countryName, inspectionIsRequired, inspectionName, sortOrder) => {
    const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');

    // New country data
    const newCountryData = {
        [countryName]: {
            inspectionIsRequired: inspectionIsRequired,
            inspectionName: inspectionName,
            sortOrder: sortOrder
        }
    };

    // Set document with merge option
    try {
        await setDoc(docRef, newCountryData, { merge: true });
        console.log("Country added/updated successfully!");

    } catch (error) {
        console.error("Error adding/updating country: ", error);
    }
};

const AddCountryModal = ({ handleAddCountryModalClose }) => {

    const addCountryModalVisible = useSelector((state) => state.addCountryModalVisible);
    const inspectionIsRequiredData = useSelector((state) => state.inspectionIsRequiredData);
    const inspectionNameData = useSelector((state) => state.inspectionNameData);
    const inputCountryText = useRef(null);
    const textAreaAddInspectionIsRequired = useRef(null);
    const textAreaAddInspectionName = useRef(null);
    const dispatch = useDispatch();
    const toast = useToast();
    const [addButtonLoading, setAddButtonLoading] = useState(false);

    const handleAddInspectionIsRequiredTextChange = () => {
        const textAreaValue = textAreaAddInspectionIsRequired.current?.value;
        if (textAreaValue) {
            const newText = textAreaValue
                .split('\n')
                .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
                .join('\n');
            textAreaAddInspectionIsRequired.current.setNativeProps({ text: newText });
        }
    };

    const handleAddInspectionNameTextChange = () => {
        const textAreaValue = textAreaAddInspectionName.current?.value;
        if (textAreaValue) {
            const newText = textAreaValue
                .split('\n')
                .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
                .join('\n');
            textAreaAddInspectionName.current.setNativeProps({ text: newText });
        }
    };

    const handleAddButton = async () => {
        setAddButtonLoading(true);
        const countryCode = inputCountryText.current?.value;
        const formattedCountryCode = countryCode.replace(/\./g, '_');
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');

        if (inputCountryText.current?.value !== '') {
            try {
                await addCountry(formattedCountryCode, 'Not-Required', '', 999);
                const logData = {
                    message: `Country Added: "${nameVariable.text}" added country "${countryCode}" for Freight.`,
                    timestamp: formattedTime,
                    colorScheme: true,
                    keywords: [
                        formattedTime.toLowerCase(),
                        `Country Added: "${nameVariable.text}" added country "${countryCode}" for Freight.`.toLowerCase(),
                        'Country'.toLowerCase(),
                        'Country Added'.toLowerCase(),
                        'Added'.toLowerCase(),
                        'Freight'.toLowerCase(),
                        countryCode.toLowerCase(),
                        nameVariable.text.toLowerCase(),
                        year.toLowerCase(),
                        month.toLowerCase(),
                        monthWithDay.toLowerCase(),
                        date.toLowerCase(),
                        day.toLowerCase(),
                        time.toLowerCase(),
                    ],
                };

                addLogToCollection(logData);
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Country added successfully!</Text>
                        </View>;
                    }
                })
                dispatch(setAddCountryModalVisible(false));
                setAddButtonLoading(false);
            } catch (error) {
                console.error(error);
            }
        }

        else {
            setAddButtonLoading(false);
        }


    }

    const handleFirstModalClose = () => {
        dispatch(setAddCountryModalVisible(false));

    };
    const handleFirstModalOpen = () => {
        dispatch(setAddCountryModalVisible(true));
    }

    const filterInput = (inputRef) => {
        const currentValue = inputRef.current.value;
        const filteredValue = currentValue.replace(/[^a-zA-Z0-9. ]/g, '');
        if (currentValue !== filteredValue) {
            inputRef.current.setNativeProps({ text: filteredValue });
        }
    };
    return (
        <Modal
            isOpen={addCountryModalVisible}
            onClose={() => {
                handleAddCountryModalClose();
                inputCountryText.current.value = '';
            }}
            size={'md'}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header style={{ backgroundColor: '#7B9CFF', }}><Text color={'white'} fontSize={20} bold>Add Country</Text></Modal.Header>
                <Modal.Body >
                    <View style={{ marginVertical: 5, }}>
                        <View style={{ backgroundColor: '#7B9CFF', flex: 1, }}>
                            <Text bold color={'white'} marginLeft={1}>Country</Text>
                        </View>
                        <TextInput
                            ref={inputCountryText}
                            onChangeText={() => filterInput(inputCountryText)}
                            style={{
                                outlineStyle: 'none',
                                flex: 1,
                                padding: 5,
                                backgroundColor: 'white',
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5,
                                placeholderTextColor: '#ACADA3',
                                borderColor: '#D4D4D4',
                                borderWidth: 1,
                            }}
                            placeholder='Input Country' />

                    </View>


                </Modal.Body>
                <Modal.Footer >
                    <Button.Group variant="solid" space="2">
                        <Button colorScheme={'gray'} onPress={() => {
                            handleAddCountryModalClose();
                            inputCountryText.current.value = '';
                        }}>Cancel</Button>
                        {addButtonLoading ?
                            (<Spinner size="lg" color={'#16A34A'} />) :
                            (<Button colorScheme={'success'} onPress={handleAddButton}>Add</Button>)
                        }

                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>

    );

}

const NavigatePage = () => {
    const selectedButton = useSelector((state) => state.selectedButton);

    if (selectedButton === 'countries') {
        return <CountriesTable />;
    }
    if (selectedButton === 'ports') {
        return <PortsTable />;
    }
};


const AddPortsForCountriesModal = ({ handleAddPortsForCountriesModalClose, handleAddPortsForCountriesModalOpen }) => {

    const addPortsForCountriesModalVisible = useSelector((state) => state.addPortsForCountriesModalVisible);
    const countryPortsData = useSelector((state) => state.countryPortsData);
    const [data, setData] = useState([]);
    const [modalSortOpen, setModalSortOpen] = useState(false);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalAddSuccess, setModalAddSuccess] = useState(false);
    const [modalSave, setModalSave] = useState(false);
    const [modalSaveLoading, setModalSaveLoading] = useState(false);
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();

    useEffect(() => {
        // Replace dots with underscores in the country code
        const formattedCountryCode = selectedCountry.replace(/\./g, '_');

        // Reference to your document
        const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');

        // Listen for document updates
        const unsubscribe = onSnapshot(docRef, (documentSnapshot) => {
            if (documentSnapshot.exists()) {
                // Use bracket notation to access the property using the variable
                const countryData = documentSnapshot.data()[formattedCountryCode];
                // Make sure to check if countryData exists before trying to access its properties
                if (countryData && countryData.nearestPorts) {
                    const nearestPorts = countryData.nearestPorts;
                    setData(nearestPorts);

                }
                else {
                    setData([]);
                }
            } else {
                // documentSnapshot.data() will be undefined in this case

                console.log('No such document!');
            }
        },
            (error) => {
                // Handle the error
                console.error("Error getting document: ", error);
            });

        // Detach the listener when the component unmounts
        return () => unsubscribe();
    }, [addPortsForCountriesModalVisible]);

    const handleDeleteItemPress = useCallback(
        (item) => {
            setData((prevData) => {
                const updatedData = prevData.filter((value) => value !== item);
                return updatedData;
            });
        },
        []
    );

    const handleModalAddOpen = useCallback(() => {
        setModalAddOpen(true);
        handleAddPortsForCountriesModalClose();
        setModalIsLoading(true);
        // handleFirstModalClose();

    }, []);

    const handleModalAddClose = useCallback(() => {
        setModalAddOpen(false);
        dispatch(setAddPortsForCountriesModalVisible(true));
    }, []);

    const addPortForCountryField = async (newValue) => {
        // Specify the document reference
        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');
        setModalSaveLoading(true);
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');


        if (selectedPortForCountry.ports !== '') {
            const formattedCountryCode = selectedCountry.replace(/\./g, '_');
            const nearestPortsField = `${formattedCountryCode}.nearestPorts`;

            try {
                // Fetch the current nearestPorts array from Firestore
                const docSnap = await getDoc(documentRef);
                if (docSnap.exists()) {
                    const nearestPorts = docSnap.data()[formattedCountryCode]?.nearestPorts || [];

                    // Check if selectedPortForCountry is already in the nearestPorts array
                    if (!nearestPorts.includes(selectedPortForCountry.ports)) {
                        // Update the document with the new value
                        await updateDoc(documentRef, {
                            [nearestPortsField]: [...nearestPorts, selectedPortForCountry.ports]
                        });

                        const logData = {
                            message: `Nearest Ports Added: "${nameVariable.text}" added "${selectedPortForCountry.ports}" port to "${selectedCountry}"`,
                            timestamp: formattedTime,
                            colorScheme: true,
                            keywords: [
                                formattedTime.toLowerCase(),
                                `Nearest Ports Added: "${nameVariable.text}" added "${selectedPortForCountry.ports}" port to "${selectedCountry}"`.toLowerCase(),
                                'Nearest Ports'.toLowerCase(),
                                'Nearest'.toLowerCase(),
                                'Nearest Ports Added'.toLowerCase(),
                                'Ports'.toLowerCase(),
                                'Added'.toLowerCase(),
                                selectedPortForCountry.ports.toLowerCase(),
                                selectedCountry.toLowerCase(),
                                nameVariable.text.toLowerCase(),
                                year.toLowerCase(),
                                month.toLowerCase(),
                                monthWithDay.toLowerCase(),
                                date.toLowerCase(),
                                day.toLowerCase(),
                                time.toLowerCase(),
                            ],
                        };
                        addLogToCollection(logData);
                        handleAddPortsForCountriesModalClose();
                        toast.show({
                            render: () => {
                                return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                                    <Text style={{ color: 'white' }}>Nearest Ports added successfully</Text>
                                </View>;
                            }
                        })
                        console.log('Nearest Ports added successfully');
                        setModalSaveLoading(false);
                        handleModalAddClose();
                        // ...
                    } else {
                        // Handle the case where the port already exists
                        console.log('Port already exists in the nearest ports list');
                        setModalSaveLoading(false);

                        // You can show a message to the user here if needed
                    }
                } else {
                    console.log('No such document!');
                    setModalSaveLoading(false);
                }
            } catch (error) {
                console.error('Error updating inspection:', error);
                setModalSaveLoading(false);
                // Error handling...
            }
        }
        else {
            dispatch(setLoadingModalVisible(false));
            console.log(newValue);

        }

    };


    const updateCountryPortsField = async (newValue) => {
        // Specify the document reference
        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');
        setModalSaveLoading(true);
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');


        if (newValue !== '') {
            // Replace dots with underscores in the countryCode if the keys in Firestore use underscores
            // If your keys can contain dots and are used as such in Firestore, do not replace with underscores.
            const formattedCountryCode = selectedCountry.replace(/\./g, '_'); // Replace dots with underscores or any other valid character

            // Specify the field using dot notation for the nested field
            const nearestPortsField = `${formattedCountryCode}.nearestPorts`;

            try {


                await updateDoc(documentRef, {
                    [nearestPortsField]: newValue
                });

                dispatch(setLoadingModalVisible(false));
                const logData = {
                    message: `Nearest Ports Updated: "${nameVariable.text}" updated "${selectedCountry}" nearest ports`,
                    timestamp: formattedTime,
                    colorScheme: true,
                    keywords: [
                        formattedTime.toLowerCase(),
                        `Nearest Ports Updated: "${nameVariable.text}" updated "${selectedCountry}" nearest ports`.toLowerCase(),
                        'Nearest Ports'.toLowerCase(),
                        'Nearest'.toLowerCase(),
                        'Nearest Ports Updated'.toLowerCase(),
                        'Ports'.toLowerCase(),
                        'Updated'.toLowerCase(),
                        selectedCountry.toLowerCase(),
                        nameVariable.text.toLowerCase(),
                        year.toLowerCase(),
                        month.toLowerCase(),
                        monthWithDay.toLowerCase(),
                        date.toLowerCase(),
                        day.toLowerCase(),
                        time.toLowerCase(),
                    ],
                };
                addLogToCollection(logData);
                handleAddPortsForCountriesModalClose();
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Nearest Ports updated successfully</Text>
                        </View>;
                    }
                })
                console.log('Nearest Ports updated successfully');
                setModalSaveLoading(false);

                // Perform the update

            } catch (error) {
                console.error('Error updating inspection:', error);
                setModalSaveLoading(false);
            }
        }
        else {
            dispatch(setLoadingModalVisible(false));
            console.log(newValue);

        }

    };



    return (
        <><Modal
            isOpen={addPortsForCountriesModalVisible}
            onClose={handleAddPortsForCountriesModalClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header borderBottomWidth={0}>
                    <Text color={'#102A43'} bold>Manage ports for {selectedCountry}</Text>
                </Modal.Header>
                <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1}>
                    <View style={{ width: '100%' }}>
                        <View style={{ alignItems: 'flex-end', }}>
                            <TouchableOpacity onPress={handleModalAddOpen}><Icon as={<FontAwesome name="plus-circle" />} size={5} color="#102A43" /></TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#102A43', borderRadius: 5, }}>
                            <DraggableFlatList
                                style={{ alignContent: 'center', flex: 1, }}
                                data={data}
                                keyExtractor={(item) => item}
                                renderItem={({ item, drag }) => (

                                    <View style={{
                                        flex: 1,
                                        backgroundColor: 'rgba(16,42,67, 0.5)',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#A8A29E',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <TouchableOpacity onPress={() => handleDeleteItemPress(item)}><Icon as={<AntDesign name="minuscircle" />} size={4} color="#102A43" /></TouchableOpacity>
                                        <Text flex={1} textAlign={'center'} color={'white'}>{item}</Text>
                                        <TouchableOpacity onPressIn={drag}><Icon as={<Entypo name="menu" />} size={4} color="#102A43" /></TouchableOpacity>
                                    </View>

                                )}
                                onDragEnd={useCallback(({ data }) => setData(data), [])} />


                        </View>

                    </View>
                </Modal.Body>
                <Modal.Footer borderTopWidth={0}>
                    <HStack space={5} flex={1}>
                        <Button onPress={handleAddPortsForCountriesModalClose} colorScheme={'muted'} flex={1} size={'sm'} borderRadius={5}>Close</Button>
                        {modalSaveLoading ?
                            (<Button flex={1} size={'sm'} borderRadius={5} colorScheme={'success'} disabled>
                                <Spinner size={18} color={'white'} flex={1} borderRadius={5} />
                            </Button>) :
                            (<Button onPress={() => updateCountryPortsField(data)} flex={1} size={'sm'} borderRadius={5} colorScheme={'success'}>Save</Button>)
                        }

                    </HStack>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
            <Modal
                isOpen={modalAddOpen}
                onClose={handleModalAddClose}
            // initialFocusRef={textAreaAdd}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header borderBottomWidth={0}>
                        <Text color={'#102A43'} bold>Add Ports for {selectedCountry}</Text>
                    </Modal.Header>
                    <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1}>
                        <SearchablePortDropdown modalAddOpen={modalAddOpen} />

                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0}>
                        <HStack space={5} flex={1}>
                            <Button onPress={handleModalAddClose} colorScheme={'muted'} flex={1} size={'sm'} borderRadius={5}>Close</Button>
                            <Button onPress={() => addPortForCountryField()} isLoading={modalSaveLoading ? true : false} flex={1} size={'sm'} borderRadius={5} colorScheme={'success'}>Add</Button>
                        </HStack>
                    </Modal.Footer>
                </Modal.Content>
            </Modal></>
    );

}

const DeleteCountryModal = ({ handleDeleteCountryModalClose }) => {
    const deleteCountryModalVisible = useSelector((state) => state.deleteCountryModalVisible);
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleDeleteCountry = async () => {
        setButtonLoading(true);
        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');
        const formattedFieldCode = selectedCountry.replace(/\./g, '_');

        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        updateDoc(documentRef, {
            [formattedFieldCode]: deleteField()
        })
            .then(() => {
                console.log('Field deleted successfully');
                handleDeleteCountryModalClose();
                setButtonLoading(false);
                const logData = {
                    message: `Country Deleted: "${nameVariable.text}" deleted country "${selectedCountry}" for Freight.`,
                    timestamp: formattedTime,
                    colorScheme: false,
                    keywords: [
                        formattedTime.toLowerCase(),
                        `Country Deleted: "${nameVariable.text}" deleted country "${selectedCountry}" for Freight.`.toLowerCase(),
                        'Country'.toLowerCase(),
                        'Country Deleted'.toLowerCase(),
                        'Deleted'.toLowerCase(),
                        'Freight'.toLowerCase(),
                        selectedCountry.toLowerCase(),
                        nameVariable.text.toLowerCase(),
                        year.toLowerCase(),
                        month.toLowerCase(),
                        monthWithDay.toLowerCase(),
                        date.toLowerCase(),
                        day.toLowerCase(),
                        time.toLowerCase(),
                    ],
                };

                addLogToCollection(logData);
            })
            .catch((error) => {
                console.error('Error deleting field: ', error);
            });

    }

    return (

        <Modal isOpen={deleteCountryModalVisible} onClose={handleDeleteCountryModalClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Delete Country?</Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the selected country?
                </Modal.Body>
                <Modal.Footer>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: '#525252', padding: 5, borderRadius: 5, margin: 5, }}
                            onPress={handleDeleteCountryModalClose}
                        >
                            <Text style={{ color: 'white', alignSelf: 'center', }}>No</Text>
                        </TouchableOpacity>
                        {buttonLoading ?
                            (<TouchableOpacity
                                style={{ flex: 1, backgroundColor: '#DC2626', padding: 5, borderRadius: 5, margin: 5, }}
                            ><Spinner size={18} color={'white'} />
                            </TouchableOpacity>) :
                            (<TouchableOpacity
                                style={{ flex: 1, backgroundColor: '#DC2626', padding: 5, borderRadius: 5, margin: 5, }}
                                onPress={handleDeleteCountry}
                            >
                                <Text style={{ color: 'white', alignSelf: 'center', }}>Yes</Text>
                            </TouchableOpacity>)
                        }


                    </View>
                </Modal.Footer>
            </Modal.Content>
        </Modal>


    );
}

const CountriesTable = () => {


    const dispatch = useDispatch();

    const optionsPerPage = [10, 20, 50];
    const inspectionIsRequiredData = useSelector((state) => state.inspectionIsRequiredData);
    const inspectionNameData = useSelector((state) => state.inspectionNameData);
    const [data, setData] = useState([]); // This will hold all the countries data   
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const inputSearchRef = useRef(null);
    const inputSortOrder = useRef([]);
    const toast = useToast();
    const textAreaAddInspectionIsRequired = useRef(null);
    const textAreaAddInspectionName = useRef(null);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const filtered = useMemo(() => {
        return data.filter((item) =>
            item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.inspectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.inspectionIsRequired.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sortOrder.toString().includes(searchQuery)
        );
    }, [searchQuery, data]);

    const paginatedData = useMemo(() => {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }, [page, itemsPerPage, searchQuery, data, filtered]);


    const handleSearch = debounce(() => {
        setSearchQuery(inputSearchRef.current?.value);
    }, 50);

    const startIndex = page * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    // useEffect(() => {
    //     const addCountriesToFirestore = async () => {
    //         // Create a new list with dots replaced by underscores
    //         const sanitizedCountriesList = countriesList.map(country =>
    //             country.replace(/\./g, '_')
    //         );

    //         for (const [index, country] of sanitizedCountriesList.entries()) {
    //             // The index of an array is zero-based, to make it one-based add 1
    //             // (If you really need a one-based index, otherwise just use index)
    //             const sortOrder = index;
    //             try {
    //                 await addCountry(country, 'Not-Required', '', sortOrder);
    //             } catch (error) {
    //                 console.error(`Error adding country: ${country}`, error);
    //                 // Optionally handle the error by stopping the loop, or continue to the next iteration
    //                 // break; // Stop the loop if an error occurs
    //                 // continue; // Skip to the next iteration
    //             }
    //             // Optionally add a delay here if necessary
    //             // await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    //         }
    //     };

    //     addCountriesToFirestore();
    // }, []);
    const handleAddInspectionNameTextChange = () => {
        const textAreaValue = textAreaAddInspectionName.current?.value;
        if (textAreaValue) {
            const newText = textAreaValue
                .split('\n')
                .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
                .join('\n');
            textAreaAddInspectionName.current.setNativeProps({ text: newText });
        }
    };

    const handleAddInspectionIsRequiredTextChange = () => {
        const textAreaValue = textAreaAddInspectionIsRequired.current?.value;
        if (textAreaValue) {
            const newText = textAreaValue
                .split('\n')
                .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
                .join('\n');
            textAreaAddInspectionIsRequired.current.setNativeProps({ text: newText });
        }
    };


    useEffect(() => {
        const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');
        dispatch(setLoadingModalVisible(true));

        // This will start the listener
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const formattedData = Object.keys(data)
                    .map(key => ({
                        country: key.replace(/_/g, '.'),
                        ...data[key],
                    }))
                    .sort((a, b) => a.sortOrder - b.sortOrder); // Sorting based on the sortOrder field
                setData(formattedData);
                setFilteredData(formattedData);
                dispatch(setLoadingModalVisible(false));
            } else {
                console.log("No such document!");

            }
        }, (error) => {
            console.error("Error fetching countries: ", error);

        });

        // This will unsubscribe from the listener when the component is unmounted
        return () => unsubscribe();
    }, []);


    const handleAddCountryModalOpen = () => {

        dispatch(setAddCountryModalVisible(true));

    }

    const handleAddCountryModalClose = () => {

        dispatch(setAddCountryModalVisible(false));

    }


    const handleAddPortsForCountriesModalOpen = (nearestPorts, country) => {

        dispatch(setAddPortsForCountriesModalVisible(true));
        dispatch(setCountryPortsData(nearestPorts));
        // setSelectedCountry(selectedCountry);
        selectedCountry = country;
    }


    const handleAddPortsForCountriesModalClose = () => {

        dispatch(setAddPortsForCountriesModalVisible(false));
    }

    useEffect(() => {
        paginatedData.forEach(item => {
            inputSortOrder.current[item.country].value = item.sortOrder ? item.sortOrder : 0;
        });
        // setInputMemoValues(initialValues);

    }, [paginatedData, screenWidth]); // Run this effect when 'items' changes
    // Now, to update a specific field

    const updateCountrySortOrder = async (countryCode, newValue, inputRef) => {
        // Specify the document reference
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');

        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');
        dispatch(setLoadingModalVisible(true));
        if (newValue !== '') {
            // Replace dots with underscores in the countryCode if the keys in Firestore use underscores
            // If your keys can contain dots and are used as such in Firestore, do not replace with underscores.
            const formattedCountryCode = countryCode.replace(/\./g, '_'); // Replace dots with underscores or any other valid character

            // Specify the field using dot notation for the nested field
            const sortOrderField = `${formattedCountryCode}.sortOrder`;

            try {
                // Perform the update
                await updateDoc(documentRef, {
                    [sortOrderField]: newValue
                });



                const logData = {
                    message: `Sort Order Updated: "${nameVariable.text}" updated "${countryCode}" sort order to "${newValue}".`,
                    timestamp: formattedTime,
                    colorScheme: true,
                    keywords: [
                        formattedTime.toLowerCase(),
                        `Sort Order Updated: "${nameVariable.text}" updated "${countryCode}" sort order to "${newValue}"`.toLowerCase(),
                        'Sort'.toLowerCase(),
                        'Sort Order'.toLowerCase(),
                        'Sort Order Updated'.toLowerCase(),
                        'Order Updated'.toLowerCase(),
                        'Order'.toLowerCase(),
                        'Updated'.toLowerCase(),
                        countryCode.toLowerCase(),
                        nameVariable.text.toLowerCase(),
                        year.toLowerCase(),
                        month.toLowerCase(),
                        monthWithDay.toLowerCase(),
                        date.toLowerCase(),
                        day.toLowerCase(),
                        time.toLowerCase(),
                    ],
                };
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Sort order updated successfully!</Text>
                        </View>;
                    }
                })
                addLogToCollection(logData);
                dispatch(setLoadingModalVisible(false));
                console.log('Sort order updated successfully');
            } catch (error) {
                console.error('Error updating sort order:', error);

            }
        }
        else {
            dispatch(setLoadingModalVisible(false));

        }

    };
    // Call the function to update the field




    const handleSortOrderTextChange = (text, item) => {
        // Remove any non-numeric characters from the input text and limit to 3 digits
        const numericValue = text.replace(/[^0-9]/g, '').slice(0, 3);

        inputSortOrder.current[item.country].value = numericValue;

    };




    const handleDeleteCountryModalOpen = (selectedValue) => {

        dispatch(setDeleteCountryModalVisible(true));
        selectedCountry = selectedValue;

    }

    const handleDeleteCountryModalClose = () => {

        dispatch(setDeleteCountryModalVisible(false));

    }

    const handleUpdateInsurance = async (newValue, currentValue, countryCode) => {

        // Specify the document reference
        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'CountriesDoc');
        dispatch(setLoadingModalVisible(true));
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        if (newValue !== '') {
            // Replace dots with underscores in the countryCode if the keys in Firestore use underscores
            // If your keys can contain dots and are used as such in Firestore, do not replace with underscores.
            const formattedCountryCode = countryCode.replace(/\./g, '_'); // Replace dots with underscores or any other valid character

            // Specify the field using dot notation for the nested field
            const insuranceField = `${formattedCountryCode}.insuranceRestricted`;

            try {
                if (currentValue == newValue) {

                    dispatch(setLoadingModalVisible(false));

                }
                else {

                    await updateDoc(documentRef, {
                        [insuranceField]: newValue,
                    });

                    dispatch(setLoadingModalVisible(false));
                    const logData = {
                        message: `Insurance Updated: "${nameVariable.text}" updated "${countryCode}" insurance restriction to "${newValue}"`,
                        timestamp: formattedTime,
                        colorScheme: true,
                        keywords: [
                            formattedTime.toLowerCase(),
                            `Insurance Updated: "${nameVariable.text}" updated "${countryCode}" insurance restriction  to "${newValue}"`.toLowerCase(),
                            'Insurance'.toLowerCase(),
                            'Inspection'.toLowerCase(),
                            'Insurance Updated'.toLowerCase(),
                            'Updated'.toLowerCase(),
                            newValue.toString().toLowerCase(),
                            countryCode.toLowerCase(),
                            nameVariable.text.toLowerCase(),
                            year.toLowerCase(),
                            month.toLowerCase(),
                            monthWithDay.toLowerCase(),
                            date.toLowerCase(),
                            day.toLowerCase(),
                            time.toLowerCase(),
                        ],
                    };
                    addLogToCollection(logData);
                    toast.show({
                        render: () => {
                            return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                                <Text style={{ color: 'white' }}>Insurance updated successfully</Text>
                            </View>;
                        }
                    })
                    console.log('Insurance updated successfully');
                }
                // Perform the update

            } catch (error) {
                console.error('Error updating inspection:', error);
            }
        }
        else {
            dispatch(setLoadingModalVisible(false));

        }

    }

    return (
        <>
            {screenWidth >= 1280 ? (
                <View style={{ flex: 1, }}>
                    {/* Search Bar */}
                    <View style={{ padding: 10 }}>
                        <TextInput
                            ref={inputSearchRef}
                            onSubmitEditing={handleSearch}
                            style={{ outlineStyle: 'none', padding: 10, backgroundColor: 'white', borderRadius: 5, placeholderTextColor: '#ACADA3' }}
                            placeholder='Search'
                            returnKeyType='search'
                            autoCapitalize='none'
                        />
                    </View>

                    {/* Add Country Button */}
                    <View style={{ paddingHorizontal: 10, paddingTop: 0, paddingBottom: 0, alignItems: 'flex-start' }}>
                        <TouchableOpacity
                            onPress={handleAddCountryModalOpen}
                            style={{
                                borderRadius: 5,
                                padding: 10,
                                borderWidth: 1,
                                borderColor: 'white',
                                backgroundColor: '#16A34A',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons name="add" size={20} color={'white'} />
                            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>Add Country</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Table Headers */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderBottomColor: '#E4E4E7',
                            backgroundColor: '#0642F4',
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 10,
                        }}
                    >
                        <View style={{ flex: 1, padding: 2, }}>
                            <Text style={{ color: 'white', }} bold>Country</Text>
                        </View>
                        <View style={{ flex: screenWidth < 1700 ? 2 : 1, padding: 2, }}>
                            <Text style={{ color: 'white', }} bold>Sort Order</Text>
                        </View>
                        <View style={{ flex: screenWidth < 1700 ? 2 : 1, padding: 2, flexDirection: 'row', }}>
                            <SortAndAddModal
                                collectionName='CustomerCountryPort'
                                docName='InspectionIsRequiredDoc'
                                handleAddTextChange={handleAddInspectionIsRequiredTextChange}
                                textAreaAdd={textAreaAddInspectionIsRequired}
                                title='Inspection'
                                dataName={'inspectionIsRequiredData'}
                                databaseInit={projectExtensionFirestore}
                                headerText="Rearrange/Add Inspection"
                                data={inspectionIsRequiredData}
                            />
                            <Text flex={1} style={{ color: 'white', }} bold>Inspection</Text>
                        </View>
                        <View style={{ flex: screenWidth < 1700 ? 2 : 1, padding: 2, flexDirection: 'row', }}>
                            <SortAndAddModal
                                collectionName='CustomerCountryPort'
                                docName='InspectionNameDoc'
                                handleAddTextChange={handleAddInspectionNameTextChange}
                                textAreaAdd={textAreaAddInspectionName}
                                title='Inspection Name'
                                dataName={'inspectionNameData'}
                                databaseInit={projectExtensionFirestore}
                                headerText="Rearrange/Add Inspection"
                                data={inspectionNameData}
                            />
                            <Text style={{ color: 'white', }} bold>Inspection Name</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', alignSelf: 'center', }} bold>Insurance</Text>
                        </View>
                        <View style={{ flex: screenWidth < 1700 ? 2 : 1, padding: 2 }}>
                            <Text style={{ color: 'white', alignSelf: 'center', }} bold>Nearest Port</Text>
                        </View>

                        <View style={{ flex: 1, padding: 2, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ color: 'white', }} bold>Operate</Text>
                        </View>

                    </View>

                    <DataTable margin={[0, 0, 0, 1, 1, 1]}>
                        {paginatedData.map((item, index) => (
                            <View
                                key={index}
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
                                <Text style={{ flex: 1, marginHorizontal: 5 }} selectable>{item.country}</Text>
                                <View style={{ flex: screenWidth < 1700 ? 2 : 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 5, }}>
                                    {/* <Text style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, alignSelf: 'center', backgroundColor: 'white', padding: 8 }}>{item.sortOrder}→</Text> */}
                                    <TextInput
                                        ref={(ref) => (inputSortOrder.current[item.country] = ref)}
                                        style={{ outlineStyle: 'none', padding: 5, width: '20%', backgroundColor: 'white', borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                        onSubmitEditing={() => updateCountrySortOrder(item.country, inputSortOrder.current[item.country].value, inputSortOrder)}
                                        onChangeText={(text) => handleSortOrderTextChange(text, item)}
                                    />
                                    <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => updateCountrySortOrder(item.country, inputSortOrder.current[item.country].value, inputSortOrder)}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#16A34A',
                                                borderRadius: 5,
                                                padding: 5,
                                                margin: 2,
                                                alignSelf: 'center',
                                            }}>
                                            <MaterialIcons name='update' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>

                                </View>
                                {/* <Text style={{ flex: 1, marginHorizontal: 5 }}>{item.inspectionIsRequired}</Text> */}
                                <View style={{ flex: screenWidth < 1700 ? 2 : 1, marginHorizontal: 5 }}>
                                    <SelectInspectionIsRequired width={'70%'} defaultValue={item.inspectionIsRequired} countryCode={item.country} page={page} searchQuery={searchQuery} />

                                </View>
                                <View style={{ flex: screenWidth < 1700 ? 2 : 1, marginHorizontal: 5 }}>
                                    <SelectInspectionName width={'70%'} defaultValue={item.inspectionName} countryCode={item.country} page={page} searchQuery={searchQuery} />
                                </View>

                                <View style={{ flex: 1, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', }}>
                                    <BouncyCheckbox
                                        iconStyle={{
                                            borderColor: 'white',
                                        }}
                                        size={25}
                                        fillColor="transparent"
                                        unfillColor="#16A34A"
                                        isChecked={item.insuranceRestricted ? item.insuranceRestricted : false}
                                        onPress={(isChecked) => handleUpdateInsurance(isChecked, item.insuranceRestricted ? item.insuranceRestricted : false, item.country)}
                                        iconComponent={item.insuranceRestricted ? (
                                            <View style={{ backgroundColor: '#DC2626', borderRadius: 12.5, width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }}>
                                                <Ionicons name="close" size={20} color="white" />
                                            </View>
                                        ) : null}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', flex: screenWidth < 1700 ? 2 : 1, marginHorizontal: 5 }}>
                                    <TouchableOpacity
                                        onPress={() => handleAddPortsForCountriesModalOpen(item.nearestPorts ? item.nearestPorts : [], item.country)}
                                        style={{ flex: 1, backgroundColor: '#0891B2', padding: 5, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5, }}
                                    >
                                        <MaterialIcons
                                            name="directions-boat" // The icon name from MaterialIcons
                                            size={20} // Set the size of the icon
                                            color={'white'} // Set the color based on active state
                                        />
                                        <Text style={{ alignSelf: 'center', color: 'white', marginLeft: 3, }}>View Ports</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={{ flex: 1 }}>
                                <Text>Add Ports</Text>
                            </TouchableOpacity> */}
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, justifyContent: 'center', alignItems: 'center', }}>

                                    <View style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => handleDeleteCountryModalOpen(item.country)}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#DC2626',
                                                borderRadius: 5,
                                                padding: 10,
                                                alignSelf: 'center',
                                                height: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <AntDesign name='delete' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                {/* You can add the mapping for nearestPorts here, assuming nearestPorts is an array */}
                                {/* {item.nearestPorts && item.nearestPorts.map((port, portIndex) => (
            <Text key={portIndex}>Nearest Port: {port}</Text>
          ))} */}
                            </View>
                        ))}
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
                    <AddCountryModal handleAddCountryModalClose={handleAddCountryModalClose} />
                    <AddPortsForCountriesModal handleAddPortsForCountriesModalClose={handleAddPortsForCountriesModalClose} handleAddPortsForCountriesModalOpen={handleAddPortsForCountriesModalOpen} />
                    <DeleteCountryModal handleDeleteCountryModalClose={handleDeleteCountryModalClose} />
                </View>
            ) :

                (
                    //Countries Table Mobile View
                    <View style={{ flex: 1, }}>
                        {/* Search Bar */}
                        <View style={{ padding: 10 }}>
                            <TextInput
                                ref={inputSearchRef}
                                onSubmitEditing={handleSearch}
                                style={{ outlineStyle: 'none', padding: 10, backgroundColor: 'white', borderRadius: 5, placeholderTextColor: '#ACADA3' }}
                                placeholder='Search'
                                returnKeyType='search'
                                autoCapitalize='none'
                            />
                        </View>

                        <View style={{ paddingHorizontal: 10, paddingTop: 0, paddingBottom: 0, alignItems: 'flex-start' }}>
                            <TouchableOpacity
                                onPress={handleAddCountryModalOpen}
                                style={{
                                    borderRadius: 5,
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: 'white',
                                    backgroundColor: '#16A34A',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MaterialIcons name="add" size={20} color={'white'} />
                                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>Add Country</Text>
                            </TouchableOpacity>
                        </View>


                        {/* Table Headers */}


                        <DataTable margin={[0, 0, 0, 1, 1, 1]}>
                            {paginatedData.map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        borderWidth: 1,
                                        borderColor: '#E4E4E7',
                                        backgroundColor: '#BFDBFE',
                                        margin: 10,
                                    }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Country</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <Text selectable style={{ marginLeft: 3 }}>{item.country}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Sort Order</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            {/* <Text style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5, alignSelf: 'center', backgroundColor: 'white', padding: 8 }}>{item.sortOrder}→</Text> */}
                                            <TextInput
                                                ref={(ref) => (inputSortOrder.current[item.country] = ref)}
                                                style={{ outlineStyle: 'none', padding: 5, width: '100%', backgroundColor: 'white', borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                                onSubmitEditing={() => updateCountrySortOrder(item.country, inputSortOrder.current[item.country].value, inputSortOrder)}
                                                onChangeText={(text) => handleSortOrderTextChange(text, item)}
                                            />
                                            <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                <TouchableHighlight
                                                    onPress={() => updateCountrySortOrder(item.country, inputSortOrder.current[item.country].value, inputSortOrder)}
                                                    underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                    style={{
                                                        backgroundColor: '#16A34A',
                                                        borderRadius: 5,
                                                        padding: 5,
                                                        margin: 2,
                                                        alignSelf: 'center',
                                                    }}>
                                                    <MaterialIcons name='update' color='white' size={22} />
                                                </TouchableHighlight>
                                            </View>

                                        </View>
                                    </View>


                                    {/* <Text style={{ flex: 1, marginHorizontal: 5 }}>{item.inspectionIsRequired}</Text> */}

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Inspection</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <SelectInspectionIsRequired width={'100%'} defaultValue={item.inspectionIsRequired} countryCode={item.country} page={page} searchQuery={searchQuery} />

                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Inspection Name</Text>
                                        </View>

                                        <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <SelectInspectionName width={'100%'} defaultValue={item.inspectionName} countryCode={item.country} page={page} searchQuery={searchQuery} />
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Insurance</Text>
                                        </View>

                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <BouncyCheckbox
                                                iconStyle={{
                                                    borderColor: 'white',
                                                }}
                                                size={25}
                                                fillColor="transparent"
                                                unfillColor="#16A34A"
                                                isChecked={item.insuranceRestricted ? item.insuranceRestricted : false}
                                                onPress={(isChecked) => handleUpdateInsurance(isChecked, item.insuranceRestricted ? item.insuranceRestricted : false, item.country)}
                                                iconComponent={item.insuranceRestricted ? (
                                                    <View style={{ backgroundColor: '#DC2626', borderRadius: 12.5, width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Ionicons name="close" size={20} color="white" />
                                                    </View>
                                                ) : null}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Nearest Port</Text>
                                        </View>

                                        <View style={{ flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 5 }}>
                                                <TouchableOpacity
                                                    onPress={() => handleAddPortsForCountriesModalOpen(item.nearestPorts ? item.nearestPorts : [], item.country)}
                                                    style={{ flex: 1, backgroundColor: '#0891B2', padding: 5, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5, }}
                                                >
                                                    <MaterialIcons
                                                        name="directions-boat" // The icon name from MaterialIcons
                                                        size={20} // Set the size of the icon
                                                        color={'white'} // Set the color based on active state
                                                    />
                                                    <Text style={{ alignSelf: 'center', color: 'white', marginLeft: 3, }}>View Ports</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Operate</Text>
                                        </View>

                                        <View style={{ flex: 1, justifyContent: 'center', }}>
                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, }}>

                                                <View style={{ flex: 1, borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                    <TouchableHighlight
                                                        onPress={() => handleDeleteCountryModalOpen(item.country)}
                                                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                        style={{ flex: 1, backgroundColor: '#DC2626', padding: 5, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 6, }}>
                                                        <AntDesign name='delete' color='white' size={22} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            ))}
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
                        <AddCountryModal handleAddCountryModalClose={handleAddCountryModalClose} />
                        <AddPortsForCountriesModal handleAddPortsForCountriesModalClose={handleAddPortsForCountriesModalClose} handleAddPortsForCountriesModalOpen={handleAddPortsForCountriesModalOpen} />
                        <DeleteCountryModal handleDeleteCountryModalClose={handleDeleteCountryModalClose} />
                    </View>
                )}


        </>

    );

}

const portsList = {
    "Dar es Salaam": { country: "Tanzania" },
    "Durban": { country: "Republic of South Africa" },
    "Maputo": { country: "Mozambique" },
    "Abidjan": { country: "Cote D'Ivoire" },
    "Mombasa": { country: "Kenya" },
    "Lusaka": { country: "Zambia" },
    "Matadi": { country: "D.R. Congo" },
    "Zanzibar": { country: "Tanzania" },
    "St. John's": { country: "Antigua and Barbuda" },
    "Aarhus": { country: "Denmark" },
    "Abadan": { country: "Iran" },
    "Abu Dhabi": { country: "United Arab Emirates" },
    "Acapulco": { country: "Mexico" },
    "Adelaide": { country: "Australia" },
    "Aden": { country: "Yemen" },
    "Al Khobar": { country: "Saudi Arabia" },
    "Al Ladhiqiyah": { country: "Syria" },
    "Al Mukalla": { country: "Yemen" },
    "Al Qusayr": { country: "Egypt" },
    "Al Ruwais": { country: "Qatar" },
    "Alexandria": { country: "Egypt" },
    "Algiers": { country: "Algeria" },
    "Antwerp": { country: "Belgium" },
    "Apia": { country: "Samoa" },
    "Aqaba": { country: "Jordan" },
    "Arwad": { country: "Syria" },
    "As Salif": { country: "Yemen" },
    "Ash Shihr": { country: "Yemen" },
    "Ashdod": { country: "Israel" },
    "Ashgabat": { country: "Turkmenistan" },
    "Ashkelon": { country: "Israel" },
    "Assab": { country: "Eritrea" },
    "Assumption Island": { country: "Seychelles" },
    "Asunción": { country: "Paraguay" },
    "Auckland": { country: "New Zealand" },
    "Avarua": { country: "Cook Islands" },
    "Balboa": { country: "Panama" },
    "Balhaf": { country: "Yemen" },
    "Banana": { country: "D.R.Congo" },
    "Bandar Abbas": { country: "Iran" },
    "Bandar Seri Begawan": { country: "Brunei Darussalam" },
    "Bangkok": { country: "Thailand" },
    "Baniyas": { country: "Syria" },
    "Banjul": { country: "Gambia" },
    "Bar": { country: "Montenegro" },
    "Barcelona": { country: "Spain" },
    "Barranquilla": { country: "Colombia" },
    "Basra": { country: "Iraq" },
    "Basse-Terre": { country: "Guadeloupe" },
    "Batroun": { country: "Lebanon" },
    "Batumi": { country: "Georgia" },
    "Beira": { country: "Mozambique" },
    "Beirut": { country: "Lebanon" },
    "Belize City": { country: "Belize" },
    "Benghazi": { country: "Libya" },
    "Berbera": { country: "Somalia" },
    "Berbera": { country: "Somaliland" },
    "Bissau": { country: "Guinea-Bissau" },
    "Bissau": { country: "Republic of Guinea-Bissau" },
    "Blantyre": { country: "Malawi" },
    "Bo": { country: "Sierra Leone" },
    "Boma": { country: "D.R.Congo" },
    "Bosaso": { country: "Somalia" },
    "Brava": { country: "Somalia" },
    "Brazzaville": { country: "Republic of the Congo" },
    "Bridgetown": { country: "Barbados" },
    "Brisbane": { country: "Australia" },
    "Buchanan": { country: "Liberia" },
    "Bucharest": { country: "Romania" },
    "Buenos Aires": { country: "Argentina" },
    "Busan": { country: "South Korea" },
    "Byblos": { country: "Lebanon" },
    "Cabinda": { country: "Angola" },
    "Calabar": { country: "Nigeria" },
    "Calais": { country: "France" },
    "Callao": { country: "Peru" },
    "Cap-Haitien": { country: "Haiti" },
    "Cape Town": { country: "South Africa" },
    "Caracas": { country: "Venezuela" },
    "Cartagena": { country: "Colombia" },
    "Casablanca": { country: "Morocco" },
    "Cayenne": { country: "French Guiana" },
    "Cebu": { country: "Philippines" },
    "Chabahar": { country: "Iran" },
    "Charlotte Amalie": { country: "US Virgin Islands" },
    "Chekka": { country: "Lebanon" },
    "Chisinau": { country: "Moldova" },
    "Chittagong": { country: "Bangladesh" },
    "Christchurch": { country: "New Zealand" },
    "Colombo": { country: "Sri Lanka" },
    "Colonia": { country: "Micronesia" },
    "Comoros": { country: "Comoros" },
    "Conakry": { country: "Guinea" },
    "Constanta": { country: "Romania" },
    "Constanța": { country: "Romania" },
    "Copenhagen": { country: "Denmark" },
    "Cork": { country: "Ireland" },
    "Cotonou": { country: "Benin" },
    "Cristóbal": { country: "Panama" },
    "Dakar": { country: "Senegal" },
    "Dammam": { country: "Saudi Arabia" },
    "Darwin": { country: "Australia" },
    "Diego Suarez (Antsiranana)": { country: "Madagascar" },
    "Dili": { country: "East Timor" },
    "Djibouti": { country: "Djibouti" },
    "Doha": { country: "Qatar" },
    "Doraleh": { country: "Djibouti" },
    "Douala": { country: "Cameroon" },
    "Dubai": { country: "UAE" },
    "Dublin": { country: "Ireland" },
    "Duqm": { country: "Oman" },
    "Durrës": { country: "Albania" },
    "Dzaoudzi": { country: "Mayotte" },
    "Ehoala": { country: "Madagascar" },
    "Eil": { country: "Somalia" },
    "Eilat": { country: "Israel" },
    "El Arish": { country: "Egypt" },
    "El Ma'an": { country: "Somalia" },
    "El Tor": { country: "Egypt" },
    "Famagusta": { country: "Cyprus" },
    "Freeport": { country: "Bahamas" },
    "Freetown": { country: "Sierra Leone" },
    "Fremantle": { country: "Australia" },
    "Funafuti": { country: "Tuvalu" },
    "Garoua": { country: "Cameroon" },
    "Gdansk": { country: "Poland" },
    "Gdańsk": { country: "Poland" },
    "Gdynia": { country: "Poland" },
    "Genoa": { country: "Italy" },
    "George Town": { country: "Cayman Islands" },
    "Georgetown": { country: "Guyana" },
    "Gizo": { country: "Solomon Islands" },
    "Gothenburg": { country: "Sweden" },
    "Grand Turk": { country: "Turks and Caicos Islands" },
    "Greenville": { country: "Liberia" },
    "Guangzhou": { country: "Peoples Republic of China" },
    "Guayaquil": { country: "Ecuador" },
    "Gwadar": { country: "Pakistan" },
    "Gydnia": { country: "Poland" },
    "Hadera": { country: "Israel" },
    "Haifa": { country: "Israel" },
    "Hamburg": { country: "Germany" },
    "Hamilton": { country: "Bermuda" },
    "Hargeisa": { country: "Somaliland" },
    "Harper": { country: "Liberia" },
    "Havana": { country: "Cuba" },
    "Helsinki": { country: "Finland" },
    "Ho Chi Minh City": { country: "Vietnam" },
    "Hobyo": { country: "Somalia" },
    "Hodeida": { country: "Yemen" },
    "Hodeidah": { country: "Yemen" },
    "Hong Kong": { country: "Hong Kong" },
    "Honiara": { country: "Solomon Islands" },
    "Incheon": { country: "South Korea" },
    "Inchon": { country: "South Korea" },
    "Istanbul": { country: "Turkey" },
    "Jaffna": { country: "Sri Lanka" },
    "Jakarta": { country: "Indonesia" },
    "Jamestown": { country: "Saint Helena" },
    "Jeddah Islamic Port": { country: "Saudi Arabia" },
    "Jeddah": { country: "Saudi Arabia" },
    "Jizan": { country: "Saudi Arabia" },
    "Jounieh": { country: "Lebanon" },
    "Jubail": { country: "Saudi Arabia" },
    "Jurong": { country: "Singapore" },
    "Kandla": { country: "India" },
    "Kaohsiung": { country: "Taiwan" },
    "Karachi": { country: "Pakistan" },
    "Kathmandu": { country: "Nepal" },
    "Khartoum": { country: "Sudan" },
    "Khasab": { country: "Oman" },
    "King Abdul Aziz Port": { country: "Saudi Arabia" },
    "King Fahd Industrial Port": { country: "Saudi Arabia" },
    "Kingston": { country: "Jamaica" },
    "Kinshasa": { country: "D.R.Congo" },
    "Kismayo": { country: "Somalia" },
    "Klaipeda": { country: "Lithuania" },
    "Kobe": { country: "Japan" },
    "Kolkata": { country: "India" },
    "Koror": { country: "Palau" },
    "Kralendijk": { country: "Bonaire/Netherlands Antilles" },
    "Kribi": { country: "Cameroon" },
    "Kuching Port": { country: "Malaysia" },
    "Kuwait City": { country: "Kuwait" },
    "Kyrenia": { country: "Cyprus" },
    "La Ceiba": { country: "Honduras" },
    "La Digue": { country: "Seychelles" },
    "La Guaira": { country: "Venezuela" },
    "La Libertad": { country: "El Salvador" },
    "Lae": { country: "Papua New Guinea" },
    "Lagos": { country: "Nigeria" },
    "Larnaca": { country: "Cyprus" },
    "Las Palmas": { country: "Canary Islands" },
    "Latakia": { country: "Syria" },
    "Le Havre": { country: "France" },
    "Le Port": { country: "Reunion" },
    "Libreville": { country: "Gabon" },
    "Limassol": { country: "Cyprus" },
    "Limbe": { country: "Cameroon" },
    "Limón": { country: "Costa Rica" },
    "Lisbon": { country: "Portugal" },
    "Lobito": { country: "Angola" },
    "Lomé": { country: "Togo" },
    "London": { country: "United Kingdom" },
    "Luanda": { country: "Angola" },
    "Luganville": { country: "Vanuatu" },
    "Lüderitz": { country: "Namibia" },
    "Mahé": { country: "Seychelles" },
    "Majunga (Mahajanga)": { country: "Madagascar" },
    "Majuro": { country: "Marshall Islands" },
    "Malabo": { country: "Equatorial Guinea" },
    "Male": { country: "Maldives" },
    "Malé": { country: "Maldives" },
    "Manama": { country: "Bahrain" },
    "Manila": { country: "Philippines" },
    "Manta": { country: "Ecuador" },
    "Manzanillo": { country: "Mexico" },
    "Marsa Matruh": { country: "Egypt" },
    "MARSAXLOKK": { country: "Malta" },
    "Marsaxlokk": { country: "Malta" },
    "Marseille": { country: "France" },
    "Massawa": { country: "Eritrea" },
    "Mata-Utu": { country: "Wallis and Futuna" },
    "Matadi": { country: "D.R.Congo" },
    "Matarani": { country: "Peru" },
    "Mayumba": { country: "Gabon" },
    "Melbourne": { country: "Australia" },
    "Merca": { country: "Somalia" },
    "Mindelo": { country: "Cape Verde" },
    "Miri Port": { country: "Malaysia" },
    "Mocha": { country: "Yemen" },
    "Mogadishu": { country: "Somalia" },
    "Monaco": { country: "Monaco" },
    "Monrovia": { country: "Liberia" },
    "Montego Bay": { country: "Jamaica" },
    "Montevideo": { country: "Uruguay" },
    "Moroni": { country: "Comoros" },
    "Muara": { country: "Brunei Darussalam" },
    "Mukalla": { country: "Yemen" },
    "Mumbai": { country: "India" },
    "Muscat": { country: "Oman" },
    "Nacala": { country: "Mozambique" },
    "Naha": { country: "Japan" },
    "Namibe": { country: "Angola" },
    "Naples": { country: "Italy" },
    "Nassau": { country: "Bahamas" },
    "Neiafu": { country: "Tonga" },
    "New Westminster": { country: "Canada" },
    "New York": { country: "USA" },
    "Newcastle": { country: "Australia" },
    "Nieuw Nickerie": { country: "Suriname" },
    "Nishtun": { country: "Yemen" },
    "Nouadhibou": { country: "Mauritania" },
    "Nouakchott": { country: "Mauritania" },
    "Noumea": { country: "New Caledonia" },
    "Novorossiysk": { country: "Russian Federation" },
    "Nuku'alofa": { country: "Tonga" },
    "Obock": { country: "Djibouti" },
    "Odessa": { country: "Ukraine" },
    "Omboue": { country: "Gabon" },
    "Onne": { country: "Nigeria" },
    "Oran": { country: "Algeria" },
    "Oranjestad": { country: "Aruba" },
    "Osaka": { country: "Japan" },
    "Padang": { country: "Indonesia" },
    "Palermo": { country: "Italy" },
    "Papeete": { country: "French Polynesia" },
    "Paramaribo": { country: "Suriname" },
    "Pattaya": { country: "Thailand" },
    "Pemba": { country: "Mozambique" },
    "Penang Port": { country: "Malaysia" },
    "Philipsburg": { country: "Netherlands Antilles" },
    "Piraeus": { country: "Greece" },
    "Plymouth": { country: "Montserrat" },
    "Pohnpei": { country: "Micronesia" },
    "Pointe Noire": { country: "Republic of the Congo" },
    "Pointe-Noire": { country: "Republic of the Congo" },
    "Pointe-à-Pitre": { country: "Guadeloupe" },
    "Ponce": { country: "Puerto Rico" },
    "Port Castries": { country: "St. Lucia" },
    "Port Elizabeth": { country: "South Africa" },
    "Port Gentil": { country: "Gabon" },
    "Port Harcourt": { country: "Nigeria" },
    "Port Kelang": { country: "Malaysia" },
    "Port Kembla": { country: "Australia" },
    "Port Louis": { country: "Mauritius" },
    "Port Moresby": { country: "Papua New Guinea" },
    "Port of Spain": { country: "Trinidad and Tobago" },
    "Port Rashid": { country: "United Arab Emirates" },
    "Port Réunion": { country: "Reunion" },
    "Port Sudan": { country: "Sudan" },
    "Port Sultan Qaboos": { country: "Oman" },
    "Port Victoria": { country: "Seychelles" },
    "Port Vila": { country: "Vanuatu" },
    "Port Villa": { country: "Vanuatu" },
    "Port-au-Prince": { country: "Haiti" },
    "Port-Louis": { country: "Mauritius" },
    "Port-Vila": { country: "Vanuatu" },
    "Porto Grande (Mindelo)": { country: "Cape Verde" },
    "Porto-Novo": { country: "Benin" },
    "Porto": { country: "Portugal" },
    "Poti": { country: "Georgia" },
    "Praslin": { country: "Seychelles" },
    "Principe": { country: "Sao Tome and Principe" },
    "Providenciales": { country: "Turks And Caicos Islands" },
    "Puerto Barrios": { country: "Guatemala" },
    "Puerto Cabello": { country: "Venezuela" },
    "Puerto Limon": { country: "Republic of Costa Rica" },
    "Puerto Madryn": { country: "Argentina" },
    "Puerto Plata": { country: "Dominican Republic" },
    "Puerto Sucre": { country: "Venezuela" },
    "Punta del Este": { country: "Uruguay" },
    "Puntarenas": { country: "Costa Rica" },
    "Quelimane": { country: "Mozambique" },
    "Quetzal": { country: "Guatemala" },
    "Rabaul": { country: "Papua New Guinea" },
    "Rabigh": { country: "Saudi Arabia" },
    "Ras Al Ghar": { country: "Saudi Arabia" },
    "Ras al Khafji": { country: "Saudi Arabia" },
    "Ras al-Arah": { country: "Yemen" },
    "Ras Gharib": { country: "Egypt" },
    "Ras Isa Marine Terminal": { country: "Yemen" },
    "Ras Isa": { country: "Yemen" },
    "Ras Shukheir": { country: "Egypt" },
    "Ras Tanura": { country: "Saudi Arabia" },
    "Reykjavik": { country: "Iceland" },
    "Riga": { country: "Latvia" },
    "Rijeka": { country: "Croatia" },
    "Rio de Janeiro": { country: "Brazil" },
    "Road Town": { country: "British Virgin Islands" },
    "Robertsport": { country: "Liberia" },
    "Roseau": { country: "Commonwealth Of Dominica" },
    "Rotterdam": { country: "Netherlands" },
    "Saida": { country: "Lebanon" },
    "Saint George's": { country: "Grenada" },
    "Saint John's": { country: "Antigua and Barbuda" },
    "Saint John": { country: "Barbados" },
    "Saint Louis": { country: "Senegal" },
    "Saint Petersburg": { country: "Russian Federation" },
    "Saint Pierre": { country: "Saint Pierre and Miquelon" },
    "Saint-Denis": { country: "Reunion" },
    "Saipan": { country: "Northern Mariana Islands" },
    "Salalah": { country: "Oman" },
    "Saleef": { country: "Yemen" },
    "San Antonio": { country: "Chile" },
    "San Jose": { country: "Antigua" },
    "San Juan": { country: "Puerto Rico" },
    "San Pedro": { country: "Cote D'Ivoire" },
    "Sana'a": { country: "Yemen" },
    "Santo Domingo": { country: "Dominican Republic" },
    "Santo": { country: "Vanuatu" },
    "Santos": { country: "Brazil" },
    "Sao Tome": { country: "Sao Tome and Principe" },
    "Scarborough": { country: "Trinidad and Tobago" },
    "Sevastopol": { country: "Ukraine" },
    "Sfax": { country: "Tunisia" },
    "Shanghai": { country: "Peoples Republic of China" },
    "Sharjah": { country: "United Arab Emirates" },
    "Shenzhen": { country: "Peoples Republic of China" },
    "Sibu Port": { country: "Malaysia" },
    "Sidon": { country: "Lebanon" },
    "Sihanoukville": { country: "Cambodia" },
    "Singapore": { country: "Singapore" },
    "Sinop": { country: "Turkey" },
    "Sittwe": { country: "Myanmar" },
    "Sochi": { country: "Russian Federation" },
    "Socotra": { country: "Yemen" },
    "Sohar": { country: "Oman" },
    "Sokodé": { country: "Togo" },
    "Southampton": { country: "United Kingdom" },
    "Soyo": { country: "Angola" },
    "Split": { country: "Croatia" },
    "St. Croix": { country: "US Virgin Islands" },
    "St. George": { country: "Grenada" },
    "Stockholm": { country: "Sweden" },
    "Suakin": { country: "Sudan" },
    "Sur": { country: "Lebanon" },
    "Surabaya": { country: "Indonesia" },
    "Suva": { country: "Fiji" },
    "Sydney": { country: "Australia" },
    "Szczecin": { country: "Poland" },
    "São Tomé": { country: "Sao Tome and Principe" },
    "Tadjoura": { country: "Djibouti" },
    "Tainan": { country: "Taiwan" },
    "Tallinn": { country: "Estonia" },
    "Tamatave (Toamasina)": { country: "Madagascar" },
    "Tanajib": { country: "Saudi Arabia" },
    "Tanjung Pelepas": { country: "Malaysia" },
    "Tarawa": { country: "Kiribati" },
    "Tartus": { country: "Syria" },
    "Tauranga": { country: "New Zealand" },
    "Tekirdag": { country: "Turkey" },
    "Tema": { country: "Ghana" },
    "Tianjin": { country: "Peoples Republic of China" },
    "Tin Can Island": { country: "Nigeria" },
    "Toamasina": { country: "Madagascar" },
    "Toliara": { country: "Madagascar" },
    "Tonga": { country: "Tonga" },
    "Toripoli": { country: "Libya" },
    "Trabzon": { country: "Turkey" },
    "Trieste": { country: "Italy" },
    "Trincomalee": { country: "Sri Lanka" },
    "Tripoli": { country: "Lebanon" },
    "Tunis": { country: "Tunisia" },
    "Turkmenbashi": { country: "Turkmenistan" },
    "Tyre": { country: "Lebanon" },
    "Tórshavn": { country: "Faroe Islands" },
    "ULAANBAATAR": { country: "Mongolia" },
    "Ulcinj": { country: "Montenegro" },
    "Umm Qasr": { country: "Iraq" },
    "Ushuaia": { country: "Argentina" },
    "Valletta": { country: "Malta" },
    "Valparaíso": { country: "Chile" },
    "Vancouver": { country: "Canada" },
    "Varna": { country: "Bulgaria" },
    "Veracruz": { country: "Mexico" },
    "Victoria": { country: "Mahe (Seychelles)" },
    "Visakhapatnam": { country: "India" },
    "Vladivostok": { country: "Russian Federation" },
    "Walvis Bay": { country: "Namibia" },
    "Warri": { country: "Nigeria" },
    "Wellington": { country: "New Zealand" },
    "Willemstad": { country: "Curacao" },
    "Yanbu": { country: "Saudi Arabia" },
    "Yangon": { country: "Myanmar" },
    "Yap": { country: "Micronesia" },
    "Yaren": { country: "Nauru" },
    "Yokohama": { country: "Japan" },
    "Zeebrugge": { country: "Belgium" },
    "Ziguinchor": { country: "Senegal" },
    "Zonguldak": { country: "Turkey" },
}


const AddPortModal = ({ handleAddPortModalClose }) => {

    const addPortModalVisible = useSelector((state) => state.addPortModalVisible);
    const inputPortText = useRef(null);
    const inputCountryText = useRef(null);
    const dispatch = useDispatch();
    const toast = useToast();
    const [addButtonLoading, setAddButtonLoading] = useState(false);

    const handleAddButton = async () => {
        setAddButtonLoading(true);
        if (inputPortText.current?.value !== '' && inputCountryText.current?.value !== '') {
            const countryCode = inputCountryText.current?.value;
            const portCode = inputPortText.current?.value;
            const formattedPortCode = portCode.replace(/\./g, '_');
            const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
            const { datetime } = response.data;
            const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
            const year = moment(datetime).format('YYYY');
            const month = moment(datetime).format('MM');
            const monthWithDay = moment(datetime).format('MM/DD');
            const date = moment(datetime).format('YYYY/MM/DD');
            const day = moment(datetime).format('DD');
            const time = moment(datetime).format('HH:mm');
            try {
                await addPort(formattedPortCode, inputCountryText.current?.value, 9999);
                const logData = {
                    message: `Port Added: "${nameVariable.text}" added port "${portCode}" for Freight.`,
                    timestamp: formattedTime,
                    colorScheme: true,
                    keywords: [
                        formattedTime.toLowerCase(),
                        `Port Added: "${nameVariable.text}" added port "${portCode}" for Freight.`.toLowerCase(),
                        'Port'.toLowerCase(),
                        'Port Added'.toLowerCase(),
                        'Added'.toLowerCase(),
                        'Freight'.toLowerCase(),
                        portCode.toLowerCase(),
                        nameVariable.text.toLowerCase(),
                        year.toLowerCase(),
                        month.toLowerCase(),
                        monthWithDay.toLowerCase(),
                        date.toLowerCase(),
                        day.toLowerCase(),
                        time.toLowerCase(),
                    ],
                };

                addLogToCollection(logData);
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Port added successfully!</Text>
                        </View>;
                    }

                })
                dispatch(setAddPortModalVisible(false));
                setAddButtonLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        else {
            setAddButtonLoading(false);

        }


    }

    const filterInput = (inputRef) => {
        const currentValue = inputRef.current.value;
        const filteredValue = currentValue.replace(/[^a-zA-Z0-9. ]/g, '');
        if (currentValue !== filteredValue) {
            inputRef.current.setNativeProps({ text: filteredValue });
        }
    };

    return (
        <Modal
            isOpen={addPortModalVisible}
            onClose={() => {
                handleAddPortModalClose();
                inputPortText.current.value = '';
            }}
            size={'md'}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header style={{ backgroundColor: '#7B9CFF', }}><Text color={'white'} fontSize={20} bold>Add Port</Text></Modal.Header>
                <Modal.Body >
                    <View style={{ marginVertical: 5, }}>
                        <View style={{ backgroundColor: '#7B9CFF', flex: 1, }}>
                            <Text bold color={'white'} marginLeft={1}>Port</Text>
                        </View>
                        <TextInput
                            ref={inputPortText}
                            onChangeText={() => filterInput(inputPortText)}
                            style={{
                                outlineStyle: 'none',
                                flex: 1,
                                padding: 5,
                                backgroundColor: 'white',
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5,
                                placeholderTextColor: '#ACADA3',
                                borderColor: '#D4D4D4',
                                borderWidth: 1,
                            }}
                            placeholder='Input Port' />

                        <View style={{ backgroundColor: '#7B9CFF', flex: 1, marginTop: 10, }}>
                            <Text bold color={'white'} marginLeft={1}>Country</Text>
                        </View>
                        <TextInput
                            ref={inputCountryText}
                            onChangeText={() => filterInput(inputCountryText)}
                            style={{
                                outlineStyle: 'none',
                                flex: 1,
                                padding: 5,
                                backgroundColor: 'white',
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5,
                                placeholderTextColor: '#ACADA3',
                                borderColor: '#D4D4D4',
                                borderWidth: 1,
                            }}
                            placeholder='Input Country' />

                    </View>


                </Modal.Body>
                <Modal.Footer >
                    <Button.Group variant="solid" space="2">
                        <Button colorScheme={'gray'} onPress={() => {
                            handleAddPortModalClose();
                            inputPortText.current.value = '';
                        }}>Cancel</Button>
                        {addButtonLoading ?
                            (<Spinner size="lg" color={'#16A34A'} />) :
                            (<Button colorScheme={'success'} onPress={handleAddButton}>Add</Button>)
                        }

                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>

    );

}

const DeletePortModal = ({ handleDeletePortModalClose }) => {
    const deletePortModalVisible = useSelector((state) => state.deletePortModalVisible);
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleDeletePort = async () => {
        setButtonLoading(true);
        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');
        const formattedFieldCode = selectedPort.replace(/\./g, '_');

        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');
        updateDoc(documentRef, {
            [formattedFieldCode]: deleteField()
        })
            .then(() => {
                console.log('Field deleted successfully');
                handleDeletePortModalClose();
                setButtonLoading(false);
                const logData = {
                    message: `Port Deleted: "${nameVariable.text}" deleted port "${selectedPort}" for Freight.`,
                    timestamp: formattedTime,
                    colorScheme: false,
                    keywords: [
                        formattedTime.toLowerCase(),
                        `Port Deleted: "${nameVariable.text}" deleted port "${selectedPort}" for Freight.`.toLowerCase(),
                        'Port'.toLowerCase(),
                        'Port Deleted'.toLowerCase(),
                        'Deleted'.toLowerCase(),
                        'Freight'.toLowerCase(),
                        selectedPort.toLowerCase(),
                        nameVariable.text.toLowerCase(),
                        year.toLowerCase(),
                        month.toLowerCase(),
                        monthWithDay.toLowerCase(),
                        date.toLowerCase(),
                        day.toLowerCase(),
                        time.toLowerCase(),
                    ],
                };

                addLogToCollection(logData);
            })
            .catch((error) => {
                console.error('Error deleting field: ', error);
            });

    }

    return (

        <Modal isOpen={deletePortModalVisible} onClose={handleDeletePortModalClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Delete Port?</Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the selected port?
                </Modal.Body>
                <Modal.Footer>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: '#525252', padding: 5, borderRadius: 5, margin: 5, }}
                            onPress={handleDeletePortModalClose}
                        >
                            <Text style={{ color: 'white', alignSelf: 'center', }}>No</Text>
                        </TouchableOpacity>
                        {buttonLoading ?
                            (<TouchableOpacity
                                style={{ flex: 1, backgroundColor: '#DC2626', padding: 5, borderRadius: 5, margin: 5, }}
                            ><Spinner size={18} color={'white'} />
                            </TouchableOpacity>) :
                            (<TouchableOpacity
                                style={{ flex: 1, backgroundColor: '#DC2626', padding: 5, borderRadius: 5, margin: 5, }}
                                onPress={handleDeletePort}
                            >
                                <Text style={{ color: 'white', alignSelf: 'center', }}>Yes</Text>
                            </TouchableOpacity>)
                        }


                    </View>
                </Modal.Footer>
            </Modal.Content>
        </Modal>


    );
}



const PortsTable = () => {
    const dispatch = useDispatch();
    const methodData = useSelector((state) => state.methodData);
    const toast = useToast();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const optionsPerPage = [10, 20, 50];
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const inputSearchRef = useRef(null);
    const textAreaAddMethod = useRef(null);

    const inputSortOrder = useRef([]);
    const inputProfitPrice = useRef([]);
    const inputNagoyaPrice = useRef([]);
    const inputYokohamaPrice = useRef([]);
    const inputKyushuPrice = useRef([]);
    const inputKobePrice = useRef([]);
    const inputMemo = useRef([]);

    const [inputMemoValues, setInputMemoValues] = useState({});

    const screenWidth = Dimensions.get('window').width;

    const handleSortOrderTextChange = (text, item) => {
        // Remove any non-numeric characters from the input text and limit to 3 digits
        const numericValue = text.replace(/[^0-9]/g, '').slice(0, 3);

        inputSortOrder.current[item.ports].value = numericValue;

    };

    const handleProfitPriceTextChange = (text, item) => {
        // Remove any non-numeric characters from the input text and limit to 3 digits
        const numericValue = text.replace(/[^0-9]/g, '').slice(0, 4);

        inputProfitPrice.current[item.ports].value = numericValue;

    };


    const updatePortsField = async (portCode, newValue, inputRef, title, fieldName) => {
        // Specify the document reference
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
        const { datetime } = response.data;
        const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
        const year = moment(datetime).format('YYYY');
        const month = moment(datetime).format('MM');
        const monthWithDay = moment(datetime).format('MM/DD');
        const date = moment(datetime).format('YYYY/MM/DD');
        const day = moment(datetime).format('DD');
        const time = moment(datetime).format('HH:mm');

        const documentRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');
        dispatch(setLoadingModalVisible(true));
        if (newValue !== '') {
            // Replace dots with underscores in the countryCode if the keys in Firestore use underscores
            // If your keys can contain dots and are used as such in Firestore, do not replace with underscores.
            const formattedCountryCode = portCode.replace(/\./g, '_'); // Replace dots with underscores or any other valid character

            // Specify the field using dot notation for the nested field
            const field = `${formattedCountryCode}.${fieldName}`;

            try {
                // Perform the update
                await updateDoc(documentRef, {
                    [field]: newValue
                });

                const logData = {
                    message: `${title} Updated: "${nameVariable.text}" updated "${portCode}" ${title} to "${newValue}".`,
                    timestamp: formattedTime,
                    colorScheme: true,
                    keywords: [
                        formattedTime.toLowerCase(),
                        `${title} Updated: "${nameVariable.text}" updated "${portCode}" ${title} to "${newValue}"`.toLowerCase(),
                        `Sort`.toLowerCase(),
                        `${title}`.toLowerCase(),
                        `${title} Updated`.toLowerCase(),
                        `Updated`.toLowerCase(),
                        portCode.toLowerCase(),
                        nameVariable.text.toLowerCase(),
                        year.toLowerCase(),
                        month.toLowerCase(),
                        monthWithDay.toLowerCase(),
                        date.toLowerCase(),
                        day.toLowerCase(),
                        time.toLowerCase(),
                    ],
                };
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>{title} updated successfully!</Text>
                        </View>;
                    }
                })
                addLogToCollection(logData);
                dispatch(setLoadingModalVisible(false));
                console.log(`${title} updated successfully`);
            } catch (error) {
                console.error(`Error updating ${title}:`, error);

            }
        }
        else {
            dispatch(setLoadingModalVisible(false));

        }

    };

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const filtered = useMemo(() => {
        return data.filter((item) =>
            item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.ports.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sortOrder.toString().includes(searchQuery)
        );
    }, [searchQuery, data]);

    const paginatedData = useMemo(() => {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }, [page, itemsPerPage, searchQuery, data, filtered]);


    const handleSearch = debounce(() => {
        setSearchQuery(inputSearchRef.current?.value);
    }, 50);

    const startIndex = page * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    // useEffect(() => {
    //     const portsDataWithSortOrder = Object.entries(portsList).reduce((acc, [portName, portDetails], index) => {
    //         // Replace dots in portName with underscores
    //         const sanitizedPortName = portName.replace(/\./g, '_');
    //         acc[sanitizedPortName] = { ...portDetails, sortOrder: index };
    //         return acc;
    //     }, {});

    //     setDoc(doc(projectExtensionFirestore, "CustomerCountryPort", "PortsDoc"), portsDataWithSortOrder)
    //         .then(() => {
    //             console.log("Document successfully written!");
    //             dispatch(setLoadingModalVisible(false));
    //         })
    //         .catch((error) => {
    //             console.error("Error writing document: ", error);
    //         });
    // }, []);

    useEffect(() => {
        const docRef = doc(projectExtensionFirestore, 'CustomerCountryPort', 'PortsDoc');
        dispatch(setLoadingModalVisible(true));

        // This will start the listener
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const formattedData = Object.keys(data)
                    .map(key => ({
                        ports: key.replace(/_/g, '.'),
                        ...data[key],
                    }))
                    .sort((a, b) => a.sortOrder - b.sortOrder); // Sorting based on the sortOrder field
                setData(formattedData);
                // setFilteredData(formattedData);
                dispatch(setLoadingModalVisible(false));
            } else {
                console.log("No such document!");
                dispatch(setLoadingModalVisible(false));


            }
        }, (error) => {
            console.error("Error fetching countries: ", error);

        });

        // This will unsubscribe from the listener when the component is unmounted
        return () => unsubscribe();
    }, []);


    const handleAddMethodTextChange = () => {
        const textAreaValue = textAreaAddMethod.current?.value;
        if (textAreaValue) {
            const newText = textAreaValue
                .split('\n')
                .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
                .join('\n');
            textAreaAddMethod.current.setNativeProps({ text: newText });
        }
    };

    useEffect(() => {
        paginatedData.forEach(item => {
            inputMemo.current[item.ports].value = item.memo ? item.memo : '';
            inputSortOrder.current[item.ports].value = item.sortOrder ? item.sortOrder : 0;
            inputProfitPrice.current[item.ports].value = item.profitPrice ? item.profitPrice : 0;
            inputNagoyaPrice.current[item.ports].value = item.nagoyaPrice ? item.nagoyaPrice : 0;
            inputYokohamaPrice.current[item.ports].value = item.yokohamaPrice ? item.yokohamaPrice : 0;
            inputKyushuPrice.current[item.ports].value = item.kyushuPrice ? item.kyushuPrice : 0;
            inputKobePrice.current[item.ports].value = item.kobePrice ? item.kobePrice : 0;



        });
        // setInputMemoValues(initialValues);

    }, [paginatedData]); // Run this effect when 'items' changes

    const handleAddPortModalOpen = () => {

        dispatch(setAddPortModalVisible(true));

    }

    const handleAddPortModalClose = () => {

        dispatch(setAddPortModalVisible(false));

    }

    const handleDeletePortModalOpen = (selectedValue) => {

        dispatch(setDeletePortModalVisible(true));
        selectedPort = selectedValue;

    }

    const handleDeletePortModalClose = () => {

        dispatch(setDeletePortModalVisible(false));

    }




    return (
        <>
            {screenWidth >= 1280 ? (
                <View style={{ flex: 1, }}>
                    {/* Search Bar */}
                    <View style={{ padding: 10 }}>
                        <TextInput
                            ref={inputSearchRef}
                            onSubmitEditing={handleSearch}
                            style={{ outlineStyle: 'none', padding: 10, backgroundColor: 'white', borderRadius: 5, placeholderTextColor: '#ACADA3' }}
                            placeholder='Search'
                            returnKeyType='search'
                            autoCapitalize='none'
                        />
                    </View>

                    {/* Add Port Button */}
                    <View style={{ paddingHorizontal: 10, paddingTop: 0, paddingBottom: 0, alignItems: 'flex-start' }}>
                        <TouchableOpacity
                            onPress={handleAddPortModalOpen}
                            style={{
                                borderRadius: 5,
                                padding: 10,
                                borderWidth: 1,
                                borderColor: 'white',
                                backgroundColor: '#16A34A',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons name="add" size={20} color={'white'} />
                            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>Add Port</Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderBottomColor: '#E4E4E7',
                            backgroundColor: '#0642F4',
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 10,
                        }}
                    >
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', }} bold>Port Name</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', }} bold>Country</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', }} bold>Sort Order</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', }} bold>Price (USD)</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', }} bold>Nagoya</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', }} bold>Yokohama</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', }} bold>Kyushu</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ color: 'white', }} bold>Kobe</Text>
                        </View>

                        <View style={{ flex: 1, padding: 2, flexDirection: 'row' }}>
                            <SortAndAddModal
                                collectionName='CustomerCountryPort'
                                docName='MethodDoc'
                                handleAddTextChange={handleAddMethodTextChange}
                                textAreaAdd={textAreaAddMethod}
                                title='Method'
                                dataName={'methodData'}
                                databaseInit={projectExtensionFirestore}
                                headerText="Rearrange/Add Method"
                                data={methodData}
                            />
                            <Text style={{ color: 'white', }} bold>Method</Text>
                        </View>
                        <View style={{ flex: 2, padding: 2, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ color: 'white', }} bold>Memo</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ color: 'white', }} bold>Operate</Text>
                        </View>


                    </View>
                    <DataTable margin={[0, 0, 0, 1, 1, 1]}>
                        {paginatedData.map((item, index) => (
                            <View
                                key={index}
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
                                <Text style={{ flex: 1, marginHorizontal: 3 }} selectable>{item.ports}</Text>
                                <Text style={{ flex: 1, marginHorizontal: 3, alignSelf: 'center' }} selectable>{item.country}</Text>
                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                    {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.sortOrder ? item.sortOrder : 0}→</Text> */}
                                    <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, borderLeftColor: '#E4E4E7', }}>
                                        <TextInput
                                            onChangeText={(text) => handleSortOrderTextChange(text, item)}
                                            onSubmitEditing={() => updatePortsField(item.ports, inputSortOrder.current[item.ports].value, inputSortOrder, 'Sort Order', 'sortOrder')}
                                            ref={(ref) => (inputSortOrder.current[item.ports] = ref)}
                                            style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
                                        />
                                        <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                            <TouchableHighlight
                                                onPress={() => updatePortsField(item.ports, inputSortOrder.current[item.ports].value, inputSortOrder, 'Sort Order', 'sortOrder')}
                                                underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                style={{
                                                    backgroundColor: '#16A34A',
                                                    borderRadius: 5,
                                                    padding: 5,
                                                    margin: 2,
                                                    alignSelf: 'center',
                                                }}>
                                                <MaterialIcons name='update' color='white' size={22} />
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                    {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.profitPrice ? item.profitPrice : 0}→</Text> */}
                                    <TextInput
                                        onChangeText={(text) => handleProfitPriceTextChange(text, item)}
                                        onSubmitEditing={() => updatePortsField(item.ports, inputProfitPrice.current[item.ports].value, inputProfitPrice, 'Profit Price', 'profitPrice')}
                                        ref={(ref) => (inputProfitPrice.current[item.ports] = ref)}
                                        style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                    />
                                    <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => updatePortsField(item.ports, inputProfitPrice.current[item.ports].value, inputProfitPrice, 'Profit Price', 'profitPrice')}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#16A34A',
                                                borderRadius: 5,
                                                padding: 5,
                                                margin: 2,
                                                alignSelf: 'center',
                                            }}>
                                            <MaterialIcons name='update' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                    {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.nagoyaPrice ? item.nagoyaPrice : 0}→</Text> */}
                                    <TextInput
                                        onSubmitEditing={() => updatePortsField(item.ports, inputNagoyaPrice.current[item.ports].value, inputNagoyaPrice, 'Nagoya Price', 'nagoyaPrice')}
                                        ref={(ref) => (inputNagoyaPrice.current[item.ports] = ref)}
                                        style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                    />
                                    <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => updatePortsField(item.ports, inputNagoyaPrice.current[item.ports].value, inputNagoyaPrice, 'Nagoya Price', 'nagoyaPrice')}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#16A34A',
                                                borderRadius: 5,
                                                padding: 5,
                                                margin: 2,
                                                alignSelf: 'center',
                                            }}>
                                            <MaterialIcons name='update' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                    {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.yokohamaPrice ? item.yokohamaPrice : 0}→</Text> */}
                                    <TextInput
                                        onSubmitEditing={() => updatePortsField(item.ports, inputYokohamaPrice.current[item.ports].value, inputYokohamaPrice, 'Yokohama Price', 'yokohamaPrice')}
                                        ref={(ref) => (inputYokohamaPrice.current[item.ports] = ref)}
                                        style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                    />
                                    <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => updatePortsField(item.ports, inputYokohamaPrice.current[item.ports].value, inputYokohamaPrice, 'Yokohama Price', 'yokohamaPrice')}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#16A34A',
                                                borderRadius: 5,
                                                padding: 5,
                                                margin: 2,
                                                alignSelf: 'center',
                                            }}>
                                            <MaterialIcons name='update' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                    {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.kyushuPrice ? item.kyushuPrice : 0}→</Text> */}
                                    <TextInput
                                        onSubmitEditing={() => updatePortsField(item.ports, inputKyushuPrice.current[item.ports].value, inputKyushuPrice, 'Kyushu Price', 'kyushuPrice')}
                                        ref={(ref) => (inputKyushuPrice.current[item.ports] = ref)}
                                        style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                    />
                                    <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => updatePortsField(item.ports, inputKyushuPrice.current[item.ports].value, inputKyushuPrice, 'Kyushu Price', 'kyushuPrice')}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#16A34A',
                                                borderRadius: 5,
                                                padding: 5,
                                                margin: 2,
                                                alignSelf: 'center',
                                            }}>
                                            <MaterialIcons name='update' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                    {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.kobePrice ? item.kobePrice : 0}→</Text> */}
                                    <TextInput
                                        onSubmitEditing={() => updatePortsField(item.ports, inputKobePrice.current[item.ports].value, inputKobePrice, 'Kobe Price', 'kobePrice')}
                                        ref={(ref) => (inputKobePrice.current[item.ports] = ref)}
                                        style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                    />
                                    <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => updatePortsField(item.ports, inputKobePrice.current[item.ports].value, inputKobePrice, 'Kobe Price', 'kobePrice')}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#16A34A',
                                                borderRadius: 5,
                                                padding: 5,
                                                margin: 2,
                                                alignSelf: 'center',
                                            }}>
                                            <MaterialIcons name='update' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>
                                </View>

                                <View style={{ flex: screenWidth < 1800 ? 2 : 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                    <SelectMethod defaultValue={item.method} portCode={item.ports} page={page} searchQuery={searchQuery} />
                                </View>

                                <View style={{ flex: 2, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, }}>
                                    <TextInput
                                        multiline
                                        // value={inputMemoValues[item.ports] || ''}
                                        // onChangeText={(text) => handleMemoTextChange(text, item.ports)}
                                        ref={(ref) => (inputMemo.current[item.ports] = ref)}
                                        style={{ outlineStyle: 'none', flex: 2, height: 60, paddingLeft: 5, backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, }}
                                    />
                                    <View style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => updatePortsField(item.ports, inputMemo.current[item.ports].value, inputMemo, 'Memo', 'memo')}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#16A34A',
                                                borderRadius: 5,
                                                padding: 5,
                                                alignSelf: 'center',
                                                height: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <MaterialIcons name='update' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, justifyContent: 'center', alignItems: 'center', }}>

                                    <View style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                        <TouchableHighlight
                                            onPress={() => handleDeletePortModalOpen(item.ports)}
                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                            style={{
                                                backgroundColor: '#DC2626',
                                                borderRadius: 5,
                                                padding: 10,
                                                alignSelf: 'center',
                                                height: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <AntDesign name='delete' color='white' size={22} />
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                {/* <Text style={{ flex: 1, marginHorizontal: 5 }}>{item.inspectionIsRequired}</Text> */}

                                {/* You can add the mapping for nearestPorts here, assuming nearestPorts is an array */}
                                {/* {item.nearestPorts && item.nearestPorts.map((port, portIndex) => (
            <Text key={portIndex}>Nearest Port: {port}</Text>
          ))} */}
                            </View>
                        ))}
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
                    <AddPortModal handleAddPortModalClose={handleAddPortModalClose} />
                    <DeletePortModal handleDeletePortModalClose={handleDeletePortModalClose} />
                </View>) :
                (
                    //Ports Table Mobile View
                    <View style={{ flex: 1, }}>
                        {/* Search Bar */}
                        <View style={{ padding: 10 }}>
                            <TextInput
                                ref={inputSearchRef}
                                onSubmitEditing={handleSearch}
                                style={{ outlineStyle: 'none', padding: 10, backgroundColor: 'white', borderRadius: 5, placeholderTextColor: '#ACADA3' }}
                                placeholder='Search'
                                returnKeyType='search'
                                autoCapitalize='none'
                            />
                        </View>

                        {/* Add Port Button */}
                        <View style={{ paddingHorizontal: 10, paddingTop: 0, paddingBottom: 0, alignItems: 'flex-start' }}>
                            <TouchableOpacity
                                onPress={handleAddPortModalOpen}
                                style={{
                                    borderRadius: 5,
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: 'white',
                                    backgroundColor: '#16A34A',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MaterialIcons name="add" size={20} color={'white'} />
                                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>Add Port</Text>
                            </TouchableOpacity>
                        </View>

                        <DataTable margin={[0, 0, 0, 1, 1, 1]}>
                            {paginatedData.map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        borderWidth: 1,
                                        borderColor: '#E4E4E7',
                                        backgroundColor: '#BFDBFE',
                                        margin: 10,
                                    }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Port Name</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <Text style={{ flex: 1, marginHorizontal: 3 }} selectable>{item.ports}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Country</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>

                                            <Text style={{ flex: 1, marginHorizontal: 3, }} selectable>{item.country}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Sort Order</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>

                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                                {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.sortOrder ? item.sortOrder : 0}→</Text> */}
                                                <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, borderLeftColor: '#E4E4E7', }}>
                                                    <TextInput
                                                        onChangeText={(text) => handleSortOrderTextChange(text, item)}
                                                        onSubmitEditing={() => updatePortsField(item.ports, inputSortOrder.current[item.ports].value, inputSortOrder, 'Sort Order', 'sortOrder')}
                                                        ref={(ref) => (inputSortOrder.current[item.ports] = ref)}
                                                        style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
                                                    />
                                                    <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                        <TouchableHighlight
                                                            onPress={() => updatePortsField(item.ports, inputSortOrder.current[item.ports].value, inputSortOrder, 'Sort Order', 'sortOrder')}
                                                            underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                            style={{
                                                                backgroundColor: '#16A34A',
                                                                borderRadius: 5,
                                                                padding: 5,
                                                                margin: 2,
                                                                alignSelf: 'center',
                                                            }}>
                                                            <MaterialIcons name='update' color='white' size={22} />
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Price (USD)</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                                {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.profitPrice ? item.profitPrice : 0}→</Text> */}
                                                <TextInput
                                                    onChangeText={(text) => handleProfitPriceTextChange(text, item)}
                                                    onSubmitEditing={() => updatePortsField(item.ports, inputProfitPrice.current[item.ports].value, inputProfitPrice, 'Profit Price', 'profitPrice')}
                                                    ref={(ref) => (inputProfitPrice.current[item.ports] = ref)}
                                                    style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                                />
                                                <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                    <TouchableHighlight
                                                        onPress={() => updatePortsField(item.ports, inputProfitPrice.current[item.ports].value, inputProfitPrice, 'Profit Price', 'profitPrice')}
                                                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                        style={{
                                                            backgroundColor: '#16A34A',
                                                            borderRadius: 5,
                                                            padding: 5,
                                                            margin: 2,
                                                            alignSelf: 'center',
                                                        }}>
                                                        <MaterialIcons name='update' color='white' size={22} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Nagoya</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                                {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.nagoyaPrice ? item.nagoyaPrice : 0}→</Text> */}
                                                <TextInput
                                                    onSubmitEditing={() => updatePortsField(item.ports, inputNagoyaPrice.current[item.ports].value, inputNagoyaPrice, 'Nagoya Price', 'nagoyaPrice')}
                                                    ref={(ref) => (inputNagoyaPrice.current[item.ports] = ref)}
                                                    style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                                />
                                                <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                    <TouchableHighlight
                                                        onPress={() => updatePortsField(item.ports, inputNagoyaPrice.current[item.ports].value, inputNagoyaPrice, 'Nagoya Price', 'nagoyaPrice')}
                                                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                        style={{
                                                            backgroundColor: '#16A34A',
                                                            borderRadius: 5,
                                                            padding: 5,
                                                            margin: 2,
                                                            alignSelf: 'center',
                                                        }}>
                                                        <MaterialIcons name='update' color='white' size={22} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Yokohama</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                                {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.yokohamaPrice ? item.yokohamaPrice : 0}→</Text> */}
                                                <TextInput
                                                    onSubmitEditing={() => updatePortsField(item.ports, inputYokohamaPrice.current[item.ports].value, inputYokohamaPrice, 'Yokohama Price', 'yokohamaPrice')}
                                                    ref={(ref) => (inputYokohamaPrice.current[item.ports] = ref)}
                                                    style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                                />
                                                <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                    <TouchableHighlight
                                                        onPress={() => updatePortsField(item.ports, inputYokohamaPrice.current[item.ports].value, inputYokohamaPrice, 'Yokohama Price', 'yokohamaPrice')}
                                                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                        style={{
                                                            backgroundColor: '#16A34A',
                                                            borderRadius: 5,
                                                            padding: 5,
                                                            margin: 2,
                                                            alignSelf: 'center',
                                                        }}>
                                                        <MaterialIcons name='update' color='white' size={22} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Kyushu</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                                {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.kyushuPrice ? item.kyushuPrice : 0}→</Text> */}
                                                <TextInput
                                                    onSubmitEditing={() => updatePortsField(item.ports, inputKyushuPrice.current[item.ports].value, inputKyushuPrice, 'Kyushu Price', 'kyushuPrice')}
                                                    ref={(ref) => (inputKyushuPrice.current[item.ports] = ref)}
                                                    style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                                />
                                                <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                    <TouchableHighlight
                                                        onPress={() => updatePortsField(item.ports, inputKyushuPrice.current[item.ports].value, inputKyushuPrice, 'Kyushu Price', 'kyushuPrice')}
                                                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                        style={{
                                                            backgroundColor: '#16A34A',
                                                            borderRadius: 5,
                                                            padding: 5,
                                                            margin: 2,
                                                            alignSelf: 'center',
                                                        }}>
                                                        <MaterialIcons name='update' color='white' size={22} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Kobe</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                                {/* <Text style={{ marginHorizontal: 3, alignSelf: 'center', }} bold>{item.kobePrice ? item.kobePrice : 0}→</Text> */}
                                                <TextInput
                                                    onSubmitEditing={() => updatePortsField(item.ports, inputKobePrice.current[item.ports].value, inputKobePrice, 'Kobe Price', 'kobePrice')}
                                                    ref={(ref) => (inputKobePrice.current[item.ports] = ref)}
                                                    style={{ outlineStyle: 'none', padding: 5, width: '90%', backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftColor: '#E4E4E7', borderLeftWidth: 1, }}
                                                />
                                                <View style={{ backgroundColor: 'white', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                    <TouchableHighlight
                                                        onPress={() => updatePortsField(item.ports, inputKobePrice.current[item.ports].value, inputKobePrice, 'Kobe Price', 'kobePrice')}
                                                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                        style={{
                                                            backgroundColor: '#16A34A',
                                                            borderRadius: 5,
                                                            padding: 5,
                                                            margin: 2,
                                                            alignSelf: 'center',
                                                        }}>
                                                        <MaterialIcons name='update' color='white' size={22} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Method</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>


                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, backgroundColor: 'white' }}>
                                                <SelectMethod defaultValue={item.method} portCode={item.ports} page={page} searchQuery={searchQuery} />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Memo</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <View style={{ flex: 2, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, }}>
                                                <TextInput
                                                    multiline
                                                    // value={inputMemoValues[item.ports] || ''}
                                                    // onChangeText={(text) => handleMemoTextChange(text, item.ports)}
                                                    ref={(ref) => (inputMemo.current[item.ports] = ref)}
                                                    style={{ outlineStyle: 'none', flex: 2, height: 60, paddingLeft: 5, backgroundColor: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, }}
                                                />
                                                <View style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                    <TouchableHighlight
                                                        onPress={() => updatePortsField(item.ports, inputMemo.current[item.ports].value, inputMemo, 'Memo', 'memo')}
                                                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                        style={{
                                                            backgroundColor: '#16A34A',
                                                            borderRadius: 5,
                                                            padding: 5,
                                                            alignSelf: 'center',
                                                            height: '100%',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                        <MaterialIcons name='update' color='white' size={22} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                            <Text style={{ color: 'white', }} bold>Operate</Text>
                                        </View>
                                        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                            <View style={{ flex: 1, flexDirection: 'row', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginHorizontal: 3, justifyContent: 'center', alignItems: 'center', }}>
                                                <View style={{ width: '100%', borderTopRightRadius: 5, borderBottomRightRadius: 5, }}>
                                                    <TouchableHighlight
                                                        onPress={() => handleDeletePortModalOpen(item.ports)}
                                                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                                                        style={{ flex: 1, backgroundColor: '#DC2626', padding: 5, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 6, }}>
                                                        <AntDesign name='delete' color='white' size={22} />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>


                                    {/* <Text style={{ flex: 1, marginHorizontal: 5 }}>{item.inspectionIsRequired}</Text> */}

                                    {/* You can add the mapping for nearestPorts here, assuming nearestPorts is an array */}
                                    {/* {item.nearestPorts && item.nearestPorts.map((port, portIndex) => (
            <Text key={portIndex}>Nearest Port: {port}</Text>
          ))} */}
                                </View>
                            ))}
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
                        <AddPortModal handleAddPortModalClose={handleAddPortModalClose} />
                        <DeletePortModal handleDeletePortModalClose={handleDeletePortModalClose} />
                    </View>
                )}
        </>



    );
}




export default function Freight() {

    const [email, setEmail] = useState('');
    const logo = require('../../assets/C-Hub.png');
    const logo2 = require('../../assets/C-Hub Logo Only.png');
    const [isMobileView, setIsMobileView] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // const navigation = useNavigation();
    const navigate = useNavigate();

    const dispatch = useDispatch();


    const [typeOfAccount, setTypeOfAccount] = useState('');


    const loginName = useSelector((state) => state.loginName);
    nameVariable.text = loginName;
    const [name, setName] = useState(loginName);
    const [time, setTime] = useState('');

    const [selectedImages, setSelectedImages] = useState([]);

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
        dispatch(setSelectedButton(defaultSelectedButton));
    }, [])

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


    const listenForNameChange = (documentId) => {


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

        signOut(projectControlAuth).then(() => {
            // navigation.navigate('Login');
            navigate("/Login");

            setEmail('');
            setName('');
        }).catch(() => {
            // An error happened.
        });


    }



    // const showDrawerIcon = useBreakpointValue([true, true, true, false]);













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
                    {/* 
                    {screenWidth <= 960 && <MobileViewDrawer
                        selectedScreen={selectedScreen} />} */}


                    <Box w={screenWidth <= 960 ? 120 : 0} h={screenWidth <= 960 ? 6 : 10} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]}>

                        <FastImage
                            source={{
                                uri: 'https://firebasestorage.googleapis.com/v0/b/samplermj.appspot.com/o/C-HUB%20Logos%2FC-HUB%20LOGO%20HALF.png?alt=media&token=7ce6aef2-0527-40c7-b1ce-e47079e144df',
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


                    {/* Main Content */}
                    {/* <Box flex={1} flexGrow={1} minHeight={0}> */}
                    {/* Main Content Content */}


                    {/* <Box px="3" bgColor="#A6BCFE" height="full" > */}
                    <View style={{ flex: 1, backgroundColor: "#A6BCFE", height: '100%' }}>
                        <ScrollView style={{ flex: 1, }} keyboardShouldPersistTaps='always'>
                            <View style={{ flex: 1, }}>

                                <FreightNavigation />
                                <NavigatePage />
                                {/* {selectedButton == 'countries' ? <CountriesTable /> : <></>}
                                {selectedButton == 'ports' ? <PortsTable /> : <></>} */}
                            </View>
                        </ScrollView>
                        {/* <SuccessModal /> */}

                    </View>


                    {/* </Box> */}

                    {/* </Box> */}
                </View>

            </View>
            <LoadingModal />

        </NativeBaseProvider>
    );
}