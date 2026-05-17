import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';
import { ScreenHeaderProps } from './types';

export const ScreenHeader = ({ colors }: ScreenHeaderProps) => (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Menu</Text>
    </View>
);
