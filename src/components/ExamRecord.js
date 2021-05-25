import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import Gap from './Gap';
import Icon from './Icons';
import Typography from './Typography';

const ExamRecord = ({ exam, type, onPress, moreAction }) => {
    if (type === 'saved') {
        const { percent, candidateName, date } = exam;

        return (
            <View
                style={{
                    paddingHorizontal: Spacing.spacing_l,
                    width: '100%'
                }}
            >
                <Gap height={Spacing.spacing_l} />
                <View style={[Styles.row, Styles.center]}>
                    <ProgressCircle
                        percent={percent}
                        radius={27}
                        borderWidth={2}
                        color={Colors.green}
                        shadowColor={Colors.grey3}
                        bgColor="#fff"
                    >
                        <Typography
                            type="small"
                            color={Colors.green}
                        >{percent}%</Typography>
                    </ProgressCircle>

                    <Gap width={Spacing.spacing_l} />

                    <View style={{ flex: 1 }}>
                        <Typography>{candidateName}</Typography>
                        <Typography type="small">{date?.day}/{date?.month}/{date?.year}</Typography>
                    </View>

                    {
                        moreAction ? (
                            <TouchableOpacity
                                style={{ paddingHorizontal: 10 }}
                            >
                                <Icon
                                    name="more"
                                    width={4}
                                    height={20}
                                    color={Colors.accent}
                                />
                            </TouchableOpacity>
                        ) : null
                    }
                </View>
                <Gap height={Spacing.spacing_l} />
                <View style={{ height: 1, backgroundColor: Colors.grey4 }} />
            </View>
        )
    }

    const { recordingType, candidateName, date } = exam;
    return (
        <View
            style={{
                paddingHorizontal: 20,
                width: '100%'
            }}
        >
            <Gap height={Spacing.spacing_l} />
            <View style={[Styles.row, Styles.center]}>
                <View
                    style={[{
                        width: 54,
                        height: 54
                    }, Styles.center]}
                >
                    <Icon name={`${recordingType}-file`} width={29} height={40} color={Colors.grey3} />
                </View>

                <Gap width={Spacing.spacing_l} />

                <View style={{ flex: 1 }}>
                    <Typography>{candidateName}</Typography>
                    <Typography type="small">{date?.day}/{date?.month}/{date?.year}</Typography>
                </View>

                {
                    moreAction ? (
                        <TouchableOpacity
                            style={{ paddingHorizontal: 10 }}
                        >
                            <Icon name="more" width={4} height={20} color={Colors.accent} />
                        </TouchableOpacity>
                    ) : null
                }
            </View>
            <Gap height={Spacing.spacing_l} />
            <View style={{ height: 1, backgroundColor: Colors.grey4 }} />
        </View>
    )
}

export default ExamRecord;
