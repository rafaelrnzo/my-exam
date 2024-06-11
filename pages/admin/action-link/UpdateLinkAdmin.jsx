import React, { useState } from 'react';
import { SafeAreaView, KeyboardAvoidingView, View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useApi } from '../../../utils/useApi';
import BASE_API_URL from '../../../constant/ip';
import { textBasic, textInputStyle, textTitle } from '../../../assets/style/basic';
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const UpdateLinkAdmin = ({ navigation, route }) => {
  const {
    link_title,
    link_status,
    kelas_jurusan,
    link_name,
    id,
    waktu_pengerjaan,
    waktu_pengerjaan_mulai,
    waktu_pengerjaan_selesai,
  } = route.params;

  const initialStartDate = new Date(waktu_pengerjaan_mulai.replace(" ", "T"));
  const initialEndDate = new Date(waktu_pengerjaan_selesai.replace(" ", "T"));

  const [fields, setFields] = useState({
    link_name,
    link_title,
    kelas_jurusan,
    link_status,
    waktu_pengerjaan: waktu_pengerjaan.toString(),
    waktu_pengerjaan_mulai: initialStartDate,
    waktu_pengerjaan_selesai: initialEndDate,
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFields((prevFields) => ({
        ...prevFields,
        waktu_pengerjaan_mulai: selectedDate,
      }));
      setShowStartTimePicker(true);
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const newStartDate = new Date(fields.waktu_pengerjaan_mulai);
      newStartDate.setHours(selectedTime.getHours());
      newStartDate.setMinutes(selectedTime.getMinutes());
      setFields((prevFields) => ({
        ...prevFields,
        waktu_pengerjaan_mulai: newStartDate,
      }));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFields((prevFields) => ({
        ...prevFields,
        waktu_pengerjaan_selesai: selectedDate,
      }));
      setShowEndTimePicker(true);
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const newEndDate = new Date(fields.waktu_pengerjaan_selesai);
      newEndDate.setHours(selectedTime.getHours());
      newEndDate.setMinutes(selectedTime.getMinutes());
      setFields((prevFields) => ({
        ...prevFields,
        waktu_pengerjaan_selesai: newEndDate,
      }));
    }
  };

  const {
    data: kelasJurusanData,
    error,
    isLoading,
  } = useApi(`${BASE_API_URL}get-kelas`);
  const responseData = kelasJurusanData?.data?.map((item) => item.name);
  const { putData } = useApi();

  const updateLink = async () => {
    try {
      const formattedFields = {
        ...fields,
        waktu_pengerjaan_mulai: fields.waktu_pengerjaan_mulai.toISOString(),
        waktu_pengerjaan_selesai: fields.waktu_pengerjaan_selesai.toISOString(),
      };
      await putData({
        url: `${BASE_API_URL}links/${id}`,
        updatedData: formattedFields
      });
      setFields({
        link_name: "",
        link_title: "",
        kelas_jurusan: "",
        link_status: "",
        waktu_pengerjaan: "0",
        waktu_pengerjaan_mulai: "",
        waktu_pengerjaan_selesai: "",
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "MainAdmin" }],
      });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
      console.log(error.response.data);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View className="flex flex-row p-4 justify-between gap-2 mt-2 items-center border-b-[0.5px] border-slate-400 bg-white">
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={() => navigation.pop()} className="px-3 h-auto">
              <FontAwesomeIcon icon={faArrowLeft} color="black" />
            </TouchableOpacity>
            <Text className={`${textTitle}`}>Update Link</Text>
          </View>
          <TouchableOpacity onPress={updateLink} className="bg-blue-500 p-2 px-6 rounded-lg">
            <Text className="text-white">Update</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ paddingTop: 10 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex gap-2 px-4">
            <View className="flex gap-y-2">
              <Text className={`${textBasic}`}>Link URL</Text>
              <TextInput
                placeholder="Link URL"
                value={fields.link_name}
                onChangeText={(text) =>
                  setFields({ ...fields, link_name: text })
                }
                className={`${textInputStyle}`}
              />
            </View>
            <View className="flex gap-y-2">
              <Text className={`${textBasic}`}>Link Title</Text>
              <TextInput
                placeholder="Link Title"
                value={fields.link_title}
                onChangeText={(text) =>
                  setFields({ ...fields, link_title: text })
                }
                className={`${textInputStyle}`}
              />
            </View>
            <View className="flex gap-y-2">
              <Text className={`${textBasic}`}>Link Status</Text>
              <SelectDropdown
                data={["active", "inactive"]}
                defaultButtonText="select an option"
                defaultValue={fields.link_status}
                onSelect={(selectedStatus) =>
                  setFields({ ...fields, link_status: selectedStatus })
                }
                renderButton={(selectedStatus, isOpened) => (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedStatus || "select an option"}
                    </Text>
                    <Icon
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      style={styles.dropdownButtonArrowStyle}
                    />
                  </View>
                )}
                renderItem={(item, index, isSelected) => (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#fff" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            </View>
            <View className="flex-row flex-wrap">
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View className="pr-2 flex-auto">
                  <Text className={`${textBasic} mb-2`}>Kelas Jurusan</Text>
                  <SelectDropdown
                    data={responseData}
                    defaultButtonText="select an option"
                    defaultValue={fields.kelas_jurusan}
                    onSelect={(selectedKelas, index) =>
                      setFields({ ...fields, kelas_jurusan: selectedKelas })
                    }
                    renderButton={(selectedKelas, isOpened) => (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {selectedKelas || "select an option"}
                        </Text>
                        <Icon
                          name={isOpened ? "chevron-up" : "chevron-down"}
                          style={styles.dropdownButtonArrowStyle}
                        />
                      </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                      <View
                        style={{
                          ...styles.dropdownItemStyle,
                          ...(isSelected && { backgroundColor: "#fff" }),
                        }}
                      >
                        <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                      </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                  />
                </View>
              )}

              <View className="gap-y-2 flex-auto">
                <Text className={`${textBasic}`}>Waktu Pengerjaan</Text>
                <TextInput
                  placeholder="Waktu"
                  value={fields.waktu_pengerjaan.toString()}
                  onChangeText={(text) =>
                    setFields({ ...fields, waktu_pengerjaan: text })
                  }
                  className={`${textInputStyle}`}
                />
              </View>
            </View>
            <View className="flex flex-row gap-x-2">
              <View className="flex gap-y-2 flex-1">
                <Text className={`${textBasic}`}>Waktu Mulai</Text>
                <TouchableOpacity
                  onPress={() => setShowStartDatePicker(true)}
                  style={styles.datePickerButton}
                >
                  <Text>
                    {fields.waktu_pengerjaan_mulai instanceof Date
                      ? `${fields.waktu_pengerjaan_mulai.toLocaleDateString()} ${fields.waktu_pengerjaan_mulai.toLocaleTimeString()}`
                      : ""}
                  </Text>
                </TouchableOpacity> 
                {showStartDatePicker && (
                  <DateTimePicker
                    value={fields.waktu_pengerjaan_mulai || new Date()}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}
                {showStartTimePicker && (
                  <DateTimePicker
                    value={fields.waktu_pengerjaan_mulai || new Date()}
                    mode="time"
                    display="default"
                    onChange={onStartTimeChange}
                  />
                )}
              </View>
              <View className="flex gap-y-2 flex-1">
                <Text className={`${textBasic}`}>Waktu Selesai</Text>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  style={styles.datePickerButton}
                >
                  <Text>
                    {fields.waktu_pengerjaan_selesai instanceof Date
                      ? `${fields.waktu_pengerjaan_selesai.toLocaleDateString()} ${fields.waktu_pengerjaan_selesai.toLocaleTimeString()}`
                      : ""}
                  </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={fields.waktu_pengerjaan_selesai || new Date()}
                    mode="date"
                    display="default"
                    onChange={onEndDateChange}
                  />
                )}
                {showEndTimePicker && (
                  <DateTimePicker
                    value={fields.waktu_pengerjaan_selesai || new Date()}
                    mode="time"
                    display="default"
                    onChange={onEndTimeChange}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  dropdownButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: '#000',
  },
  dropdownButtonArrowStyle: {
    fontSize: 18,
    color: '#000',
  },
  dropdownItemStyle: {
    padding: 10,
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
    color: '#000',
  },
  dropdownMenuStyle: {
    borderRadius: 5,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textBasic: {
    fontSize: 16,
    color: '#000',
  },
  textInputStyle: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
};

export default UpdateLinkAdmin;

