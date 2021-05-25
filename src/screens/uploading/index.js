import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Finished from './Finished';
import Failed from './Failed';
import Uploading from './Uploading';

const Screen = () => {
    const { uploadingStatus } = useSelector(state => state.appInfo);
    const { uStatus } = uploadingStatus;

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        })
    )

    if (uStatus === 'uploading') {
        return (<Uploading />)
    }

    if (uStatus === 'done') {
        return (<Finished />);
    }

    if (uStatus === 'error') {
        return (<Failed />)
    }

    return null;
}

export default Screen;