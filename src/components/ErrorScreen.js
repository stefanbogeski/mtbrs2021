import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import Typography from './Typography';

const ErrorScreen = ({ message, close }) => {
    const { statusbarHeight } = useSelector(state => state.appInfo);

    return (
        <View style={{
            width: '100%',
            flex: 1,
            paddingTop: statusbarHeight
        }}>
            <View 
                style={{ 
                    height: 100, 
                    padding: Spacing.spacing_l
                }}
            >{close}</View>

            <View
                style={[
                    Styles.full,
                    Styles.center,
                    { paddingHorizontal: Spacing.spacing_l }
                ]}
            >
                <Typography 
                    type="large" 
                    color={Colors.accent}
                >{message}</Typography>
            </View>

            <View style={{ height: 100 }} />
        </View>
    )
}

export default ErrorScreen;