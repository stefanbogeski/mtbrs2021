import React, { useEffect, useState } from 'react';
import { PanResponder, View } from "react-native";
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';

const HorizontalSeekbar = ({ width, height, value, min = 0, max, onValueChange }) => {
    const panResponder = React.useRef(
        PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) =>
                true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
                true,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                // gestureState.d{x,y} will be set to zero now
            },
            onPanResponderMove: (evt, gestureState) => {
                let posX;

                if (gestureState.moveX < 0) posX = 0;
                else if (gestureState.moveX > width) posX = width;
                else posX = gestureState.moveX;

                onValueChange(posX * (max - min) / width)
                // The most recent move distance is gestureState.move{X,Y}
                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) =>
                true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            }
        })
    ).current;

    const getFillWidth = () => {
        let wid = 0;
        if (value > max) wid = width;
        if (value < min) wid = 0;
        wid = width * value / (max - min);
        return wid;
    }

    return (
        <View
            style={{
                width: '100%',
                height: height,
                padding: Spacing.spacing_xxs,
                backgroundColor: Colors.grey5
            }}
        >
            <View
                style={{
                    width: '100%',
                    flex: 1
                }}
            >
                <View style={{ flexDirection: 'row', height: '100%' }}>
                    <View style={{
                        width: getFillWidth(),
                        borderTopLeftRadius: (height / 2 - 4),
                        borderBottomLeftRadius: (height / 2 - 4),
                        backgroundColor: Colors.green
                    }} />
                    <View
                        style={{
                            width: height - 8,
                            height: height - 8,
                            marginLeft: -(height / 2 - 4),
                            marginVertical: 0,
                            borderColor: 'lightgray',
                            borderWidth: 1,
                            borderRadius: (height / 2 - 4),
                            backgroundColor: 'white'
                        }}
                    />
                </View>

                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0, 
                        zIndex: 2
                    }}
                    {...panResponder.panHandlers}
                />
            </View>
        </View>
    )
}

export default HorizontalSeekbar;