1|import React from 'react';
2|import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
3|
4|interface ButtonProps {
5|  title: string;
6|  onPress: () => void;
7|  loading?: boolean;
8|  disabled?: boolean;
9|  variant?: 'primary' | 'secondary' | 'outline';
10|  style?: ViewStyle;
11|  textStyle?: TextStyle;
12|}
13|
14|export const Button: React.FC<ButtonProps> = ({
15|  title,
16|  onPress,
17|  loading = false,
18|  disabled = false,
19|  variant = 'primary',
20|  style,
21|  textStyle,
22|}) => {
23|  const getButtonStyle = () => {
24|    switch (variant) {
25|      case 'secondary':
26|        return styles.secondaryButton;
27|      case 'outline':
28|        return styles.outlineButton;
29|      default:
30|        return styles.primaryButton;
31|    }
32|  };
33|
34|  const getTextStyle = () => {
35|    switch (variant) {
36|      case 'outline':
37|        return styles.outlineText;
38|      default:
39|        return styles.buttonText;
40|    }
41|  };
42|
43|  return (
44|    <TouchableOpacity
45|      style={[
46|        styles.button,
47|        getButtonStyle(),
48|        disabled && styles.disabled,
49|        style,
50|      ]}
51|      onPress={onPress}
52|      disabled={disabled || loading}
53|      activeOpacity={0.8}
54|    >
55|      {loading ? (
56|        <ActivityIndicator color={variant === 'outline' ? '#FF6B00' : '#FFF'} />
57|      ) : (
58|        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
59|      )}
60|    </TouchableOpacity>
61|  );
62|};
63|
64|const styles = StyleSheet.create({
65|  button: {
66|    height: 52,
67|    borderRadius: 12,
68|    justifyContent: 'center',
69|    alignItems: 'center',
70|    paddingHorizontal: 24,
71|  },
72|  primaryButton: {
73|    backgroundColor: '#FF6B00',
74|  },
75|  secondaryButton: {
76|    backgroundColor: '#333',
77|  },
78|  outlineButton: {
79|    backgroundColor: 'transparent',
80|    borderWidth: 2,
81|    borderColor: '#FF6B00',
82|  },
83|  disabled: {
84|    opacity: 0.5,
85|  },
86|  buttonText: {
87|    color: '#FFF',
88|    fontSize: 16,
89|    fontWeight: '600',
90|  },
91|  outlineText: {
92|    color: '#FF6B00',
93|    fontSize: 16,
94|    fontWeight: '600',
95|  },
96|});
  
