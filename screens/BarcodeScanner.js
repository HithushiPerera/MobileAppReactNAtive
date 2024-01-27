import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, FlatList, Button, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Style'
import { RNCamera } from 'react-native-camera';

function BarcodeScan({route}) {

    const [barcodes, setBarcodes] = useState(new Set());
    const navigation = useNavigation();
    const [flash, setFlash] = useState(false)

    useEffect(() => {
        return () => {
            setBarcodes(new Set());
        };
    },[]);
    
    const handleBarcodes = (barcode) => {
        const barcodeArray = Array.from(barcodes);
        if (!barcodeArray.includes(barcode)) {
            setBarcodes(new Set([...barcodeArray, barcode]));
        }
    };

    const navigateData = () => {
        const scannedData = Array.from(barcodes);
        const sourceScreen = route.params.sourceScreen;

        if (sourceScreen) {
            navigation.navigate(sourceScreen, {scannedData});
        }
        // navigation.navigate('ParcelD', { scannedData: Array.from(barcodes),
        //     // clearData: () => setBarcodes(new Set()), 
        // })
    }

    return (
    <View style={styles1.container}>
        <RNCamera
            ref={ref => {this.camera = ref;}}
            captureAudio={false}
            autoFocus={RNCamera.Constants.AutoFocus.on}
            defaultTouchToFocus
            flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            mirrorImage={false}
            // onBarCodeRead={readBarcode}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {

                //console.log(barcodes, barcodes.length)
                if (barcodes.length > 0){
                    const barcode = barcodes[0].data;
                    handleBarcodes(barcode);
                }
            }}
            style={{
                flex: 1,
                alignItems: 'center',
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width
            }}
            type={RNCamera.Constants.Type.back}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
        />
            <FlatList
                data={Array.from(barcodes)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <Text key={index} style={styles.text}>{item}</Text>
                )}
            />
            
            <Pressable style={styles1.btn2} onPress={navigateData}>
                <View style={styles1.view3}>
                    <Text style={{ fontWeight: "600", color:'#fff', fontSize:16 }}>
                        Stop
                    </Text>
                </View>
            </Pressable>
    </View>
    );
}

export default BarcodeScan

const styles1 = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 30,
    },
    text: {
        fontSize:20,
        fontWeight:'bold',
        color:'#000'
    },
    btn2:{
        backgroundColor: "#f96163",
        padding: 12,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    view3:{
        height: 22,
        width:200,
        alignItems: "center",
        justifyContent: "center",
    },
});