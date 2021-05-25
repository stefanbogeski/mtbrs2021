import React from 'react';
import { View } from 'react-native';
import Colors from '../layouts/colors';
import Spacing from '../layouts/spacing';
import Styles from '../layouts/styles';
import { FlatButton } from './Buttons';
import Gap from './Gap';
import Icon from './Icons';
import Typography from './Typography';

const Diagram = ({ data }) => {
    const StatusIcon = ({ item }) => (
        <View
            style={[{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: item.finished ? Colors.green : Colors.accent
            }, Styles.center]}
        >
            <Icon
                name={item.finished ? "check" : "close"}
                color="white"
                width={8}
                height={8}
            />
        </View>
    )
    return (
        <View style={{ width: '100%' }}>
            {
                data.map((item, i) => (
                    item ? (
                        <View
                            key={i}
                            style={Styles.row}
                        >
                            {
                                item.last ? (
                                    <StatusIcon item={item} />
                                ) : (
                                        <View style={{ width: 16, paddingHorizontal: 7 }}>
                                            <View style={{ flex: 1, backgroundColor: item.finished ? Colors.green : Colors.accent }} />
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0
                                                }}
                                            >
                                                <StatusIcon item={item} />
                                            </View>
                                        </View>
                                    )
                            }
                            <Gap width={Spacing.spacing_s} />
                            <View style={[Styles.full, { paddingBottom: Spacing.spacing_l }]}>
                                <View style={[Styles.row, { marginTop: -4, alignItems: 'flex-end' }]}>
                                    <Typography style={Styles.full} type="large">{item.title}</Typography>
                                    <FlatButton onPress={item.actionPress} title={item.actionLbl} />
                                </View>

                                {/* content */}
                                <View>{item.content}</View>
                            </View>
                        </View>
                    ) : null
                ))
            }
        </View >
    )
}

export default Diagram;