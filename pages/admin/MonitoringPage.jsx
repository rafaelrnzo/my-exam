import React from "react";
import { View, Text, SafeAreaView, Button, StyleSheet } from "react-native";
import BASE_API_URL from "../../constant/ip";
import { useApi } from "../../utils/useApi";

const MonitoringPage = ({ navigation, route }) => {
  const { kelas_jurusan } = route.params;
  const {data, error, isLoading} = useApi()

  const fetchUserProgress = async (urlParams = "") => {
    try {
      const url = `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan=${kelas_jurusan}`;
      useApi(urlParams == "" ? url : urlParams)
    } catch (error) {
      console.error("Failed to fetch user progress:", error);
    }
  };

  const users = data.data.map((item) => item.user)
  const links = data.data.map((item) => item.link)
  const status = data.data.map((item) => item.status_progress)
  const paginations = data.links

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        {users.length == 0 ? (
          <Text>tidak ada user ujian</Text>
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
              onPress={() => fetchUserProgress(item.url)}
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
