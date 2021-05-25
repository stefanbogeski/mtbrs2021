import React, { useEffect, useRef, useState } from 'react';
import { Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Colors from '../layouts/colors';
import Styles from '../layouts/styles';
import { getTimeString } from '../utils/time';
import Typography, { Heading2 } from './Typography';
import CircleSlider from "./CircleSlider";
import Gap from './Gap';
import Spacing from '../layouts/spacing';
import Icon from './Icons';
import Slider from '@react-native-community/slider';
import HorizontalSeekbar from './HorizontalSeekbar';
import { screenWidth } from '../layouts/layout';
import { audioManager } from '../managers/audiomanager';
import { useNavigation } from '@react-navigation/native';

const AudioPlayer = ({ title, audio }) => {
    if (!audio) return null;
    const { uri, length } = audio;
    const [duration, setDuration] = useState(length);
    const [current, setCurrent] = useState(0);
    const [yCenter, setYCenter] = useState(0);
    const [xCenter, setXCenter] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [showSeekbar, setShowSeekbar] = useState(false);
    const [volume, setVolume] = useState(1.0);
    let seeking = useRef(false).current;
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', async () => {
            await audioManager.pausePlayer();
            setPlaying(false);
        });

        return async () => {
            unsubscribe();
            await audioManager.stopPlayer();
            audioManager.removePlayBackListener();
        }
    }, [])

    useEffect(() => {
        if (playing)
            audioManager.setVolume(volume);
    }, [volume])

    const startPlay = async () => {
        await audioManager.startPlayer(uri);
        audioManager.setVolume(volume);
        audioManager.addPlayBackListener(async (e) => {
            if (e.current_position === e.duration) {
                audioManager.removePlayBackListener()
                audioManager.stopPlayer().then(() => { }).catch(() => { });
                // await audioManager.pausePlayer();
                setShowSeekbar(false);
                setCurrent(0);
                setPlaying(false);
            } else {
                setCurrent(e.current_position);
                setDuration(e.duration);
            }
        });
        setShowSeekbar(true);
    }

    const onClickPlayBtn = async () => {
        if (!playing) {
            startPlay();
        } else {
            await audioManager.pausePlayer();
        }
        setPlaying(!playing);
    }

    return (
        <View>
            <View style={[Styles.row, { alignItems: 'flex-end' }]}>
                <Heading2 color={Colors.accent1}>{getTimeString(current)}</Heading2>
                <View style={Styles.full} />
                <Typography type="large">{getTimeString(duration)}</Typography>
            </View>

            <View style={{ alignItems: 'center' }}>
                <View
                    style={[
                        {
                            width: 200,
                            height: 200
                        },
                        Styles.center
                    ]}
                    onLayout={e => {
                        setYCenter(e.nativeEvent.layout.y + 100)
                        setXCenter(e.nativeEvent.layout.x + 100)
                    }}
                >
                    <CircleSlider
                        value={duration ? (current * 360 / duration) : 0}
                        meterColor={Colors.accent}
                        btnRadius={6}
                        dialRadius={85}
                        dialWidth={3}
                        strokeColor={Colors.grey4}
                        strokeWidth={3}
                        yCenter={yCenter}
                        xCenter={xCenter}
                    />
                    <View style={[{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }, Styles.center]}>
                        <TouchableWithoutFeedback onPress={onClickPlayBtn}>
                            <View
                                style={[{
                                    height: 128,
                                    width: 128,
                                    borderColor: Colors.accent,
                                    borderRadius: 64,
                                    borderWidth: 2,
                                    paddingLeft: playing ? 0 : 10,
                                    backgroundColor: playing ? Colors.accent : Colors.white
                                }, Styles.center]}
                            >
                                <Icon
                                    name={playing ? "pause" : "play"}
                                    color={playing ? Colors.white : Colors.accent}
                                    width={25}
                                    height={40}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                <Gap height={Spacing.spacing_xxl_3} />

                {title ? (
                    <View>
                        <Typography>{title}</Typography>
                        <Gap height={Spacing.spacing_xl} />
                    </View>
                ) : null}

                <View style={{ height: 24, width: '100%', alignItems: 'center' }}>
                    {
                        showSeekbar && (
                            <HorizontalSeekbar
                                width={screenWidth - 50}
                                height={24}
                                value={current}
                                min={0}
                                max={duration}
                                onValueChange={async (val) => {
                                    setCurrent(val);
                                    await audioManager.seekToPlayer(Platform.select({
                                        android: val / 1000,
                                        ios: val
                                    }))
                                }}
                            />
                        )
                    }
                </View>

                {
                    showSeekbar && (
                        <>
                            <Gap height={Spacing.spacing_xxl} />

                            <Typography type="small" align="center">touch bar to fast forward or rewind the examination</Typography>
                        </>
                    )
                }

                <Gap height={Spacing.spacing_xxl} />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setVolume(0)}>
                        <Icon
                            name="speaker-mute"
                            width={12}
                            height={16}
                            color={Colors.grey4}
                        />
                    </TouchableOpacity>
                    <Slider
                        value={volume}
                        style={{ flex: 1, height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor={Colors.accent}
                        maximumTrackTintColor={Colors.grey5}
                        onValueChange={(val) => setVolume(val)}
                        thumbTintColor={Colors.accent}
                    />
                    <TouchableOpacity onPress={() => setVolume(1)}>
                        <Icon
                            name="speaker"
                            width={19}
                            height={16}
                            color={Colors.grey4}
                        />
                    </TouchableOpacity>
                </View>
                <Gap height={Spacing.spacing_l} />
            </View>

            <Gap height={Spacing.spacing_xxl} />
        </View>
    )
}

export default AudioPlayer;