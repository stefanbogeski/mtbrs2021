import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableWithoutFeedback, View, Animated } from 'react-native';
import { onChange } from 'react-native-reanimated';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Icon from './Icons';
import Typography from './Typography';

const Expand = ({ label, children, value, onChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [iconName, setIconName] = useState('plus');
    const [maxHeight, setMaxHeight] = useState(0);
    const [minHeight, setMinHeight] = useState(0);
    const anim = useRef(new Animated.Value(50));
    const iconAnim = useRef(new Animated.Value(0));

    const toggle = () => {
        const ex = !expanded;
        setExpanded(!expanded);
        if (onChange) onChange(ex)
    }

    useEffect(() => {
        setExpanded(value)
    }, [value])

    useEffect(() => {
        Animated.spring(
            anim.current,
            {
                toValue: expanded ? (maxHeight + minHeight) : minHeight,
                useNativeDriver: false
            }
        ).start();
        Animated.spring(
            iconAnim.current,
            {
                toValue: expanded ? 1 : 0,
                useNativeDriver: false
            }
        ).start()
        setIconName(expanded ? "minus" : "plus")
    }, [expanded, minHeight, maxHeight])

    return (
        <Animated.View
            style={{
                width: '100%',
                height: anim.current,
                overflow: 'hidden'
            }}
        >
            <TouchableWithoutFeedback onPress={toggle}>
                <View onLayout={(event) => setMinHeight(event.nativeEvent.layout.height)}>
                    <View
                        style={{
                            backgroundColor: expanded ? Colors.accent : Colors.grey5,
                            height: 56,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: Spacing.spacing_l,
                        }}
                    >
                        <Typography
                            style={{ flex: 1 }}
                            color={expanded ? Colors.white : Colors.primary}
                        >{label}</Typography>
                        <Animated.View
                            style={{
                                transform: [{
                                    rotate: iconAnim.current.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['-180deg', '0deg']
                                    })
                                }]
                            }}
                        >
                            <Icon name={iconName} width={23} height={23} color={expanded ? Colors.white : Colors.accent} />
                        </Animated.View>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <View
                onLayout={
                    (event) => setMaxHeight(event.nativeEvent.layout.height)
                }
                style={{
                    padding: Spacing.spacing_l,
                    paddingTop: Spacing.spacing_xxl_2
                }}
            >{children}</View>
        </Animated.View>
    )
}

export default Expand;