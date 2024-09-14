import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, FlatList,StatusBar } from 'react-native'
import React, { useState } from 'react'
import YoutubeIframe from 'react-native-youtube-iframe'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../App'

type videoProps = NativeStackScreenProps<StackParamList, 'VideoPreview'>

const VideoPreview = ({ route }: videoProps) => {
  interface quizcontent {
    question: string,
    correctAnswer: string,
    options: string[]
  }


  const { item } = route.params;
  const [save, setsave] = useState(false)
  const [quizdata, setquizdata] = useState<quizcontent[]>([])
  const [loader, setloader] = useState(false)
  const [saveopts, setsaveopts] = useState<number[][]>([])
  const [optstyle, setoptstyle] = useState('transparent')

  const getquiz = async () => {

    setloader(true)
    try {
      const response = await fetch('https://d8c1-202-160-145-0.ngrok-free.app/transcript',
        {
          method: 'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({'videoID' : item.videoID})
        }
      )
      const result = await response.json() 
      if (result['error']) {
        Alert.alert(result.error);
      }
      // for(let i = 0;i < result.length;i++){
      //   setsaveopts(prevsaveopts => [...prevsaveopts,[i,-1]])
      // }
      
      let data = [
        {
          "correctAnswer": "Cascading Style Sheet",
          "options": [
            "Cascading Style Sheet",
            "Computer Style Sheet",
            "Creative Style Sheet",
            "Custom Style Sheet"
          ],
          "question": "What does CSS stand for?"
        },
        {
          "correctAnswer": "To add styling and design elements to a website",
          "options": [
            "To structure the content of a website",
            "To add styling and design elements to a website",
            "To manage the functionality of a website",
            "To create interactive elements on a website"
          ],
          "question": "What is the primary purpose of CSS?"
        },
        {
          "correctAnswer": "3",
          "options": [
            "1",
            "2",
            "3",
            "4"
          ],
          "question": "How many ways are there to import CSS into an HTML document?"
        },
        {
          "correctAnswer": "Inline",
          "options": [
            "Inline",
            "External",
            "Internal",
            "Embedded"
          ],
          "question": "Which method of importing CSS involves writing the CSS code directly within the HTML document?"
        },
        {
          "correctAnswer": "External",
          "options": [
            "Inline",
            "External",
            "Internal",
            "Embedded"
          ],
          "question": "Which method of importing CSS involves creating a separate CSS file and linking it to the HTML document?"
        },
        {
          "correctAnswer": "Internal",
          "options": [
            "Inline",
            "External",
            "Internal",
            "Embedded"
          ],
          "question": "Which method of importing CSS involves writing the CSS code within a `<style>` tag within the HTML document?"
        },
        {
          "correctAnswer": "To apply specific styles to multiple HTML elements",
          "options": [
            "To define the properties of a specific HTML element",
            "To apply specific styles to multiple HTML elements",
            "To create custom HTML elements",
            "To manage the flow of content on a website"
          ],
          "question": "What is the purpose of CSS selectors?"
        },
        {
          "correctAnswer": "Class selector",
          "options": [
            "Type selector",
            "Class selector",
            "ID selector",
            "Attribute selector"
          ],
          "question": "Which CSS selector targets all elements with a specific class attribute?"
        },
        {
          "correctAnswer": "Type selector",
          "options": [
            "Type selector",
            "Class selector",
            "ID selector",
            "Attribute selector"
          ],
          "question": "Which CSS selector targets a specific HTML element based on its tag name?"
        },
        {
          "correctAnswer": "ID selector",
          "options": [
            "Type selector",
            "Class selector",
            "ID selector",
            "Attribute selector"
          ],
          "question": "Which CSS selector targets a specific HTML element based on its unique ID attribute?"
        },
        {
          "correctAnswer": "To apply styles when the mouse hovers over an element",
          "options": [
            "To apply styles when an element is clicked",
            "To apply styles when an element is focused",
            "To apply styles when the mouse hovers over an element",
            "To apply styles to the first child of an element"
          ],
          "question": "What is the purpose of the `:hover` pseudo-class?"
        },
        {
          "correctAnswer": "Descendant selector",
          "options": [
            "Universal selector",
            "Descendant selector",
            "Child selector",
            "Adjacent sibling selector"
          ],
          "question": "Which CSS selector targets all elements within a specific parent element?"
        },
        {
          "correctAnswer": "To select all elements on the page",
          "options": [
            "To select all elements on the page",
            "To select all elements with a specific class",
            "To select all elements with a specific ID",
            "To select all elements with a specific attribute"
          ],
          "question": "What is the purpose of the `*` character in a CSS selector?"
        }
      ]
      for(let i = 0;i < data.length;i++){
        setsaveopts(prevsaveopts => [...prevsaveopts,[i,-1]])
      }
      // setquizdata(data)
      setquizdata(data)
      setloader(false)
    }
    catch (error) {
      console.log(error);
      Alert.alert('Something went wrong !');
    }
  }
  const handleOptClick = (index:any,optindex:any)=>{
    saveopts[index][1]==optindex?
    setsaveopts(saveopts.splice(index,1,[index,-1])):
    setsaveopts(saveopts.splice(index,1,[index,optindex]))
    console.log(saveopts)
    setoptstyle('rgba(165, 190, 252, 0.197)')
  }

  // console.log(item)
  return (
    <>
      <StatusBar
        backgroundColor={'#FBFCF8'}
        barStyle={'dark-content'}
      />
      <View style={styles.videocontainer}>
        <YoutubeIframe
          videoId={item.videoID}
          height={200}
          play={false}
        />
        <Text style={styles.videoTitle}>{item.title}</Text>
      </View>
      {<View style={styles.btnspace}>
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
          <Text style={styles.headertxt}>Multiple Choice Questions</Text>
          <TouchableOpacity style={styles.headerbtn}><Text style={{color: 'rgb(25,42,86)',fontWeight:'bold'}}>Close</Text></TouchableOpacity>
        </View>
        <FlatList
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          data={quizdata}
          renderItem={({ item,index }) =>
            <>
              <View style={styles.que}>
                <Text style={styles.quetxt}>Q: {item.question}</Text>
              </View>
              {saveopts.length!=0&&<View style={styles.optlayout}>
                {item.options.map((opts,optindex)=>(
                  <TouchableOpacity style={[{backgroundColor:optstyle},styles.opt]} onPress={()=>{handleOptClick(index,optindex)}} >
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
    paddingVertical:20,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    gap:10
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
    fontSize: 18,
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