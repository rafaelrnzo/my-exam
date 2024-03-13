import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import {
  View,
  BackHandler,
  Alert,
  AppState,
  Text,
  Dimensions,
  Button,
} from "react-native";
import { usePreventScreenCapture } from "expo-screen-capture";
import { disabledSelect } from "../constant/script";

const HomePageUser = () => {
  usePreventScreenCapture();
  const [currentState, setCurrentState] = useState(AppState.currentState);
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Peringatan",
          "Anda mencoba untuk meninggalkan aplikasi. Semua record anda akan terulang",
          [
            {
              text: "Batal",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Keluar", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      }
    );

    const handleAppStateChange = (nextAppState) => {
      if (currentState == "background") {
        Alert.alert(
          "Peringatan",
          "Kamu baru saja keluar aplikasi, seluruh aktifitas kamu terekam",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }

      setCurrentState(nextAppState);
    };

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      backHandler.remove();
      appStateListener.remove();
    };
  }, [currentState]);

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
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri: "https://docs.google.com/forms/d/e/1FAIpQLSfgXFzWuOo9sWAx3v4LfnNZWnTTLx6jwnmGnx4_qiOE75lV1w/viewform",
        }}
        injectedJavaScript={disabledSelect}
        style={{ flex: 1 }}
      />
      <Text>Current State: {currentState}</Text>
      {isSplitScreen && isTextVisible && ( 
        <Text style={{ backgroundColor: "red", color: "white", padding: 10 }}>
          Aplikasi sedang dalam mode split screen
        </Text>
      )}
      {isSplitScreen && (
        <Button title="refresh" onPress={() => handleRefresh()} />
      )}
    </View>
  );
};

export default HomePageUser;
