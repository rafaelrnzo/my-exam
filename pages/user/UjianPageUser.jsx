import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import {
  View,
  BackHandler,
  Alert,
  AppState,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventScreenCapture } from "expo-screen-capture";
import { disabledSelect } from "../../constant/script";
import axios from "axios";
import BASE_API_URL from "../../constant/ip";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import TimerComponent from "../admin/components/TimerComponent";
import { useWindowDimensions } from "react-native";

const UjianPageUser = ({ navigation, route }) => {
  usePreventScreenCapture();
  const [currentState, setCurrentState] = useState(AppState.currentState);
  const { link_id, link_name, link_title, waktu_pengerjaan } = route.params;

  const updateProgress = async (progress) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${BASE_API_URL}progress/user/${link_id}`,
        {
          status_progress: progress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        response.data.data === "keluar" ||
        response.data.data === "split screen" ||
        response.data.data === "selesai"
      ) {
        navigation.replace("HomePageUser");
      }
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  const getStatusProgress = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}progress/${link_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data?.data?.status_progress === "split screen") {
        navigation.replace("HomePageUser");
      } 
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    getStatusProgress();
  }, []);

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
          [{ text: "OK", onPress: () => updateProgress("keluar") }],
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
  const { height, width } = useWindowDimensions();
  useEffect(() => {
    console.log(height, width);
    if (height < 500) {
      Alert.alert(
        "Split Screen Detected",
        "Aplikasi sedang berjalan dalam mode split screen. Beberapa fitur mungkin terbatas.",
        [{ text: "OK", onPress: () => updateProgress("split screen") }],
        { cancelable: false }
      );
    }
  }, [height]);

  const handleTimerFinish = () => {
    updateProgress("selesai");
  };

  return (
    <View style={{ flex: 1 }}>
      <View className="flex flex-row justify-between bg-white p-4 items-center">
        <Text className="text-blue-500 text-lg">{link_title}</Text>
        <View className="flex flex-row items-center">
          <FontAwesomeIcon icon={faClock} color="blue" size={17} />
          <TimerComponent
            waktu_pengerjaan={waktu_pengerjaan}
            onFinish={handleTimerFinish}
          />
        </View>
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded"
          onPress={() => updateProgress("selesai")}
        >
          <Text className="text-white">Finish</Text>
        </TouchableOpacity>
      </View>
      <WebView
        source={{
          uri: link_name,
        }}
        injectedJavaScript={disabledSelect}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default UjianPageUser;
