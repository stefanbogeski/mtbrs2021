import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonWithIcon } from '../../components/Buttons';
import Icon from '../../components/Icons';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import Styles from '../../layouts/styles';
import SavedTab from './Saved';
import SubmittedTab from './Submitted';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Typography from '../../components/Typography';
import { setStatusbarStyle } from '../../redux/actions';

const Tab = createMaterialTopTabNavigator();

const Screen = () => {
    const { statusbarHeight } = useSelector(state => state.appInfo);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(setStatusbarStyle('light-content'));
        });

        return () => {
            dispatch(setStatusbarStyle('dark-content'));
            unsubscribe();
        }
    }, [])

    const startExam = () => {
        navigation.navigate("startexam");
    }

    return (
        <View style={Styles.full}>
            {/* Header */}
            <View
                style={{
                    backgroundColor: Colors.primary,
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
                        color2={Colors.accent2}
                        width={88}
                        height={48}
                    />
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => navigation.navigate("sidemenu")}>
                        <Icon
                            name="menu"
                            width={30}
                            height={26}
                            color={Colors.accent}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* content */}
            <View style={{ flex: 1 }}>
                <Tab.Navigator
                    initialRouteName="Saved"
                    tabBarOptions={{
                        style: { 
                            elevation: 0,
                            height: 48
                        },
                        activeTintColor: Colors.accent,
                        inactiveTintColor: Colors.grey3,
                        indicatorStyle: {
                            backgroundColor: Colors.accent
                        },
                        tabStyle: {
                            paddingHorizontal: 0
                        }
                    }}
                    sceneContainerStyle={{ backgroundColor: Colors.white }}
                >
                    <Tab.Screen
                        name="Saved"
                        component={SavedTab}
                        options={{
                            tabBarLabel: ({ focused, color }) => (
                                <Typography type="small" color={color}>Saved</Typography>
                            )
                        }}
                    />
                    <Tab.Screen
                        name="Submitted"
                        component={SubmittedTab}
                        options={{
                            tabBarLabel: ({ focused, color }) => (
                                <Typography type="small" color={color}>Submitted</Typography>
                            )
                        }}
                    />
                </Tab.Navigator>
            </View>

            {/* Action Button */}
            <ButtonWithIcon
                icon="audio"
                title="New exam"
                onPress={startExam}
            />
        </View>
    )
}

export default Screen;