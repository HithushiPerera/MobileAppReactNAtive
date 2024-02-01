import { Image, StyleSheet,Text,TouchableOpacity,View, ActivityIndicator } from "react-native";
import React,{useEffect,useState} from "react";
import DeviceInfo from "react-native-device-info";
import SQLite from 'react-native-sqlite-storage';
import { user_login } from "../api/Authenticate";

const db = SQLite.openDatabase(
    {
        name:'TrackingDB',
        location: 'default',
    },
    () => { },
    (error) => {console.log(error)}
);

const WelcomeScreen = ({navigation, route}) => {
    const [device,setDevice] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getDeviceId = async () => {
            try {
                const androidId = await DeviceInfo.getAndroidId();
                setDevice(androidId);
            } catch (error) {
                console.error('Error getting Android ID: ', error);
            }
        };
        getDeviceId();
    },[]);

    const saveTokenToDatabase = (token) => {
        // Update the token column in the Register table based on androidId
        db.transaction((tx) => {
          tx.executeSql('UPDATE Register SET Token = ? WHERE Device = ?', [token, androidId], (_, results) => {
            //console.log('Token updated in the Register table');
          });
        });
      };

    const goHome = () => {
        setLoading(true);
        user_login({
            androidId:device
        })
        .then(result => {
            if (result.status == 200) {
                const accessToken = result.data.accessToken;
                // Save the token to SQLite database
                saveTokenToDatabase(accessToken);
                navigation.navigate('Operation');
            } else {
                console.error('Error: Authentication Failed',result.statusText);
                navigation.navigate('SignUp',{androidId:device});
            }
        })
        .catch(err => {
            console.error(err);
        })
        .finally(() => {
            setLoading(false); // Set loading back to false when authentication is complete
        });
    };

    return(
        <View style={styles.body}>
            <Image 
                style={styles.logo}
                source={require("../img/login.png")}/>
            <Text style={styles.text}>Welcome To</Text>
            <Text style={styles.text1}>Tracking App</Text>
            {loading && <ActivityIndicator size="large" color="#f96163"/>}
            <TouchableOpacity style={styles.button}
                onPress={goHome}>
                <Text style={styles.text2}>Let's Go</Text>
            </TouchableOpacity>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    body:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    logo:{
        resizeMode: 'stretch',
        height: 350,
        width: 400,
    },
    text:{
        color:'#f96163',
        fontSize:22,
        fontWeight:'bold',
    },
    text1:{
        fontSize:42,
        fontWeight:'bold',
        color:'#3c444c',
        marginTop:44,
        marginBottom:20,
    },
    button:{
        backgroundColor: "#f96163",
        borderRadius: 18,
        paddingVertical: 18,
        width: "80%",
        alignItems: "center",
        marginTop:10,
    },
    text2:{
        fontSize: 18, 
        color: "#fff", 
        fontWeight: "700",
    },
    versionText: {
        fontSize: 16,
        color: "#3c444c",
    },
});