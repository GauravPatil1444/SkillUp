import { View, Text,StyleSheet, StatusBar } from 'react-native'
import React,{useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native';

const Settings = () => {

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#FBFCF8');
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:'red'}}>Welcome to Settings Tab</Text>
    </View>
  )
}

export default Settings

const Styles = StyleSheet.create({

})