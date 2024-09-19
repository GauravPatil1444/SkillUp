import { View, Text,StyleSheet, StatusBar } from 'react-native'
import React,{useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native';

const Courses = () => {

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#FBFCF8');
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:'red'}}>Welcome to Courses Tab</Text>
    </View>
  )
}

export default Courses

const Styles = StyleSheet.create({

})