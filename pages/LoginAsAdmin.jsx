import { View, Text, Button, TextInput, ToastAndroid } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../constant/ip";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginAsAdmin = ({ navigation }) => {
  const [fields, setFields] = useState({
    name: "",
    token: "",
    password: "",
  });

  const saveTokenRole = async (token, role, name) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("role", role);
    await AsyncStorage.setItem("name", name);
  };

  const login = async () => {
    try {
      const response = await axios.post(`${BASE_API_URL}login`, fields);
      const token = response.data.token;
      const role = response.data.message;
      saveTokenRole(token, role, fields.name);
      setFields({
        name: "",
        token: "",
        password: "",
      });
      navigation.replace("MainAdmin");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  return (
    <SafeAreaView className="h-full bg-slate-50">
      <Text>Name</Text>
      <TextInput
        value={fields.name}
        onChangeText={(text) => setFields({ ...fields, name: text })}
        placeholder="name"
        />
      <Text>Password</Text>
      <TextInput
        value={fields.password}
        onChangeText={(text) => setFields({ ...fields, password: text })}
        placeholder="password"
      />
      <Button title="USER" onPress={() => navigation.replace("LoginPage")} />
      <Button title="Login" onPress={login} />
    </SafeAreaView>
  );
};

export default LoginAsAdmin;
