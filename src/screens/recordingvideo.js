import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Platform, AppState, BackHandler, Alert } from 'react-native'
import { RNCamera } from 'react-native-camera';
import { StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake'
import ErrorScreen from '../components/ErrorScreen';
import Colors from '../layouts/colors';
import Icon from '../components/Icons';
import Button from '../components/Buttons';
import LinearGradient from 'react-native-linear-gradient';
import Spacing from '../layouts/spacing';
import Typography from '../components/Typography';
import { currentTimeStamp, getTimeString } from '../utils/time';
import Styles from '../layouts/styles';
import { addRecordingClip, setRecordingClips, updateExamInfo } from '../redux/actions';
import CustomAlert from '../components/Alert';
import { DocumentDirectoryPath } from 'react-native-fs'
import { saveExamToLocalStorage } from '../managers/exam';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';

const Screen = () => {
    const navigation = useNavigation();
    const cameraRef = useRef(null);
    const { statusbarHeight, recordingClips, examInfo, currentExam } = useSelector(state => state.appInfo);
    const { rootFolderName } = examInfo;
    const dispatch = useDispatch();
    const recordInfoRef = useRef({});
    const [showRecordingLoseConfirm, setShowRecordingLoseConfirm] = useState(false);
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
    const [cameraReady, setCameraReady] = useState(false);
    const [duration, setDuration] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [accidentModal, showAccidentModal] = useState(false);
    const [started, setStarted] = useState(false);
    const filename = useRef(`${currentExam.reference}_${currentTimeStamp('_')}`).current;
    const [switchCameraConfirm, setSwitchCameraConfirm] = useState(false);
    const route = useRoute();
    const isAdditionalClip = route.params?.addition;
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMicroPermission, setHasMicroPermission] = useState(null);
    const [permissionChecked, setPermissionChecked] = useState(false);
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
            if (Platform.OS === 'android') {
                const statuses = await requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO])

                setHasCameraPermission(statuses[PERMISSIONS.ANDROID.CAMERA] === 'granted' ? true : false);
                setHasMicroPermission(statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'granted' ? true : false);
            } else {
                const statuses = await requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE])

                setHasCameraPermission(statuses[PERMISSIONS.IOS.CAMERA] === 'granted' ? true : false);
                setHasMicroPermission(statuses[PERMISSIONS.IOS.MICROPHONE] === 'granted' ? true : false);
            }
            setPermissionChecked(true);
        })();

        const timer = setInterval(() => {
            const { isStarted, startTime } = recordInfoRef.current;
            if (isStarted && startTime) {
                const current = new Date();
                const t = current.getTime() - startTime.getTime();
                setDuration(t);
            }
        }, 500);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
            deactivateKeepAwake();
            clearInterval(timer);
        }
    }, [])

    const _handleAppStateChange = (appState) => {
        if (!recordInfoRef.current.isStarted) return;
        if (appState.match(/inactive|background/)) {
            setShowModal(false);
            setSwitchCameraConfirm(false);
            showCancelModal(false);
            setShowRecordingLoseConfirm(false);
            recordInfoRef.current.stopType = 'inactive-background';
            cameraRef.current.stopRecording();
        }
    }

    const onClose = () => {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
    }

    const exchangeCamera = () => {
        if (recordInfoRef.current?.isStarted) {
            recordInfoRef.current.stopType = 'camera-switch';
            cameraRef.current.stopRecording();
        }
        setCameraReady(false);
        setStarted(false);
        if (cameraType === RNCamera.Constants.Type.back) {
            setCameraType(RNCamera.Constants.Type.front);
        } else {
            setCameraType(RNCamera.Constants.Type.back);
        }
    }

    const onCameraReady = () => {
        setCameraReady(true);
        if (!started) {
            setStarted(true);
            setTimeout(() => {
                startRecording();
            }, 300)
        }
    }

    const startRecording = async () => {
        showAccidentModal(false);
        setDuration(0);
        try {
            const video = await cameraRef.current.recordAsync({
                quality: RNCamera.Constants.VideoQuality['4:3'],
                path: `${DocumentDirectoryPath}/${rootFolderName}/audio_video/${filename}.${Platform.select({
                    android: "mp4",
                    ios: "mov",
                })}`,
                videoBitrate: 1000000,
                codec: Platform.OS === 'ios' ? RNCamera.Constants.VideoCodec['HVEC'] : null
            });
            recordInfoRef.current.video = video;
            switch (recordInfoRef.current.stopType) {
                case "cancel":
                    const popAction = StackActions.pop(1);
                    navigation.dispatch(popAction);
                    break;
                case "recording-restart":
                    startRecording();
                    break;
                case "camera-switch":
                    break;
                case "start-again":
                    dispatch(setRecordingClips([]));
                    const popAction1 = StackActions.pop(4);
                    navigation.dispatch(popAction1);
                    navigation.navigate("information1");
                    break;
                case "recording-finish":
                    completeRecording();
                    break;
                case "inactive-background":
                default:
                    showAccidentModal(true);
                    break;
            }
        } catch (error) {
            Alert.alert("Camera Error", error?.message, [
                {
                    text: "OK",
                    onPress: () => onClose()
                }
            ]);
        }
    }

    const continueRecording = () => {
        setShowRecordingLoseConfirm(false);
        setShowModal(false);
    }

    const finishRecording = () => {
        setShowModal(false);
        recordInfoRef.current.stopType = 'recording-finish';
        cameraRef.current.stopRecording();
    }

    const completeRecording = () => {
        showAccidentModal(false);
        if (recordingClips.length === 0) {
            const now = new Date();
            dispatch(updateExamInfo('recordingDate', {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate()
            }))
        }
        dispatch(addRecordingClip({ uri: recordInfoRef.current.video.uri, length: duration / 1000 }))
        saveExamToLocalStorage();
        navigation.goBack();
        navigation.navigate("videoplayback");
    }

    const onCancel = () => {
        recordInfoRef.current.stopType = 'cancel';
        cameraRef.current.stopRecording();
    }

    const startAgain = () => {
        setShowRecordingLoseConfirm(false);
        recordInfoRef.current.stopType = 'start-again';
        cameraRef.current.stopRecording();
    }

    if (!permissionChecked) {
        return <View />;
    }

    if (permissionChecked && (!hasCameraPermission || !hasMicroPermission)) {
        return (
            <ErrorScreen
                message={!hasCameraPermission ? "No access to camera" : "No access to Microphone"}
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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <RNCamera
                style={{ flex: 1 }}
                type={cameraType}
                ref={cameraRef}
                captureAudio={true}
                keepAudioSession={true}
                onCameraReady={onCameraReady}
                onRecordingStart={() => {
                    recordInfoRef.current = {
                        startTime: new Date(),
                        isStarted: true,
                        stopType: ''
                    };
                }}
                onRecordingEnd={() => {
                    recordInfoRef.current.isStarted = false;
                }}
            >
                {
                    cameraReady && (
                        <LinearGradient
                            style={{
                                height: statusbarHeight + 110,
                                paddingHorizontal: Spacing.spacing_l,
                                paddingTop: Spacing.spacing_l + statusbarHeight,
                                flexDirection: 'row'
                            }}
                            colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']}
                        >
                            <View style={{ width: 20 }} />
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Typography color={Colors.white} type="large">{getTimeString(duration)}</Typography>
                            </View>
                            <TouchableOpacity onPress={() => setSwitchCameraConfirm(true)}>
                                <Icon name="camera-exchange" width={26} height={22} color={Colors.white} />
                            </TouchableOpacity>
                        </LinearGradient>
                    )
                }
            </RNCamera>
            {
                (cameraReady && duration >= 1000) ? (
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
                                    if (isAdditionalClip) showCancelModal(true);
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
                    </View>
                ) : null
            }

            {
                showModal && (
                    <CustomAlert
                        info={{
                            title: isAdditionalClip ? "End video clip" : "Have you completed your exam?",
                            description: isAdditionalClip ? "Are you sure you want to end recording this additional clip?" : "By clicking yes, it will end the recording and take you to the photo upload.",
                            buttons: [
                                {
                                    title: "No, continue",
                                    onPress: continueRecording,
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
                accidentModal && (
                    <CustomAlert
                        info={{
                            title: "There has been an issue with the recording.",
                            description: "Press end recording to save your recording so far and press the additional clip button to continue your exam. To delete your recording and start again press restart exam.",
                            buttons: [
                                {
                                    title: "Restart exam",
                                    onPress: startRecording,
                                    white: true
                                }, {
                                    title: "End recording",
                                    onPress: completeRecording
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
                                    onPress: onCancel
                                }
                            ]
                        }}
                    />
                )
            }

            {
                switchCameraConfirm && (
                    <CustomAlert
                        info={{
                            title: "Camera switching",
                            description: "Are you sure? This will restart the recording.",
                            buttons: [
                                {
                                    title: "No, continue",
                                    onPress: () => setSwitchCameraConfirm(false),
                                    white: true
                                }, {
                                    title: "Yes, switch",
                                    onPress: () => {
                                        setSwitchCameraConfirm(false);
                                        exchangeCamera();
                                    }
                                }
                            ]
                        }}
                    />
                )
            }
        </View >
    )
}

export default Screen;