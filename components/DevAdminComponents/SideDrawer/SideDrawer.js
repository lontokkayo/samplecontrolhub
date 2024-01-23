
import { React, useCallback } from 'react';
import { Button } from 'native-base';
import { View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/core';

const handleToggleLogs = (navigation) => {

    navigation.navigate("LOGS");
};

const handleToggleAddAccount = (navigation) => {
    navigation.navigate("ADD C-HUB ACCOUNT");
};

const handleToggleAccountList = (navigation) => {
    navigation.navigate("ACCOUNT LIST");
};

const handleToggleAddVehicle = (navigation) => {
    navigation.navigate("ADD NEW VEHICLE");
};


const handleVehicleList = (navigation) => {
    navigation.navigate("VEHICLE LIST");
};

const handleFreight = (navigation) => {
    navigation.navigate("FREIGHT");
};


const handleChatMessages = (navigation) => {
    navigation.navigate("CHAT MESSAGES");
};


const SideDrawer = ({ selectedScreen }) => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;





    return (

        <View style={{ width: 255, display: screenWidth <= 960 ? 'none' : 'flex', backgroundColor: '#7b9cff', borderRightWidth: 2, borderColor: 'cyan' }}>
            {/* Sidebar Content */}
            <View style={{ paddingHorizontal: 1, backgroundColor: '#7b9cff', height: '100%' }}>
                <ScrollView style={{ width: 245 }}>
                    <View style={{ height: 20 }}>
                        {/* Sidebar Content Items */}
                        <Button
                            borderRadius={0}
                            borderTopWidth={1}
                            borderBottomWidth={1}
                            borderColor={'white'}
                            _hover={{ bgColor: selectedScreen == 'LOGS' ? '#0642F4' : '#5a7bc9', }}
                            marginTop={0}
                            w={'full'}
                            onPress={() => handleToggleLogs(navigation)}
                            colorScheme={undefined}
                            bgColor={selectedScreen == 'LOGS' ? '#0642F4' : '#7b9cff'}
                            leftIcon={<MaterialCommunityIcons name="history" size={20} color="white" />}
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            LOGS
                        </Button>

                        {/* ACCOUNT MANAGEMENT */}
                        <Button
                            borderRadius={0}
                            borderTopWidth={1}
                            borderBottomWidth={1}
                            borderColor={'white'}
                            _hover={{ bgColor: selectedScreen == 'ADD C-HUB ACCOUNT' ? '#0642F4' : '#5a7bc9', }}
                            marginTop={0} w={'full'}
                            onPress={() => handleToggleAddAccount(navigation)}
                            colorScheme={undefined}
                            bgColor={selectedScreen == 'ADD C-HUB ACCOUNT' ? '#0642F4' : '#7b9cff'}
                            leftIcon={<MaterialIcons name="person-add" size={20} color="white" />}
                            justifyContent="flex-start"
                            alignItems="center"
                        >ADD C-HUB ACCOUNT</Button>

                        <Button
                            borderRadius={0}
                            borderTopWidth={1}
                            borderBottomWidth={1}
                            borderColor={'white'}
                            _hover={{ bgColor: selectedScreen == 'ACCOUNT LIST' ? '#0642F4' : '#5a7bc9', }}
                            marginTop={0}
                            onPress={() => handleToggleAccountList(navigation)}
                            colorScheme={undefined}
                            bgColor={selectedScreen == 'ACCOUNT LIST' ? '#0642F4' : '#7b9cff'}
                            leftIcon={
                                <MaterialCommunityIcons name="account-details" size={20} color="white" />

                            }
                            justifyContent="flex-start"
                            alignItems="center"
                        >ACCOUNT LIST</Button>
                        {/* VEHICLE INFORMATION INPUT */}
                        <Button
                            borderRadius={0}
                            borderTopWidth={1}
                            borderBottomWidth={1}
                            borderColor={'white'}
                            _hover={{ bgColor: selectedScreen == 'ADD NEW VEHICLE' ? '#0642F4' : '#5a7bc9', }}
                            marginTop={0} w={'full'}
                            onPress={() => handleToggleAddVehicle(navigation)}
                            colorScheme={undefined}
                            bgColor={selectedScreen == 'ADD NEW VEHICLE' ? '#0642F4' : '#7b9cff'}
                            leftIcon={
                                <>
                                    <View>
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
                                    </View>


                                </>
                            }
                            justifyContent="flex-start"
                            alignItems="center"
                        >UPDATE / ADD NEW VEHICLE</Button>

                        <Button
                            borderRadius={0}
                            borderTopWidth={1}
                            borderBottomWidth={1}
                            borderColor={'white'}
                            _hover={{ bgColor: selectedScreen == 'VEHICLE LIST' ? '#0642F4' : '#5a7bc9', }}
                            marginTop={0}
                            onPress={() => handleVehicleList(navigation)}
                            colorScheme={undefined}
                            bgColor={selectedScreen == 'VEHICLE LIST' ? '#0642F4' : '#7b9cff'}
                            leftIcon={
                                <>
                                    <View>
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

                                    </View>


                                </>
                            }
                            justifyContent="flex-start"
                            alignItems="center"
                        // rightIcon={<FontAwesome name="automobile" size={15} color="white" />}
                        >VEHICLE LIST</Button>

                        <Button
                            borderRadius={0}
                            borderTopWidth={1}
                            borderBottomWidth={1}
                            borderColor={'white'}
                            _hover={{ bgColor: selectedScreen == 'FREIGHT' ? '#0642F4' : '#5a7bc9', }}
                            marginTop={0}
                            onPress={() => handleFreight(navigation)}
                            colorScheme={undefined}
                            bgColor={selectedScreen == 'FREIGHT' ? '#0642F4' : '#7b9cff'}
                            leftIcon={
                                <>
                                    <View>
                                        <MaterialIcons
                                            name="public"
                                            size={20}
                                            color="white" />

                                        <MaterialIcons name="sync" size={12} color="white"
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

                        <Button
                            borderRadius={0}
                            borderTopWidth={1}
                            borderBottomWidth={1}
                            borderColor={'white'}
                            _hover={{ bgColor: selectedScreen == 'CHAT MESSAGES' ? '#0642F4' : '#5a7bc9', }}
                            marginTop={0}
                            onPress={() => handleChatMessages(navigation)}
                            colorScheme={undefined}
                            bgColor={selectedScreen == 'CHAT MESSAGES' ? '#0642F4' : '#7b9cff'}
                            leftIcon={
                                <>
                                    <View>
                                        <Entypo
                                            name="chat"
                                            size={20}
                                            color="white" />

                                    </View>


                                </>
                            }
                            justifyContent="flex-start"
                            alignItems="center"
                        // rightIcon={<FontAwesome name="automobile" size={15} color="white" />}
                        >CHAT MESSAGES</Button>
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

    );
}


export default SideDrawer;