import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, TextInput, Alert } from 'react-native';
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
import { signOut, onAuthStateChanged, reload, getAuth, getIdTokenResult, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, deleteUser, signInWithEmailAndPassword, updateEmail, updatePassword } from 'firebase/auth';
import { authForCreateUser } from '../../firebasecontrolCreateUser';
import { app, db, getFirestore, collection, addDoc, doc, setDoc, auth, getDoc, onSnapshot, updateDoc, getDocs, orderBy, query, deleteDoc, limit } from '../../firebasecontrol'
import { useNavigation } from '@react-navigation/core'
import { NavigationContainer } from '@react-navigation/native';
import './../style.css';
import { debounce } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { color } from 'react-native-reanimated';
import FastImage from 'react-native-fast-image-web-support';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { setAccountListData, setLoadingModalVisible, setLoginName } from './redux/store';
import MobileViewDrawer from './SideDrawer/MobileViewDrawer';
import SideDrawer from './SideDrawer/SideDrawer';
import { collectionGroup, endBefore, limitToLast, startAfter, where } from 'firebase/firestore';
import { projectControlFirestore } from '../../crossFirebase';
import { useNavigate } from 'react-router-dom';
let selectedScreen = 'ACCOUNT LIST'


const { width, height } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height;

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




























export default function AccountList() {
    const dispatch = useDispatch();
    const loginName = useSelector((state) => state.loginName);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showModal, setShowModal] = useState('');
    const [type, setType] = useState('');
    const logo = require('../../assets/C-Hub.png');
    const logo2 = require('../../assets/C-Hub Logo Only.png');
    const screenWidth = Dimensions.get('window').width;
    const [isMobileView, setIsMobileView] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [name, setName] = useState('');
    const [show, setShow] = React.useState(false);
    const [show2, setShow2] = React.useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const navigation = useNavigation();
    const navigate = useNavigate();

    const [isSelectedLogs, setIsSelectedLogs] = useState(false);
    const [isSelectedAddAccount, setIsSelectedAddAccount] = useState(false);
    const [isSelectedAccountList, setIsSelectedAccountList] = useState(true);
    const [isSelected3, setIsSelected3] = useState(false);
    const [isSelected4, setIsSelected4] = useState(false);

    const [accountTypeSpAd, setAccountTypeSpAd] = useState(false);
    const [accountTypeDevAd, setAccountTypeDevAd] = useState(false);
    const [accountTypeAd, setAccountTypeAd] = useState(false);
    const [accountType3, setAccountType3] = useState(false);
    const [accountType4, setAccountType4] = useState(false);

    const [inputName, setInputName] = useState('');
    const [isInputNameBlank, setIsInputNameBlank] = useState(false);
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputConfirmPassword, setInputConfirmPassword] = useState('');
    const [typeOfAccount, setTypeOfAccount] = useState('');
    const [typeOfAccountDisplay, setTypeOfAccountDisplay] = useState('');
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [showDisableModal, setShowDisableModal] = React.useState(false);
    const [showEnableModal, setShowEnableModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showSaveSuccessModal, setShowSaveSuccessModal] = React.useState(false);
    const inputRefs = useRef([]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isIntervalActive, setIsIntervalActive] = useState(true);
    const [time, setTime] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedTypeDisplay, setSelectedTypeDisplay] = useState('');
    const [selectedItemType, setSelectedItemType] = useState('');
    const [isEmailDuplicate, setIsEmailDuplicate] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [isYesLoading, setIsYesLoading] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const inputEmailRef = useRef(null);
    const inputNameRef = useRef(null);
    const inputPassRef = useRef(null);

    const [page, setPage] = useState(0);
    const optionsPerPage = [13, 25, 50];
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const [documentListener, setDocumentListener] = useState(false);

    const [showNamePopover, setShowNamePopover] = useState(false);

    const ref0 = useRef(null);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const searchInputRef = useRef(null);

    const searchInput = useRef(null);
    const searchInputValue = searchInput.current?.value;

    const [pageSize, setPageSize] = useState(10);
    const [lastVisible, setLastVisible] = useState(null);
    const [firstVisible, setFirstVisible] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const q = query(
            collection(db, 'accounts'),
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
            dispatch(setAccountListData(logsDatabaseData));
            setLastVisible(documents.docs[documents.docs.length - 1]);
            setFirstVisible(documents.docs[0]);
        });
        return () => unsubscribe();

    }, []);

    const fetchNextData = async () => {

        if (searchText === '') {


            const q = query(
                collectionGroup(projectControlFirestore, 'accounts'),
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
                collection(projectControlFirestore, 'accounts'),
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


        const accountListDatabaseData = [];

        documents.forEach((document) => {
            accountListDatabaseData.push({
                id: document.id,
                ...document.data(),
            });
        });

        dispatch(setAccountListData(accountListDatabaseData));

        if (documents?.docs[0]) {
            setFirstVisible(documents.docs[0]);
        }
        if (documents?.docs[documents.docs.length - 1]) {
            setLastVisible(documents.docs[documents.docs.length - 1]);
        }





    }

    const updateState = async (documents, pageClicked) => {


        if (!documents.empty) {
            const accountListDatabaseData = [];
            documents.forEach((document) => {
                accountListDatabaseData.push({
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

            dispatch(setAccountListData(accountListDatabaseData));
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
                    collection(projectControlFirestore, 'accounts'),
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
                collection(projectControlFirestore, 'accounts'),
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


    const handleToggleAccountTypeAd = useCallback(() => {
        const text = 'admin';

        setSelectedType(text);
        setSelectedTypeDisplay('Admin');
        setSelectedItemType(text);
    }, []);

    const handleToggleAccountTypeDevAd = useCallback(() => {
        const text = 'devadmin';

        setSelectedTypeDisplay('Developer Admin');

        setSelectedType(text);
        setSelectedItemType(text);

    }, []);

    const handleToggleAccountType3 = useCallback(() => {
        const text = 'staff';

        setSelectedType(text);

        setSelectedTypeDisplay('Staff');
        setSelectedItemType(text);
    }, []);

    const handleToggleAccountType4 = useCallback(() => {
        const text = 'booking';


        setSelectedType(text);
        setSelectedTypeDisplay('Booking');
        setSelectedItemType(text);
    }, []);

    const handleToggleAccountTypeSpAd = useCallback(() => {
        const text = 'superadmin';

        setSelectedItemType(text);
        setSelectedType(text);
        setSelectedTypeDisplay('Super Admin');
    }, []);

    useEffect(() => {
        // console.log(selectedType);
        // console.log(selectedTypeDisplay);

    }, [selectedType, selectedTypeDisplay])



    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, 'accounts'), orderBy('dateOfCreation', 'desc')); // Replace 'your-collection' with the actual collection name and 'timestamp' with the timestamp field in your documents
                const querySnapshot = await getDocs(q);
                const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setData(docs);
                setFilteredData(docs);
            } catch (error) {
                console.error('Error retrieving data:', error);
            }
        };

        const unsubscribe = onSnapshot(query(collection(db, 'accounts'), orderBy('dateOfCreation', 'desc')), (snapshot) => {
            const updatedData = snapshot.docs.map((doc) => doc.data());
            setData(updatedData);
            setFilteredData(updatedData);
        });

        fetchData();

        return () => {
            unsubscribe();
        };
    }, []);
















    useEffect(() => {

    }, [isSelectedLogs, isSelectedAddAccount, isSelectedAccountList]);












    useEffect(() => {
    }, [typeOfAccount]);



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {

            if (!user) {
                // navigation.navigate("Login")
                navigate("/Login")
            }

        })

        return unsubscribe
    }, [])

    const firebaseFirestore = getFirestore();




    // const handleUpdate = async () => {
    //     setIsDisabled(true);
    //     setIsLoading(true);

    //     if (
    //         validateEmail() === false ||
    //         inputName === ''
    //     ) {
    //         setTimeout(() => {
    //             // Reset loading and disabled state
    //             setIsLoading(false);
    //             setIsDisabled(false);
    //         }, 500);
    //     } else {
    //         try {
    //             const signInMethods = await fetchSignInMethodsForEmail(auth, inputEmail);
    //             if (signInMethods.length > 0) {
    //                 // Email already exists
    //                 setIsEmailDuplicate(true);
    //                 setEmailError(false);
    //                 validateEmail(false);
    //                 setIsLoading(false);
    //                 setIsDisabled(false);
    //                 return;
    //             }

    //             await createUserWithEmailAndPassword(authForCreateUser, inputEmail, inputPassword)
    //                 .then((userCredential) => {

    //                     const user = userCredential.user;
    //                     try {
    //                         const customID = inputEmail; // Replace 'your-custom-id' with your desired custom ID
    //                         const docRef = doc(db, 'accounts', selectedItem.email); // Replace 'myCollection' with the name of your desired collection
    //                         updateDoc(docRef, {
    //                             // Specify the data you want to add to the document
    //                             email: inputEmail,
    //                             name: inputName,
    //                             pass: inputPassword,
    //                             type: typeOfAccount,
    //                             // ...
    //                         });

    //                         addLogToCollection(logData);
    //                         // console.log(logData);
    //                         setIsLoading(false);
    //                         setIsDisabled(false);
    //                         handleClear();
    //                         setShowModal(true);

    //                         // console.log('Document added with custom ID: ', customID);
    //                     } catch (error) {
    //                         console.error('Error adding document: ', error);
    //                     }


    //                     // Reset loading and disabled state



    //                 })
    //                 .catch((error) => {
    //                     // console.log('An error occurred during sign-up. Please try again later.');
    //                     console.log(error);
    //                     setIsLoading(false);
    //                     setIsDisabled(false);
    //                 });
    //         } catch (error) {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             console.log('An error occurred while checking the email existence. Please try again later.');
    //             // console.log(errorCode, errorMessage);
    //             setIsLoading(false);
    //             setIsDisabled(false);
    //         }
    //     }
    // };

    const handleClear = useCallback(() => {
        const text = '';

        ref0.current.value = "";
        ref1.current.value = "";
        ref2.current.value = "";
        ref3.current.value = "";
        setAccountTypeAd(false);
        setAccountTypeSpAd(false);
        setAccountTypeDevAd(false);
        setAccountType3(false);
        setAccountType4(false);
        setEmailError(false);
        setIsEmailDuplicate(false);


        setInputConfirmPassword('');
        setInputEmail('');
        setInputName('');
        setInputPassword('');


    }, []);


    // const handleToggleLogs = useCallback(() => {
    //     // setIsSelectedLogs(true);

    //     // setIsSelectedAddAccount(false);
    //     // setIsSelectedAccountList(false);
    //     // setIsSelected3(false);
    //     // setIsSelected4(false);

    //     navigation.navigate("LOGS");
    // }, []);
    // const handleToggleAddAccount = useCallback(() => {
    //     // setIsSelectedAddAccount(true);

    //     // setIsSelectedLogs(false);
    //     // setIsSelectedAccountList(false);
    //     // setIsSelected3(false);
    //     // setIsSelected4(false);

    //     navigation.navigate("ADD C-HUB ACCOUNT");
    // }, []);

    // const handleToggleAccountList = useCallback(() => {
    //     // setIsSelectedAccountList(true);

    //     // setIsSelectedAddAccount(false);
    //     // setIsSelected3(false);
    //     // setIsSelected4(false);
    //     // setIsSelectedLogs(false);
    //     navigation.navigate("ACCOUNT LIST");
    // }, []);

    // const handleToggleAddVehicle = useCallback(() => {
    //     // setIsSelected3(true);

    //     // setIsSelectedAddAccount(false);
    //     // setIsSelectedAccountList(false);
    //     // setIsSelected4(false);
    //     // setIsSelectedLogs(false);
    //     navigation.navigate("ADD NEW VEHICLE");
    // }, []);

    // const handleVehicleList = useCallback(() => {
    //     navigation.navigate("VEHICLE LIST");
    // }, []);

    const handleDocumentChange = (snapshot) => {


        if (snapshot.exists()) {
            const data = snapshot.data();
            const isActive = data.active;

            if (!isActive) {
                signOut(auth)
                    .then(() => {
                        // navigation.navigate('Login');
                        navigate("/Login")

                    })
                    .catch((error) => {
                        console.error('Error signing out:', error);
                    });
            }
        } else {
            signOut(auth)
                .then(() => {
                    // navigation.navigate('Login');
                    navigate("/Login")

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

    useEffect(() => {
        getEmailFromDocument('accounts', auth.currentUser?.email);
        // console.log(authEmail, authPassword)
    }, [authEmail, authPassword]);

    const getEmailFromDocument = async (collectionPath, documentId) => {
        const firestore = getFirestore();
        const documentRef = doc(firestore, collectionPath, documentId);

        try {
            const documentSnapshot = await getDoc(documentRef);
            if (documentSnapshot.exists()) {
                const email = documentSnapshot.data().email;
                const pass = documentSnapshot.data().pass;

                setAuthEmail(email);
                setAuthPassword(pass);
            } else {
                console.log('Document does not exist');
            }
        } catch (error) {
            console.error('Error retrieving email:', error);
        }
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



    const validateEmail = () => {
        // Regular expression for email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(inputEmail);

        return isValid;


    };


    const handleSignOut = () => {

        signOut(auth).then(() => {
            // navigation.navigate('Login');
            navigate("/Login")

            setEmail('');
            setName('');
        }).catch((error) => {
            // An error happened.
        });


    };

    // useEffect(() => {
    //     const handleScreenResize = () => {
    //         const screenWidth = Dimensions.get('window').width;
    //         setIsMobileView(screenWidth < 1200);
    //     };

    //     // Initial check on component mount
    //     handleScreenResize();

    //     // Listen for screen dimension changes
    //     Dimensions.addEventListener('change', handleScreenResize);

    //     // Cleanup event listener on component unmount
    //     return () => {
    //         Dimensions.removeEventListener('change', handleScreenResize);
    //     };
    // }, []);



    // const showDrawerIcon = useBreakpointValue([true, true, true, false]);










    const handleEdit = useCallback((id) => {
        const selectedItem = data.find((item) => item.id === id);

        setSelectedItem(selectedItem);
        setInputName(selectedItem.name);
        setInputPassword(selectedItem.pass);
        setInputEmail(selectedItem.email);
        setTypeOfAccountDisplay(selectedItem.typeDisplay);
        setTypeOfAccount(selectedItem.type);
        setModalVisible(true);
        setSelectedItemType(selectedItem.type);
        setSelectedType(selectedItem.type);
        setSelectedTypeDisplay(selectedItem.typeDisplay);
        setIsEmailDuplicate(false);
        // console.log(selectedItem);

        if (inputEmailRef.current) {
            inputEmailRef.current.setNativeProps({ text: selectedItem.email });
        }

        if (inputNameRef.current) {
            inputNameRef.current.setNativeProps({ text: selectedItem.name });
        }
        if (inputPassRef.current) {
            inputPassRef.current.setNativeProps({ text: selectedItem.pass });
        }
    }, [data]);



    const handleInputEmailChange = debounce((value) => {
        setInputEmail(value);
    }, 50);

    const handleInputNameChange = debounce((value) => {
        setInputName(value);
    }, 50);

    const handleInputPassChange = debounce((value) => {
        setInputPassword(value);
    }, 50);


    const handleOpenDisableModal = (id) => {
        const selectedItem = data.find((item) => item.id === id);
        setSelectedItem(selectedItem);
        setInputName(selectedItem.name);
        setInputEmail(selectedItem.email);
        setTypeOfAccountDisplay(selectedItem.typeDisplay);
        setTypeOfAccount(selectedItem.type);
        setShowDisableModal(true);
    };

    const handleOpenEnableModal = (id) => {
        const selectedItem = data.find((item) => item.id === id);
        setSelectedItem(selectedItem);
        setInputName(selectedItem.name);
        setInputEmail(selectedItem.email);
        setTypeOfAccountDisplay(selectedItem.typeDisplay);
        setTypeOfAccount(selectedItem.type);
        setShowEnableModal(true);
    };

    const handleOpenDeleteModal = (id) => {
        const selectedItem = data.find((item) => item.id === id);
        setSelectedItem(selectedItem);
        setInputName(selectedItem.name);
        setInputEmail(selectedItem.email);
        setTypeOfAccountDisplay(selectedItem.typeDisplay);
        setTypeOfAccount(selectedItem.type);
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setShow(false);
    };

    const handleCloseDisableModal = () => {
        setShowDisableModal(false);
    };

    const handleOpenSaveSuccessModal = () => {
        setShowDisableModal(false);
    };


    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };
    const handleCloseEnableModal = () => {
        setShowEnableModal(false);
    };


    useEffect(() => {

    }, [selectedItem]);
    const addLogToCollection = async (data) => {
        try {
            const firestore = getFirestore();
            const logsCollectionRef = collection(firestore, 'logs');

            // Add a new document to the "logs" collection
            await addDoc(logsCollectionRef, data);

        } catch (error) {
            console.error('Error adding document:', error);
        }
    };
    // useEffect(() => {
    //     const fetchTime = async () => {
    //         try {
    //             const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Tokyo');
    //             const { datetime } = response.data;
    //             const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
    //             setTime(formattedTime);
    //         } catch (error) {
    //             console.error('Error fetching time:', error);
    //         }
    //     };

    //     const interval = setInterval(() => {
    //         if (isIntervalActive) {
    //             fetchTime();
    //         }
    //     }, 1000);

    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [isIntervalActive]);

    const openSuccessModal = () => {
        setShowSuccessModal(true);

    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setIsDisabled(false);
        setIsYesLoading(false);
    };


    // async function disableUserByUid(uid) {
    //     try {
    //         await updateDisabled(auth, uid, true);
    //         console.log('User account disabled successfully');
    //     } catch (error) {
    //         console.error('Error disabling user account:', error);
    //     }
    // }

    const handleEnable = useCallback(async (id) => {
        const selectedItem = data.find((item) => item.id === id);
        setSelectedItem(selectedItem);
        setInputName(selectedItem.name);
        setInputEmail(selectedItem.email);
        setTypeOfAccountDisplay(selectedItem.typeDisplay);
        setTypeOfAccount(selectedItem.type);
        setIsDisabled(true);
        setIsYesLoading(true);
        try {
            const itemDocRef = doc(firestore, 'accounts', selectedItem.email);
            const updates = {
                active: true,
            };

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

            await updateDoc(itemDocRef, updates);

            const updatedData = data.map((item) => {
                if (item.id === id) {
                    return { ...item, active: true };
                }
                return item;
            });

            setData(updatedData);
            const filteredData = applySearchFilter(updatedData, searchInputValue); // Apply search filter to updated data
            setFilteredData(filteredData);
            // console.log('Field updated successfully.');

            const logData = {
                message: `Account Enabled: The account "${selectedItem.email}" of "${selectedItem.name}" has been enabled by "${name}".`,
                keywords: [
                    formattedTime.toLowerCase(),
                    `Account Enabled: The account "${selectedItem.email}" of "${selectedItem.name}" has been enabled by "${name}".`.toLowerCase(),
                    'Account Enabled'.toLowerCase(),
                    'Enabled'.toLowerCase(),
                    selectedItem.email.toLowerCase(),
                    selectedItem.name.toLowerCase(),
                    name.toLowerCase(),
                    year.toLowerCase(),
                    month.toLowerCase(),
                    monthWithDay.toLowerCase(),
                    date.toLowerCase(),
                    day.toLowerCase(),
                    time.toLowerCase(),
                    timeWithMinutesSeconds.toLowerCase(),
                ],
                timestamp: formattedTime,
                colorScheme: true,
            };
            addLogToCollection(logData);
            setIsDisabled(false);
            setIsYesLoading(false);
            handleCloseEnableModal();
        } catch (error) {
            console.error('Error updating field:', error);
        }
    }, [data]);

    const deleteDocument = async (collectionPath, customId) => {
        const firestore = getFirestore();
        const documentRef = doc(firestore, collectionPath, customId);

        try {
            await deleteDoc(documentRef);
            console.log('Document deleted successfully.');
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };



    const handleDelete = useCallback(async (id) => {
        const selectedItem = data.find((item) => item.id === id);
        setSelectedItem(selectedItem);
        setInputName(selectedItem.name);
        setInputEmail(selectedItem.email);
        setTypeOfAccountDisplay(selectedItem.typeDisplay);
        setTypeOfAccount(selectedItem.type);
        setIsDisabled(true);
        setIsYesLoading(true);


        try {

            const userCredential = await signInWithEmailAndPassword(auth, selectedItem.email, selectedItem.pass);
            const user = userCredential.user;

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

            await deleteUser(user);
            const logData = {
                message: `Account Deleted: The account "${selectedItem.email}" of "${selectedItem.name}" has been deleted by "${name}".`,
                timestamp: formattedTime,
                colorScheme: false,
                keywords: [
                    formattedTime.toLowerCase(),
                    `Account Deleted: The account "${selectedItem.email}" of "${selectedItem.name}" has been deleted by "${name}".`.toLowerCase(),
                    'Account Deleted'.toLowerCase(),
                    'Deleted'.toLowerCase(),
                    selectedItem.email.toLowerCase(),
                    selectedItem.name.toLowerCase(),
                    name.toLowerCase(),
                    monthWithDay.toLowerCase(),
                    year.toLowerCase(),
                    month.toLowerCase(),
                    day.toLowerCase(),
                    date.toLowerCase(),
                    time.toLowerCase(),
                    timeWithMinutesSeconds.toLowerCase(),
                ],
            };
            addLogToCollection(logData);


            console.log('Account deleted successfully');

            const signInCredential = await signInWithEmailAndPassword(
                auth,
                authEmail,
                authPassword
            );
            const signedInUser = signInCredential.user;
            signedInUser
            deleteDocument('accounts', selectedItem.email);
            // setData(updatedData);
            // const filteredData = applySearchFilter(updatedData, searchInput.current?.value); // Apply search filter to updated data
            setFilteredData(filteredData);
            navigate('/account-list')
            // console.log('Field updated successfully.');
            setIsDisabled(false);
            setIsYesLoading(false);

            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error updating field:', error);
        }
    }, [data]);

    const handleDisable = useCallback(async (id) => {
        setIsDisabled(true);
        setIsYesLoading(true);
        const selectedItem = data.find((item) => item.id === id);
        setSelectedItem(selectedItem);
        setInputName(selectedItem.name);
        setInputEmail(selectedItem.email);
        setTypeOfAccountDisplay(selectedItem.typeDisplay);
        setTypeOfAccount(selectedItem.type);

        try {
            const itemDocRef = doc(firestore, 'accounts', selectedItem.email);
            const updates = {
                active: false,
            };

            await updateDoc(itemDocRef, updates);

            const updatedData = data.map((item) => {
                if (item.id === id) {
                    return { ...item, active: false };
                }
                return item;
            });

            setData(updatedData);
            const filteredData = applySearchFilter(updatedData, searchInput.current?.value); // Apply search filter to updated data
            setFilteredData(filteredData);
            // console.log('Field updated successfully.');
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

            const logData = {
                message: `Account Disabled: The account "${selectedItem.email}" of "${selectedItem.name}" has been disabled by "${name}".`,
                timestamp: formattedTime,
                colorScheme: false,
                keywords: [
                    formattedTime.toLowerCase(),
                    `Account Disabled: The account "${selectedItem.email}" of "${selectedItem.name}" has been disabled by "${name}".`.toLowerCase(),
                    'Account Disabled'.toLowerCase(),
                    'Disabled'.toLowerCase(),
                    selectedItem.email.toLowerCase(),
                    selectedItem.name.toLowerCase(),
                    name.toLowerCase(),
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
            setIsDisabled(false);
            setIsYesLoading(false);
            handleCloseDisableModal();
        } catch (error) {
            console.error('Error updating field:', error);
            setIsDisabled(false);
            setIsSaveLoading(false);
        }
    }, [data]);

    // Apply search filter to the data
    const applySearchFilter = (data, searchInputValue) => {
        if (!searchInputValue) {
            return data;
        }
        const filteredData = data.filter((item) =>
            item.email.toLowerCase().includes(searchInputValue.toLowerCase()) ||
            item.name.toLowerCase().includes(searchInputValue.toLowerCase()) ||
            item.typeDisplay.toLowerCase().includes(searchInputValue.toLowerCase())
        );
        return filteredData;
    };



    const handleSave = async (id) => {
        const selectedItem = data.find((item) => item.id === id);
        setIsDisabled(true);
        setIsSaveLoading(true);
        if (
            isPasswordLengthLabel() === false ||
            validateEmail() === false ||
            inputName === ''
        ) {
            setTimeout(() => {
                // Reset loading and disabled state
                setIsLoading(false);
                setIsDisabled(false);
            }, 500);
        } else {

            if (inputEmail === selectedItem.email && inputPassword === selectedItem.pass) {


                const documentRef = doc(db, 'accounts', selectedItem.id);

                const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
                const { datetime } = response.data;
                const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
                setTime(formattedTime);

                const updatedFields = {
                    name: inputName,
                    type: selectedType,
                    typeDisplay: selectedTypeDisplay,
                    lastUpdatedDate: formattedTime,
                    // Add more fields as needed

                };

                try {

                    await updateDoc(documentRef, updatedFields);
                    setIsDisabled(false);
                    setIsSaveLoading(false);


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

                    const logData = {
                        message: `Updated: The name "${selectedItem.name}" of "${selectedItem.email}" has been changed to  "${inputName}", updated by "${name}".`,
                        timestamp: formattedTime,
                        colorScheme: true,
                        keywords: [
                            formattedTime.toLowerCase(),
                            `Updated: The name "${selectedItem.name}" of "${selectedItem.email}" has been changed to  "${inputName}", updated by "${name}".`.toLowerCase(),
                            'Updated'.toLowerCase(),
                            selectedItem.email.toLowerCase(),
                            selectedItem.name.toLowerCase(),
                            inputName.toLowerCase(),
                            name.toLowerCase(),
                            year.toLowerCase(),
                            month.toLowerCase(),
                            monthWithDay.toLowerCase(),
                            date.toLowerCase(),
                            day.toLowerCase(),
                            time.toLowerCase(),
                            timeWithMinutesSeconds.toLowerCase(),
                        ],
                    }

                    addLogToCollection(logData);

                    const updatedData = data.map((item) => {
                        if (item.id === id) {
                            item.name = inputName;
                            item.type = selectedType;
                            item.typeDisplay = selectedTypeDisplay;
                            item.lastUpdatedDate = formattedTime;
                        }
                        return item;
                    });
                    setData(updatedData);
                    const filteredData = applySearchFilter(updatedData, searchInput.current?.value); // Apply search filter to updated data
                    setFilteredData(filteredData);
                    // console.log('Field updated successfully.');
                    // console.log('Document successfully updated!');
                    handleCloseModal();
                    setShowSuccessModal(true);
                } catch (error) {
                    console.error('Error updating document:', error);
                }

            }

            else if (inputEmail === selectedItem.email && inputPassword !== selectedItem.pass) {

                const userCredential = await signInWithEmailAndPassword(auth, selectedItem.email, selectedItem.pass);
                const user = userCredential.user;

                const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
                const { datetime } = response.data;
                const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
                setTime();

                try {
                    await updatePassword(user, inputPassword);

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
                    setTime();
                    // console.log('Password changed successfully');
                    const userDocRef = doc(firestore, 'accounts', selectedItem.email);


                    const updatedFields = {
                        email: inputEmail,
                        name: inputName,
                        type: selectedType,
                        typeDisplay: selectedTypeDisplay,
                        dateOfCreation: selectedItem.dateOfCreation,
                        lastUpdatedDate: formattedTime,
                        pass: inputPassword,
                        active: true,

                        // Add more fields as needed
                    };
                    // Perform setDoc operation
                    await setDoc(userDocRef, updatedFields);

                    const signInCredential = await signInWithEmailAndPassword(
                        auth,
                        authEmail,
                        authPassword
                    );

                    const signedInUser = signInCredential.user;
                    signedInUser


                    // console.log(authEmail, authPassword);
                    setIsDisabled(false);
                    setIsSaveLoading(false);

                    setTime(formattedTime);

                    const logData = {
                        message: `Password Changed: The password of "${selectedItem.email}" of "${selectedItem.name}" has been changed by "${name}".`,
                        timestamp: formattedTime,
                        colorScheme: true,
                        keywords: [
                            formattedTime.toLowerCase(),
                            `Password Changed: The password of "${selectedItem.email}" of "${selectedItem.name}" has been changed by "${name}".`.toLowerCase(),
                            'Password Changed'.toLowerCase(),
                            'Password'.toLowerCase(),
                            selectedItem.email.toLowerCase(),
                            selectedItem.name.toLowerCase(),
                            name.toLowerCase(),
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

                    const updatedItem = {
                        ...selectedItem,
                        email: inputEmail,
                        name: inputName,
                        type: selectedType,
                        typeDisplay: selectedTypeDisplay,
                        lastUpdatedDate: formattedTime,
                    };

                    const updatedData = data.map((item) => {
                        if (item.id === id) {
                            item.name = inputName;
                            item.type = selectedType;
                            item.typeDisplay = selectedTypeDisplay;
                            item.lastUpdatedDate = formattedTime;
                            item.pass = inputPassword;
                        }
                        return item;
                    });
                    setData(updatedData);
                    const filteredData = applySearchFilter(updatedData, searchInputValue); // Apply search filter to updated data
                    setFilteredData(filteredData);
                    // console.log('Document set successfully');
                    handleCloseModal();
                    setShowSuccessModal(true);
                } catch (error) {
                    console.error('Error:', error);
                }

            }

            else if (inputEmail !== selectedItem.email) {
                const userCredential = await signInWithEmailAndPassword(auth, selectedItem.email, selectedItem.pass);
                const user = userCredential.user;


                // updateEmail(user, inputEmail)
                //     .then(async () => {
                //         // Email change successful
                //         setIsDisabled(false);
                //         setIsSaveLoading(false);
                //         const documentRef = doc(db, 'accounts', selectedItem.email);

                const oldDocumentRef = doc(db, 'accounts', selectedItem.email);
                const newDocumentRef = doc(db, 'accounts', inputEmail);

                const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
                const { datetime } = response.data;
                const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
                setTime(formattedTime);

                try {
                    // Get the data from the old document
                    const documentSnapshot = await getDoc(oldDocumentRef);
                    if (documentSnapshot.exists()) {
                        const documentData = documentSnapshot.data();

                        // Merge the updated fields with the existing document data

                        // Create the new document with the desired ID and copy the merged data

                        const updatedFields = {
                            email: inputEmail,
                            name: inputName,
                            type: selectedType,
                            typeDisplay: selectedTypeDisplay,
                            dateOfCreation: selectedItem.dateOfCreation,
                            lastUpdatedDate: formattedTime,
                            pass: inputPassword,
                            active: true,

                            // Add more fields as needed
                        };

                        await setDoc(newDocumentRef, updatedFields);
                        await deleteDoc(oldDocumentRef);
                        // Optionally, delete the old document

                        try {
                            const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);
                            // console.log('User created successfully:', userCredential.user);

                            setIsDisabled(false);
                            setIsSaveLoading(false);

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

                            const logData = {
                                message: `Updated: The email "${selectedItem.email}" of "${selectedItem.name}" has been changed to  "${inputEmail}", updated by "${name}".`,
                                timestamp: formattedTime,
                                colorScheme: true,
                                keywords: [
                                    formattedTime.toLowerCase(),
                                    `Updated: The email "${selectedItem.email}" of "${selectedItem.name}" has been changed to  "${inputEmail}", updated by "${name}".`.toLowerCase(),
                                    'Updated'.toLowerCase(),
                                    'Email'.toLowerCase(),
                                    selectedItem.email.toLowerCase(),
                                    selectedItem.name.toLowerCase(),
                                    inputEmail.toLowerCase(),
                                    monthWithDay.toLowerCase(),
                                    name.toLowerCase(),
                                    year.toLowerCase(),
                                    month.toLowerCase(),
                                    day.toLowerCase(),
                                    date.toLowerCase(),
                                    time.toLowerCase(),
                                    timeWithMinutesSeconds.toLowerCase(),
                                ],
                            }
                            try {
                                await deleteUser(user);
                                // console.log('User authentication record deleted successfully.');



                                setIsDisabled(false);
                                setIsSaveLoading(false);

                                const signInCredential = await signInWithEmailAndPassword(
                                    auth,
                                    authEmail,
                                    authPassword
                                );

                                const signedInUser = signInCredential.user;
                                signedInUser

                                const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
                                const { datetime } = response.data;
                                const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
                                setTime(formattedTime);

                                const updatedItem = {
                                    ...selectedItem,
                                    email: inputEmail,
                                    name: inputName,
                                    type: selectedType,
                                    typeDisplay: selectedTypeDisplay,
                                    lastUpdatedDate: formattedTime,
                                };

                                const updatedData = data.map((item) =>
                                    item.id === id ? updatedItem : item
                                );
                                setData(updatedData);
                                const filteredData = applySearchFilter(updatedData, searchInputValue);
                                setFilteredData(filteredData);
                                // console.log(authEmail, authPassword);


                            } catch (error) {
                                console.error('Error deleting user authentication record:', error);
                            }

                            addLogToCollection(logData);
                            handleCloseModal();
                            setShowSuccessModal(true);

                            // console.log('Document ID successfully changed!');
                        } catch (error) {
                            console.error('Error creating user:', error);
                        }
                    } else {
                        console.error('Old document does not exist!');
                    }

                } catch (error) {
                    console.error('Error changing document ID:', error);
                    setIsDisabled(false);
                    setIsSaveLoading(false);
                }


                // })
                // .catch((error) => {
                //     console.error('Error changing email:', error);
                // });
            }




            else {
                try {
                    const signInMethods = await fetchSignInMethodsForEmail(auth, inputEmail);
                    if (signInMethods.length > 0) {
                        // Email already exists                        
                        setIsDisabled(false);
                        setIsSaveLoading(false);
                        setIsEmailDuplicate(true);
                        setEmailError(false);
                        validateEmail(false);

                        return;
                    }


                } catch (error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('An error occurred while checking the email existence. Please try again later.');
                    // console.log(errorCode, errorMessage);
                    setIsLoading(false);
                    setIsDisabled(false);
                }


            }



        }
    };

    const handleChangeEmailText = (text) => {
        setInputEmail(text);
    };



    const isPasswordLengthLabel = () => {
        return inputPassword.length >= 6;
    };
    // const handlePasswordChange = _.debounce((value) => {
    //     setInputPassword(value);
    // }, 50);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, 'accounts'), orderBy('dateOfCreation', 'desc'));
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
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.typeDisplay.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, data]);

    const paginatedData = useMemo(() => {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }, [page, itemsPerPage, searchQuery, data, filtered]);


    const handleSearch = debounce((text) => {
        setSearchQuery(text);
    }, 300);

    const startIndex = page * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

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
                    borderBottomColor={'cyan.500'}

                >
                    <SideDrawer
                        selectedScreen={selectedScreen} />

                    <Box w={[0, 0, 0, 850]} h={[10, 10, 10, 10]} marginBottom={1.5} marginTop={1.5} paddingLeft={5}>
                        <FastImage
                            source={{
                                uri: logo,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                            style={styles.image}
                        />
                    </Box>
                    {/* {showDrawerIcon && <MobileViewDrawer
                        selectedScreen={selectedScreen}
                    />} */}



                    <Box w={[150, 200, 250, 0]} h={[6, 8, 10, 10]} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]}>

                        <FastImage
                            source={{
                                uri: logo2,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                            style={styles.image}
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
                    {/* <SideDrawer
                        selectedScreen={selectedScreen}
                    /> */}

                    {/* Main Content */}
                    <Box flex={1} flexGrow={1} minHeight={0}>
                        {/* Main Content Content */}
                        <Input ref={searchInput} onChangeText={handleSearch} placeholder="Search" bgColor={'white'} />
                        <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }}>
                            <Box height={'100%'}>

                                <DataTable margin={[0, 0, 0, 1, 1, 1]}>
                                    <Box borderWidth={1} borderColor="gray.200" borderRadius={4} overflow="hidden" display={['none', 'none', 'none', '', '', '']}>
                                        <Box flexDirection="row" borderBottomWidth={1} borderColor="gray.200" bgColor={'#0642F4'} >
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color={'white'} >Email</Text>
                                            </Box>
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color={'white'} >Name</Text>
                                            </Box>
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color={'white'} >Type of Account</Text>
                                            </Box>
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color={'white'} >Date of Creation</Text>
                                            </Box>
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color={'white'} >Last Updated</Text>
                                            </Box>
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color={'white'} >Status</Text>
                                            </Box>
                                            <Box flex={1} padding={2}>
                                                <Text fontWeight="bold" color={'white'} >Operate</Text>
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
                                            <Box key={item.id} margin={[2, 2, 2, 0, 0, 0]} flexDirection={['column', 'column', 'column', 'row', 'row', 'row']} bgColor={item.active ? 'blue.200' : 'amber.500'} borderColor={'gray.200'} borderWidth={[2, 2, 2, 1, 1, 1]} paddingBottom={1} marginRight={0}>
                                                <Box flex={1} padding={[0, 0, 0, 2, 2, 2]}>
                                                    <Box flexDirection={['row', 'row', 'row', '', '', '']}>
                                                        <Box display={['block', 'block', 'block', 'none', 'none', 'none']} flex={2} borderColor="gray.200" bgColor={'#7b9cff'}>
                                                            <Text fontWeight="bold" color={'white'} fontSize={[12, 14, 14, 0, 0, 0]}> Email</Text>
                                                        </Box>
                                                        <Text flex={[5, 5, 5, 0, 0, 0]} borderBottomWidth={[1, 1, 1, 0, 0, 0]} borderBottomColor={'blueGray.400'}>{item.email}</Text>


                                                    </Box>
                                                </Box>
                                                <Box flex={1} padding={[0, 0, 0, 2, 2, 2]}>
                                                    <Box flexDirection={['row', 'row', 'row', '', '', '']}>
                                                        <Box display={['block', 'block', 'block', 'none', 'none', 'none']} flex={2} borderColor="gray.200" bgColor={'#7b9cff'} marginRight={0}>
                                                            <Text fontWeight="bold" color={'white'} fontSize={[12, 14, 14, 0, 0, 0]} > Name</Text>
                                                        </Box>
                                                        <Text flex={[5, 5, 5, 0, 0, 0]} borderBottomWidth={[1, 1, 1, 0, 0, 0]} borderBottomColor={'blueGray.400'}>{item.name}</Text>
                                                    </Box>

                                                </Box>
                                                <Box flex={1} padding={[0, 0, 0, 2, 2, 2]}>
                                                    <Box flexDirection={['row', 'row', 'row', '', '', '']}>
                                                        <Box display={['block', 'block', 'block', 'none', 'none', 'none']} flex={2} borderColor="gray.200" bgColor={'#7b9cff'} marginRight={0}>
                                                            <Text fontWeight="bold" color={'white'} fontSize={[12, 14, 14, 0, 0, 0]}  > Type of Account</Text>
                                                        </Box>
                                                        <Text flex={[5, 5, 5, 0, 0, 0]} borderBottomWidth={[1, 1, 1, 0, 0, 0]} borderBottomColor={'blueGray.400'}>{item.typeDisplay}</Text>
                                                    </Box>

                                                </Box>
                                                <Box flex={1} padding={[0, 0, 0, 2, 2, 2]}>
                                                    <Box flexDirection={['row', 'row', 'row', '', '', '']}>
                                                        <Box display={['block', 'block', 'block', 'none', 'none', 'none']} flex={2} borderColor="gray.200" bgColor={'#7b9cff'} marginRight={0}>
                                                            <Text fontWeight="bold" color={'white'} fontSize={[12, 14, 14, 0, 0, 0]} > Date of Creation</Text>
                                                        </Box>
                                                        <Text flex={[5, 5, 5, 0, 0, 0]} borderBottomWidth={[1, 1, 1, 0, 0, 0]} borderBottomColor={'blueGray.400'}>{item.dateOfCreation}</Text>
                                                    </Box>

                                                </Box>
                                                <Box flex={1} padding={[0, 0, 0, 2, 2, 2]}>
                                                    <Box flexDirection={['row', 'row', 'row', '', '', '']}>
                                                        <Box display={['block', 'block', 'block', 'none', 'none', 'none']} flex={2} borderColor="gray.200" bgColor={'#7b9cff'} marginRight={0}>
                                                            <Text fontWeight="bold" color={'white'} fontSize={[12, 14, 14, 0, 0, 0]} > Last Updated</Text>
                                                        </Box>
                                                        <Text flex={[5, 5, 5, 0, 0, 0]} borderBottomWidth={[1, 1, 1, 0, 0, 0]} borderBottomColor={'blueGray.400'}>{item.lastUpdatedDate}</Text>
                                                    </Box>

                                                </Box>
                                                <Box flex={1} padding={[0, 0, 0, 2, 2, 2]}>
                                                    <Box flexDirection={['row', 'row', 'row', '', '', '']}>
                                                        <Box display={['block', 'block', 'block', 'none', 'none', 'none']} flex={2} borderColor="gray.200" bgColor={'#7b9cff'} marginRight={0}>
                                                            <Text fontWeight="bold" color={'white'} fontSize={[12, 14, 14, 0, 0, 0]} > Status</Text>
                                                        </Box>
                                                        <Text flex={[5, 5, 5, 0, 0, 0]} borderBottomWidth={[1, 1, 1, 0, 0, 0]} borderBottomColor={'blueGray.400'}>{item.active ? 'Enabled' : 'Disabled'}</Text>
                                                    </Box>

                                                </Box>
                                                <Box flex={1} padding={[0, 0, 0, 2, 2, 2]}>
                                                    <Box flexDirection={['row', 'row', 'row', '', '', '']}>
                                                        <Box display={['block', 'block', 'block', 'none', 'none', 'none']} flex={2} borderColor="gray.200" bgColor={'#7b9cff'} marginRight={0}>
                                                            <Text fontWeight="bold" color={'white'} fontSize={[12, 14, 14, 0, 0, 0]}> Operate</Text>
                                                        </Box>
                                                        <HStack space={1} flex={[5, 5, 5, 1, 1, 1]}>
                                                            <Button
                                                                onPress={() => handleEdit(item.id)}
                                                                flex={[1, 1, 1, 2, 2, 2]}
                                                                padding={1}
                                                                justifyContent='center'
                                                                alignItems='center'
                                                                flexDirection='row'>
                                                                <Text textAlign={'center'} fontSize={[0, 0, 0, 0, 12, 14]} color={'white'}>Edit</Text>
                                                                <Icon as={<MaterialIcons name={"edit"} />} color={'white'} size={[5, 5, 5, 5, 0]} />
                                                            </Button>
                                                            {item.active ? (
                                                                <Button onPress={() => handleOpenDisableModal(item.id)} flex={[1, 1, 1, 2, 2, 2]} padding={1} colorScheme={'amber'} _text={{ fontSize: [0, 0, 0, 0, 12, 14], }}>
                                                                    <Text textAlign={'center'} fontSize={[0, 0, 0, 0, 12, 14]} color={'white'}>Disable</Text>
                                                                    <Icon as={<MaterialIcons name={"block"} />} color={'white'} size={[5, 5, 5, 5, 0]} />
                                                                </Button>
                                                            ) : (
                                                                <Button onPress={() => handleOpenEnableModal(item.id)} flex={[1, 1, 1, 2, 2, 2]} padding={1} colorScheme={'success'} _text={{ fontSize: [0, 0, 0, 0, 12, 14], }}>
                                                                    <Text textAlign={'center'} fontSize={[0, 0, 0, 0, 12, 14]} color={'white'}>Enable</Text>
                                                                    <Icon as={<MaterialIcons name={"check-circle"} />} color={'white'} size={[5, 5, 5, 5, 0]} />
                                                                </Button>
                                                            )}
                                                            <Button onPress={() => handleOpenDeleteModal(item.id)} flex={[1, 1, 1, 2, 2, 2]} padding={1} colorScheme={'error'} _text={{ fontSize: [0, 0, 0, 0, 12, 14], }}>
                                                                <Text textAlign={'center'} fontSize={[0, 0, 0, 0, 12, 14]} color={'white'}>Delete</Text>
                                                                <Icon as={<MaterialIcons name={"delete"} />} color={'white'} size={[5, 5, 5, 5, 0]} />
                                                            </Button>
                                                        </HStack>
                                                    </Box>
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
                            </Box>
                            <Modal isOpen={modalVisible} onClose={handleCloseModal}>
                                <Modal.Content>
                                    <Modal.CloseButton />
                                    <Modal.Header borderBottomWidth={0}>Edit Acccount</Modal.Header>
                                    <Modal.Body>

                                        {selectedItem && (
                                            <VStack>
                                                <VStack><Text>Email: </Text> <Input color={!isEmailDuplicate ? 'black' : 'red.500'} borderBottomColor={validateEmail() ? 'green.300' : 'red.500'} borderBottomWidth={2} defaultValue={inputEmail} ref={inputEmailRef} onChangeText={handleInputEmailChange} /></VStack>
                                                {!validateEmail() && (
                                                    <Text color={'#D22730'} bold>Invalid Email!</Text>
                                                )}
                                                {isEmailDuplicate && (
                                                    <Text color={'#D22730'} bold>Email already in use! Please use a different email!</Text>
                                                )}
                                                <VStack><Text>Name: </Text> <Input borderBottomColor={inputName !== '' ? 'green.300' : 'red.500'} borderBottomWidth={2} defaultValue={inputName} ref={inputNameRef} onChangeText={handleInputNameChange} /></VStack>
                                                {inputName === '' && (
                                                    <Text color={'#D22730'} bold>Empty Name!</Text>
                                                )}
                                                <VStack><Text>Password: </Text>
                                                    <Input borderBottomColor={isPasswordLengthLabel() ? 'green.300' : 'red.500'} borderBottomWidth={2} defaultValue={inputPassword} ref={inputPassRef} onChangeText={handleInputPassChange} type={show ? "text" : "password"} InputLeftElement={<Icon as={<FontAwesome name={show ? "unlock-alt" : "lock"} />} size={5} ml="2" />} InputRightElement={<Pressable onPress={() => setShow(!show)} >
                                                        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" />
                                                    </Pressable>} />
                                                </VStack>

                                                <VStack><Text>Type of Account:</Text>
                                                    <HStack space={1} justifyContent="center" >
                                                        <Button _hover={{ bgColor: 'booking' === selectedItemType ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                                                            base: 90,
                                                            md: 90,
                                                            sm: 90,
                                                        }} onPress={handleToggleAccountType4} bgColor={'booking' === selectedItemType ? '#0642F4' : '#CED5EA'} ><Text style={{ color: 'white', }}>Booking</Text></Button>

                                                        <Button _hover={{ bgColor: 'staff' === selectedItemType ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                                                            base: 90,
                                                            md: 90,
                                                            sm: 90,
                                                        }} onPress={handleToggleAccountType3} bgColor={'staff' === selectedItemType ? '#0642F4' : '#CED5EA'}  ><Text style={{ color: 'white', }}>Staff</Text></Button>

                                                        <Button _hover={{ bgColor: 'admin' === selectedItemType ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                                                            base: 90,
                                                            md: 90,
                                                            sm: 90,
                                                        }} onPress={handleToggleAccountTypeAd} bgColor={'admin' === selectedItemType ? '#0642F4' : '#CED5EA'}  ><Text style={{ color: 'white', }}>Admin</Text></Button>



                                                    </HStack>
                                                    <HStack space={1} justifyContent="center" marginTop={1}>
                                                        <Button _hover={{ bgColor: 'superadmin' === selectedItemType ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                                                            base: 90,
                                                            md: 90,
                                                            sm: 90,
                                                        }} onPress={handleToggleAccountTypeSpAd} bgColor={'superadmin' === selectedItemType ? '#0642F4' : '#CED5EA'} ><Text style={{ color: 'white', }}>Super Admin</Text></Button>
                                                        <Button _hover={{ bgColor: 'devadmin' === selectedItemType ? '#0642F4' : 'blueGray.400', }} size="sm" borderWidth='1' borderColor='white' w={{
                                                            base: 90,
                                                            md: 90,
                                                            sm: 90,
                                                        }} onPress={handleToggleAccountTypeDevAd} bgColor={'devadmin' === selectedItemType ? '#0642F4' : '#CED5EA'} ><Text style={{ color: 'white', }}>Dev Admin</Text></Button>
                                                    </HStack>
                                                </VStack>

                                                {/* Add additional input fields or form components to edit the data */}
                                            </VStack>
                                        )}
                                    </Modal.Body>
                                    <Modal.Footer borderTopWidth={0}>
                                        <Button onPress={handleCloseModal} flex={1} padding={1} margin={1}>Close</Button>
                                        <Button onPress={() => handleSave(selectedItem.id)} disabled={isDisabled} flex={1} padding={1} colorScheme={'success'} margin={1}>{isSaveLoading ? <Spinner color="white" size={21} /> : 'Save'}</Button>
                                        {/* Add a save button or other action button to update the data */}
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                            <Modal isOpen={showDisableModal} onClose={handleCloseDisableModal}>
                                <Modal.Content bgColor={'amber.500'}>
                                    <Modal.CloseButton />
                                    <Modal.Header bgColor={'amber.500'} borderBottomWidth={0} _text={{ color: 'white', }}>Disable Account?</Modal.Header>
                                    <Modal.Body bgColor={'amber.500'}>
                                        {selectedItem && (
                                            <VStack>
                                                <Text color={'white'}>Email: {selectedItem.email}</Text>
                                                <Text color={'white'}>Name: {selectedItem.name}</Text>
                                                <Text color={'white'}>Type of Account: {selectedItem.typeDisplay}</Text>
                                                {/* Add additional input fields or form components to edit the data */}
                                            </VStack>
                                        )}
                                    </Modal.Body>
                                    <Modal.Footer bgColor={'amber.500'} borderTopWidth={0}>
                                        <Button onPress={handleCloseDisableModal} flex={1} padding={1} margin={1}>No</Button>
                                        <Button onPress={() => handleDisable(selectedItem.id)} colorScheme={'error'} flex={1} padding={1} margin={1} disabled={isDisabled}>{isYesLoading ? <Spinner color="white" size={21} /> : 'Yes'}</Button>
                                        {/* Add a save button or other action button to update the data */}
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>

                            <Modal isOpen={showDeleteModal} onClose={handleCloseDeleteModal}>
                                <Modal.Content bgColor={'error.300'}>
                                    <Modal.CloseButton />
                                    <Modal.Header bgColor={'error.300'} borderBottomWidth={0} >Delete Account?</Modal.Header>
                                    <Modal.Body bgColor={'error.300'}>
                                        {selectedItem && (
                                            <VStack>
                                                <Text >Email: {selectedItem.email}</Text>
                                                <Text >Name: {selectedItem.name}</Text>
                                                <Text >Type of Account: {selectedItem.typeDisplay}</Text>
                                                {/* Add additional input fields or form components to edit the data */}
                                            </VStack>
                                        )}
                                    </Modal.Body>
                                    <Modal.Footer bgColor={'error.300'} borderTopWidth={0}>
                                        <Button onPress={handleCloseDisableModal} flex={1} padding={1} margin={1}>No</Button>
                                        <Button onPress={() => handleDelete(selectedItem.id)} colorScheme={'error'} flex={1} padding={1} margin={1} disabled={isDisabled}>{isYesLoading ? <Spinner color="white" size={21} /> : 'Yes'}</Button>
                                        {/* Add a save button or other action button to update the data */}
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>


                            <Modal isOpen={showEnableModal} onClose={handleCloseEnableModal}>
                                <Modal.Content bgColor={'success.200'}>
                                    <Modal.CloseButton />
                                    <Modal.Header bgColor={'success.200'} borderBottomWidth={0}>Enable Account?</Modal.Header>
                                    <Modal.Body bgColor={'success.200'}>
                                        {selectedItem && (
                                            <VStack>
                                                <Text>Email: {selectedItem.email}</Text>
                                                <Text>Name: {selectedItem.name}</Text>
                                                <Text>Type of Account: {selectedItem.typeDisplay}</Text>
                                                {/* Add additional input fields or form components to edit the data */}
                                            </VStack>
                                        )}
                                    </Modal.Body>
                                    <Modal.Footer bgColor={'success.200'} borderTopWidth={0}>
                                        <Button onPress={handleCloseEnableModal} flex={1} padding={1} margin={1}>No</Button>
                                        <Button onPress={() => handleEnable(selectedItem.id)} colorScheme={'success'} flex={1} padding={1} margin={1} disabled={isDisabled}>{isYesLoading ? <Spinner color="white" size={21} /> : 'Yes'}</Button>
                                        {/* Add a save button or other action button to update the data */}
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                            <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} size="lg"  >
                                <Modal.Content maxWidth="350" bgColor={'green.600'} borderWidth={3} borderColor={'green.400'}>
                                    <Modal.Header bgColor={'green.600'} borderBottomWidth={0}><Text color="white" textAlign={'center'} bold>😊😎 Success! 😎😊</Text></Modal.Header>
                                    <Modal.Body >
                                        <Text color="white" textAlign={'center'}>The account update was successful.</Text>
                                    </Modal.Body>
                                    <Modal.Footer bgColor={'green.600'} borderTopWidth={0}>
                                        <Button _hover={{ bgColor: 'green.500', }} variant={'outline'} flex="1" onPress={() => setShowSuccessModal(false)}>
                                            <Text color="white" textAlign={'center'}>Proceed</Text>
                                        </Button>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                        </ScrollView>
                    </Box>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
}



