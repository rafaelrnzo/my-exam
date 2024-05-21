import React,{useState} from "react";
import { View, Text, SafeAreaView, Button, StyleSheet, ActivityIndicator } from "react-native";
import BASE_API_URL from "../../constant/ip";
import { useApi } from "../../utils/useApi";

const MonitoringPage = ({ navigation, route }) => {
  const { kelas_jurusan_id } = route.params;
  const [url, setUrl] = useState(`${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan_id=${kelas_jurusan_id}`);

  const {data, error, isLoading} = useApi(url)

  const users = data?.data.data.map((item) => item.user) || []
  const links = data?.data.data.map((item) => item.link) || []
  const status = data?.data.data.map((item) => item.status_progress) || []
  const paginations = data?.data.links || []

  const handleLinkPress = (newUrl) => {
    setUrl(newUrl);
  };

  if (error) {
    return <Text>Error loading data</Text>;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        {users.length == 0 ? (
          <>
          <Text>tidak ada user ujian</Text>
          <Button title="tes" onPress={() => console.log(kelas_jurusan_id)} />
          </>
        ) : (
          users.map((user, index) => (
            <View style={styles.userRow} key={user.id}>
              <Text>{user.name}</Text>
              <Text>{user.kelas_jurusan}</Text>
              <Text>{links[index]?.link_title}</Text>
              <Text>{status[index]}</Text>
            </View>
          ))
        )}
      </View>
      {paginations.length !== 0 && (
        <View style={styles.paginationContainer}>
          {paginations.map((item, index) => (
            <Button
              key={index}
              onPress={() => handleLinkPress(item.url)}
              title={item.label}
            />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    padding: 20,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default MonitoringPage;
