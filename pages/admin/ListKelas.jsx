import {
  View,
  Text,
  ToastAndroid,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  RefreshControl,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState, memo, useCallback } from "react";
import BASE_API_URL from "../../constant/ip";
import { textTitle } from "../../assets/style/basic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlus,
  faEllipsisVertical,
  faDesktop,
  faUser,
  faRightFromBracket,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import BottomSheetModal from "./components/BottomSheetModal";
import { useApi } from "../../utils/useApi";
import { useLogout } from "../../utils/useLogout";

const ListKelas = memo(({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data, error, isLoading, mutate } = useApi(`${BASE_API_URL}admin-sekolah/kelas-jurusan`);
  const kelasJurusan = data?.data || [];
  const { data: userLoggedin, error: userError, isLoading: userLoad } = useApi(`${BASE_API_URL}get-data-login`);
  const { deleteData } = useApi();
  const { logout } = useLogout();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    mutate().then(() => setRefreshing(false));
  }, [mutate]);

  const toggleModal = useCallback((item) => {
    setSelectedItem(item);
    setModalVisible(!isModalVisible);
  }, [isModalVisible]);

  const deleteKelas = useCallback(async (id) => {
    try {
      await deleteData(`${BASE_API_URL}delete-kelas/${id}`);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainAdmin' }],
      });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }, [navigation, deleteData]);

  if (error || userError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  const filteredKelasJurusan = kelasJurusan.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="p-3 border border-slate-300 rounded-lg w-auto flex mt-3"
      onPress={() => navigation.push('ListUser', {
        kelas_jurusan_id: item.id,
        kelas_jurusan: item.name,
        sekolah: userLoggedin.sekolah,
      })}
    >
      <View className="flex-row flex justify-between">
        <Text className={`${textTitle}`}>{item.name}</Text>
        <TouchableOpacity onPress={() => toggleModal(item)}>
          <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
        </TouchableOpacity>
      </View>
      <View className="pt-5">
        <View className="flex justify-between flex-row items-center">
          <View className="flex gap-x-2 flex-row items-center">
            <FontAwesomeIcon icon={faUser} color="#3b82f6" />
            <Text className="text-base font-semibold text-blue-500">
              {item.user_count}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.push('MonitoringPage', {
              kelas_jurusan_id: item.id,
              kelas_jurusan: item.name,
            })}
          >
            <View className="flex flex-row bg-blue-500 items-center p-2 px-3 rounded-md">
              <FontAwesomeIcon icon={faDesktop} color="white" />
              <Text className="text-base font-medium text-white pl-2">
                Monitoring
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-white h-full w-full">
    <View className="pt-8">
      <View className="flex flex-col p-4 pb-8 items-center border-b border-slate-300 bg-white">
        <View className="flex-row flex w-full justify-between pb-4 items-center">
          <Text className={`${textTitle}`}>Classroom</Text>
          <TouchableOpacity onPress={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} color="black" />
          </TouchableOpacity>
        </View>
        <View className="w-full border border-slate-300 px-4 p-2.5 rounded-lg flex flex-row items-center">
          <View className="px-2">
            <FontAwesomeIcon icon={faSearch} color="#cbd5e1" />
          </View>
          <TextInput
            placeholder="Search by name"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </View>
      {isLoading ||userLoad ?
        <ActivityIndicator size="large" color="#0000ff" />
       :  <FlatList
        data={filteredKelasJurusan}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="p-4">
            <Text>No classes available</Text>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      />}
     
    </View>
    {selectedItem && (
      <BottomSheetModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onDelete={() => deleteKelas(selectedItem.id)}
        onEdit={() => navigation.push('UpdateKelas', {
          name_kelas: selectedItem.name,
          id: selectedItem.id,
        })}
      />
    )}
    <TouchableOpacity
      className="absolute bottom-4 right-4 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
      onPress={() => navigation.navigate('CreateKelas')}
    >
      <FontAwesomeIcon icon={faPlus} color="white" />
    </TouchableOpacity>
  </SafeAreaView>
);
});

export default ListKelas;