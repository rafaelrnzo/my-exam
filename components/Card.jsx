import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Card = ({link_name, link_title, link_status, press}) => {
  return (
    <TouchableOpacity onPress={press}>
      <Text>{link_name}</Text>
      <Text>{link_title}</Text>
      <Text>{link_status}</Text>
    </TouchableOpacity>
  )
}

export default Card