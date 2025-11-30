import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';

export default function WelcomeScreen() {
	const router = useRouter();

	const handleGetStarted = () => {
		try {
			router.push('/signin');
		} catch (err) {
			// fallback: try without leading slash
			console.warn('router.push(/signin) failed, trying fallback', err);
			try {
				router.push('/signin');
			} catch (err2) {
				console.error('Fallback navigation to signin failed', err2);
				// show an alert to the user so they know something went wrong
				// eslint-disable-next-line no-alert
				alert('Navigation failed. Please try again.');
			}
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.inner}>
				<View style={styles.topWrap}>
					<Image
						source={require('../assets/images/app-logo-1.png')}
						style={styles.logo}
						resizeMode="contain"
					/>
					<Text style={styles.title}>AidSphere</Text>
					<Text style={styles.tagline}>Connect.Respond.Rebuild.</Text>
				</View>

				<Link href="/signin" asChild>
					<TouchableOpacity style={styles.button} activeOpacity={0.85}>
						<Text style={styles.buttonText}>Get Started</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	inner: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	topWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		marginBottom: 160,
	},
	logo: {
		width: 130,
		height: 130,
			marginBottom: 12,
	},
	title: {
		fontSize: 26,
		fontWeight: '700',
		color: '#1a1a1a',
		lineHeight: 30,
			marginTop: 6,
		textAlign: 'center',
	},
	tagline: {
			marginTop: 3,
		fontSize: 13,
		color: '#0099ff',
		fontWeight: '600',
		textAlign: 'center',
		letterSpacing: 0.5,
	},
	button: {
		width: '100%',
		height: 50,
		backgroundColor: '#28a8ff',
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 28,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '700',
	},
});

