import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView , Alert } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabParamList } from '../App'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from '../../firebaseConfig'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

type TabProps = NativeStackScreenProps<TabParamList, 'Authentication'>

const Login = ({ navigation }: TabProps) => {

    const [emailclick, setemailclick] = useState(false)
    const [inp1width, setinp1width] = useState(1)
    const [inp2width, setinp2width] = useState(1)
    const [inp3width, setinp3width] = useState(1)
    const [inp4width, setinp4width] = useState(1)
    const [loginmode, setloginmode] = useState(true)
    const [username, setusername] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const RNFS = require('react-native-fs');

    const createAccount = async() => {
        if(password==confirmpassword){
            try{
                const response = await createUserWithEmailAndPassword(firebase_auth, email, password)
                const user_email = response.user.email;
                const user_id = response.user.uid
                // console.log(user);
                const docRef = await addDoc(collection(db, "users",`${user_id}/UserDetails`), {
                    name : username,
                    email : user_email,
                });
                console.log("Document written with ID: ", docRef.id);
                let user_preferences = {
                    "UserDetails" : {
                        "name" : username,
                        "email" : user_email
                    },
                    "history" : [],
                    "saved" : [],
                    "courses" : []
                }
                let topics = {
                    "topics" : ["Web development","Machine Learning", "Python", "Java"]
                }

                const docRef1 = await addDoc(collection(db, "users",`${user_id}/UserPreferences`), user_preferences);
                console.log("Document written with ID: ", docRef1.id);
                const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
                await RNFS.writeFile(path, JSON.stringify(user_preferences), 'utf8')

                const docRef2 = await addDoc(collection(db, "users",`${user_id}/topics`), topics);
                console.log("Document written with ID: ", docRef2.id);
                const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
                await RNFS.writeFile(path1, JSON.stringify(topics), 'utf8')

                navigation.navigate('StackNavigation')
            }
            catch(error:any){
                const message = error.message;
                Alert.alert(message);
            };
        }
        else{
            Alert.alert("confirm password doesn't matched !");
        }
    }
    const authenticate = async()=>{   
        try{
            const response  = await signInWithEmailAndPassword(firebase_auth,email,password);
            // console.log(response);
            const user_id = response.user.uid;
            const docRef = collection(db, "users",`${user_id}/UserPreferences`);
            const docSnap = await getDocs(docRef);

            const docRef1 = collection(db, "users",`${user_id}/topics`);
            const docSnap1 = await getDocs(docRef1);

            // console.log(docSnap.docs[0].data());
            const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
            await RNFS.writeFile(path, JSON.stringify(docSnap.docs[0].data()), 'utf8')
            const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
            await RNFS.writeFile(path1, JSON.stringify(docSnap1.docs[0].data()), 'utf8')
            
            navigation.navigate('StackNavigation');
        }
        catch(e:any){
            Alert.alert("Invalid email or password !");
        }
    }

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('#FBFCF8');
            StatusBar.setBarStyle('dark-content');
        }, [])
    );

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Image style={[styles.Logo,inp4width==1?{width: Dimensions.get('window').width / 2, height: Dimensions.get('window').width / 2}:{width: Dimensions.get('window').width / 4, height: Dimensions.get('window').width / 4}]} source={require('../assets/Logo_dark.png')} />
            {loginmode?<Text style={styles.Logotxt}>Login</Text>:
            <Text style={styles.Logotxt}>Create account</Text>}
            <View style={styles.btnspace}>

                {!emailclick && <TouchableOpacity style={styles.btns} onPress={() => setemailclick(true)}>
                    <Text style={styles.btntxt}>Continue with e-mail </Text>
                    <Image style={styles.Logoimg} source={require('../assets/email.png')} />
                </TouchableOpacity>}

                {emailclick && <>
                    {!loginmode&&<TextInput
                        placeholder='Enter your name'
                        placeholderTextColor={'rgb(25,42,86)'}
                        cursorColor={'rgb(25,42,86)'}
                        style={[styles.input, { borderWidth: inp1width }]}
                        onFocus={() => { setinp1width(2) }}
                        onEndEditing={() => { setinp1width(1) }}
                        value={username}
                        onChangeText={(text) => { setusername(text) }}
                    />}
                    <TextInput
                        placeholder='Enter email'
                        placeholderTextColor={'rgb(25,42,86)'}
                        cursorColor={'rgb(25,42,86)'}
                        inputMode='email'
                        style={[styles.input, { borderWidth: inp2width }]}
                        onFocus={() => { setinp2width(2) }}
                        onEndEditing={() => { setinp2width(1) }}
                        value={email}
                        onChangeText={(text) => { setemail(text) }}
                    />
                    <TextInput
                        placeholder='Enter password'
                        placeholderTextColor={'rgb(25,42,86)'}
                        cursorColor={'rgb(25,42,86)'}
                        secureTextEntry={true}
                        style={[styles.input, { borderWidth: inp3width }]}
                        onFocus={() => { setinp3width(2) }}
                        onEndEditing={() => { setinp3width(1) }}
                        value={password}
                        onChangeText={(text) => { setpassword(text) }}
                    />
                    {!loginmode&&<TextInput
                        placeholder='Confirm password'
                        placeholderTextColor={'rgb(25,42,86)'}
                        cursorColor={'rgb(25,42,86)'}
                        secureTextEntry={true}
                        style={[styles.input, { borderWidth: inp4width }]}
                        onFocus={() => { setinp4width(2) }}
                        onEndEditing={() => { setinp4width(1) }}
                        value={confirmpassword}
                        onChangeText={(text) => { setconfirmpassword(text) }}
                    />}

                    <TouchableOpacity style={[styles.btns, { justifyContent: 'center', backgroundColor: 'rgba(165, 190, 252, 0.197)', }]} onPress={()=>loginmode?authenticate():createAccount()}>
                        {loginmode?<Text style={[styles.btntxt, { fontWeight: 'bold' }]}>Login</Text>:
                        <Text style={[styles.btntxt, { fontWeight: 'bold' }]}>Create account</Text>}
                    </TouchableOpacity></>}

                <TouchableOpacity style={styles.btns}>
                    <Text style={styles.btntxt}>Continue with Google </Text>
                    <Image style={styles.Logoimg} source={require('../assets/google.png')} />
                </TouchableOpacity>

            </View>
            <View style={styles.redirect}>
                {loginmode?<Text style={styles.btntxt}>Don't have an account? </Text>:
                <Text style={styles.btntxt}>Already have an account? </Text>}
                <TouchableOpacity onPress={() => {setloginmode(!loginmode)}}>
                    {loginmode?<Text style={styles.redirectlink}>Create now</Text>:
                    <Text style={styles.redirectlink}>Login</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    input: {
        color: 'rgb(25,42,86)',
        alignItems: 'center',
        flexDirection: 'row',
        width: '60%',
        height: 35,
        borderRadius: 8,
        borderColor: 'rgb(25,42,86)',
        fontSize: 15,
        fontFamily: 'Inter_24pt-Regular',
        paddingVertical: 4
    },
    Logoimg: {
        position: 'absolute',
        right: 10,
        height: 25,
        width: 25,
    },
    redirectlink: {
        color: 'rgb(125, 150, 255)',
        fontFamily: 'Inter_24pt-Regular',
    },
    redirect: {
        flexDirection: 'row'
    },
    btnspace: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    btntxt: {
        color: 'rgb(25,42,86)',
        fontFamily: 'Inter_24pt-Regular',
        fontWeight:'bold'
    },
    btns: {
        width: '60%',
        height: 'auto',
        alignItems: 'center',
        borderColor: 'rgb(25,42,86)',
        borderWidth: 2,
        borderRadius: 8,
        padding: 8,
        flexDirection: 'row',
        // backgroundColor:'red'
    },
    Logotxt: {
        color: 'rgb(25,42,86)',
        fontFamily: 'Inter_24pt-Regular',
        fontSize: 35,
        fontWeight: 'bold'
    },
    Logo: {
        marginTop: '20%',
    },
    container: {
        backgroundColor: '#FBFCF8',
        alignItems: 'center',
        gap: 20,
        flex: 1
    }
})