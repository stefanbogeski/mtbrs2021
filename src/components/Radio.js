import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import Gap from './Gap';
import Typography from './Typography';

const Radio = ({ label, defaultValue, onPress }) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(defaultValue)
    }, [defaultValue])

    return (
        <TouchableWithoutFeedback
            onPress={onPress}
        >
            <View style={{
                flexDirection: 'row',
                paddingVertical: 5,
                alignItems: 'center'
            }}>
                <View style={[{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                    backgroundColor: Colors.white
                }, Styles.center]}>
                    <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: checked ? Colors.primary : Colors.white
                    }} />
                </View>

                <Gap width={Spacing.spacing_s} />

                <Typography style={{ flex: 1 }}>{label}</Typography>
            </View>
        </TouchableWithoutFeedback>
    )
}

export const RadioGroup = ({ radios, defaultValue, onChange }) => {
    const [selected, setSelected] = useState('')

    useEffect(() => {
        setSelected(defaultValue);
    }, [defaultValue])

    return (
        <View
            style={{
                width: '100%',
                paddingVertical: 5
            }}
        >
            {
                radios.map((item, i) => (
                    <Radio
                        defaultValue={item === selected ? true : false}
                        key={i}
                        label={item}
                        onPress={() => {
                            const v = item;
                            setSelected(v);
                            if (onChange) onChange(v)
                        }}
                    />
                ))
            }
        </View>
    );
}