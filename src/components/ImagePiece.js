import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Colors from '../layouts/colors';
import Styles from '../layouts/styles';
import Icon from './Icons';

const ImagePiece = ({ uri, onDelete, style }) => (
    <View style={{
        paddingRight: 10,
        width: 70,
        height: 80,
        ...style
    }}>
        <Image
            source={{ uri }}
            style={{
                width: 60,
                height: 80
            }}
        />
        {
            onDelete ? (
                <View
                    style={[{
                        position: 'absolute',
                        right: 0,
                        top: 6,
                        width: 20,
                        height: 20,
                        backgroundColor: Colors.white,
                        borderRadius: 10
                    }, Styles.center]}
                >
                    <TouchableOpacity
                        style={[{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: Colors.accent,
                        }, Styles.center]}
                        onPress={onDelete}
                    >
                        <Icon name="close" width={8} height={8} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            ) : null
        }
    </View>
)

export default ImagePiece;