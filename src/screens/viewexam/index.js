import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Container from '../../components/Container';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import Typography, { Heading2 } from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import descriptions from '../../../descriptions.json';
import Styles from '../../layouts/styles';
import Diagram from '../../components/Diagram';
import ImagePiece from '../../components/ImagePiece';
import { attachFinished, deleteRecordingClipOfSubmitExamRecord, selectSubmittedExam } from '../../managers/exam';
import { useNavigation, useRoute } from '@react-navigation/native';
import RecordingClip from './RecordingClip';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const Screen = () => {
    const { statusbarHeight } = useSelector(state => state.appInfo);
    const navigation = useNavigation();

    const [tRecordingClips, setTRecordingClips] = useState([]);
    const [tExamMediaType, setTExamMediaType] = useState("");
    const [tIdentification, setTIdentification] = useState("");
    const [tOtherAttachments, setTOtherAttachments] = useState([]);
    const [tRecordingDate, setTRecordingDate] = useState({});
    const [tSubmissionNote, setTSubmissionNote] = useState("");
    const [tPieces, setTPieces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attFinished, setAttFinished] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const route = useRoute();
    const examId = route.params.examId;

    useEffect(() => {
        (async () => {
            let exam = await selectSubmittedExam(examId);
            let { examMediaType, examInfo, recordingClips } = exam;
            setTRecordingClips(recordingClips);
            setTExamMediaType(examMediaType);
            if (examMediaType === 'video') {
                setTIdentification(examInfo.identification);
            }
            setTOtherAttachments(examInfo.otherAttachments);
            setTRecordingDate(examInfo.recordingDate);
            setTSubmissionNote(examInfo.submissionNote);
            setTPieces(examInfo.pieces);
            setAttFinished(attachFinished(examInfo.pieces));

            let imgs = [];
            examInfo.pieces.forEach(piece => {
                if (piece.images) {
                    imgs = [
                        ...imgs,
                        ...piece.images
                    ]
                }
            })
            imgs = [
                ...imgs,
                ...examInfo.otherAttachments
            ]
            setAttachments(imgs);

            setLoading(false);
        })();
    }, [])

    const back = () => {
        navigation.goBack();
    }

    if (loading) return null;

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l, flex: 1 }}>
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
                    <View>
                        <View style={Styles.center}>
                            <Heading2 color={Colors.accent1} align="center">Thanks for submitting an exam</Heading2>
                            <Gap height={Spacing.spacing_s} />
                            <Typography
                                type="small"
                                color={Colors.grey1}
                                align="center"
                            >{descriptions.uploadingfinished}</Typography>
                        </View>
                    </View>
                    <Gap height={Spacing.spacing_xxl_2} />
                    <Diagram
                        data={[
                            {
                                title: 'Exam recording',
                                content: (
                                    <View>
                                        {
                                            tRecordingClips.map((clip, i) => (
                                                <RecordingClip
                                                    clip={clip}
                                                    mediaType={tExamMediaType}
                                                    no={i}
                                                    recordingDate={tRecordingDate}
                                                    key={i}
                                                    onShare={async () => {
                                                        await Share.open({
                                                            url: clip.uri,
                                                            title: "Share",
                                                            failOnCancel: false
                                                        });
                                                    }}
                                                    onDelete={async () => {
                                                        await RNFS.unlink(clip.uri);
                                                        await deleteRecordingClipOfSubmitExamRecord(examId, i);
                                                        const rClips = [...tRecordingClips];
                                                        rClips[i].deleted = true;
                                                        setTRecordingClips(rClips);
                                                    }}
                                                />
                                            ))
                                        }
                                    </View>
                                ),
                                finished: true
                            },
                            (tExamMediaType === 'video') ? (
                                {
                                    title: 'Identification',
                                    content: (
                                        <View style={{ paddingVertical: Spacing.spacing_l }}>
                                            {
                                                tIdentification ? (
                                                    <ImagePiece
                                                        uri={tIdentification}
                                                        style={{ marginRight: 10 }}
                                                    />
                                                ) : null
                                            }
                                        </View>
                                    ),
                                    finished: tIdentification ? true : false
                                }
                            ) : null,
                            {
                                title: 'Attachments',
                                content: (
                                    <View style={{ flexDirection: 'row', paddingVertical: Spacing.spacing_l, flexWrap: 'wrap' }}>
                                        {
                                            attachments.map((image, i) => (
                                                <View style={{ paddingBottom: 10 }} key={i}>
                                                    <ImagePiece
                                                        uri={image}
                                                        style={{ marginRight: 10 }}
                                                    />
                                                </View>
                                            ))
                                        }
                                    </View>
                                ),
                                finished: attFinished
                            },
                            {
                                title: 'Confirm submission',
                                finished: true,
                                last: true,
                                content: (
                                    <View style={{ paddingVertical: Spacing.spacing_l }}>
                                        <Typography>Submission note</Typography>
                                        <Typography type="small" color={Colors.grey3}>{tSubmissionNote}</Typography>
                                        <Gap height={Spacing.spacing_l} />

                                        <Typography type="large">MTB's exam policies</Typography>
                                        <Gap height={Spacing.spacing_s} />
                                        <View style={Styles.row}>
                                            <View
                                                style={[{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: 8,
                                                    backgroundColor: Colors.green
                                                }, Styles.center]}
                                            >
                                                <Icon
                                                    name={"check"}
                                                    color="white"
                                                    width={8}
                                                    height={8}
                                                />
                                            </View>
                                            <Gap width={Spacing.spacing_s} />
                                            <Typography color={Colors.green}>Confirmed</Typography>
                                        </View>
                                    </View>
                                ),
                            },
                        ]}
                    />
                </View>
            </ScrollView>
        </Container>
    )
}

export default Screen;