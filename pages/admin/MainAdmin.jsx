import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePageAdmin from "./HomePageAdmin";
import { ActivityIndicator, Button, SafeAreaView, Text, View } from "react-native";
import BASE_API_URL from "../../constant/ip";
import SubsPage from "./SubsPage";
import ListKelas from "./ListKelas";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faClipboard as faClipboardSolid,
  faLink as faLinkSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { useApi } from "../../utils/useApi";
import { useLogout } from "../../utils/useLogout";

const MainAdmin = () => {
  const Tab = createBottomTabNavigator();
  const {data, isLoading, error, mutate} = useApi(`${BASE_API_URL}admin-sekolah`)
  const {logout} = useLogout()

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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

  return (
    <SafeAreaView className="h-full w-full">
      {data === 'not paid' ? (
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
