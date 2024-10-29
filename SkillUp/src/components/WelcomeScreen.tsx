import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert, TextInput, SafeAreaView, Image, Dimensions } from 'react-native'
import React = require('react')
import { useCallback } from 'react'
import YoutubeIframe from 'react-native-youtube-iframe'
import { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList, TabParamList } from '../App'
import { firebase_auth } from '../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

type TabProps = NativeStackScreenProps<TabParamList, 'StackNavigation'>
type StackProps = NativeStackScreenProps<StackParamList, 'WelcomeScreen'>

const WelcomeScreen = ({ navigation }: StackProps) => {

  interface videometadata {
    videoID: string,
    title: string;
  }

  useEffect(() => {
    firebase_auth.onAuthStateChanged((user) => {
      if (user === null) {
        navigation.getParent<TabProps['navigation']>().navigate('Authentication');
      }
      // console.log(user);
    })
  }, [])
  useEffect(() => {
    fetchdata();
  }, [])


  const [inpwidth, setinpwidth] = useState(1)
  const [searchinp, setsearchinp] = useState('')
  const [metadata, setmetadata] = useState<videometadata[]>([])
  const [loader, setloader] = useState(true)
  const [userData, setuserData] = useState<any>([])
  const [topics, settopics] = useState<string[]>([])
  const [newUser, setnewUser] = useState(false)

  // const topics = ['UmnCZ7-9yDY', 'GwIo3gDZCVQ', 'A74TOX803D0', 'xk4_1vDrzzo', 'ntLJmHOJ0ME', 'Pj0neYUp9Tc', 'dz458ZkBMak', 'eIrMbAQSU34', 'gJ9DYC-jswo', 't8pPdKYpowI']
  const Logo = require('../assets/Logo.png')

  const fetchdata = async () => {
    try{
      const RNFS = require('react-native-fs');
      const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
      const file = await RNFS.readFile(path, 'utf8');
      const user_preferences = JSON.parse(file);
      setuserData(user_preferences);
      console.log(user_preferences);
      settopics(Object.keys(user_preferences["Topics"]));
    }
    catch{
      const RNFS = require('react-native-fs');
      firebase_auth.onAuthStateChanged( async (user)=>{
        const docRef = collection(db, "users",`${user?.uid}/UserPreferences`);
        const docSnap = await getDocs(docRef);
        setuserData(JSON.parse(JSON.stringify(docSnap.docs[0].data())));
        const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
        RNFS.writeFile(path, JSON.stringify(docSnap.docs[0].data()), 'utf8')
      })
    }
  }

  const search = async (query:string) => {
    setmetadata([]);
    setloader(true);
    // setheadertitle('Search results')
    try {
      const searchresult = await fetch('https://e4c5-2409-40c2-600e-ec5e-16d-4f32-1805-b05b.ngrok-free.app/customsearch',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "q": query==='N'?searchinp:query })
        }
      )
      let result = await searchresult.json()
      if (result['error']) {
        Alert.alert(result.error)
      }
      let data = []
      for (let i = 0; i < result.length; i++) {
        result[i]['videoID'] = result[i]['videoID'].split('=')[1];
        data.push(result[i]);
      }
      setmetadata(data);
      // await new Promise(r => setTimeout(r, 1000));
      setloader(false)
    }
    catch (error) {
      console.log(error)
      Alert.alert('Something went wrong !');
    }
  }

  const handleTopic = (item: string) => {
    setmetadata([]);
    setloader(true);
    // setmetadata([]);
    if (userData["Topics"][item].length != 0) {
      setloader(false);
      setmetadata(prevMetadata => [...prevMetadata, userData["Topics"][item]]);
    }
    else {
      // console.log("searched", searchinp);
      search(item);
    }
  }

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('rgb(25,42,86)');
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  return (
    <SafeAreaView style={styles.homecontainer}>
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
            onSubmitEditing={()=>{search('N')}}
          />
          <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>{search('N')}}>
            <Image style={styles.searchImg} source={require('../assets/search.png')}/>
          </TouchableOpacity>
        </View>

        {userData.length!=0&&<Text style={styles.headertxt}>Welcome, {userData["UserDetails"]["name"]}</Text>}
        <Image style={[{width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 3.5}]} source={Logo} />

        {topics.length != 0 && <View style={styles.videoTopics}>
          <FlatList
            contentContainerStyle={{ gap: 5 }}
            horizontal={true}
            data={topics}
            renderItem={({ item }) =>
              <TouchableOpacity style={styles.topicBar} onPress={() => { handleTopic(item) }}>
                <Text style={{ fontFamily: 'Inter_24pt-Regular', color: '#FBFCF8' }}>{item}</Text>
              </TouchableOpacity>
            }
          >
          </FlatList>
        </View>}
      </View>
      <View style={styles.rec_videos}>
        {loader && <View style={{ flex: 1, alignItems: 'center', width: '100%', height: 'auto' }}>
          <Text style={{ color: 'red' }}>Loading....</Text>
        </View>}
        {!loader && <TouchableOpacity
          style={styles.expandbtn}
          onPress={() => { navigation.getParent<TabProps['navigation']>().navigate('VideoList', { metadata }) }}
        >
          <Text style={{ fontFamily: 'Inter_24pt-Regular', fontSize: 16, color: 'rgb(25,42,86)' }}>Expand</Text>
          <Image style={styles.btnImg} source={require('../assets/expand.png')}/>
        </TouchableOpacity>}

        {!loader && <FlatList contentContainerStyle={{ alignItems: 'center', gap: 15 }} style={[styles.list_videos]}
          data={metadata}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.videocontainer} onPress={() => { navigation.navigate('VideoPreview', { item }) }}>
              <YoutubeIframe
                height={180}
                videoId={item.videoID}
                play={false}
              />
              <Text style={styles.videoTitle}>{item.title}</Text>
            </TouchableOpacity>
          }
          keyExtractor={item => item.title}
        >
        </FlatList>}
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  searchImg:{
    position:'absolute',
    right: 10,
    height: 20,
    width: 20,
  },
  btnImg:{
    height: 16,
    width: 16,
  },
  topicBar: {
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FBFCF8'
  },
  videoTopics: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    paddingHorizontal: 10
  },
  expandbtn: {
    position: 'absolute',
    right: 30,
    top: 5,
    borderRadius: 8,
    padding: 5,
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
    width: 'auto',
    height: 'auto',
    flexDirection:'row',
    gap:5,
    alignItems:'center'
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
    marginTop:8,
    gap:10
  },
  headertxt: {
    color: '#FBFCF8',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 22,
    fontWeight: '900'
  },
  rec_videos: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: '0%',
    width: '100%',
    height: '64%',
    // backgroundColor:'rgb(25,42,86)',
    backgroundColor: '#FBFCF8',
    elevation: 3
    // shadowOffset:{width:2,height:10}
  },
  list_videos: {
    // borderTopRightRadius:40,
    // borderTopLeftRadius:40,
    width: '100%',
    height: '100%',
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