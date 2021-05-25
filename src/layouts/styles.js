import Spacing from "./spacing";

const { StyleSheet } = require("react-native");

const Styles = StyleSheet.create({
    container: {
        padding: Spacing.spacing_l
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    full: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    underline: {
        textDecorationLine: 'underline'
    },
    bold: {
        fontWeight: 'bold'
    },
    fullcontainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
})

export default Styles;