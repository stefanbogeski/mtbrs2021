import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../components/Buttons';
import Container from '../components/Container';
import Gap from '../components/Gap';
import Icon from '../components/Icons';
import Typography, { Heading2 } from '../components/Typography';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import descriptions from '../../descriptions.json';
import VideoPreviewer from '../components/VideoPreviewer';

const Screen = () => {
    const {
        statusbarHeight,
        testedVideo,
        examMediaType
    } = useSelector(state => state.appInfo);
    const navigation = useNavigation();

    const back = () => {
        navigation.goBack();
    }

    const next = () => {
        navigation.navigate("information3");
    }

    const checkVideo = () => {
        navigation.navigate("testcamera");
    }

    const checkAudio = () => {
        navigation.navigate("calibrate");
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
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

                    <View style={Styles.center}>
                        <Heading2 color={Colors.accent1} align="center">Recording advice</Heading2>
                    </View>

                    <View style={{ paddingVertical: Spacing.spacing_l, paddingHorizontal: Spacing.spacing_s }}>
                        {
                            descriptions.recordingadvice[examMediaType].map((item, i) => (
                                <View key={i}>
                                    <View
                                        style={[
                                            Styles.row,
                                            { marginBottom: Spacing.spacing_m }
                                        ]}
                                    >
                                        <View
                                            style={{
                                                marginTop: 10,
                                                width: 6,
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: Colors.grey1
                                            }}
                                        />
                                        <Gap width={Spacing.spacing_xs} />
                                        <Typography color={Colors.grey1}>{item.item}</Typography>
                                    </View>
                                    {
                                        item.children ? (
                                            <View style={{ paddingHorizontal: Spacing.spacing_s }}>
                                                {
                                                    item.children.map((subitem, j) => (
                                                        <View
                                                            style={[
                                                                Styles.row,
                                                                { marginBottom: Spacing.spacing_m }
                                                            ]}
                                                            key={`${i}-${j}`}
                                                        >
                                                            <View
                                                                style={{
                                                                    marginTop: 10,
                                                                    width: 6,
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    borderColor: Colors.grey1,
                                                                    borderWidth: 1
                                                                }}
                                                            />
                                                            <Gap width={Spacing.spacing_xs} />
                                                            <Typography color={Colors.grey1}>{subitem}</Typography>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        ) : null
                                    }
                                </View>
                            ))
                        }
                    </View>
                </View>

                {
                    (examMediaType === 'video') ? (
                        <>
                            {
                                testedVideo ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("videoplayer", { video: testedVideo })}
                                        >
                                            <VideoPreviewer
                                                video={testedVideo}
                                                height={200}
                                            />
                                        </TouchableOpacity>
                                        <Gap height={Spacing.spacing_xxl} />
                                    </>
                                ) : null
                            }

                            <View style={{ paddingHorizontal: Spacing.spacing_l, marginBottom: Spacing.spacing_xxl_2 }}>
                                <Button
                                    title={testedVideo ? "Check video again" : "Check video camera"}
                                    isWhite={testedVideo ? true : false}
                                    border={testedVideo ? true : false}
                                    onPress={checkVideo}
                                />
                            </View>
                        </>
                    ) : (
                            <View style={{ paddingHorizontal: Spacing.spacing_l, marginBottom: Spacing.spacing_xxl_2 }}>
                                <Button
                                    title="Check recording levels"
                                    onPress={checkAudio}
                                />
                            </View>
                        )
                }
            </ScrollView>
            <Button
                title="Next"
                onPress={next}
            />
        </Container>
    )
}

export default Screen;