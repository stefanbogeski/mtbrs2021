import React, {
    useEffect,
    useState,
    useRef
} from 'react';
import {
    Platform,
    TouchableOpacity,
    View,
    AppState,
    BackHandler
} from 'react-native';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    StackActions,
    useFocusEffect,
    useNavigation,
    useRoute
} from '@react-navigation/native';
import {
    activateKeepAwake,
    deactivateKeepAwake
} from '@sayem314/react-native-keep-awake';
import Styles from '../layouts/styles';
import Container from '../components/Container';
import Button from '../components/Buttons';
import CustomAlert from '../components/Alert';
import { Heading1, Heading3 } from '../components/Typography';
import Spacing from '../layouts/spacing';
import Colors from '../layouts/colors';
import { currentTimeStamp, getTimeString } from '../utils/time';
import ErrorScreen from '../components/ErrorScreen';
import Icon from '../components/Icons';
import Gap from '../components/Gap';
import {
    addRecordingClip,
    setRecordingClips,
    updateExamInfo
} from '../redux/actions';
import { DocumentDirectoryPath } from 'react-native-fs';
import { audioManager } from '../managers/audiomanager';
import { saveExamToLocalStorage } from '../managers/exam';
import {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption
} from 'react-native-audio-recorder-player';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';

const Screen = () => {
    const { statusbarHeight, recordingClips, examInfo, currentExam } = useSelector(state => state.appInfo);
    const { rootFolderName } = examInfo;
    const [duration, setDuration] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showRecordingLoseConfirm, setShowRecordingLoseConfirm] = useState(false);
    const [audioUri, setAudioUri] = useState('');
    const [audio, setAudio] = useState(null);
    const route = useRoute();
    const isAdditionalClip = route.params?.addition;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const recordInfoRef = useRef({});
    const [accidentModal, showAccidentModal] = useState(false);

    const [permissionChecked, setPermissionChecked] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [cancelModal, showCancelModal] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        })
    )

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
                const timestamp = currentTimeStamp('_');
                const tmpUri = Platform.select({
                    ios: `file://${DocumentDirectoryPath}/${rootFolderName}/audio_video/${currentExam.reference}_${timestamp}.m4a`,
                    android: `${DocumentDirectoryPath}/${rootFolderName}/audio_video/${currentExam.reference}_${timestamp}.mp3`,
                });
                setAudioUri(tmpUri);
                startRecording(tmpUri);
            }
        })();

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
            if (hasPermission) {
                audioManager.stopRecorder();
                audioManager.removeRecordBackListener();
            }
            deactivateKeepAwake();
        }
    }, []);

    const _handleAppStateChange = (appState) => {
        if (!recordInfoRef.current.isStarted) return;
        if (appState.match(/inactive|background/)) {
            (async () => {
                setShowModal(false);
                showCancelModal(false);
                setShowRecordingLoseConfirm(false);
                await audioManager.stopRecorder();
                audioManager.removeRecordBackListener();
                recordInfoRef.current = {
                    isStarted: false
                };
                showAccidentModal(true);
            })();
        }
    }

    const onClose = () => {
        navigation.goBack();
    }

    const startRecording = async (uri) => {
        audioManager.stopPlayer().then(() => { }).catch(() => { });
        setShowModal(false);
        showAccidentModal(false);

        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        const meteringEnabled = false;
        const result = await audioManager.startRecorder(uri, audioSet, meteringEnabled);
        recordInfoRef.current = {
            isStarted: true
        };
        audioManager.addRecordBackListener((e) => {
            setDuration(e.current_position);
        });
        setAudio({ uri: result });
    }

    const finishRecording = async () => {
        setShowModal(false);
        showAccidentModal(false);
        setShowRecordingLoseConfirm(false);
        if (!accidentModal) {
            await audioManager.stopRecorder();
            audioManager.removeRecordBackListener();
        }

        setTimeout(() => {
            if (recordingClips.length === 0) {
                const now = new Date();
                dispatch(updateExamInfo('recordingDate', {
                    year: now.getFullYear(),
                    month: now.getMonth() + 1,
                    day: now.getDate()
                }));
            }
            dispatch(addRecordingClip({ uri: audio.uri, length: duration }))
            saveExamToLocalStorage();
            navigation.goBack();
            navigation.navigate("audioplayback");
        }, 200)
    }

    const startAgain = async () => {
        await audioManager.stopRecorder();
        audioManager.removeRecordBackListener();
        setShowRecordingLoseConfirm(false);
        dispatch(setRecordingClips([]));
        const popAction = StackActions.pop(4);
        navigation.dispatch(popAction);
        navigation.navigate("information1")
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
            <View style={[Styles.full, Styles.center]}>
                <Heading1 color={Colors.accent1}>{getTimeString(duration)}</Heading1>
                <Gap height={Spacing.spacing_m} />
                <Heading3 color={Colors.accent1}>Recording</Heading3>
            </View>
            {
                (duration >= 1000) ? (
                    <View
                        style={[{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0
                        }, Styles.row]}
                    >
                        <View style={{ flex: 1 }}>
                            <Button
                                title={isAdditionalClip ? "Cancel" : "Start again"}
                                isWhite
                                onPress={() => {
                                    if (isAdditionalClip) showCancelModal(true)
                                    else setShowRecordingLoseConfirm(true);
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Finish"
                                onPress={() => setShowModal(true)}
                            />
                        </View>
                    </View >
                ) : null
            }

            {
                showModal && (
                    <CustomAlert
                        info={{
                            title: isAdditionalClip ? "End audio clip" : "Have you completed your exam?",
                            description: isAdditionalClip ? "Are you sure you want to end recording this additional clip?" : "By clicking yes, it will end the recording and take you to the photo upload.",
                            buttons: [
                                {
                                    title: "No, continue",
                                    onPress: () => setShowModal(false),
                                    white: true
                                }, {
                                    title: "Yes, end recording",
                                    onPress: finishRecording
                                }
                            ]
                        }}
                    />
                )
            }

            {
                showRecordingLoseConfirm && (
                    <CustomAlert
                        info={{
                            title: "Start again",
                            description: "Are you sure? This will delete your current exam recording.",
                            buttons: [
                                {
                                    title: "No, continue",
                                    onPress: () => setShowRecordingLoseConfirm(false),
                                    white: true
                                }, {
                                    title: "Yes, restart",
                                    onPress: startAgain
                                }
                            ]
                        }}
                    />
                )
            }

            {
                cancelModal && (
                    <CustomAlert
                        info={{
                            title: "Cancel recording",
                            description: "Are you sure? This will delete your current exam recording.",
                            buttons: [
                                {
                                    title: "No, continue",
                                    onPress: () => showCancelModal(false),
                                    white: true
                                }, {
                                    title: "Yes",
                                    onPress: () => {
                                        audioManager.stopRecorder();
                                        navigation.goBack();
                                    }
                                }
                            ]
                        }}
                    />
                )
            }

            {
                accidentModal && (
                    <CustomAlert
                        info={{
                            title: "There has been an issue with the recording.",
                            description: "Press end recording to save your recording so far and press the additional clip button to continue your exam. To delete your recording and start again press restart exam.",
                            buttons: [
                                {
                                    title: "Restart exam",
                                    onPress: () => startRecording(audioUri),
                                    white: true
                                }, {
                                    title: "End recording",
                                    onPress: finishRecording
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