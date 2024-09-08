import { View, Text, StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import YoutubeIframe from 'react-native-youtube-iframe'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../App'

type videoProps = NativeStackScreenProps<StackParamList, 'VideoPreview'>

const VideoPreview = ({route}:videoProps) => {
  const {item} = route.params;
  // console.log(item)
  return (
    <View style={styles.videocontainer}>
      <YoutubeIframe
        videoId={item.videoID}
        height={200}
      />
      <Text style={styles.videoTitle}>{item.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    videocontainer: {
        width: Dimensions.get('window').width,
        padding: 4,
        backgroundColor: 'rgba(165, 190, 252, 0.197)',
    },
    videoTitle: {
        color: 'rgb(25,42,86)',
        fontFamily: 'Inter_24pt-Regular',
        fontSize: 18,
        fontWeight: 'bold',
        padding:5
      },
})

export default VideoPreview