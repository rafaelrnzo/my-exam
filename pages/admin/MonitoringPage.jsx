import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";
import { useUpdate } from "../../utils/updateContext";
import BASE_API_URL from "../../constant/ip";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { textBasic, textTitle } from "../../assets/style/basic";
import StatusMonitoringModal from "./components/StatusMonitoringModal";
import io from "socket.io-client";
import SOCKET_URL from "../../constant/ip_ws";

const MonitoringPage = ({ navigation, route }) => {
  const { updateTrigger, triggerUpdate } = useUpdate();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const { kelas_jurusan_id, kelas_jurusan } = route.params;
  const [url, setUrl] = useState(`
    ${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan_id=${kelas_jurusan_id}
  `);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const socket = io(SOCKET_URL);

  const { data, error, isLoading, putData, mutate } = useApi(url);
  const { logout } = useLogout();

  const users = data?.data?.data.map((item) => item.user) || [];
  const links = data?.data?.data.map((item) => item.link) || [];
  const status = data?.data?.data.map((item) => item.status_progress) || [];

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (searchQuery !== "") {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedTab !== "all") {
      filtered = filtered.filter((_, index) => status[index] === selectedTab);
    }
    return filtered;
  }, [searchQuery, selectedTab, users, status]);

  const handleOpenModal = (userIndex, id) => {
    setCurrentUser(userIndex);
    setCurrentId(id);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (newStatus, userId) => {
    console.log(userId, newStatus);
    try {
      await putData({
        url: `${BASE_API_URL}progress/${userId}`,
        updatedData: { status_progress: newStatus },
      });
      socket.emit("progressUpdated");
    } catch (error) {
      console.error("Error updating status:", error, newStatus);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const fetchData = async () => {
    mutate(url);
    console.log("Data refreshed");
  };

  useEffect(() => {
    if (updateTrigger) {
      mutate();
      triggerUpdate();
    }
  }, [updateTrigger, triggerUpdate, mutate]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("ujian-change-callback", () => {
      fetchData();
    });
    socket.on("ujian-dikerjakan-callback", () => {
      fetchData();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (error) {
    return (
      <View>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white flex items-center w-full flex-row py-2">
        <View className="w-full flex flex-row max-w-screen items-center px-4">
          <View className="flex-none">
            <TouchableOpacity onPress={() => navigation.pop()} className="p-4">
              <FontAwesomeIcon icon={faArrowLeft} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-grow border border-slate-300 px-4 p-2 rounded-lg flex flex-row items-center">
            <View className="px-2">
              <FontAwesomeIcon icon={faSearch} color="#cbd5e1" />
            </View>
            <TextInput
              className=""
              placeholder="Search by name"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
        </View>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "all" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "all" && styles.selectedText,
            ]}
            className={`${textBasic}`}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "keluar" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("keluar")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "keluar" && styles.selectedText,
            ]}
            className={`${textBasic}`}
          >
            Keluar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "split screen" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("split screen")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "split screen" && styles.selectedText,
            ]}
            className={`${textBasic}`}
          >
            Split Screen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "dikerjakan" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("dikerjakan")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "dikerjakan" && styles.selectedText,
            ]}
            className={`${textBasic}`}
          >
            Dikerjakan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "selesai" && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab("selesai")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "selesai" && styles.selectedText,
            ]}
            className={`${textBasic}`}
          >
            Selesai
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex flex-col gap-3 px-4 mt-2 flex-2 bg-slate-50"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredUsers.length === 0 ? (
          <Text>tidak ada user ujian</Text>
        ) : (
          filteredUsers.map((user, index) => {
            const userLink = links[users.indexOf(user)];
            const userStatus = status[users.indexOf(user)];
            return (
              <View
                key={index}
                className="p-3 border border-slate-300 bg-white rounded-lg w-auto flex"
              >
                <View className="flex-row flex justify-between">
                  <Text className={textTitle}>{user.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleOpenModal(users.indexOf(user), data.data.data[users.indexOf(user)].id)}
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
                  </TouchableOpacity>
                </View>
                <Text className={textBasic}>
                  Mengerjakan {userLink?.link_title}
                </Text>
                <View className="flex flex-row justify-end gap-x-2">
                  <Text
                    className={`${textBasic} ${userStatus === "keluar"
                      ? "text-red-500 font-medium text-center"
                      : userStatus === "selesai"
                        ? "text-green-500 text-center"
                        : userStatus === "dikerjakan"
                          ? "text-blue-500 text-center"
                          : "text-center rounded text-slate-500"
                      }`}
                  >
                    ● {userStatus}
                  </Text>
                </View>
              </View>
            );
          })
        )}
        {currentUser !== null && (
          <StatusMonitoringModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onUpdateStatus={(newStatus) => handleUpdateStatus(newStatus, currentId)}
            currentStatus={status[currentUser]}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  searchBar: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  selectedTab: {
    color: "#3b82f6",
    borderBottomColor: "#3b82f6",
  },
  selectedText: {
    color: "#3b82f6",
  },
  tabText: {
    fontSize: 16,
  },
});

export default MonitoringPage;