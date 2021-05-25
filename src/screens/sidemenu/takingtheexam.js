import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../../components/Buttons';
import Container from '../../components/Container';
import Gap from '../../components/Gap';
import Typography, { Heading2 } from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import descriptions from '../../../descriptions.json';
import BulletListItem from '../../components/BulletListItem';
import Expand from '../../components/Expands';

const content = [
    {
        label: '1. Login to the App and press ‘New Exam’',
        renderContent: () => (
            <>
                <Typography type="small">{`Read through the guidance information before the recording starts and use the storage and recording level checkers to avoid any issues in these areas.\n\nOnce these have been checked, press: ‘Record’ on the MTB App and once the timer starts state the following: candidate name, instrument, grade, teacher/assessor’s name and the exam reference number (see top of the front cover).`}</Typography>
            </>
        )
    },
    {
        label: '2. Ask the candidate to complete each element of the assessment',
        renderContent: () => (
            <>
                <Typography type="small">They may be performed in any order. Each element is also listed on the Front Cover. Ask the candidate to announce the title/exercise and perform:</Typography>
                <Gap height={Spacing.spacing_l} />
                <BulletListItem>Piece 1</BulletListItem>
                <BulletListItem>Piece 2</BulletListItem>
                <BulletListItem>Piece 3/study</BulletListItem>
                <BulletListItem>All of the scales/arpeggios etc. for this grade</BulletListItem>
                <BulletListItem>The technical exercises for this grade</BulletListItem>
                <BulletListItem>The reading skills for this grade</BulletListItem>
                <BulletListItem>The listening skills for this grade</BulletListItem>
            </>
        )
    },
    {
        label: '3. Complete the exam recording',
        renderContent: () => (
            <>
                <Typography type="small">Once you are sure all elements have been completed, end the recording by pressing finish. (Please note the recording cannot be paused and the exam must be completed in one session). You can then review the recording and save it.</Typography>
            </>
        )
    },
    {
        label: '4. Sign & take a picture of the Front Cover',
        renderContent: () => (
            <>
                <Typography type="small">{`Once the recording is saved, the candidate and teacher signs and dates the front cover where indicated and you are taken to the photo confirmation page of the app where you will need to take a picture of the signed front cover.\n\nIf the teacher is conducting the exam remotely over webcam then please read the confirmation statement at the bottom of the front cover and the teacher should verbally agree on the recording while just the candidate/parent signs the front cover.\n\nYou will also need to take a picture of any free choice pieces/studies used in the exam. Multiple pictures can be added here.`}</Typography>
            </>
        )
    },
    {
        label: '5. Save or submit the exam',
        renderContent: () => (
            <>
                <Typography type="small">You will then have the option to save the exam for later or submit it for marking. Please note that you will need an internet connection to submit the exam. Once submitted you will see a confirmation message and your exam will then be placed on the submitted section of the app.</Typography>
            </>
        )
    },
    {
        label: '6. Need help?',
        renderContent: (navigation) => (
            <>
                <Typography type="small">If you have any queries or need advice, please contact us using the Contact page on the website or call us on 0118 9680910.</Typography>
                <Gap height={Spacing.spacing_m} />
                <Button onPress={() => navigation.navigate('contact')} title="Contact us" />
            </>
        )
    }
]

const Screen = () => {
    const { statusbarHeight } = useSelector(state => state.appInfo);
    const navigation = useNavigation();
    const [activeExpand, setActiveExpand] = useState(-1);

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                    <Gap height={Spacing.spacing_xxl_4} />
                    <Heading2>Taking the exam</Heading2>
                    <Gap height={Spacing.spacing_l} />
                    <Typography
                        type="small"
                        color={Colors.grey1}
                    >{`${descriptions.takingtheexam1}\n\n${descriptions.takingtheexam2}\n\n${descriptions.takingtheexam3}\n`}</Typography>
                    {
                        descriptions["takingtheexam3-"].map((item, i) => (
                            <BulletListItem
                                key={i}
                            >{item}</BulletListItem>
                        ))
                    }

                    <Typography
                        type="small"
                        color={Colors.grey1}
                    >{`\n${descriptions.takingtheexam4}\n`}</Typography>

                    {
                        content.map((item, i) => (
                            <View key={i}>
                                <Expand
                                    label={item.label}
                                    value={activeExpand === i ? true : false}
                                    onChange={(expanded) => {
                                        if (expanded) {
                                            setActiveExpand(i)
                                        } else {
                                            if (activeExpand === i) setActiveExpand(-1);
                                        }
                                    }}
                                >{item.renderContent(navigation)}</Expand>
                                <Gap height={Spacing.spacing_xxs} />
                            </View>
                        ))
                    }

                    <Gap height={Spacing.spacing_l} />
                </View>
            </ScrollView>
            <Button
                title="Go back"
                onPress={() => navigation.goBack()}
            />
        </Container>
    )
}

export default Screen;