import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React from "react";
import BASE_API_URL from "../constant/ip";
import { SafeAreaView } from "react-native-safe-area-context";
import { buttonStyle, textBasic, textHero, textInputStyle, textSubtitle, textTitle } from "../assets/style/basic";
import { useLogin } from "../utils/useLogin";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const LoginAsAdmin = ({ navigation }) => {
  const { fields, setFields, login } = useLogin();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    if (!fields.name || !fields.password) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (!fields.name.includes("@")) {
      setErrorMessage("Email must contain '@'.");
      return;
    }
    try {
      await login(`${BASE_API_URL}login`, 'MainAdmin');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Unauthorized. Please check your name or password.");
      } else {
        setErrorMessage("Login failed. Please check your name or password.");
      }
    }
  };

  return (
    <SafeAreaView className="h-full w-full bg-slate-50 px-4 flex justify-start">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="pt-8 flex gap-4">
            <TouchableOpacity onPress={() => navigation.pop()} className="h-8 w-32">
              <FontAwesomeIcon icon={faArrowLeft} color="black" />
            </TouchableOpacity>
            <View>
              <Text className={textTitle}>Login Admin</Text>
            </View>
            <View className="gap-0 flex">
              <Text className={`${textHero} text-3xl`}>Welcome Back</Text>
              <Text className={textSubtitle}>Sign in to your account</Text>
            </View>
          </View>
          <View className="flex gap-2 pt-4">
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
            <View className="flex gap-y-2">
              <Text className={textBasic}>Email</Text>
              <TextInput
                className={textInputStyle}
                value={fields.name}
                onChangeText={(text) => setFields({ ...fields, name: text })}
                placeholder="input email"
              />
            </View>
            <View className="flex gap-y-2">
              <Text className={textBasic}>Password</Text>
              <TextInput
                className={textInputStyle}
                value={fields.password}
                onChangeText={(text) => setFields({ ...fields, password: text })}
                placeholder="password"
                secureTextEntry
              />
            </View>
            <View className="pt-4">
              <TouchableOpacity onPress={handleLogin} className={buttonStyle}>
                <Text className={`${textTitle} text-slate-50 text-lg`}>Login Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginAsAdmin;
