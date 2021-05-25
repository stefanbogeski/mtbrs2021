import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native'
import Video from 'react-native-video'
import { useNavigation } from '@react-navigation/native';
import Icon from './Icons';
import Colors from '../layouts/colors';
import { displayTotalSize } from '../utils/file';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import Typography from './Typography';
import { FlatButton } from './Buttons';
import Gap from './Gap';
import { getTimeString } from '../utils/time';

var RNFS = require('react-native-fs');

const VideoPreview = ({ 
    video, 
    height, 
    onSetDuration, 
    onSetFileSize,
    isPlayback, 
    title, 
    onDeleteClip
}) => {
    const url = video?.uri;
    const [filesize, setFilesize] = useState(0);
    const [duration, setDuration] = useState(0);
    const [paused, setPaused] = useState(false)

    async function initialize() {
        RNFS.stat(url).then(fileInfo => {
            setFilesize(fileInfo.size);
            if (onSetFileSize)  onSetFileSize(fileInfo.size);
        })
    }

    useEffect(() => {
        initialize();

        setTimeout(() => {
            setPaused(true);
        }, 10)
    }, []);

    useEffect(() => {
        initialize();
    }, [url])

    if (!url) return null;

    return (
        <View>
            <View style={styles.videoContainer}>
                <Video
                    source={{ uri: url }}
                    rate={1.0}
                    volume={1.0}
                    muted={true}
                    paused={paused}
                    resizeMode="contain"
                    style={{ width: '100%', height }}
                    onLoad={(payload) => {
                        setDuration(payload.duration);
                        if (onSetDuration) {
                            onSetDuration(payload.duration);
                        }
                    }}
                />
                <View style={styles.playBtnContainer}>
                    <View style={styles.playBtn}>
                        <Icon
                            name="play"
                            color={Colors.accent}
                            width={16}
                            height={25}
                        />
                    </View>
                </View>
            </View>
            {
                isPlayback ? (
                    <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                        <Gap height={Spacing.spacing_xs} />
                        {
                            title ? (
                                <Typography>{title}</Typography>
                            ) : null
                        }
                        <Gap height={Spacing.spacing_xxs} />
                        <View style={Styles.row}>
                            <View>
                                <Typography
                                    type="vsmall"
                                    color={Colors.grey1}
                                >Length: {getTimeString(duration * 1000)}</Typography>
                            </View>
                            <Gap width={Spacing.spacing_l} />
                            <View>
                                <Typography
                                    type="vsmall"
                                    color={Colors.grey1}
                                >Size: {displayTotalSize(filesize, 0)}</Typography>
                            </View>
                            <View style={Styles.full} />
                            {
                                onDeleteClip ? (
                                    <FlatButton
                                        title="Delete clip"
                                        onPress={onDeleteClip}
                                    />
                                ) : null
                            }
                        </View>
                    </View>
                ) : (
                        <View style={[Styles.row, { paddingHorizontal: Spacing.spacing_l }]}>
                            <View>
                                <Typography
                                    type="vsmall"
                                    color={Colors.grey1}
                                >Length: {getTimeString(duration * 1000)}</Typography>
                            </View>
                            <View style={Styles.full} />
                            <View>
                                <Typography
                                    type="vsmall"
                                    color={Colors.grey1}
                                >Size: {displayTotalSize(filesize, 0)}</Typography>
                            </View>
                        </View>
                    )
            }
        </View >
    )
}

export default VideoPreview;

const styles = StyleSheet.create({
    videoContainer: {
        backgroundColor: 'black',
    },
    playBtnContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    playBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        paddingLeft: 6,
        backgroundColor: Colors.white,
        ...Styles.center
    },
    videoInfo: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: Spacing.spacing_l
    }
})