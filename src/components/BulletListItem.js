import React from 'react'
import { View } from 'react-native'
import Colors from '../layouts/colors'
import Spacing from '../layouts/spacing'
import Styles from '../layouts/styles'
import Gap from './Gap'
import Typography from './Typography'

const BulletListItem = ({ children, isOrdered = false, orderedIndex = 1, type = "small", color = Colors.grey1 }) => {
    return (
        <View style={Styles.row}>
            <Typography type={type} color={color}>{isOrdered ? `${orderedIndex}.` : <>&bull;</>}</Typography>
            <Gap width={Spacing.spacing_s} />
            <Typography type={type} color={color}>{children}</Typography>
        </View>
    )
}

export default BulletListItem
