import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePageAdmin from "./HomePageAdmin";
import { ActivityIndicator, Button, SafeAreaView, Text, View } from "react-native";
import BASE_API_URL from "../../constant/ip";
import SubsPage from "./SubsPage";
import ListKelas from "./ListKelas";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClipboard as faClipboardSolid, faLink as faLinkSolid } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const MainAdmin = () => {
  const Tab = createBottomTabNavigator();
  const [subsData, setSubsData] = useState('none' || null);

  const getSubsData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}admin-sekolah`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setSubsData(response.data);
    } catch (error) {
      console.error("Error fetching subs data:", error);
    }
  };

  useEffect(() => {
    getSubsData();
  }, []);

  if (subsData === null || subsData == []) {
    return <ActivityIndicator />;
  }

  if (subsData.token || subsData === "none") {
    return <SubsPage />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            // paddingVertical: 8,
            height: 65,
            // paddingBottom: 20, // Adjust the paddingBottom here
          },
        }}
      >
        <Tab.Screen
          name="ListKelas"
          component={ListKelas}
          options={{
            headerShown: false,
            tabBarLabel: () => null, // Hide the tab bar label
            
            // tabBarLabelStyle: { fontSize: 12, marginBottom: 2 },
            // tabBarLabel: ({ focused }) => (
            //   <Text style={{ color: focused ? "blue" : "black" }}>Classroom</Text>
            // ),
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon
                icon={focused ? faClipboardSolid : faClipboard}
                color={focused ? "blue" : "black"}
                size={20}
                style={{ marginBottom: 2 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="HomePageAdmin"
          component={HomePageAdmin}
          options={{
            headerShown: false,
            // tabBarLabelStyle: { fontSize: 12, marginBottom: 2 },
            // tabBarLabel: ({ focused }) => (
            //   <Text style={{ color: focused ? "blue" : "black" }}>Link</Text>
            // ),
            tabBarLabel: () => null, // Hide the tab bar label

            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon
                icon={focused ? faLinkSolid : faLinkSolid}
                color={focused ? "blue" : "black"}
                size={20}
                style={{ marginBottom: 2 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MainAdmin;
