import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import ExamRecord from '../../components/ExamRecord';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import Typography, { Heading3 } from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import Styles from '../../layouts/styles';
import descriptions from '../../../descriptions.json';

const SavedTab = () => {
    const { submittedExams } = useSelector(state => state.appInfo);
    const navigation = useNavigation();

    return (
        <View style={Styles.full}>
            {
                (submittedExams && submittedExams.length) ? (
                    <ScrollView>
                        {
                            submittedExams.map((exam, i) => (
                                <TouchableWithoutFeedback
                                    key={i}
                                    onPress={() => navigation.navigate("viewexam", { examId: exam.id })}
                                >
                                    <ExamRecord
                                        exam={exam}
                                        type="submitted"
                                        moreAction={() => { }}
                                    />
                                </TouchableWithoutFeedback>
                            ))
                        }
                    </ScrollView>
                ) : (
                        <View
                            style={[
                                Styles.full,
                                Styles.center,
                                { paddingHorizontal: Spacing.spacing_l }
                            ]}
                        >
                            <Icon
                                name="audio"
                                width={34}
                                height={48}
                                color={Colors.grey3}
                            />

                            <Gap height={Spacing.spacing_xxl} />

                            <Typography align="center" color={Colors.grey3}>{descriptions.howtostart.submitted}</Typography>
                        </View>
                    )
            }
        </View>
    )
}

export default SavedTab