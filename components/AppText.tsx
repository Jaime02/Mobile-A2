import { useTextStyles } from '@/constants/TextStyles';
import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';

interface AppTextProps extends TextProps {
  children?: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

const AppText: React.FC<AppTextProps> = ({ children, style, ...rest }) => {
  const textStyles = useTextStyles();

  return (
    <Text style={[styles.defaultFont, textStyles.default, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'MainFont',
  },
});

export default AppText;
