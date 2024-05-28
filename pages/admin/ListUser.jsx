import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../constant/ip";
import * as DocumentPicker from "expo-document-picker";
import { useApi } from "../../utils/useApi";
import { textBasic, textTitle } from "../../assets/style/basic";
import {
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BottomSheetModal from "./components/BottomSheetModal";

const ListUser = ({ navigation, route }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const { kelas_jurusan_id, sekolah } = route.params;
  const [url, setUrl] = useState(
    `${BASE_API_URL}admin-sekolah?kelas_jurusan_id=${kelas_jurusan_id}`
  );
  const { data, error, isLoading, postData, deleteData } = useApi(url);

  const deleteUser = async (id) => {
    try {
      deleteData(`${BASE_API_URL}admin-sekolah/${id}`);
      navigation.reset({
        index: 0,
        routes: [
          { name: "ListUser", params: { kelas_jurusan_id: kelas_jurusan_id, sekolah:sekolah } },
        ],
      });    } catch (error) {
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
      await postData(`${BASE_API_URL}admin-sekolah/siswa-import`, formData);
      setFile(null);
    } catch (error) {
      console.error("Error importing siswa:", error);
    }
  };

  const users = data?.data.data || [];
  const links = data?.data.links || [];

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
    return <Text>Error loading data</Text>;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const toggleModal = (item) => {
    setSelectedItem(item);
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          justifyContent: "center",
        }}
      >
        <Button title="Pilih File Excel" onPress={pickFile} />
        {<Text>{file?.assets[0].name}</Text>}
        <Button title="import" onPress={handleImport} />
        <Button title="create" onPress={() => navigation.push("CreateUser", {sekolah:sekolah, kelas_jurusan_id: kelas_jurusan_id})} />
      </View>
      <ScrollView className="p-4 flex gap-3">
        {users.map((item) => (
          <View
            key={item.id}
            className="p-3 border border-slate-300 rounded-lg w-auto flex "
          >
            <View className="flex-row flex justify-between">
              <Text className={`${textTitle}`}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleModal(item)}>
                <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
              </TouchableOpacity>
            </View>
            <Text className={`${textBasic}`}>
              {item.kelas_jurusan.name ?? "admin"}
            </Text>
            {item.role == "admin sekolah" ? null : (
              <Text className={`${textBasic}`}>{item.token}</Text>
            )}

            <Text className={`${textBasic}`}>{item.role}</Text>
          </View>
        ))}
      </ScrollView>
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
              sekolah:sekolah
            })
          }
        />
      )}
      {links.length !== 0 ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {links.map((item, index) => (
            <Button
              key={index}
              onPress={() => handleLinkPress(item.url)}
              title={item.label}
            />
          ))}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ListUser;
