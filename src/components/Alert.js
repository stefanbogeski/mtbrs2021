import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import Button from './Buttons';
import Gap from './Gap';
import Typography from './Typography';

const CustomAlert = ({ info }) => (
    <Modal
        isVisible={true}
        style={{ alignItems: 'center' }}
    >
        <View
            style={{
                backgroundColor: Colors.white,
                width: 288
            }}
        >
            <View
                style={{
                    paddingHorizontal: Spacing.spacing_xxl_4,
                    paddingVertical: Spacing.spacing_xxl_3
                }}
            >
                <Typography
                    type="large"
                    color={Colors.accent}
                    align="center"
                >{info.title}</Typography>

                <Gap height={Spacing.spacing_m} />

                <Typography
                    type="small"
                    color={Colors.grey1}
                    align="center"
                >{info.description}</Typography>
            </View>

            <View style={Styles.row}>
                {
                    info.buttons.map((button, i) => (
                        <View style={{ flex: 1 }} key={i}>
                            <Button
                                title={button.title}
                                isWhite={button.white ? true : false}
                                onPress={() => button.onPress()}
                            />
                        </View>
                    ))
                }
            </View>
        </View>
    </Modal>
)

export default CustomAlert;