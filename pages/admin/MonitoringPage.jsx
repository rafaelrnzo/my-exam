import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import BASE_API_URL from "../../constant/ip";
import { useApi } from "../../utils/useApi";
import StatusMonitoringModal from "./components/StatusMonitoringModal";

const MonitoringPage = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const { putData } = useApi();

  const handleOpenModal = (userIndex, id) => {
    setCurrentUser(userIndex);
    setCurrentId(id)
    setModalVisible(true);
  };

  const handleUpdateStatus = async (newStatus, userId) => {
    try {
      await putData(`${BASE_API_URL}progress/${userId}`, {
        status_progress: newStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error, newStatus);
    }
  };

  const { kelas_jurusan_id } = route.params;
  const [url, setUrl] = useState(
    `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan_id=${kelas_jurusan_id}`
  );

  const { data, error, isLoading } = useApi(url);

  const users = data?.data.data.map((item) => item.user) || [];
  const links = data?.data.data.map((item) => item.link) || [];
  const status = data?.data.data.map((item) => item.status_progress) || [];
  const paginations = data?.data.links || [];

  const handleLinkPress = (newUrl) => {
    if (newUrl === null) {
      setUrl(
        `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan_id=${kelas_jurusan_id}`
      );
    } else {
      setUrl(newUrl);
    }
    console.log(newUrl);
  };

  if (error) {
    return <Text>Error loading data</Text>;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
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
            <TouchableOpacity
              style={styles.userRow}
              key={index}
              onPress={() => handleOpenModal(index,data.data.data[index].id)}
            >
              <Text>{data.data.data[index].id}</Text>
              <Text>{user.name}</Text>
              <Text>{user.kelas_jurusan}</Text>
              <Text>{links[index]?.link_title}</Text>
              <Text>{status[index]}</Text>
            </TouchableOpacity>
          ))
        )}
        {currentUser !== null && (
          <StatusMonitoringModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onUpdateStatus={(newStatus) => 
              handleUpdateStatus(newStatus, currentId)
            }
            currentStatus={status[currentUser]}
          />
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
