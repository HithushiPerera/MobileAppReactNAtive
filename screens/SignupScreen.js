import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { openDatabase } from 'react-native-sqlite-storage';
import { user_signup } from "../api/Authenticate";
import CheckNetwork from "../components/CheckInternet";

let db = openDatabase(
    {
        name: 'MobileApp.db',
        location: 'default',
    },
    () => { },
    (error) => { console.log(error) }
);

const SignupScreen = ({ navigation, route }) => {
    const { androidId } = route.params;
    const [courier, setCourier] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        createTable();
    }, []);

    const createTable = () => {
        db.transaction(txn => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='tblUser'",
                [],
                (tx, res) => {
                    //console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS tblUser', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS tblUser(user_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), courier VARCHAR(20), token TEXT)',
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

    const onPressHandler = async () => {
        if (courier.length == 0) {
            Alert.alert('Warning', 'The nic field is empty!', [
                { text: 'Ok', onPress: () => console.warn('Ok Pressed!') }
            ])
        } else {
            try {
                setLoading(true);
                setSubmitted(!submitted);
                await db.transaction(async (tx) => {
                    await tx.executeSql(
                        "INSERT INTO tblUser (name, courier) VALUES (?,?)",
                        [androidId, courier],
                        (tx, results) => {
                            //console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                                Alert.alert(
                                    'Success',
                                    'You are Registered Successfully',
                                    [
                                        {
                                            text: 'Ok',
                                            onPress: () => console.warn('Ok Pressed!'),
                                        },
                                    ],
                                    { cancelable: false },
                                );
                            } else alert('Registration Failed');
                        },
                        error => {
                            console.log(error);
                        },
                    );
                })
                {
                    isConnected ? (
                        user_signup({
                            androidId: androidId,
                            courierId: courier,
                        })
                            .then(result => {
                                if (result.status == 200) {
                                    navigation.navigate('Welcome');
                                } else {
                                    console.error('Error: Register Failed', result.statusText);
                                }
                            })
                            .catch(err => {
                                console.error('Error: Register ', err);
                            })
                            .finally(() => {
                                setLoading(false);
                            })
                    ) : (
                        <CheckNetwork isConnected={isConnected}
                            setIsConnected={setIsConnected} />
                    )
                }

            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <View style={styles.body}>
            <View style={styles.body}>
                <Text style={styles.text1}>Unauthorized Access</Text>
                <Image
                    style={styles.logo}
                    source={require("../img/authorize.png")} />
                <Text style={styles.text}>Your login failed.</Text>
                <Text style={styles.text}>Please enter the NIC to get access.</Text>
                <Text style={styles.text3}>NIC Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your NIC number'
                    placeholderTextColor={'#3c444c'}
                    onChangeText={(value) => setCourier(value)}
                />
                {loading && <ActivityIndicator size="large" color="#f96163" />}
                <TouchableOpacity style={styles.button}
                    onPress={onPressHandler}>
                    <Text style={styles.text2}>Register</Text>
                </TouchableOpacity>
            </View>

            <CheckNetwork isConnected={isConnected}
                setIsConnected={setIsConnected} />


        </View>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        resizeMode: 'stretch',
        height: 300,
        width: 350,
    },
    text: {
        color: '#f96163',
        fontSize: 22,
        fontWeight: 'bold',
    },
    text3: {
        color: '#000',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
    },
    text1: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#3c444c',
    },
    button: {
        backgroundColor: "#f96163",
        borderRadius: 18,
        paddingVertical: 18,
        width: "80%",
        alignItems: "center",
    },
    text2: {
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
        marginBottom: 30,
        color: '#3c444c'
    },
});