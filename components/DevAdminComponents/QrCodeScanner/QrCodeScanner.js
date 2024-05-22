// QRCodeScanner.js
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
import Webcam from 'react-webcam';
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

import QRCode from 'react-native-qrcode-svg';

import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, setDoc, arrayUnion, updateDoc, query, getDocs, orderBy, startAfter, limit, where, endBefore, endAt, limitToLast, collectionGroup, increment } from 'firebase/firestore';
import { projectControlFirestore, projectControlAuth, projectExtensionFirestore, projectExtensionAuth, projectControlFirebase, projectExtensionFirebase } from '../../../crossFirebase';
import jsQR from 'jsqr';


let formattedIssuingDate = ''; // Initialize the variable outside the conditional rendering block
let formattedDueDate = '';

const mobileViewBreakpoint = 1367;

const QRCodeScanner = () => {
    const webcamRef = React.useRef(null);
    const [qrCode, setQrCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const screenWidth = Dimensions.get('window').width;

    // QR code scanning logic
    useEffect(() => {
        const intervalId = isScanning ? setInterval(() => {
            const video = webcamRef.current;
            if (video) {
                const canvas = document.createElement('canvas');
                canvas.width = video.video.videoWidth;
                canvas.height = video.video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video.video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    clearInterval(intervalId);
                    setIsScanning(false);
                    setQrCode(code.data);
                    console.log(code.data);

                }
            }
        }, 100) : null;

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isScanning]);

    const fetchInvoiceData = async (cryptoNumber) => {
        const q = query(collection(projectExtensionFirestore, 'IssuedInvoice'), where('cryptoNumber', '==', cryptoNumber));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setInvoiceData({ ...doc.data(), id: doc.id });
        });
        setModalVisible(true); // Show the modal after fetching the data
    };

    // Listen for QR code detection
    useEffect(() => {
        if (qrCode) {
            fetchInvoiceData(qrCode);
        }
    }, [qrCode]);

    const toggleScanning = () => {
        setIsScanning(!isScanning);

    };

    const handleModalClose = () => {
        setModalVisible(false);
        setQrCode('');
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

    const smallWidth = screenWidth < mobileViewBreakpoint ? 377 : 574;
    const smallHeight = screenWidth < mobileViewBreakpoint ? 541 : 903;

    const smallWidthScaleFactor = smallWidth / originalSmallWidth;
    const smallHeightScaleFactor = smallHeight / originalSmallHeight;

    const widthScaleFactor = newWidth / originalWidth;
    const heightScaleFactor = newHeight / originalHeight;

    const valueCurrency = 0.5;

    const convertedCurrency = (baseValue) => {
        if (invoiceData.selectedCurrencyExchange == 'None' || !invoiceData.selectedCurrencyExchange || invoiceData.selectedCurrencyExchange == 'USD') {
            return `$${Number(baseValue).toFixed(2).toLocaleString('en-US', { useGrouping: true })}`
        }
        if (invoiceData.selectedCurrencyExchange == 'EURO') {
            const euroValue = Number(baseValue) * Number(invoiceData.currency.usdToEur);
            return `€${(euroValue).toFixed(2).toLocaleString('en-US', { useGrouping: true })}`;
        }
        if (invoiceData.selectedCurrencyExchange == 'AUD') {
            const audValue = Number(baseValue) * Number(invoiceData.currency.usdToAud);
            return `A$${(audValue).toFixed(2).toLocaleString('en-US', { useGrouping: true })}`;
        }
        if (invoiceData.selectedCurrencyExchange == 'GBP') {
            const gbpValue = Number(baseValue) * Number(invoiceData.currency.usdToGbp);
            return `£${(gbpValue).toFixed(2).toLocaleString('en-US', { useGrouping: true })}`;
        }
        if (invoiceData.selectedCurrencyExchange == 'CAD') {
            const cadValue = Number(baseValue) * Number(invoiceData.currency.usdToCad);
            return `C$${(cadValue).toFixed(2).toLocaleString('en-US', { useGrouping: true })}`;
        }
    }

    const totalPriceCalculated = () => {

        const totalAdditionalPrice = invoiceData.paymentDetails.additionalPrice.reduce((total, price) => {
            const converted = Number(price); // Convert each price using your currency conversion function
            const numericPart = price.replace(/[^0-9.]/g, ''); // Remove non-numeric characters, assuming decimal numbers
            return total + parseFloat(numericPart); // Add the numeric value to the total
        }, 0);

        const totalUsd = ((Number(invoiceData.paymentDetails.fobPrice)
            + Number(invoiceData.paymentDetails.freightPrice)
            + (invoiceData.paymentDetails.inspectionIsChecked
                ? (Number(invoiceData.paymentDetails.inspectionPrice))
                : 0)
            + (invoiceData.paymentDetails.incoterms == 'CIF'
                ? Number(invoiceData.paymentDetails.insurancePrice)
                : 0)
            + totalAdditionalPrice))
            // * Number(invoiceData.currency.jpyToEur)
            ;


        const totalEur = ((Number(invoiceData.paymentDetails.fobPrice)
            + Number(invoiceData.paymentDetails.freightPrice)
            + (invoiceData.paymentDetails.inspectionIsChecked
                ? (Number(invoiceData.paymentDetails.inspectionPrice))
                : 0)
            + (invoiceData.paymentDetails.incoterms == 'CIF'
                ? Number(invoiceData.paymentDetails.insurancePrice)
                : 0)
            + totalAdditionalPrice)
            * Number(invoiceData.currency.usdToEur));


        // const totalEur = Number(invoiceData.paymentDetails.fobPrice) * Number(invoiceData.currency.usdToEur)
        //     + (valueCurrency * Number(invoiceData.currency.usdToEur))
        //     + Number(invoiceData.paymentDetails.freightPrice) * Number(invoiceData.currency.usdToEur)
        //     + (valueCurrency * Number(invoiceData.currency.usdToEur))
        //     + (invoiceData.paymentDetails.inspectionIsChecked
        //         ? (Number(invoiceData.paymentDetails.inspectionPrice) * Number(invoiceData.currency.usdToEur)
        //             + (valueCurrency * Number(invoiceData.currency.usdToEur)))
        //         : 0)
        //     + totalAdditionalPrice;

        const totalAud = ((Number(invoiceData.paymentDetails.fobPrice)
            + Number(invoiceData.paymentDetails.freightPrice)
            + (invoiceData.paymentDetails.inspectionIsChecked
                ? (Number(invoiceData.paymentDetails.inspectionPrice))
                : 0)
            + (invoiceData.paymentDetails.incoterms == 'CIF'
                ? Number(invoiceData.paymentDetails.insurancePrice)
                : 0)
            + totalAdditionalPrice)
            * Number(invoiceData.currency.usdToAud))

        const totalGbp = ((Number(invoiceData.paymentDetails.fobPrice)
            + Number(invoiceData.paymentDetails.freightPrice)
            + (invoiceData.paymentDetails.inspectionIsChecked
                ? (Number(invoiceData.paymentDetails.inspectionPrice))
                : 0)
            + (invoiceData.paymentDetails.incoterms == 'CIF'
                ? Number(invoiceData.paymentDetails.insurancePrice)
                : 0)
            + totalAdditionalPrice)
            * Number(invoiceData.currency.usdToGbp))

        const totalCad = ((Number(invoiceData.paymentDetails.fobPrice)
            + Number(invoiceData.paymentDetails.freightPrice)
            + (invoiceData.paymentDetails.inspectionIsChecked
                ? (Number(invoiceData.paymentDetails.inspectionPrice))
                : 0)
            + (invoiceData.paymentDetails.incoterms == 'CIF'
                ? Number(invoiceData.paymentDetails.insurancePrice)
                : 0)
            + totalAdditionalPrice)
            * Number(invoiceData.currency.usdToCad))

        if (invoiceData.selectedCurrencyExchange == 'None' || !invoiceData.selectedCurrencyExchange || invoiceData.selectedCurrencyExchange == 'USD') {
            return `$${Math.round(totalUsd).toLocaleString('en-US', { useGrouping: true })}`;
        }

        if (invoiceData.selectedCurrencyExchange == 'EURO') {
            return `€${Math.round(totalEur).toLocaleString('en-US', { useGrouping: true })}`;
        }
        if (invoiceData.selectedCurrencyExchange == 'AUD') {
            return `A$${Math.round(totalAud).toLocaleString('en-US', { useGrouping: true })}`;
        }
        if (invoiceData.selectedCurrencyExchange == 'GBP') {
            return `£${Math.round(totalGbp).toLocaleString('en-US', { useGrouping: true })}`;
        }
        if (invoiceData.selectedCurrencyExchange == 'CAD') {
            return `C$${Math.round(totalCad).toLocaleString('en-US', { useGrouping: true })}`;
        }

    }

    const PreviewInvoice = () => {

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
                        source={require('../../../assets/RMJ logo for invoice.png')}
                        style={{
                            width: 95 * smallWidthScaleFactor,
                            height: 85 * smallHeightScaleFactor,
                            resizeMode: 'stretch',
                        }}
                    />
                </View>

                <View style={{ position: 'absolute', alignSelf: 'center', top: 80 * smallHeightScaleFactor }}>
                    {/* Title */}

                    <Text style={{ fontWeight: 700, fontSize: 25 * smallWidthScaleFactor }}>{`INVOICE`}</Text>

                </View>

                <View style={{ position: 'absolute', right: 38 * smallWidthScaleFactor, top: 38 * smallHeightScaleFactor }}>
                    {/* QR CODE */}

                    <QRCode
                        value={invoiceData.cryptoNumber}
                        size={80 * smallWidthScaleFactor}
                        color="black"
                        backgroundColor="white"
                    />

                </View>

                <View style={{ position: 'absolute', right: 121 * smallWidthScaleFactor, top: 34 * smallHeightScaleFactor }}>
                    {/* Invoice Number */}
                    <Text style={{ fontWeight: 750, fontSize: 14 * smallWidthScaleFactor }}>{`Invoice No. RMJ-${invoiceData.id}`}</Text>
                </View>
                <View style={{ position: 'absolute', right: 121 * smallWidthScaleFactor, top: 49 * smallHeightScaleFactor, flexDirection: 'row' }}>
                    {/* Issuing Date */}
                    <Text style={{ fontWeight: 750, fontSize: 14 * smallWidthScaleFactor }}>{`Issuing Date: `}</Text>
                    <Text style={{ fontWeight: 400, fontSize: 14 * smallWidthScaleFactor }}>{`${formattedIssuingDate}`}</Text>
                </View>


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
                                    <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.notifyParty.address}`}</Text>
                                    <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.notifyParty.email}`}</Text>
                                    <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`${invoiceData.notifyParty.contactNumber}`}</Text>
                                    <Text style={{ fontWeight: 400, fontSize: 16 * smallWidthScaleFactor, marginTop: 6 * smallHeightScaleFactor, lineHeight: 14 * smallHeightScaleFactor }}>{`FAX: ${invoiceData.notifyParty.fax == '' ? 'N/A' : invoiceData.notifyParty.fax}`}</Text>
                                </>)}
                        </View>

                    </View>


                </View>


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

                </View>



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
                                {`${convertedCurrency((Number(invoiceData.paymentDetails.fobPrice)))}`}
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
                                {`${convertedCurrency(Number(invoiceData.paymentDetails.freightPrice))}`}
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
                                {invoiceData.paymentDetails.inspectionIsChecked ? `${convertedCurrency(Number(invoiceData.paymentDetails.inspectionPrice).toLocaleString('en-US', { useGrouping: true })).split('.')[0]}` : ' '}
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
                                    {invoiceData.paymentDetails.inspectionIsChecked ? `${convertedCurrency(Number(invoiceData.paymentDetails.inspectionPrice).toLocaleString('en-US', { useGrouping: true })).split('.')[0]}` : ' '}
                                    <Text
                                        style={{
                                            fontWeight: 400,
                                            fontSize: 12 * smallWidthScaleFactor,
                                            lineHeight: 14 * smallWidthScaleFactor,
                                            marginBottom: 3 * smallHeightScaleFactor,
                                        }}>
                                        {invoiceData.paymentDetails.incoterms === "CIF" ? ` + ${convertedCurrency(Number(invoiceData.paymentDetails.insurancePrice).toLocaleString('en-US', { useGrouping: true })).split('.')[0]}` : ' '}
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
                                    {invoiceData.paymentDetails.incoterms == "CIF" ? `${convertedCurrency(Number(invoiceData.paymentDetails.insurancePrice).toLocaleString('en-US', { useGrouping: true })).split('.')[0]}` : ' '}
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
                                    ? invoiceData.paymentDetails.additionalPrice.map(price => {
                                        const converted = convertedCurrency(Number(price));
                                        return converted;
                                    }).join(' + ')
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
                                            {`${totalPriceCalculated()}`}
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


                <View style={{ position: 'absolute', right: 39 * smallWidthScaleFactor, top: 835 * smallHeightScaleFactor, width: 300 * smallWidthScaleFactor, }}>
                    <View style={{
                        width: 300 * smallWidthScaleFactor,
                        alignItems: 'center',
                        paddingBottom: 80 * smallHeightScaleFactor, // Adjust this value to control space between image and line
                    }}>
                        <NativeImage
                            source={require('../../../assets/RMJ Invoice Signature with Hanko.png')}
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
                </View>


            </View>
        )
    }

    return (
        <View
            style={{
                paddingRight: 20,

            }}
        >
            {/* Modal for displaying invoice data */}
            <Modal
                isOpen={modalVisible}
                onClose={handleModalClose}
                size="lg"
                useRNModal
            >

                {invoiceData ? (
                    <PreviewInvoice />
                ) : (
                    <Text>No data available</Text>
                )}

            </Modal>


            <Modal isOpen={isScanning} onClose={() => setIsScanning(false)} size="lg" useRNModal>
                {isScanning &&
                    <View style={{ backgroundColor: 'black', }}>
                        <View style={{
                            backgroundColor: 'rgba(0,0,0, 0.3)',
                            padding: 8,
                            borderRadius: 5,
                            width: '100%',
                            alignSelf: 'center',
                            position: 'absolute',

                        }}>
                            <Text style={{
                                fontWeight: 700,
                                fontSize: 12,
                                color: 'white',
                                alignSelf: 'center',
                            }}>
                                {`Scan Invoice QR Code`}
                            </Text>
                        </View>


                        <Webcam
                            ref={webcamRef}
                            style={{
                                borderWidth: 2,
                                borderColor: 'white',
                                padding: 1,
                                borderRadius: 5,
                                marginTop: 2,
                                width: screenWidth < mobileViewBreakpoint ? 300 : 500,
                                height: screenWidth < mobileViewBreakpoint ? 300 : 500,
                            }}
                            videoConstraints={{ facingMode: "environment" }} />


                    </View>
                }

            </Modal>

            {/* {isScanning && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    width: 300, // Adjust according to your needs
                    height: 300, // Adjust according to your needs
                    borderRadius: 20,
                    overflow: 'hidden',
                }}>
                    <Webcam ref={webcamRef} style={styles.cameraView} videoConstraints={{ facingMode: "environment" }} />
                </View>
            )} */}

            <Pressable
                focusable={false}
                onPress={toggleScanning}
                style={{
                    padding: 10,
                    borderRadius: 5,
                }}>
                <MaterialCommunityIcons name='data-matrix-scan' size={30} color='white' />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    cameraContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -150 }], // Adjust based on your webcam view size
        width: 300, // Adjust according to your needs
        height: 300, // Adjust according to your needs
        borderRadius: 20,
        overflow: 'hidden',
    },
    cameraView: {
        width: '100%',
        height: '100%',
    },
});

export default QRCodeScanner;

