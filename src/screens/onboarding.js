import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../layouts/colors';
import Styles from '../layouts/styles';
import Spacing from '../layouts/spacing';
import Typography, { Heading1 } from '../components/Typography';
import Icon from '../components/Icons';
import Gap from '../components/Gap';
import { setIsOnboarding } from '../redux/actions';
import { MTB_APP_LANDING } from '../layouts/constants';
import { setSession } from '../utils/session';
import Button from '../components/Buttons';

const Screen = () => {
    const dispatch = useDispatch();
    const { statusbarHeight } = useSelector(state => state.appInfo);

    const done = () => {
        dispatch(setIsOnboarding(true));
        setSession(MTB_APP_LANDING, true);
    }

    return (
        <View
            style={[
                Styles.full,
                Styles.center,
                {
                    paddingTop: statusbarHeight,
                    backgroundColor: Colors.white
                }
            ]}
        >
            <View style={[Styles.full, Styles.container, Styles.center]}>
                <View style={{ width: 300, height: 540 }}>
                    <Gap height={Spacing.spacing_s} />
                    <View
                        style={[
                            Styles.full,
                            {
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: Spacing.spacing_l
                            }
                        ]}
                    >
                        <Icon
                            name="audio-file"
                            width={46}
                            height={83}
                            color={Colors.accent1}
                        />
                        <Gap height={Spacing.spacing_s} />
                        <Heading1 color={Colors.accent1} align="center">Record your MTB exam using your phone or tablet</Heading1>
                        <Gap height={Spacing.spacing_s} />
                        <Typography type="large" align="center">Press the ‘New exam’ button to begin and you will be guided through the process of conducting the exam. You will also need your front cover.</Typography>
                    </View>
                </View>
            </View>

            <Button
                title="Continue"
                onPress={done}
            />
        </View>
    )
}

export default Screen;