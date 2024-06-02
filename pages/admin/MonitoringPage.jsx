import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BASE_API_URL from "../../constant/ip";
import StatusMonitoringModal from "./components/StatusMonitoringModal";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomEventSource from "../../utils/customEventSource";

const MonitoringPage = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const { kelas_jurusan_id, kelas_jurusan } = route.params;
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState([]);

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
      mutate(); // Ensure data is revalidated
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

 
  const streamEvent = async () => {
    const token = await AsyncStorage.getItem("token");
    const eventSource = new CustomEventSource(
      `${BASE_API_URL}stream-monitoring-user-progress?kelas_jurusan_id=${kelas_jurusan_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data).data;
      setUsers(data.map((item) => item.user));
      setLinks(data.map((item) => item.link));
      setStatus(data.map((item) => item.status_progress));
    });

    return eventSource;
  };

  useEffect(() => {
    let eventSource;
    streamEvent().then((es) => {
      eventSource = es;
    });

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [kelas_jurusan_id]);

  return (
    <SafeAreaView className="bg-slate-50 h-full w-full">
      <View className="flex flex-row p-4 gap-2 mt-2 items-center border-b-[0.5px] border-slate-400 bg-white">
        <TouchableOpacity onPress={() => navigation.pop()}>
          <FontAwesomeIcon icon={faArrowLeft} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Monitoring {kelas_jurusan}</Text>
      </View>
      <ScrollView className="flex flex-col gap-3 px-4 mt-2">
        {users.length === 0 ? (
          <Text>tidak ada user ujian</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={links[index].id}
              className="p-3 border border-slate-300 rounded-lg w-auto flex"
            >
              <View className="flex-row flex justify-between">
                <Text className="text-lg font-semibold">{user.name}</Text>
                <TouchableOpacity
                  onPress={() => handleOpenModal(index, links[index].id)}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
                </TouchableOpacity>
              </View>
              <Text className="text-base">
                Mengerjakan {links[index]?.link_title}
              </Text>
              <Text
                className={`text-base ${
                  status[index] === "keluar"
                    ? "bg-red-400 p-2 mt-2 rounded-lg border w-1/4 text-center"
                    : status[index] === "selesai"
                    ? "bg-green-400 p-2 mt-2 rounded-lg border w-1/4 text-center"
                    : "bg-blue-400 p-2 mt-2 rounded-lg border w-1/4 text-center"
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
});

export default MonitoringPage;
