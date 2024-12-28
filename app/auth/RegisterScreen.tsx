import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import API_URL from "../../config/config";

export default function RegisterScreen() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const router = useRouter();

	const handleRegister = async () => {
		try {
			await axios.post(`${API_URL}/api/auth/register`, {
				username,
				password,
				email,
			});
			Alert.alert("Registration Successful", "You can now log in");
			router.replace("/auth/LoginScreen");
		} catch (error) {
			Alert.alert("Registration Failed", (error as any).response?.data?.message || "An error occurred");
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}> {/* Added a centered header view */}
				<Image
					source={require("../../assets/images/bunga.jpg")}
					style={styles.image}
				/>
				<Text style={styles.title}>Create an Account</Text>
				<Text style={styles.subtitle}>Join us and get started</Text>
			</View>

			<TextInput
				style={styles.input}
				placeholder="Username"
				value={username}
				onChangeText={setUsername}
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<TouchableOpacity
				style={styles.registerButton}
				onPress={handleRegister}
			>
				<Text style={styles.registerButtonText}>Register</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => router.replace("/auth/LoginScreen")}
			>
				<Text style={styles.backButtonText}>Back to Login</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f8e6f4", // Soft pink background
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 24,
        resizeMode: "contain",
		alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#7d4e57", // Muted plum for the title
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        color: "#a5739b", // Soft lavender for the subtitle
        textAlign: "center",
    },
    input: {
        width: "100%",
        height: 48,
        borderColor: "#d4a5c9", // Light lavender border
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: "#ffffff", // White background for clarity
        fontSize: 16,
        color: "#7d4e57", // Muted plum for input text
    },
    registerButton: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#d4a5c9", // Lavender border
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fbe4f5", // Light pink button
        marginBottom: 16,
    },
    registerButtonText: {
        color: "#7d4e57", // Muted plum for text
        fontSize: 16,
        fontWeight: "600",
    },
    loginButton: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#d4a5c9", // Lavender border
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fbe4f5", // Light pink button
    },
    loginButtonText: {
        color: "#7d4e57", // Muted plum for text
        fontSize: 16,
        fontWeight: "600",
    },
});
