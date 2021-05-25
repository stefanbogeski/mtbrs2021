import React from 'react';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../components/Container';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import Typography, { Heading2 } from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import descriptions from '../../../descriptions.json';
import Styles from '../../layouts/styles';
import Button from '../../components/Buttons';
import { deleteRecordedExam, restartUploading, setSavedExams, setUploading, updateUploadingStatus } from '../../redux/actions';
import { saveExamToLocalStorage } from '../../managers/exam';

const Failed = () => {
    const { statusbarHeight, uploadingStatus } = useSelector(state => state.appInfo);
    const dispatch = useDispatch();

    const save = () => {
        saveExamToLocalStorage().then(saved => {
            dispatch(setSavedExams(saved));
            dispatch(deleteRecordedExam());
            dispatch(setUploading(0));
            dispatch(updateUploadingStatus("uStatus", ""));
        });
    }
    // Alert.alert("Error", uploadingStatus?.message);

    return (
        <Container pTop={statusbarHeight}>
            <View
                style={[
                    Styles.center,
                    Styles.full,
                    {
                        paddingHorizontal: Spacing.spacing_l
                    }
                ]}
            >
                <Icon
                    name="fail"
                    width={48}
                    height={48}
                    color={Colors.accent}
                />

                <Gap height={Spacing.spacing_m} />

                <Heading2
                    color={Colors.accent}
                >Upload failed</Heading2>

                <Gap height={Spacing.spacing_s} />

                <Typography
                    color={Colors.grey1}
                    type="small"
                    align="center"
                >{descriptions.uploadingfail}</Typography>

                <Gap height={Spacing.spacing_xxl_4} />

                <Button
                    title="Try again"
                    onPress={() => dispatch(restartUploading())}
                />

                <Gap height={Spacing.spacing_l} />

                <Button
                    title="Save for later"
                    isWhite
                    onPress={save}
                />
            </View>
        </Container>
    )
}

export default Failed;