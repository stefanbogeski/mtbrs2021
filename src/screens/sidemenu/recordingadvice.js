import React from 'react';
import { View, ScrollView } from 'react-native';
import Container from '../../components/Container';
import Gap from '../../components/Gap';
import Typography, { Heading2 } from '../../components/Typography';
import descriptions from '../../../descriptions.json';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Spacing from '../../layouts/spacing';
import Colors from '../../layouts/colors';
import Button from '../../components/Buttons';

const Screen = () => {
    const { statusbarHeight } = useSelector(state => state.appInfo);
    const navigation = useNavigation();

    const renderBullet = (item) => {
        const size = 8;
        switch (item.type) {
            case 1:
                return (
                    <View style={{ paddingLeft: Spacing.spacing_xxs, paddingRight: Spacing.spacing_s, paddingTop: 10 }}>
                        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: Colors.grey1 }} />
                    </View>
                )
            case 2:
                return (
                    <View style={{ paddingLeft: Spacing.spacing_xxl, paddingRight: Spacing.spacing_s, paddingTop: 10 }}>
                        <View style={{ width: size, height: size, borderRadius: size / 2, borderColor: Colors.grey1, borderWidth: 1 }} />
                    </View>
                )
            default:
                return null
        }
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
                    <Gap height={Spacing.spacing_xxl_4} />
                    <Heading2>Taking the exam</Heading2>
                    <Gap height={Spacing.spacing_l} />

                    <View>
                        {
                            descriptions.mtbexamsrecordingadvice.map((item, i) => (
                                <View key={i}>
                                    <View style={{ flexDirection: 'row', marginVertical: Spacing.spacing_xxs }}>
                                        {renderBullet(item)}
                                        <Typography color={Colors.grey1} style={{ flex: 1 }}>{item.msg}</Typography>
                                    </View>
                                </View>
                            ))
                        }
                    </View>

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