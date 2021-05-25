import React, { useEffect } from 'react';
import { View, Text, Platform, NativeModules, StatusBar } from 'react-native';
import MainNavigator from './src/navigators/main';
import { useDispatch, useSelector } from 'react-redux';
import { setNetInfo, setSavedExams, setStatusbarHeight, setSubmittedExams } from './src/redux/actions';
import { loadExamsFromLocalStorage } from './src/managers/exam';
import PageLoadingModal from './src/components/PageLoading';
import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";

const { StatusBarManager } = NativeModules

// Sentry.init({
//     dsn: 'https://2535635a168141d999d4de96772f8c93@o33934.ingest.sentry.io/5525187',
//     tracesSampleRate: 1,
//     debug: true
// })

const App = () => {
    const dispatch = useDispatch();
    const { statusBarStyle, pageLoading } = useSelector(state => state.appInfo);

    async function init() {
        try {
            if (Platform.OS === 'ios') {
                StatusBarManager.getHeight(async response => {
                    dispatch(setStatusbarHeight(response.height));
                })
            } else {
                dispatch(setStatusbarHeight(StatusBar.currentHeight));
            }

            const { savedExams, submittedExams } = await loadExamsFromLocalStorage();
            dispatch(setSavedExams(savedExams));
            dispatch(setSubmittedExams(submittedExams));
        } catch (error) {
            console.log("Error:", error)
        }
    }

    useEffect(() => {
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;

        init();

        const unsubscribe = NetInfo.addEventListener(state => {
            dispatch(setNetInfo(state));
        });

        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar
                barStyle={statusBarStyle}
                translucent
                backgroundColor="transparent"
            />
            <MainNavigator />
            {
                pageLoading && (<PageLoadingModal />)
            }
        </View>
    )
}

export default App;