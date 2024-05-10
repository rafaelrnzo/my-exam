import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import BASE_API_URL from "../../../constant/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateLinkAdmin = ({ navigation }) => {
  const [fields, setFields] = useState({
    link_name: "",
    link_title: "",
    kelas_jurusan: "",
  });

  const createLink = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(`${BASE_API_URL}links/post`, fields, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      setFields({
        link_name: "",
        link_title: "",
        kelas_jurusan: "",
      });
      navigation.replace("HomePageAdmin");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  return (
    <View style={{ flex: 1, padding:10 }}>
      <Text>Link URL</Text>
      <TextInput
        placeholder="link"
        value={fields.link_name}
        onChangeText={(text) => setFields({ ...fields, link_name: text })}
      />
      <Text>Link Title</Text>
      <TextInput
        placeholder="title"
        value={fields.link_title}
        onChangeText={(text) => setFields({ ...fields, link_title: text })}
      />
      <Text>Kelas Jurusan</Text>
      <TextInput
        placeholder="kelas"
        value={fields.kelas_jurusan}
        onChangeText={(text) => setFields({ ...fields, kelas_jurusan: text })}
      />
      <Button title="create" onPress={createLink} />
    </View>
  );
};

export default CreateLinkAdmin;
