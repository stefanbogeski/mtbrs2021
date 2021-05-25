import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../components/Container';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import Typography, { Heading2 } from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import descriptions from '../../../descriptions.json';
import Styles from '../../layouts/styles';
import Button from '../../components/Buttons';
import Diagram from '../../components/Diagram';
import { screenHeight, windowHeight } from '../../layouts/layout';
import ImagePiece from '../../components/ImagePiece';
import { attachFinished, getMTBClipName, selectSubmittedExam } from '../../managers/exam';
import { getTimeString } from '../../utils/time';
import { displayTotalSize } from '../../utils/file';
import { setUploading, updateUploadingStatus } from '../../redux/actions';

const Finished = () => {
    const dispatch = useDispatch();
    const {
        statusbarHeight,
        selectedSubmittedExamId
    } = useSelector(state => state.appInfo);

    const [tRecordingClips, setTRecordingClips] = useState([]);
    const [tExamMediaType, setTExamMediaType] = useState("");
    const [tIdentification, setTIdentification] = useState("");
    const [tOtherAttachments, setTOtherAttachments] = useState([]);
    const [tPieces, setTPieces] = useState([]);
    const [tRecordingDate, setTRecordingDate] = useState({});
    const [tSubmissionNote, setTSubmissionNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [attFinished, setAttFinished] = useState(false);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        (async () => {
            const exam = await selectSubmittedExam(selectedSubmittedExamId);
            const { examMediaType, examInfo, recordingClips } = exam;
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

    const finish = () => {
        dispatch(updateUploadingStatus("uStatus", ""));
        dispatch(updateUploadingStatus("totalSize", 0));
        dispatch(updateUploadingStatus("message", 0));
        dispatch(updateUploadingStatus("uploadedSize", 0));
        dispatch(setUploading(0));
    }

    if (loading) return null;

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ minHeight: screenHeight - statusbarHeight }}>
                    <View style={{ paddingHorizontal: Spacing.spacing_l, flex: 1 }}>
                        <View style={{ height: Spacing.spacing_xxl_4 }} />
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
                                                    <View
                                                        style={{
                                                            paddingVertical: Spacing.spacing_l,
                                                            flexDirection: 'row'
                                                        }}
                                                        key={i}
                                                    >
                                                        <Icon name={`${tExamMediaType}-file`} width={29} height={40} color={Colors.grey3} />
                                                        <Gap width={Spacing.spacing_l} />
                                                        <View style={[Styles.full, { justifyContent: 'center' }]}>
                                                            <Typography type="small">{getMTBClipName(i, tRecordingDate)}</Typography>
                                                            <View style={Styles.row}>
                                                                <Typography type="vsmall">Length: {getTimeString(tExamMediaType === 'video' ? clip.length * 1000 : clip.length)}</Typography>
                                                                <Gap width={Spacing.spacing_s} />
                                                                {
                                                                    (tExamMediaType === 'video') && (
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
                </View>
            </ScrollView>
            <Button
                title="Finish"
                onPress={finish}
            />
        </Container>
    )
}

export default Finished;