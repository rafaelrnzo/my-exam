import { View, Text, TextInput, ToastAndroid, Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../../constant/ip";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CreateUser = ({ navigation }) => {
  const [fields, setFields] = useState({
    name: "",
    password: "",
    token1: "",
    token2: "",
    role: "",
    kelas_jurusan: "",
  });
  const [kelasJurusan, setkelasJurusan] = useState([]);

  const createUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}admin-sekolah/post`,
        fields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setFields({
        name: "",
        password: "",
        token1: "",
        token2: "",
        role: "",
        kelas_jurusan: "",
      });
      navigation.pop();
    } catch (error) {
      console.log(fields);
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
      <Text>nama</Text>
      <TextInput
        placeholder="nama"
        value={fields.name}
        onChangeText={(text) => setFields({ ...fields, name: text })}
      />
      <Text>password</Text>
      <TextInput
        placeholder="password"
        value={fields.password}
        onChangeText={(text) => setFields({ ...fields, password: text })}
      />
      <Text>token</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <TextInput
          maxLength={3}
          placeholder="max 3 characters"
          value={fields.token1}
          onChangeText={(text) => setFields({ ...fields, token1: text })}
        />
        <TextInput
          maxLength={3}
          placeholder="max 3 characters"
          value={fields.token2}
          onChangeText={(text) => setFields({ ...fields, token2: text })}
        />
      </View>
      <Text>role</Text>
      <SelectDropdown
        data={["admin sekolah", "siswa"]}
        defaultValue={"admin sekolah"}
        onSelect={(selectedRole, index) =>
          setFields({ ...fields, role: selectedRole })
        }
        renderButton={(selectedRole, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>{selectedRole}</Text>
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
      <Text>kelas_jurusan</Text>
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
      <Button title="create" onPress={createUser} />
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

export default CreateUser;
