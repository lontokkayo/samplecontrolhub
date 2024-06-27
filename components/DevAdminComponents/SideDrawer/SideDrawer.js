import {
    Box,
    Button,
    Center,
    HStack,
    Modal,
    Text,
    VStack,
    ScrollView,

} from 'native-base';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    AntDesign,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Entypo
} from 'react-native-vector-icons';
import { View, TouchableOpacity, Easing, Image, Dimensions, Animated, Pressable } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { HashRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



const SideDrawer = ({ selectedScreen, loginAccountType }) => {


    const [isOpen, setIsOpen] = useState(false);
    const logo2 = require('../../../assets/C-Hub Logo Only.png');
    const [onHover, setOnHover] = useState(false);

    const screenWidth = Dimensions.get('window').width;

    // const navigation = useNavigation();


    const navigate = useNavigate();
    const handleOpen = () => {

        setIsOpen(true);

    }
    const handleClose = () => {

        setIsOpen(false);

    }

    const handleToggleLogs = useCallback(() => {
        navigate("/top/logs");
    }, []);

    const handleToggleAddAccount = useCallback(() => {
        navigate("/top/add-c-hub-account");
    }, []);

    const handleToggleAccountList = useCallback(() => {

        navigate("/top/account-list");
    }, []);

    const handleToggleAddVehicle = useCallback(() => {

        navigate("/top/add-new-vehicle");
    }, []);


    const handleVehicleList = useCallback(() => {
        navigate("/top/vehicle-list");
    }, []);


    const handleFreight = useCallback(() => {
        navigate("/top/freight");
    }, []);

    const handleChatMessages = useCallback(() => {
        navigate("/top/chat-messages");
    }, []);
    const handleCustomerList = useCallback(() => {
        navigate("/top/customer-list");
    }, []);


    const slideAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.timing(slideAnimation, {
                toValue: 1,
                duration: 500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen, slideAnimation]);





    return (

        <>
            <Pressable
                onHoverIn={() => {
                    handleOpen()
                    setOnHover(true);
                }}
                onHoverOut={() =>
                    setTimeout(() => setOnHover(false), [100])
                }
                onPress={() => {

                    setOnHover(true);
                    setTimeout(() => {
                        handleOpen()
                        setOnHover(false);
                    }, 20);
                }}

                onPressOut={() => handleOpen()}

                underlayColor="#5a7bc9"
                style={({ hovered, pressed }) => ({
                    backgroundColor: hovered || pressed || onHover ? '#5a7bc9' : 'transparent',
                    borderRadius: 5,
                })}>
                <FontAwesome name="navicon" size={30} color="white" style={{ margin: 2 }} />
            </Pressable>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                useRNModal
                style={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    height: '100%',
                }}
            >
                <Modal.Content
                    maxWidth={255}
                    borderRadius={0}
                    maxHeight="100%"
                    height="full"
                    bgColor={'transparent'}
                >
                    <Animated.View
                        style={{
                            flex: 1,
                            transform: [
                                {
                                    translateX: slideAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-255, 0],
                                    }),
                                },
                            ],
                        }}
                    >

                        <View style={{ backgroundColor: '#0642f4', flex: 1, borderRightWidth: 0, borderColor: 'cyan' }}>
                            <View style={{ flex: 1, }}>

                                <View style={{ flexDirection: 'row', margin: 3, justifyContent: 'space-between' }}>
                                    <View style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={{
                                                uri: logo2,
                                            }}
                                            resizeMode="stretch"
                                            style={{ width: 170, height: 30 }}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'flex-end', marginVertical: 1.5, marginHorizontal: 1.5 }}
                                    >
                                        <MaterialIcons
                                            name="arrow-back"
                                            size={30}
                                            color="white"
                                            onPress={handleClose}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Sidebar Content */}
                                <View style={{ paddingHorizontal: 1, backgroundColor: '#0642f4', height: '100%' }}>
                                    <ScrollView style={{ width: 245 }}>
                                        <View style={{ height: 20 }}>
                                            {/* Sidebar Content Items */}
                                            {(loginAccountType == 'admin' || loginAccountType == 'sales') &&
                                                <Button
                                                    _text={{ color: selectedScreen == 'LOGS' ? '#0642F4' : "white", }}
                                                    borderRadius={0}
                                                    borderTopWidth={1}
                                                    borderBottomWidth={1}
                                                    borderColor={'white'}
                                                    _hover={{ bgColor: selectedScreen == 'LOGS' ? '#FFFFFF' : '#032da8', }}
                                                    marginTop={0}
                                                    w={'full'}
                                                    onPress={() => selectedScreen == 'LOGS' ? null : handleToggleLogs()}
                                                    colorScheme={undefined}
                                                    bgColor={selectedScreen == 'LOGS' ? '#FFFFFF' : '#0642F4'}
                                                    leftIcon={<MaterialCommunityIcons name="history" size={20} color={selectedScreen == 'LOGS' ? '#0642F4' : "white"} />}
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                >
                                                    LOGS
                                                </Button>
                                            }

                                            {/* ACCOUNT MANAGEMENT */}
                                            {loginAccountType == 'admin' && <Button
                                                _text={{ color: selectedScreen == 'ADD C-HUB ACCOUNT' ? '#0642F4' : "white", }}
                                                borderRadius={0}
                                                borderTopWidth={1}
                                                borderBottomWidth={1}
                                                borderColor={'white'}
                                                _hover={{ bgColor: selectedScreen == 'ADD C-HUB ACCOUNT' ? '#FFFFFF' : '#032da8', }}
                                                marginTop={0} w={'full'}
                                                onPress={() => selectedScreen == 'ADD C-HUB ACCOUNT' ? null : handleToggleAddAccount()}
                                                colorScheme={undefined}
                                                bgColor={selectedScreen == 'ADD C-HUB ACCOUNT' ? '#FFFFFF' : '#0642F4'}
                                                leftIcon={<MaterialIcons name="person-add" size={20} color={selectedScreen == 'ADD C-HUB ACCOUNT' ? '#0642F4' : "white"} />}
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >ADD C-HUB ACCOUNT</Button>}

                                            {loginAccountType == 'admin' && <Button
                                                _text={{ color: selectedScreen == 'ACCOUNT LIST' ? '#0642F4' : "white", }}
                                                borderRadius={0}
                                                borderTopWidth={1}
                                                borderBottomWidth={1}
                                                borderColor={'white'}
                                                _hover={{ bgColor: selectedScreen == 'ACCOUNT LIST' ? '#FFFFFF' : '#032da8', }}
                                                marginTop={0}
                                                onPress={() => selectedScreen == 'ACCOUNT LIST' ? null : handleToggleAccountList()}
                                                colorScheme={undefined}
                                                bgColor={selectedScreen == 'ACCOUNT LIST' ? '#FFFFFF' : '#0642F4'}
                                                leftIcon={
                                                    <MaterialCommunityIcons name="account-details" size={20}
                                                        color={selectedScreen == 'ACCOUNT LIST' ? '#0642F4' : "white"}
                                                    />

                                                }
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >ACCOUNT LIST</Button>}
                                            {/* VEHICLE INFORMATION INPUT */}
                                            {(loginAccountType == 'admin' || loginAccountType == 'sales' || loginAccountType == 'booking') &&
                                                <Button
                                                    _text={{ color: selectedScreen == 'ADD NEW VEHICLE' ? '#0642F4' : "white", }}
                                                    borderRadius={0}
                                                    borderTopWidth={1}
                                                    borderBottomWidth={1}
                                                    borderColor={'white'}
                                                    _hover={{ bgColor: selectedScreen == 'ADD NEW VEHICLE' ? '#FFFFFF' : '#032da8', }}
                                                    marginTop={0} w={'full'}
                                                    onPress={() => selectedScreen == 'ADD NEW VEHICLE' ? null : handleToggleAddVehicle()}
                                                    colorScheme={undefined}
                                                    bgColor={selectedScreen == 'ADD NEW VEHICLE' ? '#FFFFFF' : '#0642F4'}
                                                    leftIcon={
                                                        <>
                                                            <View>
                                                                <FontAwesome name="automobile" size={15}
                                                                    color={selectedScreen == 'ADD NEW VEHICLE' ? '#0642F4' : "white"}
                                                                />
                                                                <FontAwesome
                                                                    name="plus"
                                                                    size={10}
                                                                    color={selectedScreen == 'ADD NEW VEHICLE' ? '#0642F4' : "white"}
                                                                    style={{
                                                                        position: 'absolute', // Position it absolutely...
                                                                        top: -3, // ...at the top...
                                                                        left: -5 // ...and left.
                                                                    }}
                                                                />
                                                            </View>


                                                        </>
                                                    }
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                >UPDATE / ADD NEW VEHICLE</Button>
                                            }

                                            {(loginAccountType == 'admin' || loginAccountType == 'sales' || loginAccountType == 'booking') &&
                                                <Button
                                                    _text={{ color: selectedScreen == 'VEHICLE LIST' ? '#0642F4' : "white", }}
                                                    borderRadius={0}
                                                    borderTopWidth={1}
                                                    borderBottomWidth={1}
                                                    borderColor={'white'}
                                                    _hover={{ bgColor: selectedScreen == 'VEHICLE LIST' ? '#FFFFFF' : '#032da8', }}
                                                    marginTop={0}
                                                    onPress={() => selectedScreen == 'VEHICLE LIST' ? null : handleVehicleList()}
                                                    colorScheme={undefined}
                                                    bgColor={selectedScreen == 'VEHICLE LIST' ? '#FFFFFF' : '#0642F4'}
                                                    leftIcon={
                                                        <>
                                                            <View>
                                                                <FontAwesome
                                                                    name="automobile"
                                                                    size={15}
                                                                    color={selectedScreen == 'VEHICLE LIST' ? '#0642F4' : "white"}
                                                                />

                                                                <MaterialCommunityIcons name="format-list-bulleted" size={10}
                                                                    color={selectedScreen == 'VEHICLE LIST' ? '#0642F4' : "white"}
                                                                    style={{
                                                                        position: 'absolute', // Position it absolutely...
                                                                        top: -3, // ...at the top...
                                                                        left: -5 // ...and left.
                                                                    }}
                                                                />

                                                            </View>


                                                        </>
                                                    }
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                // rightIcon={<FontAwesome name="automobile" size={15} color="white" />}
                                                >VEHICLE LIST</Button>}

                                            {loginAccountType == 'admin' && <Button
                                                _text={{ color: selectedScreen == 'FREIGHT' ? '#0642F4' : "white", }}
                                                borderRadius={0}
                                                borderTopWidth={1}
                                                borderBottomWidth={1}
                                                borderColor={'white'}
                                                _hover={{ bgColor: selectedScreen == 'FREIGHT' ? '#FFFFFF' : '#032da8', }}
                                                marginTop={0}
                                                onPress={() => selectedScreen == 'FREIGHT' ? null : handleFreight()}
                                                colorScheme={undefined}
                                                bgColor={selectedScreen == 'FREIGHT' ? '#FFFFFF' : '#0642F4'}
                                                leftIcon={
                                                    <>
                                                        <View>
                                                            <MaterialIcons
                                                                name="public"
                                                                size={20}
                                                                color={selectedScreen == 'FREIGHT' ? '#0642F4' : "white"}
                                                            />

                                                            <MaterialIcons name="sync" size={12}
                                                                color={selectedScreen == 'FREIGHT' ? '#0642F4' : "white"}
                                                                style={{
                                                                    position: 'absolute', // Position it absolutely...
                                                                    top: -3, // ...at the top...
                                                                    left: -5 // ...and left.
                                                                }}
                                                            />

                                                        </View>


                                                    </>
                                                }
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            // rightIcon={<FontAwesome name="automobile" size={15} color="white" />}
                                            >FREIGHT</Button>
                                            }

                                            {(loginAccountType == 'admin' || loginAccountType == 'sales' || loginAccountType == 'booking') && <Button
                                                _text={{ color: selectedScreen == 'CHAT MESSAGES' ? '#0642F4' : "white", }}
                                                borderRadius={0}
                                                borderTopWidth={1}
                                                borderBottomWidth={1}
                                                borderColor={'white'}
                                                _hover={{ bgColor: selectedScreen == 'CHAT MESSAGES' ? '#FFFFFF' : '#032da8', }}
                                                marginTop={0}
                                                onPress={() => { selectedScreen == 'CHAT MESSAGES' ? null : handleChatMessages() }}
                                                colorScheme={undefined}
                                                bgColor={selectedScreen == 'CHAT MESSAGES' ? '#FFFFFF' : '#0642F4'}
                                                leftIcon={
                                                    <>
                                                        <View>
                                                            <Entypo
                                                                name="chat"
                                                                size={20}
                                                                color={selectedScreen == 'CHAT MESSAGES' ? '#0642F4' : "white"}

                                                            />

                                                        </View>


                                                    </>
                                                }
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            // rightIcon={<FontAwesome name="automobile" size={15} color="white" />}
                                            >CHAT MESSAGES</Button>
                                            }

                                            {(loginAccountType == 'admin' || loginAccountType == 'sales' || loginAccountType == 'booking') && <Button
                                                _text={{ color: selectedScreen == 'CUSTOMER LIST' ? '#0642F4' : "white", }}
                                                borderRadius={0}
                                                borderTopWidth={1}
                                                borderBottomWidth={1}
                                                borderColor={'white'}
                                                _hover={{ bgColor: selectedScreen == 'CUSTOMER LIST' ? '#FFFFFF' : '#032da8', }}
                                                marginTop={0}
                                                onPress={() => { selectedScreen == 'CUSTOMER LIST' ? null : handleCustomerList() }}
                                                colorScheme={undefined}
                                                bgColor={selectedScreen == 'CUSTOMER LIST' ? '#FFFFFF' : '#0642F4'}
                                                leftIcon={
                                                    <>
                                                        <View>
                                                            <MaterialCommunityIcons name="account-details" size={20}
                                                                color={selectedScreen == 'CUSTOMER LIST' ? '#0642F4' : "white"}
                                                            />
                                                        </View>


                                                    </>
                                                }
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            // rightIcon={<FontAwesome name="automobile" size={15} color="white" />}
                                            >CUSTOMER LIST</Button>
                                            }
                                        </View>
                                        {/* Footer Content */}
                                        {/* <TouchableOpacity
            style={{ borderTopWidth: 1, borderColor: 'gray', backgroundColor: '#7b9cff', paddingVertical: 10 }}
            onPress={handleSignOut}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Logout
            </Text>
          </TouchableOpacity> */}
                                    </ScrollView>
                                    <View style={{ borderTopWidth: 0, backgroundColor: '#7b9cff', position: 'absolute', bottom: 0, left: 0, right: 0, borderTopColor: 'gray', paddingTop: 3 }}>
                                        {/* Footer Content */}
                                        {/* <Center marginBottom={1.5}>
            <Button w={100} colorScheme="error" onPress={handleSignOut}>
              <MaterialCommunityIcons name="logout" size={20} color="white" /> Logout
            </Button>
          </Center> */}
                                    </View>
                                </View>
                            </View>
                        </View>

                    </Animated.View>
                </Modal.Content>
            </Modal>
        </>

    );
}


export default SideDrawer;