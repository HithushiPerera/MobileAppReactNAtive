import { Animated, Easing, Image, SafeAreaView, ScrollView, StyleSheet,Text,View, Pressable, ActivityIndicator } from "react-native";
import React,{useState, useEffect} from "react";
import Header from "../components/Header";
import {openDatabase} from 'react-native-sqlite-storage';

let db = openDatabase(
    {
        name:'MobileApp.db',
        location: 'default',
    },
    () => { },
    (error) => {console.log(error)}
);


const OperationList = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const fadeValue = new Animated.Value(1);
    const [isConnected, setIsConnected] = useState(false);

    const handleNavigation = (screen) => {
        setLoading(true);
        // Simulate delay for demonstration purposes
        setTimeout(() => {
            navigation.navigate(screen);
            setLoading(false);
        }, 200);
    };

    useEffect(() => {
        createTable();
        createTableParcel();
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

    const createTable = () => {
        db.transaction(txn => {
            txn.executeSql(
              "SELECT name FROM sqlite_master WHERE type='table' AND name='tblMailbagT'",
              [],
              (tx, res) => {
                //console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                  txn.executeSql('DROP TABLE IF EXISTS tblMailbagT', []);
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS tblMailbagT(id INTEGER PRIMARY KEY AUTOINCREMENT, TrackingNo VARCHAR(10), Status VARCHAR(5), Date TEXT, Longitude float, Latitude float, Remark VARCHAR(100), CollectionOrDelivery VARCHAR(2), CollectionPointName VARCHAR(5), AndroidId VARCHAR(20), CourierId VARCHAR(20))',
                    [],
                  );
                }
              },
              error => {
                console.log(error);
              },
            );
        });
    }

    const createTableParcel = () => {
        db.transaction(txn => {
            txn.executeSql(
              "SELECT name FROM sqlite_master WHERE type='table' AND name='tblParcelT'",
              [],
              (tx, res) => {
                //console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                  txn.executeSql('DROP TABLE IF EXISTS tblParcelT', []);
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS tblParcelT(id INTEGER PRIMARY KEY AUTOINCREMENT, TrackingNo VARCHAR(10), Status VARCHAR(5), Date TEXT, Longitude float, Latitude float, Remark VARCHAR(100), CollectionOrDelivery VARCHAR(2), NotDeliveredStatus VARCHAR(5), AndroidId VARCHAR(20), CourierId VARCHAR(20))',
                    [],
                  );
                }
              },
              error => {
                console.log(error);
              },
            );
        });
    }

    return(
        <SafeAreaView style={styles.body}>
            <Header headerText={"bars"} headerIcon={"bell-o"}/>
            <Animated.View style={[styles.container,{opacity:fadeValue}]}>
            <View style={styles.imgView}>   
                <Image 
                style={styles.logo}
                source={require("../img/logo.png")}/>
            </View>
            <View style={{ flex: 1, alignItems:'center' }}>
				<Text style={styles.text}>Delivery Operations</Text>
			</View>
            <ScrollView>
                <View style={styles.view2}>
                    <Pressable style={styles.btn1}  onPress={() => handleNavigation("MailbagD")}>
                        <View style={styles.view3}>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Mailbag
                            </Text>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Delivery
                            </Text>
                        </View>
                    </Pressable>
                    <Pressable style={styles.btn1} onPress={() => handleNavigation("MailbagC")}>
                        <View style={styles.view3}>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Mailbag
                            </Text>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Collection
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.view2}>
                    <Pressable style={styles.btn1} onPress={() => handleNavigation("MailbagDBulk")}>
                        <View style={styles.view3}>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Mailbag Bulk
                            </Text>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Delivery
                            </Text>
                        </View>
                    </Pressable>
                    <Pressable style={styles.btn1} onPress={() => handleNavigation("MailbagCBulk")}>
                        <View style={styles.view3}>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Mailbag Bulk
                            </Text>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Collection
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.view2}>
                    <Pressable style={styles.btn4}>
                        <View style={styles.view4}>
                            <Text style={{fontWeight:"600", color:"#fff", fontSize:18}}>
                                Mailbag Report
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.view2}>
                    <Pressable style={styles.btn2} onPress={() => handleNavigation("ParcelD")}>
                        <View style={styles.view3}>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Parcel
                            </Text>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Delivery
                            </Text>
                        </View>
                    </Pressable>
                    <Pressable style={styles.btn2} onPress={() => handleNavigation("ParcelC")}>
                        <View style={styles.view3}>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Parcel
                            </Text>
                            <Text style={{ fontWeight: "600", color:"#fff", fontSize:18 }}>
                                Collection
                            </Text>
                        </View>
                    </Pressable>
                </View>
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

export default OperationList;

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
        marginBottom: 20,
        gap: 20,
    },
    view3:{
        width: 130,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    view4:{
        width: 130,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    btn1:{
        backgroundColor: "#A6D3F2",
        padding: 15,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    btn2:{
        backgroundColor: "#F7D78C",
        padding: 15,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    btn3:{
        backgroundColor: "#AFC3A8",
        padding: 15,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    btn4:{
        backgroundColor: "#FF5844",
        padding: 15,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -25, // Adjust based on loader size
        marginTop: -25, // Adjust based on loader size
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});