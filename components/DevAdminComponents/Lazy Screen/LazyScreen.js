import React, { lazy, Suspense } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Box, Center, Stack, HStack, Spinner, Image } from 'native-base';
const logo = require('../../../assets/RMJ C-Hub 制御ハブ.png');
// Create a loading component to display while the screen is loading
const Loading = () => (


  <Box bgColor='#7b9cff' w='100%' h='100%'>

    <Center flex={1}>
      <Center px="3">
        <Box w={[300, 400, 550]} h={[94, 125, 172]}>
          <Image source={{
            uri: logo
          }} resizeMode='stretch' alt="Real Motor Japan Control Hub" style={{ flex: 1, }} />
        </Box>
        {/* <LoginForm /> */}

        <Stack space={4} w="100%" alignItems="center">
          <HStack space={1} justifyContent="center">
            <Spinner color='white' size='lg' />
          </HStack>
        </Stack>

      </Center>


    </Center>


  </Box>
);

const LazyScreen = (props) => {
  // Dynamically import the component using React.lazy
  const LazyComponent = lazy(props.importFunc);

  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LazyScreen;
