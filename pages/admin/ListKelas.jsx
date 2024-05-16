import {
  View,
  Text,
  ToastAndroid,
  Button,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_API_URL from "../../constant/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListKelas = ({ navigation }) => {
  const [kelasJurusan, setKelasJurusan] = useState([]);

  const fetchKelasJurusan = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${BASE_API_URL}admin-sekolah/kelas-jurusan`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data);
      setKelasJurusan(response.data.data);
    } catch (error) {
      console.error("Failed to fetch kelas jurusan:", error);
    }
  };

  const deleteKelas = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${BASE_API_URL}delete-kelas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.replace("MainAdmin");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    fetchKelasJurusan();
  }, []);
  return (
    <SafeAreaView style={{ padding: 10, paddingTop: 30 }}>
      <View style={{ flexDirection: "row" }}>
        <Text>list kelas</Text>
        <Button
          title="+kelas"
          onPress={() => navigation.navigate("CreateKelas")}
        />
      </View>
      <ScrollView>
        {kelasJurusan.map((item, index) => (
          <View
            key={index}
            style={{
              padding: 10,
              borderColor: "black",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text>{item.name}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "column" }}>
                <Button
                  title="view"
                  onPress={() =>
                    navigation.push("ListUser", {
                      kelas_jurusan_id: item.id,
                      kelas_jurusan: item.name,
                    })
                  }
                />
                <Button
                  title="monitoring"
                  onPress={() =>
                    navigation.push("MonitoringPage", {
                      kelas_jurusan_id: item.id,
                      kelas_jurusan: item.name,
                    })
                  }
                />
              </View>
              <View style={{ flexDirection: "column" }}>
                <Button
                  title="Edit"
                  onPress={() =>
                    navigation.push("UpdateKelas", {
                      name_kelas: item.name,
                      id: item.id,
                    })
                  }
                />
                <Button title="delete" onPress={() => deleteKelas(item.id)} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListKelas;
