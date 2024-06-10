import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
    role: "",
    password: "",
    sekolah: "",
    kelas_jurusan: "",
    token: "none",
  });
  const [kelasJurusan, setKelasJurusan] = useState([]);
  const [sekolah, setSekolah] = useState([]);
  const getKelas = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}kelas-jurusan`);
      setKelasJurusan(response.data.data);
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
    if (!fields.name.includes("@")) {
      alert("Name must contain '@'");
      return;
    }
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex flex-row p-4 pt-6 gap-2 mb-2 items-center border-b-[0.5px] border-slate-400 bg-white">
            <TouchableOpacity onPress={() => navigation.pop()} className="p-3">
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
            <Text className={`${textBasic}`}>Password</Text>
            <TextInput
              className={`${textInputStyle}`}
              value={fields.password}
              onChangeText={(text) => setFields({ ...fields, password: text })}
              placeholder="password"
              secureTextEntry
            />
            <View>
              <Text className={`${textBasic}`}>Role</Text>
              <SelectDropdown
                className="w-full"
                data={["admin sekolah", "siswa"]}
                defaultButtonText="select an option"
                defaultValue={fields.role}
                onSelect={(selectedRole, index) =>
                  setFields({ ...fields, role: selectedRole })
                }
                renderButton={(selectedRole, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {selectedRole || "select an option"}
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
            </View>

            <Text className={`${textBasic} `}>Sekolah</Text>
            <View className="flex flex-row ">
              <View className="flex-1 pr-2">
                <TextInput
                  className={`${textInputStyle}`}
                  value={fields.sekolah}
                  onChangeText={(text) => setFields({ ...fields, sekolah: text })}
                  placeholder="sekolah"
                />
              </View>
              {responseDataSekolah.length == 0 ? null : (
                <View className="flex-1">
                  <SelectDropdown
                    className=""
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
                </View>

              )}
            </View>

            <Text className={`${textBasic} `}>Kelas Jurusan</Text>
            <View className="flex flex-row">

              <View className=" flex-1 pr-2">
                <TextInput
                  className={`${textInputStyle}`}
                  value={fields.kelas_jurusan}
                  onChangeText={(text) =>
                    setFields({ ...fields, kelas_jurusan: text })
                  }
                  placeholder="kelas jurusan"
                />
              </View>
              {responseDataKelas?.length == 0 ? null : (
                <View className=" flex-1">

                  <SelectDropdown
                    className=""
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
                </View>
              )}

            </View>
            <View className="pt-2">
              <TouchableOpacity
                onPress={() => register()}
                className={`${buttonStyle}`}
              >
                <Text className={`${textTitle}  text-slate-50 text-lg`}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 9.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: "#000",
  },
  dropdownButtonArrowStyle: {
    fontSize: 20,
    color: "#000",
  },
  dropdownMenuStyle: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
    borderColor: "#cbd5e1",
  },
  dropdownItemStyle: {
    padding: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
    color: "#000",
  },
});

export default RegisterPage;
