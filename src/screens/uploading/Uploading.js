import React, { useEffect } from 'react';
import { View, NativeModules, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../../components/Container';
import Gap from '../../components/Gap';
import Icon from '../../components/Icons';
import Typography, { Heading1 } from '../../components/Typography';
import Colors from '../../layouts/colors';
import Spacing from '../../layouts/spacing';
import descriptions from '../../../descriptions.json';
import Styles from '../../layouts/styles';
import ProgressCircle from 'react-native-progress-circle'
import { customRound } from '../../utils/math';
import Button from '../../components/Buttons';
import { updateUploadingStatus } from '../../redux/actions';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';

const { MtbUploading } = NativeModules;

const Uploading = () => {
    const { statusbarHeight, uploadingStatus } = useSelector(state => state.appInfo);
    const { totalSize, uploadedSize } = uploadingStatus;
    const dispatch = useDispatch();

    const progress = (totalSize === 0) ? 0 : customRound(uploadedSize * 100 / totalSize, 0);

    useEffect(() => {
        activateKeepAwake();

        return () => {
            deactivateKeepAwake();
        }
    }, [])

    return (
        <Container pTop={statusbarHeight}>
            <View style={[Styles.center, Styles.full]}>
                <ProgressCircle
                    percent={progress}
                    radius={64}
                    borderWidth={5}
                    color={Colors.green}
                    shadowColor={Colors.grey3}
                    bgColor="#fff"
                >
                    <Heading1
                        color={Colors.green}
                    >{progress > 100 ? 100 : progress}%</Heading1>
                </ProgressCircle>

                {
                    Platform.OS === 'android' ? (
                        <>
                            <Gap height={Spacing.spacing_l} />
                            <View style={{ paddingHorizontal: Spacing.spacing_l * 2, width: '100%' }}>
                                <Button
                                    title="Cancel upload"
                                    onPress={() => {
                                        MtbUploading.stopUploading();
                                        dispatch(updateUploadingStatus("uStatus", ""));
                                    }}
                                />
                            </View>
                        </>
                    ) : null
                }
            </View>
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: Spacing.spacing_xl,
                    alignItems: 'center'
                }}
            >
                <Icon name="info" width={22} height={22} color={Colors.grey1} />
                <Gap height={Spacing.spacing_xs} />
                <View style={{ paddingHorizontal: Spacing.spacing_xl }}>
                    <Typography
                        type="vsmall"
                        color={Colors.grey1}
                        align="center"
                    >{descriptions.uploading}</Typography>
                </View>
            </View>
        </Container>
    )
}

export default Uploading;