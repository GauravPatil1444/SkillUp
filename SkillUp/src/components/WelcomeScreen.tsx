import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert, TextInput, SafeAreaView } from 'react-native'
import React, { useRef } from 'react'
import YoutubeIframe from 'react-native-youtube-iframe'
import { useState, useEffect} from 'react'
import Video from 'react-native-video'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../App'

type HomeProps = NativeStackScreenProps<StackParamList, 'WelcomeScreen'>

const WelcomeScreen = ({ navigation }: HomeProps) => {

  interface videometadata {
    videoID:string,
    title:string
  }

  const [inpwidth, setinpwidth] = useState(1)
  const [searchinp, setsearchinp] = useState('')
  const [metadata, setmetadata] = useState<videometadata[]>([])
  const [loader, setloader] = useState(true)
  const [headertitle, setheadertitle] = useState('Recommended')

  const topics = ['UmnCZ7-9yDY', 'GwIo3gDZCVQ', 'A74TOX803D0', 'xk4_1vDrzzo', 'ntLJmHOJ0ME', 'Pj0neYUp9Tc', 'dz458ZkBMak', 'eIrMbAQSU34', 'gJ9DYC-jswo', 't8pPdKYpowI']
  const Logo = require('../assets/SkillUp_logo.mp4')

  const fetchdata = () => {
    return fetch('https://c26d-2401-4900-1b13-ddbf-f800-f414-6493-644b.ngrok-free.app/')
      .then(response => response.json())
      .then(res => { return console.log(res) })
      .catch(error => console.log(error))
  }

  const search = async ()=>{
    setloader(true);
    setmetadata([])
    setheadertitle('Search results')
    try {
      const searchresult = await fetch('https://c26d-2401-4900-1b13-ddbf-f800-f414-6493-644b.ngrok-free.app/customsearch',
        {
          method:'post',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          body:JSON.stringify({"q":searchinp})
        }
      )
      let result = await searchresult.json()
      if(result['error']){
        Alert.alert(result.error)
      }
      
      for (let i = 0; i < result.length; i++) {
        result[i]['videoID'] = result[i]['videoID'].split('=')[1];
        setmetadata(prevMetadata => [...prevMetadata, result[i]]);
      }
      setloader(false)
    }
    catch(error){
      console.log(error)
      Alert.alert('Something went wrong !');
    }
  }

  useEffect(() => {
    fetchdata()
  }, [])

  return (
    <SafeAreaView style={styles.homecontainer}>
      <StatusBar
        backgroundColor={'rgb(25,42,86)'}
        barStyle={'light-content'}
      />
      <View style={styles.header}>
        <View style={[styles.inpfield, { borderWidth: inpwidth }]}>
          {/* <View><Text>SkillUp</Text></View> */}
          <TextInput
            autoCorrect={true}
            cursorColor={'#FBFCF8'}
            inputMode='search'
            enterKeyHint='search'
            returnKeyType='search'
            style={styles.input}
            placeholder='Search a Topic'
            onEndEditing={() => { setinpwidth(1) }}
            onFocus={() => { setinpwidth(2) }}
            value={searchinp}
            onChangeText={setsearchinp}
            onSubmitEditing={search}
          />
        </View>

        <Text style={styles.headertxt}>Welcome, Gaurav</Text>
        
        <Video
          source={Logo}
          repeat={true}
          paused={false}
          resizeMode='contain'
          style={styles.logo}
        />

        <View style={styles.videoTopics}>
          <FlatList
            contentContainerStyle={{gap:5}}
            horizontal={true}
            data={topics}
            renderItem={({item})=>
              <TouchableOpacity style={styles.topicBar}>
                <Text style={{fontFamily:'Inter_24pt-Regular',color:'#FBFCF8'}}>{item}</Text>
              </TouchableOpacity>
            }
          >
          </FlatList>   
        </View>
      </View>
      <View style={styles.rec_videos}>
        {loader&&<View style={{flex:1,alignItems:'center',width:'100%',height:'auto'}}>
          <Text style={{color:'red'}}>Loading....</Text>
        </View>}
        {!loader&&<TouchableOpacity
          style={styles.expandbtn}
          onPress={() => { navigation.navigate('VideoList',{metadata,headertitle})}}
        >
          <Text style={{ fontFamily: 'Inter_24pt-Regular', fontSize: 16, color: 'rgb(25,42,86)' }}>Expand</Text>
        </TouchableOpacity>}

        {!loader&&<FlatList contentContainerStyle={{ alignItems: 'center', gap:15 }} style={[styles.list_videos]}
          data={metadata}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.videocontainer} onPress={() => {navigation.navigate('VideoPreview',{item})}}>
              <YoutubeIframe
                height={180}
                videoId={item.videoID}
                play={false}
              />
              <Text style={styles.videoTitle}>{item.title}</Text>
            </TouchableOpacity>
          }
          keyExtractor={item => item.videoID}
        >
        </FlatList>}
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  topicBar:{
    backgroundColor:'rgba(165, 190, 252, 0.197)',
    padding:4,
    borderRadius:8,
    borderWidth:1,
    borderColor:'#FBFCF8'
  },
  videoTopics:{
    flexDirection:'row',
    position:'absolute',
    bottom:5,
    paddingHorizontal:10
  },
  expandbtn: {
    position: 'absolute',
    right: 30,
    top:5,
    borderRadius:8,
    padding:5,
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
    width: 'auto',
    height: 'auto',
  },
  logo: {
    width: 150,
    height: 100,
    // borderWidth:2,
    // borderColor:'#FBFCF8'
  },
  inpfield: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    borderRadius: 8,
    borderColor: '#FBFCF8'
  },
  input: {
    flex: 1,
    width: 'auto',
    fontSize: 15,
    paddingVertical: 4
  },
  homecontainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(25,42,86)',
    width: '100%',
    fontFamily: 'Inter_24pt-Regular'
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgb(25,42,86)',
    width: '100%',
    height: '35%',
  },
  headertxt: {
    color: '#FBFCF8',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 30,
    fontWeight: '900'
  },
  rec_videos: {
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: '0%',
    width: '100%',
    height: '65%',
    // backgroundColor:'rgb(25,42,86)',
    backgroundColor: '#FBFCF8',
    elevation: 3
    // shadowOffset:{width:2,height:10}
  },
  list_videos: {
    borderRadius: 20,
    width: '100%',
    height: 'auto',
    backgroundColor: '#FBFCF8',
  },
  videocontainer: {
    width: 300,
    padding: 4,
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
  },
  videoTitle: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 18,
    fontWeight: 'bold'
  },

})
export default WelcomeScreen