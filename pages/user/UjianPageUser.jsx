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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventScreenCapture } from "expo-screen-capture";
import { disabledSelect } from "../../constant/script";
import axios from "axios";
import BASE_API_URL from "../../constant/ip";

const UjianPageUser = ({ navigation, route }) => {
  usePreventScreenCapture();
  const [currentState, setCurrentState] = useState(AppState.currentState);
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const { link_id } = route.params;
  const { link_name } = route.params;

  const updateProgress = async (progress) => {
    const token = await AsyncStorage.getItem('token')
    const response = await axios.put(`${BASE_API_URL}progress/user`, {
      link_id: link_id,
      status_progress: progress,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.data === 'keluar' || response.data.data === 'split screen' || response.data.data === 'selesai') {
      navigation.replace('HomePageUser')
    }
  };

  const getStatusProgress = async() => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await axios.get(`${BASE_API_URL}progress/${link_id}`, {
        headers:{Authorization:`Bearer ${token}`}
      })
      if (response.data.data === 'selesai') {
        navigation.replace('HomePageUser')
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getStatusProgress()
  }, [])

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
          [{ text: "OK", onPress: () => updateProgress('keluar') }],
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
    console.log(isSplitScreen);
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
    setIsTextVisible(false);
    setIsSplitScreen(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri: link_name,
        }}
        injectedJavaScript={disabledSelect}
        style={{ flex: 1 }}
      />
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
      <Text>Current State: {currentState}</Text>
      <Button title="selesai" onPress={() => updateProgress('selesai')} />
      </View>
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

export default UjianPageUser;
