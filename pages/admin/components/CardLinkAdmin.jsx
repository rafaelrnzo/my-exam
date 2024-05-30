import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { textSubtitle } from '../../../assets/style/basic'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faCalendar, faLink } from "@fortawesome/free-regular-svg-icons";
// import { textHero, textTitle } from '../assets/style/basic'

const Card = ({ time, link_title, link_status, press, status_progress, kelas_jurusan, onLongPress }) => {
  return (
    <TouchableOpacity onLongPress={onLongPress} onPress={press} className="p-3 border-slate-300 border rounded-lg mt-3 w-full">
      <View className="flex  justify-between  max-w-full">
        <View className="flex pb-3">

          <Text className="text-xl font-medium">{link_title}</Text>
          <Text className={`${textSubtitle}`}>{kelas_jurusan}</Text>
        </View>
        <View className="flex flex-row justify-between items-center w-full">
          <View className="flex flex-row gap-x-2">
            <FontAwesomeIcon icon={faCalendar} color="#3b82f6" size={18}/>
            <Text>{time}</Text>
          </View>
          <Text className={`text-base font-medium ${link_status === "active" ? " text-green-500" : "text-yellow-500"}`}>{link_status}</Text>
        </View>
      </View>
      {status_progress ? <Text>Status pengerjaan: {status_progress}</Text> : null}
    </TouchableOpacity>
  )
}

export default Card