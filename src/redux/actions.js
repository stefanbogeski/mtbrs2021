import {
    SET_STATUSBAR_HEIGHT,
    SET_STATUSBAR_STYLE,
    SET_NETINFO,

    SET_IS_ONBOARDING,
    SET_PAGE_LOADING,
    SET_UPLOADING,
    RESTART_UPLOADING,

    SET_SAVED_EXAMS,
    SET_SUBMITTED_EXAMS,
    SET_CURRENT_EXAM,
    SET_CURRENT_EXAM_UUID,

    SET_TESTED_VIDEO,
    UPDATE_EXAM_INFO,
    UPDATE_UPLOADING_STATUS,
    ADD_RECORDING_CLIP,
    UPDATE_RECORDING_CLIP_INFO,
    REMOVE_RECORDING_CLIP,
    DELETE_EXAM,
    UPDATE_EXAM_PIECE,
    DELETE_EXAM_PIECE,
    ADD_EXAM_PIECE,
    SET_EXAM_MEDIA_TYPE,

    SET_RECORDING_CLIPS,
    SET_EXAM_INFO,
    SET_SELECTED_SUBMITTED_EXAM_ID
} from './types';

export const setStatusbarHeight = hei => {
    return {
        type: SET_STATUSBAR_HEIGHT,
        payload: hei
    }
}

export const setStatusbarStyle = st => {
    return {
        type: SET_STATUSBAR_STYLE,
        payload: st
    }
}

export const setNetInfo = info => {
    return {
        type: SET_NETINFO,
        payload: info
    }
}

export const setIsOnboarding = iob => {
    return {
        type: SET_IS_ONBOARDING,
        payload: iob
    }
}

export const setPageLoading = (loading) => {
    return {
        type: SET_PAGE_LOADING,
        payload: loading
    }
}

export const setUploading = (up) => {
    return {
        type: SET_UPLOADING,
        payload: up
    }
}

export const restartUploading = () => {
    return {
        type: RESTART_UPLOADING
    }
}

export const setSavedExams = sExams => {
    return {
        type: SET_SAVED_EXAMS,
        payload: sExams
    }
}

export const setSubmittedExams = mExams => {
    return {
        type: SET_SUBMITTED_EXAMS,
        payload: mExams
    }
}

export const setCurrentExam = exam => {
    return {
        type: SET_CURRENT_EXAM,
        payload: exam
    }
}

export const setCurrentExamUUID = (uuid) => {
    return {
        type: SET_CURRENT_EXAM_UUID,
        payload: uuid
    }
}

export const setTestedVideo = video => {
    return {
        type: SET_TESTED_VIDEO,
        payload: video
    }
}

export const updateExamInfo = (fieldName, payload) => {
    return {
        type: UPDATE_EXAM_INFO,
        fieldName,
        payload
    }
}

export const updateUploadingStatus = (fieldName, payload) => {
    return {
        type: UPDATE_UPLOADING_STATUS,
        fieldName,
        payload
    }
}

export const addRecordingClip = (payload) => {
    return {
        type: ADD_RECORDING_CLIP,
        payload
    }
}

export const deleteRecordingClip = (payload) => {
    return {
        type: REMOVE_RECORDING_CLIP,
        payload
    }
}

export const updateRecordingClipInfo = (no, fieldName, payload) => {
    return {
        type: UPDATE_RECORDING_CLIP_INFO,
        no, fieldName, payload
    }
}

export const deleteRecordedExam = () => {
    return {
        type: DELETE_EXAM
    }
}

export const updateExamPiece = (no, fieldName, payload) => {
    return {
        type: UPDATE_EXAM_PIECE,
        no, fieldName, payload
    }
}

export const deleteExamPiece = (no) => {
    return {
        type: DELETE_EXAM_PIECE,
        no
    }
}

export const addExamPiece = (payload) => {
    return {
        type: ADD_EXAM_PIECE,
        payload
    }
}

export const setExamMediaType = (payload) => {
    return {
        type: SET_EXAM_MEDIA_TYPE,
        payload
    }
}

export const setExamInfo = (payload) => {
    return {
        type: SET_EXAM_INFO,
        payload
    }
}

export const setRecordingClips = (payload) => {
    return {
        type: SET_RECORDING_CLIPS,
        payload
    }
}

export const setSelectedSubmittedExamId = (id) => {
    return {
        type: SET_SELECTED_SUBMITTED_EXAM_ID,
        payload: id
    }
}