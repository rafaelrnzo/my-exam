import {
  View,
  Text,
  TextInput,
  Button,
  ToastAndroid,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import BASE_API_URL from "../../../constant/ip";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  buttonStyle,
  textBasic,
  textInputStyle,
  textTitle,
} from "../../../assets/style/basic";
import { useApi } from "../../../utils/useApi";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const CreateLinkAdmin = ({ navigation }) => {
  const [fields, setFields] = useState({
    link_name: "",
    link_title: "",
    kelas_jurusan: "",
    link_status: "active",
    waktu_pengerjaan: 0,
    waktu_pengerjaan_mulai: new Date(),
    waktu_pengerjaan_selesai: new Date(),
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
    const newDate = new Date(fields.waktu_pengerjaan_mulai);
    newDate.setHours(currentTime.getHours());
    newDate.setMinutes(currentTime.getMinutes());
    setFields({ ...fields, waktu_pengerjaan_mulai: newDate });
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
    const newDate = new Date(fields.waktu_pengerjaan_selesai);
    newDate.setHours(currentTime.getHours());
    newDate.setMinutes(currentTime.getMinutes());
    setFields({ ...fields, waktu_pengerjaan_selesai: newDate });
  };

  const {
    data: kelasJurusan,
    error,
    isLoading,
  } = useApi(`${BASE_API_URL}get-kelas`);
  const { postData } = useApi();
  const responseData = kelasJurusan?.data?.map((item) => item.name);

  const createLink = async () => {
    try {
      const formattedFields = {
        ...fields,
        waktu_pengerjaan_mulai: fields.waktu_pengerjaan_mulai.toISOString(),
        waktu_pengerjaan_selesai: fields.waktu_pengerjaan_selesai.toISOString(),
      };
      await postData(`${BASE_API_URL}links/post`, formattedFields);
      setFields({
        link_name: "",
        link_title: "",
        kelas_jurusan: "",
        link_status: "",
        waktu_pengerjaan: 0,
        waktu_pengerjaan_mulai: new Date(),
        waktu_pengerjaan_selesai: new Date(),
      });
      console.log(fields.waktu_pengerjaan_mulai, fields.waktu_pengerjaan_selesai);
      navigation.reset({
        index: 0,
        routes: [{ name: "MainAdmin" }],
      });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
      console.log(error.response.data);
    }
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ paddingTop: 10 }}
      className="h-full w-full bg-slate-50 flex justify-start"
    >
      <View className="flex flex-row p-4 gap-2 mt-2 items-center border-b-[0.5px] border-slate-400 bg-white">
        <TouchableOpacity onPress={() => navigation.pop()}>
          <FontAwesomeIcon icon={faArrowLeft} color="black" />
        </TouchableOpacity>
        <Text className={`${textTitle}`}>Create Link</Text>
      </View>
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
        <View className="flex gap-y-2">
          <Text className={`${textBasic}`}>Link Status</Text>
          <SelectDropdown
            data={["active", "inactive"]}
            defaultValue={fields.link_status}
            onSelect={(selectedStatus) =>
              setFields({ ...fields, link_status: selectedStatus })
            }
            renderButton={(selectedStatus, isOpened) => (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedStatus}
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
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
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
                defaultValue={responseData[0]}
                onSelect={(selectedKelas, index) =>
                  setFields({ ...fields, kelas_jurusan: selectedKelas })
                }
                renderButton={(selectedKelas, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {selectedKelas}
                      </Text>
                      <Icon
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        style={styles.dropdownButtonArrowStyle}
                      />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && { backgroundColor: "#D2D9DF" }),
                      }}
                    >
                      <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                    </View>
                  );
                }}
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
        <View>
          <Text>Waktu pengerjaan mulai</Text>
          <Button
            onPress={() => setShowStartDatePicker(true)}
            title="Select Start Date and Time"
          />
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
          <Button
            onPress={() => setShowEndDatePicker(true)}
            title="Select End Date and Time"
          />
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
          <TouchableOpacity
            className={`${buttonStyle}`}
            onPress={createLink}
            disabled={fields.link_name.length === 0 ? true : false}
          >
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
