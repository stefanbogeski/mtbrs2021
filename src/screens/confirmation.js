import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Buttons';
import Container from '../components/Container';
import Diagram from '../components/Diagram';
import Gap from '../components/Gap';
import Icon from '../components/Icons';
import ImagePiece from '../components/ImagePiece';
import Typography, { Heading2 } from '../components/Typography';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import { attachFinished, deleteExamFromLocalStorage, getMTBClipName, saveExamToLocalStorage } from '../managers/exam';
import { getTimeString } from '../utils/time';
import { displayTotalSize } from '../utils/file';
import { deleteRecordedExam, setSavedExams, updateExamInfo, updateExamPiece } from '../redux/actions';
import CustomAlert from '../components/Alert';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';

const Screen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { statusbarHeight, recordingClips, examInfo, examMediaType, currentExam } = useSelector(state => state.appInfo);
    const { identification, otherAttachments, recordingDate, rootFolderName, pieces } = examInfo;
    const { year, month, day } = recordingDate;
    const [showDeleteExamAlert, setShowDeleteExamAlert] = useState(false);
    const [images, setImages] = useState([]);
    const [nameInputed, setNameInputed] = useState(true);
    const [attachmentInputed, setAttachmentInputed] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            let allNameInputed = true, allAttachment = true;
            for (var i = 0; i < pieces.length; i++) {
                if (!pieces[i].name) {
                    dispatch(updateExamPiece(i, "error", "Name of the piece is required."));
                    allNameInputed = false;
                } else {
                    dispatch(updateExamPiece(i, "error", ""));
                }

                if (i < 3) {
                    if (pieces[i].type !== 'MTB Book/Tomplay' && (!pieces[i].images || pieces[i].images.length === 0)) {
                        dispatch(updateExamPiece(i, "attacherror", "The attachment is required."));
                        allAttachment = false;
                    }
                } else {
                    dispatch(updateExamPiece(i, "attacherror", ""));
                }
            }
            setNameInputed(allNameInputed);
            setAttachmentInputed(allAttachment);

            if (examMediaType === 'video') {
                if (!identification) {
                    dispatch(updateExamInfo("identificationError", "Identification is required"))
                } else {
                    dispatch(updateExamInfo("identificationError", ""))
                }
            }
        }, [])
    )

    useEffect(() => {
        let imgs = [];
        pieces.forEach(piece => {
            if (piece.images) {
                imgs = [
                    ...imgs,
                    ...piece.images
                ]
            }
        })
        imgs = [
            ...imgs,
            ...otherAttachments
        ]
        setImages(imgs);
    }, [pieces, otherAttachments])

    const back = () => {
        navigation.goBack();
    }

    const save = () => {
        saveExamToLocalStorage().then(saved => {
            dispatch(setSavedExams(saved));
            dispatch(deleteRecordedExam());
            navigation.dispatch(StackActions.popToTop());
        });
    }

    const next = () => {
        if (examMediaType === 'audio') {
            if (attachFinished(pieces))
                navigation.navigate("confirmsubmission");
            else {
                navigation.navigate("pictureconfirmation");
            }
        } else {
            if ((identification) && attachFinished(pieces))
                navigation.navigate("confirmsubmission");
            else {
                navigation.navigate("pictureconfirmation");
            }
        }
    }

    const deleteExam = async () => {
        setShowDeleteExamAlert(true);
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l, flex: 1 }}>
                    <View>
                        <View
                            style={{
                                paddingTop: Spacing.spacing_l,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <TouchableOpacity onPress={back}>
                                <Icon
                                    name="arrow-back"
                                    width={10}
                                    height={20}
                                    color={Colors.grey3}
                                />
                            </TouchableOpacity>
                            <View style={Styles.full} />
                            <TouchableOpacity onPress={deleteExam}>
                                <Icon
                                    name="outline-minus"
                                    width={20}
                                    height={20}
                                    color={Colors.accent}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.center}>
                            <Heading2 color={Colors.accent1} align="center">{currentExam?.student?.full_name}</Heading2>
                            <Gap height={Spacing.spacing_s} />
                            <View style={[Styles.row, Styles.center]}>
                                <Typography
                                    type="small"
                                    color={Colors.grey1}
                                    align="center"
                                >{`${day}/${month}/${year}`}</Typography>
                                <View
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: Colors.grey1,
                                        marginHorizontal: Spacing.spacing_s
                                    }}
                                />
                                <Typography
                                    type="small"
                                    color={Colors.grey1}
                                    align="center"
                                >{currentExam?.reference}</Typography>
                            </View>
                        </View>
                    </View>
                    <Gap height={Spacing.spacing_xxl_2} />
                    <Diagram
                        data={[
                            {
                                title: 'Exam recording',
                                actionLbl: 'Review',
                                actionPress: () => navigation.navigate(`${examMediaType}playback`, { review: true }),
                                content: (
                                    <View>
                                        {
                                            recordingClips.map((clip, i) => (
                                                <View
                                                    style={{
                                                        paddingVertical: Spacing.spacing_l,
                                                        flexDirection: 'row'
                                                    }}
                                                    key={i}
                                                >
                                                    <Icon name={`${examMediaType}-file`} width={29} height={40} color={Colors.grey3} />
                                                    <Gap width={Spacing.spacing_l} />
                                                    <View style={[Styles.full, { justifyContent: 'center' }]}>
                                                        <Typography type="small">{getMTBClipName(i, recordingDate)}</Typography>
                                                        <View style={Styles.row}>
                                                            <Typography type="vsmall">Length: {getTimeString(examMediaType === 'video' ? clip.length * 1000 : clip.length)}</Typography>
                                                            <Gap width={Spacing.spacing_s} />
                                                            {
                                                                (examMediaType === 'video') && (
                                                                    <Typography
                                                                        type="vsmall"
                                                                    >Size: {displayTotalSize(clip.filesize)}</Typography>
                                                                )
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            ))
                                        }
                                    </View>
                                ),
                                finished: true
                            },
                            (examMediaType === 'video') ? (
                                {
                                    title: 'Identification',
                                    actionLbl: 'Edit',
                                    actionPress: () => navigation.navigate("pictureconfirmation"),
                                    content: (
                                        <View style={{ paddingVertical: Spacing.spacing_l }}>
                                            {
                                                identification ? (
                                                    <ImagePiece
                                                        uri={identification}
                                                        style={{ marginRight: 10 }}
                                                    />
                                                ) : (
                                                        <Typography type="small" color={Colors.accent}>&bull; Identification not entered.</Typography>
                                                    )
                                            }
                                        </View>
                                    ),
                                    finished: identification ? true : false
                                }
                            ) : null,
                            {
                                title: 'Attachments',
                                actionLbl: 'Edit',
                                actionPress: () => navigation.navigate("pictureconfirmation"),
                                content: (
                                    <View style={{ flexDirection: 'row', paddingVertical: Spacing.spacing_l, flexWrap: 'wrap' }}>
                                        {
                                            images.map((image, i) => (
                                                <View style={{ paddingBottom: 10 }} key={i}>
                                                    <ImagePiece
                                                        uri={image}
                                                        style={{ marginRight: 10 }}
                                                    />
                                                </View>
                                            ))
                                        }

                                        {!nameInputed && (
                                            <Typography type="small" color={Colors.accent}>&bull; Piece titles not entered.</Typography>
                                        )}

                                        {!attachmentInputed && (
                                            <Typography type="small" color={Colors.accent}>&bull; Attachments not entered.</Typography>
                                        )}
                                    </View>
                                ),
                                finished: attachFinished(pieces)
                            },
                            {
                                title: 'Confirm submission',
                                last: true,
                                content: (
                                    <View style={{ paddingVertical: Spacing.spacing_l }}>

                                    </View>
                                ),
                            },
                        ]}
                    />
                </View>
            </ScrollView>
            <View style={Styles.row}>
                <View style={Styles.full}>
                    <Button
                        title="Save for later"
                        onPress={save}
                        isWhite
                    />
                </View>
                <View style={Styles.full}>
                    <Button
                        title="Continue"
                        onPress={next}
                    />
                </View>
            </View>

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
                                    onPress: async () => {
                                        RNFS.unlink(`${DocumentDirectoryPath}/${rootFolderName}`).then(() => { }).catch(() => { });
                                        setShowDeleteExamAlert(false);
                                        dispatch(deleteRecordedExam());

                                        if (examInfo?.savedId) {
                                            const sExams = await deleteExamFromLocalStorage(examInfo.savedId);
                                            dispatch(setSavedExams(sExams));
                                        }

                                        navigation.dispatch(StackActions.popToTop());
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