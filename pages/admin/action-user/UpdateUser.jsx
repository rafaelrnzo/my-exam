import { View, Text, TextInput, ToastAndroid, Button, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from "react";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BASE_API_URL from '../../../constant/ip';
import { useApi } from '../../../utils/useApi';

const UpdateUser = ({ navigation, route }) => {
  const { id, name, token, role, kelas_jurusan } = route.params;
  const [fields, setFields] = useState({
    name: name,
    password: "",
    token: token,
    role: role,
    kelas_jurusan: kelas_jurusan,
  });
  const { data: kelasJurusan, error, isLoading } = useApi(`${BASE_API_URL}get-kelas`);
  const { putData } = useApi();

  const updateUser = async () => {
    try {
      await putData(`${BASE_API_URL}admin-sekolah/${id}`, fields);
      setFields({
        name: "",
        password: "",
        token: "",
        role: "",
        kelas_jurusan: "",
      });
      navigation.pop();
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    if (kelasJurusan) {
      setFields({ ...fields, kelas_jurusan: kelasJurusan.map(item => item.name) });
    }
  }, [kelasJurusan]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <TextInput
          placeholder="token"
          value={fields.token}
          onChangeText={(text) => setFields({ ...fields, token: text })}
        />
      </View>
      <Text>role</Text>
      <SelectDropdown
        data={["admin sekolah", "siswa"]}
        defaultValue={fields.role}
        onSelect={(selectedRole) => setFields({ ...fields, role: selectedRole })}
        renderButtonText={(selectedRole) => selectedRole}
        renderDropdownIcon={(isOpened) => (
          <Icon name={isOpened ? "chevron-up" : "chevron-down"} />
        )}
      />
      <Text>kelas_jurusan</Text>
      <SelectDropdown
        data={kelasJurusan || []}
        defaultValue={fields.kelas_jurusan}
        onSelect={(selectedKelas) => setFields({ ...fields, kelas_jurusan: selectedKelas })}
        renderButtonText={(selectedKelas) => selectedKelas}
        renderDropdownIcon={(isOpened) => (
          <Icon name={isOpened ? "chevron-up" : "chevron-down"} />
        )}
      />
      <Button title="update" onPress={updateUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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