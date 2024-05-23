import { View, Text, TextInput, ToastAndroid, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../../constant/ip";
import { SafeAreaView } from "react-native-safe-area-context";
import { buttonStyle, textBasic, textInputStyle } from "../../../assets/style/basic";
import { useApi } from "../../../utils/useApi";

const UpdateKelas = ({ navigation, route }) => {
  const { name_kelas, id } = route.params;
  const [fields, setFields] = useState({ name: name_kelas });
  const { putData } = useApi();
  
  const update = async () => {
    try {
      await putData(`${BASE_API_URL}update-kelas/${id}`, fields);
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
        <TouchableOpacity className={`${buttonStyle}`} onPress={update}>
          <Text className="font-semibold text-white text-lg">Update </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default UpdateKelas;
