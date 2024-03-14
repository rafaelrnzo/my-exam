import { View, Text, Button, Dimensions, TextInput, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../constant/ip";

const LoginPage = ({ navigation }) => {
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const navigateToPage = (role) => {
    switch (role) {
      case "admin":
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

  const saveTokenRole = async (token, role, name) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("role", role);
    await AsyncStorage.setItem("name", name);
  };

  const login = async () => {
    try {
      const response = await axios.post(`${BASE_API_URL}login`, {
        name: name,
        password: password,
      });
      const token = response.data.token;
      const role = response.data.message;
      saveTokenRole(token, role, name);
      setname("");
      setpassword("");
      navigateToPage(role);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

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
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: 4,
      }}
    >
      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={(text) => setname(text)}
        placeholder="name"
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={(text) => setpassword(text)}
        placeholder="password"
      />
      <Button title="Login" onPress={login} />
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

export default LoginPage;
