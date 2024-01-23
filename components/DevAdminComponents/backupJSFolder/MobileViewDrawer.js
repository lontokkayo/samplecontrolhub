
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
import React, { useState, } from 'react';
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo
} from 'react-native-vector-icons';





const MobileViewDrawer = ({ handleToggleAddVehicle, handleVehicleList, handleToggleLogs, handleToggleAddAccount, handleToggleAccountList, selectedScreen }) => {

  const [isOpen, setIsOpen] = useState(false);
  const logo2 = require('../../../assets/C-Hub Logo Only.png');


  const handleOpen = () => {

    setIsOpen(true);

  }
  const handleClose = () => {

    setIsOpen(false);

  }
  return (

    <>

      <FontAwesome name="navicon" size={30} color="white" onPress={() => handleOpen()} />

      <Modal isOpen={isOpen} onClose={() => handleClose()} useRNModal
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          height: '100%',
        }}
        _slide={{}}>

        <Modal.Content maxWidth="55%" borderRadius={0} maxHeight={'100%'} height={'full'}>

          <Box w={'full'} bgColor="#7b9cff" height={'full'} borderRightWidth={2} borderColor={'cyan.500'} >
            <HStack w={'100%'} h={8} marginBottom={1.5} marginTop={1.5} >

              <Box width={'80%'} flex={1} alignItems={'center'} justifyContent={'center'} >
                <Image
                  source={{
                    uri: logo2
                  }}
                  resizeMode="stretch"
                  alt="Real Motor Japan Control Hub"
                  style={{ flex: 1 }}
                  width={'90%'}
                />
              </Box>
              <MaterialIcons name="arrow-back" size={30} color="white" onPress={() => handleClose()} />
            </HStack>

            {/* Sidebar Content */}
            <Box px={'1'} bgColor="#7b9cff" height={"full"}>
              <ScrollView w={'full'} >
                <VStack space={1} w={'full'} h={20}>
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
                        <MaterialCommunityIcons name="account-details" size={20} color="white" />

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




        </Modal.Content>
      </Modal>


    </>


  );
};

export default MobileViewDrawer;