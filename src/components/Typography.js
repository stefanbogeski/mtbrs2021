import React from 'react';
import styled from 'styled-components';
import Colors from '../layouts/colors';

const LargeText = styled.Text`
    font-size: 18px;
    line-height: 26px;
    text-align: ${props => props.align ? props.align : 'left'};
    color: ${props => props.color ? props.color : Colors.primary};
    font-weight: ${props => props.bold ? 'bold' : 'normal'};
`

const NormalText = styled.Text`
    font-size: 16px;
    line-height: 24px;
    text-align: ${props => props.align ? props.align : 'left'};
    color: ${props => props.color ? props.color : Colors.primary};
    font-weight: ${props => props.bold ? 'bold' : 'normal'};
`

const SmallText = styled.Text`
    font-size: 14px;
    line-height: 22px;
    text-align: ${props => props.align ? props.align : 'left'};
    color: ${props => props.color ? props.color : Colors.primary};
    font-weight: ${props => props.bold ? 'bold' : 'normal'};
`

const VSmallText = styled.Text`
    font-size: 12px;
    line-height: 20px;
    text-align: ${props => props.align ? props.align : 'left'};
    color: ${props => props.color ? props.color : Colors.primary};
    font-weight: ${props => props.bold ? 'bold' : 'normal'};
`

const Typography = ({ type, align, color, children, style, onPress, bold }) => {
    switch (type) {
        case 'large':
            return <LargeText align={align} color={color} style={{ ...style }} onPress={onPress} bold={bold}>{children}</LargeText>;

        case 'small':
            return <SmallText align={align} color={color} style={{ ...style }} onPress={onPress} bold={bold}>{children}</SmallText>;

        case 'vsmall':
            return <VSmallText align={align} color={color} style={{ ...style }} onPress={onPress} bold={bold}>{children}</VSmallText>;

        case 'normal':
        default:
            return <NormalText align={align} color={color} style={{ ...style }} onPress={onPress} bold={bold}>{children}</NormalText>;
    }
}

export default Typography;

export const Heading1 = styled.Text`
    font-size: 28px;
    line-height: 36px;
    color: ${props => props.color ? props.color : Colors.primary};
    text-align: ${props => props.align ? props.align : 'left'};
    font-weight: bold;
`;

export const Heading2 = styled.Text`
    font-size: 24px;
    line-height: 32px;
    color: ${props => props.color ? props.color : Colors.primary};
    text-align: ${props => props.align ? props.align : 'left'};
    font-weight: bold;
`;

export const Heading3 = styled.Text`
    font-size: 20px;
    line-height: 28px;
    color: ${props => props.color ? props.color : Colors.primary};
    text-align: ${props => props.align ? props.align : 'left'};
`;