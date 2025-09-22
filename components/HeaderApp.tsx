import React from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Colors} from "@/constants/Colors";

interface HeaderProps {
  title: string;
}

export default function HeaderApp({title}: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderColor: Colors.border
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
