import {
  View,
  Text,
  TextInput,
  Button,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_API_URL from "../../../constant/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CreateLinkAdmin = ({ navigation }) => {
  const [fields, setFields] = useState({
    link_name: "",
    link_title: "",
    kelas_jurusan: "",
    waktu_pengerjaan: 0,
    waktu_pengerjaan_mulai: "",
    waktu_pengerjaan_selesai: "",
  });

  const [kelasJurusan, setkelasJurusan] = useState([]);

  const createLink = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(`${BASE_API_URL}links/post`, fields, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setFields({
        link_name: "",
        link_title: "",
        kelas_jurusan: "",
        waktu_pengerjaan: 0,
        waktu_pengerjaan_mulai: "",
        waktu_pengerjaan_selesai: "",
      });
      navigation.replace("MainAdmin");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  const getKelasJurusan = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(`${BASE_API_URL}get-kelas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = response.data.data;
      setkelasJurusan(responseData.map((item) => item.name));
      console.log(kelasJurusan);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKelasJurusan();
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
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
      <Text>Waktu pengerjaan</Text>
      <TextInput
        placeholder="waktu_pengerjaan"
        value={fields.waktu_pengerjaan}
        onChangeText={(text) => setFields({ ...fields, waktu_pengerjaan: text })}
      />
      <Text>Waktu pengerjaan mulai</Text>
      <TextInput
        placeholder="waktu_pengerjaan_mulai"
        value={fields.waktu_pengerjaan_mulai}
        onChangeText={(text) => setFields({ ...fields, waktu_pengerjaan_mulai: text })}
      />
      <Text>waktu pengerjaan selesai</Text>
      <TextInput
        placeholder="waktu_pengerjaan_selesai"
        value={fields.waktu_pengerjaan_selesai}
        onChangeText={(text) => setFields({ ...fields, waktu_pengerjaan_selesai: text })}
      />
      <Text>Kelas Jurusan</Text>
      <SelectDropdown
        data={kelasJurusan}
        defaultValue={kelasJurusan[0]}
        onSelect={(selectedKelas, index) =>
          setFields({ ...fields, kelas_jurusan: selectedKelas })
        }
        renderButton={(selectedKelas, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>{selectedKelas}</Text>
              <Icon
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#D2D9DF" }),
              }}
            >
              <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <Button title="create" onPress={createLink} />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

export default CreateLinkAdmin;
