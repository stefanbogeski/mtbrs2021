import React, { useEffect, useState, useRef } from 'react';
import { AppState, Image, Platform, TouchableOpacity, View } from 'react-native';
import { Button, ButtonWithIcon } from '../components/Buttons';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Container from '../components/Container';
import Spacing from '../layouts/spacing';
import Icon from '../components/Icons';
import Colors from '../layouts/colors';
import Styles from '../layouts/styles';
import logoImg from '../assets/calibrate.png';
import Typography, { Heading1, Heading2, Heading3 } from '../components/Typography';
import Gap from '../components/Gap';
import AudioPlayer from '../components/AudioPlayer';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';
import { getTimeString } from '../utils/time';
import ErrorScreen from '../components/ErrorScreen';
import { audioManager } from '../managers/audiomanager';
import { checkMultiple, requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { getRandomString } from '../utils/string';
import { DocumentDirectoryPath } from 'react-native-fs';
import CustomAlert from '../components/Alert';

const Screen = () => {
    const navigation = useNavigation();
    const { statusbarHeight } = useSelector(state => state.appInfo);
    const [recording, setRecording] = useState(false);
    const [recorded, setRecorded] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audio, setAudio] = useState('');
    const [audioUri, setAudioUri] = useState('');

    const [permissionChecked, setPermissionChecked] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [accidentModal, showAccidentModal] = useState(false);
    const recordInfoRef = useRef({});

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);
        activateKeepAwake();

        (async () => {
            let permission = null;
            if (Platform.OS === 'android') {
                const statuses = await requestMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.RECORD_AUDIO])

                if (statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted' && statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'granted') {
                    permission = true;
                } else {
                    permission = false;
                }
            } else {
                const statuses = await requestMultiple([PERMISSIONS.IOS.MICROPHONE])

                permission = statuses[PERMISSIONS.IOS.MICROPHONE] === 'granted' ? true : false;
            }
            setPermissionChecked(true);
            setHasPermission(permission);

            if (permission) {
                const filename = getRandomString(10);
                const tmpUri = Platform.select({
                    ios: `file://${DocumentDirectoryPath}/${filename}.m4a`,
                    android: `${DocumentDirectoryPath}/${filename}.mp3`,
                });
                setAudioUri(tmpUri);
            }
        })();

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
            audioManager.stopRecorder();
            audioManager.removeRecordBackListener();
            deactivateKeepAwake();
        }
    }, [])

    const _handleAppStateChange = (appState) => {
        if (!recordInfoRef.current.isStarted) return;
        if (appState.match(/inactive|background/)) {
            (async () => {
                await audioManager.stopRecorder();
                audioManager.removeRecordBackListener();
                showAccidentModal(true);
                recordInfoRef.current = {
                    isStarted: false
                };
            })();
        }
    }

    const startRecording = async () => {
        showAccidentModal(false);
        audioManager.stopPlayer().then(() => { }).catch(() => { });
        setDuration(0);
        const result = await audioManager.startRecorder(audioUri);
        audioManager.addRecordBackListener((e) => {
            setDuration(e.current_position);
        });
        recordInfoRef.current = {
            isStarted: true
        };
        setAudio(result);
        setRecorded(false);
        setRecording(true);
    }

    const finishRecording = async () => {
        await audioManager.stopRecorder();
        audioManager.removeRecordBackListener();
        recordInfoRef.current = {
            isStarted: false
        };
        setRecorded(true)
        setRecording(false)
    }

    const onClose = () => {
        navigation.goBack();
    }

    if (!permissionChecked) {
        return <View />;
    }

    if (permissionChecked && !hasPermission) {
        return (
            <ErrorScreen
                message="No permission"
                close={(
                    <TouchableOpacity onPress={onClose}>
                        <Icon
                            name="close"
                            width={20}
                            height={20}
                            color={Colors.primary}
                        />
                    </TouchableOpacity>
                )}
            />
        )
    }

    return (
        <Container pTop={statusbarHeight}>
            <View style={{ paddingHorizontal: Spacing.spacing_l, flex: 1 }}>
                <View style={{ paddingTop: Spacing.spacing_l }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon
                            name="arrow-back"
                            width={10}
                            height={20}
                            color={Colors.grey3}
                        />
                    </TouchableOpacity>
                </View>

                <View style={[Styles.center, { width: '100%' }]}>
                    <Heading2 color={Colors.accent1} align="center">Check recording levels</Heading2>
                    <Gap height={Spacing.spacing_s} />
                    <Typography
                        type="small"
                        color={Colors.grey1}
                        align="center"
                    >Record a short sample to ensure the playback levels are adequate.</Typography>

                    <Gap height={Spacing.spacing_xxl_4} />

                    {
                        recorded ? (
                            <View style={{ width: '100%' }}>
                                <AudioPlayer
                                    audio={{ uri: audio, length: duration }}
                                />
                            </View>
                        ) : (
                                recording ? (
                                    <View style={Styles.center}>
                                        <Gap height={Spacing.spacing_xxl_4} />
                                        <Heading1 color={Colors.accent1}>{getTimeString(duration)}</Heading1>
                                        <Gap height={Spacing.spacing_m} />
                                        <Heading3 color={Colors.accent1}>Recording</Heading3>
                                    </View>
                                ) : (
                                        <View>
                                            <Image
                                                source={logoImg}
                                                style={{ width: 199, height: 95 }}
                                            />
                                        </View>
                                    )
                            )
                    }

                </View>

                <View style={Styles.full} />
            </View>

            {
                recorded ? (
                    <View style={Styles.row}>
                        <View style={Styles.full}>
                            <Button
                                title="Record again"
                                onPress={() => startRecording()}
                            />
                        </View>
                        <View style={Styles.full}>
                            <Button
                                title="Close"
                                isWhite
                                onPress={() => navigation.goBack()}
                            />
                        </View>
                    </View>
                ) : (
                        recording ? (
                            <Button
                                title="Stop"
                                onPress={() => finishRecording()}
                            />
                        ) : (
                                <ButtonWithIcon
                                    title="Record"
                                    icon="audio"
                                    onPress={() => startRecording()}
                                />
                            )
                    )
            }

            {
                accidentModal && (
                    <CustomAlert
                        info={{
                            title: "There has been an issue with the recording.",
                            description: "Press end recording to save your recording so far. To delete your recording and start again press restart exam.",
                            buttons: [
                                {
                                    title: "Restart exam",
                                    onPress: () => startRecording(),
                                    white: true
                                }, {
                                    title: "End recording",
                                    onPress: () => {
                                        setRecording(false);
                                        setRecorded(true)
                                        showAccidentModal(false);
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