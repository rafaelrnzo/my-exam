import { View, Text, TextInput, Button, ToastAndroid, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../../constant/ip";
import { useApi } from "../../../utils/useApi";

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
