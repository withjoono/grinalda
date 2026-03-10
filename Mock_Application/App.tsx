  
    import { NavigationContainer } from '@react-navigation/native';
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import { StyleSheet } from 'react-native';
    import { SafeAreaProvider } from "react-native-safe-area-context"
    import MainScreen from "./screens/MainScreen"
    import ScoreInputScreen from "./screens/ScoreInputScreen"
    import StandardScoreInputScreen from "./screens/StandardScoreInputScreen"
    import CollegeSelectScreen from "./screens/CollegeSelectScreen"
    import SupportStatusScreen from "./screens/SupportStatusScreen"
    import SupportCutScreen from "./screens/SupportCutScreen"
    import StrategyScreen from "./screens/StrategyScreen"
    import SupportStrategyScreen from "./screens/SupportStrategyScreen"

    const Stack = createNativeStackNavigator();

    function RootStack() {
      return (
        <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
          <Stack.Screen name="Home" component={MainScreen} />
          <Stack.Screen name="ScoreInput" component={ScoreInputScreen} />
          <Stack.Screen name="StandardScoreInput" component={StandardScoreInputScreen} />
          <Stack.Screen name="CollegeSelect" component={CollegeSelectScreen} />
          <Stack.Screen name="SupportStatus" component={SupportStatusScreen} />
          <Stack.Screen name="SupportCut" component={SupportCutScreen} />
          <Stack.Screen name="Strategy" component={StrategyScreen} />
          <Stack.Screen name="SupportStrategy" component={SupportStrategyScreen} />
        </Stack.Navigator>
      );
    }

    export default function App() {
      return (
        <SafeAreaProvider style={styles.container}>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1
      }
    });