import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Container from '../components/Container';
import Gap from '../components/Gap';
import Icon from '../components/Icons';
import Typography, { Heading2, Heading3 } from '../components/Typography';
import Colors from '../layouts/colors';
import { screenHeight, windowHeight } from '../layouts/layout';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import descriptions from '../../descriptions.json';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Buttons';
import CheckBox from '../components/Checkbox';
import { restartUploading, setUploading, updateExamInfo } from '../redux/actions';
import CustomAlert from '../components/Alert';
import { openAirplaneModeSettings } from '../utils/opensettings';
import { saveExamToLocalStorage } from '../managers/exam';

const Screen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { statusbarHeight, netInfo } = useSelector(state => state.appInfo);
    const [note, setNote] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [openSetting, setOpenSetting] = useState(false);

    const back = () => {
        navigation.goBack();
    }

    const confirm = () => {
        if (!netInfo?.isConnected) {
            setOpenSetting(true);
            return ;
        }

        if (confirmed && netInfo?.isConnected) {
            saveExamToLocalStorage()
            dispatch(restartUploading(1));
            dispatch(updateExamInfo("submissionNote", note));
        }
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l, flex: 1 }}>
                    <View>
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
                            <Heading2 color={Colors.accent1} align="center">Confirm submission</Heading2>
                            <Gap height={Spacing.spacing_s} />
                            <Typography
                                type="small"
                                color={Colors.grey1}
                                align="center"
                            >{descriptions.confirmsubmission}</Typography>
                        </View>
                    </View>
                    <Gap height={Spacing.spacing_xxl_2} />
                    <View>
                        <View style={Styles.row}>
                            <Typography type="small">Add submission note</Typography>
                            <View style={Styles.full} />
                            <Typography type="small" color={Colors.grey4}>Optional</Typography>
                        </View>
                        <View
                            style={{
                                height: 100,
                                paddingHorizontal: Spacing.spacing_l,
                                paddingVertical: Spacing.spacing_s
                            }}
                        >
                            <TextInput
                                style={{ flex: 1 }}
                                multiline={true}
                                placeholder="Add an optional message with your upload"
                                style={{ fontSize: 16, lineHeight: 24, color: Colors.grey1 }}
                                value={note}
                                onChangeText={(val) => setNote(val)}
                            />
                        </View>
                    </View>

                    <Gap height={Spacing.spacing_xxl_4} />

                    <View>
                        <Heading3>Please read and confirm MTB's exam policies</Heading3>
                        <Gap height={Spacing.spacing_xl} />
                        <CheckBox
                            label="I confirm that the candidate anmed above was recorded performing on this assessment by me/us and was carried out without assistance apart from that which is acceptable according to the rules of the appropriate MTB syllabus specification."
                            defaultValue={confirmed}
                            onChange={(val) => setConfirmed(val)}
                            color={Colors.grey1}
                        />
                    </View>
                </View>
            </ScrollView>
            <Button
                title="Confirm and upload exam"
                onPress={confirm}
            />

            {
                openSetting && (
                    <CustomAlert
                        info={{
                            title: "Airplane mode",
                            description: "Please turn off airplane mode to submit your exam.",
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