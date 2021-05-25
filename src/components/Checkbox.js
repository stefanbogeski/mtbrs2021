import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Gap from './Gap';
import Icon from './Icons';
import Typography from './Typography';

const CheckBox = ({ label, onChange, defaultValue, color }) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(defaultValue);
    }, [defaultValue])

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (onChange) {
                    const ch = !checked;
                    onChange(ch)
                    setChecked(ch);
                }
            }}
        >
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                }}
            >
                <View
                    style={{
                        width: 24,
                        height: 24,
                        borderWidth: 2,
                        borderColor: Colors.accent,
                        backgroundColor: checked ? Colors.accent : Colors.white,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Icon name="check" width={14} height={10} color={Colors.white} />
                </View>

                <Gap width={Spacing.spacing_m} />
                <View style={{ flex: 1 }}>
                    <Typography type="small" color={color ? color : Colors.grey1}>{label}</Typography>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default CheckBox;