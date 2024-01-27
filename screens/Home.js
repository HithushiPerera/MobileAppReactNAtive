import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@rneui/themed';
import styles from './../styles/Style'

function Home({ navigation, route }) {
    const { scannedData, clearData } = route.params || { scannedData: [] };
    const clearScannedData = () => {
        // Clear the scanned data without navigating back
        clearData();
    };
    return (
    <View style={styles.container}>
        <Button
        title="Scanner"
        onPress={() => navigation.navigate('Barcode Scanner')}
        icon={{ ...styles.iconButtonHome, name: 'barcode-scan' }}
        iconContainerStyle={styles.iconButtonHomeContainer}
        titleStyle={styles.titleButtonHome}
        buttonStyle={styles.buttonHome}
        containerStyle={styles.buttonHomeContainer}
        />
        <Text style={styles.text}>Scanned Data:</Text>
        {scannedData.map((barcode, index) => (
            <Text key={index} style={styles.text}>{barcode}</Text>
        ))}
        {/* <Button title="Clear Data" onPress={clearScannedData} /> */}
    </View>
    );
}

export default Home