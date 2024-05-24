import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, Button, ActivityIndicator, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import BASE_API_URL from "../../constant/ip";
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { textBasic } from "../../assets/style/basic";
import { FullWindowOverlay } from "react-native-screens";
import Card from "./components/CardLinkAdmin";

const HomePageAdmin = ({ navigation }) => {
  const { logout } = useLogout();
  const { data: links, error, isLoading } = useApi(`${BASE_API_URL}admin-sekolah/links`);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    // Update selected tab based on link_status from API
    if (links && links.data.length > 0) {
      setSelectedTab("all");
    }
  }, [links]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  const filteredLinks = links.data
    .filter(item => selectedTab === "all" || item.link_status === selectedTab)
    .filter(item => item.link_title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView className="pt-10 bg-white h-full">
      <View className="bg-white flex items-center w-full">
        <View style={styles.searchBar} className="f">
          <View className="pr-2">
            <FontAwesomeIcon icon={faSearch} color="#cbd5e1" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by link title"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "all" && styles.selectedTab]}
            onPress={() => setSelectedTab("all")}
          >
            <Text style={[styles.tabText, selectedTab === "all" && styles.selectedText]} className={`${textBasic}`}>Recently</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "active" && styles.selectedTab]}
            onPress={() => setSelectedTab("active")}
          >
            <Text style={[styles.tabText, selectedTab === "active" && styles.selectedText]} className={`${textBasic}`}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "inactive" && styles.selectedTab]}
            onPress={() => setSelectedTab("inactive")}
          >
            <Text style={[styles.tabText, selectedTab === "inactive" && styles.selectedText]} className={`${textBasic}`}>Inactive </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="p-4 bg-slate-50 h-full">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((item) => (
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
              time={item.waktu_pengerjaan_mulai}
              link_title={item.link_title}
              link_status={item.link_status}
              kelas_jurusan={item.kelas_jurusan.name}
            />
          ))
        ) : (
          <Text>No {selectedTab} links available</Text>
        )}
        {/* <Button
          title="Create link"
          onPress={() => navigation.push("CreateLinkAdmin")}
        /> */}
        {/* <Button title="Logout" onPress={() => logout()} /> */}
      </View>
      <TouchableOpacity
        className="absolute bottom-4 right-4 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.push("CreateLinkAdmin")}
      >
        <FontAwesomeIcon icon={faPlus} color="white" />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    width: FullWindowOverlay,
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
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
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

export default HomePageAdmin;
