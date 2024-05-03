
import {
    Box,
    Button,
    Center,
    HStack,
    Image,
    Modal,
    Text,
    VStack,
    ScrollView,
} from 'native-base';
import React, { useState, useCallback } from 'react';
import {
    AntDesign,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Entypo
} from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/core';


const SideDrawer = ({ selectedScreen }) => {
    const navigation = useNavigation();

    const handleToggleLogs = useCallback(() => {


        navigation.navigate("LOGS");
    }, []);

    const handleToggleAddAccount = useCallback(() => {


        navigation.navigate("ADD C-HUB ACCOUNT");
    }, []);

    const handleToggleAccountList = useCallback(() => {

        navigation.navigate("ACCOUNT LIST");
    }, []);

    const handleToggleAddVehicle = useCallback(() => {

        navigation.navigate("ADD NEW VEHICLE");
    }, []);


    const handleVehicleList = useCallback(() => {
        navigation.navigate("VEHICLE LIST");
    }, []);


    return (
        <Box w={[0, 0, 0, 255]} bgColor="#7b9cff" borderRightWidth={[0, 0, 0, 2]} borderColor={'cyan.500'}>
            {/* Sidebar Content */}
            <Box px={'1'} bgColor="#7b9cff" height={[0, 0, 0, "full"]}>
                <ScrollView w={[0, 0, 0, 245]} >
                    <VStack space={1} w={[0, 0, 0, 'full']} h={[0, 0, 0, 20]}>
                        {/* Sidebar Content Items */}
                        <Box borderBottomWidth={1} borderColor={'white'}>
                            <Button
                                _hover={{ bgColor: selectedScreen == 'LOGS' ? '#0642F4' : '#5a7bc9', }}
                                marginTop={0}
                                w={'full'}
                                onPress={handleToggleLogs}
                                colorScheme={undefined}
                                bgColor={selectedScreen == 'LOGS' ? '#0642F4' : '#7b9cff'}
                                leftIcon={<MaterialCommunityIcons name="history" size={20} color="white" />}
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                LOGS
                            </Button>
                        </Box>
                        {/* ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT  */}
                        {/* <Center
                            marginBottom={1.5} 
                            justifyContent="flex-start"
                            alignItems="center" >
                            <Text
                                marginTop={5}
                                marginBottom={1}
                                fontSize={16}
                                color={'black'}
                                textAlign={'start'}
                                bold
                                alignSelf="flex-start"
                                marginLeft={3}
                            >
                                ACCOUNT MANAGEMENT
                            </Text>
                        </Center> */}

                        <Box borderBottomWidth={1} borderColor={'white'}>
                            <Button
                                _hover={{ bgColor: selectedScreen == 'ADD C-HUB ACCOUNT' ? '#0642F4' : '#5a7bc9', }}
                                marginTop={0} w={'full'}
                                onPress={handleToggleAddAccount}
                                colorScheme={undefined}
                                bgColor={selectedScreen == 'ADD C-HUB ACCOUNT' ? '#0642F4' : '#7b9cff'}
                                leftIcon={<MaterialIcons name="person-add" size={20} color="white" />}
                                justifyContent="flex-start"
                                alignItems="center"
                            >ADD C-HUB ACCOUNT</Button>
                        </Box>
                        <Box borderBottomWidth={1} borderColor={'white'}>
                            <Button
                                _hover={{ bgColor: selectedScreen == 'ACCOUNT LIST' ? '#0642F4' : '#5a7bc9', }}
                                marginTop={0}
                                onPress={handleToggleAccountList}
                                colorScheme={undefined}
                                bgColor={selectedScreen == 'ACCOUNT LIST' ? '#0642F4' : '#7b9cff'}
                                leftIcon={
                                        <MaterialCommunityIcons name="account-details" size={20} color="white"/>
                                  
                                }
                                justifyContent="flex-start"
                                alignItems="center"
                            >ACCOUNT LIST</Button>
                        </Box>
                        {/* ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT ACCOUNT MANAGEMENT */}

                        {/* VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT  */}
                        {/* <Center marginBottom={1.5} >
                            <Text marginTop={5} marginBottom={1} fontSize={16} color={'black'} bold>VEHICLE INFORMATION INPUT</Text>
                        </Center> */}
                        <Box borderBottomWidth={1} borderColor={'white'}>
                            <Button
                                _hover={{ bgColor: selectedScreen == 'ADD NEW VEHICLE' ? '#0642F4' : '#5a7bc9', }}
                                marginTop={0} w={'full'}
                                onPress={handleToggleAddVehicle}
                                colorScheme={undefined}
                                bgColor={selectedScreen == 'ADD NEW VEHICLE' ? '#0642F4' : '#7b9cff'}
                                leftIcon={
                                    <>
                                        <Box>
                                            <FontAwesome name="automobile" size={15} color="white" />
                                            <FontAwesome
                                                name="plus"
                                                size={10}
                                                color="white"
                                                style={{
                                                    position: 'absolute', // Position it absolutely...
                                                    top: -3, // ...at the top...
                                                    left: -5 // ...and left.
                                                }}
                                            />
                                        </Box>


                                    </>
                                }
                                justifyContent="flex-start"
                                alignItems="center"
                            >ADD NEW VEHICLE</Button>
                        </Box>
                        <Box borderBottomWidth={1} borderColor={'white'}>
                            <Button
                                _hover={{ bgColor: selectedScreen == 'VEHICLE LIST' ? '#0642F4' : '#5a7bc9', }}
                                marginTop={0}
                                onPress={handleVehicleList}
                                colorScheme={undefined}
                                bgColor={selectedScreen == 'VEHICLE LIST' ? '#0642F4' : '#7b9cff'}
                                leftIcon={
                                    <>
                                        <Box>
                                            <FontAwesome
                                                name="automobile"
                                                size={15}
                                                color="white" />

                                            <MaterialCommunityIcons name="format-list-bulleted" size={10} color="white"
                                                style={{
                                                    position: 'absolute', // Position it absolutely...
                                                    top: -3, // ...at the top...
                                                    left: -5 // ...and left.
                                                }}
                                            />

                                        </Box>


                                    </>
                                }
                                justifyContent="flex-start"
                                alignItems="center"
                            // rightIcon={<FontAwesome name="automobile" size={15} color="white" />}
                            >VEHICLE LIST</Button>
                        </Box>

                        {/* VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT VEHICLE INFORMATION INPUT  */}


                        <Box height={70} borderColor={'white'}></Box>
                    </VStack>
                </ScrollView>
                <Box borderTopWidth={0} bgColor={'#7b9cff'} position="absolute" bottom={0} left={0} right={0} borderTopColor="gray.200" pt={3} >
                    {/* Footer Content */}
                    {/* <Center marginBottom={1.5}>
      <Button w={[0, 0, 0, 100]} colorScheme="error" onPress={handleSignOut} leftIcon={<MaterialCommunityIcons name="logout" size={[0, 0, 0, 20]} color="white" />}>
        Logout
      </Button>
    </Center> */}
                </Box>
            </Box>
        </Box>

    );
}


export default SideDrawer;