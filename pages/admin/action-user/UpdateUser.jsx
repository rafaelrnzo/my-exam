import { View, Text, TextInput, ToastAndroid, Button } from 'react-native'
import React, { useState } from "react";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateUser = ({navigation, route}) => {
  const {id,name,token,role,kelas_jurusan} = route.params
  const [fields, setFields] = useState({
    name: name,
    password: "",
    token: token,
    role: role,
    kelas_jurusan: kelas_jurusan,
  });

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
    <TextInput
      placeholder="role"
      value={fields.role}
      onChangeText={(text) => setFields({ ...fields, role: text })}
    />
    <Text>kelas_jurusan</Text>
    <TextInput
      placeholder="kelas_jurusan"
      value={fields.kelas_jurusan}
      onChangeText={(text) => setFields({ ...fields, kelas_jurusan: text })}
    />
    <Button title="update" onPress={updateUser} />
  </View>
  )
}

export default UpdateUser