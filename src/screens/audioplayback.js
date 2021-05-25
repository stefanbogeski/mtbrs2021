import React, { useState } from 'react';
import { BackHandler, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomAlert from '../components/Alert';
import Button, { FlatButton } from '../components/Buttons';
import Container from '../components/Container';
import Gap from '../components/Gap';
import Typography, { Heading2 } from '../components/Typography';
import { screenHeight } from '../layouts/layout';
import Spacing from '../layouts/spacing';
import descriptions from '../../descriptions.json';
import { StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../layouts/colors';
import Styles from '../layouts/styles';
import Icon from '../components/Icons';
import { getTimeString } from '../utils/time';
import { deleteRecordedExam, deleteRecordingClip, setSavedExams, updateExamInfo } from '../redux/actions';
import AudioPlayer from '../components/AudioPlayer';
import { deleteExamFromLocalStorage, generateSavedExamId, getMTBClipName, saveExamToLocalStorage } from '../managers/exam';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';

const Screen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {
        statusbarHeight,
        recordingClips,
        examInfo
    } = useSelector(state => state.appInfo);
    const { recordingDate, rootFolderName } = examInfo;
    const [showDeleteClipAlert, setShowDeleteClipAlert] = useState(false);
    const [showDeleteExamAlert, setShowDeleteExamAlert] = useState(false);
    const [deleteClipNo, setDeleteClipNo] = useState();
    const [showAudioDetail, setShowAudioDetail] = useState(false);
    const [audioPlayerInfo, setAudioPlayerInfo] = useState(null);
    const route = useRoute();
    const isReview = route.params?.review;

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        })
    )

    const addClip = () => {
        navigation.navigate('recordingaudio', { addition: true });
    }

    const deleteExam = async () => {
        await RNFS.unlink(`${DocumentDirectoryPath}/${rootFolderName}`);
        setShowDeleteExamAlert(false);
        dispatch(deleteRecordedExam());

        if (examInfo?.savedId) {
            const sExams = await deleteExamFromLocalStorage(examInfo?.savedId)
            dispatch(setSavedExams(sExams));
        }

        navigation.dispatch(StackActions.popToTop());
    }

    const saveExam = async () => {
        saveExamToLocalStorage().then((sExams) => {
            navigation.navigate(isReview ? "confirmation" : "pictureconfirmation")
        });
    }

    const deleteClip = async (no) => {
        await RNFS.unlink(recordingClips[no].uri);
        dispatch(deleteRecordingClip(no));
        saveExamToLocalStorage();
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                    {
                        recordingClips.length > 1 ? (
                            <View>
                                <Gap height={Spacing.spacing_xxl_3} />

                                <View style={Styles.center}>
                                    <Heading2 color={Colors.accent1} align="center">Audio playback</Heading2>
                                    <Gap height={Spacing.spacing_s} />
                                    <Typography
                                        type="small"
                                        color={Colors.grey1}
                                        align="center"
                                    >{descriptions.audioplayback}</Typography>
                                </View>

                                <Gap height={Spacing.spacing_xl} />

                                {
                                    recordingClips.map((clip, i) => (
                                        <View key={i}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setAudioPlayerInfo({
                                                        title: getMTBClipName(i, recordingDate),
                                                        audio: clip,
                                                        clipNo: i
                                                    })
                                                    setShowAudioDetail(true);
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: '100%',
                                                        flexDirection: 'row',
                                                        marginVertical: Spacing.spacing_s,
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <View style={[{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 24,
                                                        borderColor: Colors.accent,
                                                        borderWidth: 1,
                                                        paddingLeft: 3
                                                    }, Styles.center]}>
                                                        <Icon
                                                            name="play"
                                                            width={10}
                                                            height={14}
                                                            color={Colors.accent}
                                                        />
                                                    </View>
                                                    <Gap width={Spacing.spacing_l} />
                                                    <View style={Styles.full}>
                                                        <Typography
                                                            type="small"
                                                        >{getMTBClipName(i, recordingDate)}</Typography>
                                                        <View style={Styles.row}>
                                                            <Typography
                                                                type="vsmall"
                                                                color={Colors.grey1}
                                                            >Length: {getTimeString(clip.length)}</Typography>
                                                            <View style={Styles.full} />
                                                            {
                                                                i > 0 ? (
                                                                    <FlatButton
                                                                        title="Delete clip"
                                                                        onPress={() => {
                                                                            setDeleteClipNo(i);
                                                                            setShowDeleteClipAlert(true);
                                                                        }}
                                                                    />
                                                                ) : null
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                }

                                <Gap height={Spacing.spacing_xxl_3} />
                            </View>
                        ) : (
                                <View>
                                    <Gap height={Spacing.spacing_xxl_3} />
                                    <AudioPlayer
                                        audio={recordingClips[0]}
                                    />
                                </View>
                            )
                    }
                </View>

                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                    <Typography
                        type="large"
                    >Add another clip to recording.</Typography>
                    <Gap height={Spacing.spacing_xs} />
                    <Typography
                        type="small"
                    >Did you get interrupted or forgot to read out your verification statements?</Typography>
                    <Gap height={Spacing.spacing_xl} />
                    <Button
                        title="Add clip to exam recording"
                        isWhite
                        border
                        onPress={addClip}
                    />
                </View>

                <Gap height={Spacing.spacing_xxl_3} />
            </ScrollView>
            <View style={Styles.row}>
                {
                    !isReview ? (
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Delete exam"
                                isWhite
                                onPress={() => setShowDeleteExamAlert(true)}
                            />
                        </View>
                    ) : null
                }
                <View style={{ flex: 1 }}>
                    <Button
                        title="Save exam"
                        onPress={saveExam}
                    />
                </View>
            </View>

            {
                showDeleteClipAlert && (
                    <CustomAlert
                        info={{
                            title: "Are you sure?",
                            description: "You will lose your current recording.",
                            buttons: [
                                {
                                    title: "No",
                                    white: true,
                                    onPress: () => setShowDeleteClipAlert(false)
                                },
                                {
                                    title: "Yes, continue",
                                    onPress: () => {
                                        setShowDeleteClipAlert(false);
                                        deleteClip(deleteClipNo);
                                    }
                                }
                            ]
                        }}
                    />
                )
            }

            {
                showDeleteExamAlert && (
                    <CustomAlert
                        info={{
                            title: "Are you sure?",
                            description: "You will lose your all recordings.",
                            buttons: [
                                {
                                    title: "No",
                                    white: true,
                                    onPress: () => setShowDeleteExamAlert(false)
                                },
                                {
                                    title: "Yes, continue",
                                    onPress: deleteExam
                                }
                            ]
                        }}
                    />
                )
            }

            {
                (showAudioDetail && audioPlayerInfo) ? (
                    <View style={[Styles.fullcontainer, { backgroundColor: Colors.white }]}>
                        <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                            <Gap height={Spacing.spacing_xxl_3} />
                            <AudioPlayer
                                title={audioPlayerInfo.title}
                                audio={audioPlayerInfo.audio}
                            />
                        </View>

                        <View style={Styles.full} />

                        {
                            (audioPlayerInfo.clipNo === 0) ? (
                                <Button
                                    title="Save clip"
                                    onPress={() => {
                                        setAudioPlayerInfo(null);
                                        setShowAudioDetail(false);
                                    }}
                                />
                            ) : (
                                    <View style={Styles.row}>
                                        <View style={{ flex: 1 }}>
                                            <Button
                                                title="Delete clip"
                                                isWhite
                                                onPress={() => {
                                                    setDeleteClipNo(audioPlayerInfo.clipNo);
                                                    setShowDeleteClipAlert(true);
                                                    setAudioPlayerInfo(null);
                                                    setShowAudioDetail(false);
                                                }}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Button
                                                title="Save clip"
                                                onPress={() => {
                                                    setAudioPlayerInfo(null);
                                                    setShowAudioDetail(false);
                                                }}
                                            />
                                        </View>
                                    </View>
                                )
                        }
                    </View>
                ) : null
            }
        </Container>
    )
}

export default Screen;