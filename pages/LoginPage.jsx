import { View, Text, Button, TextInput, ToastAndroid } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../constant/ip";

const LoginPage = ({ navigation }) => {
  const [fields, setFields] = useState({
    name: "",
    token: "",
    password: "",
  });

  const saveTokenRole = async (token, role, name, kelas_jurusan) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("role", role);
    await AsyncStorage.setItem("name", name);
    await AsyncStorage.setItem("kelas_jurusan", kelas_jurusan);
  };

  const login = async () => {
    try {
      const response = await axios.post(`${BASE_API_URL}login-siswa`, fields);
      const token = response.data.token;
      const role = response.data.message;
      const kelas_jurusan = response.data.user.kelas_jurusan;
      saveTokenRole(token, role, fields.name, kelas_jurusan);
      setFields({
        name: "",
        token: "",
        password: "",
      });
      navigation.replace("VerifyPage");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
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
        value={fields.name}
        onChangeText={(text) => setFields({ ...fields, name: text })}
        placeholder="name"
      />
      <TextInput
        value={fields.token}
        onChangeText={(text) => setFields({ ...fields, token: text })}
        placeholder="token"
      />
      <Text>Password</Text>
      <TextInput
        value={fields.password}
        onChangeText={(text) => setFields({ ...fields, password: text })}
        placeholder="password"
      />
      <Button title="Login" onPress={login} />
    </View>
  );
};

export default LoginPage;
