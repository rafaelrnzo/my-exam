import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Button, ScrollView, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../constant/ip";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MonitoringPage = () => {
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [paginations, setPaginations] = useState([]);
  const [status, setStatus] = useState([]);
  const [fields, setFields] = useState({ kelas: 'pilih kelas' });
  const [kelasJurusan, setKelasJurusan] = useState([]);

  const fetchKelasJurusan = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}admin-sekolah/kelas-jurusan-monitoring`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const kelasData = response.data.data.map(item => item.kelas_jurusan);
      setKelasJurusan(kelasData);
    } catch (error) {
      console.error("Failed to fetch kelas jurusan:", error);
    }
  };

  useEffect(() => {
    fetchKelasJurusan();
    fetchUserProgress()
  }, []);

  const fetchUserProgress = async (urlParams='', kelas='') => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan=${kelas}`;
      console.log(urlParams);
      const response = await axios.get(urlParams == '' ? url : urlParams, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = response.data.data;
      setUsers(data.map(item => item.user));
      setLinks(data.map(item => item.link));
      setStatus(data.map(item => item.status_progress));
      setPaginations(response.data.data.links);
    } catch (error) {
      console.error("Failed to fetch user progress:", error);
    }
  };

  const handleSelectKelas = (selectedKelas) => {
    setFields({ ...fields, kelas: selectedKelas });
    fetchUserProgress('',selectedKelas);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flexDirection:'row', alignContent:'center' }}>
      <SelectDropdown
        data={kelasJurusan}
        defaultValue={fields.kelas}
        onSelect={handleSelectKelas}
        renderButton={(selectedKelas, isOpened) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>{fields.kelas}</Text>
            <Icon name={isOpened ? "chevron-up" : "chevron-down"} style={styles.dropdownButtonArrowStyle} />
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View style={[styles.dropdownItemStyle, isSelected && styles.dropdownItemSelected]}>
            <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
<Button title="clear filter" onPress={() => console.log('clear')} />
      </View>
      <ScrollView>
        {users.map((user, index) => (
          <View style={styles.userRow} key={user.id}>
            <Text>{user.name}</Text>
            <Text>{links[index]?.link_title}</Text>
            <Text>{status[index]}</Text>
          </View>
        ))}
      </ScrollView>
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
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  dropdownItemSelected: {
    backgroundColor: "#D2D9DF",
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default MonitoringPage