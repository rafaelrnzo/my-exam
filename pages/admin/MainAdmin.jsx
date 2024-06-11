import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, SafeAreaView, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faClipboard as faClipboardSolid,
  faLink as faLinkSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import BASE_API_URL from '../../constant/ip';
import { useLogout } from '../../utils/useLogout';
import SubsPage from './SubsPage';
import ListKelas from './ListKelas';
import HomePageAdmin from './HomePageAdmin';

const MainAdmin = memo(() => {
  const Tab = createBottomTabNavigator();
  const [subsData, setSubsData] = useState(null);
  const { logout } = useLogout();

  const getSubsData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}admin-sekolah`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubsData(response.data);
    } catch (error) {
      console.error("Error fetching subs data:", error);
    }
  }, []);

  useEffect(() => {
    getSubsData();
  }, [getSubsData]);

  if (!subsData || subsData.length === 0 || subsData === 'none') {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  if (subsData.token === "none") {
    return <SubsPage />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: 65 },
        }}
      >
        <Tab.Screen
          name="ListKelas"
          component={ListKelas}
          options={{
            headerShown: false,
            tabBarLabel: () => null,
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
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon
                icon={faLinkSolid}
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
});

export default MainAdmin;
