import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Card = ({link_name, link_title, link_status,kelas_jurusan, press}) => {
  return (
    <TouchableOpacity onPress={press} style={{ padding:10, borderColor:'black', borderWidth:1 }}>
      <Text>linkname: {link_name}</Text>
      <Text>{link_title}</Text>
      <Text>{link_status}</Text>
      <Text>{kelas_jurusan}</Text>
    </TouchableOpacity>
  )
}

export default Card