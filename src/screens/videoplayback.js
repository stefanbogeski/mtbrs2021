import React, { useState } from 'react';
import { BackHandler, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../components/Container';
import Gap from '../components/Gap';
import Typography, { Heading2 } from '../components/Typography';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import descriptions from '../../descriptions.json';
import VideoPreview from '../components/VideoPreviewer';
import Button from '../components/Buttons';
import Colors from '../layouts/colors';
import { StackActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {
    deleteRecordingClip,
    updateRecordingClipInfo,
    deleteRecordedExam,
    updateExamInfo,
    setSavedExams
} from '../redux/actions';
import CustomAlert from '../components/Alert';
import {
    deleteExamFromLocalStorage,
    generateSavedExamId,
    getMTBClipName,
    saveExamToLocalStorage
} from '../managers/exam';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';

const Screen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { recordingClips, statusbarHeight, examInfo } = useSelector(state => state.appInfo);
    const { recordingDate, rootFolderName } = examInfo
    const [showDeleteClipAlert, setShowDeleteClipAlert] = useState(false);
    const [showDeleteExamAlert, setShowDeleteExamAlert] = useState(false);
    const [deleteClipNo, setDeleteClipNo] = useState();
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
        navigation.navigate('recordingvideo', { addition: true });
    }

    const deleteExam = async () => {
        await RNFS.unlink(`${DocumentDirectoryPath}/${rootFolderName}`);
        setShowDeleteExamAlert(false);
        dispatch(deleteRecordedExam());

        if (examInfo?.savedId) {
            const sExams = await deleteExamFromLocalStorage(examInfo.savedId)
            dispatch(setSavedExams(sExams));
        }

        navigation.dispatch(StackActions.popToTop());
    }

    const saveExam = () => {
        saveExamToLocalStorage().then(() => {
            navigation.navigate(isReview ? "confirmation" : "pictureconfirmation")
        });
    }

    const deleteClip = async (no) => {
        await RNFS.unlink(recordingClips[no].uri)
        dispatch(deleteRecordingClip(no));
        saveExamToLocalStorage();
    }

    const updateClipInfo = (no, name, val) => {
        dispatch(updateRecordingClipInfo(no, name, val));
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                    <Gap height={Spacing.spacing_xxl_3} />

                    <View style={Styles.center}>
                        <Heading2 color={Colors.accent1} align="center">Video playback</Heading2>
                        <Gap height={Spacing.spacing_s} />
                        <Typography
                            type="small"
                            color={Colors.grey1}
                            align="center"
                        >{descriptions.videoplayback}</Typography>
                    </View>
                </View>

                <Gap height={Spacing.spacing_xxl_3} />

                {
                    recordingClips.map((clip, i) => (
                        <View key={i}>
                            <TouchableOpacity onPress={() => navigation.navigate("videoplayer", { video: clip })}>
                                {
                                    i === 0 ? (
                                        <VideoPreview
                                            video={clip}
                                            height={175}
                                            onSetDuration={(dur) => updateClipInfo(i, "length", dur)}
                                            onSetFileSize={(size) => updateClipInfo(i, "filesize", size)}
                                            isPlayback
                                            title={getMTBClipName(i, recordingDate)}
                                        />
                                    ) : (
                                            <VideoPreview
                                                video={clip}
                                                height={175}
                                                onSetDuration={(dur) => updateClipInfo(i, "length", dur)}
                                                onSetFileSize={(size) => updateClipInfo(i, "filesize", size)}
                                                isPlayback
                                                title={getMTBClipName(i, recordingDate)}
                                                onDeleteClip={() => {
                                                    setDeleteClipNo(i);
                                                    setShowDeleteClipAlert(true);
                                                }}
                                            />
                                        )
                                }
                            </TouchableOpacity>
                            <Gap height={Spacing.spacing_xxl_3} />
                        </View>
                    ))
                }

                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                    <Typography
                        type="large"
                    >Add another clip to recording.</Typography>
                    <Gap height={Spacing.spacing_xs} />
                    <Typography
                        type="small"
                    >Did you get interrupted or forget to read out your verification statement?</Typography>
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
                    ) : (null)
                }
                <View style={{ flex: 1 }}>
                    <Button
                        title="Save"
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
        </Container>
    )
}

export default Screen;