import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePageAdmin from "./HomePageAdmin";
import { SafeAreaView, Text } from "react-native";
import axios from "axios";
import BASE_API_URL from "../../constant/ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SubsPage from "./SubsPage";
import ListKelas from "./ListKelas";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faClipboard as faClipboardSolid,
  faLink as faLinkSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faClipboard, faLink } from "@fortawesome/free-regular-svg-icons";

const MainAdmin = () => {
  const Tab = createBottomTabNavigator();
  const [subsData, setsubsData] = useState([]);

  const getSubsData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}admin-sekolah`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setsubsData(response.data.data);
      console.log("ini subs dat", response.data.data);
    } catch (error) {
      console.log("ini subs data", subsData);
    }
  };

  useEffect(() => {
   getSubsData()
  }, []);

  return (
    <SafeAreaView className="h-full w-full">
      {subsData.length == 0 ? (
        <SubsPage />
      ) : (
         <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              paddingVertical: 8,
              height: 55,
            },
          }}
        >
          <Tab.Screen
            name="ListKelas"
            component={ListKelas}
            options={{
              headerShown: false,
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? "blue" : "black" }}>
                  Classroom
                </Text>
              ),
              tabBarIcon: ({ focused }) => (
                <FontAwesomeIcon
                  icon={focused ? faClipboardSolid : faClipboard}
                  color={focused ? "blue" : "black"}
                  size={20}
                />
              ),
            }}
          />
          <Tab.Screen
            name="HomePageAdmin"
            component={HomePageAdmin}
            options={{
              headerShown: false,
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? "blue" : "black" }}>Link</Text>
              ),
              tabBarIcon: ({ focused }) => (
                <FontAwesomeIcon
                  icon={focused ? faLinkSolid : faLinkSolid}
                  color={focused ? "blue" : "black"}
                  size={20}
                />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </SafeAreaView>
  );
};

export default MainAdmin;
