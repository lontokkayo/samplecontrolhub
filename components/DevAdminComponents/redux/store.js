import { configureStore, createSlice, } from '@reduxjs/toolkit'
import { useEffect, useMemo } from 'react';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc, arrayUnion, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { projectControlFirestore, projectControlAuth, projectExtensionFirestore, projectExtensionFirebase, projectControlFirebase } from "../../../crossFirebase";
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';

let makeDataVariable = [];
let email = '';


// =============================== Chat Messages ========================================
const profitCalculatorTotalAmountDollarsSlice = createSlice({
  name: 'profitCalculatorTotalAmountDollars',
  initialState: 50,
  reducers: {
    setProfitCalculatorTotalAmountDollars: (state, action) => {
      return action.payload
    },
  },
})

const messageTextInputHeightSlice = createSlice({
  name: 'messageTextInputHeight',
  initialState: 50,
  reducers: {
    setMessageTextInputHeight: (state, action) => {
      return action.payload
    },
  },
})


const messageTextInputValueSlice = createSlice({
  name: 'messageTextInputValue',
  initialState: '',
  reducers: {
    setMessageTextInputValue: (state, action) => {
      return action.payload
    },
  },
})


const carImageUrlSlice = createSlice({
  name: 'carImageUrl',
  initialState: '',
  reducers: {
    setCarImageUrl: (state, action) => {
      return action.payload
    },
  },
})


const selectedFileUrlSlice = createSlice({
  name: 'selectedFileUrl',
  initialState: '',
  reducers: {
    setSelectedFileUrl: (state, action) => {
      return action.payload
    },
  },
})

const pdfViewerModalVisibleSlice = createSlice({
  name: 'pdfViewerModalVisible',
  initialState: false,
  reducers: {
    setPdfViewerModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const selectedVehicleDataSlice = createSlice({
  name: 'selectedVehicleData',
  initialState: [],
  reducers: {
    setSelectedVehicleData: (state, action) => {
      return action.payload
    },
  },
})

const selectedCustomerDataSlice = createSlice({
  name: 'selectedCustomerData',
  initialState: [],
  reducers: {
    setSelectedCustomerData: (state, action) => {
      return action.payload
    },
  },
})

const previewInvoiceVisibleSlice = createSlice({
  name: 'previewInvoiceVisible',
  initialState: false,
  reducers: {
    setPreviewInvoiceVisible: (state, action) => {
      return action.payload
    },
  },
})

const customInvoiceVisibleSlice = createSlice({
  name: 'customInvoiceVisible',
  initialState: false,
  reducers: {
    setCustomInvoiceVisible: (state, action) => {
      return action.payload
    },
  },
})

const transactionModalVisibleSlice = createSlice({
  name: 'transactionModalVisible',
  initialState: false,
  reducers: {
    setTransactionModalVisible: (state, action) => {
      return action.payload
    },
  },
})


const invoiceDataSlice = createSlice({
  name: 'invoiceData',
  initialState: {},
  reducers: {
    setInvoiceData: (state, action) => {
      return action.payload
    },
  },
})

const deleteMessageTemplateVisibleSlice = createSlice({
  name: 'deleteMessageTemplateVisible',
  initialState: false,
  reducers: {
    setDeleteMessageTemplateVisible: (state, action) => {
      return action.payload
    },
  },
})

const loadMoreMessagesLoadingSlice = createSlice({
  name: 'loadMoreMessagesLoading',
  initialState: false,
  reducers: {
    setLoadMoreMessagesLoading: (state, action) => {
      return action.payload
    },
  },
})

const noMoreMessagesDataSlice = createSlice({
  name: 'noMoreMessagesData',
  initialState: false,
  reducers: {
    setNoMoreMessagesData: (state, action) => {
      return action.payload
    },
  },
})

const readByListModalVisibleSlice = createSlice({
  name: 'readByListModalVisible',
  initialState: false,
  reducers: {
    setReadByListModalVisible: (state, action) => {
      return action.payload
    },
  },
})


const selectedChatDataSlice = createSlice({
  name: 'selectedChatData',
  initialState: [],
  reducers: {
    setSelectedChatData: (state, action) => {
      return action.payload
    },
  },
})


const chatMessageBoxLoadingSlice = createSlice({
  name: 'chatMessageBoxLoading',
  initialState: false,
  reducers: {
    setChatMessageBoxLoading: (state, action) => {
      return action.payload
    },
  },
})

const chatMessagesDataSlice = createSlice({
  name: 'chatMessagesData',
  initialState: [],
  reducers: {
    setChatMessagesData: (state, action) => {
      return action.payload
    },
  },
})


const chatListSearchTextSlice = createSlice({
  name: 'chatListSearchText',
  initialState: '',
  reducers: {
    setChatListSearchText: (state, action) => {
      return action.payload
    },
  },
})


const activeChatIdSlice = createSlice({
  name: 'activeChatId',
  initialState: '',
  reducers: {
    setActiveChatId: (state, action) => {
      return action.payload
    },
  },
})

const loadMoreLoadingSlice = createSlice({
  name: 'loadMoreLoading',
  initialState: false,
  reducers: {
    setLoadMoreLoading: (state, action) => {
      return action.payload
    },
  },
})

const noMoreDataSlice = createSlice({
  name: 'noMoreData',
  initialState: false,
  reducers: {
    setNoMoreData: (state, action) => {
      return action.payload
    },
  },
})

const chatListLastVisibleSlice = createSlice({
  name: 'chatListLastVisible',
  initialState: null,
  reducers: {
    setChatListLastVisible: (state, action) => {
      return action.payload
    },
  },
})

const chatListDataSlice = createSlice({
  name: 'chatListData',
  initialState: [],
  reducers: {
    setChatListData: (state, action) => {
      return action.payload
    },
  },
})

const chatListImageUrlSlice = createSlice({
  name: 'chatListImageUrl',
  initialState: null,
  reducers: {
    setChatListImageUrl: (state, action) => {
      return action.payload
    },
  },
})


// =============================== Chat Messages ========================================



// =============================== Freight ========================================


const countryPortsDataSlice = createSlice({
  name: 'countryPortsData',
  initialState: [],
  reducers: {
    setCountryPortsData: (state, action) => {
      return action.payload
    },
  },
})


const addPortsForCountriesModalVisibleSlice = createSlice({
  name: 'addPortsForCountriesModalVisible',
  initialState: false,
  reducers: {
    setAddPortsForCountriesModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const methodDataSlice = createSlice({
  name: 'methodData',
  initialState: [],
  reducers: {
    setMethodData: (state, action) => {
      return action.payload
    },
  },
})


const inspectionIsRequiredDataSlice = createSlice({
  name: 'inspectionIsRequiredData',
  initialState: [],
  reducers: {
    setInspectionIsRequiredData: (state, action) => {
      return action.payload
    },
  },
})

const inspectionNameDataSlice = createSlice({
  name: 'inspectionNameData',
  initialState: [],
  reducers: {
    setInspectionNameData: (state, action) => {
      return action.payload
    },
  },
})


const deletePortModalVisibleSlice = createSlice({
  name: 'deletePortModalVisible',
  initialState: false,
  reducers: {
    setDeletePortModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const deleteCountryModalVisibleSlice = createSlice({
  name: 'deleteCountryModalVisible',
  initialState: false,
  reducers: {
    setDeleteCountryModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const addPortModalVisibleSlice = createSlice({
  name: 'addPortModalVisible',
  initialState: false,
  reducers: {
    setAddPortModalVisible: (state, action) => {
      return action.payload
    },
  },
})


const addCountryModalVisibleSlice = createSlice({
  name: 'addCountryModalVisible',
  initialState: false,
  reducers: {
    setAddCountryModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const selectedButtonSlice = createSlice({
  name: 'selectedButton',
  initialState: '',
  reducers: {
    setSelectedButton: (state, action) => {
      return action.payload
    },
  },
})

const freightCountriesDataSlice = createSlice({
  name: 'freightCountriesData',
  initialState: [],
  reducers: {
    setFreightCountriesData: (state, action) => {
      return action.payload
    },
  },
})

const freightPortsDataSlice = createSlice({
  name: 'freightPortsData',
  initialState: [],
  reducers: {
    setFreightPortsData: (state, action) => {
      return action.payload
    },
  },
})
// =============================== Freight ========================================


// =============================== Vehicle List ========================================

const fobHistoryDataSlice = createSlice({
  name: 'fobHistoryData',
  initialState: [],
  reducers: {
    setFobHistoryData: (state, action) => {
      return action.payload
    },
  },
})

const inputFobSlice = createSlice({
  name: 'inputFob',
  initialState: '',
  reducers: {
    setInputFob: (state, action) => {
      return action.payload
    },
  },
})

const fobPriceHistoryModalVisibleSlice = createSlice({
  name: 'fobPriceHistoryModalVisible',
  initialState: false,
  reducers: {
    setFobPriceHistoryModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const editVehicleModalVisibleSlice = createSlice({
  name: 'editVehicleModalVisible',
  initialState: false,
  reducers: {
    setEditVehicleModalVisible: (state, action) => {
      return action.payload
    },
  },
})


const vehicleListDataSlice = createSlice({
  name: 'vehicleListData',
  initialState: [],
  reducers: {
    setVehicleListData: (state, action) => {
      return action.payload
    },
  },
})

const addVehicleListDataSlice = createSlice({
  name: 'addVehicleListData',
  initialState: [],
  reducers: {
    setAddVehicleListData: (state, action) => {
      return action.payload
    },
  },
})

const supplyChainsCostsModalVisibleSlice = createSlice({
  name: 'supplyChainsCostsModalVisible',
  initialState: false,
  reducers: {
    setSupplyChainsCostsModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const uploadImagesModalVisibleSlice = createSlice({
  name: 'uploadImagesModalVisibleVisible',
  initialState: false,
  reducers: {
    setUploadImagesModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const vehicleListSupplyChainsCostsDataSlice = createSlice({
  name: 'vehicleListSupplyChainsCostsData',
  initialState: [],
  reducers: {
    setVehicleListSupplyChainsCostsData: (state, action) => {
      return action.payload
    },
  },
})

const uploadImagesButtonLoadingSlice = createSlice({
  name: 'uploadImagesButtonLoading',
  initialState: false,
  reducers: {
    setUploadImagesButtonLoading: (state, action) => {
      return action.payload
    },
  },
})

const viewImagesModalVisibleSlice = createSlice({
  name: 'viewImagesModalVisible',
  initialState: false,
  reducers: {
    setViewImagesModalVisible: (state, action) => {
      return action.payload
    },
  },
})


const viewImagesDataSlice = createSlice({
  name: 'viewImagesData',
  initialState: [],
  reducers: {
    setViewImagesData: (state, action) => {
      return action.payload
    },
  },
})


const lastVisibleSlice = createSlice({
  name: 'lastVisible',
  initialState: '',
  reducers: {
    setLastVisible: (state, action) => {
      return action.payload
    },
  },
})

// =============================== Vehicle List ========================================

// =============================== Account List ========================================
const accountListDataSlice = createSlice({
  name: 'accountListData',
  initialState: [],
  reducers: {
    setAccountListData: (state, action) => {
      return action.payload
    },
  },
})


// =============================== Account List ========================================

// =============================== Logs ======================================== 


const selectedLogsButtonSlice = createSlice({
  name: 'selectedLogsButton',
  initialState: 'stats',
  reducers: {
    setSelectedLogsButton: (state, action) => {
      return action.payload
    },
  },
})

const statsModalVisibleSlice = createSlice({
  name: 'statsModalVisible',
  initialState: false,
  reducers: {
    setStatsModalVisible: (state, action) => {
      return action.payload
    },
  },
})

const logsDataSlice = createSlice({
  name: 'logsData',
  initialState: [],
  reducers: {
    setLogsData: (state, action) => {
      return action.payload
    },
  },
})

const statsDataSlice = createSlice({
  name: 'statsData',
  initialState: [],
  reducers: {
    setStatsData: (state, action) => {
      return action.payload
    },
  },
})

// =============================== Logs ======================================== 


const stockStatusDataSlice = createSlice({
  name: 'stockStatusData',
  initialState: [
    'On-Sale',
    'Reserved',
    'Sold',
    'Hidden',],
  reducers: {
    setStockStatusData: (state, action) => {
      return action.payload
    },
  },
})
const isSuccessModalOpenSlice = createSlice({
  name: 'isSuccessModalOpen',
  initialState: false,
  reducers: {
    setIsSuccessModalOpen: (state, action) => {
      return action.payload
    },
  },
})
const isUpdateSuccessModalOpenSlice = createSlice({
  name: 'isUpdateSuccessModalOpen',
  initialState: false,
  reducers: {
    setIsUpdateSuccessModalOpen: (state, action) => {
      return action.payload
    },
  },
})
const loadingModalVisibleSlice = createSlice({
  name: 'loadingModalVisible',
  initialState: false,
  reducers: {
    setLoadingModalVisible: (state, action) => {
      return action.payload
    },
  },
})
const selectedExpenseNameSlice = createSlice({
  name: 'selectedExpenseName',
  initialState: '',
  reducers: {
    setSelectedExpenseName: (state, action) => {
      return action.payload
    },
  },
})
const selectedPaidToSlice = createSlice({
  name: 'selectedPaidTo',
  initialState: '',
  reducers: {
    setSelectedPaidTo: (state, action) => {
      return action.payload
    },
  },
})
const supplyChainsCostsDataSlice = createSlice({
  name: 'supplyChainsCostsData',
  initialState: [],
  reducers: {
    setSupplyChainsCostsData: (state, action) => {
      return action.payload
    },
  },
})
const currentDateSlice = createSlice({
  name: 'currentDate',
  initialState: '',
  reducers: {
    setCurrentDate: (state, action) => {
      return action.payload
    },
  },
})
const loginEmailSlice = createSlice({
  name: 'loginEmail',
  initialState: false,
  reducers: {
    setLoginEmail: (state, action) => {
      return action.payload
    },
  },
})

const loginAccountTypeSlice = createSlice({
  name: 'loginAccountType',
  initialState: '',
  reducers: {
    setLoginAccountType: (state, action) => {
      return action.payload
    },
  },
})

const loginNameSlice = createSlice({
  name: 'loginName',
  initialState: false,
  reducers: {
    setLoginName: (state, action) => {
      return action.payload
    },
  },
})
const modalDeleteImagesVisibleSlice = createSlice({
  name: 'modalDeleteImages',
  initialState: false,
  reducers: {
    setModalDeleteImagesVisible: (state, action) => {
      return action.payload
    },
  },
})
const addAnotherImagesSlice = createSlice({
  name: 'addAnotherImagesVisible',
  initialState: false,
  reducers: {
    setAddAnotherImages: (state, action) => {
      return action.payload
    },
  },
})
const isAddPhotoVisibleSlice = createSlice({
  name: 'isAddPhotoVisible',
  initialState: true,
  reducers: {
    setIsAddPhotoVisible: (state, action) => {
      return action.payload
    },
  },
})
const jpyToUsdSlice = createSlice({
  name: 'jpyToUsd',
  initialState: '',
  reducers: {
    setJpyToUsd: (state, action) => {
      return action.payload
    },
  },
})
const usdToJpySlice = createSlice({
  name: 'usdToJpy',
  initialState: '',
  reducers: {
    setUsdToJpy: (state, action) => {
      return action.payload
    },
  },
})
const modelDataSlice = createSlice({
  name: 'modelData',
  initialState: [],
  reducers: {
    setModelData: (state, action) => {
      return action.payload
    },
  },
})
const makeDataSlice = createSlice({
  name: 'makeData',
  initialState: makeDataVariable,
  reducers: {
    setMakeData: (state, action) => {
      return action.payload
    },
  },
})
const expenseNameDataSlice = createSlice({
  name: 'expenseName',
  initialState: [],
  reducers: {
    setExpenseNameData: (state, action) => {
      return action.payload
    },
  },
})
const paidToDataSlice = createSlice({
  name: 'paidTo',
  initialState: [],
  reducers: {
    setPaidToData: (state, action) => {
      return action.payload
    },
  },
})
const selectedMakeSlice = createSlice({
  name: 'selectedMake',
  initialState: '',
  reducers: {
    setSelectedMake: (state, action) => {
      return action.payload
    },
  },
})
const isLoadingSlice = createSlice({
  name: 'isLoading',
  initialState: false,
  reducers: {
    setIsLoading: (state, action) => {
      return action.payload
    },
  },
})
const selectedImagesSlice = createSlice({
  name: 'selectedImages',
  initialState: [],
  reducers: {
    setSelectedImages: (state, action) => {
      return action.payload
    },
  },
})
const portDataSlice = createSlice({
  name: 'portData',
  initialState: [],
  reducers: {
    setPortData: (state, action) => {
      return action.payload
    },
  },
})
const transmissionDataSlice = createSlice({
  name: 'transmissionData',
  initialState: [],
  reducers: {
    setTransmissionData: (state, action) => {
      return action.payload;
    },
  },
});
const fuelDataSlice = createSlice({
  name: 'fuelData',
  initialState: [],
  reducers: {
    setFuelData: (state, action) => {
      return action.payload;
    },
  },
});
const buyerDataSlice = createSlice({
  name: 'buyerData',
  initialState: [],
  reducers: {
    setBuyerData: (state, action) => {
      return action.payload;
    },
  },
});
const salesDataSlice = createSlice({
  name: 'salesData',
  initialState: [],
  reducers: {
    setSalesData: (state, action) => {
      return action.payload;
    },
  },
});
const driveTypeDataSlice = createSlice({
  name: 'driveTypeData',
  initialState: [],
  reducers: {
    setDriveTypeData: (state, action) => {
      return action.payload;
    },
  },
});
const bodyTypeDataSlice = createSlice({
  name: 'bodyTypeData',
  initialState: [],
  reducers: {
    setBodyTypeData: (state, action) => {
      return action.payload;
    },
  },
});
const exteriorColorDataSlice = createSlice({
  name: 'exteriorColorData',
  initialState: [],
  reducers: {
    setExteriorColorData: (state, action) => {
      return action.payload;
    },
  },
});
const currentYearSlice = createSlice({
  name: 'currentYear',
  initialState: '',
  reducers: {
    setCurrentYear: (state, action) => {
      return action.payload;
    },
  },
});


const deleteImageVisibleSlice = createSlice({
  name: 'deleteImageVisible',
  initialState: true,
  reducers: {
    setDeleteImageVisible: (state, action) => {
      return action.payload
    },
  },
});

// =============================== Chat Messages ========================================
export const { setProfitCalculatorTotalAmountDollars } = profitCalculatorTotalAmountDollarsSlice.actions
export const { setMessageTextInputHeight } = messageTextInputHeightSlice.actions
export const { setMessageTextInputValue } = messageTextInputValueSlice.actions
export const { setCustomInvoiceVisible } = customInvoiceVisibleSlice.actions
export const { setSelectedVehicleData } = selectedVehicleDataSlice.actions
export const { setCarImageUrl } = carImageUrlSlice.actions
export const { setSelectedFileUrl } = selectedFileUrlSlice.actions
export const { setPdfViewerModalVisible } = pdfViewerModalVisibleSlice.actions
export const { setSelectedCustomerData } = selectedCustomerDataSlice.actions
export const { setPreviewInvoiceVisible } = previewInvoiceVisibleSlice.actions
export const { setInvoiceData } = invoiceDataSlice.actions
export const { setTransactionModalVisible } = transactionModalVisibleSlice.actions
export const { setDeleteMessageTemplateVisible } = deleteMessageTemplateVisibleSlice.actions
export const { setLoadMoreMessagesLoading } = loadMoreMessagesLoadingSlice.actions
export const { setNoMoreMessagesData } = noMoreMessagesDataSlice.actions
export const { setReadByListModalVisible } = readByListModalVisibleSlice.actions
export const { setSelectedChatData } = selectedChatDataSlice.actions
export const { setChatMessageBoxLoading } = chatMessageBoxLoadingSlice.actions
export const { setChatMessagesData } = chatMessagesDataSlice.actions
export const { setActiveChatId } = activeChatIdSlice.actions
export const { setChatListSearchText } = chatListSearchTextSlice.actions
export const { setLoadMoreLoading } = loadMoreLoadingSlice.actions
export const { setNoMoreData } = noMoreDataSlice.actions
export const { setChatListLastVisible } = chatListLastVisibleSlice.actions
export const { setChatListData } = chatListDataSlice.actions
export const { setChatListImageUrl } = chatListImageUrlSlice.actions
// =============================== Chat Messages ========================================

// =============================== Freight ========================================
export const { setDeletePortModalVisible } = deletePortModalVisibleSlice.actions
export const { setDeleteCountryModalVisible } = deleteCountryModalVisibleSlice.actions
export const { setCountryPortsData } = countryPortsDataSlice.actions
export const { setAddPortsForCountriesModalVisible } = addPortsForCountriesModalVisibleSlice.actions
export const { setInspectionIsRequiredData } = inspectionIsRequiredDataSlice.actions
export const { setMethodData } = methodDataSlice.actions
export const { setInspectionNameData } = inspectionNameDataSlice.actions
export const { setSelectedButton } = selectedButtonSlice.actions
export const { setAddCountryModalVisible } = addCountryModalVisibleSlice.actions
export const { setAddPortModalVisible } = addPortModalVisibleSlice.actions
export const { setFreightPortsData } = freightPortsDataSlice.actions
export const { setFreightCountriesData } = freightCountriesDataSlice.actions
// =============================== Freight ========================================


// =============================== Vehicle List ========================================
export const { setInputFob } = inputFobSlice.actions
export const { setFobHistoryData } = fobHistoryDataSlice.actions
export const { setFobPriceHistoryModalVisible } = fobPriceHistoryModalVisibleSlice.actions
export const { setEditVehicleModalVisible } = editVehicleModalVisibleSlice.actions
export const { setVehicleListData } = vehicleListDataSlice.actions
export const { setAddVehicleListData } = addVehicleListDataSlice.actions
export const { setSupplyChainsCostsModalVisible } = supplyChainsCostsModalVisibleSlice.actions
export const { setVehicleListSupplyChainsCostsData } = vehicleListSupplyChainsCostsDataSlice.actions
export const { setUploadImagesModalVisible } = uploadImagesModalVisibleSlice.actions
export const { setUploadImagesButtonLoading } = uploadImagesButtonLoadingSlice.actions
export const { setViewImagesModalVisible } = viewImagesModalVisibleSlice.actions
export const { setViewImagesData } = viewImagesDataSlice.actions
export const { setLastVisible } = lastVisibleSlice.actions
// =============================== Vehicle List ========================================

// =============================== Account List ========================================
export const { setAccountListData } = accountListDataSlice.actions

// =============================== Account List ========================================

// =============================== Logs ======================================== 
export const { setLogsData } = logsDataSlice.actions
export const { setStatsModalVisible } = statsModalVisibleSlice.actions
export const { setSelectedLogsButton } = selectedLogsButtonSlice.actions
export const { setStatsData } = statsDataSlice.actions
// =============================== Logs ======================================== 


// =============================== Update/Add New Vehicle ======================================== 

export const { setStockStatusData } = stockStatusDataSlice.actions
export const { setIsSuccessModalOpen } = isSuccessModalOpenSlice.actions
export const { setIsUpdateSuccessModalOpen } = isUpdateSuccessModalOpenSlice.actions
export const { setLoadingModalVisible } = loadingModalVisibleSlice.actions
export const { setSelectedPaidTo } = selectedPaidToSlice.actions
export const { setSelectedExpenseName } = selectedExpenseNameSlice.actions
export const { setSupplyChainsCostsData } = supplyChainsCostsDataSlice.actions
export const { setCurrentDate } = currentDateSlice.actions
export const { setPaidToData } = paidToDataSlice.actions
export const { setDeleteImageVisible } = deleteImageVisibleSlice.actions
export const { setExpenseNameData } = expenseNameDataSlice.actions
export const { setLoginEmail } = loginEmailSlice.actions
export const { setLoginName } = loginNameSlice.actions
export const { setLoginAccountType } = loginAccountTypeSlice.actions
export const { setIsAddPhotoVisible } = isAddPhotoVisibleSlice.actions
export const { setAddAnotherImages } = addAnotherImagesSlice.actions
export const { setModalDeleteImagesVisible } = modalDeleteImagesVisibleSlice.actions
export const { setMakeData } = makeDataSlice.actions
export const { setSelectedMake } = selectedMakeSlice.actions
export const { setIsLoading } = isLoadingSlice.actions
export const { setSelectedImages } = selectedImagesSlice.actions
export const { setPortData } = portDataSlice.actions
export const { setTransmissionData } = transmissionDataSlice.actions;
export const { setFuelData } = fuelDataSlice.actions;
export const { setBuyerData } = buyerDataSlice.actions;
export const { setSalesData } = salesDataSlice.actions;
export const { setDriveTypeData } = driveTypeDataSlice.actions;
export const { setBodyTypeData } = bodyTypeDataSlice.actions;
export const { setExteriorColorData } = exteriorColorDataSlice.actions;
export const { setJpyToUsd } = jpyToUsdSlice.actions;
export const { setUsdToJpy } = usdToJpySlice.actions;
export const { setCurrentYear } = currentYearSlice.actions;
export const { setModelData } = modelDataSlice.actions

// =============================== Update/Add New Vehicle ======================================== 


const store = configureStore({
  reducer: {

    // =============================== Chat Messages ========================================

    profitCalculatorTotalAmountDollars: profitCalculatorTotalAmountDollarsSlice.reducer,
    messageTextInputHeight: messageTextInputHeightSlice.reducer,
    customInvoiceVisible: customInvoiceVisibleSlice.reducer,
    messageTextInputValue: messageTextInputValueSlice.reducer,
    selectedVehicleData: selectedVehicleDataSlice.reducer,
    carImageUrl: carImageUrlSlice.reducer,
    selectedFileUrl: selectedFileUrlSlice.reducer,
    pdfViewerModalVisible: pdfViewerModalVisibleSlice.reducer,
    selectedCustomerData: selectedCustomerDataSlice.reducer,
    previewInvoiceVisible: previewInvoiceVisibleSlice.reducer,
    invoiceData: invoiceDataSlice.reducer,
    transactionModalVisible: transactionModalVisibleSlice.reducer,
    deleteMessageTemplateVisible: deleteMessageTemplateVisibleSlice.reducer,
    loadMoreMessagesLoading: loadMoreMessagesLoadingSlice.reducer,
    noMoreMessagesData: noMoreMessagesDataSlice.reducer,
    readByListModalVisible: readByListModalVisibleSlice.reducer,
    selectedChatData: selectedChatDataSlice.reducer,
    chatMessageBoxLoading: chatMessageBoxLoadingSlice.reducer,
    chatMessagesData: chatMessagesDataSlice.reducer,
    chatListSearchText: chatListSearchTextSlice.reducer,
    activeChatId: activeChatIdSlice.reducer,
    loadMoreLoading: loadMoreLoadingSlice.reducer,
    noMoreData: noMoreDataSlice.reducer,
    chatListLastVisible: chatListLastVisibleSlice.reducer,
    chatListData: chatListDataSlice.reducer,
    chatListImageUrl: chatListImageUrlSlice.reducer,
    // =============================== Chat Messages ======================================== 

    // =============================== Freight ======================================== 
    deletePortModalVisible: deletePortModalVisibleSlice.reducer,
    deleteCountryModalVisible: deleteCountryModalVisibleSlice.reducer,
    countryPortsData: countryPortsDataSlice.reducer,
    addPortsForCountriesModalVisible: addPortsForCountriesModalVisibleSlice.reducer,
    inspectionIsRequiredData: inspectionIsRequiredDataSlice.reducer,
    methodData: methodDataSlice.reducer,
    freightPortsData: freightPortsDataSlice.reducer,
    inspectionNameData: inspectionNameDataSlice.reducer,
    addCountryModalVisible: addCountryModalVisibleSlice.reducer,
    addPortModalVisible: addPortModalVisibleSlice.reducer,
    freightCountriesData: freightCountriesDataSlice.reducer,
    selectedButton: selectedButtonSlice.reducer,
    // =============================== Freight ========================================

    // =============================== Vehicle List ========================================
    inputFob: inputFobSlice.reducer,
    fobHistoryData: fobHistoryDataSlice.reducer,
    fobPriceHistoryModalVisible: fobPriceHistoryModalVisibleSlice.reducer,
    editVehicleModalVisible: editVehicleModalVisibleSlice.reducer,
    vehicleListData: vehicleListDataSlice.reducer,
    addVehicleListData: addVehicleListDataSlice.reducer,
    supplyChainsCostsModalVisible: supplyChainsCostsModalVisibleSlice.reducer,
    uploadImagesModalVisible: uploadImagesModalVisibleSlice.reducer,
    uploadImagesButtonLoading: uploadImagesButtonLoadingSlice.reducer,
    viewImagesModalVisible: viewImagesModalVisibleSlice.reducer,
    viewImagesData: viewImagesDataSlice.reducer,
    lastVisible: lastVisibleSlice.reducer,
    // =============================== Vehicle List ========================================


    // =============================== Account List ========================================
    accountListData: accountListDataSlice.reducer,
    // =============================== Account List ========================================


    // =============================== Logs ======================================== 
    logsData: logsDataSlice.reducer,
    statsModalVisible: statsModalVisibleSlice.reducer,
    selectedLogsButton: selectedLogsButtonSlice.reducer,
    statsData: statsDataSlice.reducer,
    // =============================== Logs ======================================== 
    stockStatusData: stockStatusDataSlice.reducer,
    isSuccessModalOpen: isSuccessModalOpenSlice.reducer,
    isUpdateSuccessModalOpen: isUpdateSuccessModalOpenSlice.reducer,
    loadingModalVisible: loadingModalVisibleSlice.reducer,
    selectedPaidTo: selectedPaidToSlice.reducer,
    selectedExpenseName: selectedExpenseNameSlice.reducer,
    supplyChainsCostsData: supplyChainsCostsDataSlice.reducer,
    vehicleListSupplyChainsCostsData: vehicleListSupplyChainsCostsDataSlice.reducer,
    currentDate: currentDateSlice.reducer,
    paidToData: paidToDataSlice.reducer,
    expenseNameData: expenseNameDataSlice.reducer,
    modelData: modelDataSlice.reducer,
    makeData: makeDataSlice.reducer,
    selectedMake: selectedMakeSlice.reducer,
    isLoading: isLoadingSlice.reducer,
    selectedImages: selectedImagesSlice.reducer,
    portData: portDataSlice.reducer,
    transmissionData: transmissionDataSlice.reducer,
    fuelData: fuelDataSlice.reducer,
    buyerData: buyerDataSlice.reducer,
    salesData: salesDataSlice.reducer,
    driveTypeData: driveTypeDataSlice.reducer,
    bodyTypeData: bodyTypeDataSlice.reducer,
    exteriorColorData: exteriorColorDataSlice.reducer,
    jpyToUsd: jpyToUsdSlice.reducer,
    usdToJpy: usdToJpySlice.reducer,
    currentYear: currentYearSlice.reducer,
    isAddPhotoVisible: isAddPhotoVisibleSlice.reducer,
    addAnotherImages: addAnotherImagesSlice.reducer,
    modalDeleteImagesVisible: modalDeleteImagesVisibleSlice.reducer,
    loginName: loginNameSlice.reducer,
    loginAccountType: loginAccountTypeSlice.reducer,
    loginEmail: loginEmailSlice.reducer,
    deleteImageVisible: deleteImageVisibleSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chatMessagesData/setChatMessagesData'],
        ignoredPaths: ['chatMessagesData.somePathToTimestamp'],
      },
    }),
});


export const fetchCurrency = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(projectControlFirestore, 'currency', 'currency');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const jpyToUsd = snapshot.data()?.jpyToUsd || [];
        const usdToJpy = snapshot.data()?.usdToJpy || [];
        dispatch(setJpyToUsd(jpyToUsd));
        dispatch(setUsdToJpy(usdToJpy));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchExpenseNameData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'ExpenseName'), 'ExpenseName');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const expenseNameData = snapshot.data()?.expenseName || [];
        dispatch(setExpenseNameData(expenseNameData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};



export const fetchPaidToData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'PaidTo'), 'PaidTo');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const paidToData = snapshot.data()?.paidTo || [];
        dispatch(setPaidToData(paidToData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};


export const fetchMakeData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'Make'), 'Make');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const makeData = snapshot.data()?.make || [];
        dispatch(setMakeData(makeData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchPortData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'Port'), 'Port');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const portData = snapshot.data()?.port || [];
        dispatch(setPortData(portData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};
// Dispatch the fetchMakeData action when your app starts or as needed

export const fetchTransmissionData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'Transmission'), 'Transmission');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const transmissionData = snapshot.data()?.transmission || [];
        dispatch(setTransmissionData(transmissionData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};


export const fetchFuelData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'Fuel'), 'Fuel');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const fuelData = snapshot.data()?.fuel || [];
        dispatch(setFuelData(fuelData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchBuyerData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'Buyer'), 'Buyer');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const buyerData = snapshot.data()?.buyer || [];
        dispatch(setBuyerData(buyerData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchSalesData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'Sales'), 'Sales');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const salesData = snapshot.data()?.sales || [];
        dispatch(setSalesData(salesData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchDriveTypeData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'DriveType'), 'DriveType');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const driveTypeData = snapshot.data()?.driveType || [];
        dispatch(setDriveTypeData(driveTypeData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchBodyTypeData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'BodyType'), 'BodyType');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const bodyTypeData = snapshot.data()?.bodyType || [];
        dispatch(setBodyTypeData(bodyTypeData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchExteriorColorData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'ExteriorColor'), 'ExteriorColor');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const exteriorColorData = snapshot.data()?.exteriorColor || [];
        dispatch(setExteriorColorData(exteriorColorData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchYear = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
      const { datetime } = response.data;
      const formattedTime = moment(datetime).format('YYYY');
      dispatch(setCurrentYear(formattedTime));
    } catch (error) {
      console.error('Error fetching time:', error);
    }
  };
};

export const fetchCurrentDate = () => {

  return async (dispatch) => {
    try {
      const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
      const { datetime } = response.data;
      const formattedTime = moment(datetime).format('YYYY-MM-DD');
      dispatch(setCurrentDate(formattedTime));
    } catch (error) {
      console.error('Error fetching time:', error);
    }
  };
};

// =============================== Vehicle List ========================================


export const fetchVehicleListData = () => {
  return async (dispatch) => {
    try {
      const queryRef = query(
        collection(projectExtensionFirestore, 'VehicleProducts'),
        orderBy('dateAdded', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(queryRef, (snapshot) => {
        const vehicleProductData = [];
        snapshot.forEach((doc) => {
          vehicleProductData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        dispatch(setVehicleListData(vehicleProductData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

// =============================== Vehicle List ========================================

// =============================== Logs ========================================
// export const fetchLogsData = () => {
//   return async (dispatch) => {
//     try {

//       const queryRef = query(
//         collection(projectControlFirestore, 'logs'),
//         orderBy('timestamp', 'desc'),
//         limit(10)
//       );

//       const unsubscribe = onSnapshot(queryRef, (snapshot) => {
//         const logsDatabaseData = [];
//         snapshot.forEach((doc) => {
//           logsDatabaseData.push({
//             id: doc.id,
//             ...doc.data(),
//           });
//         });
//         dispatch(setLogsData(logsDatabaseData));
//       });

//       // Return the unsubscribe function to stop listening when necessary
//       return unsubscribe;
//     } catch (error) {
//       // Handle errors here
//       console.error('Error fetching data from Firebase:', error);
//     }
//   };
// };

// =============================== Logs ========================================

// =============================== Freight ========================================

export const fetchMethodData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'CustomerCountryPort'), 'MethodDoc');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const methodData = snapshot.data()?.methodData || [];
        dispatch(setMethodData(methodData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchInspectionIsRequiredData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'CustomerCountryPort'), 'InspectionIsRequiredDoc');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const inspectionIsRequiredData = snapshot.data()?.inspectionIsRequiredData || [];
        dispatch(setInspectionIsRequiredData(inspectionIsRequiredData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};

export const fetchInspectionNameData = () => {
  return async (dispatch) => {
    try {
      const docRef = doc(collection(projectExtensionFirestore, 'CustomerCountryPort'), 'InspectionNameDoc');
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const inspectionNameData = snapshot.data()?.inspectionNameData || [];
        dispatch(setInspectionNameData(inspectionNameData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};
// =============================== Freight ========================================


// =============================== Chat Messages ========================================
export const fetchChatListData = () => {
  return async (dispatch) => {
    try {
      const queryRef = query(
        collection(projectExtensionFirestore, 'chats'),
        orderBy('lastMessageDate', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(queryRef, (snapshot) => {
        const chatsData = [];
        snapshot.forEach((doc) => {
          chatsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        dispatch(setChatListData(chatsData));
      });

      // Return the unsubscribe function to stop listening when necessary
      return unsubscribe;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data from Firebase:', error);
    }
  };
};
// =============================== Chat Messages ========================================
// To stop listening for updates, you can call unsubscribe()
// unsubscribe();

store.dispatch(fetchCurrentDate());
store.dispatch(fetchPaidToData());
store.dispatch(fetchExpenseNameData());
store.dispatch(fetchMakeData());
store.dispatch(fetchPortData());
store.dispatch(fetchTransmissionData());
store.dispatch(fetchFuelData());
store.dispatch(fetchBuyerData());
store.dispatch(fetchSalesData());
store.dispatch(fetchDriveTypeData());
store.dispatch(fetchBodyTypeData());
store.dispatch(fetchExteriorColorData());
store.dispatch(fetchCurrency());
store.dispatch(fetchYear());



// store.dispatch(fetchVehicleListData());

store.dispatch(fetchMethodData());
store.dispatch(fetchInspectionIsRequiredData());
store.dispatch(fetchInspectionNameData());

// store.dispatch(fetchChatListData());


export default store