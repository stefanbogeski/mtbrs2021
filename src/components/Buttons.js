import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Gap from './Gap';
import Icon from './Icons';
import Typography from './Typography';

export const Button = ({ title, isWhite, onPress, border, style }) => (
    <TouchableWithoutFeedback onPress={onPress}>
        <View
            style={{
                height: 56,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isWhite ? Colors.white : Colors.accent,
                borderWidth: 1,
                borderColor: border ?
                    (!isWhite ? Colors.white : Colors.accent) :
                    (isWhite ? Colors.white : Colors.accent),
                ...style
            }}
        >
            <Typography
                color={isWhite ? Colors.accent : Colors.white}
            >{title}</Typography>
        </View>
    </TouchableWithoutFeedback>
)

export default Button;

export const ButtonWithIcon = ({ onPress, icon, title, isWhite, border, style }) => (
    <TouchableWithoutFeedback onPress={onPress}>
        <View
            style={{
                height: 56,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isWhite ? Colors.white : Colors.accent,
                borderWidth: 1,
                borderColor: border ?
                    (!isWhite ? Colors.white : Colors.accent) :
                    (isWhite ? Colors.white : Colors.accent),
                ...style
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Icon
                    name={icon}
                    width={18}
                    height={18}
                    color={isWhite ? Colors.accent : Colors.white}
                />
                <Gap width={Spacing.spacing_s} />
                <Typography
                    color={isWhite ? Colors.accent : Colors.white}
                >{title}</Typography>
            </View>
        </View>
    </TouchableWithoutFeedback>
)

export const FlatButton = ({ title, color, style, onPress }) => (
    <TouchableWithoutFeedback onPress={onPress}>
        <View>
            <Typography
                type="vsmall"
                color={color ? color : Colors.accent}
                style={style}
            >{title}</Typography>
        </View>
    </TouchableWithoutFeedback>
)

export const SelectButton = ({ title, onPress, active, style }) => (
    <TouchableWithoutFeedback onPress={onPress}>
        <View
            style={{
                height: 48,
                minWidth: 70,
                paddingHorizontal: 18,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: active ? Colors.primary : Colors.grey1,
                backgroundColor: active ? Colors.primary : Colors.white,
                ...style
            }}
        >
            <Typography
                type="small"
                color={active ? Colors.white : Colors.grey1}
            >{title}</Typography>
        </View>
    </TouchableWithoutFeedback>
)