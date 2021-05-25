import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getSession } from '../utils/session';
import { View, ActivityIndicator, NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { MTB_APP_LANDING } from '../layouts/constants';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecordedExam, setIsOnboarding, setPageLoading, setSavedExams, setSelectedSubmittedExamId, setSubmittedExams, updateExamInfo, updateUploadingStatus } from '../redux/actions';

import OnboardingScreen from '../screens/onboarding';
import HomeScreen from '../screens/home';
import ConfirmationScreen from '../screens/confirmation';
import ConfirmDetailScreen from '../screens/confirmdetail';
import Information1Screen from '../screens/information1';
import Information2Screen from '../screens/information2';
import Information3Screen from '../screens/information3';
import PictureConfirmationScreen from '../screens/pictureconfirmation';
import RecordingAudioScreen from '../screens/recordingaudio';
import RecordingVideoScreen from '../screens/recordingvideo';
import StartExamScreen from '../screens/startexam';
import TakePictureScreen from '../screens/takepicture';
import TestCameraScreen from '../screens/testcamera';
import CalibrateScreen from '../screens/calibrate';
import UploadingScreen from '../screens/uploading';
import VideoPlayBackScreen from '../screens/videoplayback';
import VideoPlayerScreen from '../screens/videoplayer';
import ConfirmSubmission from '../screens/confirmsubmission';
import AudioPlayBackScreen from '../screens/audioplayback';
import SideMenuScreen from '../screens/sidemenu';
import TakingTheExamScreen from '../screens/sidemenu/takingtheexam';
import RecordingadviceScreen from '../screens/sidemenu/recordingadvice';
import HowItWorksScreen from '../screens/sidemenu/howitworks';
import FAQsScreen from '../screens/sidemenu/faqs';
import ContactScreen from '../screens/sidemenu/contact';
import ViewExamScreen from '../screens/viewexam';

import BookcodeMoreinfoScreen from '../screens/bookcodemoreinfo';
import PieceMoreinfoScreen from '../screens/piecemoreinfo';

import { loadSavedExamsFromLocalStorage, saveSubmittedExamToLocalStorage } from '../managers/exam';
import { getFileNameFromUrl, getUrlExtension } from '../utils/file';
import { parseNumber } from '../utils/string';

const Stack = createStackNavigator();
const { MtbUploading } = NativeModules;

const Navigator = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const {
        isOnboarding,
        isUploading,
        uploadingStatus,
        recordingClips,
        currentExam,
        examMediaType,
        examInfo
    } = useSelector(state => state.appInfo);
    const { identification, otherAttachments, pieces, savedId, rootFolderName, mtbBookCode, rootRef, rootFolder } = examInfo;
    const { uStatus } = uploadingStatus;

    const init = async () => {
        const passedOnboarding = await getSession(MTB_APP_LANDING);
        dispatch(setIsOnboarding(passedOnboarding ? true : false));
        setLoading(false);
        SplashScreen.hide();
    }

    useEffect(() => {
        init();
        const eventEmitter = new NativeEventEmitter(MtbUploading);

        let eventListener = eventEmitter.addListener('change-status', (event) => {
            if (event.uStatus === "error" || event.uStatus === "uploading" || event.uStatus === "done") {
                dispatch(setPageLoading(false));
            }
            if (event.uStatus === "error") {
                dispatch(updateUploadingStatus("uStatus", "error"));
                dispatch(updateUploadingStatus("message", event.message));
                console.log("event.message = ", event.message)
                MtbUploading.stopUploading();
            } else if (event.uStatus === "uploading") {
                dispatch(updateUploadingStatus("uStatus", "uploading"));
                dispatch(updateUploadingStatus("totalSize", parseNumber(event.totalsize)));
                dispatch(updateUploadingStatus("uploadedSize", parseNumber(event.uploadedSize)));
            } else if (event.uStatus === "done") {
                (async () => {
                    const exams = await saveSubmittedExamToLocalStorage();
                    dispatch(setSubmittedExams(exams));
                    const sExams = await loadSavedExamsFromLocalStorage();
                    dispatch(setSavedExams(sExams));
                    dispatch(deleteRecordedExam());
                    MtbUploading.stopUploading();
                    dispatch(updateUploadingStatus("uStatus", "done"));
                    dispatch(updateUploadingStatus("message", event.message));
                })();
            }
        });

        return () => {
            if (eventListener) eventListener.remove();
        }
    }, [])

    useEffect(() => {
        if (isUploading) {
            startUploading();
        }
    }, [isUploading])

    const startUploading = async () => {
        dispatch(setPageLoading(true));
        const files = [], uploadPaths = [];

        let params = {
            reference: currentExam.reference,
            notes: examInfo.submissionNote,
            candidate_date_of_birth: currentExam.student.dob,
            book_code: mtbBookCode,
            book_pages: [],
            [examMediaType]: [],
            photo_id_path: ''
        }

        recordingClips.forEach((clip, i) => {
            files.push(clip.uri);
            const ref = `${rootRef}/audio_video/${getFileNameFromUrl(clip.uri)}`;
            uploadPaths.push(ref);

            params[`${examMediaType}`].push({ path: `/${ref}` });
        })

        if (identification) {
            files.push(identification);
            const ref = `${rootRef}/photo_id/${getFileNameFromUrl(identification)}`;
            uploadPaths.push(ref);
            params['photo_id_path'] = `/${ref}`;
        }

        if (pieces && pieces.length) {
            pieces.forEach((piece, i) => {
                if (piece.images && piece.images.length) {
                    piece.images.forEach((image, j) => {
                        files.push(image);
                        const ref = `${rootRef}/book_pages/${currentExam.reference}Piece_${i + 1}_${j + 1}.jpg`;
                        uploadPaths.push(ref);

                        params['book_pages'].push({
                            book_code: mtbBookCode,
                            path: `/${ref}`,
                            note: `${currentExam.reference}Piece_${i + 1}_${j + 1}`,
                            what_piece_is_this: piece.type,
                            name_of_piece: piece.name ? piece.name : ""
                        });
                    });
                } else {
                    params['book_pages'].push({
                        book_code: mtbBookCode,
                        what_piece_is_this: piece.type,
                        name_of_piece: piece.name ? piece.name : "",
                        note: `${currentExam.reference}Piece_${i + 1}`
                    });
                }
            });
        }

        if (otherAttachments && otherAttachments.length) {
            otherAttachments.forEach((attachment, i) => {
                files.push(attachment);
                const ref = `${rootRef}/book_pages/${currentExam.reference}OtherAttachment_${i + 1}.jpg`;
                uploadPaths.push(ref);

                params['book_pages'].push({
                    book_code: mtbBookCode,
                    path: `/${ref}`,
                    note: `${currentExam.reference}OtherAttachment_${i + 1}`,
                    name_of_piece: "Other attachment",
                    what_piece_is_this: ""
                });
            })
        }

        if (params['book_pages'].length === 0) {
            params.no_book_pages = true;
        }

        console.log("Parameters", JSON.stringify(params));
        MtbUploading.startUploading(
            Platform.select({
                android: JSON.stringify(files),
                ios: files
            }),
            Platform.select({
                android: JSON.stringify(uploadPaths),
                ios: uploadPaths
            }),
            currentExam.uuid,
            JSON.stringify(params)
        );
    }

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (!isOnboarding) { // landing page
        return (
            <NavigationContainer>
                <Stack.Navigator headerMode="none" initialRouteName="onboarding">
                    <Stack.Screen name="onboarding" component={OnboardingScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    if (uStatus === "uploading" || uStatus === "error" || uStatus === "done") {
        return (
            <NavigationContainer>
                <Stack.Navigator headerMode="none" initialRouteName="home">
                    <Stack.Screen name="uploading" component={UploadingScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" initialRouteName="home">
                <Stack.Screen name="home" component={HomeScreen} />
                <Stack.Screen name="startexam" component={StartExamScreen} />
                <Stack.Screen name="confirmdetail" component={ConfirmDetailScreen} />
                <Stack.Screen name="information1" component={Information1Screen} />
                <Stack.Screen name="information2" component={Information2Screen} />
                <Stack.Screen name="information3" component={Information3Screen} />
                <Stack.Screen name="recordingaudio" component={RecordingAudioScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="audioplayback" component={AudioPlayBackScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="takepicture" component={TakePictureScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="testcamera" component={TestCameraScreen} />
                <Stack.Screen name="calibrate" component={CalibrateScreen} />
                <Stack.Screen name="recordingvideo" component={RecordingVideoScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="videoplayer" component={VideoPlayerScreen} />
                <Stack.Screen name="videoplayback" component={VideoPlayBackScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="pictureconfirmation" component={PictureConfirmationScreen} />
                <Stack.Screen name="confirmation" component={ConfirmationScreen} />
                <Stack.Screen name="confirmsubmission" component={ConfirmSubmission} />
                <Stack.Screen name="viewexam" component={ViewExamScreen} />

                <Stack.Screen name="sidemenu" component={SideMenuScreen} />
                <Stack.Screen name="takingtheexam" component={TakingTheExamScreen} />
                <Stack.Screen name="recordingadvice" component={RecordingadviceScreen} />
                <Stack.Screen name="howitworks" component={HowItWorksScreen} />
                <Stack.Screen name="faqs" component={FAQsScreen} />
                <Stack.Screen name="contact" component={ContactScreen} />

                <Stack.Screen name="bookcodemoreinfo" component={BookcodeMoreinfoScreen} />
                <Stack.Screen name="piecemoreinfo" component={PieceMoreinfoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator;