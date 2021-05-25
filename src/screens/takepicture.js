import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, PermissionsAndroid, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import Icon from '../components/Icons';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import ErrorScreen from '../components/ErrorScreen';
import ImagePicker from 'react-native-image-picker';
import Styles from '../layouts/styles';
import Button, { ButtonWithIcon } from '../components/Buttons';
import { DocumentDirectoryPath } from 'react-native-fs';
import { getRandomString } from '../utils/string';

const Screen = () => {
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
    const [hasPermission, setHasPermission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [picture, setPicture] = useState('');
    const { statusbarHeight, examInfo } = useSelector(state => state.appInfo);
    const { rootFolderName } = examInfo;
    const cameraRef = useRef();
    const navigation = useNavigation();
    const route = useRoute();
    const onDone = route.params?.onDone;
    const subdir = route.params?.subdir;
    const filename = route.params?.filename;

    useEffect(() => {
        (async () => {
            if (Platform.OS === 'android') {
                const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

                if (status === 'granted') {
                    setHasPermission(true);
                } else {
                    setHasPermission(false);
                }
            } else {
                setHasPermission(true);
            }
            setLoading(false)
        })();
    }, [])

    const exchangeCamera = () => {
        if (cameraType === RNCamera.Constants.Type.back) {
            setCameraType(RNCamera.Constants.Type.front);
        } else {
            setCameraType(RNCamera.Constants.Type.back);
        }
    }

    const onClose = () => {
        navigation.goBack();
    }

    const selectGalleryPicture = () => {
        const options = {
            title: 'Select Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                finish(response.uri);
            }
        });
    }

    const finish = (uri) => {
        if (onDone) {
            onDone(uri);
        }
        navigation.goBack();
    }

    const takePicture = async () => {
        const options = {
            quality: .5,
            base64: false,
            path: `${DocumentDirectoryPath}/${rootFolderName}/${subdir}/${filename ? filename : getRandomString(16)}.jpg`
        }
        const photo = await cameraRef.current.takePictureAsync(options);
        setPicture(photo.uri);
    }

    if (loading) return null;

    if (hasPermission === false) {
        return (
            <ErrorScreen
                message="No access to camera"
                close={(
                    <TouchableOpacity onPress={onClose}>
                        <Icon
                            name="close"
                            width={20}
                            height={20}
                            color={Colors.primary}
                        />
                    </TouchableOpacity>
                )}
            />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <RNCamera
                style={{ flex: 1 }}
                ref={cameraRef}
                type={cameraType}
            >
                <LinearGradient
                    style={{
                        height: statusbarHeight + 110,
                        paddingHorizontal: Spacing.spacing_l,
                        paddingTop: Spacing.spacing_l + statusbarHeight,
                        flexDirection: 'row'
                    }}
                    colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']}
                >
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="close" width={20} height={20} color={Colors.white} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity onPress={exchangeCamera}>
                            <Icon name="camera-exchange" width={26} height={22} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={selectGalleryPicture}>
                        <Icon name="gallery" width={20} height={20} color={Colors.white} />
                    </TouchableOpacity>
                </LinearGradient>
                <View style={{ flex: 1 }} />
                <View style={{ paddingBottom: Spacing.spacing_xxl_3, alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            borderWidth: 2,
                            borderColor: Colors.white,
                            backgroundColor: Colors.grey3
                        }}
                        onPress={takePicture}
                    />
                </View>
            </RNCamera>

            {
                picture ? (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }}
                    >
                        <Image
                            source={{ uri: picture }}
                            style={{ width: '100%', height: '100%' }}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            flexDirection: 'row'
                        }}>
                            <View style={Styles.full}>
                                <ButtonWithIcon
                                    title="Retake"
                                    icon="outline-1"
                                    isWhite
                                    onPress={() => {
                                        setPicture(null)
                                    }}
                                />
                            </View>
                            <View style={Styles.full}>
                                <Button
                                    title="Use image"
                                    onPress={() => finish(picture)}
                                />
                            </View>
                        </View>
                    </View>
                ) : null
            }
        </View>
    )
}

export default Screen;