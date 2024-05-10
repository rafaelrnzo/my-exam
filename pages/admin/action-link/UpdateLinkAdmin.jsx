import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import BASE_API_URL from "../../../constant/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateLinkAdmin = ({ navigation, route }) => {
  const { link_title, link_status, kelas_jurusan, link_name, id } =
    route.params;
  const [fields, setFields] = useState({
    link_name: link_name,
    link_title: link_title,
    kelas_jurusan: kelas_jurusan,
    link_status: link_status,
  });

  const updateLink = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(`${BASE_API_URL}links/${id}`, fields, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      navigation.pop();
    } catch (error) {
      console.log(fields);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text>Link URL</Text>
      <TextInput
        placeholder="link"
        value={fields.link_name}
        onChangeText={(text) => setFields({ ...fields, link_name: text })}
      />
      <Text>Link Title</Text>
      <TextInput
        placeholder="title"
        value={fields.link_title}
        onChangeText={(text) => setFields({ ...fields, link_title: text })}
      />
      <Text>Kelas Jurusan</Text>
      <TextInput
        placeholder="kelas"
        value={fields.kelas_jurusan}
        onChangeText={(text) => setFields({ ...fields, kelas_jurusan: text })}
      />
      <Text>Link Status</Text>
      <SelectDropdown
        data={["active", "inactive"]}
        defaultValue={fields.link_status}
        onSelect={(selectedStatus, index) =>
          setFields({ ...fields, link_status: selectedStatus })
        }
        renderButton={(selectedStatus, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              {fields.link_status && (
                <Icon
                  name={fields.link_status.icon}
                  style={styles.dropdownButtonIconStyle}
                />
              )}
              <Text style={styles.dropdownButtonTxtStyle}>
                {fields.link_status}
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

      <Button title="update" onPress={updateLink} />
    </View>
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
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
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

export default UpdateLinkAdmin;
