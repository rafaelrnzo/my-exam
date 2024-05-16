import {
  View,
  Text,
  Button,
  TextInput,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import BASE_API_URL from "../constant/ip";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const RegisterPage = ({ navigation }) => {
  const [fields, setFields] = useState({
    name: "",
    role: "admin sekolah",
    password: "",
    sekolah:"",
    kelas_jurusan:""
  });
 
  const register = async () => {
    try {
      await axios.post(`${BASE_API_URL}register`, fields);
      navigation.replace("LoginPage");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Text>name</Text>
      <TextInput
        value={fields.name}
        onChangeText={(text) => setFields({ ...fields, name: text })}
        placeholder="name"
      />
      <Text>password</Text>
      <TextInput
        value={fields.password}
        onChangeText={(text) => setFields({ ...fields, password: text })}
        placeholder="password"
      />
      <Text>Role</Text>
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
      <Text>Sekolah</Text>
      <TextInput
        value={fields.sekolah}
        onChangeText={(text) => setFields({ ...fields, sekolah: text })}
        placeholder="sekolah"
      />
      <Text>Kelas Jurusan</Text>
      <TextInput
        value={fields.kelas_jurusan}
        onChangeText={(text) => setFields({ ...fields, kelas_jurusan: text })}
        placeholder="kelas jurusan"
      />
      <Button title="register" onPress={() => register()} />
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

export default RegisterPage;
