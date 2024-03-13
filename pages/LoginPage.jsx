import { View, Text, Button, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'

const LoginPage = ({navigation}) => {
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);
  
  useEffect(() => {
    console.log(isSplitScreen)
    const handleDimensionsChange = ({ window }) => {
      const { width } = window;
      console.log(width);
      const minimumWidthForSplitScreen = 500;
      setIsSplitScreen(width < minimumWidthForSplitScreen);
    };

    const dimensionsListener = Dimensions.addEventListener(
      "change",
      handleDimensionsChange
    );

    return () => {
      dimensionsListener.remove();
    };
  }, [isSplitScreen]);

  const handleRefresh = () => {
    setIsTextVisible(false)
    setIsSplitScreen(false)
  }
  
  return (
    <View>
      <Text>LoginPage</Text>
      <Button title='login' onPress={() => navigation.navigate('HomePage')} />
      {isSplitScreen && isTextVisible && ( 
        <Text style={{ backgroundColor: "red", color: "white", padding: 10 }}>
          Aplikasi sedang dalam mode split screen
        </Text>
      )}
      {isSplitScreen && (
        <Button title="refresh" onPress={() => handleRefresh()} />
      )}
    </View>
  )
}

export default LoginPage