import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient';
import { getTimeString } from '../utils/time';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Spacing from '../layouts/spacing';
import Colors from '../layouts/colors';
import Icon from '../components/Icons';
import Styles from '../layouts/styles';

let applying = false;

const Screen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const video = route.params.video;
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(true);
    const [duration, setDuration] = useState(0);
    const [current, setCurrent] = useState(0);
    const [seekWid, setSeekWid] = useState(0);
    const videoRef = useRef(null);
    const { statusbarHeight } = useSelector(state => state.appInfo);

    const play = () => {
        setPlaying(true);
    }

    const pause = () => {
        setPlaying(false);
    }

    const stop = () => {
        setPlaying(false);
        setCurrent(0);
        videoRef.current.seek(0);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Video
                source={{ uri: video.uri }}
                ref={videoRef}
                rate={1.0}
                volume={1.0}
                muted={false}
                resizeMode="cover"
                paused={!playing}
                onLoad={(payload) => {
                    setDuration(payload.duration * 1000);
                }}
                onProgress={(payload) => {
                    setCurrent(payload.currentTime * 1000);
                }}
                onEnd={() => {
                    stop();
                }}
                style={{ flex: 1 }}
                onReadyForDisplay={() => {
                    setLoading(false);
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    height: 110 + statusbarHeight,
                }}
            >
                <LinearGradient
                    style={{
                        height: statusbarHeight + 110,
                        paddingTop: (statusbarHeight + Spacing.spacing_l),
                        paddingLeft: Spacing.spacing_l
                    }}
                    colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon
                            name="close"
                            width={20}
                            height={20}
                            color={Colors.white}
                        />
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.51)']}
                    style={{ height: 160 }}
                >
                    <View style={{ padding: Spacing.spacing_l, flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                            <Text style={styles.timeS}>{getTimeString(current)}</Text>
                        </View>
                        {
                            playing ? (
                                <TouchableOpacity
                                    style={[styles.ppBtn, styles.pauseBtn]}
                                    onPress={() => pause()}
                                >
                                    <Icon
                                        name="pause"
                                        color={Colors.white}
                                        width={11}
                                        height={18}
                                    />
                                </TouchableOpacity>
                            ) : (
                                    <TouchableOpacity
                                        style={[styles.ppBtn, styles.playBtn]}
                                        onPress={() => play()}
                                    >
                                        <Icon
                                            name="play"
                                            color={Colors.accent}
                                            width={15}
                                            height={21}
                                        />
                                    </TouchableOpacity>
                                )
                        }
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Text style={styles.timeS}>{getTimeString(duration)}</Text>
                        </View>
                    </View>
                    <View style={{ paddingBottom: 40 }}>
                        <View
                            style={{ height: 20, justifyContent: 'center' }}
                            onLayout={(e) => setSeekWid(e.nativeEvent.layout.width - 20)}
                        >
                            <Slider
                                style={{ width: '100%', height: 20 }}
                                minimumValue={0}
                                maximumValue={duration}
                                value={current}
                                minimumTrackTintColor="#EE3E35"
                                maximumTrackTintColor="#FFFFFF"
                                thumbTintColor="#EE3E35"
                                onValueChange={
                                    async (val) => {
                                        if (applying) return;
                                        applying = true
                                        await videoRef.current.seek(val / 1000);
                                        applying = false;
                                    }
                                }
                            />
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </View >
    )
}

export default Screen;

const styles = StyleSheet.create({
    timeS: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },
    ppBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        ...Styles.center
    },
    playBtn: {
        backgroundColor: Colors.white,
        paddingLeft: 6
    },
    pauseBtn: {
        backgroundColor: Colors.accent
    }
})