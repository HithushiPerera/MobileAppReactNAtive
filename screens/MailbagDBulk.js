import { Image, SafeAreaView, ScrollView, StyleSheet,Text,View, Pressable, TextInput, PermissionsAndroid } from "react-native";
import React, {useEffect, useState}  from "react";
import {SelectList} from 'react-native-dropdown-select-list'
import BarcodeScan from "./BarcodeScanner";
import Geolocation from '@react-native-community/geolocation'

const MailbagDBulk = ({navigation, route}) => {
    const [select,SetSelect] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [location, setLocation] = useState(false);
    const status = [
        {key:'MD',value:'Mailbag Delivered'},
        {key:'UDM',value:'Unable to Deliver Mailbag'},
    ];
    const { scannedData } = route.params || { scannedData: [] };

    const requestLocationPermission = async () => {
        try{
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Geolocation Permission',
                    message: 'Can we access your location?',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            console.log('granted', granted);
            if (granted === 'granted') {
              console.log('You can use Geolocation');
              return true;
            } else {
              console.log('You cannot use Geolocation');
              return false;
            }
        } catch (err) {
            return false;
        }
    }

    useEffect(() => {
      
    },[]);

    const getCurrentTime = () => {
        let today = new Date();
        let hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
        let minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
        let seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
        return  hours + ':' + minutes + ':' + seconds;
    }

    const getCurrentDate = () => {
        let today = new Date();
        return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    const getCurrentLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
          console.log('res is:', res);
          if (res) {
            Geolocation.getCurrentPosition(
              position => {
                console.log(position);
                setLocation(position);
              },
              error => {
                // See error code charts below.
                console.log(error.code, error.message);
                setLocation(false);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
          }
        });
        console.log(location);
      };

    const onPressScan = () => {
        let date = getCurrentDate();   
        let time = getCurrentTime();
        setTime(time);
        setDate(date);
        navigation.navigate("Barcode Scanner",{
            sourceScreen: 'MailbagDBulk',
        });
        getCurrentLocation();
    }
    return(
        <SafeAreaView style={styles.body}>
            <View style={styles.imgView}>   
                <Image 
                style={styles.logo}
                source={require("../img/logo.png")}/>
            </View>
            <View style={{  alignItems:'center' , marginBottom:10}}>
				<Text style={styles.text}> Mailbag Delivery Bulk</Text>
			</View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.titleText}>Barcode</Text>
                <View style={styles.view2}>
                    <View style={styles.btn1}>
                        <View style={styles.view3}>
                            {scannedData.length > 0 &&(
                            <Text style={styles.text2}>{scannedData[scannedData.length - 1]}</Text>
                            )}
                        </View>
                    </View>
                    <Pressable style={styles.btn2} onPress={onPressScan }>
                        <View style={styles.view3}>
                            <Text style={{ fontWeight: "600", color:'#fff', fontSize:16 }}>
                                Scan
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <Text style={styles.titleText}>Select Status</Text>
                
                    <SelectList 
                        setSelected={(val) => SetSelect(val)} 
                        data={status} 
                        save="value"
                        boxStyles={{borderRadius:16, padding:12,backgroundColor:'#fff',borderColor:'#fff',marginBottom:5,}} //override default styles
                        inputStyles={{  fontWeight: "600",textAlign:'center',fontSize:16,color:'#000'}}
                        dropdownStyles={{borderColor:'#fff', backgroundColor:'#fff'}}
                        dropdownTextStyles={{fontWeight: "600",textAlign:'center',color:'#000'}}
                        defaultOption={{ key:'MD',value:'Mailbag Delivered' }}
                    /> 
                   
                    
                
                <Text style={styles.titleText}>Date & Time</Text>
                <View style={styles.view2}>
                    <View style={styles.btn1}>
                        <View style={styles.view3}>
                            <Text style={styles.text2}>
                                {date}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.btn1}>
                        <View style={styles.view3}>
                            <Text style={styles.text2}>
                                {time}
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.titleText}>Scanned Data:</Text>
                
                {scannedData.map((barcode, index) => (
                    <Text key={index} style={styles.text2}>{barcode}</Text>
                ))}
                <Text style={styles.titleText}>Remark</Text>
                <View style={styles.view2}>
                        <TextInput style={styles.input} placeholder="Enter comment" >
                        </TextInput>
                </View>
                <View style={{marginBottom:30}}></View>
                <View style={styles.view2}>
                    <Pressable style={styles.btn2}>
                        <View style={styles.view3}>
                            <Text style={styles.text1}>
                                SUBMIT
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.view2}> 
                    <Pressable style={styles.btn3}>
                        <View style={styles.view3}>
                            <Text style={styles.text1}>
                                CANCEL
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View style={{marginBottom:10}}></View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MailbagDBulk;

const styles = StyleSheet.create({
    body:{
        flex:1,
        marginHorizontal:16,
    },
    imgView:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo:{
        resizeMode: 'contain',
        height: 150,
        width: 250,
    },
    text:{ 
        fontSize: 28, 
        fontWeight: "bold",
        color:'#3c444c',
    },
    view2:{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        gap: 7,
    },
    view3:{
        height: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    view4:{
        height: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    btn1:{
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    btn2:{
        backgroundColor: "#f96163",
        padding: 12,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1, 
    },
    btn3:{
        backgroundColor: "#000",
        padding: 12,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1, 
        marginTop:5,
    },
    input:{
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        textAlign:'center',
        fontWeight:'600',
        fontSize:16,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
    text1:{
        fontSize:17,
        fontWeight:'600',
        color:'#fff'
    },
    text2:{
        fontSize:16,
        fontWeight:'600',
        color:'#000',
    },
});