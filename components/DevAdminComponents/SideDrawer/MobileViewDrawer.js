
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
import { View, TouchableOpacity, Easing, Image, Dimensions, Animated } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';



const MobileViewDrawer = ({ selectedScreen }) => {

  const [isOpen, setIsOpen] = useState(false);
  const logo2 = require('../../../assets/C-Hub Logo Only.png');

  const screenWidth = Dimensions.get('window').width;

  const navigation = useNavigation();

  const handleOpen = () => {

    setIsOpen(true);

  }
  const handleClose = () => {

    setIsOpen(false);

  }

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


  const handleFreight = useCallback(() => {
    navigation.navigate("FREIGHT");
  }, []);

  const handleChatMessages = useCallback(() => {
    navigation.navigate("CHAT MESSAGES");
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
      <TouchableHighlight onPress={() => handleOpen()} onPressOut={() => handleOpen()} underlayColor="#5a7bc9" style={{ borderRadius: 5, flex: 1 }}>
        <FontAwesome name="navicon" size={30} color="white" style={{ margin: 2 }} />
      </TouchableHighlight>


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
            <View style={{ backgroundColor: '#7b9cff', flex: 1, borderRightWidth: 2, borderColor: 'cyan' }}>
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
                <View style={{ paddingHorizontal: 1, backgroundColor: '#7b9cff', flex: 1 }}>
                  <ScrollView>
                    <TouchableOpacity
                      style={{
                        borderBottomWidth: 1,
                        borderTopWidth: 1,
                        borderColor: 'white',
                        backgroundColor: selectedScreen == 'LOGS' ? '#0642F4' : '#7b9cff',
                      }}
                      onPress={handleToggleLogs}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2, }}>
                        <MaterialCommunityIcons name="history" size={20} color="white" />
                        <Text style={{ color: 'white', paddingVertical: 10, paddingLeft: 10 }}>
                          LOGS
                        </Text>
                      </View>

                    </TouchableOpacity>

                    {/* ACCOUNT MANAGEMENT */}
                    <TouchableOpacity
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'white',
                        backgroundColor: selectedScreen == 'ADD C-HUB ACCOUNT' ? '#0642F4' : '#7b9cff',
                      }}
                      onPress={handleToggleAddAccount}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2, }}>

                        <MaterialIcons name="person-add" size={20} color="white" />
                        <Text style={{ color: 'white', paddingVertical: 10, paddingLeft: 10 }}>
                          ADD C-HUB ACCOUNT
                        </Text>
                      </View>

                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'white',
                        backgroundColor: selectedScreen == 'ACCOUNT LIST' ? '#0642F4' : '#7b9cff',
                      }}
                      onPress={handleToggleAccountList}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2, }}>
                        <MaterialCommunityIcons name="account-details" size={20} color="white" />
                        <Text style={{ color: 'white', paddingVertical: 10, paddingLeft: 10 }}>
                          ACCOUNT LIST
                        </Text>
                      </View>

                    </TouchableOpacity>
                    {/* VEHICLE INFORMATION INPUT */}
                    <TouchableOpacity
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'white',
                        backgroundColor: selectedScreen == 'ADD NEW VEHICLE' ? '#0642F4' : '#7b9cff',
                      }}
                      onPress={handleToggleAddVehicle}
                    >

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2, }}>
                        <View style={{ marginLeft: 4, }}>
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
                        <Text style={{ color: 'white', paddingVertical: 10, paddingLeft: 10 }}>
                          UPDATE / ADD NEW VEHICLE
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'white',
                        backgroundColor: selectedScreen == 'VEHICLE LIST' ? '#0642F4' : '#7b9cff',
                      }}
                      onPress={handleVehicleList}
                    >

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2, }}>
                        <View style={{ marginLeft: 3, }}>
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
                        <Text style={{ color: 'white', paddingVertical: 10, paddingLeft: 10 }}>
                          VEHICLE LIST
                        </Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'white',
                        backgroundColor: selectedScreen == 'FREIGHT' ? '#0642F4' : '#7b9cff',
                      }}
                      onPress={handleFreight}
                    >

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2, }}>
                        <View style={{ marginLeft: 3, }}>
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
                        <Text style={{ color: 'white', paddingVertical: 10, paddingLeft: 10 }}>
                          FREIGHT
                        </Text>
                      </View>
                    </TouchableOpacity>


                    <TouchableOpacity
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'white',
                        backgroundColor: selectedScreen == 'CHAT MESSAGES' ? '#0642F4' : '#7b9cff',
                      }}
                      onPress={handleChatMessages}
                    >

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 2, }}>
                        <View style={{ marginLeft: 3, }}>
                          <Entypo
                            name="chat"
                            size={20}
                            color="white" />

                        </View>
                        <Text style={{ color: 'white', paddingVertical: 10, paddingLeft: 10 }}>
                          CHAT MESSAGES
                        </Text>
                      </View>
                    </TouchableOpacity>
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
                </View>
              </View>
            </View>
          </Animated.View>
        </Modal.Content>
      </Modal>

    </>


  );
};

export default MobileViewDrawer;