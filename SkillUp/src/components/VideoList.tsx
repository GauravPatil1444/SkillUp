import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions, StatusBar } from 'react-native'
import YoutubeIframe from 'react-native-youtube-iframe'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React,{useCallback, useState, useEffect} from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabParamList } from '../App'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { firebase_auth } from '../../firebaseConfig'

type TabProps = NativeStackScreenProps<TabParamList, 'VideoList'>

// const videolist = ['UmnCZ7-9yDY', 'GwIo3gDZCVQ', 'A74TOX803D0', 'xk4_1vDrzzo', 'ntLJmHOJ0ME', 'Pj0neYUp9Tc', 'dz458ZkBMak', 'eIrMbAQSU34', 'gJ9DYC-jswo', 't8pPdKYpowI']

const VideoList = ({route}:TabProps) => {

  const navigation = useNavigation<string|any>()
  const RNFS = require('react-native-fs'); 

  const [myvidoesview, setmyvideosview] = useState(false)
  const [metadata, setmetadata] = useState<any>([])
  
  // let metadata:any;
  
  const myVideos = async () => {
    // metadata = [];
    const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
    const file = await RNFS.readFile(path, 'utf8');
    let user_preferences = await JSON.parse(file);
    if (user_preferences['saved'].length > 0) {
      let data:any = [];
      await user_preferences['saved'].map((item:any) => {
        data.push(item)
      })
      setmetadata(data);
      // console.log(user_preferences['saved']);
    }
    else {
      try {
        const docRef = collection(db, "users", `${firebase_auth.currentUser?.uid}/UserPreferences`);
        const docSnap = await getDocs(docRef);
        if (docSnap.docs[2].data().length > 0) {
          const data = await JSON.parse(JSON.stringify(docSnap.docs[3].data()));
          // metadata = data
          setmetadata(data);
          const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
          await RNFS.writeFile(path, data, 'utf8')
        }
      }
      catch {
        console.log("Can't retrive documents");
      }
    }
    setmyvideosview(true);
  }

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#FBFCF8');
      StatusBar.setBarStyle('dark-content');
    }, [])
  );
  useEffect(() => {
    try{
      // metadata = [];
      if(route.params.metadata==undefined){
        // metadata = route.params;
        setmetadata(route.params)
      }
      else{
        // metadata = route.params.metadata;
        setmetadata(route.params.metadata)
      }
      setmyvideosview(false);
      console.log(metadata);
    }
    catch{
      myVideos();

    }
  }, [route.params])
  
  useEffect(() => {
    myVideos();
  }, [])


  return (
    <View style={styles.container}>
      {myvidoesview&&<View style={{alignItems:'center'}}>
          <Text style={{color:'rgb(25,42,86)',fontFamily:'Inter_24pt-Regular',fontSize:25}}>Saved videos</Text>
      </View>}
      <FlatList contentContainerStyle={{ alignItems: 'center' }} style={[styles.rec_videos]}
        data={metadata}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        renderItem={({ item }) =>
          item!==null?(<TouchableOpacity style={styles.videocontainer} onPress={()=>{navigation.navigate('VideoPreview',{item})}}>

            <YoutubeIframe
              height={200}
              videoId={item.videoID}
              play={false}
            />
            <Text style={styles.videoTitle}>{item.title}</Text>
          </TouchableOpacity>):null
        }
        keyExtractor={item => item==null?item:item.videoID}
      >
      </FlatList>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FBFCF8',
    width: '100%',
    height:'auto'
  },
  rec_videos: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // bottom: '0%',
    width: '100%',
    height: '100%',
    // backgroundColor:'rgb(25,42,86)',
    backgroundColor: '#FBFCF8',
    // elevation: 3,
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
export default VideoList