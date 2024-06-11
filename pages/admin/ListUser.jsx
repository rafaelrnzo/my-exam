import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import BASE_API_URL from "../../constant/ip";
import * as DocumentPicker from "expo-document-picker";
import { useApi } from "../../utils/useApi";
import { textBasic, textTitle } from "../../assets/style/basic";
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faEllipsisVertical,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BottomSheetModal from "./components/BottomSheetModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLogout } from "../../utils/useLogout";

const ListUser = ({ navigation, route }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { kelas_jurusan_id, sekolah, kelas_jurusan } = route.params;
  const [url, setUrl] = useState(
    `${BASE_API_URL}admin-sekolah?kelas_jurusan_id=${kelas_jurusan_id}`
  );
  const { data, error, isLoading, deleteData, mutate } = useApi(url);
  const { logout } = useLogout();
  const users = data?.data?.data || [];
  const links = data?.data?.links || [];
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    mutate().then(() => setRefreshing(false));
  }, []);

  const deleteUser = async (id) => {
    try {
      deleteData(`${BASE_API_URL}admin-sekolah/${id}`);
      mutate(url);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (result.canceled == false) {
        setFile(result);
        console.log(result.assets[0].name, file);
      } else {
        setFile(null);
      }
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };

  const handleImport = async () => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.assets[0].uri,
        type: "file/xlsx",
        name: file.assets[0].name,
      });

      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        `${BASE_API_URL}admin-sekolah/siswa-import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response: ", response.data);
      mutate(url);
      setFile(null);
    } catch (error) {
      console.error("Error importing siswa:", error.message);
      console.error("Error details:", error.config, error.response?.data);
    }
  };

  const handleLinkPress = (newUrl) => {
    if (newUrl === null) {
      setUrl(
        `${BASE_API_URL}admin-sekolah?kelas_jurusan_id=${kelas_jurusan_id}`
      );
    } else {
      setUrl(newUrl);
    }
    console.log(newUrl);
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Button title="Logout" onPress={logout} />

      </View>
    );
  }

  const toggleModal = (item) => {
    setSelectedItem(item);
    setModalVisible(!isModalVisible);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="bg-slate-50 h-full w-full">
      <View className="flex flex-col p-4 gap-2 mt-2 items-center border-b-[0.5px] border-slate-300 bg-white">
        <View className="flex-row flex w-full items-center">
          <View>
            <TouchableOpacity onPress={() => navigation.pop()} className="pr-2 p-2">
              <FontAwesomeIcon icon={faArrowLeft} color="black" />
            </TouchableOpacity>
          </View>
          <View>
            <Text className={`${textTitle}`}>{kelas_jurusan}</Text>
          </View>
        </View>
        <View className="flex flex-row items-center border border-slate-300 px-5 p-2.5 rounded-lg mx-4 my-2">
          <TextInput
            placeholder="Search by name"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            className="flex-grow"
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          justifyContent: "center",
          paddingTop: 15,
        }}
      >
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded"
          onPress={pickFile}
        >
          <Text className="text-white font-bold">Pilih File Excel</Text>
        </TouchableOpacity>
        {<Text>{file?.assets[0].name}</Text>}
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded"
          onPress={handleImport}
        >
          <Text className="text-white font-bold">Import</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className="p-4 flex gap-3"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredUsers.map((item) => (
          <View
            key={item.id}
            className="bg-white p-4 border border-slate-300 rounded-lg w-auto flex shadow-md mb-3"
          >
            <View className="flex flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <TouchableOpacity onPress={() => toggleModal(item)}>
                <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-500 mb-1">
              {item.kelas_jurusan}
            </Text>
            {item.role !== "admin sekolah" && (
              <Text className="text-sm text-gray-500 mb-2">{item.token}</Text>
            )}
            <View>
              <View className="border border-blue-500 rounded-full px-2 py-1">
                <Text className="text-blue-500 font-medium text-center">{item.role}</Text>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-4 right-4 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
        onPress={() =>
          navigation.push("CreateUser", {
            sekolah,
            kelas_jurusan_id,
            kelas_jurusan,
          })
        }
      >
        <FontAwesomeIcon icon={faPlus} color="white" />
      </TouchableOpacity>
      {selectedItem && (
        <BottomSheetModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onDelete={() => deleteUser(selectedItem.id)}
          onEdit={() =>
            navigation.push("UpdateUser", {
              id: selectedItem.id,
              name: selectedItem.name,
              kelas_jurusan: selectedItem.kelas_jurusan.name,
              token: selectedItem.token,
              role: selectedItem.role,
              kelas_jurusan_id: kelas_jurusan_id,
              sekolah: sekolah,
            })
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ListUser;
