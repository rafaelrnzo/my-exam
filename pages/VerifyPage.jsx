import { Button, Text, View } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../constant/ip";
import DeviceInfo from "react-native-device-info";
import "expo-dev-client";

const VerifyPage = ({ navigation }) => {
  const [textError, settextError] = useState("");

  const navigateToPage = (role) => {
    switch (role) {
      case "admin sekolah":
        navigation.replace("HomePageAdmin");
        break;
      case "siswa":
        navigation.replace("HomePageUser");
        break;
      default:
        navigation.replace("HomePageUser");
        break;
    }
  };

  const verifySerialNumber = async () => {
    try {
      const role = await AsyncStorage.getItem("role");
      const token = await AsyncStorage.getItem("token");
      console.log(DeviceInfo.getUniqueId())
      DeviceInfo.getUniqueId().then((uniqueId) => {
        axios.post(
          `${BASE_API_URL}verify`,
          {
            serial_number: uniqueId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((response) => {
          console.log(response.data.data);
          if (
            response.data.data === "Serial number updated successfully" ||
            response.data.data === "Serial number valid"
          ) {
            navigateToPage(role);
          } else {
            console.log("Serial number is not valid");
            settextError("Serial number is not valid");
          }
        }).catch((error) => {
          console.log("Error:", error);
          settextError("Serial number error");
          // navigation.replace('LoginPage')
        });
      });
    } catch (error) {
      console.log("Error:", error);
      settextError("Serial number error");
      // navigation.replace('LoginPage')
    }
  };
  

  useEffect(() => {
    verifySerialNumber();
  }, []);

  const logoutUser = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `${BASE_API_URL}logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await AsyncStorage.removeItem("token");
      navigation.replace("LoginPage");
    } catch (error) {
      await AsyncStorage.removeItem("token");
      navigation.replace("LoginPage");
    }
  };

  return (
    <View>
      <Text>{textError}</Text>
      <Button title="logout" onPress={() => logoutUser()} />
    </View>
  );
};

export default VerifyPage;
