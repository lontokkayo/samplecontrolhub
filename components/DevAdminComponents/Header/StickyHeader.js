import { useState } from "react";
import { View, Dimensions, StyleSheet, Image } from "react-native";
import { Box, Flex, Popover, Button, Text } from "native-base";
import FastImage from "react-native-fast-image-web-support";
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

import MobileViewDrawer from "../SideDrawer/MobileViewDrawer";
import { useSelector } from "react-redux";



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
          <Popover.Content backgroundColor={'#7B9CFF'}>
            {/* <Popover.Arrow bgColor={'#7B9CFF'} /> */}
            <Popover.Body backgroundColor={'#7B9CFF'}>
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

const StickyHeader = ({ selectedScreen, handleSignOut }) => {
  const loginName = useSelector((state) => state.loginName);

  const screenWidth = Dimensions.get('window').width;
  // const logo = require('https://i.imgur.com/V98nKSK.png');
  // const logo2 = require('https://i.imgur.com/NGCIoSV.png');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
    },
  });

  return (

    <Box
      px="3"
      bgColor='#7b9cff'
      height={54}
      position="sticky"
      top={0}
      zIndex={999}
      flexDirection="row"
      alignItems="center"
      borderBottomWidth={2}
      borderBottomColor={'cyan.500'} >

      <Box w={[0, 0, 0, 850]} h={[10, 10, 10, 10]} marginBottom={1.5} marginTop={1.5}>
        <Image
          source={{ uri: 'https://i.imgur.com/V98nKSK.png' }}
          style={styles.image}
          resizeMode="stretch"
        />
      </Box>

      {screenWidth <= 960 && <MobileViewDrawer
        selectedScreen={selectedScreen}
      />}


      <Box w={[150, 200, 250, 0]} h={[6, 8, 10, 10]} marginBottom={1.5} marginTop={1.5} marginLeft={[3, 3, 3, 10]}>
      <Image
          source={{ uri: 'https://i.imgur.com/NGCIoSV.png' }}
          style={styles.image}
          resizeMode="stretch"
        />
      </Box>

      <NamePopover name={loginName} handleSignOut={handleSignOut} />
    </Box>

  );
}

export default StickyHeader;