import React, { useEffect } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Buttons';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import { Heading1 } from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import Styles from '../../layouts/styles';
import { setStatusbarStyle } from '../../redux/actions';

const Screen = () => {
    const { statusbarHeight } = useSelector(state => state.appInfo);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(setStatusbarStyle('dark-content'));
        });

        return () => {
            dispatch(setStatusbarStyle('light-content'));
            unsubscribe();
        }
    }, [])

    return (
        <View style={[Styles.full, { backgroundColor: Colors.accent }]}>
            {/* Header */}
            <View
                style={{
                    paddingTop: statusbarHeight,
                    paddingHorizontal: Spacing.spacing_l
                }}
            >
                <View
                    style={{
                        height: 84,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Icon
                        name="app-logo"
                        color1={Colors.white}
                        color2={Colors.white}
                        width={88}
                        height={48}
                    />
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon
                            name="close"
                            width={28}
                            height={28}
                            color={Colors.white}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Gap height={Spacing.spacing_xxl_3} />

            <View style={{ paddingHorizontal: Spacing.spacing_l, flex: 1 }}>
                <TouchableOpacity onPress={() => navigation.navigate("takingtheexam")}>
                    <Heading1 color={Colors.white}>Taking the exam</Heading1>
                </TouchableOpacity>

                <Gap height={Spacing.spacing_xxl_2} />

                <TouchableOpacity onPress={() => navigation.navigate("recordingadvice")}>
                    <Heading1 color={Colors.white}>Recording Advice</Heading1>
                </TouchableOpacity>

                <Gap height={Spacing.spacing_xxl_2} />

                <TouchableOpacity onPress={() => navigation.navigate("howitworks")}>
                    <Heading1 color={Colors.white}>How it works</Heading1>
                </TouchableOpacity>

                <Gap height={Spacing.spacing_xxl_2} />

                <TouchableOpacity onPress={() => navigation.navigate("faqs")}>
                    <Heading1 color={Colors.white}>FAQs</Heading1>
                </TouchableOpacity>

                <Gap height={Spacing.spacing_xxl_2} />

                <TouchableOpacity onPress={() => navigation.navigate("contact")}>
                    <Heading1 color={Colors.white}>Contact</Heading1>
                </TouchableOpacity>

                <View style={Styles.full} />

                <Button
                    title="Visit website"
                    border
                    onPress={() => Linking.openURL('https://www.mtbexams.com')}
                />

                <Gap height={Spacing.spacing_xxl_2} />
            </View>
        </View>
    )
}

export default Screen;