import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, VStack, ScrollView, Text, Pressable, View, Input } from 'native-base';

const CustomSearchableDropdown = forwardRef(({ data }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(data);

  useImperativeHandle(ref, () => ({
    getSelectedValue: () => selectedValue
  }));

  useEffect(() => {
    if (searchText !== '') {
      setFilteredItems(
        data.filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
      );
    } else {
      setFilteredItems(data);
    }
  }, [searchText, data]);

  const handleOptionPress = (item) => {
    setSelectedValue(item);
    setSearchText(item);
    setIsOpen(false);
  }

  return (
    <Box>
      <View position="relative" bgColor="white">
        <Pressable onPress={() => setIsOpen(true)}>
          <Input value={searchText} placeholder="Search" onFocus={() => setIsOpen(true)} onChangeText={setSearchText} />
        </Pressable>

        {isOpen && (
           <VStack position="absolute" width="100%" maxHeight={20} bg="white" borderColor="coolGray.200" borderWidth={1} rounded="sm" zIndex={10}>
            <ScrollView>
              {filteredItems.map((item, index) =>
                <Pressable key={index} onPress={()=>handleOptionPress(item)}>
                  <Text px={3} py={2}>{item}</Text>
                </Pressable>
              )}
            </ScrollView>
          </VStack>
        )}
      </View>
    </Box>
  );
});

export default CustomSearchableDropdown;
