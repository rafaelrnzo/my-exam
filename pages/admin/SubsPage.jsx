import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image
} from "react-native";
import React from "react";
import BASE_API_URL from "../../constant/ip";
import { useNavigation } from "@react-navigation/native";
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";
import { textBasic, textHero, textTitle } from "../../assets/style/basic";
import { faClose, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from '../../assets/images/icon.png'

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
    return (
      <View style={{ flex: 1 }}>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const formatRupiah = (price) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  return (
    <SafeAreaView className=" h-full w-full pt-4 flex justify-center bg-blue-500">
      {/* <View className="flex flex-row justify-between p-4 mt-2 items-center border-b-[0.5px] border-slate-400 bg-white">
        <Text className={VerifyPage}tTitle}`}>ExamTen</Text>
        <TouchableOpacity onPress={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} color="black" />
        </TouchableOpacity>
      </View> */} 
      <View className="mx-4 md:mx-32 bg-slate-50 p-4 lg:p-12 rounded-2xl flex justify-between ">
        <View className="w-full flex ">
          <View className="flex justify-end w-full items-end">
            <TouchableOpacity onPress={logout}>
              <FontAwesomeIcon icon={faClose} color="black" size={24}/>
            </TouchableOpacity>
          </View>
          <View className="w-full pb-8 flex flex-row items-center justify-center gap-x-4">
            <View className="">
              <Image source={Icon} className="w-16 h-16" />
            </View>
            <View>
              <Text className={`${textHero}`}>ExamTen</Text>
            </View>
          </View>
          <View className="w-full flex flex-col items-center justify-center gap-x-4">
            <Text className={`${textTitle} lg:text-2xl`}>Solution Exam Online</Text>
            <Text className={`${textBasic} lg:text-xl text-center`}>Security technology, to provide a fair and trustworthy exam environment for teachers and test takers.</Text>
          </View>
        </View>
        <View className="flex flex-row gap-x-4 pt-4 ">

          {subsData.data.map((item) => (
            <View
              key={item.id}
              className="flex flex-col p-3 border-slate-300 border rounded-lg mt-3 flex-1 "
            >
              <View className="pb-4">

                <Text className={`${textTitle}`}>{item.name}</Text>
                <Text className={`${textBasic}`}>
                  {item.description}
                </Text>
              </View>
              <Text className={`${textTitle}`}>{formatRupiah(item.price)}</Text>
              <TouchableOpacity
                className="bg-blue-500 py-2 px-4 rounded mt-4"
                onPress={() => handleSubmit(item.name, item.price, item.id)}
              >
                <Text className="text-white font-bold text-center">Buy</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

    </SafeAreaView>
  );
};

export default SubsPage;
