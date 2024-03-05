import React from "react";
import { Text, TouchableOpacity } from "react-native";

export const Button = ({title, onPress})=>{
  return (
    <TouchableOpacity
      style={{
        width: 100,
        paddingVertical: 10, 
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "blue"
      }}
      onPress={onPress}
    >
      <Text
        style={{
            fontSize: 15, 
            color: "white"
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}