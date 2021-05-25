import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../layouts/colors';

const PageLoadingModal = () => {
    return (
        <View>
            <Modal
                isVisible={true}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                animationIn="zoomInDown"
                animationInTiming={500}
                animationOut="zoomOutDown"
                animationOutTiming={500}
            >
                <View 
                    style={{ 
                        backgroundColor: Colors.white, 
                        width: 100, 
                        height: 100, 
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center' 
                    }}
                >
                    <ActivityIndicator size="large" color={Colors.accent} />
                </View>
            </Modal>
        </View>
    )
}

export default PageLoadingModal;