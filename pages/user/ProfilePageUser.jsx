import { View, Text } from "react-native";
import React, { useEffect } from "react";

const ProfilePageUser = ({navigation}) => {
  const [fields, setFields] = useState({
    name: "",
    password: "",
    token: "",
    role: "",
    kelas_jurusan: "",
  });

  const getDataLoggedIn = async () => {
    const name = await AsyncStorage.getItem("name");
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    const kelas_jurusan = await AsyncStorage.getItem("kelas_jurusan");
    setFields({
      name: name,
      token: token,
      role: role,
      kelas_jurusan: kelas_jurusan,
    });
  };

  useEffect(() => {
    getDataLoggedIn();
  }, []);

  return (
    <View>
      <Text>name: {fields.name}</Text>
      <Text>role: {fields.role}</Text>
      <Text>token: {fields.token}</Text>
    </View>
  );
};

export default ProfilePageUser;
