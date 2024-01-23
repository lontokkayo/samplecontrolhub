
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text } from 'native-base';

const CheckBoxButton = ({ label, onChange }) => {
    const [checked, setChecked] = useState(false);
  
    const handlePress = () => {
      setChecked(!checked);
      onChange(!checked);
    };
  
    return (
      <TouchableOpacity
        pressDuration={0}
        style={{ flex: 1, justifyContent: 'center' }}
        onPress={handlePress}
      >
        <Box
          justifyContent="center"
          alignItems="center"
          borderRadius={3}
          flex={1}
          bgColor={checked ? '#7b9cff' : 'white'}
          margin={1}
          overflow={'hidden'}
          h={['auto', 'auto', 'auto', 10, 10, 10]}
        >
          <Text
            fontSize={[9, 11, 12, 11, 12, 13]}
            maxW={[85, 100, 180, 100, 130, 180]}
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

 