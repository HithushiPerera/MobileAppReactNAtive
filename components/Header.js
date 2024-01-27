import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Header = ({ headerText, headerIcon }) => {
	return (
		<View style={styles.body}>
			<FontAwesome style={styles.text}name={headerText} size={24} color="#f96163" />

			<FontAwesome name={headerIcon} size={24} color="#f96163" />
		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
    body:{
        flexDirection: "row", 
        marginTop:10,
        marginBottom:10,
    },
    text:{
        flex: 1,
    },
});