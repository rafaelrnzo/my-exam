import { View, Text, TextInput, ToastAndroid, Button, StyleSheet } from 'react-native'
import React, { useState, useEffect } from "react";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from "react-native-select-dropdown";

const UpdateUser = ({navigation, route}) => {
  const {id,name,token,role,kelas_jurusan} = route.params
  const [fields, setFields] = useState({
    name: name,
    password: "",
    token: token,
    role: role,
    kelas_jurusan: kelas_jurusan,
  });
  const [kelasJurusan, setkelasJurusan] = useState([]);

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

  const updateUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(`${BASE_API_URL}admin-sekolah/${id}`, fields, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      setFields({
        name: "",
        password: "",
        token: "",
        role: "",
        kelas_jurusan: "",
      });
      navigation.pop()
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    getKelasJurusan();
  }, []);

  return (
    <View style={{ flex: 1, padding:10 }}>
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
    <View style={{ flexDirection:'row', alignItems:'center', gap:5 }}>
      <Text>usr-</Text>
    <TextInput
      placeholder="token"
      value={fields.token}
      onChangeText={(text) => setFields({ ...fields, token: text })}
      />
      <Text>-smkn10</Text>
    </View>
    <Text>role</Text>
    <SelectDropdown
        data={["admin sekolah", "siswa"]}
        defaultValue={fields.role}
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
        defaultValue={fields.kelas_jurusan}
        onSelect={(selectedKelas, index) =>
          setFields({ ...fields, kelas_jurusan: selectedKelas })
        }
        renderButton={(selectedKelas, isOpened) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {selectedKelas || fields.kelas_jurusan}
            </Text>
            <Icon
              name={isOpened ? "chevron-up" : "chevron-down"}
              style={styles.dropdownButtonArrowStyle}
            />
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    <Button title="update" onPress={updateUser} />
  </View>
  )
}

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

export default UpdateUser