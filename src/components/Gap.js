import React from 'react';
import { View } from 'react-native';

const Gap = (props) => props.height ? (
    <View style={{
        height: props.height
    }} />
) : (
    <View style={{
        width: props.width
    }} />
)

export default Gap;