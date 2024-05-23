import { SafeAreaView, Text, Button, ActivityIndicator, View } from "react-native";
import React from "react";
import BASE_API_URL from "../../constant/ip";
import Card from "../../components/Card";
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";

const HomePageAdmin = ({ navigation }) => {
  const { logout } = useLogout();
  const {
    data: links,
    error,
    isLoading,
  } = useApi(`${BASE_API_URL}admin-sekolah/links`);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>error</Text>
        <Button title="logout" onPress={logout} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ padding: 4 }}>
      <Text>HomePageAdmin</Text>
      {links.data.length > 0 ? (
        links.data.map((item) => (
          <Card
            key={item.id}
            press={() =>
              navigation.push("UpdateLinkAdmin", {
                link_title: item.link_title,
                link_status: item.link_status,
                kelas_jurusan: item.kelas_jurusan.name,
                link_name: item.link_name,
                waktu_pengerjaan: item.waktu_pengerjaan,
                waktu_pengerjaan_mulai: item.waktu_pengerjaan_mulai,
                waktu_pengerjaan_selesai: item.waktu_pengerjaan_selesai,
                id: item.id,
              })
            }
            link_title={item.link_title}
            link_status={item.link_status}
            kelas_jurusan={item.kelas_jurusan.name}
          />
        ))
      ) : (
        <Text>No links available</Text>
      )}
      <Button
        title="Create link"
        onPress={() => navigation.push("CreateLinkAdmin")}
      />
      <Button title="logout" onPress={() => logout()} />
    </SafeAreaView>
  );
};

export default HomePageAdmin;
