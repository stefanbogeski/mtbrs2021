import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import descriptions from '../../../descriptions.json';
import BulletListItem from '../../components/BulletListItem';
import Button from '../../components/Buttons';
import Container from '../../components/Container';
import Expand from '../../components/Expands';
import Gap from '../../components/Gap';
import Typography, { Heading2 } from '../../components/Typography';
import Spacing from '../../layouts/spacing';

const openLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url)
        }
    })
}

const content = [
    {
        label: '1. Download a syllabus',
        renderContent: () => (
            <>
                <Typography type="small">Go to the syllabus page, select your instrument, download the required grade and its associated technical exercises and additional resources (if applicable).</Typography>
                <Gap height={Spacing.spacing_m} />
                <Button onPress={() => openLink('https://www.mtbexams.com/syllabuses/')} title="Syllabuses" />
            </>
        )
    },
    {
        label: '2. Register or login',
        renderContent: () => (
            <>
                <Typography type="small">{`To enter a candidate or submit an exam, you will first need to register.\n\nThere are three registration options for our users with different information required:\n`}</Typography>
                <BulletListItem>An Individual User: Can make exam entries and purchase books but cannot administer or submit an exam as they are not a verified MTB centre.</BulletListItem>
                <BulletListItem>An Individual Music Teacher: Can make exam entries, site purchases as well as record and submit exams.</BulletListItem>
                <BulletListItem>An organisation: Can make exam entries, site purchases as well as record and submit exams.</BulletListItem>
                <Gap height={Spacing.spacing_m} />
                <Button onPress={() => openLink('https://www.mtbexams.com/sign-up/')} title="Sign up" />
            </>
        )
    },
    {
        label: '3. Make an exam entry',
        renderContent: () => (
            <>
                <Typography type="small">Once logged in you will be able to enter candidates for an MTB exam via the ‘make an entry’ page and you will then receive your personalised front cover as a PDF with your order confirmation email.  (The teacher will need this Front Cover for verification purposes when recording the exam).</Typography>
                <Gap height={Spacing.spacing_m} />
                <Button onPress={() => openLink('https://www.mtbexams.com/make-an-entry/')} title="Make an entry" />
            </>
        )
    },
    {
        label: '4. Conduct the exam with your teacher',
        renderContent: () => (
            <>
                <Typography type="small">{`You must have a teacher present (in person or via video webcam) who is registered as an organisation or individual music teacher in order to conduct an MTB exam. If the teacher is physically present the exam should be recorded on their device and using their account.  If the exam is conducted remotely the candidate or candidate’s parents can download the app and submit the exam, they will need to register a standard user account to use the app.\n\nA printed copy of the front cover will also be required for the exam and the teacher and candidate/candidate’s parents will sign the verification statement at the end of the exam.  If the teacher is remote they will agree verbally.\n\nThe exam can be taken at any time within a year of entry. (You may decide to conduct the exam during the pupil’s normal lesson time).`}</Typography>
            </>
        )
    },
    {
        label: '5. Submit the exam',
        renderContent: () => (
            <>
                <Typography type="small">You can submit your exam recording using this app once you have completed the relevant photo and details section. You will also need to have your Teacher’s Centre ID Number when making the submission. This can be found on the account page on the MTB website. The exam recording will then be marked by one of our specialist examiners *</Typography>
            </>
        )
    },
    {
        label: '6. Receive your mark & certificate',
        renderContent: () => (
            <>
                <Typography type="small">{`You will receive the result via an email within approximately 2 weeks of submission**.\n\nThe certificate and exam marksheet will then be issued and posted (certificate delivery address can be confirmed during the submission stage).`}</Typography>
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
                    <Heading2>How it works</Heading2>
                    <Gap height={Spacing.spacing_l} />
                    <Typography
                        type="small"
                        color={Colors.grey1}
                    >{`${descriptions.howitworks1}\n`}</Typography>

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

                    <Typography
                        type="small"
                        color={Colors.grey1}
                    >{`\n* We have specialist examiners for each instrument we offer. i.e. a piano exam will only be marked by a pianist.\n\n** The result at this stage will be provisional. Results are confirmed upon receipt of your certificate.`}</Typography>
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