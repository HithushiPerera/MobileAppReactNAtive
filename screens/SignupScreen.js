import { Image, StyleSheet,Text,TouchableOpacity,View, TextInput, Alert, ActivityIndicator } from "react-native";
import React, {useState, useEffect} from "react";
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
        name:'TrackingDB',
        location: 'default',
    },
    () => { },
    (error) => {console.log(error)}
);

const SignupScreen = ({navigation,route}) => {
    const {androidId} = route.params;
    const [courier, setCourier] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        createTable();
        getData();
    },[]);

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF EXISTS "
                + "Register "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Device TEXT, Courier TEXT, Token TEXT);"
            )
        })
    }

    const getData = () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT Device, Courier FROM Register",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            navigation.navigate('Welcome');
                        }
                    }
                )
            })
        } catch (error) {
            console.log(error);
        }
    }

    const onPressHandler = async () => {
        if(courier.length == 0) {
            Alert.alert('Warning', 'The nic field is empty!',[
                {text: 'Ok', onPress: ()=> console.warn('Ok Pressed!')}
            ])
        } else {
            try{
                setLoading(true);
                setSubmitted(!submitted);
                await db.transaction(async(tx) => {
                    await tx.executeSql(
                        "INSERT INTO Register (Device, Courier) VALUES (?,?)",
                        [androidId,courier]
                    );
                })
                fetch("http://220.247.207.187/Authentication/NewMobile",{
                    method: "POST",
                    headers:{
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        androidId: androidId,
                        courierId: courier,
                    }),
                })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error('Invalid response status: ' + response.status);
                    }
                })
                .then((responseData) => {
                    console.log(responseData);
                    navigation.navigate('Welcome');
                })
                .catch((error) => {
                    console.error('Error processing response: ', error.message);
                })
                .finally(() => {
                    setLoading(false); // Set loading back to false when authentication is complete
                });
            } catch(error) {
                console.log(error);
            }
        }
    }

    return(
        <View style={styles.body}>
            <Text style={styles.text1}>Unauthorized Access</Text>
            <Image 
                style={styles.logo}
                source={require("../img/authorize.png")}/>
            <Text style={styles.text}>Your login failed.</Text>
            <Text style={styles.text}>Please enter the NIC to get access.</Text>
            <Text style={styles.text3}>NIC Number</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter your NIC number'
                placeholderTextColor={'#3c444c'}
                
                onChangeText={(value) => setCourier(value)}
            />
            {/* <Text style={styles.text2}>{courier}</Text>
            <Text>{ androidId }</Text> */}
            {loading && <ActivityIndicator size="large" color="#f96163"/>}
            <TouchableOpacity style={styles.button}
                onPress={onPressHandler}>
                <Text style={styles.text2}>Register</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    body:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    logo:{
        resizeMode: 'stretch',
        height: 300,
        width: 350,
    },
    text:{
        color:'#f96163',
        fontSize:22,
        fontWeight:'bold',
    },
    text3:{
        color:'#000',
        fontSize:22,
        fontWeight:'bold',
        marginTop:20,
    },
    text1:{
        fontSize:36,
        fontWeight:'bold',
        color:'#3c444c',
    },
    button:{
        backgroundColor: "#f96163",
        borderRadius: 18,
        paddingVertical: 18,
        width: "80%",
        alignItems: "center",
    },
    text2:{
        fontSize: 18, 
        color: "#fff", 
        fontWeight: "700",
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#f96163',
        borderRadius: 18,
        textAlign: 'center',
        fontSize: 20,
        marginBottom:30,
        color:'#3c444c'
    },
});