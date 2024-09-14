import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './components/WelcomeScreen';
import VideoList from './components/VideoList';
import VideoPreview from './components/VideoPreview';

export type StackParamList = {
  WelcomeScreen: undefined;
  VideoList:{
    metadata:any[]|string[],
    headertitle: string
  };
  VideoPreview:{
    item:string|any
  };
}

const stack = createStackNavigator<StackParamList>();


const App = () => {

  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName='WelcomeScreen'>
        <stack.Screen
          name='WelcomeScreen'
          component={WelcomeScreen}
          options={{
            headerShown:false,
          }}
        />
        <stack.Screen
          name='VideoList'
          component={VideoList}
          options={({route})=>({
            title: route.params.headertitle,
            headerStyle:{'backgroundColor':'#FBFCF8'},
          })}
        />
        <stack.Screen
          name='VideoPreview'
          component={VideoPreview}
          options={{
            title: 'Video Preview',
            headerStyle:{'backgroundColor':'#FBFCF8'},
          }}
        />
      </stack.Navigator>
    </NavigationContainer>

  )
}

export default App