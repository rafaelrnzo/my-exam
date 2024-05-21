import { View, Text, TextInput, Button, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_API_URL from "../../../constant/ip";
import { SafeAreaView } from "react-native-safe-area-context";
import { buttonStyle, textBasic, textInputStyle, textTitle } from "../../../assets/style/basic";

const CreateKelas = ({ navigation }) => {
  const [fields, setFields] = useState({ name: "" });

  const createKelas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(`${BASE_API_URL}post-kelas`, fields, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFields({ name: "" });
      navigation.replace("MainAdmin");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };
  return (
    <SafeAreaView style={{ paddingTop: 0 }} className="h-full w-full bg-slate-50 flex justify-start">
      <View className="flex gap-y-2  px-4">
        <Text className={`${textBasic} `}>Nama Kelas</Text>
        <TextInput
          placeholder="Nama kelas"
          value={fields.name}
          onChangeText={(text) => setFields({ ...fields, name: text })}
          className={`${textInputStyle}`}
        />
      </View>
      <View className="pt-6 px-4">
        <TouchableOpacity className={`${buttonStyle}`} onPress={createKelas}>
          <Text className="font-semibold text-white text-lg">Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateKelas;
