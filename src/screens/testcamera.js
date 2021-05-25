import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Platform, BackHandler, Alert, AppState } from 'react-native'
import { RNCamera } from 'react-native-camera';
import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake'
import ErrorScreen from '../components/ErrorScreen';
import Colors from '../layouts/colors';
import Icon from '../components/Icons';
import Button from '../components/Buttons';
import LinearGradient from 'react-native-linear-gradient';
import Spacing from '../layouts/spacing';
import Typography from '../components/Typography';
import { getTimeString } from '../utils/time';
import { setTestedVideo } from '../redux/actions';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import CustomAlert from '../components/Alert';

const Screen = () => {
    const navigation = useNavigation();
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
    const [cameraReady, setCameraReady] = useState(false);
    const [duration, setDuration] = useState(0);
    const cameraRef = useRef(null);
    const { statusbarHeight } = useSelector(state => state.appInfo);
    const dispatch = useDispatch();
    const recordInfoRef = useRef({});

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMicroPermission, setHasMicroPermission] = useState(null);
    const [permissionChecked, setPermissionChecked] = useState(false);
    const [switchCameraConfirm, setSwitchCameraConfirm] = useState(false);

    const [accidentModal, showAccidentModal] = useState(false);
    const [started, setStarted] = useState(false);

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
            clearInterval(timer)
        }
    }, [])

    const _handleAppStateChange = (appState) => {
        if (!recordInfoRef.current.isStarted) return;
        if (appState.match(/inactive|background/)) {
            setSwitchCameraConfirm(false);
            recordInfoRef.current.stopType = 'inactive-background';
            cameraRef.current.stopRecording();
        }
    }

    const onClose = () => {
        navigation.goBack();
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
        try {
            setSwitchCameraConfirm(false);
            showAccidentModal(false);
            setDuration(0);
            recordInfoRef.current = {
                startTime: new Date(),
                isStarted: true
            };
            const v = await cameraRef.current.recordAsync({
                quality: RNCamera.Constants.VideoQuality['4:3'],
                videoBitrate: 1000000,
                codec: Platform.OS === 'ios' ? RNCamera.Constants.VideoCodec['HVEC'] : null
            });
            recordInfoRef.current.video = v;

            switch (recordInfoRef.current.stopType) {
                case "camera-switch":
                    break;
                case "recording-finish":
                    finish();
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
                    onPress: () => navigation.goBack()
                }
            ]);
        }
    }

    const stopRecording = () => {
        recordInfoRef.current.stopType = 'recording-finish';
        cameraRef.current.stopRecording();
    }

    const finish = () => {
        setSwitchCameraConfirm(false);
        showAccidentModal(false);
        dispatch(setTestedVideo(recordInfoRef.current.video));
        const popAction1 = StackActions.pop(1);
        navigation.dispatch(popAction1);
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
                onCameraReady={onCameraReady}
                keepAudioSession={true}
                captureAudio={true}
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
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
            >
                <Button
                    title="End video check"
                    onPress={stopRecording}
                />
            </View>

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

            {
                accidentModal && (
                    <CustomAlert
                        info={{
                            title: "There has been an issue with the recording.",
                            description: "Press end recording to save your recording so far. To delete your recording and start again press restart exam.",
                            buttons: [
                                {
                                    title: "Restart exam",
                                    onPress: startRecording,
                                    white: true
                                }, {
                                    title: "End recording",
                                    onPress: finish
                                }
                            ]
                        }}
                    />
                )
            }
        </View>
    )
}

export default Screen;