import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import ExamRecord from '../../components/ExamRecord';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import Typography from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import Styles from '../../layouts/styles';
import { selectSavedExam } from '../../managers/exam';
import { setCurrentExam, setExamInfo, setExamMediaType, setRecordingClips } from '../../redux/actions';
import descriptions from '../../../descriptions.json';

const SavedTab = () => {
    const { savedExams } = useSelector(state => state.appInfo);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const viewExamDetail = async (id) => {
        const exam = await selectSavedExam(id);
        const { currentExam, examMediaType, examInfo, recordingClips } = exam;
        dispatch(setCurrentExam(currentExam));
        dispatch(setExamMediaType(examMediaType));
        dispatch(setExamInfo(examInfo));
        dispatch(setRecordingClips(recordingClips));
        navigation.navigate("confirmation");
    }

    return (
        <View style={Styles.full}>
            {
                (savedExams && savedExams.length) ? (
                    <ScrollView>
                        {
                            savedExams.map((exam, i) => (
                                <View key={i}>
                                    <TouchableWithoutFeedback onPress={() => viewExamDetail(exam.id)}>
                                        <ExamRecord
                                            exam={exam}
                                            type="saved"
                                            moreAction={() => { }}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
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

                            <Typography align="center" color={Colors.grey3}>{descriptions.howtostart.saved}</Typography>
                        </View>
                    )
            }
        </View>
    )
}

export default SavedTab