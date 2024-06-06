import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  Button,
  ActivityIndicator,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import BASE_API_URL from "../../constant/ip";
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";
import { textBasic } from "../../assets/style/basic";
import Card from "./components/CardLinkAdmin";
import BottomSheetFilter from "./components/BottomSheetFilter";

const HomePageAdmin = ({ navigation }) => {
  const { logout } = useLogout();
  const {
    data: links,
    error,
    isLoading,
    deleteData,
    mutate
  } = useApi(`${BASE_API_URL}admin-sekolah/links`);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isModalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    mutate().then(() => setRefreshing(false));
  }, []);

  const deleteLink = async (id) => {
    try {
      await deleteData(`${BASE_API_URL}links/${id}`);
      await mutate(`${BASE_API_URL}admin-sekolah/links`);
      navigation.reset({
        index: 0,
        routes: [{ name: "MainAdmin" }],
      });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    if (links && links?.data?.length > 0) {
      setSelectedTab("all");
    }
  }, [links]);

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
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  const filteredLinks = links?.data
    ?.filter(
      (item) => selectedTab === "all" || item.link_status === selectedTab
    )
    ?.filter((item) =>
      item.link_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    ?.filter(
      (item) =>
        !Object.keys(filters).some(
          (key) => filters[key] && item.kelas_jurusan.id !== parseInt(key)
        )
    ) || [];

    const classes = Array.from(
      new Set(links?.data?.map((item) => item.kelas_jurusan.id))
    ).map((id) => {
      return links?.data?.find((item) => item.kelas_jurusan.id === id)
        ?.kelas_jurusan;
    });

  return (
    <SafeAreaView className="pt-10 bg-white w-full h-full">
      <View className="bg-white flex items-center w-full">
        <View className="w-full flex flex-row">
          <View style={styles.searchBar} className="w-4/5">
            <View className="pr-2">
              <FontAwesomeIcon icon={faSearch} color="#cbd5e1" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by link title"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          <TouchableOpacity
            className="flex items-center flex-row"
            onPress={() => {
              setModalVisible(!isModalVisible);
            }}
          >
            <FontAwesomeIcon icon={faFilter} color="#3b82f6" size={20} />
          </TouchableOpacity>
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
              Recently
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "active" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("active")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "active" && styles.selectedText,
              ]}
              className={`${textBasic}`}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "inactive" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("inactive")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "inactive" && styles.selectedText,
              ]}
              className={`${textBasic}`}
            >
              Inactive
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="px-4 bg-slate-50 h-full" 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        {filteredLinks.length > 0 ? (
          filteredLinks.map((item) => (
            <Card
              onLongPress={() => deleteLink(item.id)}
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
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-4 right-4 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.push("CreateLinkAdmin")}
      >
        <FontAwesomeIcon icon={faPlus} color="white" />
      </TouchableOpacity>
      <BottomSheetFilter
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
        classes={classes}
      />
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
