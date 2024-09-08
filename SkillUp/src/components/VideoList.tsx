import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions, StatusBar } from 'react-native'
import YoutubeIframe from 'react-native-youtube-iframe'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../App'

type RecProps = NativeStackScreenProps<StackParamList, 'VideoList'>

// const videolist = ['UmnCZ7-9yDY', 'GwIo3gDZCVQ', 'A74TOX803D0', 'xk4_1vDrzzo', 'ntLJmHOJ0ME', 'Pj0neYUp9Tc', 'dz458ZkBMak', 'eIrMbAQSU34', 'gJ9DYC-jswo', 't8pPdKYpowI']

const Rec_videos = ({route,navigation}:RecProps) => {

  const {metadata} = route.params
  console.log(metadata);
  
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'#FBFCF8'}
        barStyle={'dark-content'}
      />
      <FlatList scrollEventThrottle={200} contentContainerStyle={{ alignItems: 'center' }} style={[styles.rec_videos]}
        data={metadata}
        renderItem={({ item }) =>
          <TouchableOpacity style={styles.videocontainer} onPress={() => { navigation.navigate('VideoPreview',{item}) }}>
            <YoutubeIframe
              height={200}
              videoId={item.videoID}
            />
            <Text style={styles.videoTitle}>{item.title}</Text>
          </TouchableOpacity>
        }
        keyExtractor={item => item.videoID}
      >
      </FlatList>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(25,42,86)',
    width: '100%',
    height:'auto'
  },
  rec_videos: {
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: '0%',
    width: '100%',
    height: Dimensions.get('window').height,
    // backgroundColor:'rgb(25,42,86)',
    backgroundColor: '#FBFCF8',
    elevation: 3,
    // shadowOffset:{width:2,height:10}
  },
  videocontainer: {
    width: Dimensions.get('window').width,
    padding: 4,
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
    marginTop: 15
    // borderRadius: 8
  },
  videoTitle: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    padding:5
  },
})
export default Rec_videos