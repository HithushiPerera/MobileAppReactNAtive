import {  Animated, Easing, Image, SafeAreaView, ScrollView, StyleSheet,Text,View, Pressable, TextInput, PermissionsAndroid, ActivityIndicator, Alert } from "react-native";
import React, {useEffect, useState}  from "react";
import {SelectList} from 'react-native-dropdown-select-list'
import BarcodeScan from "./BarcodeScanner";
import Geolocation from '@react-native-community/geolocation'
import { get_mailbag_status, get_banks } from "../api/Utility";
import {openDatabase} from 'react-native-sqlite-storage';
import CheckNetwork from "../components/CheckInternet";
import { mailbag_transaction } from "../api/Transaction";

let db = openDatabase(
    {
        name:'MobileApp.db',
        location: 'default',
    },
    () => { },
    (error) => {console.log(error)}
);

const MailbagCollection = ({navigation, route}) => {
    const [loading, setLoading] = useState(false);
    const fadeValue = new Animated.Value(1);
    const [status, setStatus] = useState([]);
    const [device,setDevice] = useState('');
    const [courier, setCourier] = useState('');
    const [select,SetSelect] = useState('');
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState('');
    const [remark, setRemark] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [dateTime, setDateTime] = useState(null);
    const [location, setLocation] = useState();
    const [currentLongitude, setCurrentLongitude] = useState();
    const [currentLatitude, setCurrentLatitude] = useState();
    const [isConnected, setIsConnected] = useState(false);

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
        get_banks().then((response) => {
            let formattedBanks = response.data.map((item) => {
               return {key: item.bankCode, value: item.bankName}
            })
            setBanks(formattedBanks);
        });
        get_mailbag_status().then((response) => {
            let mailbagStatus = response.data.map((item) => ({
                key: item.statusCode, 
                value: item.statusDescription
            }));
            const desiredStatusCodes = ["MC", "UCM"];

            mailbagStatus = mailbagStatus.filter((status) => desiredStatusCodes.includes(status.key));
            setStatus(mailbagStatus);
        });
    }, [loading]);

    const getData = () => {
        db.transaction(tx => {
          tx.executeSql("SELECT * FROM tblMailbagT where CollectionOrDelivery = 'C'", [], (tx, results) => {
            var records = [];
            for (let i = 0; i < results.rows.length; ++i) {
                records.push({
                    id: 0,
                    trackingNo: results.rows.item(i).TrackingNo,
                    status: results.rows.item(i).Status,
                    date: results.rows.item(i).Date,
                    longitude: results.rows.item(i).Longitude,
                    latitude: results.rows.item(i).Latitude,
                    remark: results.rows.item(i).Remark,
                    rowVersion: 0,
                    collectionOrDelivery: results.rows.item(i).CollectionOrDelivery,
                    androidId: results.rows.item(i).AndroidId,
                    courierId: results.rows.item(i).CourierId,
                    collectionPointName: results.rows.item(i).CollectionPointName,
                });
            }
            console.log(records);
            mailbag_transaction(records)
            .then(result => {
                if (result.status == 200) {
                    navigation.navigate('Operation');
                } else {
                    console.error('Error: Transaction Failed', result.status);
                }
            })
            .catch(err => {
                console.error('Error: Mailbag Transaction ', err);
            })
            .finally(() => {
                setLoading(false);
            })
          });
        });
    };

    const clearData = () => {
        setDate(null);
        setTime(null);
        setRemark(null);
        setCurrentLatitude(null);
        setCurrentLongitude(null);
        selectedBank(null)
        SetSelect(null);
        setDateTime(null);
    }

    const getDeviceId = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT name, courier, token FROM tblUser', [], (tx, results) => {
              var temp = results.rows.length;
                if (temp > 0) {
                    var Device = results.rows.item(0).name;
                    var Token = results.rows.item(0).token;
                    var Courier = results.rows.item(0).courier;
                    console.log(results.rows.item(0));
                    setDevice(Device);
                    setCourier(Courier);
                }
            });
        });
    }

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
        let dateTime = new Date().toISOString();
        setTime(time);
        setDate(date);
        setDateTime(dateTime);
        getCurrentLocation();
        getDeviceId();
        setTimeout(() => {
            navigation.navigate("Barcode Scanner",{
                sourceScreen: 'MailbagC',
            },
            setLoading(false));
        }, 200);
    }

    const onSubmit = async () => {
        try{
            setLoading(true);
            await db.transaction(async(tx) => {
                await tx.executeSql(
                    "INSERT INTO tblMailbagT (TrackingNo, Status, Date, Longitude, Latitude, Remark, CollectionOrDelivery, CollectionPointName, AndroidId, CourierId) VALUES (?,?,?,?,?,?,?,?,?,?)",
                    [scannedData.toString(),select,dateTime,currentLongitude,currentLatitude,remark,'C',selectedBank,device,courier],
                    (tx, results) => {
                        //console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            Alert.alert(
                                'Success',
                                'Data Added Successfully',
                                [
                                  {
                                    text: 'Ok',
                                    onPress: () => console.warn('Ok Pressed!'),
                                  },
                                ],
                                {cancelable: false},
                            );
                            clearData();
                        } else alert('Failed');
                    },
                    error => {
                        console.log(error);
                    },
                );
            })
            isConnected ? (
                getData()
            ) : null
        } catch(error) {
            console.log(error);
        }
    }

    return(
        <SafeAreaView style = {{flex:1}}>
            <View style={styles.body}>
            <Animated.View style={[styles.container,{opacity:fadeValue}]}>
            <View style={styles.imgView}>   
                <Image 
                style={styles.logo}
                source={require("../img/logo.png")}/>
            </View>
            <View style={{  alignItems:'center' , marginBottom:10}}>
				<Text style={styles.text}> Mailbag Collection</Text>
			</View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.titleText}>TrackingNo</Text>
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
                        save="key"
                        boxStyles={{borderRadius:16, padding:12,backgroundColor:'#fff',borderColor:'#fff',marginBottom:5,}} //override default styles
                        inputStyles={{  fontWeight: "600",textAlign:'center',fontSize:16,color:'#000'}}
                        dropdownStyles={{borderColor:'#fff', backgroundColor:'#fff'}}
                        dropdownTextStyles={{fontWeight: "600",textAlign:'center',color:'#000'}}
                        defaultOption={{ key:'MC',value:'Mailbag Collected' }}
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
                        setSelected={(val) => setSelectedBank(val)} 
                        data={banks} 
                        save="key"
                        boxStyles={{borderRadius:16, padding:12,backgroundColor:'#fff',borderColor:'#fff',marginBottom:5,}} //override default styles
                        inputStyles={{  fontWeight: "600",textAlign:'center',fontSize:16,color:'#000'}}
                        dropdownStyles={{borderColor:'#fff', backgroundColor:'#fff'}}
                        dropdownTextStyles={{fontWeight: "600",textAlign:'center',color:'#000'}}
                        //onSelect={() => Alert(selectedBank)}
                        defaultOption={{ key:'BOC',value:'BANK OF CEYLON' }}
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
                    <Pressable style={styles.btn2} onPress={onSubmit}>
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
            </Animated.View>
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size='large' color='#f96163'/>
                </View>
            )}
            </View>
             <CheckNetwork isConnected={isConnected}
                setIsConnected={setIsConnected} />
        </SafeAreaView>
    );
};

export default MailbagCollection;

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
        alignItems: "center",
        justifyContent: "center",
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