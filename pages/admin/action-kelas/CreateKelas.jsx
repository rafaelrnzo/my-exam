import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_API_URL from "../../../constant/ip";

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
    <View>
      <Text>CreateKelas</Text>
      <TextInput
        placeholder="nama kelas"
        value={fields.name}
        onChangeText={(text) => setFields({ ...fields, name: text })}
      />
      <Button title="create" onPress={createKelas} />
    </View>
  );
};

export default CreateKelas;
