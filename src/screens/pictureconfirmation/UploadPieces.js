import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button, { SelectButton } from '../../components/Buttons';
import Gap from '../../components/Gap';
import Typography from '../../components/Typography';
import Spacing from '../../layouts/spacing';
import Styles from '../../layouts/styles';
import { addExamPiece, deleteExamPiece, updateExamInfo, updateExamPiece } from '../../redux/actions';
import PieceItem from './PieceItem';

const UploadPieces = ({ }) => {
    const { examInfo } = useSelector(state => state.appInfo);
    const { pieces } = examInfo;
    const dispatch = useDispatch();

    const updatePiece = (no, name, val) => {
        dispatch(updateExamPiece(no, name, val));
    }

    const deletePiece = (no) => {
        dispatch(deleteExamPiece(no));
    }

    return (
        <View>
            {
                pieces.map((piece, i) => (
                    <PieceItem
                        piece={piece}
                        key={i}
                        no={i}
                        onChangeImages={(images) => updatePiece(i, 'images', images)}
                        onChangeType={type => updatePiece(i, 'type', type)}
                        onChangeName={name => updatePiece(i, "name", name)}
                        onDeletePiece={() => deletePiece(i)}
                    />
                ))
            }

            <Gap height={Spacing.spacing_xxl_4} />
            <Button
                title="Add another piece"
                isWhite
                border
                onPress={() => dispatch(addExamPiece({ type: 'MTB Book/Tomplay' }))}
            />
        </View>
    )
}

export default UploadPieces;