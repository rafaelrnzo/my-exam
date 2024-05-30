import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_API_URL from "../constant/ip";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  buttonStyle,
  textBasic,
  textInputStyle,
  textTitle,
} from "../assets/style/basic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const RegisterPage = ({ navigation }) => {
  const [fields, setFields] = useState({
    name: "",
    role: "admin sekolah",
    password: "",
    sekolah: "",
    kelas_jurusan: "",
  });
  const [kelasJurusan, setkelasJurusan] = useState([]);
  const [sekolah, setSekolah] = useState([]);
  const getKelas = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}kelas-jurusan`);
      setkelasJurusan(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getSekolah = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}sekolah`);
      setSekolah(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const register = async () => {
    try {
      await axios.post(`${BASE_API_URL}register`, fields);
      navigation.replace("PortalPage");
    } catch (error) {
      console.log(error, fields);
    }
  };

  useEffect(() => {
    getKelas();
    getSekolah();
  }, []);
  const responseDataSekolah = sekolah.map((item) => item.name);
  const responseDataKelas = kelasJurusan.map((item) => item.class_school) || [];

  return (
    <SafeAreaView className="h-full w-full bg-slate-50 flex flex-col">
      <View className="flex flex-row p-4 pt-6 gap-2 mb-2 items-center border-b-[0.5px] border-slate-400 bg-white">
        <TouchableOpacity onPress={() => navigation.pop()}>
          <FontAwesomeIcon icon={faArrowLeft} color="black" />
        </TouchableOpacity>
        <Text className={`${textTitle}`}>Register</Text>
      </View>
      <View className="pt-5 px-4 flex flex-col gap-2">
        <Text className={`${textBasic} `}>Name</Text>
        <TextInput
          className={`${textInputStyle}`}
          value={fields.name}
          onChangeText={(text) => setFields({ ...fields, name: text })}
          placeholder="name"
        />
        <Text>Password</Text>
        <TextInput
          className={`${textInputStyle}`}
          value={fields.password}
          onChangeText={(text) => setFields({ ...fields, password: text })}
          placeholder="password"
        />
        <Text className={`${textBasic}`}>Role</Text>
        <SelectDropdown
          className="pl-3"
          data={["admin sekolah", "siswa"]}
          defaultValue={fields.role}
          onSelect={(selectedRole, index) =>
            setFields({ ...fields, role: selectedRole })
          }
          renderButton={(selectedRole, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedRole}
                </Text>
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
        <Text className={`${textBasic} `}>Sekolah</Text>
        <View className="flex flex-row w-1/2">
          <TextInput
            className={`${textInputStyle}`}
            value={fields.sekolah}
            onChangeText={(text) => setFields({ ...fields, sekolah: text })}
            placeholder="sekolah"
          />
          {responseDataSekolah.length == 0 ? null : (
            <SelectDropdown
              className="ml-3"
              data={responseDataSekolah}
              defaultValue={responseDataSekolah[0]}
              onSelect={(selectedSekolah, index) =>
                setFields({ ...fields, sekolah: selectedSekolah })
              }
              renderButton={(selectedSekolah, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedSekolah}
                    </Text>
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
          )}
        </View>
        <Text className={`${textBasic} `}>Kelas Jurusan</Text>
        <View className="flex flex-row w-1/2">
          <TextInput
            className={`${textInputStyle}`}
            value={fields.kelas_jurusan}
            onChangeText={(text) =>
              setFields({ ...fields, kelas_jurusan: text })
            }
            placeholder="kelas jurusan"
          />
          {responseDataKelas?.length == 0 ? null : (
            <SelectDropdown
              className="pl-3"
              data={responseDataKelas}
              defaultValue={responseDataKelas[0]}
              onSelect={(selectedKelas, index) =>
                setFields({ ...fields, kelas_jurusan: selectedKelas })
              }
              renderButton={(selectedKelas, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedKelas}
                    </Text>
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
          )}
        </View>

        <View className="pt-2">
          <TouchableOpacity
            onPress={() => register()}
            className={`${buttonStyle}`}
          >
            <Text className={`${textTitle} text-slate-50 text-lg`}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
