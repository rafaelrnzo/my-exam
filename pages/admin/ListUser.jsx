import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../constant/ip";
import * as DocumentPicker from "expo-document-picker";
import { useApi } from "../../utils/useApi";

const ListUser = ({ navigation, route }) => {
  const [file, setFile] = useState(null);
  const {kelas_jurusan_id} = route.params
  const [url, setUrl] = useState(`${BASE_API_URL}admin-sekolah?kelas_jurusan_id=${kelas_jurusan_id}`);
  const { data, error, isLoading, postData } = useApi(url);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (result.canceled == false) {
        setFile(result);
        console.log(result.assets[0].name, file);
      } else {
        setFile(null);
      }
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };


  const handleImport = async () => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.assets[0].uri,
        type: "file/xlsx",
        name: file.assets[0].name,
      });
      await postData(`${BASE_API_URL}admin-sekolah/siswa-import`, formData)
    } catch (error) {
      console.error("Error importing siswa:", error);
    }
  };

  const users = data?.data.data || []
  const links = data?.data.links || []

  const handleLinkPress = (newUrl) => {
    if(newUrl === null){
      setUrl(`${BASE_API_URL}admin-sekolah?kelas_jurusan_id=${kelas_jurusan_id}`)
    } else{
      setUrl(newUrl);
    }
    console.log(newUrl);
  };

  if (error) {
    return <Text>Error loading data</Text>;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Button title="Pilih File Excel" onPress={pickFile} />
        {<Text>{file?.assets[0].name}</Text>}
        <Button title="import" onPress={handleImport} />
        <Button title="create" onPress={() => navigation.push("CreateUser")} />
      </View>
      <ScrollView>
        {users.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
            onPress={() =>
              navigation.push("UpdateUser", {
                id: item.id,
                name: item.name,
                kelas_jurusan: item.kelas_jurusan.name,
                token: item.token,
                role: item.role,
              })
            }
          >
            <Text>name: {item.name}</Text>
            <Text>kelas_jurusan: {item.kelas_jurusan.name ?? "admin"}</Text>
            <Text>token: {item.token}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {links.length !== 0 ? (
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 4, paddingTop:10 }}
        >
          {links.map((item, index) => (
            <Button key={index} onPress={() =>handleLinkPress(item.url)} title={item.label} />
          ))}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ListUser;
