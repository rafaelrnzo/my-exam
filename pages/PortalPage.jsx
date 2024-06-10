import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Thumbnail from '../assets/thumbnail.png'
import { buttonOutlined, buttonStyle, textBasic, textHero, textSubtitle, textTitle } from '../assets/style/basic'
import Icon from '../assets/images/icon.png'

export default function PortalPage({ navigation }) {
  return (
    <SafeAreaView className="h-full w-full flex justify-center bg-blue-500">
      <View className="w-full h-1/2">
        <Image source={Thumbnail} className="h-full w-full" />
      </View>
      <View className=" mx-64 p-12 rounded-2xl bg-slate-50 ">
        <View className="w-full pb-8 flex flex-row items-center justify-center gap-x-4">
          <View className="">
            <Image source={Icon} className="w-16 h-16" />
          </View>
          <View>
            <Text className={`${textHero}`}>ExamTen</Text>
          </View>
        </View>
        <View className="flex w-full justify-center items-center">
          <Text className={`${textTitle} text-2xl`}>Hello!</Text>
          <Text className={`${textBasic}`}>Welcome to online exam app</Text>
        </View>
        <View className="pt-12 flex gap-4 ">
          <View>
            <TouchableOpacity className={`${buttonOutlined} p-3`} onPress={() => navigation.push("LoginAsAdmin")}>
              <Text className={`${textBasic} text-blue-500 font-semibold text-lg`}>Login as Admin</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className={`${buttonStyle} p-3`} onPress={() => navigation.push("LoginPage")}>
              <Text className={`${textBasic} text-white font-semibold text-lg`}>Login as User</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="pt-4 flex">
          <View className="justify-center flex flex-row gap-1">
            <Text className={`${textBasic}`}>Don't have an account ?</Text>
            <TouchableOpacity onPress={() => navigation.push("RegisterPage")} className={`${textBasic} text-blue-500`}>
              <Text className={`${textBasic} text-blue-500`}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})