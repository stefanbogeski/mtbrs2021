import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TextInput, View } from 'react-native';
import { ButtonWithIcon, FlatButton } from '../../components/Buttons';
import Gap from '../../components/Gap';
import ImagePiece from '../../components/ImagePiece';
import { RadioGroup } from '../../components/Radio';
import Typography from '../../components/Typography';
import Spacing from '../../layouts/spacing';
import Styles from '../../layouts/styles';
import RNFS from 'react-native-fs';
import Colors from '../../layouts/colors';

const PieceItem = ({ piece, onChangeName, onChangeType, onChangeImages, onDeletePiece, no }) => {
    const navigation = useNavigation();
    let { images, type, name, error, attacherror } = piece

    return (
        <View>
            <Gap height={Spacing.spacing_xxl_2} />
            <View style={[Styles.row, { alignItems: 'center' }]}>
                <Typography type="large">Upload piece {no + 1}</Typography>
                <View style={Styles.full} />
                {
                    no >= 3 ? (
                        <FlatButton
                            title="Delete piece"
                            onPress={() => onDeletePiece()}
                        />
                    ) : null
                }
            </View>
            <Gap height={Spacing.spacing_l} />
            <View style={Styles.row}>
                <Typography type="small">What piece is this?</Typography>
                <View style={Styles.full} />
                <FlatButton
                    title="More info"
                    onPress={() => navigation.navigate("piecemoreinfo")}
                />
            </View>

            <Gap height={Spacing.spacing_s} />

            <View>
                <Typography type="small">Name of the piece</Typography>
                <Gap height={Spacing.spacing_xxs} />

                <View
                    style={{
                        height: 56,
                        paddingHorizontal: 20,
                        justifyContent: 'center',
                        backgroundColor: Colors.grey5
                    }}
                >
                    <TextInput
                        value={name}
                        style={{
                            height: 28,
                            paddingVertical: 0,
                            fontSize: 16,
                        }}
                        onChangeText={(val) => onChangeName(val)}
                    />
                </View>
            </View>
            {
                error && !name ? (
                    <Typography type="small" color={Colors.accent}>{error}</Typography>
                ) : null
            }

            <View>
                <RadioGroup
                    radios={[
                        'MTB Book/Tomplay',
                        'MTB Syllabus List',
                        'Free Choice',
                        'Free Choice Pre-Approved'
                    ]}
                    defaultValue={piece.type}
                    onChange={async (type) => {
                        if (type === 'MTB Book/Tomplay') {
                            if (images && images.length) {
                                for (var i = 0; i < images.length; i++) {
                                    await RNFS.unlink(images[i])
                                }
                            }
                            onChangeImages([]);
                        }
                        onChangeType(type)
                    }}
                />
            </View>

            <Gap height={Spacing.spacing_s} />

            { type === 'MTB Book/Tomplay' && (
                <Typography>Music not required</Typography>
            )}

            {
                (type !== 'MTB Book/Tomplay' && images && images.length) ? (
                    <View style={[Styles.row, { flexWrap: 'wrap' }]}>
                        {
                            images.map((image, i) => (
                                <View
                                    style={{
                                        paddingRight: 10,
                                        paddingBottom: 10
                                    }}
                                    key={i}
                                >
                                    <ImagePiece
                                        uri={image}
                                        onDelete={async () => {
                                            await RNFS.unlink(images[i])
                                            images.splice(i, 1);
                                            onChangeImages(images);
                                        }}
                                    />
                                </View>
                            ))
                        }
                    </View>
                ) : null
            }

            { type !== 'MTB Book/Tomplay' &&
                <ButtonWithIcon
                    title={(images && images.length >= 1) ? "Add additional pages" : "Scan Music"}
                    icon="camera"
                    onPress={
                        () => {
                            navigation.navigate(
                                "takepicture",
                                {
                                    onDone: (uri) => {
                                        if (!images) images = [];
                                        images.push(uri);
                                        onChangeImages(images)
                                    },
                                    subdir: "book_pages"
                                }
                            );
                        }
                    }
                />
            }

            {
                attacherror && (!images || images.length === 0) ? (
                    <Typography type="small" color={Colors.accent}>{attacherror}</Typography>
                ) : null
            }
        </View>
    )
}

export default PieceItem