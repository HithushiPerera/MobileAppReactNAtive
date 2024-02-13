import React, { useEffect, useState } from "react";
import NetInfo from '@react-native-community/netinfo';
import { View } from "react-native";
import { Text } from "@rneui/base";

const CheckNetwork = ({ isConnected, setIsConnected }) => {
    //const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            height: 25,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isConnected ? '#008000' : '#000',
        }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isConnected ? 'Back Online' : 'No Internet Connection'}</Text>
        </View>
    );
}

export default CheckNetwork;