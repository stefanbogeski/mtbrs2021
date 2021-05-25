import React from 'react';
import { View } from 'react-native';
import Colors from '../layouts/colors';
import Styles from '../layouts/styles';

const Container = ({ children, pTop }) => (
    <View
        style={[
            Styles.full,
            {
                paddingTop: pTop,
                backgroundColor: Colors.white
            }
        ]}
    >{children}</View>
)

export default Container;