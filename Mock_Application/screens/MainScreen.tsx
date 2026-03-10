import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../lib/theme';
import AuthButton from '../components/AuthButton';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import FeaturePaddle from '../components/FeaturePaddle';
import { useNavigation } from '@react-navigation/native';

export default function MainScreen() {
  const navigation = useNavigation<any>();

  const handleGoogleLogin = () => {
    console.log('Google 로그인 누름');
  };

  const handleNaverLogin = () => {
    console.log('Naver 로그인 누름');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.brandArea}>
          <View style={styles.logoBadge} accessible accessibilityLabel="앱 로고: 대학 심볼">
            <MaterialCommunityIcons name="school" size={44} color={theme.colors.onPrimary} />
          </View>

          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="앱명 모의지원 앱"
          >
            모의지원 앱
          </Text>
        </View>

        <View style={styles.wheelArea}>
          <FeaturePaddle label="2027 수시 모의지원" emphasis={0.9} />
          <View style={{ height: theme.spacing.md }} />

          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ScoreInput')}>
            <FeaturePaddle label="정시 모의지원" active emphasis={1.0} />
          </TouchableOpacity>

          <View style={{ height: theme.spacing.md }} />
          <FeaturePaddle label="9평 모의지원" emphasis={0.9} />
          <View style={{ height: theme.spacing.sm }} />
          <FeaturePaddle label="6평 모의지원" emphasis={0.85} />
        </View>

        <View style={styles.bottomArea}>
          <AuthButton
            label="Google 로그인"
            onPress={handleGoogleLogin}
            backgroundColor={theme.colors.google}
            textColor={theme.colors.text}
            icon={<AntDesign name="google" size={18} color="#DB4437" />}
            style={styles.authButton}
          />

          <View style={{ height: theme.spacing.sm }} />

          <AuthButton
            label="Naver 로그인"
            onPress={handleNaverLogin}
            backgroundColor={theme.colors.naver}
            textColor={theme.colors.onPrimary}
            icon={<AntDesign name="bars" size={18} color={theme.colors.onPrimary} />}
            style={styles.authButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  brandArea: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  title: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.title,
    fontWeight: '800',
    color: theme.colors.text,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  logoIcon: {
    // kept for potential future adjustments
  },
  wheelArea: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  bottomArea: {
    paddingBottom: theme.spacing.lg,
  },
  authButton: {
    width: '100%',
  },
});