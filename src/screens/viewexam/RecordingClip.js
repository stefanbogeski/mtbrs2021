import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Button from '../../components/Buttons';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import Typography from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import Styles from '../../layouts/styles';
import { getMTBClipName } from '../../managers/exam';
import { displayTotalSize } from '../../utils/file';
import { getTimeString } from '../../utils/time';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import CustomAlert from '../../components/Alert';

const RecordingClip = ({ clip, mediaType, no, recordingDate, onShare, onDelete }) => {
    const [hasLocalMedia, setHasLocalMedia] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        (async () => {
            const isExist = await RNFS.exists(clip.uri);
            if (isExist) {
                setHasLocalMedia(true)
            }
        })();
    }, [])

    return (
        <View>
            <View style={{ flexDirection: 'row', paddingVertical: Spacing.spacing_l }}>
                <Icon name={`${mediaType}-file`} width={29} height={40} color={Colors.grey3} />
                <Gap width={Spacing.spacing_l} />
                <View style={[Styles.full, { justifyContent: 'center' }]}>
                    <Typography type="small">{getMTBClipName(no, recordingDate)}</Typography>
                    <View style={Styles.row}>
                        <Typography type="vsmall">Length: {getTimeString(mediaType === 'video' ? clip.length * 1000 : clip.length)}</Typography>
                        <Gap width={Spacing.spacing_s} />
                        {
                            (mediaType === 'video') && (
                                <Typography
                                    type="vsmall"
                                >Size: {displayTotalSize(clip.filesize)}</Typography>
                            )
                        }
                    </View>
                </View>
            </View>
            {
                (hasLocalMedia && !clip.deleted) && (
                    <>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    title="Share"
                                    onPress={() => onShare()}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Button
                                    title="Remove"
                                    isWhite
                                    onPress={() => setShowDeleteModal(true)}
                                />
                            </View>
                        </View>
                        <Gap height={Spacing.spacing_xs} />
                    </>
                )
            }
            
            {
                showDeleteModal && (
                    <CustomAlert
                        info={{
                            title: "Are you sure?",
                            description: "You should only delete the clip once you have received your exam result.",
                            buttons: [
                                {
                                    title: "No",
                                    onPress: () => setShowDeleteModal(false),
                                    white: true
                                }, {
                                    title: "Yes, continue",
                                    onPress: async () => {
                                        await onDelete();
                                        setShowDeleteModal(false);
                                    }
                                }
                            ]
                        }}
                    />
                )
            }
        </View>
    )
}

export default RecordingClip;