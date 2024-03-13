import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./pages/LoginPage";
import HomePageUser from "./pages/user/HomePageUser";
import HomePageAdmin from "./pages/admin/HomePageAdmin";
import UjianPageUser from "./pages/user/UjianPageUser";
import CreateLinkAdmin from "./pages/admin/action/CreateLinkAdmin";
import UpdateLinkAdmin from "./pages/admin/action/UpdateLinkAdmin";
import ProfilePageUser from "./pages/user/ProfilePageUser";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown:false }} />
        <Stack.Screen name="HomePageUser" component={HomePageUser} />
        <Stack.Screen name="UjianPageUser" component={UjianPageUser} />
        <Stack.Screen name="ProfilePageUser" component={ProfilePageUser} />
        <Stack.Screen name="HomePageAdmin" component={HomePageAdmin} />
        <Stack.Screen name="CreateLinkAdmin" component={CreateLinkAdmin} />
        <Stack.Screen name="UpdateLinkAdmin" component={UpdateLinkAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
