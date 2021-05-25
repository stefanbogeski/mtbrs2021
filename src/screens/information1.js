import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../components/Buttons';
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
    const { statusbarHeight, examMediaType } = useSelector(state => state.appInfo);
    const navigation = useNavigation();
    const [openSetting, setOpenSetting] = useState(false);

    const back = () => {
        navigation.goBack();
    }

    const next = () => {
        navigation.navigate("information2");
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
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
                        <Heading2 color={Colors.accent1} align="center">Before you start</Heading2>
                    </View>

                    <View style={{ paddingVertical: Spacing.spacing_l }}>
                        <Typography type="large">Front cover</Typography>
                        <Gap height={Spacing.spacing_xs} />
                        <Typography color={Colors.grey1}>{descriptions.frontcover['normal']}</Typography>
                        {
                            examMediaType === 'audio' ? (
                                <>
                                    <Gap height={Spacing.spacing_s} />
                                    <Typography color={Colors.grey1}>{descriptions.frontcover['audio']}</Typography>
                                </>
                            ) : null
                        }
                        <Gap height={Spacing.spacing_l} />

                        <Typography type="large">Airplane mode</Typography>
                        <Gap height={Spacing.spacing_xs} />
                        <Typography color={Colors.grey1}>{descriptions.airplanemode}</Typography>
                        <Gap height={Spacing.spacing_m} />
                        <Button
                            title="Open settings"
                            onPress={() => setOpenSetting(true)}
                        />
                        <Gap height={Spacing.spacing_l} />

                        <Typography type="large">Battery</Typography>
                        <Gap height={Spacing.spacing_xs} />
                        <Typography color={Colors.grey1}>{descriptions.battery}</Typography>
                        <Gap height={Spacing.spacing_l} />

                        <Typography type="large">Available Storage</Typography>
                        <Gap height={Spacing.spacing_xs} />
                        <Typography color={Colors.grey1}>{descriptions.availablestorage}</Typography>
                        <Gap height={Spacing.spacing_l} />

                        <View style={Styles.row}>
                            <View
                                style={[{
                                    marginTop: 2,
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: Colors.green
                                }, Styles.center]}
                            >
                                <Icon name="check" width={10} height={7} color={Colors.white} />
                            </View>
                            <Gap width={Spacing.spacing_xs} />
                            <Typography color={Colors.green}>You have sufficient space</Typography>
                        </View>
                        <Gap height={Spacing.spacing_l} />
                    </View>
                </View>
            </ScrollView>
            <Button
                title="Next"
                onPress={next}
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