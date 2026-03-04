1|import React from 'react';
2|import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
3|
4|interface InputProps extends TextInputProps {
5|  label?: string;
6|  error?: string;
7|  containerStyle?: ViewStyle;
8|}
9|
10|export const Input: React.FC<InputProps> = ({
11|  label,
12|  error,
13|  containerStyle,
14|  ...props
15|}) => {
16|  return (
17|    <View style={[styles.container, containerStyle]}>
18|      {label && <Text style={styles.label}>{label}</Text>}
19|      <TextInput
20|        style={[
21|          styles.input,
22|          error && styles.inputError,
23|          props.multiline && styles.multiline,
24|        ]}
25|        placeholderTextColor="#888"
26|        {...props}
27|      />
28|      {error && <Text style={styles.error}>{error}</Text>}
29|    </View>
30|  );
31|};
32|
33|const styles = StyleSheet.create({
34|  container: {
35|    marginBottom: 16,
36|  },
37|  label: {
38|    color: '#FFF',
39|    fontSize: 14,
40|    fontWeight: '500',
41|    marginBottom: 8,
42|  },
43|  input: {
44|    backgroundColor: '#1A1A1A',
45|    borderRadius: 12,
46|    height: 52,
47|    paddingHorizontal: 16,
48|    color: '#FFF',
49|    fontSize: 16,
50|    borderWidth: 1,
51|    borderColor: '#333',
52|  },
53|  inputError: {
54|    borderColor: '#FF4444',
55|  },
56|  multiline: {
57|    height: 100,
58|    paddingTop: 16,
59|    textAlignVertical: 'top',
60|  },
61|  error: {
62|    color: '#FF4444',
63|    fontSize: 12,
64|    marginTop: 4,
65|  },
66|});
