import { Animated, Easing, Image, SafeAreaView, ScrollView, StyleSheet,Text,View, Pressable, TextInput, PermissionsAndroid, ActivityIndicator } from "react-native";
import React, {useEffect, useState}  from "react";
import {SelectList} from 'react-native-dropdown-select-list'
import BarcodeScan from "./BarcodeScanner";
import Geolocation from '@react-native-community/geolocation'
import { get_banks } from "../api/Utility";
import { get_mailbag_status } from "../api/Utility";

const Card = ({navigation, route}) => {
    const [loading, setLoading] = useState(false);
    const fadeValue = new Animated.Value(1);
    const [select,SetSelect] = useState('');
    const [remark, setRemark] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [location, setLocation] = useState('');
    const [currentLongitude, setCurrentLongitude] = useState('...');
    const [currentLatitude, setCurrentLatitude] = useState('...');
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
            if (granted === 'granted') {
              return true;
            } else {
              return false;
            }
        } catch (err) {
            return false;
        }
    }
    useEffect(() => {
        if (loading) {
            Animated.timing(fadeValue, {
                toValue: 0.5,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(fadeValue, {
                toValue: 1,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }
    }, [loading]);

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
          if (res) {
            Geolocation.getCurrentPosition(
              position => {
                console.log(position);
                setLocation(position);
                const latitude = position.coords.latitude;
                const logitude = position.coords.longitude;
                setCurrentLatitude(latitude);
                setCurrentLongitude(logitude);
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
      };

    const onPressScan = () => {
        setLoading(true)
        let date = getCurrentDate();   
        let time = getCurrentTime();
        setTime(time);
        setDate(date);
        getCurrentLocation();
        setTimeout(() => {
            navigation.navigate("Barcode Scanner",{
                sourceScreen: 'MailbagD',
            },
            setLoading(false));
        }, 200);
    }
    return(
        <SafeAreaView style={styles.body}>
            <Animated.View style={[styles.container,{opacity:fadeValue}]}>
            <View style={styles.imgView}>   
                <Image 
                style={styles.logo}
                source={require("../img/logo.png")}/>
            </View>
            <View style={{  alignItems:'center' , marginBottom:10}}>
				<Text style={styles.text}> Mailbag Delivery</Text>
			</View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.titleText}>Barcode</Text>
                <View style={styles.view2}>
                    <View style={styles.btn1}>
                        <View style={styles.view3}>
                            {scannedData.map((barcode, index) => (
                            <Text key={index} style={styles.text2}>{barcode}</Text>
                            ))}
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
                <Text style={styles.titleText}>Select Bank</Text>
                    <SelectList 
                        setSelected={(val) => SetSelect(val)} 
                        //data={status} 
                        save="value"
                        boxStyles={{borderRadius:16, padding:12,backgroundColor:'#fff',borderColor:'#fff',marginBottom:5,}} //override default styles
                        inputStyles={{  fontWeight: "600",textAlign:'center',fontSize:16,color:'#000'}}
                        dropdownStyles={{borderColor:'#fff', backgroundColor:'#fff'}}
                        dropdownTextStyles={{fontWeight: "600",textAlign:'center',color:'#000'}}
                        defaultOption={{ key:'BOC',value:'Bank Of Ceylon' }}
                    /> 
                <Text style={styles.titleText}>Remark</Text>
                <View style={styles.view2}>
                        <TextInput style={styles.input} 
                            placeholder="Enter comment"
                            onChangeText={(value) => setRemark(value)} 
                            placeholderTextColor={'#3c444c'}
                            color={'#000'}/>
                </View>
                <View style={{marginBottom:30}}></View>
                <View style={styles.view2}>
                    <Pressable style={styles.btn2}>
                        <View style={styles.view3}>
                            <Text style={styles.text1}>
                                SUBMIT : {currentLatitude}
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.view2}> 
                    <Pressable style={styles.btn3}>
                        <View style={styles.view3}>
                            <Text style={styles.text1}>
                                CANCEL : {currentLongitude}
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View style={{marginBottom:10}}></View>
            </ScrollView>
            </Animated.View>
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size='large' color='#f96163'/>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Card;

const styles = StyleSheet.create({
    body:{
        flex:1,
        marginHorizontal:16,
    },
    container: {
        flex: 1,
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
        flex: 1,
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
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -25, // Adjust based on loader size
        marginTop: -25, // Adjust based on loader size
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});