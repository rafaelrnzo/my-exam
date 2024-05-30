import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React from "react";
import BASE_API_URL from "../../constant/ip";
import { useNavigation } from "@react-navigation/native";
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";
import { textTitle } from "../../assets/style/basic";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SubsPage = () => {
  const navigation = useNavigation();
  const { data: subsData, error, isLoading } = useApi(`${BASE_API_URL}item`);
  const { logout } = useLogout();
  const { postData } = useApi();

  const handleSubmit = async (item_name, price, item_id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}pay`,
        {
          item_name: item_name,
          price: price,
          item_id: item_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === "success" && response.data.snap_token) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "PaymentScreen",
              params: {
                snap_token: response.data.snap_token,
                pay_token: response.data.pay_token,
              },
            },
          ],
        });
      } else {
        console.log("Failed to process payment. Please try again later.");
      }
    } catch (error) {
      console.log(error);
    }
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

  return (
    <SafeAreaView className="bg-slate-50 h-full w-full">
      <View className="flex flex-row justify-between p-4 mt-2 items-center border-b-[0.5px] border-slate-400 bg-white">
        <Text className={`${textTitle}`}>Subscription</Text>
        <TouchableOpacity onPress={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView className="px-4">
        {subsData.data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
          >
            <Text>{item.name}</Text>
            <Text>description: {item.description}</Text>
            <Text>{item.price}</Text>
            <Button
              onPress={() => handleSubmit(item.name, item.price, item.id)}
              title="buy"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubsPage;
