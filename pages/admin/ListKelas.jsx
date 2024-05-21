import {
  View,
  Text,
  ToastAndroid,
  Button,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_API_URL from "../../constant/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { textTitle } from "../../assets/style/basic";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus, faEllipsisVertical, faDesktop } from '@fortawesome/free-solid-svg-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from "./components/BottomSheetModal";

const ListKelas = ({ navigation }) => {
  const [kelasJurusan, setKelasJurusan] = useState([]);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleModal = (item) => {
    setSelectedItem(item);
    setModalVisible(!isModalVisible);
  };

  const fetchKelasJurusan = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${BASE_API_URL}admin-sekolah/kelas-jurusan`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data);
      setKelasJurusan(response.data.data);
    } catch (error) {
      console.error("Failed to fetch kelas jurusan:", error);
    }
  };

  const deleteKelas = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${BASE_API_URL}delete-kelas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.replace("MainAdmin");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    fetchKelasJurusan();
  }, []);
  return (
    <SafeAreaView className="pt-6 bg-slate-50 h-full w-full">
      <View className="flex justify-center items-center py-4 border-b-[0.5px] border-slate-400 bg-white">
        <Text className={`${textTitle}`}>Classroom</Text>
        {/* <Button
          title="+kelas"
          onPress={() => navigation.navigate("CreateKelas")}
        /> */}
      </View>
      <ScrollView className="p-4 flex gap-3">
        {kelasJurusan.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="p-3 border border-slate-300 rounded-lg w-auto flex "
            onPress={() =>
              navigation.push("ListUser", {
                kelas_jurusan_id: item.id,
                kelas_jurusan: item.name,
              })
            }
          >
            <View className="flex-row flex justify-between">
              <Text className={`${textTitle}`}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleModal(item)} >
                <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
              </TouchableOpacity>
              {/* <BottomSheetModal isVisible={isModalVisible} onClose={toggleModal} text={item.name} /> */}
            </View>
            <View className="pt-5">
              <View className="flex justify-between flex-row items-center">
                <Text>as</Text>
                <TouchableOpacity onPress={() =>
                  navigation.push("MonitoringPage", {
                    kelas_jurusan_id: item.id,
                    kelas_jurusan: item.name,
                  })
                }>
                  <View className="flex flex-row  bg-blue-500 items-center p-2 px-3 rounded-md">
                    <FontAwesomeIcon icon={faDesktop} color="white" />
                    <Text className="text-base font-medium  text-white pl-2">Monitoring</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedItem && (
        <BottomSheetModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onDelete={() => deleteKelas(selectedItem.id)}
          onEdit={() => navigation.push("UpdateKelas", {
            name_kelas: selectedItem.name,
            id: selectedItem.id,
          })}
        />
      )}
      <TouchableOpacity
        className="absolute bottom-4 right-4 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate("CreateKelas")}

      >
        <FontAwesomeIcon icon={faPlus} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ListKelas;
