import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home'
import BarcodeGenerator from './screens/BarcodeGenerator'
import BarcodeScan from './screens/BarcodeScanner'
import ParcelDelivery from './screens/ParcelDelivery';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import OperationList from './screens/OperationList';
import ParcelCollect from './screens/ParcelCollection';
import MailbagDelivery from './screens/MailbagDelivery';
import MailbagCollection from './screens/MailbagCollection';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Welcome">
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Barcode Generator" component={BarcodeGenerator} />
        <Stack.Screen name="Barcode Scanner" component={BarcodeScan} />
        <Stack.Screen name="ParcelD" component={ParcelDelivery}/>
        <Stack.Screen name='Welcome' component={WelcomeScreen}/>
        <Stack.Screen name='SignUp' component={SignupScreen}/>
        <Stack.Screen name='Operation' component={OperationList}/>
        <Stack.Screen name='ParcelC' component={ParcelCollect}/>
        <Stack.Screen name='MailbagD' component={MailbagDelivery}/>
        <Stack.Screen name='MailbagC' component={MailbagCollection}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;