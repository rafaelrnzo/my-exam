import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import BASE_API_URL from "../../constant/ip";
import { useApi } from "../../utils/useApi";
import StatusMonitoringModal from "./components/StatusMonitoringModal";
import { textBasic, textTitle } from "../../assets/style/basic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useLogout } from "../../utils/useLogout";
import eventEmitter from "../../utils/eventEmitter";

const MonitoringPage = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const { kelas_jurusan_id, kelas_jurusan } = route.params;
  const [url, setUrl] = useState(
    `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan_id=${kelas_jurusan_id}`
  );

  const { data, error, isLoading, putData, mutate } = useApi(url);
  const { logout } = useLogout();
  // Handle case when data is undefined
  const users = data?.data?.data.map((item) => item.user) || [];
  const links = data?.data?.data.map((item) => item.link) || [];
  const status = data?.data?.data.map((item) => item.status_progress) || [];
  const paginations = data?.data?.links || [];

  const handleOpenModal = (userIndex, id) => {
    setCurrentUser(userIndex);
    setCurrentId(id);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (newStatus, userId) => {
    try {
      await putData(`${BASE_API_URL}progress/${userId}`, {
        status_progress: newStatus,
      });
      mutate(url); // Ensure data is revalidated
    } catch (error) {
      console.error("Error updating status:", error, newStatus);
    }
  };

  const handleLinkPress = (newUrl) => {
    setUrl(
      newUrl
        ? newUrl
        : `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan_id=${kelas_jurusan_id}`
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const fetchData = async () => {
    mutate(url)
    console.log("Data refreshed");
  };

  useEffect(() => {
    eventEmitter.on("progressCreated", mutate(url))
  
    return () => {
      eventEmitter.off("progressCreated", mutate(url))
    }
  }, [])
  

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-slate-50 h-full w-full">
      <View className="flex flex-row p-4 gap-2 mt-2 items-center border-b-[0.5px] border-slate-400 bg-white">
        <TouchableOpacity onPress={() => navigation.pop()}>
          <FontAwesomeIcon icon={faArrowLeft} color="black" />
        </TouchableOpacity>
        <Text className={`${textTitle}`}>Monitoring {kelas_jurusan}</Text>
      </View>
      <ScrollView className="flex flex-col gap-3 px-4 mt-2"
      refreshControl={
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    }
      >
        {users.length == 0 ? (
          <Text>tidak ada user ujian</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={links[index].id}
              className="p-3 border border-slate-300 rounded-lg w-auto flex "
            >
              <View className="flex-row flex justify-between">
                <Text className={`${textTitle}`}>{user.name}</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleOpenModal(index, data.data.data[index].id)
                  }
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
                </TouchableOpacity>
              </View>
              <Text className={`${textBasic}`}>
                Mengerjakan {links[index]?.link_title}
              </Text>
              <Text
                className={`${textBasic} ${
                  status[index] === "keluar"
                    ? "bg-red-400 p-2 mt-2 rounded-lg border text-center"
                    : status[index] === "selesai"
                    ? "bg-green-400 p-2 mt-2 rounded-lg border text-center"
                    : "bg-blue-400 p-2 mt-2 rounded-lg border text-center"
                }`}
              >
                {status[index]}
              </Text>
            </View>
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
      </ScrollView>
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
