import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './components/WelcomeScreen';
import VideoList from './components/VideoList';
import VideoPreview from './components/VideoPreview';
import Settings from './components/Settings';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import Courses from './components/Courses';
import Authentication from './components/Authentication';

export type StackParamList = {
  WelcomeScreen: undefined;
  VideoPreview: {
    item: string | any
  };
}

export type TabParamList = {
  StackNavigation: undefined;
  Authentication: undefined|any;
  CreateAccount: undefined|any;
  VideoList: {
    metadata: any[] | string[]
  };
  Settings: undefined;
  Courses: {
    playlistId: string,
    channelTitle: string,
    title: string,
    description: string,
    thumbnails: string
  }|undefined;
}

const stack = createStackNavigator<StackParamList>();
const tab = createBottomTabNavigator<TabParamList>();

const TabBarBtn = (props:any) => {
  
  const {onPress,accessibilityState,screens} = props;
  const focused = accessibilityState.selected;

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={1}
      style={styles.TabBarbtn}>
      {screens=="home"?<Image style={{ width: 25, height: 25 }} source={focused?require('./assets/home.png'):require('./assets/home_inactive.png')} />:
        screens == "videos"?<Image style={{ width: 28, height: 28 }} source={focused?require('./assets/videos.png'):require('./assets/videos_inactive.png')} />:
        screens == "courses"?<Image style={{ width: 30, height: 30 }} source={focused?require('./assets/course.png'):require('./assets/course_inactive.png')} />:
        <Image style={{ width: 28, height: 28 }} source={focused?require('./assets/setting.png'):require('./assets/setting_inactive.png')} />
      }
    </TouchableOpacity>
  )
}


const StackNavigation = () => {
  return (
    <stack.Navigator initialRouteName='WelcomeScreen'> 
      <stack.Screen
        name='WelcomeScreen'
        component={WelcomeScreen}
        options={{
          headerShown:false
        }}
      />
      <stack.Screen
        name='VideoPreview'
        component={VideoPreview}
        options={{
          headerShown:false
        }}
      />
    </stack.Navigator>
  )
}

const App = () => {

  const screens = ["home","videos","courses","Settings"]

  return (
    <NavigationContainer>

      <tab.Navigator initialRouteName={"StackNavigation"} backBehavior="history">
        <tab.Screen
          name="StackNavigation"
          component={StackNavigation}
          options={()=>({
            headerShown: false,
            tabBarHideOnKeyboard:true,
            tabBarButton: (props) => (
              <TabBarBtn {...props} screens={screens[0]}/>
            ),
          })}
        />
        <tab.Screen
          name="Authentication"
          component={Authentication}
          options={{
            headerShown:false,
            tabBarStyle:{
              display:'none'
            },
            tabBarButton: ()=> null
          }}
        />
        <tab.Screen
          name="VideoList"
          component={VideoList}
          options={{
            headerShown:false,
            tabBarStyle:{
              backgroundColor:'#FBFCF8'
            },
            tabBarButton: (props) => (
              <TabBarBtn {...props} screens={screens[1]}/>
            ),
          }}
        />
        <tab.Screen
          name="Courses"
          component={Courses}
          options={{
            headerShown:false,
            tabBarStyle:{
              backgroundColor:'#FBFCF8',
            },
            tabBarHideOnKeyboard:true,
            tabBarButton: (props) => (
              <TabBarBtn {...props} screens={screens[2]}/>
            ),
          }}
        />
        <tab.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown:false,
            tabBarStyle:{
              backgroundColor:'#FBFCF8'
            },
            tabBarButton: (props) => (
              <TabBarBtn {...props} screens={screens[3]}/>
            ),
          }}
        />
      </tab.Navigator>
    </NavigationContainer>


  )
}

export default App


const styles = StyleSheet.create({
  TabBarbtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:"column"
  }
})