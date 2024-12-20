import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState, useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabParamList } from '../App'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from '../../firebaseConfig'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import EncryptedStorage4 from 'react-native-encrypted-storage'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
    webClientId: '505952169629-76425nc7a2qncr7sipr8mbuusguu2r8e.apps.googleusercontent.com',
    offlineAccess: true
});

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
    const [nameValid, setnameValid] = useState(true)
    const [passValid, setpassValid] = useState(true)
    const [show1, setshow1] = useState(true);
    const [show2, setshow2] = useState(true)
    const [loader, setloader] = useState(false)
    const RNFS = require('react-native-fs');


    const ContinueWithGoogle = async () => {
        try {
            await GoogleSignin.signOut();

            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            const signInResult: any = await GoogleSignin.signIn();
            // console.log(signInResult);

            let idToken = signInResult.data?.idToken;
            // console.log(idToken);

            if (!idToken) {
                idToken = signInResult.idToken;
            }
            if (!idToken) {
                throw new Error('No ID token found');
            }

            const uid = signInResult.data.user.id;
            const name = signInResult.data.user.name;
            const email = signInResult.data.user.email;

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            console.log(googleCredential);

            try {
                const docRef = collection(db, "users", `${uid}/UserPreferences`);
                const docSnap = await getDocs(docRef);

                const docRef1 = collection(db, "users", `${uid}/topics`);
                const docSnap1 = await getDocs(docRef1);

                // console.log(docSnap.docs[0].data());
                const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
                await RNFS.writeFile(path, JSON.stringify(docSnap.docs[0].data()), 'utf8')
                const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
                await RNFS.writeFile(path1, JSON.stringify(docSnap1.docs[0].data()), 'utf8')
            } catch (error) {
                console.log(error);
                const docRef = await addDoc(collection(db, "users", `${uid}/UserDetails`), {
                    name: name,
                    email: email,
                });
                console.log("Document written with ID: ", docRef.id);
                let user_preferences = {
                    "UserDetails": {
                        "name": name,
                        "email": email
                    },
                    "history": [],
                    "saved": [],
                    "courses": []
                }
                let topics = {
                    "topics": ["Web development", "Machine Learning", "Python", "Java"]
                }

                const docRef1 = await addDoc(collection(db, "users", `${uid}/UserPreferences`), user_preferences);
                console.log("Document written with ID: ", docRef1.id);
                const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
                await RNFS.writeFile(path, JSON.stringify(user_preferences), 'utf8')

                const docRef2 = await addDoc(collection(db, "users", `${uid}/topics`), topics);
                console.log("Document written with ID: ", docRef2.id);
                const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
                await RNFS.writeFile(path1, JSON.stringify(topics), 'utf8')

            }

            await auth().signInWithCredential(googleCredential);
            ReactNativeAsyncStorage.setItem("isLoggedIn", "true");
            EncryptedStorage4.setItem("uid", uid)
            navigation.navigate('StackNavigation')
        }
        catch (e) {
            console.log(e);
        }
    }


    const createAccount = async () => {
        setloader(true);
        if (password == confirmpassword) {
            if (password.length > 4) {
                try {
                    const response = await createUserWithEmailAndPassword(firebase_auth, email, password)
                    const user_email = response.user.email;
                    const user_id = response.user.uid
                    // console.log(user);
                    const docRef = await addDoc(collection(db, "users", `${user_id}/UserDetails`), {
                        name: username,
                        email: user_email,
                    });
                    console.log("Document written with ID: ", docRef.id);
                    let user_preferences = {
                        "UserDetails": {
                            "name": username,
                            "email": user_email
                        },
                        "history": [],
                        "saved": [],
                        "courses": []
                    }
                    let topics = {
                        "topics": ["Web development", "Machine Learning", "Python", "Java"]
                    }

                    const docRef1 = await addDoc(collection(db, "users", `${user_id}/UserPreferences`), user_preferences);
                    console.log("Document written with ID: ", docRef1.id);
                    const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
                    await RNFS.writeFile(path, JSON.stringify(user_preferences), 'utf8')

                    const docRef2 = await addDoc(collection(db, "users", `${user_id}/topics`), topics);
                    console.log("Document written with ID: ", docRef2.id);
                    const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
                    await RNFS.writeFile(path1, JSON.stringify(topics), 'utf8')

                    navigation.navigate('StackNavigation')
                }
                catch (error: any) {
                    const message = error.message;
                    Alert.alert(message);
                };
            }
            else {
                Alert.alert("Password length must be atleast 4");
                setloader(false);
            }
        }
        else {
            Alert.alert("confirm password doesn't matched !");
            setloader(false);
        }
    }
    const authenticate = async () => {
        setloader(true);
        try {
            const response = await signInWithEmailAndPassword(firebase_auth, email, password);
            // console.log(response);
            const user_id = response.user.uid;
            const docRef = collection(db, "users", `${user_id}/UserPreferences`);
            const docSnap = await getDocs(docRef);

            const docRef1 = collection(db, "users", `${user_id}/topics`);
            const docSnap1 = await getDocs(docRef1);

            // console.log(docSnap.docs[0].data());
            const path = RNFS.DocumentDirectoryPath + '/user_preferences.txt';
            await RNFS.writeFile(path, JSON.stringify(docSnap.docs[0].data()), 'utf8')
            const path1 = RNFS.DocumentDirectoryPath + '/topics.txt';
            await RNFS.writeFile(path1, JSON.stringify(docSnap1.docs[0].data()), 'utf8')

            navigation.navigate('StackNavigation');
        }
        catch (e: any) {
            Alert.alert("Invalid email or password !");
            setloader(false);
        }
    }

    const handleName = (text: string) => {
        if (text.length > 20) {
            Alert.alert("Only 20 charachters allowed");
            setnameValid(false);
        }
        else {
            setnameValid(true);
        }
    }

    const handlePassword = (text: string) => {
        if (text.length > 15) {
            Alert.alert("Password length between 4 to 15 is allowed");
            setpassValid(false);
        }
        else {
            setpassValid(true);
        }
    }


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('#FBFCF8');
            StatusBar.setBarStyle('dark-content');
            setloader(false);
        }, [])
    );

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Image style={[styles.Logo, inp4width == 1 ? { width: Dimensions.get('window').width / 2, height: Dimensions.get('window').width / 2 } : { width: Dimensions.get('window').width / 4, height: Dimensions.get('window').width / 4 }]} source={require('../assets/Logo_dark.png')} />
            {loginmode ? <Text style={styles.Logotxt}>Login</Text> :
                <Text style={styles.Logotxt}>Create account</Text>}
            <View style={styles.btnspace}>

                {!emailclick && <TouchableOpacity style={styles.btns} onPress={() => setemailclick(true)}>
                    <Text style={styles.btntxt}>Continue with e-mail </Text>
                    <Image style={styles.Logoimg} source={require('../assets/email.png')} />
                </TouchableOpacity>}

                {emailclick && <>
                    {!loginmode && <TextInput
                        placeholder='Enter your name'
                        placeholderTextColor={'rgb(25,42,86)'}
                        cursorColor={'rgb(25,42,86)'}
                        style={[styles.input, { borderWidth: inp1width }]}
                        onFocus={() => { setinp1width(2) }}
                        onEndEditing={() => { setinp1width(1) }}
                        value={username}
                        onChangeText={(text) => { setusername(text), handleName(text) }}
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
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TextInput
                            placeholder='Enter password'
                            placeholderTextColor={'rgb(25,42,86)'}
                            cursorColor={'rgb(25,42,86)'}
                            secureTextEntry={show1}
                            style={[styles.input, { borderWidth: inp3width, marginLeft: 30 }]}
                            onFocus={() => { setinp3width(2) }}
                            onEndEditing={() => { setinp3width(1) }}
                            value={password}
                            onChangeText={(text) => { setpassword(text), handlePassword(text) }}
                        />
                        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { setshow1(!show1) }}>
                            {show1 ? <Image style={styles.Img} source={require('../assets/show.png')} /> : <Image style={styles.Img} source={require('../assets/hide.png')} />}
                        </TouchableOpacity>
                    </View>
                    {!loginmode && <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TextInput
                            placeholder='Confirm password'
                            placeholderTextColor={'rgb(25,42,86)'}
                            cursorColor={'rgb(25,42,86)'}
                            secureTextEntry={show2}
                            style={[styles.input, { borderWidth: inp4width, marginLeft: 30 }]}
                            onFocus={() => { setinp4width(2) }}
                            onEndEditing={() => { setinp4width(1) }}
                            value={confirmpassword}
                            onChangeText={(text) => { setconfirmpassword(text) }}
                        />
                        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { setshow2(!show2) }}>
                            {show2 ? <Image style={styles.Img} source={require('../assets/show.png')} /> : <Image style={styles.Img} source={require('../assets/hide.png')} />}
                        </TouchableOpacity>
                    </View>}

                    <TouchableOpacity disabled={loader} style={[styles.btns, { justifyContent: 'center', backgroundColor: 'rgba(165, 190, 252, 0.197)', }]} onPress={() => { nameValid && passValid ? loginmode ? authenticate() : createAccount() : Alert.alert("Ensure your credentials are in correct format") }}>
                        {loginmode && !loader ? <Text style={[styles.btntxt, { fontWeight: 'bold' }]}>Login</Text> :
                            !loader && <Text style={[styles.btntxt, { fontWeight: 'bold' }]}>Create account</Text>}
                        {loader && <ActivityIndicator
                            animating={true}
                            color={'rgb(25,42,86)'}
                            size={'small'}
                        >
                        </ActivityIndicator>}
                    </TouchableOpacity></>}

                <TouchableOpacity style={[styles.btns]} onPress={ContinueWithGoogle}>
                    <Text style={styles.btntxt}>Continue with Google </Text>
                    <Image style={styles.Logoimg} source={require('../assets/google.png')} />
                </TouchableOpacity>

            </View>
            <View style={styles.redirect}>
                {loginmode ? <Text style={styles.btntxt}>Don't have an account? </Text> :
                    <Text style={styles.btntxt}>Already have an account? </Text>}
                <TouchableOpacity onPress={() => { setloginmode(!loginmode) }}>
                    {loginmode ? <Text style={styles.redirectlink}>Create now</Text> :
                        <Text style={styles.redirectlink}>Login</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    Img: {
        height: 20,
        width: 20,
    },
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
        fontWeight: 'bold'
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
        marginTop: '10%',
    },
    container: {
        backgroundColor: '#FBFCF8',
        alignItems: 'center',
        gap: 20,
        flex: 1
    }
})