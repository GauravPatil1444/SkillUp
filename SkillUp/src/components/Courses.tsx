import { View, Text, StyleSheet, StatusBar, SafeAreaView, TextInput, Alert, TouchableOpacity, FlatList, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabParamList } from '../App'
import { collection, updateDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { firebase_auth } from '../../firebaseConfig'
import Toast from 'react-native-toast-message'

type TabProps = NativeStackScreenProps<TabParamList, 'Courses'>

const Courses = ({ route }: TabProps) => {

  const navigation = useNavigation<string | any>();

  interface coursemetadata {
    channelTitle: string,
    description: string,
    playlistId: string,
    title: string,
    thumbnails: string
  }

  interface coursevideolist {
    videoID: string,
    title: string
  }

  const [inpwidth, setinpwidth] = useState(1)
  const [searchinp, setsearchinp] = useState('')
  const [metadata, setmetadata] = useState<coursemetadata[]>([])
  const [loader, setloader] = useState(true)
  const [viewcourse, setviewcourse] = useState(false)
  const [coursevideolist, setcoursevideolist] = useState<coursevideolist[]>([])
  const [courseMetadata, setcourseMetadata] = useState<string[]>([])
  const [Enrolltxt, setEnrolltxt] = useState('Enroll now !')
  const [pressCount, setpressCount] = useState(1)
  const [update, setupdate] = useState(false)
  const [mycoursesview, setmycoursesview] = useState(false)
  const [NoCourse, setNoCourse] = useState(false)
  let backupMetadata: any = []

  const RNFS = require('react-native-fs');

  useFocusEffect(
    useCallback(() => {
      if (viewcourse) {
        StatusBar.setBackgroundColor('rgb(25,42,86)');
        StatusBar.setBarStyle('light-content');
      }
      else {
        StatusBar.setBackgroundColor('#FBFCF8');
        StatusBar.setBarStyle('dark-content');
      }
      mycourses();
    }, [, viewcourse])
  );

  useEffect(() => {
    setcoursevideolist([]);
    const item: any = route.params;
    console.log("Route", item);
    opencourse(item);
  }, [route.params])

  useEffect(() => {
    updateData();
  }, [update])

  const search = async () => {
    setloader(true);
    setNoCourse(false);
    setmetadata([])
    try {
      const searchresult = await fetch('https://skillup-505952169629.asia-south1.run.app/fetchcourses',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "q": searchinp })
        }
      )
      let result = await searchresult.json()
      if (result['error']) {
        Alert.alert(result.error)
      }

      for (let i = 0; i < result.length - 1; i++) {
        // result[i]['videoID'] = result[i]['videoID'].split('=')[1];
        setmetadata(prevMetadata => [...prevMetadata, result[i + 1]]);
      }
      setloader(false)
      setmycoursesview(false);
    }
    catch (error) {
      console.log(error)
      Alert.alert('Something went wrong !');
    }
  }

  const opencourse = async (item: any) => {
    let query = '';
    console.log(item);
    if (item['playlistId'] === undefined) {
      query = item[0];
      checkEnroll(query);
      console.log(2, query);
    }
    else {
      query = item['playlistId'];
      checkEnroll(query);
      console.log(1, query);
      item = [item.playlistId, item.channelTitle, item.description, item.title, item.thumbnails]
    }
    setcoursevideolist([]);
    setcourseMetadata(item);
    backupMetadata = item;
    setloader(true);

    const fetchvideos = await fetch('https://skillup-505952169629.asia-south1.run.app/fetchcoursevideos',
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "q": query })
      }
    );
    const result = await fetchvideos.json();
    // console.log(result);

    for (let i = 0; i < result.length; i++) {
      setcoursevideolist(prevcoursevideolist => [...prevcoursevideolist, result[i]]);
    }
    setloader(false);
    setviewcourse(true);
  }

  const checkEnroll = async (item: string) => {
    let flag = true;
    const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
    const file = await RNFS.readFile(path, 'utf8');
    let user_preferences = await JSON.parse(file);
    console.log(user_preferences);
    await user_preferences["courses"].map((i: coursemetadata) => {
      console.log(i.playlistId, item);

      if (i.playlistId == item) {
        flag = false;
      }
    })
    if (!flag) {
      setEnrolltxt('Enrolled');
    }
    else {
      setEnrolltxt('Enroll now !');
    }
  }

  const Enroll = async (item: string[]) => {
    if (Enrolltxt != "Enrolled") {
      const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
      let setitem = { "playlistId": item[0], "channelTitle": item[1], "description": item[2], "title": item[3], "thumbnails": item[4] }
      const file = await RNFS.readFile(path, 'utf8');
      let user_preferences = await JSON.parse(file);
      user_preferences["courses"].splice(0, 0, setitem);
      await RNFS.writeFile(path, JSON.stringify(user_preferences), 'utf8')
      setEnrolltxt('Enrolled')
      setupdate(!update);
      showToast("success", "Course Enrolled !");
    }
    else {
      const removeCourse = async () => {
        let index = 0;
        const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
        const file = await RNFS.readFile(path, 'utf8');
        let user_preferences = await JSON.parse(file);
        // console.log(user_preferences['courses']);
        await user_preferences["courses"].map((course: coursemetadata, i: number) => {
          if (course.playlistId === item[0]) {
            index = i;
          }
        })
        // delete user_preferences["courses"][index];
        user_preferences["courses"].splice(index, 1);
        setpressCount(1);
        console.log("Deleted", index);
        await RNFS.writeFile(path, JSON.stringify(user_preferences), 'utf8')
        setEnrolltxt('Enroll now !');
        setupdate(!update);
        showToast("success", "Course Exited !");
        navigation.navigate('Settings');
      }
      Alert.alert(
        "Already Enrolled !",
        "Do you want to remove it ?",
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => removeCourse(),
            style: 'default',
          }
        ]
      )
    }

  }

  const mycourses = async () => {
    setmetadata([]);
    setloader(true);
    const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
    const file = await RNFS.readFile(path, 'utf8');
    let user_preferences = await JSON.parse(file);
    if (user_preferences['courses'].length > 0) {
      await user_preferences['courses'].map((item: coursemetadata) => {
        setmetadata(prevMetadata => [...prevMetadata, item]);
      })
      console.log(user_preferences['courses']);
      setloader(false);
      setmycoursesview(true);
    }
    else {
      try {
        const docRef = collection(db, "users", `${firebase_auth.currentUser?.uid}/UserPreferences`);
        const docSnap = await getDocs(docRef);
        if (docSnap.docs[2].data().length > 0) {
          const data = await JSON.parse(JSON.stringify(docSnap.docs[1].data()));
          setmetadata(data);
          const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
          await RNFS.writeFile(path, data, 'utf8')
          setloader(false);
          setmycoursesview(true);
          setupdate(!update);
        }
      }
      catch {
        console.log("Can't retrive documents");
        setloader(false);
        setNoCourse(true);
      }
    }
  }


  const updateData = async () => {
    const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
    const file = await RNFS.readFile(path, 'utf8');
    console.log(file);
    console.log(firebase_auth.currentUser?.uid);
    const docRef = collection(db, "users", `${firebase_auth.currentUser?.uid}/UserPreferences`);
    const docSnap = await getDocs(docRef);
    const docref = doc(db, "users", `${firebase_auth.currentUser?.uid}`, "UserPreferences", docSnap.docs[0].id);
    await updateDoc(docref, JSON.parse(file));
    console.log("Document updated successful !", docSnap.docs[0].id);
  }

  const showToast = (type: string, message: string) => {
    Toast.show({
      type: type,
      text1: message,
      text1Style: { fontFamily: 'Inter_24pt-Regular', color: 'rgb(25,42,86)', fontSize: 18 },
      visibilityTime: 4000,
    });
  }


  return (
    <SafeAreaView style={styles.homecontainer}>
      {!viewcourse && <View style={styles.header}>
        <View style={[styles.inpfield, { borderWidth: inpwidth }]}>
          <TextInput
            autoCorrect={true}
            cursorColor={'rgb(25,42,86)'}
            inputMode='search'
            enterKeyHint='search'
            returnKeyType='search'
            style={styles.input}
            placeholder='Search for a course'
            placeholderTextColor={'rgb(25,42,86)'}
            onEndEditing={() => { setinpwidth(1) }}
            onFocus={() => { setinpwidth(2) }}
            value={searchinp}
            onChangeText={setsearchinp}
            onSubmitEditing={search}
          />
          <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { search() }}>
            <Image style={styles.searchImg} source={require('../assets/search_dark.png')} />
          </TouchableOpacity>
        </View>
      </View>}
      {loader && <ActivityIndicator
        animating={true}
        color={'rgb(25,42,86)'}
        size={Dimensions.get('window').width / 8}
      >
      </ActivityIndicator>
      }
      {!loader && !viewcourse && <View style={styles.list_videos}>
        {mycoursesview ? <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgb(25,42,86)', fontFamily: 'Inter_24pt-Regular', fontSize: 25 }}>My courses</Text>
        </View> : NoCourse && <View style={[{ alignItems: 'center', justifyContent: 'center', height: '50%' }]}>
          <Text style={{ color: 'rgb(25,42,86)', fontFamily: 'Inter_24pt-Regular', fontSize: 25 }}>No Courses Saved</Text>
        </View>}
        <FlatList contentContainerStyle={{ alignItems: 'center' }} style={[styles.rec_videos]}
          data={metadata}
          initialNumToRender={3}
          maxToRenderPerBatch={2}
          renderItem={({ item }) =>
            <TouchableOpacity key={item.playlistId} style={styles.videocontainer} onPress={() => opencourse(item)}>
              <View style={styles.courseBanner}>
                {/* <Text>{item.thumbnails}</Text> */}
                <Image style={{ width: '100%', height: 180 }} source={{ uri: item.thumbnails }} resizeMode='contain'></Image>
              </View>
              <Text style={styles.videoTitle}>{item.title}</Text>
            </TouchableOpacity>
          }
          keyExtractor={item => item.playlistId}
        >
        </FlatList>
      </View>}
      {viewcourse && <>
        <View style={styles.courseheader}>
          <Text style={styles.coursetitle} >{courseMetadata[3]}</Text>
          <Text style={styles.headertxt}>By</Text>
          <Text style={styles.channelname}>{courseMetadata[1]}</Text>
          <Text style={styles.channeldescription}>{courseMetadata[2]}</Text>
          <View style={styles.btnSpace}>
            <TouchableOpacity style={styles.btns} onPress={() => setviewcourse(false)}>
              <Text style={{ fontFamily: 'Inter_24pt-Regular', color: '#FBFCF8' }}>Go back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btns} onPress={() => Enroll(courseMetadata)}>
              <Text style={{ fontFamily: 'Inter_24pt-Regular', color: '#FBFCF8' }}>{Enrolltxt}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.list_courseVideos}>
          <FlatList contentContainerStyle={{ alignItems: 'center' }} style={[styles.rec_videos]}
            data={coursevideolist}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            renderItem={({ item }) =>
              <TouchableOpacity key={item.videoID} style={styles.videocontainer} onPress={() => { navigation.navigate('VideoPreview', { item }) }}>
                <View style={styles.courseBanner}>
                  <YoutubeIframe
                    height={200}
                    videoId={item.videoID}
                    play={false}
                  />
                </View>
                <Text style={styles.videoTitle}>{item.title}</Text>
              </TouchableOpacity>
            }
            keyExtractor={item => item.videoID}
          >
          </FlatList>
        </View>

      </>}


    </SafeAreaView>
  )
}

export default Courses

const styles = StyleSheet.create({
  searchImg: {
    position: 'absolute',
    right: 10,
    height: 20,
    width: 20,
  },
  btnSpace: {
    width: '100%',
    flexDirection: 'row',
    gap: 15,
    position: 'absolute',
    bottom: 15,
    justifyContent: 'space-evenly'
  },
  list_courseVideos: {
    position: 'absolute',
    top: '34%',
    width: '100%',
    height: '65%',
    backgroundColor: '#FBFCF8',
  },
  btns: {
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FBFCF8',
    alignItems: 'center',
    width: '30%',
  },
  channeldescription: {
    fontFamily: 'Inter_24pt-Regular',
    textAlign: 'center',
    color: '#FBFCF8',
    fontSize: 12,
    padding: 8,
  },
  channelname: {
    fontFamily: 'Inter_24pt-Regular',
    textAlign: 'center',
    // fontWeight:'bold',
    color: '#FBFCF8',
    fontSize: 18
  },
  headertxt: {
    fontFamily: 'Inter_24pt-Regular',
    textAlign: 'center',
    color: '#FBFCF8',
  },
  coursetitle: {
    fontFamily: 'Inter_24pt-Regular',
    color: '#FBFCF8',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center'
  },
  courseheader: {
    width: '100%',
    height: '35%',
    backgroundColor: 'rgb(25,42,86)',
    alignItems: 'center',
    gap: 5,
    elevation: 3
    // borderBottomRightRadius:30,
    // borderBottomLeftRadius:30,
  },
  list_videos: {
    width: '100%',
    height: '95%',
    backgroundColor: '#FBFCF8',
  },
  courseBanner: {
    width: '100%',
    height: 'auto'
  },
  rec_videos: {
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
    backgroundColor: '#FBFCF8',
  },
  videocontainer: {
    width: Dimensions.get('window').width,
    padding: 4,
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
    marginTop: 15
  },
  videoTitle: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center'
  },
  inpfield: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    borderRadius: 8,
    borderColor: 'rgb(25,42,86)',
  },
  input: {
    flex: 1,
    width: 'auto',
    fontSize: 15,
    paddingVertical: 4,
    color: 'rgb(25,42,86)'
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FBFCF8',
    width: '100%',
    height: 'auto',
    padding: 8
  },
  homecontainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FBFCF8',
    width: '100%',
    fontFamily: 'Inter_24pt-Regular'
  },

})