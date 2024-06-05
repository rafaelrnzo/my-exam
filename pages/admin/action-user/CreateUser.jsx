import {
  View,
  Text,
  TextInput,
  ToastAndroid,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../../constant/ip";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useApi } from "../../../utils/useApi";
import {
  buttonStyle,
  textInputStyle,
  textTitle,
} from "../../../assets/style/basic";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const CreateUser = ({ navigation, route }) => {
  const { sekolah, kelas_jurusan_id, kelas_jurusan } = route.params;
  const [fields, setFields] = useState({
    name: "",
    password: "",
    tokenPrefix: "",
    tokenSuffix: "",
    role: "",
    kelas_jurusan: "",
  });
  const { postData } = useApi();
  const {
    data: kelasJurusan,
    error,
    isLoading,
  } = useApi(`${BASE_API_URL}get-kelas`);
  const responseData = kelasJurusan?.data?.map((item) => item.name);

  const createUser = async () => {
    try {
      await postData({
        url: `${BASE_API_URL}admin-sekolah/post`,
        newData: {
          ...fields,
          token: fields.tokenPrefix,
        },
      });
      setFields({
        name: "",
        password: "",
        tokenPrefix: "",
        tokenSuffix: "",
        role: "",
        kelas_jurusan: "",
      });
      navigation.replace("ListUser", {
        kelas_jurusan_id: kelas_jurusan_id,
        sekolah: sekolah,
        kelas_jurusan: kelas_jurusan,
      });
    } catch (error) {
      console.log(fields);
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ paddingTop: 10 }}
      className="h-full w-full bg-slate-50"
    >
      <View className="flex flex-row p-4 gap-2 mt-2 items-center border-b-[0.5px] border-slate-400 bg-white">
        <TouchableOpacity onPress={() => navigation.pop()}>
          <FontAwesomeIcon icon={faArrowLeft} color="black" />
        </TouchableOpacity>
        <Text className={`${textTitle}`}>Create User</Text>
      </View>
      <View className="flex flex-col px-4 gap-2 mt-2">
        <Text className={`${textTitle}`}>Nama</Text>
        <TextInput
          placeholder="nama"
          value={fields.name}
          className={`${textInputStyle}`}
          onChangeText={(text) => setFields({ ...fields, name: text })}
        />
        <Text className={`${textTitle}`}>Password</Text>
        <TextInput
          placeholder="password"
          value={fields.password}
          className={`${textInputStyle}`}
          onChangeText={(text) => setFields({ ...fields, password: text })}
        />
        <View className="flex flex-col">
          <Text className={`${textTitle}`}>Token</Text>
          <View className="flex flex-row">
            <TextInput
              placeholder="Token Prefix"
              value={fields.tokenPrefix}
              className={`${textInputStyle} w-1/2`}
              onChangeText={(text) =>
                setFields({ ...fields, tokenPrefix: text })
              }
            />
            <TextInput
              placeholder="Token Suffix"
              value={sekolah}
              className={`${textInputStyle} w-1/2`}
              editable={false}
            />
          </View>
        </View>
        <Text className={`${textTitle} mb-2`}>Role</Text>
        <SelectDropdown
          data={["admin sekolah", "siswa"]}
          defaultValue={"admin sekolah"}
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
        <View className="flex-row flex-wrap">
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View className="pr-2 flex-auto">
              <Text className={`${textTitle} mb-2`}>Kelas Jurusan</Text>
              <SelectDropdown
                data={responseData || []}
                defaultValue={responseData[0]}
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
        <TouchableOpacity
          className={`${buttonStyle}`}
          onPress={createUser}
          disabled={fields.name.length === 0 ? true : false}
        >
          <Text className="font-semibold text-white text-lg">Create</Text>
        </TouchableOpacity>
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

export default CreateUser;
