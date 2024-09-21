import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, FlatList,StatusBar, ScrollView } from 'react-native'
import React, { useState, useCallback } from 'react'
import YoutubeIframe from 'react-native-youtube-iframe'
import { useFocusEffect } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../App'
// import { TabParamList } from '../App'

type StackVideoProps = NativeStackScreenProps<StackParamList, 'VideoPreview'>

const VideoPreview = ({ route }: StackVideoProps) => {
  interface quizcontent {
    question: string,
    correctAnswer: string,
    options: string[]
  }


  const { item } = route.params;
  const [save, setsave] = useState(false)
  const [quizdata, setquizdata] = useState<quizcontent[]>([])
  const [loader, setloader] = useState(false)
  const [saveopts, setsaveopts] = useState<any[][]>([])
  const [highlight, sethighlight] = useState(false)
  const [selected, setselected] = useState<number>()
  const [queattempted, setqueattempted] = useState(0)
  const [count, setcount] = useState(0)
  const [visited, setvisited] = useState<number[]>([])

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#FBFCF8');
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const getquiz = async () => {

    setloader(true)
    try {
      const response = await fetch('https://d8cc-202-160-145-20.ngrok-free.app/transcript',
        {
          method: 'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({'videoID' : item.videoID})
        }
      )
      const data = await response.json() 
      if (data['error']) {
        Alert.alert(data.error);
      }
      for(let i = 0;i < data.length;i++){
        setsaveopts(prevsaveopts => [...prevsaveopts,[i,data[i]['correctAnswer']]])
      }
      
      setcount(0)
      setquizdata(data)
      setloader(false)
    }
    catch (error) {
      console.log(error);
      Alert.alert('Something went wrong !');
    }
  }

  const handleOptClick = (index:number,optindex:number,opts:string)=>{
    // console.log(saveopts);
    setqueattempted(index);
    if(saveopts[index][1]===opts&&visited.includes(index)===false){
      // console.log(visited);
      setcount(count+1);
    }
    setvisited(prevvisited=>[...prevvisited,index])
    sethighlight(true);
    setselected(optindex)
  }

  return (
    <>
      <View style={styles.videocontainer}>
        <YoutubeIframe
          videoId={item.videoID}
          height={200}
          play={false}
        />
        <Text style={styles.videoTitle}>{item.title}</Text>
      </View>
      {quizdata.length == 0 &&<View style={styles.btnspace}>
        <TouchableOpacity style={styles.btns} onPress={() => { setsave(!save) }} >
          <Text style={styles.btntitle}>{save ? 'Saved' : 'Save video'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btns} onPress={getquiz}>
          <Text style={styles.btntitle}>Generate quiz</Text>
        </TouchableOpacity>
      </View>}
      {loader && <View style={{ flex: 1, alignItems: 'center', width: '100%', height: 'auto' }}>
        <Text style={{ color: 'red' }}>Loading....</Text>
      </View>}
      {quizdata.length != 0 && <View style={styles.quizlayout}>
        <View style={styles.header}>
          {/* <Text style={styles.headertxt}>Multiple Choice Questions</Text> */}
          <Text style={styles.headertxt}>Marks obtained : {count}/{quizdata.length}</Text>
          <TouchableOpacity style={styles.headerbtn}><Text style={{color: 'rgb(25,42,86)',fontWeight:'bold'}}>Close</Text></TouchableOpacity>
        </View>
        <FlatList
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          data={quizdata}
          renderItem={({item,index}) =>
            <>
              <View style={styles.que}>
                <Text style={styles.quetxt}>Q: {item.question}</Text>
              </View>
              {saveopts.length!=0&&<View style={styles.optlayout}>
                {item.options.map((opts,optindex)=>(
                  highlight&&queattempted===index&&saveopts[index][1]===opts?<TouchableOpacity style={[styles.opt,{backgroundColor:'rgba(62, 254, 89, 0.2)'}]} onPress={()=>handleOptClick(index,optindex,opts)}>
                    <Text style={styles.optstxt}>{opts}</Text>
                  </TouchableOpacity>:selected===optindex&&queattempted===index?<TouchableOpacity style={[styles.opt,{backgroundColor:'rgba(165, 190, 252, 0.197)'}]} onPress={()=>handleOptClick(index,optindex,opts)}>
                    <Text style={styles.optstxt}>{opts}</Text>
                  </TouchableOpacity>:<TouchableOpacity style={[styles.opt]} onPress={()=>handleOptClick(index,optindex,opts)}>
                    <Text style={styles.optstxt}>{opts}</Text>
                  </TouchableOpacity>
                ))}
              </View>}
            </>
          }
          keyExtractor={item.question}
        >
        </FlatList>
      </View>}
    </>
  )
}

const styles = StyleSheet.create({
  
  header:{
    paddingVertical:10,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    flexWrap:'wrap',
    gap:Dimensions.get('window').width/4
  },
  headerbtn:{
    backgroundColor:'rgba(165, 190, 252, 0.197)',
    padding:5,
    width:'20%',
    borderRadius:8,
    alignItems:'center',
  },
  headertxt:{
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 15,
    fontWeight:'bold',
    color: 'rgb(25,42,86)'
  },
  optlayout:{
    alignItems:'center',
    gap:10
  },
  opt: {
    width:'80%',
    borderWidth:2,
    borderColor:'rgb(25,42,86)',
    borderRadius:8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optstxt:{
    fontFamily: 'Inter_24pt-Regular',
    fontSize: 15,
    color: 'rgb(25,42,86)'
  },
  que: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quetxt: {
    fontFamily: 'Inter_24pt-Regular',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'rgb(25,42,86)'
  },
  quizlayout: {
    width: Dimensions.get('window').width,
    height:Dimensions.get('window').height/1.7,
    alignItems: 'center',
  },
  btnspace: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginTop: 40,
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  btntitle: {
    color: 'rgb(25,42,86)',
    fontFamily: 'Inter_24pt-Regular',
    fontWeight: '700',
    fontSize: 15
  },
  btns: {
    width: Dimensions.get('window').width / 2.5,
    backgroundColor: 'rgba(165, 190, 252, 0.197)',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8
  },
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
    padding: 5
  },
})

export default VideoPreview