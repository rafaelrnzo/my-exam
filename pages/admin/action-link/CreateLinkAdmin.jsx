import {
  View,
  Text,
  TextInput,
  Button,
  ToastAndroid,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_API_URL from "../../../constant/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  buttonStyle,
  textBasic,
  textInputStyle,
  textTitle,
} from "../../../assets/style/basic";

const CreateLinkAdmin = ({ navigation }) => {
  const [fields, setFields] = useState({
    link_name: "",
    link_title: "",
    kelas_jurusan: "",
    waktu_pengerjaan: 0,
    waktu_pengerjaan_mulai: "",
    waktu_pengerjaan_selesai: "",
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fields.waktu_pengerjaan_mulai;
    setShowStartDatePicker(false);
    setFields({ ...fields, waktu_pengerjaan_mulai: currentDate });
    setShowStartTimePicker(true);
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || fields.waktu_pengerjaan_mulai;
    setShowStartTimePicker(false);
    setFields({ ...fields, waktu_pengerjaan_mulai: currentTime });
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fields.waktu_pengerjaan_selesai;
    setShowEndDatePicker(false);
    setFields({ ...fields, waktu_pengerjaan_selesai: currentDate });
    setShowEndTimePicker(true);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || fields.waktu_pengerjaan_selesai;
    setShowEndTimePicker(false);
    setFields({ ...fields, waktu_pengerjaan_selesai: currentTime });
  };

  const [kelasJurusan, setkelasJurusan] = useState([]);

  const createLink = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(`${BASE_API_URL}links/post`, fields, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setFields({
        link_name: "",
        link_title: "",
        kelas_jurusan: "",
        waktu_pengerjaan: 0,
        waktu_pengerjaan_mulai: "",
        waktu_pengerjaan_selesai: "",
      });
      navigation.replace("MainAdmin");
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  const getKelasJurusan = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(`${BASE_API_URL}get-kelas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = response.data.data;
      setkelasJurusan(responseData.map((item) => item.name));
      console.log(kelasJurusan);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKelasJurusan();
  }, []);

  return (
    <SafeAreaView style={{ paddingTop: 10 }} className="h-full w-full bg-slate-50 flex justify-start">
      <View className="flex gap-2 pt-4 px-4">
        <View className="flex gap-y-2">
          <Text className={`${textBasic}`}>Link URL</Text>
          <TextInput
            placeholder="Link URL"
            value={fields.link_name}
            onChangeText={(text) => setFields({ ...fields, link_name: text })}
            className={`${textInputStyle}`}
          />
        </View>
        <View className="flex gap-y-2">
          <Text className={`${textBasic}`}>Link Title</Text>
          <TextInput
            placeholder="Link Title"
            value={fields.link_title}
            onChangeText={(text) => setFields({ ...fields, link_title: text })}
            className={`${textInputStyle}`}
          />
        </View>
        <View className="flex-row flex-wrap">
          <View className="pr-2 flex-auto">
            <Text className={`${textBasic} mb-2`}>Kelas Jurusan</Text>
            <SelectDropdown
              data={kelasJurusan}
              defaultValue={kelasJurusan[0]}
              onSelect={(selectedKelas) => setFields({ ...fields, kelas_jurusan: selectedKelas })}
              renderButton={(selectedKelas, isOpened) => (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>{selectedKelas}</Text>
                  <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                </View>
              )}
              renderItem={(item, index, isSelected) => (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                  }}
                >
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>
          <View className="gap-y-2 flex-auto">
            <Text className={`${textBasic}`}>Waktu Pengerjaan</Text>
            <TextInput
              placeholder="Waktu"
              value={fields.waktu_pengerjaan.toString()}
              onChangeText={(text) => setFields({ ...fields, waktu_pengerjaan: parseInt(text) })}
              className={`${textInputStyle}`}
            />
          </View>
        </View>
        <View>
          <Text>Waktu pengerjaan mulai</Text>
          <Button onPress={() => setShowStartDatePicker(true)} title="Select Start Date and Time" />
          {showStartDatePicker && (
            <DateTimePicker
              value={fields.waktu_pengerjaan_mulai}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}
          {showStartTimePicker && (
            <DateTimePicker
              value={fields.waktu_pengerjaan_mulai}
              mode="time"
              display="default"
              onChange={onStartTimeChange}
            />
          )}
          <Text>{fields.waktu_pengerjaan_mulai.toLocaleString()}</Text>

          <Text>Waktu pengerjaan selesai</Text>
          <Button onPress={() => setShowEndDatePicker(true)} title="Select End Date and Time" />
          {showEndDatePicker && (
            <DateTimePicker
              value={fields.waktu_pengerjaan_selesai}
              mode="date"
              display="default"
              onChange={onEndDateChange}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={fields.waktu_pengerjaan_selesai}
              mode="time"
              display="default"
              onChange={onEndTimeChange}
            />
          )}
          <Text>{fields.waktu_pengerjaan_selesai.toLocaleString()}</Text>
        </View>
        <View className="pt-4">
          <TouchableOpacity className={`${buttonStyle}`} onPress={createLink}>
            <Text className="font-semibold text-white text-lg">Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

export default CreateLinkAdmin;
