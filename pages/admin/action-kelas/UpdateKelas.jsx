import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../../constant/ip";
import { useApi } from "../../../utils/useApi";

const UpdateKelas = ({ navigation, route }) => {
  const { name_kelas, id } = route.params;
  const [fields, setFields] = useState({ name: name_kelas });
  const { putData, isLoading } = useApi();
  const update = async () => {
    try {
      await putData(`${BASE_API_URL}update-kelas/${id}`, fields);
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
      <Text>UpdateKelas</Text>
      <TextInput
        placeholder="nama kelas"
        value={fields.name}
        onChangeText={(text) => setFields({ ...fields, name: text })}
      />
      <Button title="update" onPress={update} />
    </View>
  );
};

export default UpdateKelas;
