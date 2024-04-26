import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePageAdmin from "./HomePageAdmin";
import MonitoringPage from "./MonitoringPage";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native";

const MainAdmin = () => {
    const Tab = createBottomTabNavigator();
    return (
    <SafeAreaView style={{ flex:1 }}>
      <Tab.Navigator>
        <Tab.Screen
          name="HomePageAdmin"
          component={HomePageAdmin}
          options={{
            headerShown: false,
            tabBarLabel: "Home",
            tabBarIcon: ({}) => <AntDesign name="home" size={24} color="black" />,
          }}
        />
        <Tab.Screen
          name="MonitoringPage"
          component={MonitoringPage}
          options={{
            headerShown: false,
            tabBarLabel: "Monitoring",
            tabBarIcon: ({}) => (
              <MaterialIcons name="category" size={24} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
    );
  };
  
  export default MainAdmin;