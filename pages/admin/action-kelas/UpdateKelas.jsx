import {
  View,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../../constant/ip";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  buttonStyle,
  textBasic,
  textInputStyle,
  textTitle,
} from "../../../assets/style/basic";
import { useApi } from "../../../utils/useApi";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const UpdateKelas = ({ navigation, route }) => {
  const { name_kelas, id } = route.params;
  const [fields, setFields] = useState({ name: name_kelas });
  const { putData } = useApi();

  const update = async () => {
    try {
      await putData(`${BASE_API_URL}update-kelas/${id}`, fields);
      setFields({ name: "" });
      navigation.reset({
        index: 0,
        routes: [{ name: "MainAdmin" }],
      });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };
  return (
    <SafeAreaView
      className="h-full w-full bg-slate-50 "
    >
       <View className="flex flex-row p-4 gap-2 mb-2 items-center border-b-[0.5px] border-slate-400 bg-white">
        <TouchableOpacity onPress={() => navigation.pop()}>
          <FontAwesomeIcon icon={faArrowLeft} color="black" />
        </TouchableOpacity>
        <Text className={`${textTitle}`}>Update Kelas</Text>
      </View>
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
  );
};

export default UpdateKelas;
