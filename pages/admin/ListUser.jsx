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

const ListUser = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [links, setlinks] = useState([]);
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState({
    name: "",
    password: "",
    token: "",
    role: "",
    kelas_jurusan: "",
  });

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
      const token = await AsyncStorage.getItem('token');
      console.log(url);
      console.log(BASE_API_URL);
      const response = await axios.get(url == '' ? `${BASE_API_URL}admin-sekolah` : url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data.data);
      setlinks(response.data.data.links);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <SafeAreaView style={{ padding: 20 }}>
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
      {links.length !== 0 ? (
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}
        >
          {links.map((item, index) => (
            <Button key={index} onPress={() =>getUsers(item.url)} title={item.label} />
          ))}
        </View>
      ) : null}

      <ScrollView>
        {users?.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
            onPress={() =>
              navigation.push("UpdateUser", {
                id: item.id,
                name: item.name,
                kelas_jurusan: item.kelas_jurusan,
                token: item.token,
                role: item.role,
              })
            }
          >
            <Text>name: {item.name}</Text>
            <Text>kelas_jurusan: {item.kelas_jurusan ?? "admin"}</Text>
            <Text>token: {item.token}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListUser;
