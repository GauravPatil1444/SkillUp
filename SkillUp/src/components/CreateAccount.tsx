import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar, TextInput } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabParamList } from '../App'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

type TabProps = NativeStackScreenProps<TabParamList, 'CreateAccount'>

const CreateAccount = ({navigation}:TabProps) => {

    const [emailclick, setemailclick] = useState(false)
    const [inp1width, setinp1width] = useState(1)
    const [inp2width, setinp2width] = useState(1)
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const auth = getAuth();

    const authenticate = () => {
        console.log(200);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                // navigation.navigate('StackNavigation');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("ErrorCode : ", errorCode);
                console.log("ErrorMessage : ", errorMessage);
            });
    }

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('#FBFCF8');
            StatusBar.setBarStyle('dark-content');
        }, [])
    );

  return (
    <View style={styles.container}>
            <Image style={styles.Logo} source={require('../assets/Logo_dark.png')} />
            <Text style={styles.Logotxt}>Create account</Text>
            <View style={styles.btnspace}>

                {!emailclick && <TouchableOpacity style={styles.btns} onPress={() => setemailclick(true)}>
                    <Text style={styles.btntxt}>Continue with e-mail </Text>
                    <Image style={styles.Logoimg} source={require('../assets/email.png')} />
                </TouchableOpacity>}

                {emailclick && <>
                    <TextInput
                        placeholder='Enter email'
                        placeholderTextColor={'rgb(25,42,86)'}
                        cursorColor={'rgb(25,42,86)'}
                        inputMode='email'
                        style={[styles.input, { borderWidth: inp1width }]}
                        onFocus={() => { setinp1width(2) }}
                        onEndEditing={() => { setinp1width(1) }}
                        onChange={() => { setemail(email) }}
                    />
                    <TextInput
                        placeholder='Enter password'
                        placeholderTextColor={'rgb(25,42,86)'}
                        cursorColor={'rgb(25,42,86)'}
                        style={[styles.input, { borderWidth: inp2width }]}
                        onFocus={() => { setinp2width(2) }}
                        onEndEditing={() => { setinp2width(1) }}
                        onChange={() => { setpassword(password) }}
                    />
                    <TouchableOpacity style={[styles.btns, { justifyContent: 'center', backgroundColor: 'rgba(165, 190, 252, 0.197)', }]} onPress={()=>{authenticate}}>
                        <Text style={[styles.btntxt, { fontWeight: 'bold' }]}>Create account</Text>
                    </TouchableOpacity></>}

                <TouchableOpacity style={styles.btns}>
                    <Text style={styles.btntxt}>Continue with Google </Text>
                    <Image style={styles.Logoimg} source={require('../assets/google.png')} />
                </TouchableOpacity>

            </View>
            <View style={styles.redirect}>
                <Text style={styles.btntxt}>Already have an account? </Text>
                <TouchableOpacity onPress={()=>{navigation.navigate('Login')}}>
                    <Text style={styles.redirectlink}>Login</Text>
                </TouchableOpacity>
            </View>
    </View>
  )
}

export default CreateAccount

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
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').width / 2
    },
    container: {
        backgroundColor: '#FBFCF8',
        alignItems: 'center',
        gap: 20,
        flex: 1
    }
})