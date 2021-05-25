import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../components/Buttons';
import Container from '../components/Container';
import Gap from '../components/Gap';
import Icon from '../components/Icons';
import Typography, { Heading2 } from '../components/Typography';
import Spacing from '../layouts/spacing';
import descriptions from '../../descriptions.json';
import Styles from '../layouts/styles';
import Colors from '../layouts/colors';
import Expand from '../components/Expands';

const Screen = () => {
    const { statusbarHeight, currentExam, recordingClips } = useSelector(state => state.appInfo);
    const navigation = useNavigation();

    const back = () => {
        navigation.goBack();
    }

    const confirm = () => {
        navigation.navigate("information1");
    }

    const getAddress = () => {
        const tks = currentExam?.certificate_postal_address;
        if (tks?.length) {
            let address = ''
            tks.forEach((tk, i) => {
                if (i !== 0) {
                    address += `\n`;
                }

                address += tk;
            })
            return address;
        } else {
            return tks
        }
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
                        <Heading2 color={Colors.accent1} align="center">Confirm entry</Heading2>
                        <Gap height={Spacing.spacing_s} />
                        <Typography
                            type="small"
                            color={Colors.grey1}
                            align="center"
                        >{currentExam.reference} ({currentExam.student.dob})</Typography>
                        <Gap height={Spacing.spacing_s} />
                        <Typography
                            type="small"
                            color={Colors.grey1}
                            align="center"
                        >{descriptions.confirmdetail}</Typography>
                    </View>

                    <Gap height={Spacing.spacing_xxl_2} />

                    <View>
                        <Typography type="large">Submission summary</Typography>
                        <Gap height={Spacing.spacing_xs} />
                        <Typography type="small">Candidate name</Typography>
                        <Typography color={Colors.grey1}>{currentExam?.student?.full_name}</Typography>

                        <Gap height={Spacing.spacing_l} />
                        <Typography type="small">Instrument</Typography>
                        <Typography color={Colors.grey1}>{currentExam?.instrument}</Typography>

                        <Gap height={Spacing.spacing_l} />
                        <Typography type="small">Grade</Typography>
                        <Typography color={Colors.grey1}>{currentExam?.grade}</Typography>

                        <Gap height={Spacing.spacing_l} />
                        <Typography type="small">Video or Audio?</Typography>
                        <Typography color={Colors.grey1}>{currentExam?.video_or_audio}</Typography>

                        <Gap height={Spacing.spacing_l} />
                        <Typography type="small">Practical or Performance?</Typography>
                        <Typography color={Colors.grey1}>{currentExam?.practical_or_performance}</Typography>

                        <Gap height={Spacing.spacing_l} />
                        <Typography type="small">Teacher name</Typography>
                        <Typography color={Colors.grey1}>{currentExam?.teacher?.full_name}</Typography>

                        <Gap height={Spacing.spacing_l} />
                        <Typography type="small">Conducted with Teacher?</Typography>
                        <Typography color={Colors.grey1}>{currentExam?.teacher_led}</Typography>

                        <Gap height={Spacing.spacing_l} />
                        <Typography type="small">Centre</Typography>
                        <Typography color={Colors.grey1}>{currentExam?.centre?.code}{currentExam?.centre?.name ? `-${currentExam?.centre?.name}` : ""}</Typography>
                    </View>

                    <Gap height={Spacing.spacing_xxl_2} />

                    <View>
                        <Typography type="large">Certificate postage shipping</Typography>
                        <Gap height={Spacing.spacing_xs} />
                        <Typography type="small">{currentExam?.student?.full_name}</Typography>
                        <Gap height={2} />
                        <Typography type="small" color={Colors.grey1}>{getAddress()}</Typography>
                    </View>

                    <Gap height={Spacing.spacing_xxl_2} />

                    <Expand label="Incorrect details?">
                        <Typography>{currentExam?.student?.full_name}</Typography>
                        <Typography
                            type="small"
                        >If the grade is incorrect please <Typography
                            type="small"
                            style={{ textDecorationLine: 'underline' }}
                            color={Colors.accent1}
                            onPress={() => Linking.openURL('https://www.mtbexams.com/contact/')}
                        >contact MTB</Typography> as the exam will need to be re-entered</Typography>

                        <Gap height={Spacing.spacing_l} />

                        <Typography>Something else incorrect?</Typography>
                        <Typography
                            type="small"
                        >If any of the other details are incorrect, please let us know in the submission note after recording the exam.</Typography>
                    </Expand>

                    <Gap height={Spacing.spacing_xxl_2} />
                </View>
            </ScrollView>
            <Button
                title="Confirm details"
                onPress={confirm}
            />
        </Container>
    )
}

export default Screen;