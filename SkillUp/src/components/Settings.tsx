import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Image, FlatList, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { firebase_auth } from '../../firebaseConfig'
import YoutubeIframe from 'react-native-youtube-iframe'
import { useNavigation } from '@react-navigation/native';

const Settings = () => {

  const navigation = useNavigation<string | any>();

  const [userData, setuserData] = useState<any>([])
  const [user, setuser] = useState('')
  const [email, setemail] = useState('')
  const [history, sethistory] = useState<any>({})
  const [saved, setsaved] = useState<any>({})
  const [courses, setcourses] = useState<any>({})
  // const [metadata, setmetadata] = useState<videometadata[]>([])

  const metadata = ['UmnCZ7-9yDY', 'GwIo3gDZCVQ', 'A74TOX803D0', 'xk4_1vDrzzo', 'ntLJmHOJ0ME', 'Pj0neYUp9Tc', 'dz458ZkBMak', 'eIrMbAQSU34', 'gJ9DYC-jswo', 't8pPdKYpowI']


  const handleSignout = () => {
    const RNFS = require('react-native-fs');
    const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
    RNFS.unlink(path)
    firebase_auth.signOut();
    navigation.navigate('Authentication');
  }

  const fetchData = async () => {
    const RNFS = require('react-native-fs');
    const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
    const file = await RNFS.readFile(path, 'utf8');
    const user_preferences = JSON.parse(file);

    setuser(() => {
      const newData = user_preferences['UserDetails']['name'];
      console.log(JSON.stringify(newData));
      return newData
    });
    setemail(() => {
      const newData = user_preferences['UserDetails']['email'];
      console.log(JSON.stringify(newData));
      return newData
    });
    sethistory(() => {
      const newData = user_preferences['history'];
      console.log(JSON.stringify(newData));
      return newData
    });
    setsaved(() => {
      let newData = user_preferences['saved'];
      console.log(JSON.stringify(newData));
      return newData  
    });
    setcourses(() => {
      const newData = user_preferences['courses'];
      console.log(JSON.stringify(newData));
      return newData
    });

  }

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#FBFCF8');
      StatusBar.setBarStyle('dark-content');
      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header_row}>
          <ScrollView horizontal={true} style={{ flexDirection: 'row' }}>
            {user.length != 0 && <Text style={styles.headertxt}>{user}</Text>}
          </ScrollView>
          <View style={styles.profile}>
            <Text style={styles.profiletxt}>{user[0]}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.emailtxt}>{email}</Text>
        </View>
      </View>
      <View style={{ gap: 40, }}>
        <View style={{}}>
          <View style={styles.historyTitle}>
            <Text style={styles.titletxt}>History</Text>
          </View>
          <TouchableOpacity
            style={styles.headerbtns}
            onPress={()=>{navigation.navigate('VideoList',history);
            }}
          >
            <Text style={{ fontFamily: 'Inter_24pt-Regular', fontSize: 16, color: 'rgb(25,42,86)' }}>View all</Text>
            <Image style={styles.btnImg} source={require('../assets/expand.png')} />
          </TouchableOpacity>
        </View>
        {history.length != 0 ? <FlatList horizontal={true} contentContainerStyle={{ alignItems: 'center', gap: 15 }} style={[styles.videolist]}
          data={history}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          renderItem={({ item }: any) => {
            return (
              <TouchableOpacity style={{height:150,backgroundColor:'rgba(165, 190, 252, 0.197)'}} onPress={() => { navigation.navigate('VideoPreview', { item }) }}>

                <YoutubeIframe
                  height={200}
                  width={250}
                  videoId={item.videoID}
                  play={false}
                />
                {/* <Text style={styles.videoTitle}>{item.title}</Text> */}
              </TouchableOpacity>
            )

          }}
          keyExtractor={item => item.videoID}
        >
        </FlatList>:<View style={{ width: '100%', height: 140, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.btntxt}>No history</Text>
        </View>}
      </ View>
      <View style={{ gap: 40 }}>
        <View style={{}}>
          <View style={styles.historyTitle}>
            <Text style={styles.titletxt}>Saved videos</Text>
          </View>
          <TouchableOpacity
            style={styles.headerbtns}
            onPress={()=>{navigation.navigate('VideoList',saved)}}
          >
            <Text style={{ fontFamily: 'Inter_24pt-Regular', fontSize: 16, color: 'rgb(25,42,86)' }}>View all</Text>
            <Image style={styles.btnImg} source={require('../assets/expand.png')} />
          </TouchableOpacity>
        </View>
        {saved.length != 0  ? <FlatList horizontal={true} contentContainerStyle={{ alignItems: 'center', gap: 15 }} style={[styles.videolist]}
          data={saved}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          renderItem={({ item }: any) =>
            item!==null?(<TouchableOpacity style={{height:150,backgroundColor:'rgba(165, 190, 252, 0.197)'}} onPress={() => { navigation.navigate('VideoPreview', { item }) }}>
              <YoutubeIframe
                height={180}
                width={250}
                videoId={item.videoID}
                play={false}
              />
              {/* <Text style={styles.videoTitle}>{item.title}</Text> */}
            </TouchableOpacity>):null
          }
          keyExtractor={item => item}
        >
        </FlatList> : <View style={{ width: '100%', height: 140, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.btntxt}>No saved videos</Text>
        </View>}
      </ View>
      <View style={{ gap: 40 }}>
        <View style={{}}>
          <View style={styles.historyTitle}>
            <Text style={styles.titletxt}>My courses</Text>
          </View>
          {/* <TouchableOpacity
            style={styles.headerbtns}
          
          >
            <Text style={{ fontFamily: 'Inter_24pt-Regular', fontSize: 16, color: 'rgb(25,42,86)' }}>View all</Text>
            <Image style={styles.btnImg} source={require('../assets/expand.png')} />
          </TouchableOpacity> */}
        </View>
        {courses.length != 0 ? <FlatList horizontal={true} contentContainerStyle={{ alignItems: 'center', gap: 15 }} style={[styles.videolist]}
          data={courses}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          renderItem={({ item }: any) =>

            item!==null?(<TouchableOpacity key={item.playlistId} style={styles.coursecontainer} onPress={() => { navigation.navigate('Courses', item); }}>
              <View style={styles.coursecontainer}>
                {/* <Text>{item.thumbnails}</Text> */}
                <Image style={{ width: '100%', height: '100%' }} source={{ uri: item[4] }} resizeMode='contain'></Image>  
              </View>
            </TouchableOpacity>):null
          }
          keyExtractor={item => item}
        >
        </FlatList> : <View style={{ width: '100%', height: 120, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.btntxt}>No courses enrolled</Text>
        </View>}
      </ View>
      <TouchableOpacity style={styles.btns} onPress={() => handleSignout()}>
        <Text style={styles.btntxt}>Sign out</Text>
        <Image style={styles.btnImg} source={require('../assets/exit.png')} />
      </TouchableOpacity>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({

  coursecontainer: {
    width: 190,
    height: 110,
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
  },
  videocontainer: {
    width: 250,
    height: 150,
    // backgroundColor: 'rgba(165, 190, 252, 0a.197)',
  },
  videolist: {
    width: '100%',
    // height:180,
    paddingHorizontal: 10,
    // backgroundColor:'pink'
  },
  btnImg: {
    height: 16,
    width: 16,
  },
  headerbtns: {
    position: 'absolute',
    right: 30,
    top: 5,
    width: 'auto',
    height: 'auto',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  historyTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 30
  },
  titletxt: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 20,
  },
  emailtxt: {
    fontFamily: 'Inter_24pt-Regular',
    color: 'rgb(25,42,86)',
    fontSize: 12,
    paddingHorizontal: 40
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgb(25,42,86)',
    backgroundColor: 'rgb(25,42,86)',
    alignItems: 'center',
    justifyContent: 'center'

  },
  profiletxt: {
    color: '#FBFCF8',
    fontSize: 30,
  },
  headertxt: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 30,
    fontWeight: '900'
  },
  header_row: {
    flexDirection: 'row',
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 12,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    backgroundColor: '#FBFCF8',
    width: '100%',
    fontFamily: 'Inter_24pt-Regular',
    paddingVertical: 20,
    gap: 10
  },
  btntxt: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontWeight: 'bold',
    fontSize: 20
  },
  btns: {
    width: '60%',
    height: 'auto',
    padding: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
})