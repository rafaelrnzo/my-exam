import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  FlatList,
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
    mutate,
  } = useApi(`${BASE_API_URL}admin-sekolah/links`);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isModalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    mutate().then(() => setRefreshing(false));
  }, [mutate]);

  const deleteLink = useCallback(
    async (id) => {
      try {
        await deleteData(`${BASE_API_URL}links/${id}`);
        await mutate();
        navigation.reset({
          index: 0,
          routes: [{ name: "MainAdmin" }],
        });
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
    },
    [deleteData, mutate, navigation]
  );

  useEffect(() => {
    if (links && links?.data?.length > 0) {
      setSelectedTab("all");
    }
  }, [links]);

  const sortedLinks = useMemo(() => {
    return (
      links?.data?.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ) || []
    );
  }, [links]);

  const filteredLinks = useMemo(() => {
    return (
      sortedLinks
        .filter(
          (item) => selectedTab === "all" || item.link_status === selectedTab
        )
        .filter((item) =>
          item.link_title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(
          (item) =>
            !Object.keys(filters).some(
              (key) => filters[key] && item.kelas_jurusan.id !== parseInt(key)
            )
        ) || []
    );
  }, [sortedLinks, selectedTab, searchQuery, filters]);

  const classes = useMemo(() => {
    return Array.from(
      new Set(links?.data?.map((item) => item.kelas_jurusan.id))
    ).map(
      (id) =>
        links?.data?.find((item) => item.kelas_jurusan.id === id)?.kelas_jurusan
    );
  }, [links]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  const renderItem = ({ item }) => (
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
  );

  return (
    <SafeAreaView className="pt-10 bg-white w-full h-full">
      <View className="bg-white flex items-center w-full">
        <View className="w-full flex flex-row px-4 max-w-screen items-center">
          <View className="flex-grow border border-slate-300 px-5 p-2.5 rounded-lg flex flex-row items-center">
            <View className="px-2">
              <FontAwesomeIcon icon={faSearch} color="#cbd5e1" />
            </View>
            <TextInput
              className=""
              placeholder="Search by link title"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          <View className="w-auto flex-none px-2">
            <TouchableOpacity
              className="flex items-center flex-row"
              onPress={() => setModalVisible(!isModalVisible)}
            >
              <FontAwesomeIcon icon={faFilter} color="#3b82f6" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tabContainer}>
          <TabButton
            title="Recently"
            selected={selectedTab === "all"}
            onPress={() => setSelectedTab("all")}
          />
          <TabButton
            title="Active"
            selected={selectedTab === "active"}
            onPress={() => setSelectedTab("active")}
          />
          <TabButton
            title="Inactive"
            selected={selectedTab === "inactive"}
            onPress={() => setSelectedTab("inactive")}
          />
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredLinks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View className="p-4">
              <Text>No {selectedTab} links available</Text>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        />
      )}

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

const TabButton = ({ title, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, selected && styles.selectedTab]}
    onPress={onPress}
  >
    <Text
      style={[styles.tabText, selected && styles.selectedText]}
      className={`${textBasic}`}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

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

export default HomePageAdmin;
