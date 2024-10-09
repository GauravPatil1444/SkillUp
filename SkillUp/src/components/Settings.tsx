import { View, Text,StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import React,{useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabParamList } from '../App'
import { firebase_auth } from '../../firebaseConfig'

type TabProps = NativeStackScreenProps<TabParamList, 'Settings'>

const Settings = ({navigation}:TabProps) => {

  const handleSignout = ()=>{
    firebase_auth.signOut();
    navigation.navigate('Authentication');
  }

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#FBFCF8');
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:'red'}}>Welcome to Settings Tab</Text>
      <TouchableOpacity style={styles.btns} onPress={()=>handleSignout()}>
          <Text style={styles.btntxt}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  btntxt: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontWeight:'bold'
},
  btns: {
    width: '60%',
    height: 'auto',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
    borderColor: 'rgb(25,42,86)',
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
},
})