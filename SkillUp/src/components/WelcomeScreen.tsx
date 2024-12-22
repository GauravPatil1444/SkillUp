import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert, TextInput, SafeAreaView, Image, Dimensions, ActivityIndicator } from 'react-native'
import React = require('react')
import { useCallback } from 'react'
import YoutubeIframe from 'react-native-youtube-iframe'
import { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList, TabParamList } from '../App'
import { firebase_auth } from '../../firebaseConfig'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import EncryptedStorage4 from 'react-native-encrypted-storage'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'

type TabProps = NativeStackScreenProps<TabParamList, 'StackNavigation'>
type StackProps = NativeStackScreenProps<StackParamList, 'WelcomeScreen'>

const WelcomeScreen = ({ navigation }: StackProps) => {

  interface videometadata {
    videoID: string,
    title: string;
  }

  useEffect(() => {
    firebase_auth.onAuthStateChanged(async (user) => {
      let status = false;
      try {
        const res = await ReactNativeAsyncStorage.getItem("isLoggedIn")
        if (res === "true") {
          const uid: any = await EncryptedStorage4.getItem("uid")
          setuid(uid)
          status = true;
          // console.log("true",uid);
        }
      }
      catch {
      }
      if (user === null && status === false) {
        navigation.getParent<TabProps['navigation']>().navigate('Authentication');
      }
      if (status === false) {
        let id: any = firebase_auth.currentUser?.uid;
        setuid(id)
      }
      // console.log(user);
    })
  }, [])
  useEffect(() => {
    fetchdata();
    Recommendation();
  }, [])


  const [inpwidth, setinpwidth] = useState(1)
  const [searchinp, setsearchinp] = useState('')
  const [metadata, setmetadata] = useState<videometadata[]>([])
  const [loader, setloader] = useState(true)
  const [userData, setuserData] = useState<any>([])
  const [username, setusername] = useState()
  const [topics, settopics] = useState(["Web development", "Machine Learning", "Python", "Java"])
  const [metadataAvail, setmetadataAvail] = useState(false);
  const [uid, setuid] = useState()
  const RNFS = require('react-native-fs');
  const JSON5 = require('json5');

  // const topics = ['UmnCZ7-9yDY', 'GwIo3gDZCVQ', 'A74TOX803D0', 'xk4_1vDrzzo', 'ntLJmHOJ0ME', 'Pj0neYUp9Tc', 'dz458ZkBMak', 'eIrMbAQSU34', 'gJ9DYC-jswo', 't8pPdKYpowI']
  const Logo = require('../assets/Logo.png')

  const fetchdata = async () => {
    try {
      // console.log("starting 1");
      const RNFS = require('react-native-fs');
      const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
      const file = await RNFS.readFile(path, 'utf8');
      const user_preferences = JSON.parse(file);

      const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
      const file1 = await RNFS.readFile(path1, 'utf8');
      const topics = JSON.parse(file1);

      setusername(user_preferences["UserDetails"]["name"])
      setuserData(user_preferences);
      // console.log(user_preferences);
      // console.log(topics);
      settopics(topics["topics"]);
    }
    catch (e) {
      // console.log("starting 2", e);
      const RNFS = require('react-native-fs');
      // firebase_auth.onAuthStateChanged( async (user)=>{

      const docRef = collection(db, "users", `${uid}/UserPreferences`);
      const docSnap = await getDocs(docRef);

      const docRef1 = collection(db, "users", `${uid}/topics`);
      const docSnap1 = await getDocs(docRef1);

      setuserData(JSON.parse(JSON.stringify(docSnap.docs[0].data())));
      const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
      await RNFS.writeFile(path, JSON.stringify(docSnap.docs[0].data()), 'utf8')

      const topics = await JSON.parse(JSON.stringify(docSnap1.docs[0].data()["topics"]))
      console.log(JSON.parse(JSON.stringify(docSnap1.docs[0].data()["topics"])));

      settopics(topics["topics"]);
      const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
      await RNFS.writeFile(path1, JSON.stringify(docSnap1.docs[0].data()), 'utf8')
      // })
    }
    // const API_Call: any = await fetch('https://skillup-505952169629.asia-south1.run.app/')
    // let str = await API_Call.json()
    // console.log(str);
  }

  const search = async (query: string) => {
    setmetadataAvail(true);
    setmetadata([]);
    setloader(true);
    const searchQuery = query === 'N' ? searchinp : query;
    // setheadertitle('Search results')
    try {
      const searchresult = await fetch('https://skillup-505952169629.asia-south1.run.app/customsearch',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "q": searchQuery })
        }
      )
      let result = await searchresult.json()
      if (result['error']) {
        Alert.alert(result.error)
      }
      let data = []
      let results = []
      for (let i = 0; i < result.length; i++) {
        result[i]['videoID'] = result[i]['videoID'].split('=')[1];
        if (result[i]['videoID'] !== undefined) {
          data.push(result[i]);
          results.push(result[i]['videoID'])
        }
      }
      setmetadata(data);
      await RecommendationTracker(searchQuery, results);
      await writeFiles(data, searchQuery);
      // await new Promise(r => setTimeout(r, 1000));
      setloader(false)
    }
    catch (error) {
      // console.log(error)
      showToast("error", "Something went wrong !");
    }
  }

  const handleTopic = async (item: string) => {
    setmetadata([]);
    setloader(true);
    search(item);
  }

  const RecommendationTracker = async (query: string, results: string[]) => {
    const file = {
      "query": query,
      "count": 0,
      "visited": 0,
      "results": results
    }
    const path = RNFS.DocumentDirectoryPath + '/RecommendationTracker.txt';
    await RNFS.writeFile(path, JSON.stringify(file), 'utf8')
    // console.log("Tracker file written");
  }

  const writeFiles = async (currentFile: videometadata[], searchQuery: string) => {
    const path1 = RNFS.DocumentDirectoryPath + '/metadata.txt';
    const path2 = RNFS.DocumentDirectoryPath + '/topics.txt';
    let metadata: any;
    try {
      let result = await RNFS.readFile(path1, 'utf8')
      metadata = await JSON.parse(result);
      // console.log(metadata);
    }
    catch {
      metadata = { "metadata": [] };
    }
    let topics = await RNFS.readFile(path2, 'utf8');
    topics = await JSON.parse(topics);
    if (!topics["topics"].includes(searchQuery)) {
      if (metadata["metadata"].length >= 150) {
        metadata["metadata"] = await metadata["metadata"].slice(0, 120).concat(currentFile);
      }
      else {
        metadata["metadata"] = await metadata["metadata"].concat(currentFile);
      }
    }
    if (topics["topics"].includes(searchQuery)) {
      await topics["topics"].map((item: string, index: number) => {
        if (item == searchQuery) {
          topics["topics"].splice(index, 1);
        }
      })
    }
    if (topics["topics"].length >= 20) {
      topics["topics"].splice(0, 0, searchQuery)
      topics["topics"].splice(19, 1);
    }
    else {
      await topics["topics"].splice(0, 0, searchQuery);
    }

    await RNFS.writeFile(path1, JSON.stringify(metadata), 'utf8');
    await RNFS.writeFile(path2, JSON.stringify(topics), 'utf8');
    const docRef = collection(db, "users", `${uid}/topics`);
    const docSnap = await getDocs(docRef);
    const docref = doc(db, "users", `${uid}`, "topics", docSnap.docs[0].id);
    await updateDoc(docref, topics);
    settopics(topics["topics"]);
    // const docRef1 = await addDoc(collection(db, "users",`${firebase_auth.currentUser?.uid}/metadata`), metadata);
    // console.log("Document written with ID: ", docRef1.id);
  }

  const Recommendation = async () => {
    try {
      const path = RNFS.DocumentDirectoryPath + '/recommended.txt';
      let recommended = await RNFS.readFile(path, 'utf8');
      const path1 = RNFS.DocumentDirectoryPath + '/metadata.txt';
      let metadata = await RNFS.readFile(path1, 'utf8');

      recommended = await JSON5.parse(recommended);
      // console.log("Recommended",recommended);

      metadata = await JSON.parse(metadata);

      let shuffleArray = (arr: any) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      recommended = await shuffleArray(recommended);
      // console.log("Unshuffled", metadata["metadata"]);
      // console.log("shuffled", shuffleArray(metadata["metadata"]));
      // console.log("Shuffled recommended", recommended);
      let shuffled = await shuffleArray(metadata["metadata"]);
      // console.log("Mixed", shuffled.length);
      // let mixed:any = [];
      let filteredshuffled = await shuffled.filter((item: any) => { return item !== undefined && !recommended.some((recItem: any) => JSON.stringify(recItem) === JSON.stringify(item)) })
      let filteredshuffled1 = await filteredshuffled.slice(0, 25);

      let mixed = await shuffleArray(recommended.concat(filteredshuffled1))
      mixed = await mixed.concat(filteredshuffled.slice(25, 40));
      // console.log("mixed");

      setmetadata(mixed);
      setloader(false);
      setmetadataAvail(true);

      const filepath = RNFS.DocumentDirectoryPath + '/shuffled.txt';
      await RNFS.writeFile(filepath, JSON.stringify(mixed), 'utf8')
    }
    catch (e) {
      // console.log(e);
      // console.log(e);
      setloader(false);
    }
  }

  const showToast = (type: string, message: string) => {
    Toast.show({
      type: type,
      text1: message,
      text1Style: { fontFamily: 'Inter_24pt-Regular', color: 'rgb(25,42,86)', fontSize: 18 },
      visibilityTime: 4000,
    });
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
            placeholderTextColor={'#FBFCF8'}
            onEndEditing={() => { setinpwidth(1) }}
            onFocus={() => { setinpwidth(2) }}
            value={searchinp}
            onChangeText={setsearchinp}
            onSubmitEditing={() => { search('N') }}
          />
          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { search('N') }}>
            <Image style={styles.searchImg} source={require('../assets/search.png')} />
          </TouchableOpacity>
        </View>

        {userData.length != 0 && <Text style={styles.headertxt}>Welcome, {username}</Text>}
        <Image style={[{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 3.5 }]} source={Logo} />

        <View style={styles.videoTopics}>
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
        </View>
      </View>
      <View style={styles.rec_videos}>
        {loader &&
          <ActivityIndicator
            animating={true}
            color={'rgb(25,42,86)'}
            size={Dimensions.get('window').width / 8}
          >
          </ActivityIndicator>
        }
        {!loader && metadataAvail && <TouchableOpacity
          style={styles.expandbtn}
          onPress={() => { navigation.getParent<TabProps['navigation']>().navigate('VideoList', { metadata }) }}
        >
          <Text style={{ fontFamily: 'Inter_24pt-Regular', fontSize: 16, color: 'rgb(25,42,86)' }}>Expand</Text>
          <Image style={styles.btnImg} source={require('../assets/expand.png')} />
        </TouchableOpacity>}

        {!metadataAvail && userData.length != 0 && <View style={{ alignItems: 'center' }}>
          <Text style={styles.rec_txt}>Hey {username} 👋, Try watching various kind of videos to get recommendations</Text>
        </View>}

        {!loader && metadataAvail && <FlatList contentContainerStyle={{ alignItems: 'center', gap: 15 }} style={[styles.list_videos]}
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
  rec_txt: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 25,
    fontWeight: 'bold'
  },
  searchImg: {
    position: 'absolute',
    right: 10,
    height: 20,
    width: 20,
  },
  btnImg: {
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
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
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
    paddingVertical: 4,
    color: '#FBFCF8'
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
    marginTop: 8,
    gap: 10
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