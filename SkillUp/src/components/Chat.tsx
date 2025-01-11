import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Dimensions, FlatList, Image, StatusBar } from 'react-native'
import React from 'react'
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message'

const Chat = () => {

    const navigation = useNavigation<string | any>();

    const [searchinp, setsearchinp] = useState('')
    const [chat, setchat] = useState<string[]>([])
    const [Editable, setEditable] = useState(true)

    const askdoubt = async () => {
        setEditable(false);
        setsearchinp("Thinking...");
        try{
            const res = await fetch('https://e175-2409-40c2-26-8cdb-45ab-d7b9-f9a6-f52f.ngrok-free.app/chat',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "question": searchinp })
                }
            )
            const data = await res.json();
            const processed = ("Q : "+searchinp+"\n\n\n")+data;
            setchat([...chat, processed]);
        }
        catch(e){
            // console.log(e);
            showToast("error","Something went wrong !");
            setEditable(true);
            setsearchinp("");
        }
        // console.log(data);
        setEditable(true);
        setsearchinp("");
    }

    const showToast = (type:string,message:string) => {
        Toast.show({
          type: type,
          text1: message,
          text1Style:{fontFamily:'Inter_24pt-Regular',color:'rgb(25,42,86)',fontSize:18},
          visibilityTime:4000,  
        });
    }

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('#FBFCF8');
            StatusBar.setBarStyle('dark-content');
        }, [])
    );

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headertxt}>Ask doubts regarding topics</Text>
                <TouchableOpacity onPress={() => { navigation.pop() }} style={styles.headerbtn}><Text style={{ color: 'rgb(25,42,86)', fontWeight: 'bold' }}>Close</Text></TouchableOpacity>
            </View>
            <View style={{ height: Dimensions.get('window').height / 1.28,}}>
                {chat.length == 0 && <View style={{ height: Dimensions.get('window').height / 1.28, justifyContent: 'center', alignItems: 'center' }}><Image style={[{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 3.5 }]} source={require('../assets/Logo_dark.png')} /></View>}
                <FlatList
                    maxToRenderPerBatch={3}
                    initialNumToRender={3}
                    contentContainerStyle={{gap: 10, padding:8}}
                    data={chat}
                    renderItem={({ item }) =>
                        <View key={item} style={{ backgroundColor:'#FBFCF8', justifyContent: 'center', paddingHorizontal: 15, padding:8 }}>
                            <Text style={[styles.optstxt, { fontSize: 16, color: 'rgb(16, 28, 58)' }]}>{item}</Text>
                        </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                >
                </FlatList>
            </View>
            <KeyboardAvoidingView style={styles.footer}>
                <View style={[styles.inpfield]}>
                    <TextInput
                        editable={Editable}
                        autoCorrect={true}
                        cursorColor={'rgb(25,42,86)'}
                        inputMode='search'
                        enterKeyHint='search'
                        returnKeyType='search'
                        style={styles.input}
                        placeholder='Enter your query'
                        placeholderTextColor={'rgb(25,42,86)'}
                        value={searchinp}
                        onChangeText={setsearchinp}
                        onSubmitEditing={()=>{askdoubt()}}
                    />
                    <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {askdoubt()}}>
                        <Image style={styles.searchImg} source={require('../assets/send.png')} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}
const styles = StyleSheet.create({
    optstxt: {
        fontFamily: 'Inter_24pt-Regular',
        fontSize: 15,
        color: 'rgb(25,42,86)'
    },
    searchImg: {
        position: 'absolute',
        right: 10,
        height: 25,
        width: 25,
    },
    footer: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        position: 'absolute',
        bottom: 15
    },
    inpfield: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgb(25,42,86)',
        backgroundColor: '#FBFCF8'
    },
    input: {
        flex: 1,
        width: 'auto',
        fontSize: 16,
        paddingVertical: 4,
        color: 'rgb(25,42,86)',
    },
    header: {
        backgroundColor: '#FBFCF8',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Dimensions.get('window').width / 4
    },
    headerbtn: {
        backgroundColor: 'rgba(165, 190, 252, 0.197)',
        padding: 5,
        width: '20%',
        borderRadius: 8,
        alignItems: 'center',
    },
    headertxt: {
        fontFamily: 'Inter_24pt-Regular',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'rgb(25,42,86)'
    },


})

export default Chat