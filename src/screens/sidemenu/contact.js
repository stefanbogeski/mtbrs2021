import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../../components/Buttons';
import Container from '../../components/Container';
import Gap from '../../components/Gap';
import Typography, { Heading2 } from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';

const openLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url)
        }
    })
}

const Screen = () => {
    const { statusbarHeight } = useSelector(state => state.appInfo);
    const navigation = useNavigation();

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                    <Gap height={Spacing.spacing_xxl_4} />
                    <Heading2>How it works</Heading2>
                    <Gap height={Spacing.spacing_l} />

                    <Typography type="small">Please feel free to contact us using the messaging service if you have any queries, feedback or difficulties with the MTB Exam system or by the traditional methods below.</Typography>
                    <Gap height={Spacing.spacing_l} />
                    <Button onPress={() => openLink('https://www.mtbexams.com/contact/')} title="Contact form" />

                    <Gap height={Spacing.spacing_l} />
                    <Typography>By phone</Typography>
                    <TouchableOpacity onPress={() => openLink(`tel:+441189680910`)}>
                        <Typography type="vsmall" color={Colors.accent}>01189 680 910</Typography>
                    </TouchableOpacity>

                    <Gap height={Spacing.spacing_l} />
                    <Typography>By email</Typography>
                    <TouchableOpacity onPress={() => openLink(`mailto:enquiries@mtbexams.com`)}>
                        <Typography type="vsmall" color={Colors.accent}>enquiries@mtbexams.com</Typography>
                    </TouchableOpacity>

                    <Gap height={Spacing.spacing_l} />
                    <Typography>By post</Typography>
                    <Typography type="vsmall">MTB Exams, Gable House, 18-24 Turnham Green Terrace, Chiswick, London, W4 1QP</Typography>
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