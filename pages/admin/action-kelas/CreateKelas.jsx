import { View, Text, TextInput, Button, ToastAndroid, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../../constant/ip";
import { useApi } from "../../../utils/useApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { buttonStyle, textBasic, textInputStyle, textTitle } from "../../../assets/style/basic";

const CreateKelas = ({ navigation }) => {
  const [fields, setFields] = useState({ name: "" });
  const {postData, isLoading} = useApi()

  const createKelas = async () => {
    try {
      await postData(`${BASE_API_URL}post-kelas`, fields)
      setFields({ name: "" });
      navigation.replace("MainAdmin");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
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
