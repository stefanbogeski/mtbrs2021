import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../components/Container';
import Gap from '../components/Gap';
import Icon from '../components/Icons';
import Typography, { Heading2 } from '../components/Typography';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import { deleteRecordedExam, setCurrentExam, setExamMediaType, setPageLoading, setStatusbarStyle, updateExamInfo } from '../redux/actions';
import descriptions from '../../descriptions.json';
import Button, { FlatButton } from '../components/Buttons';
import TextInputMask from 'react-native-text-input-mask';
import CustomAlert from '../components/Alert';
import { getExamInfoAPI } from '../backend/exam';
import { getRandomString } from '../utils/string';
import { generateSavedExamId } from '../managers/exam';

const Screen = () => {
    const { statusbarHeight, savedExams } = useSelector(state => state.appInfo);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [examRef, setExamRef] = useState('');
    const [birthday, setBirthday] = useState('');
    const [lostRefModal, setLostRefModal] = useState(false);
    const birthdayRef = useRef();
    const inputExamRef = useRef();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(setStatusbarStyle('dark-content'));
        });

        return () => {
            dispatch(setStatusbarStyle('light-content'));
            unsubscribe();
        }
    }, [])

    const back = () => {
        navigation.goBack();
    }

    const cleanExamFolder = async (folder) => {
        try {
            var RNFS = require('react-native-fs');
            const fullPath = `${RNFS.DocumentDirectoryPath}/${folder}`;
            const isExist = await RNFS.exists(fullPath);
            if (isExist) {
                await RNFS.unlink(fullPath);
            }

            await RNFS.mkdir(fullPath);
            await RNFS.mkdir(`${fullPath}/audio_video`)
            await RNFS.mkdir(`${fullPath}/photo_id`)
            await RNFS.mkdir(`${fullPath}/book_pages`)
        } catch (error) {
            dispatch(setPageLoading(false));
            console.log("Error:", error);
        }
    }

    const next = () => {
        let error = null
        if (!examRef) {
            error = {
                ...error,
                ref: "Please enter an exam reference."
            }
            inputExamRef.current.focus();
        }

        if (!birthday) {
            error = {
                ...error,
                birthday: "Please enter a candidate birthday."
            }
            birthdayRef.current.focus();
        }

        if (birthday.length !== 10) {
            error = {
                ...error,
                birthday: "Please type a candidate birthday exactly."
            }
            birthdayRef.current.focus();
        }

        if (savedExams && savedExams.length) {
            savedExams.forEach((ex) => {
                if (ex.reference.toUpperCase() === examRef.toUpperCase()) {
                    error = {
                        ...error,
                        ref: "exam reference in use"
                    }
                }
            });
        }

        setErrors(error ? error : {});
        if (error) {
            return;
        }

        dispatch(deleteRecordedExam());
        dispatch(setPageLoading(true));
        getExamInfoAPI(examRef, birthday).then(res => {
            if (res.errors) {
                setErrors({
                    ref: res.errors?.reference,
                    birthday: res.errors?.candidate_date_of_birth
                })
                dispatch(setPageLoading(false));
                return;
            }
            const exam = res.exam;

            setErrors({});
            dispatch(setCurrentExam(exam));

            // set media type
            if (exam.allow_video) dispatch(setExamMediaType('video'))
            else dispatch(setExamMediaType('audio'))
            // dispatch(setExamMediaType('audio'))

            const examFolder = `${exam.reference}-${getRandomString(4)}`
            const now = new Date();
            const rootRef = `exams/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}/${exam.uuid}/uploads`;
            dispatch(updateExamInfo("rootFolderName", Platform.select({
                ios: `${examFolder}/${rootRef}`,
                android: examFolder
            })));
            dispatch(updateExamInfo("rootFolder", examFolder));
            dispatch(updateExamInfo("rootRef", rootRef));
            cleanExamFolder(Platform.select({
                ios: `${examFolder}/${rootRef}`,
                android: examFolder
            }));

            const sId = generateSavedExamId(4);
            dispatch(updateExamInfo('savedId', sId))
            navigation.navigate("confirmdetail");
            dispatch(setPageLoading(false));
        }).catch(error => {
            dispatch(setPageLoading(false))
            const errorMsg = error.toString();
            if (errorMsg.search("Network") >= 0) {
                setTimeout(() => {
                    Alert.alert("Error", "Error: No Internet Connection");
                }, 500)
            } else {
                setTimeout(() => {
                    Alert.alert("Error", errorMsg);
                }, 500)
            }
        })
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView nestedScrollEnabled={true}>
                <View style={{ paddingHorizontal: Spacing.spacing_l, flex: 1 }}>
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
                        <Heading2 color={Colors.accent1} align="center">Record an exam</Heading2>
                        <Gap height={Spacing.spacing_s} />
                        <Typography
                            type="small"
                            color={Colors.grey1}
                            align="center"
                        >{descriptions.startexam}</Typography>

                        <Gap height={Spacing.spacing_xxl_4} />

                        <View style={{ width: '100%' }}>
                            <View style={[Styles.row, { height: 28 }]}>
                                <Typography type="small">Exam ref number</Typography>
                                <View style={Styles.full} />
                                <FlatButton
                                    color={Colors.accent1}
                                    title="Lost ref number?"
                                    onPress={() => setLostRefModal(true)}
                                />
                            </View>
                            <View
                                style={{
                                    height: 56,
                                    paddingHorizontal: 20,
                                    justifyContent: 'center',
                                    backgroundColor: Colors.grey5
                                }}

                            >
                                <TextInput
                                    style={{
                                        height: 28,
                                        paddingVertical: 0,
                                        fontSize: 16,
                                    }}
                                    placeholderTextColor="gray"
                                    ref={inputExamRef}
                                    placeholder="MTBU00001"
                                    onChangeText={(val) => setExamRef(val)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => birthdayRef.current.focus()}
                                />
                            </View>
                            <View style={{ height: 28 }}>
                                <Typography type="vsmall" color={Colors.accent}>{errors.ref}</Typography>
                            </View>
                        </View>
                        <Gap height={Spacing.spacing_m} />

                        <View style={{ width: '100%' }}>
                            <View style={[Styles.row, { height: 28 }]}>
                                <Typography type="small">Candidate date of birth</Typography>
                            </View>
                            <View
                                style={{
                                    height: 56,
                                    paddingHorizontal: 20,
                                    justifyContent: 'center',
                                    backgroundColor: Colors.grey5
                                }}
                            >
                                <TextInputMask
                                    refInput={re => birthdayRef.current = re}
                                    style={{
                                        height: 28,
                                        paddingVertical: 0,
                                        fontSize: 16,
                                    }}
                                    placeholderTextColor="gray"
                                    keyboardType="number-pad"
                                    placeholder="DD/MM/YYYY"
                                    mask={"[00]/[00]/[0000]"}
                                    onChangeText={(formatted, extracted) => {
                                        setBirthday(formatted);
                                    }}
                                    returnKeyType="done"
                                    onSubmitEditing={next}
                                />
                            </View>
                            <View>
                                <Typography type="vsmall" color={Colors.accent}>{errors.birthday}</Typography>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Button
                title="Next"
                onPress={next}
            />

            {
                lostRefModal && (
                    <CustomAlert
                        info={{
                            title: "Lost ref number?",
                            description: "Your reference number is found on your pdf front cover emailed to the one who made the entry. If you have lost your number please contact us.",
                            buttons: [
                                {
                                    title: "Close",
                                    onPress: () => setLostRefModal(false),
                                    white: true
                                }
                            ]
                        }}
                    />
                )
            }
        </Container>
    )
}

export default Screen;