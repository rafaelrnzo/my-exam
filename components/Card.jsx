import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Card = ({link_name, link_title, link_status,kelas_jurusan, press, status_progress}) => {
  return (
    <TouchableOpacity onPress={press} style={{ padding:10, borderColor:'black', borderWidth:1 }}>
      <Text>{link_title}</Text>
      <Text>{link_status}</Text>
      {status_progress ? <Text>Status pengerjaan: {status_progress}</Text> : null}
      <Text>{kelas_jurusan}</Text>
    </TouchableOpacity>
  )
}

export default Card