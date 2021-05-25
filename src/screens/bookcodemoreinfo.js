import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Container from '../components/Container';
import Gap from '../components/Gap';
import Icon from '../components/Icons';
import Typography, { Heading2 } from '../components/Typography';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import descriptions from '../../descriptions.json';

const Screen = () => {
    const {
        statusbarHeight,
    } = useSelector(state => state.appInfo);
    const navigation = useNavigation();

    const back = () => {
        navigation.goBack();
    }

    return (
        <Container pTop={statusbarHeight}>
            <ScrollView>
                <View style={{ paddingHorizontal: Spacing.spacing_l }}>
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
                        <Heading2 color={Colors.accent1} align="center">MTB Book Code</Heading2>
                    </View>

                    <View style={{ paddingVertical: Spacing.spacing_l, paddingHorizontal: Spacing.spacing_s }}>
                        {
                            descriptions.bookcodemoreinfo.map((item, i) => (
                                <View key={i}>
                                    <View
                                        style={[
                                            Styles.row,
                                            { marginBottom: Spacing.spacing_m }
                                        ]}
                                    >
                                        <Typography color={Colors.grey1}>{item.item}</Typography>
                                    </View>
                                    {
                                        item.children ? (
                                            <View style={{ paddingHorizontal: Spacing.spacing_s }}>
                                                {
                                                    item.children.map((subitem, j) => (
                                                        <View
                                                            style={[
                                                                Styles.row,
                                                                { marginBottom: Spacing.spacing_m }
                                                            ]}
                                                            key={`${i}-${j}`}
                                                        >
                                                            <View
                                                                style={{
                                                                    marginTop: 10,
                                                                    width: 6,
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    borderColor: Colors.grey1,
                                                                    borderWidth: 1
                                                                }}
                                                            />
                                                            <Gap width={Spacing.spacing_xs} />
                                                            <Typography color={Colors.grey1}>{subitem}</Typography>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        ) : null
                                    }
                                </View>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        </Container>
    )
}

export default Screen;