import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Button, { ButtonWithIcon } from '../components/Buttons';
import Container from '../components/Container';
import Gap from '../components/Gap';
import Icon from '../components/Icons';
import Typography, { Heading2 } from '../components/Typography';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import descriptions from '../../descriptions.json';
import CustomAlert from '../components/Alert';
import { openAirplaneModeSettings } from '../utils/opensettings';

const Screen = () => {
    const {
        statusbarHeight,
        examMediaType
    } = useSelector(state => state.appInfo);
    const navigation = useNavigation();
    const [openSetting, setOpenSetting] = useState(false);

    const back = () => {
        navigation.goBack();
    }

    const recocrd = () => {
        navigation.navigate(`recording${examMediaType}`);
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l, flex: 1 }}>
                    <View style={{ paddingTop: Spacing.spacing_l }}>
                        <TouchableOpacity onPress={back}>
                            <Icon
                                name="arrow-back"
                                width={10}
                                height={20}
                                color={Colors.grey3}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={Styles.center}>
                        <Heading2 color={Colors.accent1} align="center">Starting the exam</Heading2>
                    </View>

                    <View style={{ paddingVertical: Spacing.spacing_l, paddingHorizontal: Spacing.spacing_s }}>
                        {
                            descriptions.startingexam.map((item, i) => (
                                <View
                                    style={[
                                        Styles.row,
                                        { marginBottom: Spacing.spacing_m }
                                    ]}
                                    key={i}
                                >
                                    <View
                                        style={{
                                            marginTop: 10,
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: Colors.grey1
                                        }}
                                    />
                                    <Gap width={Spacing.spacing_xs} />
                                    <Typography color={Colors.grey1}>{item}</Typography>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>

            <ButtonWithIcon
                title="Record"
                icon={examMediaType}
                onPress={recocrd}
            />

            {
                openSetting && (
                    <CustomAlert
                        info={{
                            title: "Airplane mode",
                            description: "Please press open settings below to turn on airplane mode so that all incoming calls are prevented.",
                            buttons: [
                                {
                                    title: "Close",
                                    white: true,
                                    onPress: () => setOpenSetting(false)
                                },
                                {
                                    title: "Open settings",
                                    onPress: () => {
                                        setOpenSetting(false)
                                        openAirplaneModeSettings();
                                    }
                                }
                            ]
                        }}
                    />
                )
            }
        </Container>
    )
}

export default Screen;