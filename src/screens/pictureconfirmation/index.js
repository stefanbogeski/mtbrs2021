import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Button, { ButtonWithIcon, FlatButton, SelectButton } from '../../components/Buttons';
import Container from '../../components/Container';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import Typography, { Heading2 } from '../../components/Typography';
import { screenHeight, windowHeight } from '../../layouts/layout';
import Spacing from '../../layouts/spacing';
import Styles from '../../layouts/styles';
import descriptions from '../../../descriptions.json';
import Expand from '../../components/Expands';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../layouts/colors';
import ImagePiece from '../../components/ImagePiece';
import { updateExamInfo } from '../../redux/actions';
import UploadPieces from './UploadPieces';
import RNFS from 'react-native-fs';

const exIdImg = require('../../assets/ex_id.png');
const exMusicImg = require('../../assets/ex_music.png');

const Screen = () => {
    const { statusbarHeight, examInfo, examMediaType } = useSelector(state => state.appInfo);
    const { identification, otherAttachments, mtbBookCode, identificationError } = examInfo;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [imgWidth, setImgWidth] = useState(0);

    const back = () => {
        navigation.goBack();
    }

    const next = () => {
        navigation.navigate("confirmation");
    }

    const changeIdentification = async (v) => {
        if (v === '') {
            await RNFS.unlink(identification)
        }
        dispatch(updateExamInfo("identification", v));
    }

    const addOtherAttach = (uri) => {
        dispatch(updateExamInfo("otherAttachments", [
            ...otherAttachments,
            uri
        ]));
    }

    const deleteOtherAttachment = async (no) => {
        await RNFS.unlink(otherAttachments[no]);
        const attaches = [...otherAttachments];
        attaches.splice(no, 1);
        dispatch(updateExamInfo("otherAttachments", attaches));
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                    <View>
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
                            <Heading2 color={Colors.accent1} align="center">Picture confirmation</Heading2>
                            <Gap height={Spacing.spacing_s} />
                            <Typography
                                type="small"
                                color={Colors.grey1}
                                align="center"
                            >{descriptions.pictureconfirmation[examMediaType]}</Typography>
                        </View>
                    </View>

                    <Gap height={Spacing.spacing_xxl_2} />

                    <Expand label="Picture guidance">
                        {
                            examMediaType === 'video' ? (
                                <>
                                    <View>
                                        <Typography>How to upload ID correctly</Typography>
                                        <Gap height={Spacing.spacing_xs} />
                                        <Typography
                                            type="small"
                                            color={Colors.grey1}
                                        >{descriptions.howuploadid}</Typography>
                                        <Gap height={Spacing.spacing_xs} />
                                        <View style={{ paddingHorizontal: Spacing.spacing_s }}>
                                            {
                                                descriptions.howuploadidcontent.map((item, i) => (
                                                    <View style={Styles.row} key={i}>
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
                                                        <Typography color={Colors.grey1}>{item}</Typography>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                        <Gap height={Spacing.spacing_m} />
                                        <View onLayout={e => setImgWidth(e.nativeEvent.layout.width)}>
                                            <Image
                                                source={exIdImg}
                                                style={{
                                                    width: imgWidth,
                                                    height: imgWidth * 352 / 480
                                                }}
                                            />
                                        </View>
                                        <Gap height={Spacing.spacing_xs} />
                                        <Typography
                                            type="vsmall"
                                            color={Colors.grey2}
                                        >Example image of identity</Typography>
                                    </View>

                                    <Gap height={Spacing.spacing_xxl} />
                                </>
                            ) : null
                        }
                        <View>
                            <Typography>How to upload your music correctly</Typography>
                            <Gap height={Spacing.spacing_xs} />
                            <Typography
                                type="small"
                                color={Colors.grey1}
                            >{descriptions.howtouploadmusic}</Typography>
                            <Gap height={Spacing.spacing_xs} />
                            <View style={{ paddingHorizontal: Spacing.spacing_s }}>
                                {
                                    descriptions.howtouploadmusiccontent.map((item, i) => (
                                        <View style={Styles.row} key={i}>
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
                                            <Typography color={Colors.grey1}>{item}</Typography>
                                        </View>
                                    ))
                                }
                            </View>
                            <Gap height={Spacing.spacing_m} />
                            <View>
                                <Image
                                    source={exMusicImg}
                                    style={{
                                        width: imgWidth,
                                        height: imgWidth * 352 / 480
                                    }}
                                />
                            </View>
                            <Gap height={Spacing.spacing_xs} />
                            <Typography
                                type="vsmall"
                                color={Colors.grey2}
                            >Example image of technical exercise</Typography>
                        </View>
                    </Expand>

                    <Gap height={Spacing.spacing_xxl_2} />

                    <View>
                        <View style={[Styles.row, { alignItems: 'center' }]}>
                            <Typography type="large">MTB Book Code</Typography>
                            <View style={Styles.full} />
                            <Typography
                                type="vsmall"
                                color={Colors.grey1}
                            >Optional</Typography>
                            <Gap width={Spacing.spacing_m} />
                            <FlatButton
                                title="More info"
                                onPress={() => navigation.navigate("bookcodemoreinfo")}
                            />
                        </View>

                        <Gap height={Spacing.spacing_xxs} />

                        <Typography
                            type="small"
                            color={Colors.grey1}
                        >If you’ve used pieces from an MTB book please enter the book code here.</Typography>

                        <Gap height={Spacing.spacing_m} />

                        <View
                            style={{
                                height: 56,
                                paddingHorizontal: 20,
                                justifyContent: 'center',
                                backgroundColor: Colors.grey5
                            }}
                        >
                            <TextInput
                                value={mtbBookCode}
                                style={{
                                    height: 28,
                                    paddingVertical: 0,
                                    fontSize: 16,
                                }}
                                onChangeText={(val) => dispatch(updateExamInfo('mtbBookCode', val))}
                            />
                        </View>
                    </View>

                    <Gap height={Spacing.spacing_xxl_2} />

                    {
                        (examMediaType === 'video') && (
                            <View>
                                <Typography type="large">Upload photo of identification</Typography>
                                <Gap height={Spacing.spacing_s} />
                                {
                                    identification ? (
                                        <ImagePiece
                                            uri={identification}
                                            onDelete={() => changeIdentification('')}
                                        />
                                    ) : (
                                            <ButtonWithIcon
                                                title="Scan identification"
                                                icon="camera"
                                                onPress={
                                                    () => {
                                                        navigation.navigate(
                                                            "takepicture",
                                                            {
                                                                onDone: (uri) => changeIdentification(uri),
                                                                filename: "identification",
                                                                subdir: "photo_id"
                                                            }
                                                        );
                                                    }
                                                }
                                            />
                                        )
                                }

                                {
                                    identificationError && !identification ? (
                                        <Typography type="small" color={Colors.accent}>{identificationError}</Typography>
                                    ) : null
                                }

                                <Gap height={Spacing.spacing_xxl_2} />
                            </View>
                        )
                    }

                    <View>
                        <UploadPieces />
                    </View>

                    <Gap height={Spacing.spacing_xxl_2} />

                    <View>
                        <Typography type="large">Any other attachments?</Typography>
                        <Gap height={Spacing.spacing_s} />
                        {
                            (otherAttachments && otherAttachments.length) ? (
                                <View style={[Styles.row, { flexWrap: 'wrap' }]}>
                                    {
                                        otherAttachments.map((attach, i) => (
                                            <View
                                                style={{
                                                    paddingRight: 10,
                                                    paddingBottom: 10
                                                }}
                                                key={i}
                                            >
                                                <ImagePiece
                                                    uri={attach}
                                                    onDelete={() => deleteOtherAttachment(i)}
                                                />
                                            </View>
                                        ))
                                    }
                                </View>
                            ) : null
                        }
                        <ButtonWithIcon
                            title="Scan attachment"
                            icon="camera"
                            onPress={
                                () => {
                                    navigation.navigate(
                                        "takepicture",
                                        {
                                            onDone: (uri) => addOtherAttach(uri),
                                            subdir: "book_pages"
                                        }
                                    );
                                }
                            }
                        />
                    </View>
                    <Gap height={Spacing.spacing_xxl_2} />
                </View>
            </ScrollView>
            <Button
                title="Next"
                onPress={next}
            />
        </Container>
    )
}

export default Screen;