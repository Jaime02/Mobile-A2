import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface AppTextProps extends TextProps {
  children?: React.ReactNode;
}

const AppText: React.FC<AppTextProps> = (props) => {
  return (
    <Text style={[styles.defaultFont, props.style]} {...props}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'MainFont',
  },
});

export default AppText;
