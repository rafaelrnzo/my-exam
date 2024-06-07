import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePageAdmin from "./HomePageAdmin";
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import BASE_API_URL from "../../constant/ip";
import SubsPage from "./SubsPage";
import ListKelas from "./ListKelas";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faClipboard as faClipboardSolid,
  faLink as faLinkSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const MainAdmin = () => {
  const Tab = createBottomTabNavigator();
  const [subsData, setsubsData] = useState('none' || [])

  const getSubsData = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${BASE_API_URL}admin-sekolah`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    setsubsData(response.data)
  };

  useEffect(() => {
    getSubsData()
  }, [])
  
  return (
    <SafeAreaView className="h-full w-full">
      {subsData.token === "none" ? (
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
