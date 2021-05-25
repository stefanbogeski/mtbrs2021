import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import Button from '../../components/Buttons';
import Container from '../../components/Container';
import Expand from '../../components/Expands';
import Gap from '../../components/Gap';
import Typography, { Heading2 } from '../../components/Typography';
import Spacing from '../../layouts/spacing';

const content = [
    {
        label: 'Q: What do I do if something goes wrong with my exam submission?',
        renderContent: () => (
            <Typography type="small">A: If the recording was completed and saved but not submitted then your recording should be in the ‘saved for later’ section on the homepage of the app. Tapping on the exam will give you the option to submit the exam. If it is not there, then check the ‘submitted’ exam section. If you are still unable to submit your recording, please call or email us using the contact form on the MTB website and we will advise you on how to proceed.</Typography>
        )
    },
    {
        label: 'Q: What do I do if something goes wrong with my exam recording?',
        renderContent: () => (
            <>
                <Typography type="small">{`A: If for some reason your exam recording fails midway through an exam then unfortunately you will need to retake the exam and restart the recording. If the recording fails due to a technical issue with the app rather than hardware or user error, then please let us know so that we can look into this.\n\nIf the recording was saved but an error occurred later in the submission process then please check the saved for later folder. If there are any issues around this area and you are unsure how to proceed then please call or email us for further guidance.`}</Typography>
            </>
        )
    },
    {
        label: 'Q: What devices can I use the MTB app with?',
        renderContent: () => (
            <Typography type="small">A: The MTB App can be used with any smartphone or tablet with an Apple IOS or an Android operating system.</Typography>
        )
    },
    {
        label: 'Q: What should I do if my exam reference does not work?',
        renderContent: () => (
            <Typography type="small">A: Your exam reference is found on your Exam Front Cover that can be downloaded straight after your exam entry or on your order confirmation email. If it does not work check you have copied it completely and correctly. If you are still unable to use your exam reference, please call or email us for further guidance.</Typography>
        )
    },
    {
        label: 'Q: Is the recording Audio or Video?',
        renderContent: () => (
            <Typography type="small">A: Our exams use audio recordings, not video.</Typography>
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