/* The above code is a JavaScript code snippet that imports various components and libraries from the
NativeBase framework and React Native for building mobile applications. It also includes imports for
icons from different icon libraries like AntDesign, FontAwesome, Ionicons, etc. Additionally, it
imports functions and utilities from Firebase for authentication, Firestore database operations, and
storage. */
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
  Text,
  VStack,
  useBreakpointValue,
  TextArea,
  InputRightAddon,
  InputGroup,
  Select,
  CheckIcon,
  ScrollView,
  PresenceTransition,
  Drawer,
  InputLeftAddon,
  Heading,
  FormControl,
  WarningOutlineIcon
} from 'native-base';
import React, { useEffect, useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react';
import { Dimensions, TouchableOpacity, StyleSheet, Platform, View } from 'react-native';
import 'react-native-gesture-handler';
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo
} from 'react-native-vector-icons';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc, arrayUnion, updateDoc, query, where } from 'firebase/firestore';
import moment from 'moment';
import './../style.css';
import { projectControlFirestore, projectControlAuth, projectExtensionFirestore, projectExtensionFirebase, projectControlFirebase } from "../../crossFirebase";
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject, } from 'firebase/storage';
import { DragSortableView } from "react-native-drag-sort";
import DraggableFlatList from "react-native-draggable-flatlist";
import SelectDropdown from 'react-native-select-dropdown';
import { useSelector, useDispatch } from 'react-redux';
import SideDrawer from './SideDrawer/SideDrawer';
import { cloneDeep } from 'lodash';
import ImageMarker, { Position } from "react-native-image-marker";
import QRCodeScanner from './QrCodeScanner/QrCodeScanner';



import {
  // setModelData,
  setMakeData,
  setIsLoading,
  setSelectedImages,
  setIsAddPhotoVisible,
  setAddAnotherImages,
  setLoginName,
  setDeleteImageVisible,
  setExpenseNameData,
  setPaidToData,
  setCurrentDate,
  setSupplyChainsCostsData,
  setSelectedExpenseName,
  setSelectedPaidTo,
  setLoadingModalVisible,
  setIsSuccessModalOpen,
  setIsUpdateSuccessModalOpen

} from './redux/store'


import "setimmediate";


import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css'; // Import a CSS effect for the lazy loading transition
import FastImage from 'react-native-fast-image-web-support';
import MobileViewDrawer from './SideDrawer/MobileViewDrawer';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

const { width } = Dimensions.get('window');


const childrenWidth = 76;
const childrenHeight = 76;
const marginChildrenTop = 7;
const marginChildrenBottom = 0;

let globalJpyToUsd = '';
let globalUsdToJpy = '';

let globalSupplyChainCostsData = [];
let globalSelectedExpenseName = '';
let globalSupplyChainCostsAmount = 0;
let globalSelectedPaidTo = '';
let globalModelDataVariable = [];
let globalMakeDataVariable = [];
let globalRegYearDataVariable = [];
let globalPortDataVariable = [];
let globalSalesDataVariable = [];
let globalBuyerDataVariable = [];
let globalTransmissionDataVariable = [];
let globalExteriorColorDataVariable = [];
let globalFuelDataVariable = [];
let globalDriveTypeDataVariable = [];
let globalBodyTypeDataVariable = [];
let globalSelectedImages = [];
let globalVehicleFolderName = '';
let selectedScreen = 'ADD NEW VEHICLE'
let globalReferenceNumber = '';
let globalSPCSelectedDate = '';
let globalFobPrice = '';

const firestore = getFirestore();

const UpdateSuccessModal = ({ onClose, bodyText, headerText }) => {

  const isUpdateSuccessModalOpen = useSelector((state) => state.isUpdateSuccessModalOpen);

  return (
    <Modal isOpen={isUpdateSuccessModalOpen} onClose={onClose} >
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
  );
};

const UploadSuccessModal = ({ onClose, bodyText, headerText }) => {

  const isSuccessModalOpen = useSelector((state) => state.isSuccessModalOpen);

  return (
    <Modal isOpen={isSuccessModalOpen} onClose={onClose} >
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
  );
};

const LoadingModal = () => {
  const loadingModalVisible = useSelector((state) => state.loadingModalVisible);


  return (

    <Box
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backgroundColor="rgba(0, 0, 0, 0.5)"
      flex={1}
      display={loadingModalVisible ? '' : 'none'}
    >
      {/* Content within the modal */}
      <Center flex={1}>
        <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="lg" color="white" />
          <Text color={'white'} selectable={false}>Loading, please wait!</Text>
        </Box>
      </Center>
    </Box>


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
      <Pressable onPress={handleModalCalendarOpen} flex={3}>
        <Input value={selectedDate} onFocus={handleModalCalendarOpen} />
      </Pressable>

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

const SupplyChainsCosts = ({
  handleAddExpenseNameTextChange,
  textAreaAddExpenseName,
  inputExpenseAmount,
  handleInputExpenseAmountChange,
  handleAddPaidToTextChange,
  paidToData,
  inputCarNotes,

}) => {

  const dispatch = useDispatch();
  const supplyChainsCostsData = useSelector((state) => state.supplyChainsCostsData);
  const [sccData, setSccData] = useState([]);
  const currentDate = useSelector((state) => state.currentDate);
  const [supplyChainsCostsModalVisible, setSupplyChainsCostsModalVisible] = useState(false);
  const [modalCalendarVisible, setModalCalendarVisible] = useState(false);
  const expenseNameData = useSelector((state) => state.expenseNameData);

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





  const handleModalSupplyChainsCostsOpen = () => {
    setSupplyChainsCostsModalVisible(true);
  };

  const handleModalSupplyChainsCostsClose = () => {
    setSupplyChainsCostsModalVisible(false);
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
  };

  const handleClearModalOpen = () => {
    setClearModalVisible(true);
  };

  const handleClearModalClose = () => {
    setClearModalVisible(false);
  };

  useEffect(() => {
    const amounts = supplyChainsCostsData.map((item) => {
      const expenseName = Object.keys(item)[0];
      const expenseData = item[expenseName];
      return parseFloat(expenseData.amount.replace(',', '')) || 0;
    });

    // Use reduce to add up all the amounts
    const totalAmount = amounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const formattedTotalAmount = totalAmount.toLocaleString();
    setTotalAmount(formattedTotalAmount);
    globalSupplyChainCostsAmount = formattedTotalAmount;

  }, [supplyChainsCostsData]);

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
        dispatch(setSupplyChainsCostsData(globalSupplyChainCostsData));
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
        console.log(globalSupplyChainCostsData);
        // const updatedData = { ...supplyChainsCostsData, ...newData };
        dispatch(setSupplyChainsCostsData(globalSupplyChainCostsData));
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
    console.log(item.amount);
    inputExpenseAmount.current.setNativeProps({ text: item.amount });
    dispatch(setSelectedExpenseName(item.expenseName));
    globalSelectedExpenseName = item.expenseName;
    dispatch(setSelectedPaidTo(item.paidName));
    globalSelectedPaidTo = item.paidName;
    globalSPCSelectedDate = item.date;
    setSelectedDate(item.date);
  }, [])


  const handleDeleteItem = (expenseName) => {
    // Find the index of the item to be deleted
    const itemIndex = globalSupplyChainCostsData.findIndex((item) => Object.keys(item)[0] === expenseName);

    if (itemIndex !== -1) {
      // Create a copy of the data array and remove the item at the found index
      const newData = [...globalSupplyChainCostsData];
      newData.splice(itemIndex, 1);

      // Update the state with the new array
      dispatch(setSupplyChainsCostsData(newData));
      globalSupplyChainCostsData = newData;
    }
  };

  const handleFirstModalClose = () => {
    setSupplyChainsCostsModalVisible(false);

  };
  const handleFirstModalOpen = () => {
    setSupplyChainsCostsModalVisible(true);

  };
  return (
    <>
      <Button
        borderRadius={3}
        flex={1}
        onPress={handleModalSupplyChainsCostsOpen}
        variant={'outline'}
        _text={{ color: 'black', }}
        leftIcon={<MaterialIcons name="payments" size={20} color="black" />}>
        <Text>Supply Chains Costs: ¥{totalAmount}</Text>
      </Button>

      <Modal isOpen={supplyChainsCostsModalVisible} onClose={handleModalSupplyChainsCostsClose} size={'full'}>
        <Modal.Content bgColor={'white'} w={'50%'} h={'auto'}>
          <Modal.CloseButton />
          <Modal.Header bgColor={'#7B9CFF'}>
            <Text color={'white'} fontSize={20} bold>Supply Chains Costs</Text>


          </Modal.Header>

          <Modal.Body>
            <Box height={'full'}>
              <Box paddingBottom={5}>
                <Box flexDir={'row'} paddingBottom={1} >
                  <Box bgColor={'#7B9CFF'} flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
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
                      handleFirstModalOpen={handleFirstModalOpen}
                    />
                  </Box>

                  <SelectExpenseName expenseNameIsError={expenseNameIsError} selectExpenseNameRef={selectExpenseNameRef} selectResetKey={selectResetKey} setSelectResetKey={setSelectResetKey} />
                  {/* <Select
                    // ref={selectExpenseNameRef}
                    key={`expenseName${resetKey}`}
                    borderColor={expenseNameIsError ? 'error.400' : 'muted.300'}
                    flex={3}
                    onValueChange={(value) => {
                      globalSelectedExpenseName = value
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
                  </Select> */}


                </Box>


                <Box flexDir={'row'} paddingBottom={1} >
                  <Box bgColor={'#7B9CFF'} flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
                    <Text color={'white'} alignSelf={'center'} marginLeft={2} flex={1} >Amount</Text>
                  </Box>
                  <Input
                    borderColor={inputAmountIsError ? 'error.400' : 'muted.300'}
                    flex={3}
                    ref={inputExpenseAmount}
                    onChangeText={handleInputExpenseAmountChange}
                    placeholder="Amount"
                    bgColor={'white'}
                    placeholderTextColor={'muted.400'}
                    InputLeftElement={<Icon as={<FontAwesome name="yen" />} size={5} ml="2" color="muted.400" />} />
                </Box>

                <Box flexDir={'row'} paddingBottom={1} >
                  <Box bgColor={'#7B9CFF'} flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
                    <Text color={'white'} alignSelf={'center'} marginLeft={2} flex={1}>Date</Text>
                  </Box>

                  <ModalCalendar setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
                </Box>

                <Box flexDir={'row'} paddingBottom={1} >
                  <Box bgColor={'#7B9CFF'} flex={1} flexDir={'row'} alignItems={'center'} justifyContent={'center'} borderRadius={3}>
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
                      handleFirstModalOpen={handleFirstModalOpen}
                    />

                  </Box>

                  <SelectPaidTo paidToIsError={paidToIsError} />
                </Box>

                <Button
                  onPress={handleSave}
                  colorScheme={'success'}
                  size={'sm'}
                  borderRadius={5}
                  margin={1}
                  flex={1}
                  width={'40%'}
                  alignSelf={'center'}
                  leftIcon={<MaterialIcons name='add' color='white' size={20} />}
                >
                  ADD
                </Button>
              </Box>

              <Box>
                <Box flexDirection="row" borderBottomWidth={1} borderColor="gray.200" bgColor="#0642F4">
                  <Text flex={1} color={'white'} marginLeft={1} bold>Expense Name</Text>
                  <Text flex={1} color={'white'} marginLeft={1} bold>Amount</Text>
                  <Text flex={1} color={'white'} marginLeft={1} bold>Date</Text>
                  <Text flex={1} color={'white'} marginLeft={1} bold>Paid To</Text>
                  <Text flex={1} color={'white'} marginLeft={1} bold>Modify</Text>
                </Box>
                {supplyChainsCostsData.map((item, index) => {
                  const expenseName = Object.keys(item)[0];
                  const expenseData = item[expenseName];

                  return (
                    <Box key={index} flexDirection="row" bgColor={'muted.300'} borderBottomColor="gray.200" borderBottomWidth={1}
                      justifyContent={'center'} alignItems={'center'}>
                      <Text flex={1} marginLeft={1}>{expenseData.expenseName}</Text>
                      <Text flex={1} marginLeft={1}>¥{expenseData.amount}</Text>
                      <Text flex={1} marginLeft={1}>{expenseData.date}</Text>
                      <Text flex={1} marginLeft={1}>{expenseData.paidName}</Text>
                      <Box flex={1} marginLeft={1} flexDir={'row'}>

                        <Pressable flex={1} margin={1} onPress={() => handleEditPress(expenseData)}>
                          {({
                            isHovered,
                            isFocused,
                            isPressed
                          }) => {
                            return <Box flex={1} bgColor={isHovered ? 'primary.700' : 'primary.500'} borderRadius={3}>
                              <Text flex={1} textAlign={'center'} color={'white'}>Edit</Text>
                            </Box>
                          }}
                        </Pressable>

                        <Pressable flex={1} margin={1} onPress={() => handleDeleteItem(expenseData.expenseName)}>
                          {({
                            isHovered,
                            isFocused,
                            isPressed
                          }) => {
                            return <Box flex={1} bgColor={isHovered ? 'error.800' : 'error.500'} borderRadius={3}>
                              <Text flex={1} textAlign={'center'} color={'white'}>Delete</Text>
                            </Box>
                          }}
                        </Pressable>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

            </Box>


          </Modal.Body>


          <HStack space={5} width={'full'} justifyContent={'space-between'}>
            <Box flex={4} />
            <Button
              onPress={handleModalSupplyChainsCostsClose}
              colorScheme={'gray'}
              size={'sm'}
              borderRadius={5}
              margin={1}
              flex={1}
            >
              Close
            </Button>
          </HStack>

        </Modal.Content>
      </Modal>

      <Modal isOpen={clearModalVisible} onClose={handleClearModalClose} useRNModal>
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
            margin={5}
          >
            <Box flex={1}>
              <Text color={'amber.600'} bold>
                Warning!
              </Text>
              <Text color={'amber.600'}>
                Are you sure you want to clear?
              </Text>
            </Box>
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
      </Modal>



    </>
  );
};

const getEmailOfCurrentUser = () => {
  const user = projectControlAuth.currentUser;
  if (user) {
    const email = user.email;
    return email;
  } else {
    console.log('No user is currently authenticated');
    return null;
  }
};

// const Drawer = createDrawerNavigator();


const storage = getStorage(projectExtensionFirebase);

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
      <Box
        position="absolute"
        top={0}
        right={0}
        bg="error.500"
        borderRadius={3}
        alignItems="center"
        justifyContent="center"
        display={isAddPhotoVisible ? 'none' : 'block'}
      >
        <Pressable onPress={handleModalDeleteOpen} flex={1}>
          <Icon as={<Ionicons name="trash-sharp" />} size={5} color="white" cursor={'pointer'} />
        </Pressable>
      </Box>

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
            <Box flex={1}>
              <Text color={'danger.500'} bold>
                Alert!
              </Text>
              <Text color={'danger.500'}>
                Are you sure you want to clear <Text color={'danger.500'} bold>{selectedImages.length} </Text>selected image(s)?
              </Text>
            </Box>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} bgColor={'error.100'}>
            <HStack space={5} flex={1}>
              <Button onPress={handleModalDeleteClose} colorScheme={'warmGray'} flex={1} size={'sm'} borderRadius={5}>
                No
              </Button>
              <Button onPress={handleClearImages} flex={1} size={'sm'} colorScheme={'error'} borderRadius={5}>
                Clear Images
              </Button>
            </HStack>
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
        console.log('User cancelled image picker');
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      } else if (!response.assets || response.assets.length === 0) {
        console.log('No images selected.');
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
      console.log('ImagePicker Error: ', error);
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
        console.log('User cancelled image picker');
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      } else if (!response.assets || response.assets.length === 0) {
        console.log('No images selected.');
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
      console.log('ImagePicker Error: ', error);
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

              <Icon display={isAddPhotoVisible ? 'block' : 'none'} onPress={handleImageSelection} as={<MaterialIcons name="add-photo-alternate" />} size={100} ml="2" color="white" />


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
                    <Icon display={addAnotherImages ? 'block' : 'none'} onPress={handleImageAddToSelection} as={<Entypo name="plus" />} ml={'2'} size={50} color="white" />
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

      <Modal isOpen={imageModalVisible} onClose={() => setImageModalVisible(false)} size={'100%'}>

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

      <Modal isOpen={isFileSizeLimitModal} onClose={() => setIsFileSizeLimitModal(false)} >
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


const SuccessFailModal = ({ isSuccessOpen, isFailedOpen, handleFailModalClose, inputStockIDNumber, handleSuccessModalClose }) => {
  const okSuccessButtonRef = useRef(null);
  const okFailButtonRef = useRef(null);

  return (
    <><Modal isOpen={isSuccessOpen} onClose={handleSuccessModalClose} initialFocusRef={okSuccessButtonRef} finalFocusRef={inputStockIDNumber}>
      <Modal.Content bgColor={'green.100'}>
        <Modal.Header borderBottomWidth={0} bgColor={'green.100'}>
          <Text color={'#102A43'} bold>
            Success!
          </Text>
        </Modal.Header>
        <Modal.Body
          bgColor={'green.200'}
          borderLeftWidth={4}
          borderLeftColor={'green.600'}
          margin={5}
        >
          <Box flex={1}>
            <Text color={'green.600'} bold>
              Success!
            </Text>
            <Text color={'green.600'}>
              Stock ID Exist!
            </Text>
          </Box>
        </Modal.Body>
        <Modal.Footer borderTopWidth={0} bgColor={'green.100'}>
          <HStack space={5} flex={1}>
            <Button ref={okSuccessButtonRef} colorScheme={'primary'} flex="1" onPress={handleSuccessModalClose} _text={{ color: 'white' }}>
              Ok
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>

      <Modal isOpen={isFailedOpen} onClose={handleFailModalClose} initialFocusRef={okFailButtonRef} finalFocusRef={inputStockIDNumber} >
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
                Stock ID Do Not Exist!
              </Text>
            </Box>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} bgColor={'danger.100'}>
            <HStack space={5} flex={1}>
              <Button ref={okFailButtonRef} colorScheme={'primary'} flex="1" onPress={handleFailModalClose} _text={{ color: 'white' }}>
                Ok
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal></>
  );
}


const StockIDAndMakeAndModel = ({
  selectStockStatus,
  handleSetBordersWhite,
  inputFobUsd,
  handleClearIfError,
  monthNumbers,
  steeringData,
  selectPort,
  selectSales,
  selectBuyer,
  inputRefNum,
  inputChassis,
  inputModelCode,
  inputEngineCode,
  inputEngineDis,
  selectSteering,
  inputMileage,
  selectTransmission,
  selectExteriorColor,
  inputNumOfSeats,
  inputDoors,
  inputPurchasedPrice,
  selectFuel,
  inputDimensionLength,
  inputDimensionWidth,
  inputDimensionHeight,
  inputDimensionCubicMeters,
  selectDriveType,
  inputWeight,
  selectBodyType,
  inputCarName,
  inputCarDesc,
  inputFobJpy,
  selectRegYear,
  selectRegMonth,
  setRefNumFromSelects,
  inputStockIDNumber,
  stockIDNumError,
  selectMakeForModelRef,
  textAreaAddModel,
  selectMakeForAddModelRef,
  handleAddMakeTextChange,
  textAreaAddMake,
  makeError,
  modelError,
  selectMakeBoxRef,
  selectMakeRef,
  selectModelRef,
  selectModelBoxRef,
  setCarNameFromSelects,
  setCarNameFromSelectsModel,
  inputCarNotes,
  inputCarMemo,
  purchasedPriceError,
  handleInputPurchasedPriceChange }) => {


  const dispatch = useDispatch();

  // const deleteImageVisible = useSelector((state) => state.deleteImageVisible);
  // const isAddPhotoVisible = useSelector((state) => state.isAddPhotoVisible);
  const makeData = useSelector((state) => state.makeData);
  const stockStatusData = useSelector((state) => state.stockStatusData);
  const portData = useSelector((state) => state.portData);
  // const isLoading = useSelector((state) => state.isLoading);
  const transmissionData = useSelector((state) => state.transmissionData);
  const fuelData = useSelector((state) => state.fuelData);
  const buyerData = useSelector((state) => state.buyerData);
  const salesData = useSelector((state) => state.salesData);
  const driveTypeData = useSelector((state) => state.driveTypeData);
  const bodyTypeData = useSelector((state) => state.bodyTypeData);
  const exteriorColorData = useSelector((state) => state.exteriorColorData);
  const jpyToUsd = useSelector((state) => state.jpyToUsd);
  // const usdToJpy = useSelector((state) => state.usdToJpy);


  const [modelData, setModelData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isFailedOpen, setIsFailedOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [model, setModel] = useState('');
  const [key, setKey] = useState(0);
  // useEffect(() => {

  //   selectModelRef.current.selectIndex(modelData.indexOf(model));
  //   console.log(model);
  // }, [modelData]);

  // const exportFunction = () => {
  //   const clearModelData = () =>{
  //       setModelData([]);
  //   };

  //   return clearModelData;
  // }

  const handleInputFobJpyChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    // console.log(globalJpyToUsd);
    // Check if the numeric value starts with 0
    if (numericValue.startsWith('0')) {
      // Handle the case when the value starts with 0
      inputFobUsd.current.setNativeProps({ text: '' });
      return;
    }

    // Truncate the numeric value to a maximum of 9 digits
    const truncatedValue = numericValue.slice(0, 9);

    const formattedValue = truncatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (formattedValue !== '') {
      const multipliedValue = parseFloat(truncatedValue) * jpyToUsd;

      if (!isNaN(multipliedValue)) {
        const formattedMultipliedValue = multipliedValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        inputFobJpy.current.value = formattedValue;
        inputFobUsd.current.setNativeProps({ text: formattedMultipliedValue });
      } else {
        // Handle the case when the multipliedValue is NaN
        inputFobJpy.current.value = formattedValue;
        inputFobUsd.current.setNativeProps({ text: '' });
      }
    } else {
      // Handle the case when formattedValue is empty
      inputFobJpy.current.value = '';
      inputFobUsd.current.setNativeProps({ text: '' });
    }
  };


  const getImages = useCallback(async (folderName) => {
    // const dispatch = useDispatch();
    dispatch(setLoadingModalVisible(true));
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
        dispatch(setDeleteImageVisible(false));
        dispatch(setSelectedImages(urls));
        dispatch(setIsAddPhotoVisible(false));
        dispatch(setAddAnotherImages(false));
        globalSelectedImages = urls;

      }

      else {
        dispatch(setDeleteImageVisible(true));
        dispatch(setIsAddPhotoVisible(true));
        dispatch(setAddAnotherImages(false));
        dispatch(setSelectedImages([]));
        dispatch(setDeleteImageVisible(true));
        globalSelectedImages = [];
      }


      console.log(urls);

    } catch (error) {
      // Handle any errors that may occur during the Firebase operations
      console.error('Error getting image URLs:', error);
    }
  }, []);


  const handleSearchPress = useCallback(async () => {


    if (inputStockIDNumber.current?.value !== '') {
      dispatch(setLoadingModalVisible(true));
      setIsSearchLoading(true);
      setIsSuccessOpen(false);
      setIsFailedOpen(false);

      const q = query(collection(projectExtensionFirestore, 'VehicleProducts'), where('stockID', '==', inputStockIDNumber.current?.value));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No documents found');
        // setIsLoading(false);
        dispatch(setDeleteImageVisible(true));
        setIsSearchLoading(false);
        setIsFailedOpen(true);
        dispatch(setIsAddPhotoVisible(true));
        dispatch(setAddAnotherImages(false));
        dispatch(setSelectedImages([]));
        globalSelectedImages = [];
        dispatch(setLoadingModalVisible(false));

      }


      else {

        // dispatch(setSelectedImages([]));
        // globalSelectedImages = [];

        querySnapshot.forEach(async (item) => {
          const data = item.data();
          selectModelRef.current.reset();
          // console.log(item.id, " => ", item.data().make);
          setIsSearchLoading(false);
          // setIsSuccessOpen(true);

          // fetchModelData();
          // setModel(data.model);

          // console.log(portData);    
          async function fetchDataAndSelectIndex() {
            try {
              const collectionRef = doc(projectExtensionFirestore, 'Model', data.make);
              const docSnapshot = await getDoc(collectionRef);
              if (docSnapshot.exists()) {
                selectModelRef.current.selectIndex(globalModelDataVariable.indexOf(modelVariable.text));
              }
            } catch (error) {
              console.error('Error fetching models data from Firebase: ', error);
            }
          }

          try {
            const collectionRef = doc(projectExtensionFirestore, 'Model', data.make);
            const docSnapshot = await getDoc(collectionRef);
            if (docSnapshot.exists()) {
              const modelsDataFromFirebase = docSnapshot.data().model;
              setModelData(modelsDataFromFirebase);
              globalModelDataVariable = modelsDataFromFirebase;
            }
          } catch (error) {
            console.error('Error fetching models data from Firebase: ', error);
          }

          handleSetBordersWhite();
          fetchDataAndSelectIndex();
          selectStockStatus.current.selectIndex(stockStatusData.indexOf(data.stockStatus));
          selectMakeRef.current.selectIndex(makeData.indexOf(data.make));
          // selectRegYear.current.selectIndex(globalRegYearDataVariable.indexOf(data.regYear));
          selectRegYear.current.selectIndex(globalRegYearDataVariable.indexOf(parseInt(data.regYear, 10)));
          selectRegMonth.current.selectIndex(monthNumbers.indexOf(data.regMonth));
          selectPort.current.selectIndex(portData.findIndex(item => item.id === data.portID));
          selectSales.current.selectIndex(salesData.findIndex(item => item.id === data.salesID));
          selectBuyer.current.selectIndex(buyerData.findIndex(item => item.id === data.buyerID));
          inputRefNum.current.setNativeProps({ text: data.referenceNumber || '' });
          inputChassis.current.setNativeProps({ text: data.chassisNumber || '' });
          inputModelCode.current.setNativeProps({ text: data.modelCode || '' });
          inputEngineCode.current.setNativeProps({ text: data.engineCode || '' });
          inputEngineDis.current.setNativeProps({ text: data.engineDisplacement ? data.engineDisplacement.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' });
          selectSteering.current.selectIndex(steeringData.indexOf(data.steering));
          inputMileage.current.setNativeProps({ text: data.mileage ? data.mileage.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' });
          selectTransmission.current.selectIndex(transmissionData.indexOf(data.transmission));
          selectExteriorColor.current.selectIndex(exteriorColorData.indexOf(data.exteriorColor));
          inputNumOfSeats.current.setNativeProps({ text: data.numberOfSeats || '' });
          inputDoors.current.setNativeProps({ text: data.doors || '' });
          inputPurchasedPrice.current.setNativeProps({ text: data.purchasedPrice ? data.purchasedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",").toString() : '' });
          selectFuel.current.selectIndex(fuelData.indexOf(data.fuel));
          inputDimensionLength.current.setNativeProps({ text: data.dimensionLength ? data.dimensionLength.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' });
          inputDimensionWidth.current.setNativeProps({ text: data.dimensionWidth ? data.dimensionWidth.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' });
          inputDimensionHeight.current.setNativeProps({ text: data.dimensionHeight ? data.dimensionHeight.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' });
          inputDimensionCubicMeters.current.setNativeProps({ text: data.dimensionCubicMeters || '' });
          selectDriveType.current.selectIndex(driveTypeData.indexOf(data.driveType));
          inputWeight.current.setNativeProps({ text: data.weight ? data.weight.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' });
          // selectBodyType.current.selectIndex(bodyTypeData.indexOf(data.bodyType));
          selectBodyType.current.selectIndex(bodyTypeData.findIndex(item => item.toLowerCase() === data.bodyType.toLowerCase()));
          inputCarName.current.setNativeProps({ text: data.carName || '' });
          inputCarDesc.current.setNativeProps({ text: data.carDescription || '' });
          inputFobJpy.current.setNativeProps({ text: data.fobPrice ? data.fobPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' });
          globalFobPrice = data.fobPrice ? data.fobPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
          handleInputFobJpyChange(data.fobPrice ? data.fobPrice : "0");
          // selectMakeRef.current.selectIndex(makeData.indexOf(data.make));
          // selectRegYear.current.selectIndex(globalRegYearDataVariable.indexOf(data.regYear));
          // selectRegMonth.current.selectIndex(monthNumbers.indexOf(data.regMonth));
          // selectPort.current.selectIndex(portData.findIndex(item => item.name === data.port));
          // selectSales.current.selectIndex(salesData.findIndex(item => item.name === data.sales));
          // selectBuyer.current.selectIndex(buyerData.findIndex(item => item.name === data.buyer));
          // inputRefNum.current.setNativeProps({ text: data.referenceNumber });
          // inputChassis.current.setNativeProps({ text: data.chassisNumber });
          // inputModelCode.current.setNativeProps({ text: data.modelCode });
          // inputEngineCode.current.setNativeProps({ text: data.engineCode });
          // inputEngineDis.current.setNativeProps({ text: data.engineDisplacement.replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
          // selectSteering.current.selectIndex(steeringData.indexOf(data.steering));
          // inputMileage.current.setNativeProps({ text: data.mileage.replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
          // selectTransmission.current.selectIndex(transmissionData.indexOf(data.transmission));
          // selectExteriorColor.current.selectIndex(exteriorColorData.indexOf(data.exteriorColor));
          // inputNumOfSeats.current.setNativeProps({ text: data.numberOfSeats });
          // inputDoors.current.setNativeProps({ text: data.doors });
          // selectFuel.current.selectIndex(fuelData.indexOf(data.fuel));
          // inputDimensionLength.current.setNativeProps({ text: data.dimensionLength.replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
          // inputDimensionWidth.current.setNativeProps({ text: data.dimensionWidth.replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
          // inputDimensionHeight.current.setNativeProps({ text: data.dimensionHeight.replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
          // inputDimensionCubicMeters.current.setNativeProps({ text: data.dimensionCubicMeters });
          // selectDriveType.current.selectIndex(driveTypeData.indexOf(data.driveType));
          // inputWeight.current.setNativeProps({ text: data.weight ? data.weight.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0",});          
          // selectBodyType.current.selectIndex(bodyTypeData.indexOf(data.bodyType));
          // inputCarName.current.setNativeProps({ text: data.carName });
          // inputCarDesc.current.setNativeProps({ text: data.carDescription });
          // inputFobJpy.current.setNativeProps({ text: data.fobPrice ? data.fobPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0",});
          // handleInputFobJpyChange(data.fobPrice);

          if (data.notes == undefined) {
            inputCarNotes.current.setNativeProps({ text: '' });
          }
          else {
            inputCarNotes.current.setNativeProps({ text: data.notes });
          }

          if (data.memo == undefined) {
            inputCarMemo.current.setNativeProps({ text: '' });

          }
          else {
            inputCarMemo.current.setNativeProps({ text: data.memo });

          }

          featuresState.SafetySystemAnBrSy = data.SafetySystemAnBrSy;
          featuresState.SafetySystemDrAi = data.SafetySystemDrAi;
          featuresState.SafetySystemPaAi = data.SafetySystemPaAi;
          featuresState.SafetySystemSiAi = data.SafetySystemSiAi;
          featuresState.ComfortAiCoFr = data.ComfortAiCoFr;
          featuresState.ComfortAiCoRe = data.ComfortAiCoRe;
          featuresState.ComfortAMFMRa = data.ComfortAMFMRa;
          featuresState.ComfortAMFMSt = data.ComfortAMFMSt;
          featuresState.ComfortCDPl = data.ComfortCDPl;
          featuresState.ComfortCDCh = data.ComfortCDCh;
          featuresState.ComfortCrSpCo = data.ComfortCrSpCo;
          featuresState.ComfortDiSp = data.ComfortDiSp;
          featuresState.ComfortDVDPl = data.ComfortDVDPl;
          featuresState.ComfortHDD = data.ComfortHDD;
          featuresState.ComfortNaSyGPS = data.ComfortNaSyGPS;
          featuresState.ComfortPoSt = data.ComfortPoSt;
          featuresState.ComfortPrAuSy = data.ComfortPrAuSy;
          featuresState.ComfortReKeSy = data.ComfortReKeSy;
          featuresState.ComfortTiStWh = data.ComfortTiStWh;
          featuresState.InteriorLeSe = data.InteriorLeSe;
          featuresState.InteriorPoDoLo = data.InteriorPoDoLo;
          featuresState.InteriorPoMi = data.InteriorPoMi;
          featuresState.InteriorPoSe = data.InteriorPoSe;
          featuresState.InteriorPoWi = data.InteriorPoWi;
          featuresState.InteriorReWiDe = data.InteriorReWiDe;
          featuresState.InteriorReWiWi = data.InteriorReWiWi;
          featuresState.InteriorThRoSe = data.InteriorThRoSe;
          featuresState.InteriorTiGl = data.InteriorTiGl;
          featuresState.ExteriorAlWh = data.ExteriorAlWh;
          featuresState.ExteriorPoSlDo = data.ExteriorPoSlDo;
          featuresState.ExteriorSuRo = data.ExteriorSuRo;
          featuresState.SellingPointsCuWh = data.SellingPointsCuWh;
          featuresState.SellingPointsFuLo = data.SellingPointsFuLo;
          featuresState.SellingPointsMaHiAv = data.SellingPointsMaHiAv;
          featuresState.SellingPointsBrNeTi = data.SellingPointsBrNeTi;
          featuresState.SellingPointsNoAcHi = data.SellingPointsNoAcHi;
          featuresState.SellingPointsNoSmPrOw = data.SellingPointsNoSmPrOw;
          featuresState.SellingPointsOnOwHi = data.SellingPointsOnOwHi;
          featuresState.SellingPointsPeRaTi = data.SellingPointsPeRaTi;
          featuresState.SellingPointsReBo = data.SellingPointsReBo;
          featuresState.SellingPointsTuEn = data.SellingPointsTuEn;
          featuresState.SellingPointsUpAuSy = data.SellingPointsUpAuSy;

          resetKey++;

          stockStatusVariable.text = data.stockStatus ? data.stockStatus : "";
          makeVariable.text = data.make ? data.make : "";
          modelVariable.text = data.model ? data.model : "";
          regYearVariable.text = data.regYear ? data.regYear : "";
          regMonthVariable.text = data.regMonth ? data.regMonth : "";
          portVariable.text = data.port ? data.port : "";
          salesVariable.text = data.sales ? data.sales : "";
          buyerVariable.text = data.buyer ? data.buyer : "";
          portVariable.id = data.portID ? data.portID : "";
          salesVariable.id = data.salesID ? data.salesID : "";
          buyerVariable.id = data.buyerID ? data.buyerID : "";
          referenceNumberVariable.text = data.referenceNumber ? data.referenceNumber : "";
          globalVehicleFolderName = data.stockID ? data.stockID : "";
          steeringVariable.text = data.steering ? data.steering : "";
          transmissionVariable.text = data.transmission ? data.transmission : "";
          exteriorColorVariable.text = data.exteriorColor ? data.exteriorColor : "";
          fuelVariable.text = data.fuel ? data.fuel : "";
          driveTypeVariable.text = data.driveType ? data.driveType : "";
          bodyTypeVariable.text = data.bodyType ? data.bodyType : "";
          stockStatusVariable.text = data.stockStatus ? data.stockStatus : "";
          globalSupplyChainCostsData = data.supplyChainsCostsData ? data.supplyChainsCostsData : [];
          dispatch(setSupplyChainsCostsData(data.supplyChainsCostsData ? data.supplyChainsCostsData : []));

          await getImages(globalVehicleFolderName);

          dispatch(setLoadingModalVisible(false));

          // const unsubscribe = onSnapshot(doc(collection(projectExtensionFirestore, 'Model'), makeVariable.text), (snapshot) => {
          //   setModelData(snapshot.data()?.model || []);
          //   selectModelRef.current.selectIndex(modelData.indexOf(data.model));

          //   return () => unsubscribe();
          // });


        });
      }

    }



  }, []);;


  // useEffect(() => {

  //   if (isFailedOpen == false) {
  //     handleClearIfError();
  //   }


  // }, [isFailedOpen])
  const handleFailModalClose = useCallback(() => {
    setIsFailedOpen(false);

    handleClearIfError();


  }, []);

  const handleSuccessModalClose = useCallback(() => {
    setIsSuccessOpen(false);

    selectModelRef.current.selectIndex(globalModelDataVariable.indexOf(modelVariable.text));
    // console.log(globalModelDataVariable.indexOf(makeVariable.text));


  }, []);

  const handleModelChange = useCallback(() => {
    // console.log('Selected make:', value);
    setCarNameFromSelectsModel();

  }, []);


  const handleMakeChange = useCallback(async (item) => {
    setCarNameFromSelects();
    // dispatch(setSelectedMake(item));
    // fetchModelData();
    //  dispatch(setIsLoading(true));
    try {
      if (makeVariable.text !== '') {

        try {

          const collectionRef = doc(projectExtensionFirestore, 'Model', item);

          const docSnapshot = await getDoc(collectionRef);
          if (docSnapshot.exists()) {
            const modelsDataFromFirebase = docSnapshot.data().model;
            setModelData(modelsDataFromFirebase);
            globalModelDataVariable = modelsDataFromFirebase;
            // console.log(globalModelVariable);

            // modelKey++;
            // console.log(modelKey);
            // dispatch(setIsLoading(false));
          }
        } catch (error) {
          console.error('Error fetching models data from Firebase: ', error);
        }

      }

      else {
        //  dispatch(setModelData([]));
      }
    } catch (error) {
      console.error('Error fetching models data from Firebase: ', error);
    }

  }, [projectExtensionFirestore, modelData, makeData]);

  const handleInputStockIDNumberChange = useCallback((text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    const truncatedValue = numericValue.slice(0, 10);
    inputStockIDNumber.current.value = truncatedValue;
    globalVehicleFolderName = truncatedValue;
    setRefNumFromSelects();
    // // Limit the numeric value to a maximum of 4 characters
    // const truncatedValue = numericValue.slice(5);

    // // Format the truncated numeric value with comma separator
    // const formattedValue = Number(truncatedValue).toLocaleString();

    // // Remove comma separator from the formatted value
    // const valueWithoutCommas = formattedValue.replace(/,/g, '');

    // inputStockIDNumber.current.value = valueWithoutCommas;
  }, []);

  const handleModelOnFocus = useCallback(() => {
    // console.log(globalModelVariable.length);
    const condition = makeVariable.text === '' && globalModelDataVariable.length > 0;

    if (condition) {
      globalModelDataVariable = [];
      setModelData([]);
    }


  }, []);

  return (
    <>
      <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
        <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Stock ID Number</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
        <Box bgColor={'white'} flex={1} borderColor={stockIDNumError} borderWidth={1}><Input onSubmitEditing={handleSearchPress} defaultValue="" ref={inputStockIDNumber} onChangeText={handleInputStockIDNumberChange} placeholder=" Stock ID Number"
          InputRightElement={
            <Button isLoading={isSearchLoading} isLoadingText="Search" size={'xs'} colorScheme={'primary'}
              leftIcon={<Icon as={<MaterialIcons name="search" />} size={5} color="white" />}
              onPress={() => {
                handleSearchPress()
                selectModelRef.current.selectIndex(globalModelDataVariable.indexOf(modelVariable.text));
              }}>Search</Button>
          }
        />
        </Box>
        <SuccessFailModal inputStockIDNumber={inputStockIDNumber} isSuccessOpen={isSuccessOpen} setIsSuccessOpen={setIsSuccessOpen} isFailedOpen={isFailedOpen} setIsFailedOpen={setIsFailedOpen} handleSuccessModalClose={handleSuccessModalClose} handleFailModalClose={handleFailModalClose} />



      </Box>

      <Box flexDir={'row'} borderColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'} >
        <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Purchase Price</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
        <Box bgColor={'white'} flex={1} borderColor={purchasedPriceError} borderWidth={1}>
          <Input keyboardType="numeric" flex={1} ref={inputPurchasedPrice} onChangeText={handleInputPurchasedPriceChange} bgColor={'white'} InputLeftElement={<Icon as={<FontAwesome name="yen" />} size={5} ml="2" color="muted.400" />} placeholder="Purchase Price" placeholderTextColor={'muted.400'} />
        </Box>
      </Box>

      <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'}>
        <Box bgColor={'#8096D7'} flex={1} flexDir={'row'}><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Make</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
          <SortAndAddModal docName='Make' handleAddTextChange={handleAddMakeTextChange} textAreaAdd={textAreaAddMake} title='Make' dataName={'make'} databaseInit={projectExtensionFirestore} headerText="Rearrange/Add Make" data={makeData} />
        </Box>

        <Box ref={selectMakeBoxRef} bgColor={'white'} flex={1} borderColor={makeError} borderWidth={1}>


          <SelectDropdown
            ref={selectMakeRef}
            buttonStyle={{
              flex: 1,
              width: '100%',
              backgroundColor: 'white',
              borderColor: '#E0E0E0',
              borderWidth: 1,
              borderRadius: 4,
              padding: 4,
            }}
            buttonTextStyle={{
              textAlign: 'left',
              color: '#424242',
              fontSize: 12,
            }}
            dropdownStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E0E0E0',
              borderWidth: 1,
              borderRadius: 4,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            rowStyle={{
              backgroundColor: '#FFFFFF',
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}
            rowTextStyle={{
              color: '#424242',
              fontSize: 16,
            }}
            data={makeData}
            onSelect={useCallback((selectedItem) => {
              makeVariable.text = selectedItem;
              selectModelRef.current.reset();
              modelVariable.text = '';
              handleMakeChange(selectedItem);


            }, [])}
            defaultButtonText="-- Choose Make --"
            buttonTextAfterSelection={(selectedItem) => {
              return selectedItem;
            }} SelectDropdown
            renderDropdownIcon={(isOpened) => {
              return (
                <Ionicons
                  name={isOpened ? 'chevron-up' : 'chevron-down'}
                  color={'#424242'}
                  size={18}
                />
              );
            }}
            rowTextForSelection={(item) => {
              return item;
            }}
            searchPlaceHolder="Search for Make"
            searchInputStyle={{ marginTop: 2, }}
            disableAutoScroll
            search />

        </Box>
      </Box>

      <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} >
        <Box bgColor={'#8096D7'} flex={1} flexDir={'row'}><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Model</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>

          <ModelSortAndAddModal
            selectMakeForAddModelRef={selectMakeForAddModelRef}
            selectMakeForModelRef={selectMakeForModelRef}
            textAreaAddModel={textAreaAddModel}
            makeData={makeData} />
        </Box>
        <Box ref={selectModelBoxRef} bgColor={'white'} flex={1} borderColor={modelError} borderWidth={1}>


          <SelectDropdown

            onFocus={handleModelOnFocus}
            ref={selectModelRef}
            // disabled={makeVariable.text === '' ? true : false}
            // key={`make${key}`}
            buttonStyle={{
              flex: 1,
              width: '100%',
              backgroundColor: 'white',
              borderColor: '#E0E0E0',
              borderWidth: 1,
              borderRadius: 4,
              padding: 4,
            }}
            buttonTextStyle={{
              textAlign: 'left',
              color: '#424242',
              fontSize: 12,
            }}
            dropdownStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E0E0E0',
              borderWidth: 1,
              borderRadius: 4,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            rowStyle={{
              backgroundColor: '#FFFFFF',
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}
            rowTextStyle={{
              color: '#424242',
              fontSize: 16,
            }}
            // data={modelData.map((item) => item)}
            data={modelData}
            onSelect={useCallback((selectedItem) => {
              modelVariable.text = selectedItem;
              // console.log(modelVariable.text);


              handleModelChange()
            }, [])}
            defaultButtonText="-- Choose Model --"
            buttonTextAfterSelection={(selectedItem) => {
              return selectedItem;
            }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Ionicons
                  name={isOpened ? 'chevron-up' : 'chevron-down'}
                  color={'#424242'}
                  size={18}
                />
              );
            }}
            rowTextForSelection={(item) => {
              return item;
            }}
            searchPlaceHolder="Search for Model"
            searchInputStyle={{ marginTop: 2, width: '100%', }}
            disableAutoScroll
            search

          />
        </Box>
      </Box>
    </>
  );

};

const SupplyChainsCostsSortAndAddModal = ({ headerText, data, title, dataName, databaseInit, textAreaAdd, handleAddTextChange, docName, handleFirstModalOpen, handleFirstModalClose }) => {
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
    const year = moment(datetime).format('YYYY');
    const month = moment(datetime).format('MM');
    const monthWithDay = moment(datetime).format('MM/DD');
    const date = moment(datetime).format('YYYY/MM/DD');
    const day = moment(datetime).format('DD');
    const time = moment(datetime).format('HH:mm');
    const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

    try {
      await updateDoc(doc(collection(databaseInit, docName), docName), { [dataName]: modalData });
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
    handleFirstModalClose();
  }, [modalSortOpen, modalIsLoading]);

  const handleSortModalClose = useCallback(async () => {
    handleFirstModalOpen();
    setModalSortOpen(false);
    setModalIsLoading(false);

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
        const modalCollectionRef = collection(databaseInit, docName);
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
      <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1}>

        {!modalIsLoading ? (
          <TouchableOpacity focusable={false} onPress={handleSortModalOpen} >
            <Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" />
          </TouchableOpacity>
        ) : (
          <Spinner color="white" />
        )}


      </Box>

      <Modal
        isOpen={modalSortOpen}
        onClose={handleSortModalClose} useRNModal>
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
        useRNModal
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

const SortAndAddModal = ({ headerText, data, title, dataName, databaseInit, textAreaAdd, handleAddTextChange, docName }) => {
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
    const year = moment(datetime).format('YYYY');
    const month = moment(datetime).format('MM');
    const monthWithDay = moment(datetime).format('MM/DD');
    const date = moment(datetime).format('YYYY/MM/DD');
    const day = moment(datetime).format('DD');
    const time = moment(datetime).format('HH:mm');
    const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

    try {
      await updateDoc(doc(collection(databaseInit, docName), docName), { [dataName]: modalData });
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
  }, [modalSortOpen, modalIsLoading]);

  const handleSortModalClose = useCallback(async () => {
    setModalSortOpen(false);
    setModalIsLoading(false);
  }, [modalSortOpen, modalIsLoading]);

  // const handleAddTextChange = () => {
  //   const newText = textAreaAdd.current?.value?.toUpperCase();
  //   textAreaAdd.current?.setNativeProps({ text: newText });
  // };


  const handleModalAddOpen = useCallback(() => {
    setModalAddOpen(true);
    handleSortModalClose();
    setModalIsLoading(true);

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
        const modalCollectionRef = collection(databaseInit, docName);
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
      <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1}>

        {!modalIsLoading ? (
          <TouchableOpacity focusable={false} onPress={handleSortModalOpen} >
            <Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" />
          </TouchableOpacity>
        ) : (
          <Spinner color="white" />
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


const PSBSortAndAddModal = ({ headerText, data, title, dataName, databaseInit, textAreaAddCode, textAreaAdd, handleAddTextChange, handleAddCodeTextChange, docName }) => {
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
    const year = moment(datetime).format('YYYY');
    const month = moment(datetime).format('MM');
    const monthWithDay = moment(datetime).format('MM/DD');
    const date = moment(datetime).format('YYYY/MM/DD');
    const day = moment(datetime).format('DD');
    const time = moment(datetime).format('HH:mm');
    const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

    try {
      await updateDoc(doc(collection(databaseInit, docName), docName), { [dataName]: modalData });
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
  }, []);

  const handleSortModalClose = useCallback(async () => {
    setModalSortOpen(false);
    setModalIsLoading(false);
  }, []);

  // const handleAddTextChange = () => {
  //   const newText = textAreaAdd.current?.value?.toUpperCase();
  //   textAreaAdd.current?.setNativeProps({ text: newText });
  // };


  const handleModalAddOpen = useCallback(() => {
    setModalAddOpen(true);
    handleSortModalClose();
    setModalIsLoading(true);
    textAreaAdd.current.clear();
    textAreaAddCode.current.clear();
  }, [])

  const handleModalAddClose = useCallback(() => {
    setModalAddOpen(false);
    handleSortModalOpen();

  }, [])

  const handleModalAddSuccessClose = useCallback(() => {
    setModalAddSuccess(false);
    // setIsLoading(false);
    handleSortModalOpen();
  }, [])

  const handleModalAddSuccessOpen = useCallback(() => {
    setModalAddSuccess(true);
    handleSortModalClose();
    setModalAddOpen(false);
    setModalIsLoading(true);

  }, [])

  const handleModalSaveOpen = useCallback(() => {
    setModalSave(true);
    setModalSortOpen(false);
    setModalIsLoading(true);
  }, [])

  const handleModalSaveClose = useCallback(() => {
    setModalSave(false);
    setModalSortOpen(true);
  }, []);

  const handleAddSubmit = async () => {

    const data = textAreaAdd.current?.value;
    const dataCode = textAreaAddCode.current?.value;
    const dataArray = data.split('\n').map((item) => item.trim());
    const dataCodeArray = dataCode.split('\n').map((item) => item.trim());

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


    if (data !== '' && dataCode !== '') {
      setModalSaveLoading(true);
      try {
        const modalCollectionRef = collection(databaseInit, docName);
        const modalDocRef = doc(modalCollectionRef, docName);

        const dataToUpdate = dataArray.map((data, index) => ({
          id: dataCodeArray[index],
          name: data,
        }));

        const updateObject = {};
        updateObject[dataName] = arrayUnion(...dataToUpdate);

        await setDoc(modalDocRef, updateObject, { merge: true });
        // const updateData = {
        //   [dataName]: arrayUnion({ id: arrayUnion(...dataCodeArray), name: arrayUnion(...dataArray) })
        // };

        // await setDoc(modalDocRef, updateData, { merge: true });

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
      <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1}>

        {!modalIsLoading ? (
          <TouchableOpacity onPress={handleSortModalOpen} focusable={false}>
            <Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" />
          </TouchableOpacity>
        ) : (
          <Spinner color="white" />
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
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, drag }) => (

                    <Box flex={1} bgColor={'rgba(16,42,67, 0.5)'} borderBottomWidth={1} borderBottomColor={'warmGray.400'} flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                      <Pressable onPress={() => handleDeleteItemPress(item)}><Icon as={<AntDesign name="minuscircle" />} size={4} color="#102A43" /></Pressable>
                      <Text flex={1} textAlign={'center'} color={'white'}>{item.name}</Text>
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
        initialFocusRef={textAreaAddCode}
        size={'lg'}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <Text color={'#102A43'} bold>Add {title}</Text>
          </Modal.Header>
          {/* <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1} w={'full'}> */}
          <HStack space={5} flex={1} margin={2}>
            <VStack space={1} flex={1}>
              <Text textAlign={'center'}>Code</Text>
              <TextArea
                flex={2}
                textAlign={'center'}
                w={'full'}
                ref={textAreaAddCode}
                multiline
                onChangeText={handleAddCodeTextChange}
                totalLines={8}
                placeholder="Enter your data, separated by new lines"
              />
            </VStack>
            <VStack space={1} flex={1}>
              <Text textAlign={'center'}>Name</Text>
              <TextArea
                flex={2}
                textAlign={'center'}
                w={'full'}
                ref={textAreaAdd}
                multiline
                onChangeText={handleAddTextChange}
                totalLines={8}
                placeholder="Enter your data, separated by new lines"
              />
            </VStack>
          </HStack>
          {/* </Modal.Body> */}
          <Modal.Footer borderTopWidth={0}>
            <HStack space={5} flex={1}>
              <Button
                onPress={handleModalAddClose}
                colorScheme={'muted'}
                flex={1}
                size={'sm'}
                borderRadius={5}>
                Close
              </Button>
              <Button
                onPress={handleAddSubmit}
                isLoading={modalSaveLoading ? true : false}
                flex={1}
                size={'sm'}
                borderRadius={5}>
                Add
              </Button>
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



const ModelSortAndAddModal = ({ selectMakeForAddModelRef, selectMakeForModelRef, textAreaAddModel, makeData }) => {

  const [modalAddModel, setModalAddModel] = useState(false);
  const [modalSaveModel, setModalSaveModel] = useState(false);
  const [modalModel, setModalModel] = useState(false);
  const [modalAddModelSuccess, setModalAddModelSuccess] = useState(false);
  const [keySelectMakeForModel, setKeySelectMakeForModel] = useState(1);
  const [keySelectMakeForAddModel, setKeySelectMakeForAddModel] = useState(1);
  const [modelSortData, setModelSortData] = useState([]);
  const [isAddModelDisabled, setIsAddModelDisabled] = useState(false);
  const [modalSaveModelLoading, setModalSaveModelLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const [modalSaveLoading, setModalSaveLoading] = useState(false);

  const fetchModelSortData = async () => {

    if (selectMakeForModelRef.current?.value !== '__NativebasePlaceholder__') {

      const modelSortDocRef = doc(collection(projectExtensionFirestore, 'Model'), selectMakeForModelRef.current?.value);
      const modelSortDocSnap = await getDoc(modelSortDocRef);
      if (modelSortDocSnap.exists()) {
        setModelSortData(modelSortDocSnap.data()?.model || []);

      }
      else {
        setModelSortData([]);
      }

    }


  };

  // useEffect(() => {

  //   if (selectMakeForModelRef.current?.value !== '__NativebasePlaceholder__') {

  //     const unsubscribe = onSnapshot(doc(collection(projectExtensionFirestore, 'Model'), selectMakeForModelRef.current?.value), (snapshot) => {
  //       setModelSortData(snapshot.data()?.model || []);
  //       return () => unsubscribe();
  //     });

  //   }

  // }, []);

  const handleDeleteModelPress = useCallback(
    (item) => {
      setModelSortData((prevModelData) => {
        const updatedModelData = prevModelData.filter((model) => model !== item);
        return updatedModelData;
      });
    },
    []
  );

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

  const handleSaveModel = useCallback(async () => {
    setModalSaveModelLoading(true);
    console.log(selectMakeForModelRef.current?.value);

    if (selectMakeForModelRef.current?.value !== '__NativebasePlaceholder__') {
      try {
        await updateDoc(doc(collection(projectExtensionFirestore, 'Model'), selectMakeForModelRef.current?.value), { model: modelSortData });
        setModalSaveModelLoading(false);

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

        const logData = {
          message: `Model updated: "${nameVariable.text}" updated the Model(s) for "${selectMakeForModelRef.current?.value}"`,
          timestamp: formattedTime,
          colorScheme: true,
          keywords: [
            formattedTime.toLowerCase(),
            `Model updated: "${nameVariable.text}" updated the Model(s) for "${selectMakeForModelRef.current?.value}"`.toLowerCase(),
            'Model Update'.toLowerCase(),
            'Model'.toLowerCase(),
            'Update'.toLowerCase(),
            selectMakeForModelRef.current.value.toLowerCase(),
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

        handleModalSaveModelClose();
      } catch (error) {
        console.error(error);
        setModalSaveModelLoading(false);
        handleModalSaveModelClose();
      }

    }
    else {
      setModalSaveModelLoading(false);
    }




  }, [projectExtensionFirestore, modelSortData]);

  const handleAddModelTextChange = () => {
    const newText = textAreaAddModel.current?.value?.toUpperCase();
    textAreaAddModel.current?.setNativeProps({ text: newText });

  };

  const handleMakeForModelChange = useCallback(() => {
    makeForAddModelVariable.text = selectMakeForAddModelRef.current?.value;
    fetchModelSortData();

    // console.log(selectMakeForModelRef.current?.value);
  }, []);

  const handleMakeForAddModelChange = useCallback(() => {
    setIsAddModelDisabled(false);

  }, []);


  const handleModalModelOpen = useCallback(() => {
    setModalIsLoading(true);
    setModalModel(true);
    fetchModelSortData();
    setIsLoading(true);
  }, []);

  const handleModalModelClose = useCallback(() => {
    setModalIsLoading(false);

    setModalModel(false);
    setIsLoading(false);
    setKeySelectMakeForModel(prevKey => prevKey + 1);
    setModelSortData([]);
  }, []);

  const handleModalAddModelOpen = useCallback(() => {
    setModalIsLoading(true);
    setModalAddModel(true);
    // handleModalModelClose();
    setModalModel(false);
    setIsLoading(false);
  }, []);

  const handleModalAddModelClose = useCallback(() => {
    handleModalModelOpen();
    setModalAddModel(false);
    textAreaAddModel.current.clear();
    setIsAddModelDisabled(true);
    setIsLoading(false);
    setKeySelectMakeForAddModel(prevKey => prevKey + 1);

  }, []);

  const handleModalAddModelSuccessOpen = useCallback(() => {
    setModalIsLoading(true);
    setModalAddModel(false);
    setModalModel(false);
    textAreaAddModel.current.clear();
    setModalAddModelSuccess(true);


  }, []);

  const handleModalAddModelSuccessClose = useCallback(() => {
    setModalAddModelSuccess(false);
    handleModalModelOpen();
    setIsLoading(false);
  }, []);

  const handleModalSaveModelOpen = useCallback(() => {
    setModalIsLoading(true);

    if (selectMakeForModelRef.current?.value !== '__NativebasePlaceholder__') {
      setModalSaveModel(true);
      // handleModalModelClose();
      setModalModel(false);
      setIsLoading(false);
    }


  }, []);


  const handleModalSaveModelClose = useCallback(() => {
    setModalSaveModel(false);
    handleModalModelOpen();
    setIsLoading(false);
  }, []);

  const handleAddModelSubmit = async () => {
    const data = textAreaAddModel.current?.value;
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

        const makeCollectionRef = collection(projectExtensionFirestore, 'Model');
        const makeDocRef = doc(makeCollectionRef, selectMakeForAddModelRef.current?.value);
        await setDoc(makeDocRef, { model: arrayUnion(...dataArray) }, { merge: true });

        const logData = {
          message: `Model Added: "${nameVariable.text}" added Model(s) for "${selectMakeForAddModelRef.current?.value}" .`,
          timestamp: formattedTime,
          colorScheme: true,
          keywords: [
            formattedTime.toLowerCase(),
            `Model Added: "${nameVariable.text}" added Model(s) for "${selectMakeForAddModelRef.current?.value}" .`.toLowerCase(),
            'Model Added'.toLowerCase(),
            'Model'.toLowerCase(),
            'Added'.toLowerCase(),
            selectMakeForAddModelRef.current.value.toLowerCase(),
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
        setModalSaveLoading(false);
        addLogToCollection(logData);

        handleModalAddModelSuccessOpen();

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

      <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1}>

        {!modalIsLoading ? (
          <TouchableOpacity focusable={false} onPress={handleModalModelOpen}>
            <Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" />
          </TouchableOpacity>
        ) :
          (<Spinner color="white" />)
        }

      </Box>

      <Modal
        isOpen={modalModel}
        onClose={handleModalModelClose} >
        <Modal.Content >
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <Text color={'#102A43'} bold>Rearrange/Add Model</Text>
          </Modal.Header>
          <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1} >
            <Box w={'full'} flexDir={'column'} height={'f'}>
              <Box alignItems={'flex-end'}>
                <Pressable onPress={handleModalAddModelOpen}><Icon as={<FontAwesome name="plus-circle" />} size={5} color="#102A43" /></Pressable>
              </Box>
              <Box>
                <Select key={keySelectMakeForModel} ref={selectMakeForModelRef} onValueChange={handleMakeForModelChange} accessibilityLabel="Choose Make" placeholder="Choose Make" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }}>
                  {makeData.map((item) => (

                    <Select.Item key={item} label={item} value={item} />

                  ))}
                </Select>
              </Box>
              <Box flex={1} borderWidth={1} borderColor={'#102A43'} borderRadius={5}>

                <DraggableFlatList
                  style={{ alignContent: 'center', flex: 1, }}
                  data={modelSortData}
                  keyExtractor={(item) => item}
                  renderItem={({ item, drag }) => (

                    <Box flex={1} bgColor={'rgba(16, 42, 67, 0.5)'} borderBottomWidth={1} borderBottomColor={'warmGray.400'} flexDir={'row'} justifyContent={'center'} alignItems={'center'}>
                      <Pressable onPress={() => handleDeleteModelPress(item)}><Icon as={<AntDesign name="minuscircle" />} size={4} color="#102A43" /></Pressable>
                      <Text flex={1} textAlign={'center'} color={'white'}>{item}</Text>
                      <Pressable onPressIn={drag}><Icon as={<Entypo name="menu" />} size={4} color="#102A43" /></Pressable>
                    </Box>

                  )}
                  onDragEnd={useCallback(({ data }) => setModelSortData(data), [])} />

              </Box>

            </Box>

          </Modal.Body>
          <Modal.Footer borderTopWidth={0} >
            <HStack space={5} flex={1}>
              <Button onPress={handleModalModelClose} colorScheme={'muted'} flex={1} size={'sm'} borderRadius={5}>Close</Button>
              <Button onPress={handleModalSaveModelOpen} flex={1} size={'sm'} borderRadius={5}>Save</Button>
            </HStack>
          </Modal.Footer>



        </Modal.Content>
      </Modal>


      <Modal
        isOpen={modalAddModel}
        onClose={handleModalAddModelClose}
        initialFocusRef={selectMakeForAddModelRef}>
        <Modal.Content >
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <Text color={'#102A43'} bold>Add Model</Text>
          </Modal.Header>
          <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1} >
            <Select key={keySelectMakeForAddModel} ref={selectMakeForAddModelRef} onValueChange={handleMakeForAddModelChange} accessibilityLabel="Choose Make" placeholder="Choose Make" _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}>
              {makeData.map((item) => (

                <Select.Item key={item} label={item} value={item} />

              ))}
            </Select>
            <TextArea
              textAlign={'center'}
              w={'full'}
              ref={textAreaAddModel}
              multiline
              onChangeText={handleAddModelTextChange}
              totalLines={4}
              placeholder="Enter your data, separated by new lines"
              isDisabled={isAddModelDisabled ? true : false}
            />
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} >
            <HStack space={5} flex={1}>
              <Button onPress={handleModalAddModelClose} colorScheme={'muted'} flex={1} size={'sm'} borderRadius={5}>Close</Button>
              <Button onPress={handleAddModelSubmit} isLoading={modalSaveLoading ? true : false} flex={1} size={'sm'} borderRadius={5}>Add</Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>




      <Modal
        isOpen={modalSaveModel}
        onClose={handleModalSaveModelClose}>
        <Modal.Content >
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0}>
            <Text color={'#102A43'} bold>Save Model Order?</Text>
          </Modal.Header>
          <Modal.Body justifyContent={'center'} alignItems={'center'} flex={1} >

            <Text>Are you sure you want to save changes?</Text>

          </Modal.Body>
          <Modal.Footer borderTopWidth={0} >
            <HStack space={5} flex={1}>
              <Button onPress={handleModalSaveModelClose} colorScheme={'muted'} flex={1} size={'sm'} borderRadius={5}>No</Button>
              <Button onPress={handleSaveModel} flex={1} size={'sm'} borderRadius={5} isLoading={modalSaveModelLoading ? true : false}>Yes</Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={modalAddModelSuccess} onClose={handleModalAddModelSuccessClose} >
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
                Model Added!
                {/* Vehicle Added! */}
              </Text>
              <Text color={'green.600'}>
                Model was successfully added! You can view it in the model list.
                {/* Vehicle was successfully added! You can view it in the vehicle list. */}
              </Text>
            </Box>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} bgColor={'green.100'}>
            <HStack space={5} flex={1}>
              <Button colorScheme={'success'} flex="1" onPress={handleModalAddModelSuccessClose} _text={{ color: 'white' }}>
                Ok
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}




const referenceNumberVariable = {
  text: "",
};


const nameVariable = {
  text: "",
};


const makeVariable = {
  text: "",
};

const makeForAddModelVariable = {
  text: "",
};



const modelVariable = {
  text: "",
};

const regYearVariable = {
  text: "",
};

const regMonthVariable = {
  text: "",
};

const steeringVariable = {
  text: "",
};

const transmissionVariable = {
  text: "",
};

const exteriorColorVariable = {
  text: "",
};

const fuelVariable = {
  text: "",
};

const portVariable = {
  text: "",
  id: "",
};

const salesVariable = {
  text: "",
  id: "",
};

const buyerVariable = {
  text: "",
  id: "",
};

const driveTypeVariable = {
  text: "",
};

const bodyTypeVariable = {
  text: "",
};

const stockStatusVariable = {
  text: "",
};


let resetKey = 0;
const featuresState = {
  SafetySystemAnBrSy: false,
  SafetySystemDrAi: false,
  SafetySystemPaAi: false,
  SafetySystemSiAi: false,
  ComfortAiCoFr: false,
  ComfortAiCoRe: false,
  ComfortAMFMRa: false,
  ComfortAMFMSt: false,
  ComfortCDPl: false,
  ComfortCDCh: false,
  ComfortCrSpCo: false,
  ComfortDiSp: false,
  ComfortDVDPl: false,
  ComfortHDD: false,
  ComfortNaSyGPS: false,
  ComfortPoSt: false,
  ComfortPrAuSy: false,
  ComfortReKeSy: false,
  ComfortTiStWh: false,
  InteriorLeSe: false,
  InteriorPoDoLo: false,
  InteriorPoMi: false,
  InteriorPoSe: false,
  InteriorPoWi: false,
  InteriorReWiDe: false,
  InteriorReWiWi: false,
  InteriorThRoSe: false,
  InteriorTiGl: false,
  ExteriorAlWh: false,
  ExteriorPoSlDo: false,
  ExteriorSuRo: false,
  SellingPointsCuWh: false,
  SellingPointsFuLo: false,
  SellingPointsMaHiAv: false,
  SellingPointsBrNeTi: false,
  SellingPointsNoAcHi: false,
  SellingPointsNoSmPrOw: false,
  SellingPointsOnOwHi: false,
  SellingPointsPeRaTi: false,
  SellingPointsReBo: false,
  SellingPointsTuEn: false,
  SellingPointsUpAuSy: false,
};

const CheckBoxButton = ({ label, onChange, variable }) => {
  const [checked, setChecked] = useState(variable);

  // useEffect(() => {console.log(checked)}, [checked])

  const handlePress = () => {

    setChecked(!checked);
    onChange(!checked);

  };

  return (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', }}
      onPress={handlePress}
    >
      <Box
        justifyContent="center"
        alignItems="center"
        borderRadius={3}
        bgColor={checked ? '#7b9cff' : 'white'}
        margin={1}
        overflow={'hidden'}
        // h={50}
        // w={180}
        padding={2}
        borderWidth={1}
        borderColor={checked ? 'white' : 'muted.400'}
      >
        <Text
          // fontSize={[9, 11, 12, 11, 12, 13]}
          // maxW={[85, 100, 180, 100, 130, 180]}
          textAlign={'center'}
          noOfLines={3}
          color={checked ? 'white' : 'muted.400'}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};



export default function AddVehicle() {
  const screenWidth = Dimensions.get('window').width;

  const dispatch = useDispatch();


  const loginName = useSelector((state) => state.loginName);

  const [renderLoading, setRenderLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const logo = require('../../assets/C-Hub.png');
  const logo2 = require('../../assets/C-Hub Logo Only.png');

  const [name, setName] = useState(loginName);
  // const navigation = useNavigation();
  const navigate = useNavigate();

  const [widthState, setWidthState] = useState(Dimensions.get('window').width);

  const dragSortableViewRef = useRef();

  nameVariable.text = loginName;

  const inputCarNotes = useRef(null);
  const inputCarMemo = useRef(null);
  const inputCarName = useRef(null);
  const inputCarDesc = useRef(null);
  const inputFobJpy = useRef(null);
  const inputFobUsd = useRef(null);
  const inputRegYear = useRef(null);
  const selectRegYear = useRef(null);
  const selectRegMonth = useRef(null);
  const inputRegMonth = useRef(null);
  const inputRefNum = useRef(null);
  const inputStockIDNumber = useRef(null);
  const inputChassis = useRef(null);
  const inputModelCode = useRef(null);
  const inputEngineCode = useRef(null);
  const inputEngineDis = useRef(null);
  const selectSteering = useRef(null);
  const inputMileage = useRef(null);
  const selectTransmission = useRef(null);
  const selectExteriorColor = useRef(null);
  const inputNumOfSeats = useRef(null);
  const inputDoors = useRef(null);
  const inputPurchasedPrice = useRef(null);
  const inputFuel = useRef(null);
  const selectFuel = useRef(null);
  const selectPort = useRef(null);
  const selectSales = useRef(null);
  const selectBuyer = useRef(null);
  const selectDriveType = useRef(null);
  const inputDimensionLength = useRef(null);
  const inputDimensionWidth = useRef(null);
  const inputDimensionHeight = useRef(null);
  const inputDimensionCubicMeters = useRef(null);
  const inputDriveType = useRef(null);
  const inputWeight = useRef(null);
  const selectBodyType = useRef(null);
  const selectStockStatus = useRef(null);
  const textAreaAddMake = useRef(null);
  const textAreaAddModel = useRef(null);
  const textAreaAddTransmission = useRef(null);
  const textAreaAddExteriorColor = useRef(null);
  const textAreaAddFuel = useRef(null);
  const textAreaAddPort = useRef(null);
  const textAreaAddPortCode = useRef(null);
  const textAreaAddSales = useRef(null);
  const textAreaAddBuyer = useRef(null);
  const textAreaAddSalesCode = useRef(null);
  const textAreaAddBuyerCode = useRef(null);
  const textAreaAddDriveType = useRef(null);
  const textAreaAddBodyType = useRef(null);
  const textAreaAddExpenseName = useRef(null);
  const textAreaAddPaidTo = useRef(null);
  const inputExpenseAmount = useRef(null);

  // const supplyChainsCostsData = useSelector((state) => state.supplyChainsCostsData);
  const paidToData = useSelector((state) => state.paidToData);
  // const selectedImages = useSelector((state) => state.selectedImages);
  const portData = useSelector((state) => state.portData);
  const isLoading = useSelector((state) => state.isLoading);
  const transmissionData = useSelector((state) => state.transmissionData);
  const fuelData = useSelector((state) => state.fuelData);
  const buyerData = useSelector((state) => state.buyerData);
  const salesData = useSelector((state) => state.salesData);
  const driveTypeData = useSelector((state) => state.driveTypeData);
  const bodyTypeData = useSelector((state) => state.bodyTypeData);
  const stockStatusData = useSelector((state) => state.stockStatusData);
  const exteriorColorData = useSelector((state) => state.exteriorColorData);
  const jpyToUsd = useSelector((state) => state.jpyToUsd);
  const currentYear = useSelector((state) => state.currentYear);

  const minYear = 1970;
  const years = Array.from({ length: currentYear - minYear + 1 }, (_, index) => currentYear - index);
  globalRegYearDataVariable = years;




  const steeringData = ['Left', 'Right'];


  const selectMakeRef = useRef(null);
  const selectModelRef = useRef(null);

  const selectMakeForModelRef = useRef(null);
  const selectMakeForAddModelRef = useRef(null);


  const [isNoFeaturesSelected, setIsNoFeaturesSelected] = useState('white');


  const [carNameError, setCarNameError] = useState('muted.500');
  const [makeError, setMakeError] = useState('white');
  const [modelError, setModelError] = useState('white');
  const [regYearError, setRegYearError] = useState('white');
  const [regMonthError, setRegMonthError] = useState('white');
  const [refNumError, setRefNumError] = useState('white');
  const [stockIDNumError, setStockIDNumError] = useState('white');
  const [chassisError, setChassisError] = useState('white');
  const [modelCodeError, setModelCodeError] = useState('white');
  const [engineDisError, setEngineDisError] = useState('white');
  const [steeringError, setSteeringError] = useState('white');
  const [mileageError, setMileageError] = useState('white');
  const [transmissionError, setTransmissionError] = useState('white');
  const [exteriorColoError, setExteriorColoError] = useState('white');
  const [numOfSeatsError, setNumOfSeatsError] = useState('white');
  const [doorsError, setDoorsError] = useState('white');
  const [purchasedPriceError, setPurchasedPriceError] = useState('white');
  const [fuelError, setFuelError] = useState('white');
  const [portError, setPortError] = useState('white');
  const [buyerError, setBuyerError] = useState('white');
  const [salesError, setSalesError] = useState('white');
  const [dimensionLengthError, setDimensionLengthError] = useState('white');
  const [dimensionWidthError, setDimensionWidthError] = useState('white');
  const [dimensionHeightError, setDimensionHeightError] = useState('white');
  const [driveTypeError, setDriveTypeError] = useState('white');
  const [weightError, setWeightError] = useState('white');
  const [bodyTypeError, setBodyTypeError] = useState('white');
  const [stockStatusError, setStockStatusError] = useState('white');



  const inputVehicleBoxRef = useRef(null);


  const selectMakeBoxRef = useRef(null);
  const selectModelBoxRef = useRef(null);
  const selectRegYearBoxRef = useRef(null);
  const selectRegMonthBoxRef = useRef(null);
  const selectSteeringBoxRef = useRef(null);
  const selectTransmissionBoxRef = useRef(null);
  const selectExteriorColorBoxRef = useRef(null);
  const selectFuelBoxRef = useRef(null);
  const selectPortBoxRef = useRef(null);
  const selectBuyerBoxRef = useRef(null);
  const selectSalesBoxRef = useRef(null);
  const selectDriveTypeBoxRef = useRef(null);
  const selectBodyTypeBoxRef = useRef(null);
  const selectStockStatusBoxRef = useRef(null);

  useEffect(() => {

    handleClearImages();

    dispatch(setSupplyChainsCostsData([]));
    dispatch(setDeleteImageVisible(true));
    portVariable.id = '';
    portVariable.text = '';
    salesVariable.id = '';
    salesVariable.text = '';
    buyerVariable.id = '';
    buyerVariable.text = '';
    makeVariable.text = '';
    modelVariable.text = '';
    regYearVariable.text = '';
    regMonthVariable.text = '';
    steeringVariable.text = '';
    transmissionVariable.text = '';
    exteriorColorVariable.text = '';
    fuelVariable.text = '';
    driveTypeVariable.text = '';
    bodyTypeVariable.text = '';
    stockStatusVariable.text = '';
    Object.keys(featuresState).forEach(property => {
      featuresState[property] = false;
    });

    console.log('Sample');

    const currentUserEmail = getEmailOfCurrentUser();
    if (currentUserEmail) {
      getFieldValueByEmail(currentUserEmail);
      setEmail(currentUserEmail)
      const documentId = currentUserEmail;
    }
  }, []);


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


  const handleClearImages = useCallback(() => {
    dispatch(setSelectedImages([]));
    globalSelectedImages = [];
    dispatch(setIsAddPhotoVisible(true));
    dispatch(setAddAnotherImages(false));
  }, []);


  const handleClearIfError = useCallback(() => {


    handleClearToggleButton();
    clearSelect();

    inputCarName.current?.clear();
    inputCarDesc.current?.clear();
    inputFobJpy.current?.clear();
    inputFobUsd.current?.clear();

    inputRegYear.current?.clear();
    inputRegMonth.current?.clear();
    inputRefNum.current?.clear();
    inputChassis.current?.clear();
    inputModelCode.current?.clear();
    inputEngineCode.current?.clear();
    inputEngineDis.current?.clear();
    inputMileage.current?.clear();
    inputNumOfSeats.current?.clear();
    inputDoors.current?.clear();
    inputPurchasedPrice.current?.clear();
    inputFuel.current?.clear();
    inputDimensionLength.current?.clear();
    inputDimensionWidth.current?.clear();
    inputDimensionHeight.current?.clear();
    inputDimensionCubicMeters.current.value = "0.00";
    inputDriveType.current?.clear();
    inputWeight.current?.clear();

    makeVariable.text = '';
    modelVariable.text = '';
    regYearVariable.text = '';
    regMonthVariable.text = '';
    steeringVariable.text = '';
    transmissionVariable.text = '';
    exteriorColorVariable.text = '';
    fuelVariable.text = '';
    portVariable.text = '';
    salesVariable.text = '';
    buyerVariable.text = '';
    portVariable.id = '';
    salesVariable.id = '';
    buyerVariable.id = '';
    driveTypeVariable.text = '';
    bodyTypeVariable.text = '';
    stockStatusVariable.text = '';
    setIsNoFeaturesSelected('white');

    setMakeError('white');
    setModelError('white');
    setRegYearError('white');
    setRegMonthError('white');
    setRefNumError('white');
    setStockIDNumError('white');
    setChassisError('white');
    setModelCodeError('white');
    setEngineDisError('white');
    setSteeringError('white');
    setMileageError('white');
    setTransmissionError('white');
    setExteriorColoError('white');
    setNumOfSeatsError('white');
    setDoorsError('white');
    setPurchasedPriceError('white');
    setFuelError('white');
    setPortError('white');
    setSalesError('white');
    setBuyerError('white');
    setDimensionLengthError('white');
    setDimensionWidthError('white');
    setDimensionHeightError('white');
    setDriveTypeError('white');
    setWeightError('white');
    setBodyTypeError('white');
    setStockStatusError('white');
    setCarNameError('muted.500');

    setIsNoFeaturesSelected('white');

  }, []);

  // const uploadImages = useCallback(async () => {
  //   const storageRef = ref(storage, `${globalVehicleFolderName}`);
  //   const ImageFormat = { jpg: 'jpg' };

  //   try {
  //     // Get the names of the images to keep
  //     const imageNamesToKeep = globalSelectedImages.map((asset, index) => index.toString());

  //     // Delete existing files in the folder that do not match the names of the images to keep
  //     const listResult = await listAll(storageRef);
  //     await Promise.all(
  //       listResult.items
  //         .filter((itemRef) => !imageNamesToKeep.includes(itemRef.name))
  //         .map((itemRef) => deleteObject(itemRef))
  //     );

  //     // Upload new images with or without watermarks based on the platform
  //     function blobToArrayBuffer(blob) {
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onload = () => resolve(reader.result);
  //         reader.onerror = reject;
  //         reader.readAsArrayBuffer(blob);
  //       });
  //     }

  //     // ...

  //     await Promise.all(
  //       globalSelectedImages.map(async (asset, index) => {
  //         const { uri } = asset;
  //         const imageName = index.toString();

  //         const response = await fetch(uri);
  //         const blob = await response.blob();

  //         const imageRef = ref(storage, `${globalVehicleFolderName}/${imageName}`);

  //         // Define your watermark options
  //         const watermarkOptions = {
  //           text: 'Real Motor Japan',
  //           color: '#FFFFFF', // Text color
  //           fontSize: 20,
  //           opacity: 50, // Set opacity if needed
  //         };

  //         // Convert the blob to an ArrayBuffer
  //         const arrayBuffer = await blobToArrayBuffer(blob);

  //         // Use watermark.js to add the watermark
  //         const watermarkedArrayBuffer = await watermark([arrayBuffer, watermarkOptions])
  //           .image(watermark.image.bottomCenter())
  //           .then((img) => img.arrayBuffer());

  //         // Convert the ArrayBuffer back to a Blob
  //         const watermarkedBlob = new Blob([watermarkedArrayBuffer]);

  //         await uploadBytes(imageRef, watermarkedBlob, { contentType: 'image/jpeg' });
  //       })
  //     );

  //     console.log(`Images uploaded to folder ${globalVehicleFolderName}`);
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //   }
  // }, []);

  const uploadImages = useCallback(async () => {

    const storageRef = ref(storage, `${globalVehicleFolderName}`);
    const ImageFormat = { jpg: 'jpg' };



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
            const watermarkText = `Real Motor Japan ${globalReferenceNumber}`;
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
            const imageRef = ref(storage, `${globalVehicleFolderName}/${imagename}`);
            await uploadBytes(imageRef, watermarkedImageBlob, { contentType: 'image/jpeg' });
          };

        })

      );


      console.log(`Images uploaded to folder ${globalVehicleFolderName}`);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  }, []);


  const handleUpload = useCallback(async () => {

    dispatch(setLoadingModalVisible(true));

    setCarNameError('muted.500');
    setMakeError('white');
    setModelError('white');
    setRegYearError('white');
    setRegMonthError('white');
    setRefNumError('white');
    setStockIDNumError('white');
    setChassisError('white');
    setModelCodeError('white');
    setEngineDisError('white');
    setSteeringError('white');
    setMileageError('white');
    setTransmissionError('white');
    setExteriorColoError('white');
    setNumOfSeatsError('white');
    setDoorsError('white');
    setPurchasedPriceError('white');
    setFuelError('white');
    setPortError('white');
    setBuyerError('white');
    setSalesError('white');
    setDimensionLengthError('white');
    setDimensionWidthError('white');
    setDimensionHeightError('white');
    setDriveTypeError('white');
    setWeightError('white');
    setBodyTypeError('white');
    setStockStatusError('white');
    setIsNoFeaturesSelected('white');

    const selectIsEmpty = makeVariable.text == "" ||
      modelVariable.text == "" ||
      regYearVariable.text == "" ||
      regMonthVariable.text == "" ||
      // steeringVariable.text == "" ||
      // transmissionVariable.text == "" ||
      // exteriorColorVariable.text == "" ||
      fuelVariable.text == "" 
      ||portVariable.text == "" 
      || buyerVariable.text == "" 
      || salesVariable.text == "" 
      || driveTypeVariable.text == "" 
      || bodyTypeVariable.text == ""
      ;

    const inputIsEmpty = inputStockIDNumber.current?.value == "" || inputRefNum.current?.value == "" ||
      inputChassis.current?.value == "" ||
      inputModelCode.current?.value == "" ||
      inputEngineDis.current?.value == "" ||
      inputEngineDis.current?.value == 0 ||
      inputMileage.current?.value == "" ||
      inputMileage.current?.value == 0 ||
      inputNumOfSeats.current?.value == "" ||
      inputDoors.current?.value == "" ||
      inputNumOfSeats.current?.value == 0 ||
      inputDoors.current?.value == 0 ||
      inputPurchasedPrice.current?.value == 0 ||
      inputPurchasedPrice.current?.value == "" ||
      inputDimensionLength.current?.value == "" ||
      inputDimensionWidth.current?.value == "" ||
      inputDimensionHeight.current?.value == "" ||
      inputDimensionCubicMeters.current?.value == "" ||
      inputDimensionLength.current?.value == 0 ||
      inputDimensionWidth.current?.value == 0 ||
      inputDimensionHeight.current?.value == 0 ||
      inputDimensionCubicMeters.current?.value == 0 ||
      // inputWeight.current?.value == "" ||
      inputCarName.current?.value == "";

    // const inputExceedLength = input;
    const allValuesAreFalse = Object.values(featuresState).every((value) => value === false);

    console.log(inputIsEmpty || selectIsEmpty);

    if (inputIsEmpty || selectIsEmpty || allValuesAreFalse) {
      dispatch(setLoadingModalVisible(false));
      inputVehicleBoxRef.current.scrollIntoView({ behavior: 'smooth' });
      if (allValuesAreFalse) {
        // All features are false
        console.log('All features are false');
        setIsNoFeaturesSelected('danger.400');
        // featureBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        // handleModalUploadClose();
      } else {
        // At least one feature is true
        console.log('At least one feature is true.');
        // handleModalUploadClose();
      }

      if (inputCarName.current?.value == "") {
        inputCarName.current.scrollIntoView({ behavior: 'smooth' });
        setCarNameError('danger.400');
      }

      if (bodyTypeVariable.text == "") {
        selectBodyTypeBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setBodyTypeError('danger.400');
      }

      if (driveTypeVariable.text == "") {
        selectDriveTypeBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setDriveTypeError('danger.400');
      }

      if (inputDimensionHeight.current?.value == "" || inputDimensionHeight.current?.value == 0) {
        inputDimensionHeight.current.scrollIntoView({ behavior: 'smooth' });
        setDimensionHeightError('danger.400');
      }

      if (inputDimensionWidth.current?.value == "" || inputDimensionWidth.current?.value == 0) {
        inputDimensionWidth.current.scrollIntoView({ behavior: 'smooth' });
        setDimensionWidthError('danger.400');
      }

      if (inputDimensionLength.current?.value == "" || inputDimensionLength.current?.value == 0) {
        inputDimensionLength.current.scrollIntoView({ behavior: 'smooth' });
        setDimensionLengthError('danger.400');
      }

      if (fuelVariable.text == "") {
        selectFuelBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setFuelError('danger.400');
      }

      if (inputDoors.current?.value == "" || inputDoors.current?.value == 0) {
        inputDoors.current.scrollIntoView({ behavior: 'smooth' });
        setDoorsError('danger.400');
      }
      if (inputPurchasedPrice.current?.value == "" || inputPurchasedPrice.current?.value == 0) {
        inputPurchasedPrice.current.scrollIntoView({ behavior: 'smooth' });
        setPurchasedPriceError('danger.400');
      }

      if (inputNumOfSeats.current?.value == "") {
        inputNumOfSeats.current.scrollIntoView({ behavior: 'smooth' });
        setNumOfSeatsError('danger.400');
      }

      if (exteriorColorVariable.text == "") {
        selectExteriorColorBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setExteriorColoError('danger.400');
      }

      if (transmissionVariable.text == "") {
        selectTransmissionBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setTransmissionError('danger.400');
      }

      if (inputMileage.current?.value == "" || inputMileage.current?.value == 0) {
        inputMileage.current.scrollIntoView({ behavior: 'smooth' });
        setMileageError('danger.400');
      }

      if (steeringVariable.text == "") {
        selectSteeringBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setSteeringError('danger.400');
      }

      if (inputEngineDis.current?.value == "" || inputEngineDis.current?.value == 0) {
        inputEngineDis.current.scrollIntoView({ behavior: 'smooth' });
        setEngineDisError('danger.400');
      }

      if (inputModelCode.current?.value == "") {
        inputModelCode.current.scrollIntoView({ behavior: 'smooth' });
        setModelCodeError('danger.400');
      }

      if (inputChassis.current?.value == "") {
        inputChassis.current.scrollIntoView({ behavior: 'smooth' });
        setChassisError('danger.400');
      }

      if (inputRefNum.current?.value == "") {
        inputRefNum.current.scrollIntoView({ behavior: 'smooth' });
        setRefNumError('danger.400');
      }
      if (buyerVariable.text == "") {
        selectBuyerBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setBuyerError('danger.400');
      }

      if (salesVariable.text == "") {
        selectSalesBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setSalesError('danger.400');
      }


      if (portVariable.text == "") {
        selectPortBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setPortError('danger.400');
      }


      if (regMonthVariable.text == "") {
        selectRegMonthBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setRegMonthError('danger.400');
      }

      if (regYearVariable.text == "") {
        selectRegYearBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setRegYearError('danger.400');
      }

      if (modelVariable.text == "") {
        selectModelBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setModelError('danger.400');
      }

      if (makeVariable.text == "") {
        selectMakeBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        setMakeError('danger.400');
      }

      if (inputStockIDNumber.current?.value == "") {
        inputStockIDNumber.current.scrollIntoView({ behavior: 'smooth' });
        setStockIDNumError('danger.400');
      }

    }
    else {
      const stockCollectionRef = collection(projectExtensionFirestore, 'VehicleProducts');
      const stockID = inputStockIDNumber.current?.value;
      const docQuery = doc(stockCollectionRef, stockID);
      const docSnap = await getDoc(docQuery);

      dispatch(setLoadingModalVisible(true));
      globalReferenceNumber = inputRefNum.current?.value;
      const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
      const { datetime } = response.data;
      const timestampForID = moment(datetime).format('YYYYMMDDHHmmss');
      const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
      const year = moment(datetime).format('YYYY');
      const month = moment(datetime).format('MM');
      const monthWithDay = moment(datetime).format('MM/DD');
      const date = moment(datetime).format('YYYY/MM/DD');
      const day = moment(datetime).format('DD');
      const time = moment(datetime).format('HH:mm');
      const timeWithMinutesSeconds = moment(datetime).format('HH:mm:ss');

      // console.log(`${timestampForID}${inputRefNum.current?.value}`);

      const collectionRef = collection(projectExtensionFirestore, 'VehicleProducts');
      const docRef = doc(collectionRef, inputStockIDNumber.current?.value);

      const docData = docSnap.data();
      // Your data object to be added
      const docSnapshot = await getDoc(docRef);




      const keywordsData = [
        inputRefNum.current?.value,
        inputCarName.current?.value,
        inputStockIDNumber.current?.value,
        regYearVariable.text,
        makeVariable.text,
        modelVariable.text,
        inputChassis.current?.value,
        `${makeVariable.text} ${modelVariable.text}`,
        `${regYearVariable.text} ${makeVariable.text}`,
      ]
      const fobHistoryData = {
        date: formattedTime,
        fobPrice: inputFobJpy.current.value.replace(/,/g, ''),
        changedBy: nameVariable.text,
      };

      let fobHistoryValue;
      const inputFobValue = inputFobJpy.current?.value;
      if (globalFobPrice !== inputFobValue && inputFobValue !== '') {
        fobHistoryValue = arrayUnion(fobHistoryData);
      }

      const data = {
        keywords: keywordsData,
        imageCount: globalSelectedImages.length,
        supplyChainsCostsData: globalSupplyChainCostsData,
        ...(fobHistoryValue && { fobHistory: fobHistoryValue }),
        // ...(docSnap.exists() || docData.inputStockIDNumber.current?.value.hasOwnProperty('dateAdded')
        // ? { updatedDate: formattedTime }
        // : { dateAdded: formattedTime }),
        // dateAdded: formattedTime, 
        display: false,
        photos: false,
        stockID: inputStockIDNumber.current?.value,
        make: makeVariable.text,
        model: modelVariable.text,
        regYear: regYearVariable.text,
        regMonth: regMonthVariable.text,
        referenceNumber: inputRefNum.current?.value,
        chassisNumber: inputChassis.current?.value,
        modelCode: inputModelCode.current?.value,
        engineCode: inputEngineCode.current?.value,
        engineDisplacement: inputEngineDis.current.value.replace(/,/g, ''),
        steering: steeringVariable.text,
        mileage: inputMileage.current.value.replace(/,/g, ''),
        transmission: transmissionVariable.text,
        exteriorColor: exteriorColorVariable.text,
        numberOfSeats: inputNumOfSeats.current?.value,
        doors: inputDoors.current?.value,
        purchasedPrice: inputPurchasedPrice.current.value.replace(/,/g, ''),
        fuel: fuelVariable.text,
        port: portVariable.text,
        sales: salesVariable.text,
        buyer: buyerVariable.text,
        portID: portVariable.id,
        salesID: salesVariable.id,
        buyerID: buyerVariable.id,
        dimensionLength: inputDimensionLength.current.value.replace(/,/g, ''),
        dimensionWidth: inputDimensionWidth.current.value.replace(/,/g, ''),
        dimensionHeight: inputDimensionHeight.current.value.replace(/,/g, ''),
        dimensionCubicMeters: inputDimensionCubicMeters.current.value.replace(/,/g, ''),
        driveType: driveTypeVariable.text,
        weight: inputWeight.current.value.replace(/,/g, ''),
        bodyType: bodyTypeVariable.text,
        stockStatus: stockStatusVariable.text,
        carName: inputCarName.current?.value,
        carDescription: inputCarDesc.current?.value,
        notes: inputCarNotes.current?.value,
        memo: inputCarMemo.current?.value,

        comfort: {
          ComfortAiCoFr: featuresState.ComfortAiCoFr,
          ComfortAiCoRe: featuresState.ComfortAiCoRe,
          ComfortAMFMRa: featuresState.ComfortAMFMRa,
          ComfortAMFMSt: featuresState.ComfortAMFMSt,
          ComfortCDPl: featuresState.ComfortCDPl,
          ComfortCDCh: featuresState.ComfortCDCh,
          ComfortCrSpCo: featuresState.ComfortCrSpCo,
          ComfortDiSp: featuresState.ComfortDiSp,
          ComfortDVDPl: featuresState.ComfortDVDPl,
          ComfortHDD: featuresState.ComfortHDD,
          ComfortNaSyGPS: featuresState.ComfortNaSyGPS,
          ComfortPoSt: featuresState.ComfortPoSt,
          ComfortPrAuSy: featuresState.ComfortPrAuSy,
          ComfortReKeSy: featuresState.ComfortReKeSy,
          ComfortTiStWh: featuresState.ComfortTiStWh,
        },

        ComfortAiCoFr: featuresState.ComfortAiCoFr,
        ComfortAiCoRe: featuresState.ComfortAiCoRe,
        ComfortAMFMRa: featuresState.ComfortAMFMRa,
        ComfortAMFMSt: featuresState.ComfortAMFMSt,
        ComfortCDPl: featuresState.ComfortCDPl,
        ComfortCDCh: featuresState.ComfortCDCh,
        ComfortCrSpCo: featuresState.ComfortCrSpCo,
        ComfortDiSp: featuresState.ComfortDiSp,
        ComfortDVDPl: featuresState.ComfortDVDPl,
        ComfortHDD: featuresState.ComfortHDD,
        ComfortNaSyGPS: featuresState.ComfortNaSyGPS,
        ComfortPoSt: featuresState.ComfortPoSt,
        ComfortPrAuSy: featuresState.ComfortPrAuSy,
        ComfortReKeSy: featuresState.ComfortReKeSy,
        ComfortTiStWh: featuresState.ComfortTiStWh,

        fobPrice: inputFobJpy.current.value.replace(/,/g, ''),

        safetySystem: {
          SafetySystemAnBrSy: featuresState.SafetySystemAnBrSy,
          SafetySystemDrAi: featuresState.SafetySystemDrAi,
          SafetySystemPaAi: featuresState.SafetySystemPaAi,
          SafetySystemSiAi: featuresState.SafetySystemSiAi,

        },

        SafetySystemAnBrSy: featuresState.SafetySystemAnBrSy,
        SafetySystemDrAi: featuresState.SafetySystemDrAi,
        SafetySystemPaAi: featuresState.SafetySystemPaAi,
        SafetySystemSiAi: featuresState.SafetySystemSiAi,

        interior: {
          InteriorLeSe: featuresState.InteriorLeSe,
          InteriorPoDoLo: featuresState.InteriorPoDoLo,
          InteriorPoMi: featuresState.InteriorPoMi,
          InteriorPoSe: featuresState.InteriorPoSe,
          InteriorPoWi: featuresState.InteriorPoWi,
          InteriorReWiDe: featuresState.InteriorReWiDe,
          InteriorReWiWi: featuresState.InteriorReWiWi,
          InteriorThRoSe: featuresState.InteriorThRoSe,
          InteriorTiGl: featuresState.InteriorTiGl,
        },

        InteriorLeSe: featuresState.InteriorLeSe,
        InteriorPoDoLo: featuresState.InteriorPoDoLo,
        InteriorPoMi: featuresState.InteriorPoMi,
        InteriorPoSe: featuresState.InteriorPoSe,
        InteriorPoWi: featuresState.InteriorPoWi,
        InteriorReWiDe: featuresState.InteriorReWiDe,
        InteriorReWiWi: featuresState.InteriorReWiWi,
        InteriorThRoSe: featuresState.InteriorThRoSe,
        InteriorTiGl: featuresState.InteriorTiGl,

        exterior: {
          ExteriorAlWh: featuresState.ExteriorAlWh,
          ExteriorPoSlDo: featuresState.ExteriorPoSlDo,
          ExteriorSuRo: featuresState.ExteriorSuRo,
        },
        ExteriorAlWh: featuresState.ExteriorAlWh,
        ExteriorPoSlDo: featuresState.ExteriorPoSlDo,
        ExteriorSuRo: featuresState.ExteriorSuRo,

        sellingPoints: {
          SellingPointsCuWh: featuresState.SellingPointsCuWh,
          SellingPointsFuLo: featuresState.SellingPointsFuLo,
          SellingPointsMaHiAv: featuresState.SellingPointsMaHiAv,
          SellingPointsBrNeTi: featuresState.SellingPointsBrNeTi,
          SellingPointsNoAcHi: featuresState.SellingPointsNoAcHi,
          SellingPointsNoSmPrOw: featuresState.SellingPointsNoSmPrOw,
          SellingPointsOnOwHi: featuresState.SellingPointsOnOwHi,
          SellingPointsPeRaTi: featuresState.SellingPointsPeRaTi,
          SellingPointsReBo: featuresState.SellingPointsReBo,
          SellingPointsTuEn: featuresState.SellingPointsTuEn,
          SellingPointsUpAuSy: featuresState.SellingPointsUpAuSy,
        },

        SellingPointsCuWh: featuresState.SellingPointsCuWh,
        SellingPointsFuLo: featuresState.SellingPointsFuLo,
        SellingPointsMaHiAv: featuresState.SellingPointsMaHiAv,
        SellingPointsBrNeTi: featuresState.SellingPointsBrNeTi,
        SellingPointsNoAcHi: featuresState.SellingPointsNoAcHi,
        SellingPointsNoSmPrOw: featuresState.SellingPointsNoSmPrOw,
        SellingPointsOnOwHi: featuresState.SellingPointsOnOwHi,
        SellingPointsPeRaTi: featuresState.SellingPointsPeRaTi,
        SellingPointsReBo: featuresState.SellingPointsReBo,
        SellingPointsTuEn: featuresState.SellingPointsTuEn,
        SellingPointsUpAuSy: featuresState.SellingPointsUpAuSy,


        // Add more fields as needed
      };

      // Get a reference to the document with the given stock ID


      // Get the document


      // Check if the document exists
      if (docSnap.exists()) {
        setDoc(docRef, data, { merge: true })
          .then(async () => {
            try {

              await uploadImages();
              dispatch(setLoadingModalVisible(false));
              dispatch(setIsUpdateSuccessModalOpen(true));

              try {
                // Check if the document exists
                const docSnapshot = await getDoc(docRef);

                if (docSnap.exists()) {
                  const dataDoc = docSnap.data();
                  if (dataDoc) {
                    if ('dateAdded' in dataDoc) {
                      // The document exists and has a 'dateAdded' field
                      console.log('Date Update');
                      // Update the 'updatedDate' field without removing 'dateAdded'
                      const updates = {
                        updatedDate: formattedTime, // Replace 'formattedTime' with the updated date value
                      };

                      // Use updateDoc to only update the 'updatedDate' field in the document
                      await updateDoc(docRef, updates);
                    } else {
                      // The document exists, but it doesn't have a 'dateAdded' field
                      console.log('Date Added');
                      // Update the 'dateAdded' field without removing other fields
                      const updates = {
                        dateAdded: formattedTime, // Replace 'formattedTime' with the date value
                      };

                      // Use updateDoc to only update the 'dateAdded' field in the document
                      await updateDoc(docRef, updates);
                    }
                  } else {
                    // The document exists, but it doesn't have a 'dateAdded' field
                    console.log('Date Added');
                    // Update the 'dateAdded' field without removing other fields
                    const updates = {
                      dateAdded: formattedTime, // Replace 'formattedTime' with the date value
                    };

                    // Use updateDoc to only update the 'dateAdded' field in the document
                    await updateDoc(docRef, updates);
                  }
                } else {
                  // The document does not exist
                  console.log('Date Added');
                }
              } catch (error) {
                console.error('Error checking document:', error);
              }

              const logData = {
                message: `Vehicle Updated: "${nameVariable.text}" updated "${inputCarName.current?.value}" with a reference number of "${inputRefNum.current?.value}"`,
                timestamp: formattedTime,
                colorScheme: true,
                keywords: [
                  formattedTime.toLowerCase(),
                  inputStockIDNumber.current.value.toLowerCase(),
                  `Vehicle Updated: "${nameVariable.text}" updated "${inputCarName.current?.value}" with a reference number of "${inputRefNum.current?.value}"`.toLowerCase(),
                  'Vehicle Updated'.toLowerCase(),
                  'Vehicle'.toLowerCase(),
                  'Updated'.toLowerCase(),
                  inputCarName.current.value.toLowerCase(),
                  inputRefNum.current.value.toLowerCase(),
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
              dispatch(setLoadingModalVisible(false));
              handleClearImages();
              addLogToCollection(logData);
              handleClear();
              console.log('Document updated successfully!');
              // console.log(`Folder Name ${globalVehicleFolderName}`);
            } catch (error) {
              // Handle errors that may occur during the update process
              console.error('Error updating document:', error);
            }
          })
          .catch((error) => {
            dispatch(setLoadingModalVisible(false));
            console.error('Error updating document: ', error);
          });
      }
      else {
        const dataWithDateAdded = {
          ...data,
          dateAdded: formattedTime,
        };

        setDoc(docRef, dataWithDateAdded)
          .then(async () => {

            try {
              await uploadImages();
              dispatch(setLoadingModalVisible(false));
              dispatch(setIsSuccessModalOpen(true));

              // try {
              //   // Check if the document exists
              //   const docSnapshot = await getDoc(docRef);

              //   if (docSnapshot.exists()) {
              //     const data = docSnapshot.data();
              //     if (data) {
              //       if ('dateAdded' in data) {
              //         // The document exists and has a 'dateAdded' field
              //         console.log('Date Update');
              //         // Update the 'updatedDate' field in the document
              //         const updates = {
              //           updatedDate: formattedTime, // Replace 'newFieldValue' with the updated date value
              //         };

              //         // Use setDoc to update the 'updatedDate' field in the document
              //         await setDoc(docRef, updates, { merge: true });
              //       } else {
              //         // The document exists, but it doesn't have a 'dateAdded' field
              //         console.log('Date Added');
              //         // Update the 'dateAdded' field in the document
              //         const updates = {
              //           dateAdded: formattedTime, // Replace 'newFieldValue' with the date value
              //         };

              //         // Use setDoc to update the 'dateAdded' field in the document
              //         await setDoc(docRef, updates, { merge: true });
              //       }
              //     } else {
              //       // The document exists, but it doesn't have a 'dateAdded' field
              //       console.log('Date Added');
              //       // Update the 'dateAdded' field in the document
              //       const updates = {
              //         dateAdded: formattedTime, // Replace 'newFieldValue' with the date value
              //       };

              //       // Use setDoc to update the 'dateAdded' field in the document
              //       await setDoc(docRef, updates, { merge: true });
              //     }
              //   } else {
              //     // The document does not exist
              //     console.log('Date Added');
              //   }
              // } catch (error) {
              //   console.error('Error checking document:', error);
              // }

              const logData = {
                message: `Vehicle Added: "${nameVariable.text}" added "${inputCarName.current?.value}" with a reference number of "${inputRefNum.current?.value}"`,
                timestamp: formattedTime,
                colorScheme: true,
                keywords: [
                  formattedTime.toLowerCase(),
                  inputStockIDNumber.current.value.toLowerCase(),
                  `Vehicle Added: "${nameVariable.text}" added "${inputCarName.current?.value}" with a reference number of "${inputRefNum.current?.value}"`.toLowerCase(),
                  'Vehicle Added'.toLowerCase(),
                  'Vehicle'.toLowerCase(),
                  'Added'.toLowerCase(),
                  inputCarName.current.value.toLowerCase(),
                  inputRefNum.current.value.toLowerCase(),
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

              handleClearImages();
              addLogToCollection(logData);
              handleClear();
              console.log('Document added successfully!');
              // console.log(`Folder Name ${globalVehicleFolderName}`);
            } catch (error) {

            }


          })
          .catch((error) => {
            dispatch(setLoadingModalVisible(false));
            console.error('Error adding document: ', error);
          });
      }

    }


  }, []);




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



  const handleClearToggleButton = () => {
    resetKey++;

    featuresState.SafetySystemAnBrSy = false;
    featuresState.SafetySystemDrAi = false;
    featuresState.SafetySystemPaAi = false;
    featuresState.SafetySystemSiAi = false;
    featuresState.ComfortAiCoFr = false;
    featuresState.ComfortAiCoRe = false;
    featuresState.ComfortAMFMRa = false;
    featuresState.ComfortAMFMSt = false;
    featuresState.ComfortCDPl = false;
    featuresState.ComfortCDCh = false;
    featuresState.ComfortCrSpCo = false;
    featuresState.ComfortDiSp = false;
    featuresState.ComfortDVDPl = false;
    featuresState.ComfortHDD = false;
    featuresState.ComfortNaSyGPS = false;
    featuresState.ComfortPoSt = false;
    featuresState.ComfortPrAuSy = false;
    featuresState.ComfortReKeSy = false;
    featuresState.ComfortTiStWh = false;
    featuresState.InteriorLeSe = false;
    featuresState.InteriorPoDoLo = false;
    featuresState.InteriorPoMi = false;
    featuresState.InteriorPoSe = false;
    featuresState.InteriorPoWi = false;
    featuresState.InteriorReWiDe = false;
    featuresState.InteriorReWiWi = false;
    featuresState.InteriorThRoSe = false;
    featuresState.InteriorTiGl = false;
    featuresState.ExteriorAlWh = false;
    featuresState.ExteriorPoSlDo = false;
    featuresState.ExteriorSuRo = false;
    featuresState.SellingPointsCuWh = false;
    featuresState.SellingPointsFuLo = false;
    featuresState.SellingPointsMaHiAv = false;
    featuresState.SellingPointsBrNeTi = false;
    featuresState.SellingPointsNoAcHi = false;
    featuresState.SellingPointsNoSmPrOw = false;
    featuresState.SellingPointsOnOwHi = false;
    featuresState.SellingPointsPeRaTi = false;
    featuresState.SellingPointsReBo = false;
    featuresState.SellingPointsTuEn = false;
    featuresState.SellingPointsUpAuSy = false;
  };

  const handleClear = useCallback(() => {

    handleClearToggleButton();
    handleClearImages();
    clearSelect();


    dispatch(setSupplyChainsCostsData([]));
    globalSupplyChainCostsData = [];
    globalSupplyChainCostsAmount = '';
    globalFobPrice = '';

    inputStockIDNumber.current?.clear();
    inputCarName.current?.clear();
    inputCarDesc.current?.clear();
    inputFobJpy.current?.clear();
    inputFobUsd.current?.clear();

    inputRegYear.current?.clear();
    inputRegMonth.current?.clear();
    inputRefNum.current?.clear();
    inputChassis.current?.clear();
    inputModelCode.current?.clear();
    inputEngineCode.current?.clear();
    inputEngineDis.current?.clear();
    inputMileage.current?.clear();
    inputNumOfSeats.current?.clear();
    inputDoors.current?.clear();
    inputPurchasedPrice.current?.clear();
    inputFuel.current?.clear();
    inputDimensionLength.current?.clear();
    inputDimensionWidth.current?.clear();
    inputDimensionHeight.current?.clear();
    inputDimensionCubicMeters.current.value = "0.00";
    inputDriveType.current?.clear();
    inputWeight.current?.clear();
    inputCarNotes.current?.clear();
    inputCarMemo.current?.clear();
    makeVariable.text = '';
    modelVariable.text = '';
    regYearVariable.text = '';
    regMonthVariable.text = '';
    steeringVariable.text = '';
    transmissionVariable.text = '';
    exteriorColorVariable.text = '';
    fuelVariable.text = '';
    portVariable.text = '';
    salesVariable.text = '';
    buyerVariable.text = '';
    portVariable.id = '';
    salesVariable.id = '';
    buyerVariable.id = '';
    driveTypeVariable.text = '';
    bodyTypeVariable.text = '';
    stockStatusVariable.text = '';

    setIsNoFeaturesSelected('white');

    setMakeError('white');
    setModelError('white');
    setRegYearError('white');
    setRegMonthError('white');
    setRefNumError('white');
    setStockIDNumError('white');
    setChassisError('white');
    setModelCodeError('white');
    setEngineDisError('white');
    setSteeringError('white');
    setMileageError('white');
    setTransmissionError('white');
    setExteriorColoError('white');
    setNumOfSeatsError('white');
    setDoorsError('white');
    setPurchasedPriceError('white');
    setFuelError('white');
    setPortError('white');
    setSalesError('white');
    setBuyerError('white');
    setDimensionLengthError('white');
    setDimensionWidthError('white');
    setDimensionHeightError('white');
    setDriveTypeError('white');
    setWeightError('white');
    setBodyTypeError('white');
    setStockStatusError('white');
    setCarNameError('muted.500');

    setIsNoFeaturesSelected('white');

    // handleModalClearClose();




  }, []);




  // const handleToggleLogs = useCallback(() => {


  //   navigation.navigate("LOGS");
  // }, []);
  // const handleToggleAddAccount = useCallback(() => {


  //   navigation.navigate("ADD C-HUB ACCOUNT");
  // }, []);

  // const handleToggleAccountList = useCallback(() => {

  //   navigation.navigate("ACCOUNT LIST");
  // }, []);

  // const handleToggleAddVehicle = useCallback(() => {

  //   navigation.navigate("ADD NEW VEHICLE");
  // }, []);


  // const handleVehicleList = useCallback(() => {
  //   navigation.navigate("VEHICLE LIST");
  // }, []);

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



  const { width } = Dimensions.get('window');


  const handleInputPurchasedPriceChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the numeric value to a maximum of 4 characters
    const truncatedValue = numericValue.slice(0, 9);

    // Format the truncated numeric value with comma separator
    const formattedValue = Number(truncatedValue).toLocaleString();

    inputPurchasedPrice.current.value = formattedValue;

  };


  const handleInputFobJpyChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    // Check if the numeric value starts with 0
    if (numericValue.startsWith('0')) {
      // Handle the case when the value starts with 0
      inputFobJpy.current.value = '';
      inputFobUsd.current.setNativeProps({ text: '' });
      return;
    }

    // Truncate the numeric value to a maximum of 9 digits
    const truncatedValue = numericValue.slice(0, 9);

    const formattedValue = truncatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (formattedValue !== '') {
      const multipliedValue = parseFloat(truncatedValue) * jpyToUsd;

      if (!isNaN(multipliedValue)) {
        const formattedMultipliedValue = multipliedValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        inputFobJpy.current.value = formattedValue;
        inputFobUsd.current.setNativeProps({ text: formattedMultipliedValue });
      } else {
        // Handle the case when the multipliedValue is NaN
        inputFobJpy.current.value = formattedValue;
        inputFobUsd.current.setNativeProps({ text: '' });
      }
    } else {
      // Handle the case when formattedValue is empty
      inputFobJpy.current.value = '';
      inputFobUsd.current.setNativeProps({ text: '' });
    }
  };

  useEffect(() => {
    handleInputFobJpyChange(inputFobJpy.current?.value);
  }, [jpyToUsd]);



  const handleAddMakeTextChange = () => {
    const newText = textAreaAddMake.current?.value?.toUpperCase();
    textAreaAddMake.current?.setNativeProps({ text: newText });

  };


  const handleAddTransmissionTextChange = () => {
    const textAreaValue = textAreaAddTransmission.current?.value;
    if (textAreaValue) {
      const newText = textAreaValue
        .split('\n')
        .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
        .join('\n');
      textAreaAddTransmission.current.setNativeProps({ text: newText });
    }
  };

  const handleAddFuelTextChange = () => {
    const textAreaValue = textAreaAddFuel.current?.value;
    if (textAreaValue) {
      const newText = textAreaValue
        .split('\n')
        .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
        .join('\n');
      textAreaAddFuel.current.setNativeProps({ text: newText });
    }
  };


  const handleAddPortTextChange = () => {
    const textAreaValue = textAreaAddPort.current?.value;
    if (textAreaValue) {
      const newText = textAreaValue
        .split('\n')
        .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
        .join('\n');
      textAreaAddPort.current.setNativeProps({ text: newText });
    }
  };

  const handleAddPortCodeTextChange = () => {
    const newText = textAreaAddPortCode.current?.value?.toUpperCase();
    textAreaAddPortCode.current?.setNativeProps({ text: newText });
    // Remove any non-numeric characters
  };

  const handleAddSalesTextChange = () => {
    const textAreaValue = textAreaAddSales.current?.value;
    if (textAreaValue) {
      const newText = textAreaValue
        .split('\n')
        .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
        .join('\n');
      textAreaAddSales.current.setNativeProps({ text: newText });
    }
  };

  const handleAddSalesCodeTextChange = () => {
    const newText = textAreaAddSalesCode.current?.value?.toUpperCase();
    textAreaAddSalesCode.current?.setNativeProps({ text: newText });
  };

  const handleAddBuyerTextChange = () => {
    const textAreaValue = textAreaAddBuyer.current?.value;
    if (textAreaValue) {
      const newText = textAreaValue
        .split('\n')
        .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
        .join('\n');
      textAreaAddBuyer.current.setNativeProps({ text: newText });
    }
  };

  const handleAddBuyerCodeTextChange = (text) => {

    const numericValue = text.replace(/[^0-9\n]/g, '');

    // Update the value of the textarea while preventing new lines
    textAreaAddBuyerCode.current.value = numericValue;
  };

  const handleAddDriveTypeTextChange = () => {
    const textAreaValue = textAreaAddDriveType.current?.value;
    if (textAreaValue) {
      const newText = textAreaValue
        .split('\n')
        .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
        .join('\n');
      textAreaAddDriveType.current.setNativeProps({ text: newText });
    }
  };

  const handleAddBodyTypeTextChange = () => {
    const textAreaValue = textAreaAddBodyType.current?.value;
    if (textAreaValue) {
      const newText = textAreaValue
        .split('\n')
        .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
        .join('\n');
      textAreaAddBodyType.current.setNativeProps({ text: newText });
    }
  };


  const handleAddExteriorColorTextChange = () => {
    const textAreaValue = textAreaAddExteriorColor.current?.value;
    if (textAreaValue) {
      const newText = textAreaValue
        .split('\n')
        .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
        .join('\n');
      textAreaAddExteriorColor.current.setNativeProps({ text: newText });
    }
  };

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

  const handleInputRefNumChange = () => {
    const newText = inputRefNum.current?.value?.toUpperCase();
    inputRefNum.current?.setNativeProps({ text: newText });

    setRefNumFromSelects();
  };

  const handleInputChassisChange = () => {
    const newText = inputChassis.current?.value?.toUpperCase();
    inputChassis.current?.setNativeProps({ text: newText });

  };

  const handleInputModelCodeChange = () => {
    const newText = inputModelCode.current?.value?.toUpperCase();
    inputModelCode.current?.setNativeProps({ text: newText });

  };

  const handleInputEngineCodeChange = () => {
    const newText = inputEngineCode.current?.value?.toUpperCase();
    inputEngineCode.current?.setNativeProps({ text: newText });
  };

  const handleInputEngineDisChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the numeric value to a maximum of 4 characters
    const truncatedValue = numericValue.slice(0, 5);

    // Format the truncated numeric value with comma separator
    const formattedValue = Number(truncatedValue).toLocaleString();

    inputEngineDis.current.value = formattedValue;
  };

  const handleInputExpenseAmountChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the numeric value to a maximum of 4 characters
    const truncatedValue = numericValue.slice(0, 6);

    // Format the truncated numeric value with comma separator
    const formattedValue = Number(truncatedValue).toLocaleString();

    inputExpenseAmount.current.value = formattedValue;
  };


  const handleInputMileageChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the numeric value to a maximum of 4 characters
    const truncatedValue = numericValue.slice(0, 6);

    // Format the truncated numeric value with comma separator
    const formattedValue = Number(truncatedValue).toLocaleString();

    inputMileage.current.value = formattedValue;
  };

  const handleInputNumOfSeatsChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the numeric value to a maximum of 4 characters
    const truncatedValue = numericValue.slice(0, 3);

    // Format the truncated numeric value with comma separator
    const formattedValue = Number(truncatedValue).toLocaleString();

    inputNumOfSeats.current.value = formattedValue;
  };

  const handleInputDoorsChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the numeric value to a maximum of 4 characters
    const truncatedValue = numericValue.slice(0, 2);

    // Format the truncated numeric value with comma separator
    const formattedValue = Number(truncatedValue).toLocaleString();

    inputDoors.current.value = formattedValue;
  };

  const handleInputDimensionLengthChange = (text) => {
    // Remove any non-numeric characters and allow decimal points
    const numericValue = text.replace(/[^0-9.]/g, '');

    // Check if a dot already exists in the input
    const dotIndex = numericValue.indexOf('.');
    let truncatedValue;
    if (dotIndex !== -1) {
      // If a dot already exists, remove any additional dots
      truncatedValue = numericValue.slice(0, dotIndex + 1) + numericValue.slice(dotIndex).replace(/\./g, '');
    } else {
      truncatedValue = numericValue;
    }

    // Limit the numeric value to a maximum of 7 characters (4 digits, 1 decimal point, and 2 decimal places)
    truncatedValue = truncatedValue.slice(0, 7);

    // Format the truncated numeric value with comma separator
    const formattedValue = truncatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    inputDimensionLength.current.value = formattedValue;

    calculateCubicMeters();
  };


  const handleInputDimensionWidthChange = (text) => {
    // Remove any non-numeric characters and allow decimal points
    const numericValue = text.replace(/[^0-9.]/g, '');

    // Check if a dot already exists in the input
    const dotIndex = numericValue.indexOf('.');
    let truncatedValue;
    if (dotIndex !== -1) {
      // If a dot already exists, remove any additional dots
      truncatedValue = numericValue.slice(0, dotIndex + 1) + numericValue.slice(dotIndex).replace(/\./g, '');
    } else {
      truncatedValue = numericValue;
    }

    // Limit the numeric value to a maximum of 7 characters (4 digits, 1 decimal point, and 2 decimal places)
    truncatedValue = truncatedValue.slice(0, 7);

    // Format the truncated numeric value with comma separator
    const formattedValue = truncatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    inputDimensionWidth.current.value = formattedValue;

    calculateCubicMeters();
  };

  const handleInputDimensionHeightChange = (text) => {
    // Remove any non-numeric characters and allow decimal points
    const numericValue = text.replace(/[^0-9.]/g, '');

    // Check if a dot already exists in the input
    const dotIndex = numericValue.indexOf('.');
    let truncatedValue;
    if (dotIndex !== -1) {
      // If a dot already exists, remove any additional dots
      truncatedValue = numericValue.slice(0, dotIndex + 1) + numericValue.slice(dotIndex).replace(/\./g, '');
    } else {
      truncatedValue = numericValue;
    }

    // Limit the numeric value to a maximum of 7 characters (4 digits, 1 decimal point, and 2 decimal places)
    truncatedValue = truncatedValue.slice(0, 7);

    // Format the truncated numeric value with comma separator
    const formattedValue = truncatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    inputDimensionHeight.current.value = formattedValue;
    calculateCubicMeters();

  };

  const handleInputDimensionCubicMetersChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the numeric value to a maximum of 4 characters
    const truncatedValue = numericValue.slice(0, 6);

    // Format the truncated numeric value with comma separator
    const formattedValue = Number(truncatedValue).toLocaleString();

    inputDimensionCubicMeters.current.value = formattedValue;
    calculateCubicMeters();
  };

  const handleInputWeightChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');

    // Limit the numeric value to a maximum of 4 characters
    const truncatedValue = numericValue.slice(0, 5);

    // Format the truncated numeric value with comma separator
    const formattedValue = Number(truncatedValue).toLocaleString();

    inputWeight.current.value = formattedValue;
  };

  const monthNumbers = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12'
  ];

  const calculateCubicMeters = () => {
    const length = parseFloat(inputDimensionLength.current?.value?.replace(/,/g, '')) || 0;
    const width = parseFloat(inputDimensionWidth.current?.value?.replace(/,/g, '')) || 0;
    const height = parseFloat(inputDimensionHeight.current?.value?.replace(/,/g, '')) || 0;

    const result = (length * width * height) / 1000000;
    const resultFormatted = result.toFixed(2);

    // setCubicMeters(resultFormatted);
    inputDimensionCubicMeters.current.setNativeProps({ text: resultFormatted });
  };





  // useEffect(() => {

  //   let makeValue = makeVariable.text;

  //   if (makeValue !== '') {
  //     setCarNameFromSelects();
  //   }

  // }, [modelData]);


  const setRefNumFromSelects = () => {
    let portValue = portVariable.id;
    let stockIDValue = inputStockIDNumber.current?.value;
    let salesValue = salesVariable.id;
    let buyerValue = buyerVariable.id;

    // // Check and update regYearValue if it's "__NativebasePlaceholder__"
    // if (regYearValue === "__NativebasePlaceholder__") {
    //   regYearValue = "";
    // }

    // // Check and update makeValue if it's "__NativebasePlaceholder__"
    // if (makeValue === '') {
    //   makeValue = "";
    // }

    // // Check and update modelValue if it's "__NativebasePlaceholder__"
    // if (modelValue === '') {
    //   modelValue = "";
    // }

    // Concatenate the values to form the car name
    const carName = `${portValue}${stockIDValue}${salesValue}-${buyerValue}`;
    // Update the inputCarName ref value using setNativeProps
    // inputCarName.current.setNativeProps({ text: carName });
    inputRefNum.current.setNativeProps({ text: carName });
    referenceNumberVariable.text = carName;
    // console.log(carName);
  };


  const setCarNameFromSelects = () => {
    let regYearValue = regYearVariable.text;
    let makeValue = makeVariable.text;
    let modelValue = modelVariable.text;

    // // Check and update regYearValue if it's "__NativebasePlaceholder__"
    // if (regYearValue === "__NativebasePlaceholder__") {
    //   regYearValue = "";
    // }

    // // Check and update makeValue if it's "__NativebasePlaceholder__"
    // if (makeValue === '') {
    //   makeValue = "";
    // }

    // // Check and update modelValue if it's "__NativebasePlaceholder__"
    // if (modelValue === '') {
    //   modelValue = "";
    // }

    // Concatenate the values to form the car name
    const carName = `${regYearValue} ${makeValue} ${modelValue}`;
    // Update the inputCarName ref value using setNativeProps
    inputCarName.current.setNativeProps({ text: carName });

  };

  const setCarNameFromSelectsModel = () => {
    let regYearValue = regYearVariable.text;
    let makeValue = makeVariable.text;
    let modelValue = modelVariable.text;

    // // Check and update regYearValue if it's "__NativebasePlaceholder__"
    // if (regYearValue === "__NativebasePlaceholder__") {
    //   regYearValue = "";
    // }

    // // Check and update makeValue if it's "__NativebasePlaceholder__"
    // if (makeValue === '') {
    //   makeValue = "";
    // }

    // // Check and update modelValue if it's "__NativebasePlaceholder__"
    // if (modelValue === '') {
    //   modelValue = "";
    // }

    // Concatenate the values to form the car name
    const carName = `${regYearValue} ${makeValue} ${modelValue}`;
    // Update the inputCarName ref value using setNativeProps
    inputCarName.current.setNativeProps({ text: carName });


  };
  // const [selectedMake, setSelectedMake] = useState();


  // useEffect(() => {



  // }, []);

  const clearSelect = () => {
    // setModelData([]);

    // if (makeVariable.text !== '') {
    //   dispatch(setModelData([]));
    // }



    selectMakeRef.current.reset();
    selectModelRef.current.reset();
    selectRegYear.current.reset();
    selectRegMonth.current.reset();
    selectSteering.current.reset();
    selectTransmission.current.reset();
    selectExteriorColor.current.reset();
    selectFuel.current.reset();
    selectPort.current.reset();
    selectSales.current.reset();
    selectBuyer.current.reset();
    selectDriveType.current.reset();
    selectBodyType.current.reset();
    selectStockStatus.current.reset();


  };




  const [isOpen, setIsOpen] = useState(false);



  const ClearModalButton = ({ handleClear }) => {
    const [modalClearVisible, setModalClearVisible] = useState(false);

    const handleModalClearOpen = useCallback(() => {
      setModalClearVisible(true);


      // selectMakeRef.current.selectIndex(makeData.indexOf('TOYOTA'));
    }, []);

    const handleModalClearClose = useCallback(() => {
      setModalClearVisible(false);
    }, []);



    return (
      <>
        <Button
          borderRadius={3}
          flex={1}
          bgColor={'#D9D9D9'}
          onPress={handleModalClearOpen}
          _text={{ color: 'muted.500' }}
          _hover={{ bgColor: '#f0eded' }}
        >
          Clear
        </Button>

        <Modal isOpen={modalClearVisible} onClose={handleModalClearClose}>
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
              margin={5}
            >
              <Box flex={1}>
                <Text color={'amber.600'} bold>
                  Warning!
                </Text>
                <Text color={'amber.600'}>
                  Are you sure you want to clear all inputs? This action will clear all the fields and cannot be undone!
                </Text>
              </Box>
            </Modal.Body>
            <Modal.Footer borderTopWidth={0} bgColor={'amber.100'}>
              <HStack space={5} flex={1}>
                <Button
                  onPress={handleModalClearClose}
                  colorScheme={'warmGray'}
                  flex={1}
                  size={'sm'}
                  borderRadius={5}
                >
                  No
                </Button>
                <Button
                  onPress={() => {
                    handleModalClearClose();
                    handleClear();
                  }}
                  flex={1} size={'sm'} colorScheme={'amber'} borderRadius={5}>
                  Clear
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </>
    );
  };




  const SelectFeaturesButton = () => {
    const [featuresModalVisible, setFeaturesModalVisible] = useState(false);
    const [featuresClearModalVisible, setClearModalVisible] = useState(false);

    const [key, setKey] = useState(resetKey);


    const handleModalSelectFeaturesOpen = () => {
      setFeaturesModalVisible(true);
    };

    const handleModalSelectFeaturesClose = () => {
      setFeaturesModalVisible(false);
    };

    const handleClearModalOpen = () => {
      setClearModalVisible(true);
    };

    const handleClearModalClose = () => {
      setClearModalVisible(false);
    };

    return (
      <>
        <Button
          borderRadius={3}
          flex={1}
          onPress={handleModalSelectFeaturesOpen}
          variant={'outline'}
          _text={{ color: 'black', }}
          leftIcon={<MaterialCommunityIcons name="car-info" size={20} color="black" />}>

          Select Features
        </Button>

        <Modal
          isOpen={featuresModalVisible}
          onClose={handleModalSelectFeaturesClose} size={'full'} useRNModal>
          <Modal.Content bgColor={'white'} w={'80%'} h={'80%'}>
            <Modal.CloseButton />
            {/* <Modal.Header borderBottomWidth={0} bgColor={'white'}>
              <Text color={'#102A43'} bold>
                Features
              </Text>
            </Modal.Header> */}
            {/* <Modal.Body
              justifyContent={'center'}
              alignItems={'center'}
              bgColor={'white'}
              flex={1}
              h={'100%'}
            > */}
            <ScrollView flex={1} flexDirection={'column'} margin={10}>

              {/* <Box bgColor={'#7b9cff'} borderColor={isNoFeaturesSelected} borderWidth={'1'} marginTop={1} ref={featureBoxRef}>
                  <Text color={'white'} bold fontSize={20} width={'full'}> Features</Text>
                </Box> */}

              <Box>
                <Text color={'black'} bold fontSize={16} width={'full'}> Safety System</Text>
              </Box>


              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.SafetySystemAnBrSy} key={`SafetySystemAnBrSy-${resetKey}`} label="Anti-Lock Braking System (ABS)" onChange={(checked) => featuresState.SafetySystemAnBrSy = checked} />
                <CheckBoxButton variable={featuresState.SafetySystemDrAi} key={`SafetySystemDrAi-${resetKey}`} label="Driver Airbag" onChange={(checked) => featuresState.SafetySystemDrAi = checked} />
                <CheckBoxButton variable={featuresState.SafetySystemPaAi} key={`SafetySystemPaAi-${resetKey}`} label="Passenger Airbag" onChange={(checked) => featuresState.SafetySystemPaAi = checked} />
                <CheckBoxButton variable={featuresState.SafetySystemSiAi} key={`SafetySystemSiAi-${resetKey}`} label="Side Airbag" onChange={(checked) => featuresState.SafetySystemSiAi = checked} />
              </Box>

              <Box>
                <Text color={'black'} marginLeft={1} bold fontSize={16} width={'full'}>Comfort</Text>
              </Box>

              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.ComfortAiCoFr} key={`ComfortAiCoFr-${resetKey}`} label="Air Conditioner (Front)" onChange={(checked) => featuresState.ComfortAiCoFr = checked} />
                <CheckBoxButton variable={featuresState.ComfortAiCoRe} key={`ComfortAiCoRe-${resetKey}`} label="Air Conditioner (Rear)" onChange={(checked) => featuresState.ComfortAiCoRe = checked} />
                <CheckBoxButton variable={featuresState.ComfortAMFMRa} key={`ComfortAMFMRa-${resetKey}`} label="AM/FM Radio" onChange={(checked) => featuresState.ComfortAMFMRa = checked} />
                <CheckBoxButton variable={featuresState.ComfortAMFMSt} key={`ComfortAMFMSt-${resetKey}`} label="AM/FM Stereo" onChange={(checked) => featuresState.ComfortAMFMSt = checked} />
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.ComfortCDPl} key={`ComfortCDPl-${resetKey}`} label="CD Player" onChange={(checked) => featuresState.ComfortCDPl = checked} />
                <CheckBoxButton variable={featuresState.ComfortCDCh} key={`ComfortCDCh-${resetKey}`} label="CD Changer" onChange={(checked) => featuresState.ComfortCDCh = checked} />
                <CheckBoxButton variable={featuresState.ComfortCrSpCo} key={`ComfortCrSpCo-${resetKey}`} label="Cruise Speed Control" onChange={(checked) => featuresState.ComfortCrSpCo = checked} />
                <CheckBoxButton variable={featuresState.ComfortDiSp} key={`ComfortDiSp-${resetKey}`} label="Digital Speedometer" onChange={(checked) => featuresState.ComfortDiSp = checked} />
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.ComfortDVDPl} key={`ComfortDVDPl-${resetKey}`} label="DVD Player" onChange={(checked) => featuresState.ComfortDVDPl = checked} />
                <CheckBoxButton variable={featuresState.ComfortHDD} key={`ComfortHDD-${resetKey}`} label="Hard Disk Drive" onChange={(checked) => featuresState.ComfortHDD = checked} />
                <CheckBoxButton variable={featuresState.ComfortNaSyGPS} key={`ComfortNaSyGPS-${resetKey}`} label="Navigation System (GPS)" onChange={(checked) => featuresState.ComfortNaSyGPS = checked} />
                <CheckBoxButton variable={featuresState.ComfortPoSt} key={`ComfortPoSt-${resetKey}`} label="Power Steering" onChange={(checked) => featuresState.ComfortPoSt = checked} />
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.ComfortPrAuSy} key={`ComfortPrAuSy-${resetKey}`} label="Premium Audio System" onChange={(checked) => featuresState.ComfortPrAuSy = checked} />
                <CheckBoxButton variable={featuresState.ComfortReKeSy} key={`ComfortReKeSy-${resetKey}`} label="Remote Keyless System" onChange={(checked) => featuresState.ComfortReKeSy = checked} />
                <CheckBoxButton variable={featuresState.ComfortTiStWh} key={`ComfortTiStWh-${resetKey}`} label="Tilt Steering Wheel" onChange={(checked) => featuresState.ComfortTiStWh = checked} />
                <TouchableOpacity pressDuration={0} style={{ flex: 1, justifyContent: 'center', }} disabled><Box justifyContent="center" alignItems="center" borderRadius={3} flex={1} disabled bgColor={'white'} margin={1}></Box></TouchableOpacity>
              </Box>


              <Box>
                <Text color={'black'} marginLeft={1} bold fontSize={16} width={'full'}>Interior</Text>
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.InteriorLeSe} key={`InteriorLeSe-${resetKey}`} label="Leather Seats" onChange={(checked) => featuresState.InteriorLeSe = checked} />
                <CheckBoxButton variable={featuresState.InteriorPoDoLo} key={`InteriorPoDoLo-${resetKey}`} label="Power Door Locks" onChange={(checked) => featuresState.InteriorPoDoLo = checked} />
                <CheckBoxButton variable={featuresState.InteriorPoMi} key={`InteriorPoMi-${resetKey}`} label="Power Mirrors" onChange={(checked) => featuresState.InteriorPoMi = checked} />
                <CheckBoxButton variable={featuresState.InteriorPoSe} key={`InteriorPoSe-${resetKey}`} label="Power Seats" onChange={(checked) => featuresState.InteriorPoSe = checked} />
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.InteriorPoWi} key={`InteriorPoWi-${resetKey}`} label="Power Windows" onChange={(checked) => featuresState.InteriorPoWi = checked} />
                <CheckBoxButton variable={featuresState.InteriorReWiDe} key={`InteriorReWiDe-${resetKey}`} label="Rear Window Defroster" onChange={(checked) => featuresState.InteriorReWiDe = checked} />
                <CheckBoxButton variable={featuresState.InteriorReWiWi} key={`InteriorReWiWi-${resetKey}`} label="Rear Window Wiper" onChange={(checked) => featuresState.InteriorReWiWi = checked} />
                <CheckBoxButton variable={featuresState.InteriorThRoSe} key={`InteriorThRoSe-${resetKey}`} label="Third Row Seats" onChange={(checked) => featuresState.InteriorThRoSe = checked} />
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.InteriorTiGl} key={`InteriorTiGl-${resetKey}`} label="Tinted Glasses" onChange={(checked) => featuresState.InteriorTiGl = checked} />
                <TouchableOpacity pressDuration={0} style={{ flex: 1, justifyContent: 'center', }} disabled><Box justifyContent="center" alignItems="center" borderRadius={3} flex={1} disabled bgColor={'white'} margin={1}></Box></TouchableOpacity>
                <TouchableOpacity pressDuration={0} style={{ flex: 1, justifyContent: 'center', }} disabled><Box justifyContent="center" alignItems="center" borderRadius={3} flex={1} disabled bgColor={'white'} margin={1}></Box></TouchableOpacity>
                <TouchableOpacity pressDuration={0} style={{ flex: 1, justifyContent: 'center', }} disabled><Box justifyContent="center" alignItems="center" borderRadius={3} flex={1} disabled bgColor={'white'} margin={1}></Box></TouchableOpacity>
              </Box>

              <Box >
                <Text color={'black'} marginLeft={1} bold fontSize={16} width={'full'}>Exterior</Text>
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.ExteriorAlWh} key={`ExteriorAlWh-${resetKey}`} label="Alloy Wheels" onChange={(checked) => featuresState.ExteriorAlWh = checked} />
                <CheckBoxButton variable={featuresState.ExteriorPoSlDo} key={`ExteriorPoSlDo-${resetKey}`} label="Power Sliding Door" onChange={(checked) => featuresState.ExteriorPoSlDo = checked} />
                <CheckBoxButton variable={featuresState.ExteriorSuRo} key={`ExteriorSuRo-${resetKey}`} label="Sunroof" onChange={(checked) => featuresState.ExteriorSuRo = checked} />
                <TouchableOpacity pressDuration={0} style={{ flex: 1, justifyContent: 'center', }} disabled><Box justifyContent="center" alignItems="center" borderRadius={3} flex={1} disabled bgColor={'white'} margin={1}></Box></TouchableOpacity>
              </Box>

              <Box >
                <Text color={'black'} marginLeft={1} bold fontSize={16} width={'full'}>Selling Points</Text>
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.SellingPointsCuWh} key={`SellingPointsCuWh-${resetKey}`} label="Customized Wheels" onChange={(checked) => featuresState.SellingPointsCuWh = checked} />
                <CheckBoxButton variable={featuresState.SellingPointsFuLo} key={`SellingPointsFuLo-${resetKey}`} label="Fully Loaded" onChange={(checked) => featuresState.SellingPointsFuLo = checked} />
                <CheckBoxButton variable={featuresState.SellingPointsMaHiAv} key={`SellingPointsMaHiAv-${resetKey}`} label="Maintenance History Available" onChange={(checked) => featuresState.SellingPointsMaHiAv = checked} />
                <CheckBoxButton variable={featuresState.SellingPointsBrNeTi} key={`SellingPointsBrNeTi-${resetKey}`} label="Brand New Tires" onChange={(checked) => featuresState.SellingPointsBrNeTi = checked} />
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.SellingPointsNoAcHi} key={`SellingPointsNoAcHi-${resetKey}`} label="No Accident History" onChange={(checked) => featuresState.SellingPointsNoAcHi = checked} />
                <CheckBoxButton variable={featuresState.SellingPointsNoSmPrOw} key={`SellingPointsNoSmPrOw-${resetKey}`} label="Non-Smoking Previous Owner" onChange={(checked) => featuresState.SellingPointsNoSmPrOw = checked} />
                <CheckBoxButton variable={featuresState.SellingPointsOnOwHi} key={`SellingPointsOnOwHi-${resetKey}`} label="One Owner History" onChange={(checked) => featuresState.SellingPointsOnOwHi = checked} />
                <CheckBoxButton variable={featuresState.SellingPointsPeRaTi} key={`SellingPointsPeRaTi-${resetKey}`} label="Performance-rated Tires" onChange={(checked) => featuresState.SellingPointsPeRaTi = checked} />
              </Box>
              <Box flex={1} flexDir={'row'}>
                <CheckBoxButton variable={featuresState.SellingPointsReBo} key={`SellingPointsReBo-${resetKey}`} label="Repainted Body" onChange={(checked) => featuresState.SellingPointsReBo = checked} />
                <CheckBoxButton variable={featuresState.SellingPointsTuEn} key={`SellingPointsTuEn-${resetKey}`} label="Turbo Engine" onChange={(checked) => featuresState.SellingPointsTuEn = checked} />
                <CheckBoxButton variable={featuresState.SellingPointsUpAuSy} key={`SellingPointsUpAuSy-${resetKey}`} label="Upgraded Audio System" onChange={(checked) => featuresState.SellingPointsUpAuSy = checked} />
                <TouchableOpacity pressDuration={0} style={{ flex: 1, justifyContent: 'center', }} disabled><Box justifyContent="center" alignItems="center" borderRadius={3} flex={1} disabled bgColor={'white'} margin={1}></Box></TouchableOpacity>
              </Box>
            </ScrollView>
            <HStack space={5} width={'full'} justifyContent={'space-between'}>
              <Button
                onPress={() => {
                  handleClearModalOpen();
                }}
                colorScheme={'gray'}
                size={'sm'}
                borderRadius={5}
                margin={1}
                flex={1}
              >
                Clear
              </Button>
              <Box flex={2} />
              <Button
                onPress={handleModalSelectFeaturesClose}
                colorScheme={'primary'}
                size={'sm'}
                borderRadius={5}
                margin={1}
                flex={1}
              >
                Ok
              </Button>
            </HStack>
            {/* </Modal.Body> */}
            {/* <Modal.Footer borderTopWidth={0} bgColor={'white'}>
              <HStack space={5} flex={1}>
                <Button
                  onPress={handleModalSelectFeaturesClose}
                  colorScheme={'warmGray'}
                  size={'sm'}
                  borderRadius={5}
                >
                  Ok
                </Button>
              </HStack>
            </Modal.Footer> */}
          </Modal.Content>
        </Modal>

        <Modal isOpen={featuresClearModalVisible} onClose={handleClearModalClose} useRNModal>
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
              margin={5}
            >
              <Box flex={1}>
                <Text color={'amber.600'} bold>
                  Warning!
                </Text>
                <Text color={'amber.600'}>
                  Are you sure you want to clear?
                </Text>
              </Box>
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
                    handleClearToggleButton();
                    setKey(resetKey++);
                    handleClearModalClose();
                  }}
                  flex={1} size={'sm'} colorScheme={'amber'} borderRadius={5}>
                  Clear
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>



      </>
    );
  };

  const handleClearImagesExtra = () => {
    dispatch(setSelectedImages([]));
    globalSelectedImages = [];
    dispatch(setIsAddPhotoVisible(true));
    dispatch(setAddAnotherImages(false));
    dispatch(setDeleteImageVisible(true));
  };

  const UploadModalButton = ({ handleUpload }) => {
    const [modalUploadVisible, setModalUploadVisible] = useState(false);
    const handleModalUploadOpen = () => {
      setModalUploadVisible(true);
    };

    const handleModalUploadClose = () => {
      setModalUploadVisible(false);
    };

    return (
      <>
        <Button
          borderRadius={3}
          flex={1}
          onPress={handleModalUploadOpen}
          bgColor={'#7B9CFF'}
          _hover={{ bgColor: '#517cfc', }}>
          Upload/Save
        </Button>

        <Modal isOpen={modalUploadVisible} onClose={handleModalUploadClose}>
          <Modal.Content bgColor={'white'}>
            <Modal.CloseButton />
            <Modal.Header borderBottomWidth={0} bgColor={'white'}>
              <Text color={'#102A43'} bold>
                Upload/Save
              </Text>
            </Modal.Header>
            <Modal.Body
              justifyContent={'center'}
              alignItems={'center'}
              bgColor={'gray.300'}
              borderLeftWidth={4}
              borderLeftColor={'black'}
              margin={5}
            >
              <Box flex={1}>
                <Text color={'black'} bold>
                  Attention!
                </Text>
                <Text color={'black'}>
                  Are you sure you want to upload/save? This action will upload a new vehicle to the list and can be edited later.
                </Text>
              </Box>
            </Modal.Body>
            <Modal.Footer borderTopWidth={0} bgColor={'white'}>
              <HStack space={5} flex={1}>
                <Button
                  onPress={handleModalUploadClose}
                  colorScheme={'warmGray'}
                  flex={1}
                  size={'sm'}
                  borderRadius={5}
                >
                  No
                </Button>
                <Button isLoading={isLoading} onPress={async () => {
                  await handleUpload();
                  handleModalUploadClose()
                }}
                  flex={1} size={'sm'} colorScheme={'primary'} borderRadius={5}>
                  Upload/Save
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </>
    );
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

  const handleSuccessModalClose = useCallback(() => {
    dispatch(setIsSuccessModalOpen(false));
  }, []);

  const handleUpdateSuccessModalClose = useCallback(() => {
    dispatch(setIsUpdateSuccessModalOpen(false));
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
    },
  });

  const handleSetBordersWhite = () => {


    setIsNoFeaturesSelected('white');

    setMakeError('white');
    setModelError('white');
    setRegYearError('white');
    setRegMonthError('white');
    setRefNumError('white');
    setStockIDNumError('white');
    setChassisError('white');
    setModelCodeError('white');
    setEngineDisError('white');
    setSteeringError('white');
    setMileageError('white');
    setTransmissionError('white');
    setExteriorColoError('white');
    setNumOfSeatsError('white');
    setDoorsError('white');
    setPurchasedPriceError('white');
    setFuelError('white');
    setPortError('white');
    setSalesError('white');
    setBuyerError('white');
    setDimensionLengthError('white');
    setDimensionWidthError('white');
    setDimensionHeightError('white');
    setDriveTypeError('white');
    setWeightError('white');
    setBodyTypeError('white');
    setStockStatusError('white');
    setCarNameError('muted.500');

    setIsNoFeaturesSelected('white');


  };
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
          borderBottomColor={'cyan.500'} >

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

          <View style={{ alignItems: 'center', flex: 1 }}>
            <QRCodeScanner />
          </View>

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


          {/* Main Content */}

          <Box flex={1} flexGrow={1} minHeight={0}>
            {/* Main Content Content */}



            <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }}>
              <PresenceTransition visible={true} initial={{
                opacity: 0,
              }} animate={{
                opacity: 1,
                transition: {
                  duration: 250
                }
              }}>


                <Box px="3" bgColor="#A6BCFE" height="full" flexDir={'column'}>


                  <Box bgColor='#A6BCFE' w='100%' margin={1} flexDirection={'column'} paddingBottom={[10, 10, 10, 0, 0, 0]}>

                  </Box>



                  <Box bgColor='#A6BCFE' w='100%' margin={1} flexDirection={'column'} >


                    <Box flexDir={['column', 'column', 'column', 'column', 'row', 'row']} height={'full'} flex={1} display={screenWidth < 1280 ? 'none' : 'flex'}>
                      <Box flexDir={'row'} flex={1}>
                        <Box margin={2} flex={1} flexDir={['column']} >


                          <Box borderColor={'white'} borderWidth={1} ref={inputVehicleBoxRef}>

                            <Box flex={1} bgColor={'#7b9cff'} borderBottomColor={'white'} borderBottomWidth={'1'}>
                              <Text color={'white'} marginLeft={1} bold fontSize={20} width={'full'}>Input Vehicle Specification</Text>
                            </Box>

                            {/* <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
                            <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Stock ID Number</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                            <Box bgColor={'white'} flex={1} borderColor={stockIDNumError} borderWidth={1}><Input onSubmitEditing={() => buttonSearchRef.current?.handlePress()} defaultValue="" ref={inputStockIDNumber} onChangeText={handleInputStockIDNumberChange} placeholder=" Stock ID Number"
                              InputRightElement={
                                <StockIDNumber />
                              }
                            />
                            </Box>


                          </Box> */}

                            <StockIDAndMakeAndModel
                              selectStockStatus={selectStockStatus}
                              handleSetBordersWhite={handleSetBordersWhite}
                              handleClearIfError={handleClearIfError}
                              handleClearToggleButton={handleClearToggleButton}
                              inputFobUsd={inputFobUsd}
                              years={years}
                              monthNumbers={monthNumbers}
                              portData={portData}
                              salesData={salesData}
                              buyerData={buyerData}
                              steeringData={steeringData}
                              transmissionData={transmissionData}
                              exteriorColorData={exteriorColorData}
                              fuelData={fuelData}
                              driveTypeData={driveTypeData}
                              bodyTypeData={bodyTypeData}
                              selectPort={selectPort}
                              selectSales={selectSales}
                              selectBuyer={selectBuyer}
                              inputRefNum={inputRefNum}
                              inputChassis={inputChassis}
                              inputModelCode={inputModelCode}
                              inputEngineCode={inputEngineCode}
                              inputEngineDis={inputEngineDis}
                              selectSteering={selectSteering}
                              inputMileage={inputMileage}
                              selectTransmission={selectTransmission}
                              selectExteriorColor={selectExteriorColor}
                              inputNumOfSeats={inputNumOfSeats}
                              inputDoors={inputDoors}
                              inputPurchasedPrice={inputPurchasedPrice}
                              selectFuel={selectFuel}
                              inputDimensionLength={inputDimensionLength}
                              inputDimensionWidth={inputDimensionWidth}
                              inputDimensionHeight={inputDimensionHeight}
                              inputDimensionCubicMeters={inputDimensionCubicMeters}
                              selectDriveType={selectDriveType}
                              inputWeight={inputWeight}
                              selectBodyType={selectBodyType}
                              inputCarName={inputCarName}
                              inputCarDesc={inputCarDesc}
                              inputFobJpy={inputFobJpy}
                              selectRegYear={selectRegYear}
                              selectRegMonth={selectRegMonth}
                              setRefNumFromSelects={setRefNumFromSelects}
                              inputStockIDNumber={inputStockIDNumber}
                              stockIDNumError={stockIDNumError}
                              selectMakeForModelRef={selectMakeForModelRef}
                              textAreaAddModel={textAreaAddModel}
                              selectMakeForAddModelRef={selectMakeForAddModelRef}
                              handleAddMakeTextChange={handleAddMakeTextChange}
                              textAreaAddMake={textAreaAddMake}
                              modelError={modelError}
                              // makeData={makeData}
                              makeError={makeError}
                              selectMakeBoxRef={selectMakeBoxRef}
                              selectMakeRef={selectMakeRef}
                              selectModelRef={selectModelRef}
                              selectModelBoxRef={selectModelBoxRef}
                              setCarNameFromSelects={setCarNameFromSelects}
                              setCarNameFromSelectsModel={setCarNameFromSelectsModel}
                              inputCarNotes={inputCarNotes}
                              inputCarMemo={inputCarMemo}
                              purchasedPriceError={purchasedPriceError}
                              handleInputPurchasedPriceChange={handleInputPurchasedPriceChange}
                            />



                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'}>
                              <Box flexDir={'row'} bgColor={'#8096D7'} flex={2} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Registration Year & Month</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box ref={selectRegYearBoxRef} bgColor={'white'} flex={1} borderColor={regYearError} borderWidth={1}>

                                <SelectDropdown
                                  ref={selectRegYear}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={years}
                                  onSelect={useCallback((selectedItem) => {
                                    regYearVariable.text = selectedItem;
                                    // console.log(regYearVariable.text);
                                    setCarNameFromSelects()

                                  }, [])}
                                  defaultButtonText="-- Choose Year --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder="Year"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search

                                />


                              </Box>
                              <Box ref={selectRegMonthBoxRef} bgColor={'white'} flex={1} borderColor={regMonthError} borderWidth={1}>


                                <SelectDropdown
                                  ref={selectRegMonth}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={monthNumbers}
                                  onSelect={useCallback((selectedItem) => {
                                    regMonthVariable.text = selectedItem;
                                    // console.log(regMonthVariable.text);

                                  }, [])}
                                  defaultButtonText="--Choose Month--"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder="Month"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                    outlineStyle: 'none',
                                  }}
                                  disableAutoScroll
                                  search

                                />

                              </Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'} >
                              <Box alignSelf={'center'} flex={1} flexDir={'row'} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Port</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
                                {/* <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1} ><TouchableOpacity onPress={handleModalPortOpen}><Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" /></TouchableOpacity></Box> */}
                                <PSBSortAndAddModal
                                  docName={'Port'}
                                  handleAddTextChange={handleAddPortTextChange}
                                  handleAddCodeTextChange={handleAddPortCodeTextChange}
                                  textAreaAddCode={textAreaAddPortCode}
                                  textAreaAdd={textAreaAddPort}
                                  title='Port'
                                  dataName={'port'}
                                  databaseInit={projectExtensionFirestore}
                                  headerText="Rearrange/Add Port"
                                  data={portData} />
                              </Box>
                              <Box ref={selectPortBoxRef} bgColor={'white'} flex={1} borderColor={portError} borderWidth={1}>

                                <SelectDropdown
                                  ref={selectPort}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={portData.map((item) => item)}
                                  onSelect={useCallback((selectedItem) => {
                                    portVariable.text = selectedItem.name;
                                    portVariable.id = selectedItem.id;
                                    setRefNumFromSelects();
                                  }, [])}
                                  defaultButtonText="-- Choose Port --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem.name;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item.name;
                                  }}
                                  searchPlaceHolder=" Search for Port"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search
                                />
                              </Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'} >
                              <Box alignSelf={'center'} flex={1} flexDir={'row'} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Sales In Charge</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
                                {/* <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1} ><TouchableOpacity onPress={handleModalPortOpen}><Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" /></TouchableOpacity></Box> */}
                                <PSBSortAndAddModal
                                  docName={'Sales'}
                                  handleAddTextChange={handleAddSalesTextChange}
                                  handleAddCodeTextChange={handleAddSalesCodeTextChange}
                                  textAreaAddCode={textAreaAddSalesCode}
                                  textAreaAdd={textAreaAddSales}
                                  title='Sales'
                                  dataName={'sales'}
                                  databaseInit={projectExtensionFirestore}
                                  headerText="Rearrange/Add Sales"
                                  data={salesData} />
                              </Box>
                              <Box ref={selectSalesBoxRef} bgColor={'white'} flex={1} borderColor={salesError} borderWidth={1}>

                                <SelectDropdown
                                  ref={selectSales}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={salesData.map((item) => item)}
                                  onSelect={useCallback((selectedItem) => {
                                    salesVariable.text = selectedItem.name;
                                    salesVariable.id = selectedItem.id;
                                    setRefNumFromSelects();
                                  }, [])}
                                  defaultButtonText="-- Choose Sales --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem.name;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item.name;
                                  }}
                                  searchPlaceHolder=" Search for Sales"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search
                                />
                              </Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'} >
                              <Box alignSelf={'center'} flex={1} flexDir={'row'} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Buyer In Charge</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
                                {/* <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1} ><TouchableOpacity onPress={handleModalBuyerOpen}><Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" /></TouchableOpacity></Box> */}
                                <PSBSortAndAddModal
                                  docName={'Buyer'}
                                  handleAddTextChange={handleAddBuyerTextChange}
                                  handleAddCodeTextChange={handleAddBuyerCodeTextChange}
                                  textAreaAddCode={textAreaAddBuyerCode}
                                  textAreaAdd={textAreaAddBuyer}
                                  title='Buyer'
                                  dataName={'buyer'}
                                  databaseInit={projectExtensionFirestore}
                                  headerText="Rearrange/Add buyer"
                                  data={buyerData} />
                              </Box>
                              <Box ref={selectBuyerBoxRef} bgColor={'white'} flex={1} borderColor={buyerError} borderWidth={1}>

                                <SelectDropdown
                                  ref={selectBuyer}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={buyerData.map((item) => item)}
                                  onSelect={useCallback((selectedItem) => {
                                    buyerVariable.text = selectedItem.name;
                                    buyerVariable.id = selectedItem.id;
                                    setRefNumFromSelects();
                                  }, [])}
                                  defaultButtonText="-- Choose Buyer --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem.name;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item.name;
                                  }}
                                  searchPlaceHolder=" Search for Buyer"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search
                                />
                              </Box>
                            </Box>



                            {/* <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'}>
                            <Box bgColor={'#8096D7'} flex={1} justifyContent="center" alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Registration Month</Text></Box>
                            <Box bgColor={'white'} flex={1}><Input placeholder="Registration Month" /></Box>
                          </Box> */}

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Reference Number</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={refNumError} borderWidth={1}><Input defaultValue="" ref={inputRefNum} onChangeText={handleInputRefNumChange} placeholder=" Reference Number" /></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Chassis / Frame Number</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={chassisError} borderWidth={1}><Input defaultValue="" ref={inputChassis} onChangeText={handleInputChassisChange} placeholder=" Chassis / Frame Number" /></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Model Code</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={modelCodeError} borderWidth={1}><Input defaultValue="" ref={inputModelCode} onChangeText={handleInputModelCodeChange} placeholder=" Model Code" /></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Engine Code</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={'white'} borderWidth={1}><Input defaultValue="" ref={inputEngineCode} onChangeText={handleInputEngineCodeChange} placeholder=" Engine Code" /></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'} >
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Engine Displacement</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={engineDisError} borderWidth={1}><InputGroup><Input defaultValue="" keyboardType="numeric" ref={inputEngineDis} onChangeText={handleInputEngineDisChange} flex={1} placeholder=" Engine Displacement" /><InputRightAddon children={"cc"} /></InputGroup></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'}>
                              <Box bgColor={'#8096D7'} flex={1} flexDir={'row'}><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Steering</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
                                <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1}></Box>
                              </Box>
                              <Box ref={selectSteeringBoxRef} bgColor={'white'} flex={1} borderColor={steeringError} borderWidth={1}>
                                {/* <Select key={keySelectSteering} ref={selectSteering} accessibilityLabel="Choose Steering" placeholder="Choose Steering" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                              }}>
                                <Select.Item key={'Left'} label={'Left'} value={'Left'} />
                                <Select.Item key={'Right'} label={'Right'} value={'Right'} />
                              </Select> */}
                                <SelectDropdown
                                  ref={selectSteering}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={steeringData}
                                  onSelect={useCallback((selectedItem) => {
                                    steeringVariable.text = selectedItem;
                                    // console.log(steeringVariable.text);

                                  }, [])}
                                  defaultButtonText="-- Choose Steering --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder=" Search for Steering"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search

                                />

                              </Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
                              <Box flexDir={'row'} alignSelf={'center'} bgColor={'#8096D7'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Mileage</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={mileageError} borderWidth={1}><InputGroup><Input defaultValue="" keyboardType="numeric" ref={inputMileage} onChangeText={handleInputMileageChange} flex={1} placeholder=" Mileage" /><InputRightAddon children={"km"} /></InputGroup></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'}>
                              <Box flexDir={'row'} bgColor={'#8096D7'} flex={1} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Transmission</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
                                {/* <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1}><TouchableOpacity onPress={handleModalTransmissionOpen}><Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" /></TouchableOpacity></Box> */}
                                <SortAndAddModal docName={'Transmission'} handleAddTextChange={handleAddTransmissionTextChange} textAreaAdd={textAreaAddTransmission} title='Transmission' dataName={'transmission'} databaseInit={projectExtensionFirestore} headerText="Rearrange/Add Transmission" data={transmissionData} />
                              </Box>
                              <Box ref={selectTransmissionBoxRef} bgColor={'white'} flex={1} borderColor={transmissionError} borderWidth={1}>
                                {/* <Select key={keySelectTransmission} accessibilityLabel="Choose Transmission" placeholder="Choose Transmission" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                              }}>
                                {transmissionData.map((item, index) => (

                                  <Select.Item key={item} label={item} value={item} />

                                ))}
                              </Select> */}
                                <SelectDropdown
                                  ref={selectTransmission}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={transmissionData}
                                  onSelect={useCallback((selectedItem) => {
                                    transmissionVariable.text = selectedItem;
                                    // console.log(transmissionVariable.text);

                                  }, [])}
                                  defaultButtonText="-- Choose Transmission --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder=" Search for Transmission"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search

                                />
                              </Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'}>
                              <Box bgColor={'#8096D7'} flex={1} flexDir={'row'} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Exterior Color</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
                                {/* <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1}><TouchableOpacity onPress={handleModalExteriorColorOpen}><Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" /></TouchableOpacity></Box> */}
                                <SortAndAddModal
                                  docName='ExteriorColor'
                                  handleAddTextChange={handleAddExteriorColorTextChange}
                                  textAreaAdd={textAreaAddExteriorColor}
                                  title='Exterior Color'
                                  dataName={'exteriorColor'}
                                  databaseInit={projectExtensionFirestore}
                                  headerText="Rearrange/Add Transmission"
                                  data={transmissionData}
                                />
                              </Box>
                              <Box ref={selectExteriorColorBoxRef} bgColor={'white'} flex={1} borderColor={exteriorColoError} borderWidth={1}>

                                <SelectDropdown
                                  ref={selectExteriorColor}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={exteriorColorData}
                                  onSelect={useCallback((selectedItem) => {
                                    exteriorColorVariable.text = selectedItem;
                                    // console.log(exteriorColorVariable.text);

                                  }, [])}
                                  defaultButtonText="-- Choose Exterior Color --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder=" Search for Exterior Color"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search

                                />
                              </Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'} >
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Number of Seats</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={numOfSeatsError} borderWidth={1}><Input defaultValue="" keyboardType="numeric" ref={inputNumOfSeats} onChangeText={handleInputNumOfSeatsChange} placeholder=" Number of Seats" /></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Doors</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={doorsError} borderWidth={1}><Input defaultValue="" keyboardType="numeric" ref={inputDoors} onChangeText={handleInputDoorsChange} placeholder=" Doors" /></Box>
                            </Box>


                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'} >
                              <Box alignSelf={'center'} flex={1} flexDir={'row'} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Fuel</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
                                {/* <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1} ><TouchableOpacity onPress={handleModalFuelOpen}><Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" /></TouchableOpacity></Box> */}
                                <SortAndAddModal
                                  docName='Fuel'
                                  handleAddTextChange={handleAddFuelTextChange}
                                  textAreaAdd={textAreaAddFuel}
                                  title='Fuel'
                                  dataName={'fuel'}
                                  databaseInit={projectExtensionFirestore}
                                  headerText="Rearrange/Add Fuel"
                                  data={fuelData}
                                />
                              </Box>
                              <Box ref={selectFuelBoxRef} bgColor={'white'} flex={1} borderColor={fuelError} borderWidth={1}>
                                {/* <Select key={keySelectFuel} accessibilityLabel="Choose Fuel" placeholder="Choose Fuel" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                              }}>
                                {fuelData.map((item, index) => (

                                  <Select.Item key={item} label={item} value={item} />

                                ))}
                              </Select> */}
                                <SelectDropdown
                                  ref={selectFuel}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={fuelData}
                                  onSelect={useCallback((selectedItem) => {
                                    fuelVariable.text = selectedItem;
                                    // console.log(fuelVariable.text);

                                  }, [])}
                                  defaultButtonText="-- Choose Fuel --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder=" Search for Fuel"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search

                                />
                              </Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'}>
                              <Box flexDir={'row'} bgColor={'#8096D7'} alignSelf={'center'} flex={[1, 1, 1, 1, 2, 2]} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Dimension</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={dimensionLengthError} borderWidth={1}><InputGroup><Input defaultValue="" keyboardType="numeric" ref={inputDimensionLength} onChangeText={handleInputDimensionLengthChange} flex={1} placeholder="Length" /><InputRightAddon children={"cm"} /></InputGroup></Box>
                              <Box bgColor={'white'} flex={1} borderColor={dimensionWidthError} borderWidth={1}><InputGroup><Input defaultValue="" keyboardType="numeric" ref={inputDimensionWidth} onChangeText={handleInputDimensionWidthChange} flex={1} placeholder="Width" /><InputRightAddon children={"cm"} /></InputGroup></Box>
                              <Box bgColor={'white'} flex={1} borderColor={dimensionHeightError} borderWidth={1}><InputGroup><Input defaultValue="" keyboardType="numeric" ref={inputDimensionHeight} onChangeText={handleInputDimensionHeightChange} flex={1} placeholder="Height" /><InputRightAddon children={"cm"} /></InputGroup></Box>
                              <Box bgColor={'white'} flex={1}><InputGroup><Input keyboardType="numeric" ref={inputDimensionCubicMeters} defaultValue="0.00" onChangeText={handleInputDimensionCubicMetersChange} bgColor={'muted.100'} disabled editable={false} flex={1} placeholder="Cubic Meters" /><InputRightAddon children={"m³"} /></InputGroup></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'}>
                              <Box bgColor={'#8096D7'} flex={1} flexDir={'row'} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Drive Type</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>
                                {/* <Box flex={1} justifyContent="center" alignItems={'flex-end'} marginRight={1}><TouchableOpacity onPress={handleModalDriveTypeOpen}><Icon as={<MaterialCommunityIcons name="playlist-edit" />} size={5} color="white" /></TouchableOpacity></Box> */}
                                <SortAndAddModal
                                  docName='DriveType'
                                  handleAddTextChange={handleAddDriveTypeTextChange}
                                  textAreaAdd={textAreaAddDriveType}
                                  title='Drive Type'
                                  dataName={'driveType'}
                                  databaseInit={projectExtensionFirestore}
                                  headerText="Rearrange/Add Drive Type"
                                  data={driveTypeData}
                                />
                              </Box>
                              <Box ref={selectDriveTypeBoxRef} bgColor={'white'} flex={1} borderColor={driveTypeError} borderWidth={1}>
                                {/* <Select key={keySelectDriveType} accessibilityLabel="Choose Drive Type" placeholder="Choose Drive Type" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                              }}>
                                {driveTypeData.map((item, index) => (

                                  <Select.Item key={item} label={item} value={item} />

                                ))}
                              </Select> */}
                                <SelectDropdown
                                  ref={selectDriveType}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={driveTypeData}
                                  onSelect={useCallback((selectedItem) => {
                                    driveTypeVariable.text = selectedItem;
                                    // console.log(driveTypeVariable.text);

                                  }, [])}
                                  defaultButtonText="-- Choose Drive Type --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder=" Search for Drive Type"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search

                                />
                              </Box>
                            </Box>
                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'1'} bgColor={'#8096D7'} >
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Weight</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={weightError} borderWidth={1}><InputGroup><Input defaultValue="" ref={inputWeight} keyboardType="numeric" onChangeText={handleInputWeightChange} flex={1} placeholder=" Weight" /><InputRightAddon children={"kg"} /></InputGroup></Box>
                            </Box>

                            <Box flexDir={'row'} borderBottomColor={'white'} borderBottomWidth={'0'}>
                              <Box bgColor={'#8096D7'} flex={1} flexDir={'row'} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Body Type</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text>

                                <SortAndAddModal
                                  docName='BodyType'
                                  handleAddTextChange={handleAddBodyTypeTextChange}
                                  textAreaAdd={textAreaAddBodyType}
                                  title='Body Type'
                                  dataName={'bodyType'}
                                  databaseInit={projectExtensionFirestore}
                                  headerText="Rearrange/Add Body Type"
                                  data={bodyTypeData}
                                />
                              </Box>
                              <Box ref={selectBodyTypeBoxRef} bgColor={'white'} flex={1} borderColor={bodyTypeError} borderWidth={1}>

                                <SelectDropdown
                                  ref={selectBodyType}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={bodyTypeData}
                                  onSelect={useCallback((selectedItem) => {
                                    bodyTypeVariable.text = selectedItem;
                                    // console.log(bodyTypeVariable.text);

                                  }, [])}
                                  defaultButtonText="-- Choose Body Type --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder=" Search for Body Type"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search

                                />
                              </Box>
                            </Box>
                            <Box flexDir={'row'} borderTopColor={'white'} borderTopWidth={'1'} bgColor={'#8096D7'} >
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Supply Chains Costs</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={'white'} borderWidth={1}>
                                <SupplyChainsCosts
                                  handleAddExpenseNameTextChange={handleAddExpenseNameTextChange}
                                  textAreaAddExpenseName={textAreaAddExpenseName}
                                  inputExpenseAmount={inputExpenseAmount}
                                  handleInputExpenseAmountChange={handleInputExpenseAmountChange}
                                  handleAddPaidToTextChange={handleAddPaidToTextChange}
                                  paidToData={paidToData}
                                  inputCarNotes={inputCarNotes}
                                /></Box>
                            </Box>

                            <Box flexDir={'row'} borderTopColor={'white'} borderTopWidth={'1'} bgColor={'#8096D7'} >
                              <Box flexDir={'row'} alignSelf={'center'} flex={1} alignItems={'flex-start'}><Text color={'white'} fontSize={[14, 14, 12, 12, 16, 18]}> Select Features</Text><Text color={'#D96437'} fontSize={[14, 14, 12, 12, 16, 18]}> *</Text></Box>
                              <Box bgColor={'white'} flex={1} borderColor={isNoFeaturesSelected} borderWidth={1}><SelectFeaturesButton /></Box>
                            </Box>


                            <Box flexDir={'row'} borderTopColor={'white'} borderTopWidth={'1'} bgColor={'#8096D7'} >
                              <Box bgColor={'#8096D7'} flex={1} flexDir={'row'} ><Text color={'white'} alignSelf={'center'} fontSize={[14, 14, 12, 12, 16, 18]}> Stock Status</Text>

                              </Box>
                              <Box ref={selectStockStatusBoxRef} bgColor={'white'} flex={1} borderColor={stockStatusError} borderWidth={1}>

                                <SelectDropdown
                                  ref={selectStockStatus}
                                  buttonStyle={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 4,
                                  }}
                                  buttonTextStyle={{
                                    textAlign: 'left',
                                    color: '#424242',
                                    fontSize: 12,
                                  }}
                                  dropdownStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2,
                                  }}
                                  rowStyle={{
                                    backgroundColor: '#FFFFFF',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                  }}
                                  rowTextStyle={{
                                    color: '#424242',
                                    fontSize: 16,
                                  }}
                                  data={stockStatusData}
                                  onSelect={useCallback((selectedItem) => {
                                    stockStatusVariable.text = selectedItem;
                                    // console.log(bodyTypeVariable.text);

                                  }, [])}
                                  defaultButtonText="-- Choose Stock Status --"
                                  buttonTextAfterSelection={(selectedItem) => {
                                    return selectedItem;
                                  }}
                                  renderDropdownIcon={(isOpened) => {
                                    return (
                                      <Ionicons
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#424242'}
                                        size={18}
                                      />
                                    );
                                  }}
                                  rowTextForSelection={(item) => {
                                    return item;
                                  }}
                                  searchPlaceHolder=" Search for Stock Status"
                                  searchInputStyle={{
                                    marginTop: 1,
                                    flex: 1,
                                    width: '100%',
                                  }}
                                  disableAutoScroll
                                  search

                                />
                              </Box>
                            </Box>



                          </Box>


                        </Box>

                      </Box>

                      <br /> <br /> <br /> <br />

                      <Box flex={1} bgColor='#A6BCFE' w='100%' margin={1} flexDirection={'column'} paddingBottom={[10, 10, 10, 0, 0, 0]}>
                        {/*=============================================================== Add Image(s)===============================================================*/}
                        <ImageUploader dragSortableViewRef={dragSortableViewRef} handleClearImagesExtra={handleClearImagesExtra} />

                      </Box>

                    </Box>

                  </Box>

                  <Box flex={1} margin={1} flexDirection={'column'} h={'full'} display={['none', 'none', 'none', 'none', 'flex', 'flex']}>
                    <Box h={'full'} w={'full'}>

                      <HStack flex={1}>
                        <Input
                          ref={inputCarName}
                          borderColor={carNameError}
                          placeholder="Car Name" margin={1} bgColor={'white'} borderWidth={1} placeholderTextColor={'muted.400'} flex={1} />
                        <HStack flex={1}>
                          <InputGroup flex={1}>
                            <InputLeftAddon bgColor={'#7B9CFF'} borderWidth={1} borderColor={'white'} _text={{ color: 'white' }} children={"Notes "} />
                            <Input flex={1} ref={inputCarNotes} borderColor={carNameError} placeholder="Note" bgColor={'white'} borderWidth={1} placeholderTextColor={'muted.400'} />
                          </InputGroup>
                        </HStack>
                      </HStack>

                      <HStack flex={2}>
                        <TextArea flex={1} ref={inputCarDesc} borderColor='muted.500' bgColor={'white'} placeholder="Car Description / Salespoint" borderWidth={1} placeholderTextColor={'muted.400'} margin={1} />
                        <HStack marginTop={1} flex={1}>
                          <InputGroup flex={1}>
                            <InputLeftAddon bgColor={'#7B9CFF'} borderWidth={1} borderColor={'white'} _text={{ color: 'white' }} color={'white'} children={"Memo"} />
                            <Input multiline flex={1} ref={inputCarMemo} borderColor={carNameError} placeholder="Memo" bgColor={'white'} borderWidth={1} placeholderTextColor={'muted.400'} />
                          </InputGroup>
                        </HStack>
                      </HStack>


                      <HStack>
                        <Input keyboardType="numeric" flex={1} ref={inputFobJpy} onChangeText={handleInputFobJpyChange} borderColor='muted.500' bgColor={'white'} InputLeftElement={<Icon as={<FontAwesome name="yen" />} size={5} ml="2" color="muted.400" />} placeholder="FOB Price" margin={1} borderWidth={1} placeholderTextColor={'muted.400'} />
                        <Input disabled ref={inputFobUsd} flex={1} borderColor='muted.500' bgColor={'white'} InputLeftElement={<Icon as={<FontAwesome name="dollar" />} size={5} ml="2" color="muted.400" />} placeholder="0" margin={1} borderWidth={1} placeholderTextColor={'muted.400'} />
                      </HStack>

                    </Box>
                  </Box>

                  <Box w={'full'} flexDir={'row'} margin={1} paddingBottom={10} paddingTop={10} display={screenWidth < 1280 ? 'none' : 'flex'}>
                    {/* <Button borderRadius={3} flex={1} bgColor={'#D9D9D9'} onPress={handleModalClearOpen} _text={{ color: 'muted.500', }} _hover={{ bgColor: '#f0eded', }}>Clear</Button> */}
                    <ClearModalButton handleClear={handleClear} />
                    <Button borderRadius={3} flex={1} bgColor={'#A6BCFE'} disabled></Button> <Button flex={1} bgColor={'#A6BCFE'} disabled></Button>
                    {/* <Button borderRadius={3} flex={1} bgColor={'#7B9CFF'} _hover={{ bgColor: '#517cfc', }}>Upload</Button> */}
                    <UploadModalButton handleUpload={handleUpload} />

                  </Box>

                </Box>
              </PresenceTransition>
            </ScrollView>

          </Box>
        </Box>
      </Box>


      <LoadingModal />
      {/* <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        backgroundColor="rgba(0, 0, 0, 0.5)"
        flex={1}
        display={isLoading ? '' : 'none'}
      >
        <Center flex={1}>
          <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner size="lg" color="white" />
            <Text color={'white'}>Loading, please wait!</Text>
          </Box>
        </Center>
      </Box> */}

      <UpdateSuccessModal onClose={handleUpdateSuccessModalClose} headerText={'Vehicle Updated!'} bodyText={'Vehicle was successfully updated!'} />
      <UploadSuccessModal onClose={handleSuccessModalClose} headerText={'Vehicle Added!'} bodyText={'Vehicle was successfully added! You can view it in the vehicle list.'} />
    </NativeBaseProvider>


  );
}



