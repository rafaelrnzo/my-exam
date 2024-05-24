import { SafeAreaView, Text, Button, ActivityIndicator, View, TextInput, FlatList } from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../constant/ip";
import Card from "../../components/Card";
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";
import { textTitle } from "../../assets/style/basic";

const HomePageAdmin = ({ navigation }) => {
  const { logout } = useLogout();
  const {
    data: links,
    error,
    isLoading,
  } = useApi(`${BASE_API_URL}admin-sekolah/links`);
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = links.data.filter((item) =>
    item.link_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text>Error: {error.message}</Text>
        <Text>error</Text>
        <Button title="logout" onPress={logout} />
      </View>
    );
  }
  
  return (
    <SafeAreaView className="pt-6 bg-slate-50 h-full w-full">
      <View className="flex justify-center items-center py-4 border-b-[0.5px] border-slate-400 bg-white">
        <Text className={`${textTitle}`}>Classroom</Text>
      </View>
      <TextInput
        placeholder="Search by link title..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          margin: 10,
          paddingLeft: 8,
          borderRadius: 4,
          backgroundColor: 'white'
        }}
      />
      {filteredLinks.length > 0 ? (
        <FlatList
          data={filteredLinks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              key={item.id}
              press={() =>
                navigation.push("UpdateLinkAdmin", {
                  link_title: item.link_title,
                  link_status: item.link_status,
                  kelas_jurusan: item.kelas_jurusan.name,
                  link_name: item.link_name,
                  id: item.id,
                })
              }
              link_title={item.link_title}
              link_status={item.link_status}
              kelas_jurusan={item.kelas_jurusan.name}
            />
          )}
        />
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
