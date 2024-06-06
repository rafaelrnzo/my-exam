import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import BASE_API_URL from "../constant/ip";
import { SafeAreaView } from "react-native-safe-area-context";
import { buttonStyle, textBasic, textHero, textInputStyle, textSubtitle, textTitle } from "../assets/style/basic";
import { useLogin } from "../utils/useLogin";

const LoginPage = ({ navigation }) => {
  const { fields, setFields, login } = useLogin();

  return (
    <SafeAreaView className="h-full w-full bg-slate-50 px-4 flex justify-start">
      <View className="pt-8 flex gap-4">
        <View>
          <Text className={`${textTitle}`}>Login User</Text>
        </View>
        <View className="gap-0 flex">
          <Text className={`${textHero} text-3xl`}>Welcome Back</Text>
          <Text className={`${textSubtitle}`}>Sign in to your account </Text>
        </View>
      </View>
      <View className="flex gap-2 pt-4">
        <View className="flex gap-y-2">
          <Text className={`${textBasic} `}>Name</Text>
          <TextInput
            className={`${textInputStyle}`}
            value={fields.name}
            onChangeText={(text) => setFields({ ...fields, name: text })}
            placeholder="input name"
          />
        </View>
        <View className="flex gap-y-2">

          <Text className={`${textBasic}`}>Password</Text>
          <TextInput
            className={`${textInputStyle}`}

            value={fields.password}
            onChangeText={(text) => setFields({ ...fields, password: text })}
            placeholder="password"
          />
        </View>
        <View className="flex gap-y-2">
          <Text className={`${textBasic}`}>Token</Text>
          <TextInput
            className={`${textInputStyle}`}
            onChangeText={(text) => setFields({ ...fields, token: text })}
            value={fields.token}
            placeholder="token"
          />
        </View>

        <View className="pt-2">
          <TouchableOpacity onPress={() => login(`${BASE_API_URL}login-siswa`, 'VerifyPage')} className={`${buttonStyle}`}>
            <Text className={`${textTitle} text-slate-50 text-lg`}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
