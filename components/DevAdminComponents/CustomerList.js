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
    setCustomerListData,
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
    setFobHistoryData,
    setLoginName
} from './redux/store';
// import { TextInput } from 'react-native-gesture-handler';
import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';
import StickyHeader from './Header/StickyHeader';
import { UsePagination } from './VehicleListComponent/UsePagination';
import { useNavigate } from 'react-router-dom';
import QRCodeScanner from './QrCodeScanner/QrCodeScanner';

// import { CollectionGroup } from 'firebase-admin/firestore';
const { width } = Dimensions.get('window');
let selectedScreen = 'CUSTOMER LIST'

let globalSupplyChainCostsData = [];
let globalCurrentSupplyChainCostsData = [];
let globalFobPriceHistoryData = [];
let globalCurrentStockID = '';
let globalSelectedPaidTo = '';
let globalSPCSelectedDate = '';
let globalSelectedExpenseName = '';
let globalSupplyChainCostsAmount = 0;
let globalSelectedImages = [];
let globalSelectedVehicle = '';
let globalSelectedVehicleReferenceNumber = '';
let globalSelectedCarName = '';
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


const storage = getStorage(projectExtensionFirebase);

const SelectStockStatus = ({ selectedValue, id, item }) => {

    const dispatch = useDispatch();
    const toast = useToast();
    const stockStatusData = useSelector((state) => state.stockStatusData);
    const [key, setKey] = useState(nanoid());

    const [selectedStockStatusValue, setSelectedStockStatusValue] = useState(selectedValue);
    const screenWidth = Dimensions.get('window').width;


    useEffect(() => {
        const unsubscribe = onSnapshot(doc(projectExtensionFirestore, 'accounts', id), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                // Handle the data from the document
                setSelectedStockStatusValue(data.stockStatus);
                // console.log(`Read ${doc.size} documents from accounts`);

            }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const handleSaveStockStatus = async () => {

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

        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');
        if (item.stockStatus == selectedStockStatusValue || selectedStockStatusValue == '' || selectedStockStatusValue == '__NativeBasePlaceHolder__') {
            dispatch(setLoadingModalVisible(false));

        }
        else {

            const stockStatusHistoryData = {
                date: formattedTime,
                stockStatus: selectedStockStatusValue,
                changedBy: nameVariable.text,
            };
            const vehicleProductRef = doc(collection(projectExtensionFirestore, 'accounts'), item.stockID);

            try {
                await updateDoc(vehicleProductRef, {
                    stockStatus: selectedStockStatusValue,
                    stockStatusHistory: arrayUnion(stockStatusHistoryData)
                });
                const logData = {
                    message: `Stock Status Updated: "${nameVariable.text}" updated "${item.carName}" stock status to "${selectedStockStatusValue}" with a reference number of "${item.referenceNumber}" using Vehicle List.`,
                    timestamp: formattedTime,
                    colorScheme: true,
                    keywords: [
                        formattedTime.toLowerCase(),
                        globalCurrentStockID.toLowerCase(),
                        `Stock Status Updated: "${nameVariable.text}" updated "${item.carName}" stock status to ${selectedStockStatusValue} with a reference number of "${item.referenceNumber}" using Vehicle List`.toLowerCase(),
                        'Stock Status'.toLowerCase(),
                        'Stock Status Updated'.toLowerCase(),
                        'Stock'.toLowerCase(),
                        'Status Updated'.toLowerCase(),
                        'Updated'.toLowerCase(),
                        globalSelectedCarName.toLowerCase(),
                        globalSelectedVehicleReferenceNumber.toLowerCase(),
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
                dispatch(setLoadingModalVisible(false));

                // console.log('FOB Price updated successfully');
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Stock Status updated successfully!</Text>
                        </View>;
                    }
                })
            } catch (error) {
                console.error(error);
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#DC2626', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Error updating: {error}</Text>
                        </View>;
                    }
                })
            }
        }
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: screenWidth >= 1360 ? '70%' : '88%', backgroundColor: 'white', }}>
                <Select
                    selectedValue={selectedStockStatusValue}
                    onValueChange={(value) => {
                        setSelectedStockStatusValue(value);
                    }}
                    flex={3}
                    accessibilityLabel="---"
                    placeholder="---"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }}
                >
                    {stockStatusData.map((item) => (
                        <Select.Item key={item} label={item} value={item} />
                    ))}
                </Select>
            </View>

            <TouchableHighlight
                underlayColor={'rgba(22, 163, 74, 0.3)'}
                onPress={handleSaveStockStatus}
                style={{
                    backgroundColor: '#16A34A',
                    borderRadius: 5,
                    padding: 3,
                    margin: 2,
                    alignSelf: 'center',
                }}>
                <MaterialIcons name='update' color='white' size={22} />
            </TouchableHighlight>
        </View>




    );
};


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

const ClearImagesModal = ({ modalDeleteImagesVisible, setModalDeleteImagesVisible, handleClearImages, selectedImages, isAddPhotoVisible }) => {
    // const [modalDeleteImagesVisible, setModalDeleteImagesVisible] = useState(false);

    const handleModalDeleteOpen = () => {
        setModalDeleteImagesVisible(true);
    };

    const handleModalDeleteClose = () => {
        setModalDeleteImagesVisible(false);
    };

    return (
        <>
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#FF4136',
                    borderRadius: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: isAddPhotoVisible ? 'none' : 'flex',
                }}
            >
                <TouchableHighlight onPress={handleModalDeleteOpen} style={{ flex: 1 }}>
                    <Ionicons name="trash-sharp" size={20} color="white" />
                </TouchableHighlight>
            </View>

            <Modal isOpen={modalDeleteImagesVisible} onClose={handleModalDeleteClose} useRNModal>
                <Modal.Content bgColor={'error.100'}>
                    <Modal.CloseButton />
                    <Modal.Header borderBottomWidth={0} bgColor={'error.100'}>
                        <Text color={'#102A43'} bold>
                            Clear Images
                        </Text>
                    </Modal.Header>
                    <Modal.Body
                        justifyContent={'center'}
                        alignItems={'center'}
                        bgColor={'error.200'}
                        borderLeftWidth={4}
                        borderLeftColor={'danger.400'}
                        margin={5}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#FF4136', fontWeight: 'bold' }}>Alert!</Text>
                            <Text style={{ color: '#FF4136' }}>
                                Are you sure you want to clear{' '}
                                <Text style={{ color: '#FF4136', fontWeight: 'bold' }}>
                                    {selectedImages.length}
                                </Text>{' '}
                                selected image(s)?
                            </Text>
                        </View>
                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0} bgColor={'error.100'}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <TouchableOpacity
                                onPress={handleModalDeleteClose}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#57534E', // Replace with your desired color
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: 5,
                                    padding: 5,
                                }}
                            >
                                <Text style={{ fontSize: 14, color: 'white' }}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleClearImages}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#DC2626', // Replace with your desired color
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: 5,
                                    padding: 5,
                                }}
                            >
                                <Text style={{ fontSize: 14, color: 'white' }}>Clear Images</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};

const ImageUploader = ({ dragSortableViewRef, handleClearImagesExtra }) => {
    const dispatch = useDispatch();
    const { width } = Dimensions.get('window');

    const deleteImageVisible = useSelector((state) => state.deleteImageVisible);
    const [boolean, setBoolean] = useState(true);
    const selectedImages = useSelector((state) => state.selectedImages);
    // const [selectedImages, setSelectedImages] = useState([]);
    const isAddPhotoVisible = useSelector((state) => state.isAddPhotoVisible);
    const addAnotherImages = useSelector((state) => state.addAnotherImages);
    // const [IsAddPhotoVisible, setIsAddPhotoVisible] = useState(true);
    // const [addAnotherImages, setAddAnotherImages] = useState(false);
    // const modalDeleteImagesVisible = useSelector((state) => state.modalDeleteImagesVisible);
    const [modalDeleteImagesVisible, setModalDeleteImagesVisible] = useState(false);
    const [scrollEnabled, setscrollEnabled] = useState(true);
    const [isEnterEdit, setisEnterEdit] = useState(false);
    const [widthState, setWidthState] = useState(Dimensions.get('window').width);
    const [isCursorLoading, setIsCursorLoading] = useState(false);
    const [modalImageUri, setModalImageUri] = useState('');
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [isFileSizeLimitModal, setIsFileSizeLimitModal] = useState(false);

    const handleImagePress = useCallback((uri) => {
        // const base64Image = toString(uri);
        // setIsLoading(true);
        setIsCursorLoading(true);
        setModalImageUri(uri);
        setImageModalVisible(true);
        // console.log("URI: ", uri);

    }, []);

    const styles = StyleSheet.create({
        dropdown: {
            margin: 16,
            height: 50,
            borderBottomColor: 'gray',
            borderBottomWidth: 0.5,
        },
        icon: {
            marginRight: 5,
        },
        placeholderStyle: {
            fontSize: 16,
        },
        selectedTextStyle: {
            fontSize: 16,
        },
        iconStyle: {
            width: 20,
            height: 20,
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16,
        },
        container: {
            flex: 1,
            paddingTop: 20,

        },
        txt: {
            fontSize: 18,
            lineHeight: 24,
            padding: 5
        },
        sort: {
        },
        item_children: {
            width: 90,
            height: 90,
            backgroundColor: 'black',
            justifyContent: "center",
            alignItems: "center",
        },
        item_delete_icon: {
            width: 14,
            height: 14,
            position: "absolute",
            right: 1,
            top: 1
        },
        item_icon: {
            width: 90,
            height: 90,
            resizeMode: "contain",
            position: "absolute"
        }
    });

    const handleImageAddToSelection = async () => {
        dispatch(setDeleteImageVisible(true));
        if (selectedImages.length === 40) {
            return; // Limit reached, do not add a new image
        }

        const options = {
            mediaType: 'photo',
            // quality: 10,
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
                // console.log('User cancelled image picker');
                return;
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
                return;
            } else if (!response.assets || response.assets.length === 0) {
                // console.log('No images selected.');
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
                    setIsFileSizeLimitModal(true);
                }
            });

            await Promise.all(promises);

            const limitedImages = newImages.slice(0, 40);
            dispatch(setSelectedImages(limitedImages));
            globalSelectedImages = limitedImages;

            if (limitedImages.length >= 40) {
                dispatch(setAddAnotherImages(false));
            }

            // limitedImages.forEach((image) => {
            //   console.log(`File size: ${image.fileSize}`);
            // });

        } catch (error) {
            // console.log('ImagePicker Error: ', error);
        }
    };

    const reloadData = useCallback(() => {
        if (selectedImages.length > 0) {
            // ... Logic to reload data using selectedImages and width

            // Assuming your logic has updated selectedImages, you can directly use it here
            const updatedSelectedImages = [...selectedImages];

            // Dispatch the updatedSelectedImages array to the state
            dispatch(setSelectedImages(updatedSelectedImages));
        }

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



    const handleClearImages = useCallback(() => {
        setModalDeleteImagesVisible(false);
        // dispatch(setSelectedImages([]));
        // globalSelectedImages = [];
        // dispatch(setIsAddPhotoVisible(true));
        // dispatch(setAddAnotherImages(false));
        // dispatch(setDeleteImageVisible(true));
        handleClearImagesExtra();

    }, []);



    const renderItem = useCallback((item) => {

        // console.log(item.id);
        // console.log(index)
        if (isEnterEdit) {

            return (

                <Box key={item.uri} style={styles.item}>
                    <Box style={styles.item_children}>

                        <FastImage
                            style={styles.item_icon}
                            source={{
                                uri: item.uri,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Box
                            position="absolute"
                            top={-3}
                            right={-3}
                            bg="rgba(0, 0, 0, 0.5)"
                            borderRadius={10}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Pressable onPress={() => handleDeleteImagePress(item.uri)} display={boolean ? 'block' : 'none'}>
                                <Icon as={<Entypo name="circle-with-cross" />} size={4} color={"white"} cursor={'pointer'} />
                            </Pressable>
                        </Box>
                    </Box>
                </Box>

            );
        } else {

            return (

                <Box key={item.id} style={styles.item}>
                    <Box style={styles.item_children}>

                        <FastImage
                            style={styles.item_icon}
                            source={{
                                uri: item.uri,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}

                        />

                        <Box
                            position="absolute"
                            top={-3}
                            right={-3}
                            bg="rgba(0, 0, 0, 0.5)"
                            borderRadius={10}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Pressable onPress={() => handleDeleteImagePress(item.uri)} display={boolean ? 'block' : 'none'}>
                                <Icon as={<Entypo name="circle-with-cross" />} size={4} color={"white"} cursor={'pointer'} />
                            </Pressable>
                        </Box>
                    </Box>
                </Box>
            );
        }


    }, []);

    const getImagesRenderItem = useCallback((item) => {

        // console.log(item.id);
        // console.log(index)
        if (isEnterEdit) {

            return (

                <Box key={item.uri} style={styles.item}>
                    <Box style={styles.item_children}>

                        <FastImage
                            style={styles.item_icon}
                            source={{
                                uri: item.uri,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />


                    </Box>
                </Box>

            );
        } else {

            return (

                <Box key={item.id} style={styles.item}>
                    <Box style={styles.item_children}>

                        <FastImage
                            style={styles.item_icon}
                            source={{
                                uri: item.uri,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}

                        />

                    </Box>
                </Box>
            );
        }


    }, []);


    const handleImageSelection = async () => {
        const options = {
            mediaType: 'photo',
            // quality: 10,
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
                // console.log('User cancelled image picker');
                return;
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
                return;
            } else if (!response.assets || response.assets.length === 0) {
                // console.log('No images selected.');
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
                    setIsFileSizeLimitModal(true);
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

            globalSelectedImages = limitedImages;
            if (limitedImages.length > 0) {
                dispatch(setIsAddPhotoVisible(false));
                dispatch(setAddAnotherImages(true));
            }

            if (limitedImages.length >= 40) {
                dispatch(setIsAddPhotoVisible(false));
                dispatch(setAddAnotherImages(false));
            }

            dispatch(setSelectedImages(globalSelectedImages));

        } catch (error) {
            // console.log('ImagePicker Error: ', error);
        }
    };





    const handleDeleteImagePress = useCallback((uri) => {

        globalSelectedImages = globalSelectedImages.filter((item) => {
            // Replace 'uriToDelete' with the URI you want to delete
            return item.uri !== uri;
        });

        if (globalSelectedImages.length < 40) {
            dispatch(setAddAnotherImages(true));
        }

        if (globalSelectedImages.length == 0) {
            dispatch(setAddAnotherImages(false));
            dispatch(setIsAddPhotoVisible(true));
        }
        dispatch(setSelectedImages(globalSelectedImages));
        // dispatch(setSelectedImages((prevImages) => {
        //   const updatedImages = prevImages.filter((image) => image.uri !== uri);

        //   if (updatedImages.length < 40) {
        //     dispatch(setAddAnotherImages(true));
        //   }
        //   if (updatedImages.length == 0) {
        //    dispatch(setAddAnotherImages(false));
        //     dispatch(setIsAddPhotoVisible(true));
        //   }
        //   return updatedImages;
        // }));

        // console.log(globalSelectedImages.map((item) => item.uri));
    }, []);





    return (
        <>
            {/* <Box flex={1} flexDir={['column', 'column', 'column', 'row', 'row', 'row']}> */}


            <Box flex={1} borderColor={'white'} borderWidth={1}>
                <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }}>
                    <Box justifyContent={'center'} alignItems={'center'} h={'full'} w={'full'}>

                        <ClearImagesModal
                            modalDeleteImagesVisible={modalDeleteImagesVisible}
                            setModalDeleteImagesVisible={setModalDeleteImagesVisible}
                            handleClearImages={handleClearImages}
                            selectedImages={selectedImages}
                            isAddPhotoVisible={isAddPhotoVisible} />

                        <Box justifyContent={'center'} alignSelf={'center'} alignItems={'center'} margin={3}>

                            <Icon display={isAddPhotoVisible ? 'block' : 'none'} onPress={handleImageSelection} as={<MaterialIcons name="add-photo-alternate" />} size={100} ml="2" color="#12293F" />


                            <ScrollView
                                scrollEnabled={scrollEnabled}
                                flex={1}
                            >
                                <Box flex={1} display={deleteImageVisible ? 'flex' : 'none'} width={'full'} alignItems={'center'} justifyContent={'center'}>


                                    <DragSortableView
                                        ref={dragSortableViewRef}
                                        dataSource={selectedImages}
                                        delayLongPress={100}
                                        parentWidth={width * 0.33}
                                        childrenWidth={100}
                                        childrenHeight={100}
                                        marginChildrenTop={3}
                                        marginChildrenBottom={0}
                                        marginChildrenLeft={0}
                                        marginChildrenRight={0}
                                        onDragStart={useCallback(() => {
                                            if (!isEnterEdit) {
                                                setisEnterEdit(true);
                                                setscrollEnabled(false);
                                            } else {
                                                setscrollEnabled(false);
                                            }
                                        }, [])}
                                        onDragEnd={useCallback(() => {
                                            setscrollEnabled(true);
                                        }, [])}
                                        onDataChange={useCallback((data) => {

                                            if (data.length !== data) {
                                                dispatch(setSelectedImages(data));
                                                globalSelectedImages = data;
                                            }

                                        }, [])}
                                        onClickItem={(item, index) => {
                                            handleImagePress(index.uri);
                                        }}
                                        keyExtractor={(item) => item.uri} // FlatList作用一样，优化
                                        renderItem={
                                            useCallback((item, index) => renderItem(item, index), [])} />

                                    <Center>
                                        <Icon display={addAnotherImages ? 'block' : 'none'} onPress={handleImageAddToSelection} as={<Entypo name="plus" />} ml={'2'} size={50} color="#12293F" />
                                    </Center>

                                </Box>



                                <Box flex={1} display={deleteImageVisible ? 'none' : 'flex'} width={'full'}>


                                    <DragSortableView
                                        sortable={false}
                                        ref={dragSortableViewRef}
                                        dataSource={selectedImages}
                                        parentWidth={width * 0.33}
                                        childrenWidth={100}
                                        childrenHeight={100}
                                        marginChildrenTop={3}
                                        marginChildrenBottom={0}
                                        marginChildrenLeft={0}
                                        marginChildrenRight={0}
                                        onClickItem={(item, index) => {
                                            handleImagePress(index.uri);
                                        }}
                                        keyExtractor={(item) => item.uri} // FlatList作用一样，优化
                                        renderItem={
                                            useCallback((item, index) => getImagesRenderItem(item, index), [])} />

                                </Box>
                            </ScrollView>




                        </Box>


                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            borderRadius={3}
                            bgColor={'rgba(0, 0, 0, 0.5)'}
                            alignItems="center"
                            justifyContent="center"
                            display={isAddPhotoVisible ? 'none' : 'block'}>
                            <Text marginLeft={1} marginRight={1} color={'white'} bold italic fontSize={12}>Selected {selectedImages.length} image(s) (Maximum of 40)</Text>
                        </Box>
                    </Box>

                </ScrollView>



            </Box>

            {/* </Box> */}

            <Modal isOpen={imageModalVisible} onClose={() => setImageModalVisible(false)} size={'100%'} useRNModal>

                <Box w={'80%'} h={'80%'} bgColor={'rgba(0, 0, 0, 0.7)'} borderRadius={10} display="flex" alignItems="center" justifyContent="center" alignContent={'center'}>
                    <Modal.CloseButton color={'white'} />
                    <NativeImage
                        key={modalImageUri}
                        source={{ uri: modalImageUri }}
                        resizeMode='contain'
                        flex={1}
                        alt={modalImageUri}
                        h={720}
                        w={1280}
                    />

                </Box>

            </Modal>

            <Modal isOpen={isFileSizeLimitModal} onClose={() => setIsFileSizeLimitModal(false)} useRNModal>
                <Modal.Content bgColor={'danger.100'}>
                    <Modal.Header borderBottomWidth={0} bgColor={'danger.100'}>
                        <Text color={'#102A43'} bold>
                            Failed!
                        </Text>
                    </Modal.Header>
                    <Modal.Body
                        bgColor={'danger.200'}
                        borderLeftWidth={4}
                        borderLeftColor={'danger.600'}
                        margin={5}
                    >
                        <Box flex={1}>
                            <Text color={'danger.600'} bold>
                                Failed!
                            </Text>
                            <Text color={'danger.600'}>
                                Please select image(s) smaller than 10MB!
                            </Text>
                        </Box>
                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0} bgColor={'danger.100'}>
                        <HStack space={5} flex={1}>
                            <Button colorScheme={'primary'} flex="1" onPress={() => setIsFileSizeLimitModal(false)} _text={{ color: 'white' }}>
                                Ok
                            </Button>
                        </HStack>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};

const ImageUploadModal = ({ handleUploadImagesModalClose, screenWidth, dragSortableViewRef, handleClearImagesExtra, handleUploadImages }) => {

    const uploadImagesModalVisible = useSelector((state) => state.uploadImagesModalVisible)
    const uploadImagesButtonLoading = useSelector((state) => state.uploadImagesButtonLoading)
    return (
        <Modal isOpen={uploadImagesModalVisible} onClose={handleUploadImagesModalClose} size={'full'} useRNModal>
            <Modal.Content bgColor={'white'} w={'90%'} h={'100%'}>
                <Modal.CloseButton />
                <Modal.Header bgColor={'#7B9CFF'} flexDir={screenWidth <= 960 ? 'column' : 'row'} alignItems={screenWidth <= 960 ? 'center' : ''}>
                    <Text color={'white'} fontSize={20} bold>Upload Images for </Text><Text color={'cyan.200'} fontSize={20} bold textAlign={screenWidth <= 960 ? 'center' : ''}>{globalSelectedVehicle}</Text>
                </Modal.Header>


                <View style={{ flex: 1, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                    <View style={{ borderWidth: 1, borderColor: '#12293F', width: '95%', height: '95%' }}>

                        <ImageUploader dragSortableViewRef={dragSortableViewRef} handleClearImagesExtra={handleClearImagesExtra} />

                    </View>

                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={handleUploadImagesModalClose}
                        style={{
                            backgroundColor: '#525252',
                            borderRadius: 5,
                            margin: 3,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                        }}>
                        <Text style={{ color: 'white' }}>Close</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 4 }} />

                    <TouchableOpacity
                        disabled={uploadImagesButtonLoading}
                        onPress={handleUploadImages}
                        style={{
                            backgroundColor: '#16A34A',
                            borderRadius: 5,
                            margin: 3,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                        }}>
                        {!uploadImagesButtonLoading ? (
                            <Text style={{ color: 'white' }}>Upload</Text>) : (
                            <Spinner color="white" />
                        )}
                    </TouchableOpacity>


                </View>



            </Modal.Content>

        </Modal>

    );
}

const UploadImagesModal = ({ fetchImageCounts }) => {


    const screenWidth = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const toast = useToast();
    const dragSortableViewRef = useRef();

    const handleClearImagesExtra = () => {
        dispatch(setSelectedImages([]));
        globalSelectedImages = [];
        dispatch(setIsAddPhotoVisible(true));
        dispatch(setAddAnotherImages(false));
        dispatch(setDeleteImageVisible(true));
    };


    const handleUploadImagesModalClose = () => {

        dispatch(setUploadImagesModalVisible(false));
        // globalCurrentStockID = '';
        handleClearImagesExtra();
        globalSelectedVehicle = '';
    }

    const uploadImages = useCallback(async () => {

        const storageRef = ref(storage, `${globalCurrentStockID}`);
        const ImageFormat = { jpg: 'jpg' };
        const collectionRef = collection(projectExtensionFirestore, 'accounts');
        const docRef = doc(collectionRef, globalCurrentStockID);



        try {
            // Get the names of the images to keep
            const imageNamesToKeep = globalSelectedImages.map((asset, index) => index.toString());

            // Delete existing files in the folder that do not match the names of the images to keep
            const listResult = await listAll(storageRef);
            await Promise.all(
                listResult.items
                    .filter((itemRef) => !imageNamesToKeep.includes(itemRef.name))
                    .map((itemRef) => deleteObject(itemRef))
            );

            await Promise.all(
                globalSelectedImages.map(async (asset, index) => {
                    const { uri } = asset;
                    const imagename = index.toString();

                    const response = await fetch(uri);
                    const blob = await response.blob();

                    // Create an offscreen canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Create a new image object
                    const img = new Image();
                    img.src = URL.createObjectURL(blob);

                    // Draw the image on the canvas
                    img.onload = async () => {
                        // Create a canvas element
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // Calculate the desired width and height for the resized image
                        const maxWidth = 800; // Set your desired maximum width
                        const maxHeight = 600; // Set your desired maximum height
                        let newWidth = img.width;
                        let newHeight = img.height;

                        // Check if the image needs resizing
                        if (img.width > maxWidth) {
                            newWidth = maxWidth;
                            newHeight = (img.height * maxWidth) / img.width;
                        }

                        if (newHeight > maxHeight) {
                            newWidth = (newWidth * maxHeight) / newHeight;
                            newHeight = maxHeight;
                        }

                        // Set the canvas dimensions to the new width and height
                        canvas.width = newWidth;
                        canvas.height = newHeight;

                        // Draw the resized image onto the canvas
                        ctx.drawImage(img, 0, 0, newWidth, newHeight);

                        // Calculate the font size as a percentage of the image width
                        const fontSizePercentage = 3;
                        const imageRes = img.height * img.width;
                        const fontSize = (canvas.width * fontSizePercentage) / 100;

                        ctx.font = `bold ${fontSize}px Arial`;
                        ctx.fillStyle = '#fff';
                        ctx.shadowColor = 'transparent';
                        ctx.imageSmoothingEnabled = true;
                        ctx.lineWidth = 2;

                        // Calculate the position for the watermark text
                        const watermarkText = `Real Motor Japan ${globalSelectedVehicleReferenceNumber}`;
                        const textWidth = ctx.measureText(watermarkText).width;
                        const textHeight = fontSize; // Font size determines the text height

                        // Set padding around the text (adjust as needed)
                        const paddingX = 10;
                        const paddingY = 5;

                        // Calculate the position for the text shadow
                        const xShadow = (canvas.width - textWidth) / 2 + 2; // Adjust the horizontal position for the shadow
                        const yShadow = canvas.height - 20 + 2; // Adjust the vertical position for the shadow

                        // Increase the shadow thickness by adjusting the shadow blur radius
                        ctx.shadowBlur = 10; // Adjust this value to make the shadow thicker

                        // Draw the text shadow (black)
                        ctx.fillStyle = 'black';
                        ctx.fillText(watermarkText, xShadow, yShadow);

                        // Reset the shadow blur radius for the actual text
                        ctx.shadowBlur = 2; // Reset the shadow blur radius to the original value

                        // Calculate the position for the actual text
                        const x = (canvas.width - textWidth) / 2;
                        const y = canvas.height - 20;

                        // Draw the actual text (white)
                        ctx.fillStyle = '#fff';
                        ctx.fillText(watermarkText, x, y);

                        // Convert the canvas to a blob
                        const watermarkedImageBlob = await new Promise(resolve => {
                            canvas.toBlob(resolve, 'image/jpeg', 0.8); // You can adjust the quality (0.7 is a good compromise between size and quality)
                        });

                        // Upload the resized image to Firebase Storage
                        const imageRef = ref(storage, `${globalCurrentStockID}/${imagename}`);
                        await uploadBytes(imageRef, watermarkedImageBlob, { contentType: 'image/jpeg' });
                    };
                })
            );
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
            const imageCount = {
                imageCount: globalSelectedImages.length,
            };

            await updateDoc(docRef, imageCount);

            const logData = {
                message: `Vehicle Updated: "${nameVariable.text}" updated "${globalSelectedCarName}" images with a reference number of "${globalSelectedVehicleReferenceNumber}" using Vehicle List`,
                timestamp: formattedTime,
                colorScheme: true,
                keywords: [
                    formattedTime.toLowerCase(),
                    globalCurrentStockID.toLowerCase(),
                    `Vehicle Updated: "${nameVariable.text}" updated "${globalSelectedCarName}" images with a reference number of "${globalSelectedVehicleReferenceNumber} using Vehicle List"`.toLowerCase(),
                    'Vehicle List'.toLowerCase(),
                    'Vehicle Updated'.toLowerCase(),
                    'Vehicle'.toLowerCase(),
                    'Updated'.toLowerCase(),
                    globalSelectedCarName.toLowerCase(),
                    globalSelectedVehicleReferenceNumber.toLowerCase(),
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

            // console.log(`Images uploaded to folder ${globalCurrentStockID}`);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    }, []);


    const handleUploadImages = async () => {

        dispatch(setUploadImagesButtonLoading(true));

        if (globalSelectedImages.length > 0) {
            toast.closeAll();
            try {
                await uploadImages();
                dispatch(setUploadImagesButtonLoading(false));
                fetchImageCounts();
                handleUploadImagesModalClose();
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Uploaded Images successfully!</Text>
                        </View>;
                    }
                })

            } catch (error) {
                console.error(error);
                dispatch(setUploadImagesButtonLoading(false));
                handleUploadImagesModalClose();

                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Uploaded Error: {error}</Text>
                        </View>;
                    }
                })
            }
        }

        else {
            dispatch(setUploadImagesButtonLoading(false));
        }



    };

    return (

        <>
            <ImageUploadModal
                handleUploadImagesModalClose={handleUploadImagesModalClose}
                screenWidth={screenWidth}
                dragSortableViewRef={dragSortableViewRef}
                handleClearImagesExtra={handleClearImagesExtra}
                handleUploadImages={handleUploadImages} />
        </>
    );

};


const SupplyChainsCosts = ({ data }) => {

    const dispatch = useDispatch();



    const handleModalSupplyChainsCostsOpen = useCallback((data) => {
        dispatch(setSupplyChainsCostsModalVisible(true));
        dispatch(setVehicleListSupplyChainsCostsData(data.supplyChainsCostsData ? data.supplyChainsCostsData : []));
        globalSupplyChainCostsData = data.supplyChainsCostsData;
        globalCurrentSupplyChainCostsData = data.supplyChainsCostsData;
        globalCurrentStockID = data.stockID;
        globalSelectedVehicle = `${data.referenceNumber} / ${data.carName}`;
        globalSelectedVehicleReferenceNumber = data.referenceNumber;
        globalSelectedCarName = data.carName;

    }, []);

    return (
        <><TouchableOpacity
            onPress={() => handleModalSupplyChainsCostsOpen(data)}
            style={{
                backgroundColor: '#12293F',
                borderRadius: 5,
                padding: 2,
                // flex: 1,
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {/* <Text style={{ textAlign: 'center', }}>Expense</Text> */}
            <MaterialIcons name="payments" size={22} color="white" />
        </TouchableOpacity>


        </>


    );
}

const AllSccModals = ({ supplyChainsCostsModalVisible, supplyChainsCostsData, expenseNameData, paidToData, currentDate, vehicleListSupplyChainsCostsData }) => {
    const screenWidth = Dimensions.get('window').width;

    const dispatch = useDispatch();

    const toast = useToast();

    const [sccData, setSccData] = useState([]);

    // const supplyChainsCostsModalVisible = useSelector((state) => state.supplyChainsCostsModalVisible);
    const [modalCalendarVisible, setModalCalendarVisible] = useState(false);


    const [clearModalVisible, setClearModalVisible] = useState(false);
    const [data, setData] = useState([]);

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [inputAmountIsError, setInputAmountIsError] = useState(false);
    const [expenseNameIsError, setExpenseNameIsError] = useState(false);
    const [paidToIsError, setPaidToIsError] = useState(false);
    const [totalAmount, setTotalAmount] = useState(globalSupplyChainCostsAmount);
    // const selectedExpenseName = useSelector((state) => state.selectedExpenseName);
    // const selectedPaidTo = useSelector((state) => state.selectedPaidTo);
    const [selectResetKey, setSelectResetKey] = useState(nanoid());
    const selectExpenseNameRef = useRef(null);
    const selectPaidToRef = useRef(null);
    const expenseViewRef = useRef(null);

    const textAreaAddExpenseName = useRef(null);
    const textAreaAddPaidTo = useRef(null);
    const inputExpenseAmount = useRef(null);
    const handleInputExpenseAmountChange = (text) => {
        // Remove any non-numeric characters
        const numericValue = text.replace(/[^0-9]/g, '');

        // Limit the numeric value to a maximum of 4 characters
        const truncatedValue = numericValue.slice(0, 6);

        // Format the truncated numeric value with comma separator
        const formattedValue = Number(truncatedValue).toLocaleString();

        inputExpenseAmount.current.value = formattedValue;
    };





    const handleModalSupplyChainsCostsClose = () => {
        dispatch(setSupplyChainsCostsModalVisible(false));
        inputExpenseAmount.current?.clear();
        globalSelectedExpenseName = '';
        setSelectResetKey(nanoid());
        globalSelectedPaidTo = '';
        setSelectedDate(currentDate);
        globalSPCSelectedDate = currentDate;
        dispatch(setSelectedExpenseName(''));
        dispatch(setSelectedPaidTo(''));
        setInputAmountIsError(false);
        setExpenseNameIsError(false);
        setPaidToIsError(false);
        globalSelectedVehicle = '';
    };


    const handleClearModalOpen = () => {
        setClearModalVisible(true);
    };

    const handleClearModalClose = () => {
        setClearModalVisible(false);
    };

    useEffect(() => {
        const amounts = vehicleListSupplyChainsCostsData.map((item) => {
            const expenseName = Object.keys(item)[0];
            const expenseData = item[expenseName];
            return parseFloat(expenseData.amount.replace(',', '')) || 0;
        });

        // Use reduce to add up all the amounts
        const totalAmount = amounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const formattedTotalAmount = totalAmount.toLocaleString();
        setTotalAmount(formattedTotalAmount);
        globalSupplyChainCostsAmount = formattedTotalAmount;

    }, [vehicleListSupplyChainsCostsData]);

    const handleSave = useCallback(() => {



        if (inputExpenseAmount.current?.value == ''
            || inputExpenseAmount.current?.value == 0
            || globalSelectedExpenseName == ''
            || globalSelectedPaidTo == ''
        ) {

            if (inputExpenseAmount.current?.value == '' || inputExpenseAmount.current?.value == 0) {
                setInputAmountIsError(true);
            }

            if (globalSelectedExpenseName == '') {
                setExpenseNameIsError(true);
            }

            if (globalSelectedPaidTo == '') {
                setPaidToIsError(true);
            }
        }

        else {
            const existingIndex = globalSupplyChainCostsData.findIndex(item => item[globalSelectedExpenseName]);

            if (existingIndex !== -1) {
                // If an entry with the same expense name exists, update it
                const updatedData = cloneDeep(globalSupplyChainCostsData);
                updatedData[existingIndex][globalSelectedExpenseName] = {
                    expenseName: globalSelectedExpenseName,
                    amount: inputExpenseAmount.current?.value,
                    date: globalSPCSelectedDate,
                    paidName: globalSelectedPaidTo,
                };
                globalSupplyChainCostsData = updatedData;
                dispatch(setVehicleListSupplyChainsCostsData(globalSupplyChainCostsData));
                dispatch(setSelectedExpenseName(''));
                dispatch(setSelectedPaidTo(''));
                inputExpenseAmount.current.clear();
                globalSelectedExpenseName = '';
                globalSelectedPaidTo = '';
                setSelectedDate(currentDate);
                globalSPCSelectedDate = currentDate;

            } else {
                setInputAmountIsError(false);
                setExpenseNameIsError(false);
                setPaidToIsError(false);
                // If no entry with the same expense name exists, add a new entry
                const newData = {
                    [globalSelectedExpenseName]: {
                        expenseName: globalSelectedExpenseName,
                        amount: inputExpenseAmount.current?.value,
                        date: globalSPCSelectedDate,
                        paidName: globalSelectedPaidTo,
                    },
                };
                globalSupplyChainCostsData = [...globalSupplyChainCostsData, newData];
                // console.log(globalSupplyChainCostsData);
                // const updatedData = { ...supplyChainsCostsData, ...newData };
                dispatch(setVehicleListSupplyChainsCostsData(globalSupplyChainCostsData));
                // globalSupplyChainCostsData = [...supplyChainsCostsData, newData];
                setSelectResetKey(nanoid());
                inputExpenseAmount.current.clear();
                globalSelectedExpenseName = '';
                globalSelectedPaidTo = '';
                setSelectedDate(currentDate);
                globalSPCSelectedDate = currentDate;
                dispatch(setSelectedExpenseName(''));
                dispatch(setSelectedPaidTo(''));


            }

        }



    }, []);



    const handleEditPress = useCallback((item) => {
        // console.log(item.amount);
        inputExpenseAmount.current.setNativeProps({ text: item.amount });
        dispatch(setSelectedExpenseName(item.expenseName));
        globalSelectedExpenseName = item.expenseName;
        dispatch(setSelectedPaidTo(item.paidName));
        globalSelectedPaidTo = item.paidName;
        globalSPCSelectedDate = item.date;
        setSelectedDate(item.date);
        expenseViewRef.current.scrollIntoView({ behavior: 'smooth' });

    }, [])


    const handleDeleteItem = (expenseName) => {
        // Find the index of the item to be deleted
        const itemIndex = globalSupplyChainCostsData.findIndex((item) => Object.keys(item)[0] === expenseName);

        if (itemIndex !== -1) {
            // Create a copy of the data array and remove the item at the found index
            const newData = [...globalSupplyChainCostsData];
            newData.splice(itemIndex, 1);

            // Update the state with the new array
            dispatch(setVehicleListSupplyChainsCostsData(newData));
            globalSupplyChainCostsData = newData;
        }
    };

    const handleFirstModalClose = () => {
        dispatch(setSupplyChainsCostsModalVisible(false));

    };
    const handleFirstModalOpen = () => {
        dispatch(setSupplyChainsCostsModalVisible(true));

    }

    const handleAddExpenseNameTextChange = () => {
        const textAreaValue = textAreaAddExpenseName.current?.value;
        if (textAreaValue) {
            const newText = textAreaValue
                .split('\n')
                .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
                .join('\n');
            textAreaAddExpenseName.current.setNativeProps({ text: newText });
        }
    };

    const handleAddPaidToTextChange = () => {
        const textAreaValue = textAreaAddPaidTo.current?.value;
        if (textAreaValue) {
            const newText = textAreaValue
                .split('\n')
                .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
                .join('\n');
            textAreaAddPaidTo.current.setNativeProps({ text: newText });
        }
    };

    const handleSaveSupplyChainsCosts = async () => {

        toast.closeAll();
        if (globalCurrentSupplyChainCostsData == globalSupplyChainCostsData) {
            // console.log('Same price, will not update')
            dispatch(setSupplyChainsCostsModalVisible(false));
            toast.show({
                render: () => {
                    return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Supply Chains Costs updated successfully!</Text>
                    </View>;
                }
            })
        }
        else {
            const vehicleProductRef = doc(collection(projectExtensionFirestore, 'accounts'), globalCurrentStockID);

            try {
                await updateDoc(vehicleProductRef, { supplyChainsCostsData: globalSupplyChainCostsData });
                dispatch(setSupplyChainsCostsModalVisible(false));
                // console.log('Supply Chains Costs updated successfully');
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Supply Chains Costs updated successfully!</Text>
                        </View>;
                    }
                })

                dispatch(setSupplyChainsCostsModalVisible(false));
                dispatch(setVehicleListSupplyChainsCostsData([]));
                globalSupplyChainCostsData = [];
                globalCurrentSupplyChainCostsData = [];
                globalCurrentStockID = '';


            } catch (error) {
                console.error(error);
                toast.show({
                    render: () => {
                        return <View style={{ backgroundColor: '#DC2626', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Error updating: {error}</Text>
                        </View>;
                    }
                })
            }
        }

        // Reference the Firestore document and update the 'fobPrice' field

    };
    return (

        <><Modal isOpen={supplyChainsCostsModalVisible} onClose={handleModalSupplyChainsCostsClose} size={'full'}>
            <Modal.Content bgColor={'white'} w={screenWidth <= 960 ? '90%' : '50%'} h={'auto'}>
                <Modal.CloseButton />
                <Modal.Header bgColor={'#7B9CFF'} flexDir={screenWidth <= 1380 ? 'column' : 'row'} alignItems={screenWidth <= 1380 ? 'center' : ''}>
                    <Text color={'white'} fontSize={20} bold>Supply Chains Costs</Text>
                    <Text color={'cyan.200'} fontSize={20} bold textAlign={screenWidth <= 1380 ? 'center' : ''}> {globalSelectedVehicle}</Text>
                </Modal.Header>
                <Modal.Body>
                    <View style={{ height: '100%' }}>
                        <View paddingBottom={5}>
                            <View style={{ flexDirection: screenWidth <= 960 ? 'column' : 'row', paddingBottom: 1, }} ref={expenseViewRef}>
                                <View style={{
                                    backgroundColor: '#7B9CFF', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 3,
                                    padding: screenWidth <= 960 ? 5 : 0,
                                }}
                                    bgColor={'#7B9CFF'} flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
                                    <Text color={'white'} alignSelf={'center'} marginLeft={2} flex={1}>Expense</Text>
                                    <SupplyChainsCostsSortAndAddModal
                                        docName='ExpenseName'
                                        handleAddTextChange={handleAddExpenseNameTextChange}
                                        textAreaAdd={textAreaAddExpenseName}
                                        title='Expense Name'
                                        dataName={'expenseName'}
                                        databaseInit={projectExtensionFirestore}
                                        headerText="Rearrange/Add Expense Name"
                                        data={expenseNameData}
                                        handleFirstModalClose={handleFirstModalClose}
                                        handleFirstModalOpen={handleFirstModalOpen} />
                                </View>
                                <SelectExpenseName expenseNameIsError={expenseNameIsError} selectExpenseNameRef={selectExpenseNameRef} selectResetKey={selectResetKey} setSelectResetKey={setSelectResetKey} />
                            </View>


                            <View style={{ flexDirection: screenWidth <= 960 ? 'column' : 'row', paddingBottom: screenWidth <= 960 ? 8 : 1, }} flexDir={'row'} paddingBottom={1}>
                                <View style={{
                                    backgroundColor: '#7B9CFF', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 3,
                                    padding: screenWidth <= 960 ? 5 : 0,
                                }}
                                    bgColor={'#7B9CFF'} flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
                                    <Text color={'white'} alignSelf={'center'} marginLeft={2} flex={2}>Amount</Text>
                                </View>
                                <Input
                                    borderColor={inputAmountIsError ? 'error.400' : 'muted.300'}
                                    flex={3}
                                    ref={inputExpenseAmount}
                                    onChangeText={handleInputExpenseAmountChange}
                                    placeholder="Amount"
                                    bgColor={'white'}
                                    placeholderTextColor={'muted.400'}
                                    InputLeftElement={<Icon as={<FontAwesome name="yen" />} size={5} ml="2" color="muted.400" />} />
                            </View>

                            <View style={{ flexDirection: screenWidth <= 960 ? 'column' : 'row', paddingBottom: 1, }} flexDir={'row'} paddingBottom={1}>
                                <View style={{
                                    backgroundColor: '#7B9CFF', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 3,
                                    padding: screenWidth <= 960 ? 5 : 0,
                                }}
                                    bgColor={'#7B9CFF'} flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
                                    <Text color={'white'} alignSelf={'center'} marginLeft={2} flex={1}>Date</Text>
                                </View>
                                <ModalCalendar setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
                            </View>

                            <View style={{ flexDirection: screenWidth <= 960 ? 'column' : 'row', paddingBottom: 1, }} flexDir={'row'} paddingBottom={1}>
                                <View style={{
                                    backgroundColor: '#7B9CFF', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 3,
                                    padding: screenWidth <= 960 ? 5 : 0,
                                }}
                                    bgColor={'#7B9CFF'} flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
                                    <Text color={'white'} alignSelf={'center'} marginLeft={2} flex={1}>Paid to</Text>
                                    <SupplyChainsCostsSortAndAddModal
                                        docName='PaidTo'
                                        handleAddTextChange={handleAddPaidToTextChange}
                                        textAreaAdd={textAreaAddExpenseName}
                                        title='Paid To'
                                        dataName={'paidTo'}
                                        databaseInit={projectExtensionFirestore}
                                        headerText="Rearrange/Add Paid To"
                                        data={paidToData}
                                        handleFirstModalClose={handleFirstModalClose}
                                        handleFirstModalOpen={handleFirstModalOpen} />
                                </View>
                                <SelectPaidTo paidToIsError={paidToIsError} />
                            </View>

                            <TouchableHighlight
                                onPress={handleSave}
                                underlayColor="lightgreen"
                                style={{
                                    backgroundColor: '#16A34A',
                                    borderRadius: 5,
                                    margin: 1,
                                    flex: 1,
                                    width: screenWidth <= 960 ? '80%' : '40%',
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 10,
                                }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons name="add" color="white" size={20} />
                                    <Text style={{ color: 'white', marginLeft: 5 }}>ADD/EDIT</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        {screenWidth >= 1360 ? (

                            <View>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E4E4E7', backgroundColor: '#0642F4', }}
                                    flexDirection="row" borderBottomWidth={1} borderColor="gray.200" bgColor="#0642F4">
                                    <Text flex={1} color={'white'} marginLeft={1} bold>Expense Name</Text>
                                    <Text flex={1} color={'white'} marginLeft={1} bold>Amount</Text>
                                    <Text flex={1} color={'white'} marginLeft={1} bold>Date</Text>
                                    <Text flex={1} color={'white'} marginLeft={1} bold>Paid To</Text>
                                    <Text flex={1} color={'white'} marginLeft={1} bold>Modify</Text>
                                </View>
                                {vehicleListSupplyChainsCostsData.map((item, index) => {
                                    const expenseName = Object.keys(item)[0];
                                    const expenseData = item[expenseName];
                                    return (
                                        <View style={{ flexDirection: 'row', backgroundColor: '#D4D4D4', borderBottomColor: '#E4E4E7', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', }} key={index}
                                            flexDirection="row" bgColor={'muted.300'} borderBottomColor="gray.200" borderBottomWidth={1}
                                            justifyContent={'center'} alignItems={'center'}>
                                            <Text flex={1} marginLeft={1}>{expenseData.expenseName}</Text>
                                            <Text flex={1} marginLeft={1}>¥{expenseData.amount}</Text>
                                            <Text flex={1} marginLeft={1}>{expenseData.date}</Text>
                                            <Text flex={1} marginLeft={1}>{expenseData.paidName}</Text>
                                            <View style={{ flex: 1, flexDirection: 'row', marginLeft: 1 }}
                                                flex={1} marginLeft={1} flexDir={'row'}>
                                                <TouchableHighlight
                                                    onPress={() => handleEditPress(expenseData)}
                                                    underlayColor={'#005691'}
                                                    style={{
                                                        flex: 1,
                                                        margin: 1,
                                                        borderRadius: 3,
                                                    }}>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: '#06B6D4',
                                                            borderRadius: 3,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                        <Text style={{ color: 'white', textAlign: 'center' }}>Edit</Text>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight
                                                    onPress={() => handleDeleteItem(expenseData.expenseName)}
                                                    underlayColor={'#005691'}
                                                    style={{
                                                        flex: 1,
                                                        margin: 1,
                                                        borderRadius: 3,
                                                    }}>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: '#EF4444',
                                                            borderRadius: 3,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                        <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
                                                    </View>
                                                </TouchableHighlight>
                                                {/* <TouchableHighlight
                          onPress={() => handleDeleteItem(expenseData.expenseName)}
                          style={() => ({
                            flex: 1,
                            margin: 1,
                            borderRadius: 3,
                            backgroundColor: '#CD5C5C',
                          })}>
                          <View
                            style={{
                              flex: 1,
                              borderRadius: 3,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#CD5C5C',
                            }}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
                          </View>
                        </TouchableHighlight> */}
                                            </View>
                                        </View>
                                    )
                                })}

                            </View>

                        ) : (

                            <View>
                                {vehicleListSupplyChainsCostsData.map((item, index) => {
                                    const expenseName = Object.keys(item)[0];
                                    const expenseData = item[expenseName];
                                    return (

                                        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, margin: 3, marginBottom: 10, }} key={index}>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E4E4E7', backgroundColor: '#D4D4D4' }}>

                                                <View style={{ backgroundColor: '#0642F4', flex: 1, borderBottomWidth: 1, borderColor: '#E4E4E7', justifyContent: 'center', width: '30%' }}>
                                                    <Text color={'white'} bgColor={'#0642F4'} marginLeft={1} bold>Expense Name</Text>
                                                </View>

                                                <Text flex={1} marginLeft={1}>{expenseData.expenseName}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E4E4E7', backgroundColor: '#D4D4D4' }}>

                                                <View style={{ backgroundColor: '#0642F4', flex: 1, borderBottomWidth: 1, borderColor: '#E4E4E7', justifyContent: 'center', width: '30%' }}>
                                                    <Text color={'white'} bgColor={'#0642F4'} marginLeft={1} bold>Amount</Text>
                                                </View>

                                                <Text flex={1} marginLeft={1}>¥{expenseData.amount}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E4E4E7', backgroundColor: '#D4D4D4' }}>

                                                <View style={{ backgroundColor: '#0642F4', flex: 1, borderBottomWidth: 1, borderColor: '#E4E4E7', justifyContent: 'center', width: '30%' }}>
                                                    <Text color={'white'} bgColor={'#0642F4'} marginLeft={1} bold>Date</Text>
                                                </View>
                                                <Text flex={1} marginLeft={1}>{expenseData.date}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E4E4E7', backgroundColor: '#D4D4D4' }}>

                                                <View style={{ backgroundColor: '#0642F4', flex: 1, borderBottomWidth: 1, borderColor: '#E4E4E7', justifyContent: 'center', width: '30%' }}>
                                                    <Text color={'white'} bgColor={'#0642F4'} marginLeft={1} bold>Paid To</Text>
                                                </View>
                                                <Text flex={1} marginLeft={1}>{expenseData.paidName}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E4E4E7', backgroundColor: '#D4D4D4' }}>
                                                <View style={{ backgroundColor: '#0642F4', flex: 1, borderBottomWidth: 1, borderColor: '#E4E4E7', justifyContent: 'center', width: '30%' }}>
                                                    <Text color={'white'} bgColor={'#0642F4'} marginLeft={1} bold>Modify</Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', }}
                                                    flex={1} marginLeft={1} flexDir={'row'}>

                                                    <TouchableHighlight
                                                        onPress={() => handleEditPress(expenseData)}
                                                        underlayColor={'#005691'}
                                                        style={{
                                                            flex: 1,
                                                            margin: 1,
                                                            borderRadius: 3,
                                                        }}>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                backgroundColor: '#06B6D4',
                                                                borderRadius: 3,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}>
                                                            <Text style={{ color: 'white', textAlign: 'center' }}>Edit</Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                    <TouchableHighlight
                                                        onPress={() => handleDeleteItem(expenseData.expenseName)}
                                                        underlayColor={'#005691'}
                                                        style={{
                                                            flex: 1,
                                                            margin: 1,
                                                            borderRadius: 3,
                                                        }}>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                backgroundColor: '#EF4444',
                                                                borderRadius: 3,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}>
                                                            <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                    {/* <TouchableHighlight
                          onPress={() => handleDeleteItem(expenseData.expenseName)}
                          style={() => ({
                            flex: 1,
                            margin: 1,
                            borderRadius: 3,
                            backgroundColor: '#CD5C5C',
                          })}>
                          <View
                            style={{
                              flex: 1,
                              borderRadius: 3,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#CD5C5C',
                            }}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
                          </View>
                        </TouchableHighlight> */}
                                                </View>
                                            </View>

                                        </View>


                                    )
                                })}

                            </View>


                        )}

                    </View>


                </Modal.Body>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                    <TouchableOpacity
                        onPress={handleModalSupplyChainsCostsClose}
                        style={{
                            backgroundColor: '#525252',
                            borderRadius: 5,
                            margin: 3,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                        }}>
                        <Text style={{ color: 'white' }}>Close</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 4 }} />
                    <TouchableOpacity
                        onPress={handleSaveSupplyChainsCosts}
                        style={{
                            backgroundColor: '#16A34A',
                            borderRadius: 5,
                            margin: 3,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                        }}>
                        <Text style={{ color: 'white' }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal.Content>
        </Modal>
            {/* <Modal isOpen={clearModalVisible} onClose={handleClearModalClose} useRNModal>
          <Modal.Content bgColor={'amber.100'}>
            <Modal.CloseButton />
            <Modal.Header borderBottomWidth={0} bgColor={'amber.100'}>
              <Text color={'#102A43'} bold>
                Clear
              </Text>
            </Modal.Header>
            <Modal.Body
              justifyContent={'center'}
              alignItems={'center'}
              bgColor={'amber.200'}
              borderLeftWidth={4}
              borderLeftColor={'amber.600'}
              margin={5}>
              <View flex={1}>
                <Text color={'amber.600'} bold>Warning!</Text>
                <Text color={'amber.600'}>Are you sure you want to clear?</Text>
              </View>
            </Modal.Body>
            <Modal.Footer borderTopWidth={0} bgColor={'amber.100'}>
              <HStack space={5} flex={1}>
                <Button
                  onPress={handleClearModalClose}
                  colorScheme={'warmGray'}
                  flex={1}
                  size={'sm'}
                  borderRadius={5}
                >
                  No
                </Button>
                <Button
                  onPress={() => {
                  }}
                  flex={1} size={'sm'} colorScheme={'amber'} borderRadius={5}>
                  Clear
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal> */}
        </>

    );
};

const SelectPaidTo = ({ paidToIsError, }) => {

    const dispatch = useDispatch();
    const paidToData = useSelector((state) => state.paidToData);
    const selectedPaidTo = useSelector((state) => state.selectedPaidTo);



    return <Select
        selectedValue={selectedPaidTo}
        borderColor={paidToIsError ? 'error.400' : 'muted.300'}
        flex={3}
        onValueChange={(value) => {
            globalSelectedPaidTo = value
            dispatch(setSelectedPaidTo(value));
        }}
        accessibilityLabel="Choose Paid To"
        placeholder="Choose Paid To"
        _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
        }}>
        {paidToData.map((item) => (

            <Select.Item key={item} label={item} value={item} />

        ))}
    </Select>
        ;
};

const SupplyChainsCostsSortAndAddModal = ({ headerText, data, title, dataName, databaseInit, textAreaAdd, handleAddTextChange, docName, handleFirstModalOpen, handleFirstModalClose }) => {
    const [modalSortOpen, setModalSortOpen] = useState(false);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalAddSuccess, setModalAddSuccess] = useState(false);
    const [modalSave, setModalSave] = useState(false);
    const [modalSaveLoading, setModalSaveLoading] = useState(false);
    const [modalData, setModalData] = useState(data);
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const loginName = useSelector((state) => state.loginName);
    nameVariable.text = loginName;

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
        const modalDocRef = doc(collection(databaseInit, docName), docName);
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

        try {
            await updateDoc(doc(collection(databaseInit, docName), docName), { [dataName]: modalData });
            setModalSaveLoading(false);
            setModalSortOpen(true);
            setModalSave(false);


            const logData = {
                message: `"${title}" updated: "${nameVariable.text}" updated "${title}"`,
                timestamp: formattedTime,
                colorScheme: true,
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
        handleFirstModalClose();
    }, [modalSortOpen, modalIsLoading]);

    const handleSortModalClose = useCallback(async () => {

        setModalSortOpen(false);
        setModalIsLoading(false);
        handleFirstModalOpen();
    }, [modalSortOpen, modalIsLoading]);
    // const handleAddTextChange = () => {
    //   const newText = textAreaAdd.current?.value?.toUpperCase();
    //   textAreaAdd.current?.setNativeProps({ text: newText });
    // };


    const handleModalAddOpen = useCallback(() => {
        setModalAddOpen(true);
        handleSortModalClose();
        setModalIsLoading(true);
        handleFirstModalClose();

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
        handleFirstModalClose();
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

        if (data !== '') {

            setModalSaveLoading(true);

            try {
                const modalCollectionRef = collection(databaseInit, docName);
                const modalDocRef = doc(modalCollectionRef, docName);
                await setDoc(modalDocRef, { [dataName]: arrayUnion(...dataArray) }, { merge: true });

                const logData = {
                    message: `"${title}" added: "${nameVariable.text}" added "${title}"(s).`,
                    timestamp: formattedTime,
                    colorScheme: true,
                };
                addLogToCollection(logData);
                setModalSaveLoading(false);

                handleModalAddSuccessOpen();



                // console.log('Data added to Firestore');
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 1 }}>
                {!modalIsLoading ? (
                    <TouchableOpacity onPress={handleSortModalOpen}>
                        <MaterialCommunityIcons name="playlist-edit" size={25} color="white" />
                    </TouchableOpacity>
                ) : (
                    <Spinner color="white" />
                )}
            </View>

            <Modal isOpen={modalSortOpen} onClose={handleSortModalClose} useRNModal>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header borderBottomWidth={0}>
                        <Text color={'#102A43'} bold>{headerText}</Text>
                    </Modal.Header>
                    <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1}>
                        <View style={{
                            width: '100%',
                            flexDirection: 'column',
                        }}>
                            <View style={{ alignItems: 'flex-end' }}>
                                <TouchableHighlight onPress={handleModalAddOpen}>
                                    <FontAwesome name="plus-circle" size={25} color="#102A43" />
                                </TouchableHighlight>
                            </View>

                            <View style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: '#102A43',
                                borderRadius: 5,
                            }}>
                                <DraggableFlatList
                                    style={{ alignContent: 'center', flex: 1, }}
                                    data={modalData}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item, drag }) => (
                                        <View
                                            style={{
                                                flex: 1,
                                                backgroundColor: 'rgba(16,42,67, 0.5)',
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#D3D3D3', // You can use a specific color code here
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <TouchableOpacity onPress={() => handleDeleteItemPress(item)}>
                                                <AntDesign name="minuscircle" size={16} color="#102A43" />
                                            </TouchableOpacity>
                                            <Text style={{ flex: 1, textAlign: 'center', color: 'white' }}>{item}</Text>
                                            <TouchableOpacity onPressIn={drag}>
                                                <Entypo name="menu" size={16} color="#102A43" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    onDragEnd={useCallback(({ data }) => setModalData(data), [])} />

                            </View>
                        </View>

                    </Modal.Body>
                    <Modal.Footer borderTopWidth={0}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <TouchableOpacity
                                onPress={handleSortModalClose}
                                style={{
                                    flex: 1,
                                    borderRadius: 5,
                                    backgroundColor: '#525252',
                                    margin: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 8,
                                }}
                            >
                                <Text style={{ color: 'white' }}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleModalSaveOpen}
                                style={{
                                    flex: 1,
                                    borderRadius: 5,
                                    backgroundColor: '#0891B2',
                                    margin: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 8,
                                }}
                            >
                                <Text style={{ color: 'white' }}>Save</Text>
                            </TouchableOpacity>
                        </View>
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
            <Modal isOpen={modalAddSuccess} onClose={handleModalAddSuccessClose} useRNModal>
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



const SCC_Modals = () => {

    const supplyChainsCostsModalVisible = useSelector((state) => state.supplyChainsCostsModalVisible)
    const supplyChainsCostsData = useSelector((state) => state.supplyChainsCostsData);
    const expenseNameData = useSelector((state) => state.expenseNameData);
    const paidToData = useSelector((state) => state.paidToData);
    const currentDate = useSelector((state) => state.currentDate);
    const vehicleListSupplyChainsCostsData = useSelector((state) => state.vehicleListSupplyChainsCostsData);

    return (
        <AllSccModals
            supplyChainsCostsModalVisible={supplyChainsCostsModalVisible}
            supplyChainsCostsData={supplyChainsCostsData}
            expenseNameData={expenseNameData}
            paidToData={paidToData}
            currentDate={currentDate}
            vehicleListSupplyChainsCostsData={vehicleListSupplyChainsCostsData}
        />
    );
}

const ModalCalendar = ({ selectedDate, setSelectedDate }) => {

    const [modalCalendarVisible, setModalCalendarVisible] = useState(false);


    const handleModalCalendarOpen = () => {
        setModalCalendarVisible(true);
    };

    const handleModalCalendarClose = () => {
        setModalCalendarVisible(false);
    };



    return (

        <>
            <TouchableOpacity onPress={handleModalCalendarOpen} style={{ flex: 3 }}>
                <Input value={selectedDate} onFocus={handleModalCalendarOpen} />
            </TouchableOpacity>

            <Modal isOpen={modalCalendarVisible} onClose={handleModalCalendarClose} useRNModal>
                <Modal.CloseButton />
                <Modal.Content>
                    <Box height={'full'} flex={1}>

                        <Calendar
                            onDayPress={useCallback(day => {
                                setSelectedDate(day.dateString);
                                // console.log(day.dateString);
                                globalSPCSelectedDate = day.dateString;
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
                            showSixWeeks />

                    </Box>

                </Modal.Content>

            </Modal></>

    );

}

const SelectExpenseName = ({ expenseNameIsError, selectExpenseNameRef, selectResetKey }) => {

    const dispatch = useDispatch();
    const expenseNameData = useSelector((state) => state.expenseNameData);
    const selectedExpenseName = useSelector((state) => state.selectedExpenseName);
    const [key, setKey] = useState(nanoid());



    return <Select
        selectedValue={selectedExpenseName}
        borderColor={expenseNameIsError ? 'error.400' : 'muted.300'}
        flex={3}
        onValueChange={(value) => {
            globalSelectedExpenseName = value
            dispatch(setSelectedExpenseName(value));
        }}
        accessibilityLabel="Choose Expense Name"
        placeholder="Choose Expense Name"
        _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
        }}>
        {expenseNameData.map((item) => (

            <Select.Item key={item} label={item} value={item} />

        ))}
    </Select>


};

const VehicleEditModal = ({ handleEditModalClose }) => {

    const editVehicleModalVisible = useSelector((state) => state.editVehicleModalVisible);
    const screenWidth = Dimensions.get('window').width;

    return (
        <Modal isOpen={editVehicleModalVisible} onClose={handleEditModalClose} size={'full'}>
            <Modal.Content bgColor={'white'} w={screenWidth <= 1100 ? '90%' : '40%'} h={'100%'}>
                <Modal.CloseButton />
                <Modal.Header bgColor={'#7B9CFF'} flexDir={screenWidth <= 960 ? 'column' : 'row'} alignItems={screenWidth <= 960 ? 'center' : ''}>
                    <Text color={'white'} fontSize={20} bold>Edit Vehicle </Text><Text color={'cyan.200'} fontSize={20} bold textAlign={screenWidth <= 960 ? 'center' : ''}>{globalSelectedVehicle}</Text>
                </Modal.Header>


                <Modal.Body >
                    Sit nulla est ex deserunt exercitation anim occaecat.
                </Modal.Body>
            </Modal.Content>
        </Modal>


    );
};

const EditVehicleModal = () => {
    const dispatch = useDispatch();

    const handleEditModalClose = () => {
        dispatch(setEditVehicleModalVisible(false));
        globalCurrentStockID = '';
        globalSelectedVehicle = '';
        globalSelectedVehicleReferenceNumber = '';
        globalSelectedCarName = '';

    }

    return (
        <VehicleEditModal handleEditModalClose={handleEditModalClose} />


    );

};

const EditVehicle = ({ data }) => {

    const dispatch = useDispatch();


    const handleModalOpen = () => {

        dispatch(setEditVehicleModalVisible(true));
        globalCurrentStockID = data.stockID;
        globalSelectedVehicle = `${data.referenceNumber} / ${data.carName}`;
        globalSelectedVehicleReferenceNumber = data.referenceNumber;
        globalSelectedCarName = data.carName;

    }


    return (
        <>
            <TouchableOpacity
                onPress={handleModalOpen}
                style={{
                    backgroundColor: '#7B9CFF',
                    marginHorizontal: 5,
                    borderRadius: 5,
                    padding: 2,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {/* <Text style={{ textAlign: 'center',  color: 'white', }}>Edit</Text> */}
                <MaterialIcons name={"edit"} color='white' size={22} />
            </TouchableOpacity>
        </>
    );
};




const ViewImagesModal = ({ handleViewImagesModalClose }) => {

    const screenWidth = Dimensions.get('window').width;
    const viewImagesModalVisible = useSelector((state) => state.viewImagesModalVisible);
    const viewImagesData = useSelector((state) => state.viewImagesData);

    const [modalImageUri, setModalImageUri] = useState('');
    const [imageModalVisible, setImageModalVisible] = useState(false);

    const handleImagePress = useCallback((uri) => {
        // const base64Image = toString(uri);
        // setIsLoading(true);
        setModalImageUri(uri);
        setImageModalVisible(true);
        // console.log("URI: ", uri);

    }, []);



    const getImagesRenderItem = useCallback((item) => {

        const styles = StyleSheet.create({
            dropdown: {
                margin: 16,
                height: 50,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
            },
            icon: {
                marginRight: 5,
            },
            placeholderStyle: {
                fontSize: 16,
            },
            selectedTextStyle: {
                fontSize: 16,
            },
            iconStyle: {
                width: 20,
                height: 20,
            },
            inputSearchStyle: {
                height: 40,
                fontSize: 16,
            },
            container: {
                flex: 1,
                paddingTop: 20,

            },
            txt: {
                fontSize: 18,
                lineHeight: 24,
                padding: 5
            },
            sort: {
            },
            item_children: {
                width: 90,
                height: 90,
                backgroundColor: 'black',
                justifyContent: "center",
                alignItems: "center",
            },
            item_delete_icon: {
                width: 14,
                height: 14,
                position: "absolute",
                right: 1,
                top: 1
            },
            item_icon: {
                width: 90,
                height: 90,
                resizeMode: "contain",
                position: "absolute"
            }
        });

        return (

            <Box key={item.id} style={styles.item}>
                <Box style={styles.item_children}>

                    <FastImage
                        style={styles.item_icon}
                        source={{
                            uri: item.uri,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}

                    />

                </Box>
            </Box>
        );



    }, []);

    return (

        <>
            <Modal isOpen={viewImagesModalVisible} onClose={handleViewImagesModalClose} size={'full'} useRNModal>
                <Modal.Content bgColor={'white'} w={screenWidth <= 1100 ? '90%' : '60%'} h={'100%'}>
                    <Modal.CloseButton />
                    <Modal.Header bgColor={'#7B9CFF'} flexDir={screenWidth <= 960 ? 'column' : 'row'} alignItems={screenWidth <= 960 ? 'center' : ''}>
                        <Text color={'white'} fontSize={20} bold>View Images for </Text><Text color={'cyan.200'} fontSize={20} bold textAlign={screenWidth <= 960 ? 'center' : ''}>{globalSelectedVehicle}</Text>
                    </Modal.Header>


                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: '5%', marginLeft: '10%' }}>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ScrollView style={{ height: '90%' }}>
                                <DragSortableView
                                    sortable={false}
                                    // ref={dragSortableViewRef}
                                    dataSource={viewImagesData}
                                    parentWidth={width * 0.33}
                                    childrenWidth={100}
                                    childrenHeight={100}
                                    marginChildrenTop={3}
                                    marginChildrenBottom={0}
                                    marginChildrenLeft={0}
                                    marginChildrenRight={0}
                                    onClickItem={(item, index) => {
                                        handleImagePress(index.uri);
                                    }}
                                    keyExtractor={(item) => item.uri}
                                    renderItem={useCallback((item, index) => getImagesRenderItem(item, index), [])}
                                />
                            </ScrollView>
                        </View>


                    </View>


                </Modal.Content>


            </Modal>

            <Modal isOpen={imageModalVisible} onClose={() => setImageModalVisible(false)} size={'100%'} useRNModal>

                <Box w={'80%'} h={'80%'} bgColor={'rgba(0, 0, 0, 0.7)'} borderRadius={10} display="flex" alignItems="center" justifyContent="center" alignContent={'center'}>
                    <Modal.CloseButton color={'white'} />
                    <NativeImage
                        key={modalImageUri}
                        source={{ uri: modalImageUri }}
                        resizeMode='contain'
                        flex={1}
                        alt={modalImageUri}
                        h={720}
                        w={1280}
                    />

                </Box>

            </Modal>
        </>

    );
};


const FobPriceHistoryModal = ({ handleFobPriceHistoryClose }) => {

    const screenWidth = Dimensions.get('window').width;
    const fobPriceHistoryModalVisible = useSelector((state) => state.fobPriceHistoryModalVisible);
    const fobHistoryData = useSelector((state) => state.fobHistoryData);

    return (
        <Modal
            isOpen={fobPriceHistoryModalVisible}
            onClose={handleFobPriceHistoryClose}
            size={'full'}
            useRNModal
        >
            <Modal.Content bgColor={'white'} w={screenWidth <= 1100 ? '90%' : '40%'} h={'auto'}>
                <Modal.CloseButton />
                <Modal.Header bgColor={'#7B9CFF'} alignItems={screenWidth <= 960 ? 'center' : 'flex-start'}>
                    <Text color={'white'} fontSize={20} bold>FOB Price History </Text>
                </Modal.Header>
                <Modal.Body>
                    <ScrollView style={{ width: '100%' }}>
                        {screenWidth >= 960 ? (
                            <View style={{ alignItems: 'stretch', marginTop: 10 }}>
                                {/* Table Header */}
                                <View style={{
                                    borderRadius: 3,
                                    backgroundColor: '#0642F4',
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#0642F4',
                                }}>
                                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>Date</Text>
                                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>FOB Price ¥</Text>
                                    <Text style={{ width: '20%', fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>Changer</Text>

                                </View>

                                {/* Table Rows */}
                                {[...fobHistoryData]
                                    .sort((a, b) => new Date(b.date.replace(' at ', ' ')) - new Date(a.date.replace(' at ', ' ')))
                                    .map((data, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: '#BBF7D0',
                                                flexDirection: 'row',
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#CCCCCC',
                                            }}
                                        >
                                            <Text style={{ flex: 1, fontSize: 16, padding: 8 }}>{data.date}</Text>
                                            <Text style={{ flex: 1, fontSize: 16, padding: 8 }}>¥{Number(data.fobPrice).toLocaleString()}</Text>
                                            <Text style={{ width: '20%', fontSize: 16, padding: 8 }}>{data.changedBy}</Text>
                                        </View>
                                    ))
                                }
                            </View>
                        ) : (
                            // Mobile View FOB Price History
                            <View style={{ alignItems: 'stretch', marginTop: 10 }}>
                                {/* Table Header */}
                                {/* <View style={{
                    borderRadius: 3,
                    backgroundColor: '#0642F4',
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#0642F4',
                  }}>
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>Date</Text>
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>FOB Price</Text>
                    <Text style={{ width: '20%', fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>Changer</Text>
  
                  </View> */}

                                {/* Table Rows */}
                                {[...fobHistoryData]
                                    .sort((a, b) => new Date(b.date.replace(' at ', ' ')) - new Date(a.date.replace(' at ', ' ')))
                                    .map((data, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: '#BBF7D0',
                                                flexDirection: 'column',
                                                borderWidth: 1,
                                                borderColor: '#E4E4E7',
                                                margin: 3,
                                            }}
                                        >

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                                <View style={{
                                                    backgroundColor: '#0642F4',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#0642F4',
                                                    width: '30%',
                                                }}>
                                                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>Date</Text>
                                                </View>

                                                <Text style={{ flex: 1, fontSize: 16, padding: 8 }}>{data.date}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                                <View style={{
                                                    backgroundColor: '#0642F4',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#0642F4',
                                                    width: '30%',
                                                }}>
                                                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>FOB Price ¥</Text>
                                                </View><Text style={{ flex: 1, fontSize: 16, padding: 8 }}>¥{Number(data.fobPrice).toLocaleString()}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                                <View style={{
                                                    backgroundColor: '#0642F4',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#0642F4',
                                                    width: '30%',
                                                }}>
                                                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', padding: 8, color: 'white' }}>Changer</Text>
                                                </View>
                                                <Text style={{ flex: 1, fontSize: 16, padding: 8 }}>{data.changedBy}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                        )}

                    </ScrollView>




                </Modal.Body>
            </Modal.Content>
        </Modal>



    );
}

const FobPriceHistory = () => {
    const dispatch = useDispatch();


    const handleFobPriceHistoryClose = () => {

        dispatch(setFobPriceHistoryModalVisible(false));
        globalFobPriceHistoryData = [];
        globalCurrentStockID = '';
        globalSelectedVehicle = '';
        globalSelectedVehicleReferenceNumber = '';

    }

    return (

        <FobPriceHistoryModal handleFobPriceHistoryClose={handleFobPriceHistoryClose} />

    );
}


const ImageCountComponent = ({ item, handleViewImagesModalOpen, handleUploadImagesModalOpen }) => {
    // State for the image count
    const [imageCount, setImageCount] = useState(item.imageCount || 0);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(projectExtensionFirestore, 'accounts', item.stockID), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setImageCount(data.imageCount || 0); // Update the image count with the new value from Firestore
            }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, [item.stockID]); // useEffect will re-run if item.stockID changes

    // Function placeholders
    // const handleViewImagesModalOpen = (item) => {
    //   console.log('View images', item);
    // };

    // const handleUploadImagesModalOpen = (item) => {
    //   console.log('Upload images', item);
    // };

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            {imageCount > 0 ? (
                <TouchableOpacity onPress={() => handleViewImagesModalOpen(item)}>
                    <Text style={{ textDecorationLine: 'underline' }}>
                        {imageCount} image/s
                    </Text>
                </TouchableOpacity>
            ) : (
                <Text>{imageCount} image/s</Text>
            )}

            <TouchableOpacity onPress={() => handleUploadImagesModalOpen(item)}>
                {imageCount > 0 ? null : (
                    <MaterialIcons name="add-photo-alternate" size={22} color={'white'} />
                )}
            </TouchableOpacity>
        </View>
    );
};

const FobPriceInput = ({ item, index, }) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [fobPrice, setFobPrice] = useState(item.fobPrice ? parseFloat(item.fobPrice).toLocaleString() : '');
    const inputFobJpy = useRef([]);

    useEffect(() => {
        // Assume you have a collection named 'stocks' and the document ID is `item.stockID`
        const unsubscribe = onSnapshot(doc(projectExtensionFirestore, 'accounts', item.stockID), (doc) => {
            // console.log(`Read ${doc.size} documents from accounts`);

            if (doc.exists()) {
                const data = doc.data();
                // Update the fobPrice state with the new value from Firestore
                setFobPrice(data.fobPrice ? parseFloat(data.fobPrice).toLocaleString() : '');
            }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    // ... rest of your component
    const formatValueWithCommas = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const truncatedValue = numericValue.slice(0, 9);
        const formattedValue = truncatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedValue;
    };

    const handleTextChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        const currentNumericValue = fobPrice.replace(/[^0-9]/g, '');

        // Update state only if the numeric value has changed
        if (numericValue !== currentNumericValue) {
            setFobPrice(numericValue);
        }
    };

    // This function will format the displayed text
    const handleInputFobJpyChange = (text, stockID) => {
        const formattedValue = formatValueWithCommas(text);

        // Apply the formatted value to the input without resetting the state
        if (inputFobJpy.current[stockID]) {
            inputFobJpy.current[stockID].setNativeProps({ text: formattedValue });
        }
    };

    const handleSaveFob = async (item, index,) => {
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
        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

        const fobValue = inputFobJpy.current[item.stockID].value.replace(/,/g, ''); // Remove commas







        toast.closeAll();
        // if (item.fobPrice == fobValue || fobValue == '') {
        //   dispatch(setLoadingModalVisible(false));

        //   console.log('same');
        //   console.log(item.fobPrice);

        // }
        // else {

        const fobHistoryData = {
            date: formattedTime,
            fobPrice: fobValue,
            changedBy: nameVariable.text,
        };
        const vehicleProductRef = doc(collection(projectExtensionFirestore, 'accounts'), item.stockID);

        try {
            await updateDoc(vehicleProductRef, {
                fobPrice: fobValue,
                fobHistory: arrayUnion(fobHistoryData)
            });
            const logData = {
                message: `Vehicle FOB Price Updated: "${nameVariable.text}" updated "${item.carName}" FOB price with a reference number of "${item.referenceNumber}" using Vehicle List.`,
                timestamp: formattedTime,
                colorScheme: true,
                keywords: [
                    formattedTime.toLowerCase(),
                    globalCurrentStockID.toLowerCase(),
                    `Vehicle FOB Price Updated: "${nameVariable.text}" updated "${item.carName}" FOB price with a reference number of "${item.referenceNumber}" using Vehicle List`.toLowerCase(),
                    'Vehicle List'.toLowerCase(),
                    'Vehicle FOB Price Updated'.toLowerCase(),
                    'Vehicle FOB Price'.toLowerCase(),
                    'Vehicle FOB'.toLowerCase(),
                    'Vehicle'.toLowerCase(),
                    'FOB Price Updated'.toLowerCase(),
                    'FOB Price'.toLowerCase(),
                    'FOB'.toLowerCase(),
                    'Updated'.toLowerCase(),
                    globalSelectedCarName.toLowerCase(),
                    globalSelectedVehicleReferenceNumber.toLowerCase(),
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
            dispatch(setLoadingModalVisible(false));

            // console.log('FOB Price updated successfully');
            toast.show({
                render: () => {
                    return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>FOB Price updated successfully!</Text>
                    </View>;
                }
            })
        } catch (error) {
            console.error(error);
            toast.show({
                render: () => {
                    return <View style={{ backgroundColor: '#DC2626', padding: 5, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Error updating: {error}</Text>
                    </View>;
                }
            })
        }
        // }

        // Reference the Firestore document and update the 'fobPrice' field

    };

    return (
        <>
            <TextInput
                ref={(ref) => (inputFobJpy.current[item.stockID] = ref)}
                value={formatValueWithCommas(fobPrice)} // Display the formatted value
                style={{ outlineStyle: 'none', flex: 1, padding: 5, borderRadius: 5, width: '90%' }}
                key={item.id}
                onChangeText={(text) => {
                    handleTextChange(text); // This sets the numeric value state
                    handleInputFobJpyChange(text, item.stockID); // This formats the display
                }}
                onSubmitEditing={() => handleSaveFob(item, index)} />
            <TouchableHighlight
                underlayColor={'rgba(22, 163, 74, 0.3)'}
                onPress={() => handleSaveFob(item, index)}
                style={{
                    backgroundColor: '#16A34A',
                    borderRadius: 5,
                    padding: 5,
                    margin: 2,
                    alignSelf: 'center',
                }}>
                {/* <Text style={{ textAlign: 'center', }}>Save</Text> */}
                <MaterialIcons name='update' color='white' size={22} />
            </TouchableHighlight>
        </>
    );
};


const CustomerListTable = () => {
    const toast = useToast();
    const screenWidth = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    // const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const customerListData = useSelector((state) => state.customerListData);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);


    const [stockIDs, setStockIDs] = useState([]);
    const [imageCounts, setImageCounts] = useState([]);

    const inputExpenseAmount = useRef(null);
    const [pageIndex, setPageIndex] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const inputFobJpy = useRef([]);
    const [pageClicked, setPageClicked] = useState('');
    const [lastVisible, setLastVisible] = useState(null);
    const [firstVisible, setFirstVisible] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [fobPrices, setFobPrices] = useState({});
    // Memoize the filtered data using useMemo
    const [sortField, setSortField] = useState('textEmail'); // null when sorting is off
    const [isSortActive, setIsSortActive] = useState(false);
    const loginName = useSelector((state) => state.loginName);
    nameVariable.text = loginName;

    const handleSortChange = (field) => {
        setCurrentPage(1);
        // If the field is the same as the current sortField, toggle sorting
        setSearchText('');
        searchInputRef.current.clear();
        if (field === sortField) {
            setIsSortActive(!isSortActive); // Toggle sorting for the same field
            if (!isSortActive) {
                // If it was off, we turn it on and keep the same field
                setSortField(field);
            } else {
                // If it was on, we turn it off and reset to default 'textEmail'
                setSortField('textEmail');
            }
        } else {
            // If the field is different, turn sorting on and change the field
            setSortField(field);
            setIsSortActive(true); // Always turn on sorting when a new field is clicked
        }
        // You might want to dispatch setLoadingModalVisible(true) when you start a new query
        dispatch(setLoadingModalVisible(true));
    };


    const fetchWithSort = async () => {
        const fieldToSortBy = isSortActive && sortField ? sortField : 'textEmail';
        const sortDirection = isSortActive ? 'asc' : 'desc';
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
                where('keywords', 'array-contains', searchText.toUpperCase()),
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
        const sortDirection = isSortActive ? 'asc' : 'desc';

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
        const sortDirection = isSortActive ? 'asc' : 'desc';


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
                where('keywords', 'array-contains', searchText.toUpperCase()),
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
        const sortDirection = isSortActive ? 'asc' : 'desc';

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
                where('keywords', 'array-contains', searchText.toUpperCase()),
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
            const sortDirection = isSortActive ? 'asc' : 'desc';

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
                    where('keywords', 'array-contains', searchText.toUpperCase()),
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
                orderBy('textEmail', 'desc'),
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
                where('keywords', 'array-contains', searchText.toUpperCase()),
                orderBy('textEmail', 'desc'),
                limit(pageSize)
            );

            const firstPageDocuments = await getDocs(q);
            fetchFirstPage(firstPageDocuments);
            dispatch(setLoadingModalVisible(false));
        }
    };



    const formatValueWithCommas = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const truncatedValue = numericValue.slice(0, 9);
        const formattedValue = truncatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedValue;
    };

    // Function to handle input changes for each item
    const handleInputFobJpyChange = (text, index) => {
        const formattedValue = formatValueWithCommas(text);

        if (inputFobJpy.current[index]) {
            inputFobJpy.current[index].value = formattedValue;
        }
    };




    const getImageCountInFolder = async (folderPath) => {
        try {
            const folderRef = ref(storage, folderPath);
            const listResult = await listAll(folderRef);

            return listResult.items.length;
        } catch (error) {
            console.error('Error getting image count:', error);
            return -1; // Handle the error accordingly
        }
    };


    const handleTextChange = (text) => {
        setSearchQuery(text);
    };

    const handleFobPriceHistoryOpen = async (item) => {
        dispatch(setLoadingModalVisible(true));
        dispatch(setFobPriceHistoryModalVisible(true));
        if (item.stockID) {
            const docRef = doc(projectExtensionFirestore, 'accounts', item.stockID);
            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Assuming you have an action to set the FOB history like setFobHistory
                    dispatch(setFobHistoryData(docSnap.data().fobHistory || []));
                    dispatch(setLoadingModalVisible(false));

                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
            }
        }
        // globalFobPriceHistoryData = item.fobHistory ? item.fobHistory : [];
        globalCurrentStockID = item.stockID ? item.stockID : '';
        globalSelectedVehicle = `${item.referenceNumber} / ${item.carName} `;
        globalSelectedVehicleReferenceNumber = item.referenceNumber;

    }

    const handleSaveFob = async (item, index,) => {
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
        const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

        const fobValue = inputFobJpy.current[item.stockID].value.replace(/,/g, ''); // Remove commas







        toast.closeAll();
        // if (item.fobPrice == fobValue || fobValue == '') {
        //   dispatch(setLoadingModalVisible(false));

        // }
        // else {

        const fobHistoryData = {
            date: formattedTime,
            fobPrice: fobValue,
            changedBy: nameVariable.text,
        };
        const vehicleProductRef = doc(collection(projectExtensionFirestore, 'accounts'), item.stockID);

        try {
            await updateDoc(vehicleProductRef, {
                fobPrice: fobValue,
                fobHistory: arrayUnion(fobHistoryData)
            });
            const logData = {
                message: `Vehicle FOB Price Updated: "${nameVariable.text}" updated "${item.carName}" FOB price with a reference number of "${item.referenceNumber}" using Vehicle List.`,
                timestamp: formattedTime,
                colorScheme: true,
                keywords: [
                    formattedTime.toLowerCase(),
                    globalCurrentStockID.toLowerCase(),
                    `Vehicle FOB Price Updated: "${nameVariable.text}" updated "${item.carName}" FOB price with a reference number of "${item.referenceNumber}" using Vehicle List`.toLowerCase(),
                    'Vehicle List'.toLowerCase(),
                    'Vehicle FOB Price Updated'.toLowerCase(),
                    'Vehicle FOB Price'.toLowerCase(),
                    'Vehicle FOB'.toLowerCase(),
                    'Vehicle'.toLowerCase(),
                    'FOB Price Updated'.toLowerCase(),
                    'FOB Price'.toLowerCase(),
                    'FOB'.toLowerCase(),
                    'Updated'.toLowerCase(),
                    globalSelectedCarName.toLowerCase(),
                    globalSelectedVehicleReferenceNumber.toLowerCase(),
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
            dispatch(setLoadingModalVisible(false));

            // console.log('FOB Price updated successfully');
            toast.show({
                render: () => {
                    return <View style={{ backgroundColor: '#16A34A', padding: 5, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>FOB Price updated successfully!</Text>
                    </View>;
                }
            })
        } catch (error) {
            console.error(error);
            toast.show({
                render: () => {
                    return <View style={{ backgroundColor: '#DC2626', padding: 5, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Error updating: {error}</Text>
                    </View>;
                }
            })
        }
        // }

        // Reference the Firestore document and update the 'fobPrice' field

    };

    const handleUploadImagesModalOpen = (item) => {
        dispatch(setUploadImagesModalVisible(true));
        globalCurrentStockID = item.stockID;
        globalSelectedVehicle = `${item.referenceNumber} / ${item.carName} `;
        globalSelectedVehicleReferenceNumber = item.referenceNumber;
        globalSelectedCarName = item.carName;

    }

    const handleViewImagesModalOpen = async (item) => {
        dispatch(setLoadingModalVisible(true));
        try {
            await getImages(item.stockID);
            globalCurrentStockID = item.stockID;
            globalSelectedVehicle = `${item.referenceNumber} / ${item.carName} `;
            globalSelectedVehicleReferenceNumber = item.referenceNumber;
            dispatch(setLoadingModalVisible(false));
            dispatch(setViewImagesModalVisible(true));
        } catch (error) {
            console.error(error);
            dispatch(setLoadingModalVisible(false));

        }
    }

    const handleViewImagesModalClose = () => {
        dispatch(setViewImagesModalVisible(false));
        globalCurrentStockID = '';
        globalSelectedVehicle = ``;
        globalSelectedVehicleReferenceNumber = '';
        globalSelectedCarName = '';
        dispatch(setViewImagesData([]));
    };

    const getImages = useCallback(async (folderName) => {
        try {

            const imageRefs = await listAll(ref(storage, `${folderName}/`)); // Use the provided folderName
            // selectModelRef.current.selectIndex(globalModelDataVariable.indexOf(modelVariable.text));

            const urls = await Promise.all(
                imageRefs.items.map(async (itemRef) => {
                    const uri = await getDownloadURL(itemRef);
                    return { uri, fileName: itemRef.name };
                })
            );
            // Sort the URLs array in ascending order based on the fileName (which is a number)
            urls.sort((a, b) => {
                const fileNameA = parseInt(a.fileName);
                const fileNameB = parseInt(b.fileName);
                return fileNameA - fileNameB;
            });

            if (urls.length > 0) {
                dispatch(setViewImagesData(urls));

            }

            else {
                dispatch(setViewImagesData([]));
            }

            // console.log(urls);

        } catch (error) {
            // Handle any errors that may occur during the Firebase operations
            console.error('Error getting image URLs:', error);
        }
    }, []);


    const addStockStatusToAccounts = async () => {
        const vehicleProductsRef = collection(projectExtensionFirestore, "accounts");

        try {
            const querySnapshot = await getDocs(vehicleProductsRef);
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();

                // Check if the imageCount field does not exist
                if (data.stockStatus === undefined) {
                    try {
                        // If the imageCount field doesn't exist, initialize it to 0
                        await updateDoc(doc.ref, {
                            stockStatus: ''
                        });
                        console.log(`stockStatus initialized to 0 for document ID: ${doc.id}`);
                    } catch (error) {
                        console.error('Error initializing stockStatus field:', error);
                    }
                }
            });
        } catch (error) {
            console.error("Error reading accounts collection:", error);
        }

    }


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
                                <Text style={{ color: 'white', }} bold>Ref #</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={{ color: 'white', }} bold>Car Name</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={{ color: 'white', }} bold>Chassis #</Text>
                            </View>

                            <View style={{ flex: 1, padding: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => handleSortChange('imageCount')}>
                                    <Text style={{ color: isSortActive && sortField === 'imageCount' ? '#FBBC04' : 'white', }} bold underline>Images</Text>
                                </TouchableOpacity></View>



                            <View style={{ flex: 1, padding: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => handleSortChange('stockStatus')}>
                                    <Text style={{ color: isSortActive && sortField === 'stockStatus' ? '#FBBC04' : 'white', }} bold underline>Stock Status</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1, padding: 2, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => handleSortChange('fobPrice')}>
                                    <Text style={{ color: isSortActive && sortField === 'fobPrice' ? '#FBBC04' : 'white', }} bold underline>FOB Price</Text>
                                </TouchableOpacity></View>

                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={{ color: 'white', alignSelf: 'center', }} bold>Operate</Text>
                            </View>
                        </View>
                        {customerListData.map((item, index) => (
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
                                    <Text selectable style={{ width: '90%', marginLeft: 3, }}>{item.referenceNumber}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text selectable style={{ width: '90%', }}>{item.carName} </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text selectable style={{ width: '90%', }}>{item.chassisNumber}</Text>
                                </View>
                                <ImageCountComponent item={item} handleViewImagesModalOpen={handleViewImagesModalOpen} handleUploadImagesModalOpen={handleUploadImagesModalOpen} />
                                {/* <View style={{ flex: 1, flexDirection: 'row' }}>
  
                    {item.imageCount > 0 ?
                      (<TouchableOpacity onPress={() => handleViewImagesModalOpen(item)}>
                        <Text underline>
                          {item.imageCount ? item.imageCount : 0} image/s
                        </Text>
                      </TouchableOpacity>) :
                      (<Text>
                        {item.imageCount ? item.imageCount : 0} image/s
                      </Text>)
                    }
  
  
                    <TouchableOpacity onPress={() => handleUploadImagesModalOpen(item)}>
                      {item.imageCount > 0 ? null : (
                        <MaterialIcons name="add-photo-alternate" size={22} color={'white'} />
                      )}
                    </TouchableOpacity>
                  </View> */}
                                <View style={{ flex: 1, }}>
                                    <SelectStockStatus key={item.stockID} selectedValue={item.stockStatus} id={item.stockID} item={item} />
                                    {/* <Text style={{ width: '90%', }}>{item.stockStatus}</Text> */}
                                </View>

                                <View style={{ width: '90%', flex: 1, flexDirection: 'row', backgroundColor: 'white', borderRadius: 5, }}>
                                    <TouchableOpacity
                                        onPress={() => handleFobPriceHistoryOpen(item)}
                                        style={{
                                            margin: 5,
                                            alignSelf: 'center',
                                        }}>
                                        {/* <Text style={{ textAlign: 'center', }}>Save</Text> */}
                                        <FontAwesome name='clock-o' color='black' size={22} />
                                    </TouchableOpacity>
                                    <FobPriceInput item={item} index={index} handleInputFobJpyChange={handleInputFobJpyChange} handleSaveFob={handleSaveFob} />
                                    {/* <TextInput
                      ref={(ref) => (inputFobJpy.current[item.stockID] = ref)}
                      defaultValue={item.fobPrice ? parseFloat(item.fobPrice).toLocaleString() : ''}
                      style={{ flex: 1, padding: 5, borderRadius: 5, width: '90%', }}
                      key={item.id}
                      onChangeText={(text) => handleInputFobJpyChange(text, item.stockID)}
                      onSubmitEditing={() => handleSaveFob(item, index)} /> */}

                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    <SupplyChainsCosts data={item} />
                                    {/* <EditVehicle data={item} /> */}
                                </View>
                            </View>
                        ))}

                        <View style={{
                            flexDirection: 'row', width: screenWidth < 460 ? '90%' : screenWidth < 1175 ? '40%' : '20%',
                            alignSelf: 'center',
                        }}>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ display: currentPage <= 1 ? 'none' : 'flex' }}
                                    onPress={handlePreviousPage}>
                                    <View style={{ backgroundColor: 'rgba(6, 66, 244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                                        <MaterialIcons name='navigate-before' size={40} color={'white'} />
                                    </View>
                                </TouchableOpacity>
                            </View>


                            <View style={{ flex: 1, backgroundColor: 'rgba(6, 66, 244, 0.6)', borderRadius: 5, margin: 10, padding: 4, justifyContent: 'center', alignItems: 'center' }}>
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

                        {customerListData.map((item, index) => (
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
                                        <Text style={{ color: 'white', }} bold>Ref #</Text>
                                    </View>
                                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text selectable style={{ marginLeft: 3 }}>{item.referenceNumber}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text style={{ color: 'white', }} bold>Car Name</Text>
                                    </View>
                                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text selectable style={{ marginLeft: 3 }}>{item.carName} </Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text style={{ color: 'white', }} bold>Chassis #</Text>
                                    </View>
                                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text selectable style={{ marginLeft: 3 }}>{item.chassisNumber}</Text>
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <Text style={{ color: 'white', }} bold>Images</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        {item.imageCount > 0 ?
                                            (<TouchableOpacity onPress={() => handleViewImagesModalOpen(item)}>
                                                <Text underline style={{ marginLeft: 3 }}>
                                                    {item.imageCount ? item.imageCount : 0} image/s
                                                </Text>
                                            </TouchableOpacity>) :
                                            (<Text style={{ marginLeft: 3 }}>
                                                {item.imageCount ? item.imageCount : 0} image/s
                                            </Text>)
                                        }


                                        <TouchableOpacity onPress={() => handleUploadImagesModalOpen(item)}>
                                            {item.imageCount > 0 ? null : (
                                                <MaterialIcons name="add-photo-alternate" size={22} color={'white'} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                        <Text style={{ color: 'white', }} bold>Stock Status</Text>
                                    </View>
                                    <View style={{ flex: 1, paddingVertical: 1, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', }}>
                                        <SelectStockStatus key={item.stockID} selectedValue={item.stockStatus} id={item.stockID} item={item} />
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                        <Text style={{ color: 'white', }} bold>FOB Price ¥</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', borderRadius: 5, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                        <TouchableOpacity
                                            onPress={() => handleFobPriceHistoryOpen(item)}
                                            style={{
                                                margin: 5,
                                                alignSelf: 'center',
                                            }}>
                                            {/* <Text style={{ textAlign: 'center', }}>Save</Text> */}
                                            <FontAwesome name='clock-o' color='black' size={22} />
                                        </TouchableOpacity>
                                        <FobPriceInput item={item} index={index} handleInputFobJpyChange={handleInputFobJpyChange} handleSaveFob={handleSaveFob} />

                                        {/* <TextInput
                        ref={(ref) => (inputFobJpy.current[item.stockID] = ref)}
                        defaultValue={item.fobPrice ? parseFloat(item.fobPrice).toLocaleString() : ''}
                        style={{ width: '90%', borderRadius: 5, }}
                        key={item.id}
                        onChangeText={(text) => handleInputFobJpyChange(text, item.stockID)}
                        onSubmitEditing={() => handleSaveFob(item, index)} /> */}
                                        {/* <TouchableHighlight
                        underlayColor={'rgba(22, 163, 74, 0.3)'}
                        onPress={() => handleSaveFob(item, index)}
                        style={{
                          backgroundColor: '#16A34A',
                          margin: 2,
                          marginLeft: 2,
                          alignSelf: 'center',
                          borderRadius: 5,
                        }}>
                        <MaterialIcons name='update' color='white' size={22} />
                      </TouchableHighlight> */}
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '30%', padding: 2, backgroundColor: '#0642F4', borderBottomWidth: 1, borderBottomColor: '#E4E4E7', justifyContent: 'center', }}>
                                        <Text style={{ color: 'white', }} bold>Operate</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 1, margin: 5, }}>
                                        <SupplyChainsCosts data={item} />
                                        {/* <EditVehicle data={item} /> */}
                                    </View>
                                </View>
                            </View>
                        ))}

                        <View style={{
                            flexDirection: 'row', width: screenWidth < 460 ? '90%' : screenWidth < 1175 ? '40%' : '20%',
                            alignSelf: 'center',
                        }}>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ display: currentPage <= 1 ? 'none' : 'flex' }}
                                    onPress={handlePreviousPage}>
                                    <View style={{ backgroundColor: 'rgba(6, 66, 244, 0.6)', borderRadius: 5, padding: 4, margin: 10 }}>
                                        <MaterialIcons name='navigate-before' size={40} color={'white'} />
                                    </View>
                                </TouchableOpacity>
                            </View>


                            <View style={{ flex: 1, backgroundColor: 'rgba(6, 66, 244, 0.6)', borderRadius: 5, margin: 10, padding: 4, justifyContent: 'center', alignItems: 'center' }}>
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

                        </View>

                    </View>

                )}




        </>


    );

}






export default function CustomerList() {
    const [email, setEmail] = useState('');
    const logo = require('../../assets/C-Hub.png');
    const logo2 = require('../../assets/C-Hub Logo Only.png');
    const [isMobileView, setIsMobileView] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // const navigation = useNavigation();
    const navigate = useNavigate();


    const [typeOfAccount, setTypeOfAccount] = useState('');


    const loginName = useSelector((state) => state.loginName);
    const [name, setName] = useState(loginName);
    const [time, setTime] = useState('');

    const [selectedImages, setSelectedImages] = useState([]);

    const [widthState, setWidthState] = useState(Dimensions.get('window').width);

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

    const SuccessModal = ({ isOpen, onClose, bodyText, headerText }) => {




        return (
            <>
                <Modal isOpen={isOpen} onClose={onClose} useRNModal>
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
            </>

        );
    };





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
                                    <CustomerListTable />
                                </View>
                            </ScrollView>
                            <SCC_Modals />
                            <EditVehicleModal />
                            <FobPriceHistory />
                            {/* <SuccessModal /> */}
                        </View>


                        {/* </Box> */}

                        {/* </Box> */}
                    </View>

                </View>
                <LoadingModal />

            </>





        </NativeBaseProvider>




    );

};