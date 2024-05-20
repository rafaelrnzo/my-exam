import { View, Text, Button, TextInput, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../constant/ip";
import { SafeAreaView } from "react-native-safe-area-context";
import { buttonStyle, textBasic, textHero, textInputStyle, textSubtitle, textTitle } from "../assets/style/basic";

const LoginPage = ({ navigation }) => {
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
      const response = await axios.post(`${BASE_API_URL}login-siswa`, fields);
      const token = response.data.token;
      const role = response.data.message;
      saveTokenRole(token, role, fields.name);
      setFields({
        name: "",
        token: "",
        password: "",
      });
      navigation.replace("HomePageUser", {name:fields.name});
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-slate-50 px-4 flex justify-start">
      <View className="pt-8 flex gap-4">
        <View>
          <Text className={`${textTitle}`}>Login User</Text>
        </View>
        <View className="gap-0 flex">
          <Text className={`${textHero} text-3xl`}>Welcome Back</Text>
          <Text className={`${textSubtitle}`}>Sign in to your account </Text>
        </View>
      </View>
      <View className="flex gap-2 pt-4">
        <View className="flex gap-y-2">
          <Text className={`${textBasic} `}>Name</Text>
          <TextInput
            className={`${textInputStyle}`}
            value={fields.name}
            onChangeText={(text) => setFields({ ...fields, name: text })}
            placeholder="input name"
          />
        </View>
        <View className="flex gap-y-2">

          <Text className={`${textBasic}`}>Password</Text>
          <TextInput
            className={`${textInputStyle}`}

            value={fields.password}
            onChangeText={(text) => setFields({ ...fields, password: text })}
            placeholder="password"
          />
        </View>
        <View className="flex gap-y-2">
          <Text className={`${textBasic}`}>Token</Text>
          <TextInput
            className={`${textInputStyle}`}
            onChangeText={(text) => setFields({ ...fields, token: text })}
            value={fields.token}
            placeholder="token"
          />
        </View>

        <View className="pt-2">
          <TouchableOpacity onPress={login} className={`${buttonStyle}`}>
            <Text className={`${textTitle} text-slate-50 text-lg`}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
