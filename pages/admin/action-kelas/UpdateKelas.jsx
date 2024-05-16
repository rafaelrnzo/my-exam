import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_API_URL from "../../../constant/ip";

const UpdateKelas = ({navigation, route}) => {
    const {name_kelas, id} = route.params
    const [fields, setFields] = useState({ name: name_kelas });
    const update = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          await axios.put(`${BASE_API_URL}update-kelas/${id}`, fields, {
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
    <View>
    <Text>UpdateKelas</Text>
    <TextInput
      placeholder="nama kelas"
      value={fields.name}
      onChangeText={(text) => setFields({ ...fields, name: text })}
    />
    <Button title="update" onPress={update} />
  </View>
  )
}

export default UpdateKelas