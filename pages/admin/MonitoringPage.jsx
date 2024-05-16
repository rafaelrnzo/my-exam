import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Button, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../constant/ip";

const MonitoringPage = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [paginations, setPaginations] = useState([]);
  const [status, setStatus] = useState([]);
  const { kelas_jurusan } = route.params;

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async (urlParams = "") => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan=${kelas_jurusan}`;
      console.log(urlParams);
      const response = await axios.get(urlParams == "" ? url : urlParams, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = response.data.data;
      setUsers(data.map((item) => item.user));
      setLinks(data.map((item) => item.link));
      setStatus(data.map((item) => item.status_progress));
      setPaginations(response.data.data.links);
    } catch (error) {
      console.error("Failed to fetch user progress:", error);
    }
  };

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
