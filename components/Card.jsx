import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Card = ({link_title, link_status, press, status_progress}) => {
  return (
    <TouchableOpacity onPress={press} style={{ padding:10, borderColor:'black', borderWidth:1 }}>
      <Text>{link_title}</Text>
      <Text>{link_status}</Text>
      {status_progress ? <Text>Status pengerjaan: {status_progress}</Text> : null}
    </TouchableOpacity>
  )
}

export default Card