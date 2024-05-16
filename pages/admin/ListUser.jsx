import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_API_URL from "../../constant/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";

const ListUser = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const [links, setlinks] = useState([]);
  const [file, setFile] = useState(null);

  const {kelas_jurusan_id} = route.params

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
      console.log(file.assets[0].uri);
      const token = await AsyncStorage.getItem("token");
      await axios.post(`${BASE_API_URL}admin-sekolah/siswa-import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      getUsers();
      console.log("Data siswa berhasil diimpor!");
    } catch (error) {
      console.error("Error importing siswa:", error);
    }
  };

  const getUsers = async (url = '') => {
    try {
      console.log(url);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(url == '' ? `${BASE_API_URL}admin-sekolah?kelas_jurusan_id=${kelas_jurusan_id}` : url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data.data);
      setlinks(response.data.data.links);
      console.log(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

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
        {users?.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
            onPress={() =>
              navigation.push("UpdateUser", {
                id: item.id,
                name: item.name,
                kelas_jurusan_id: item.kelas_jurusan_id,
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
            <Button key={index} onPress={() =>getUsers(item.url)} title={item.label} />
          ))}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ListUser;
