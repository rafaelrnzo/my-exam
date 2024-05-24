import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { textSubtitle } from '../../../assets/style/basic'
// import { textTitle } from '../../../assets/style/basic'
// import { textHero, textTitle } from '../assets/style/basic'

const Card = ({ link_title, link_status, press, status_progress, kelas_jurusan }) => {
  return (
    <TouchableOpacity onPress={press} className="p-3 border-slate-300 border rounded-lg mt-3 w-full">
      <Text className="text-xl font-medium">{link_title}</Text>
      <View className="flex flex-row justify-between items-center">
        <Text className={`${textSubtitle}`}>{kelas_jurusan}</Text>
        <Text>{link_status}</Text>
      </View>
      {status_progress ? <Text>Status pengerjaan: {status_progress}</Text> : null}
    </TouchableOpacity>
  )
}

export default Card