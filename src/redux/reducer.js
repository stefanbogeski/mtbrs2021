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

const initialState = {
    statusbarHeight: 0,
    statusBarStyle: 'dark-content',
    netInfo: null,
    isOnboarding: false,
    pageLoading: false,
    isUploading: 0,

    savedExams: [],
    submittedExams: [],
    currentExam: null,
    currentExamUUID: "",

    examMediaType: 'video',
    testedVideo: null,
    examInfo: {
        savedId: '',
        identification: '',
        pieces: [{type: 'MTB Book/Tomplay'}, {type: 'MTB Book/Tomplay'}, {type: 'MTB Book/Tomplay'}],
        otherAttachments: [],
        mtbBookCode: '',
        recordingDate: {
            year: 0,
            month: 0,
            day: 0
        },
        submissionNote: "",
        rootFolderName: "",
        medias: {}
    },
    recordingClips: [],
    uploadingStatus: {
        uStatus: '',   // 'uploading' or 'failed' or 'finished'
        totalSize: 0,
        uploadedSize: 0,
        message: ""
    },
    selectedSubmittedExamId: ""
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STATUSBAR_HEIGHT:
            return {
                ...state,
                statusbarHeight: action.payload
            };

        case SET_STATUSBAR_STYLE:
            return {
                ...state,
                statusBarStyle: action.payload
            };

        case SET_NETINFO:
            return {
                ...state,
                netInfo: action.payload
            }

        case SET_IS_ONBOARDING:
            return {
                ...state,
                isOnboarding: action.payload
            }

        case SET_PAGE_LOADING:
            return {
                ...state,
                pageLoading: action.payload
            }

        case SET_UPLOADING:
            return {
                ...state,
                isUploading: action.payload
            }

        case RESTART_UPLOADING:
            return {
                ...state,
                isUploading: state.isUploading + 1
            }

        case SET_SAVED_EXAMS:
            return {
                ...state,
                savedExams: action.payload
            }

        case SET_SUBMITTED_EXAMS:
            return {
                ...state,
                submittedExams: action.payload
            }

        case SET_CURRENT_EXAM:
            return {
                ...state,
                currentExam: action.payload
            }

        case SET_CURRENT_EXAM_UUID:
            return {
                ...state,
                currentExamUUID: action.payload
            }

        case SET_TESTED_VIDEO:
            return {
                ...state,
                testedVideo: action.payload
            }

        case UPDATE_EXAM_INFO:
            const ei = { ...state.examInfo };
            ei[action.fieldName] = action.payload;
            return {
                ...state,
                examInfo: ei
            }

        case UPDATE_EXAM_PIECE:
            let piece = state.examInfo.pieces[action.no];
            piece[action.fieldName] = action.payload;
            state.examInfo.pieces = [...state.examInfo.pieces];
            state.examInfo.pieces[action.no] = piece;
            return {
                ...state
            }

        case DELETE_EXAM_PIECE:
            const pieces1 = [...state.examInfo.pieces]
            pieces1.splice(action.no, 1);
            state.examInfo.pieces = [
                ...pieces1,
            ]
            return {
                ...state,
            }

        case ADD_EXAM_PIECE:
            const pieces = [...state.examInfo.pieces]
            state.examInfo.pieces = [
                ...pieces,
                action.payload
            ]
            return {
                ...state
            }

        case UPDATE_UPLOADING_STATUS:
            const us = { ...state.uploadingStatus };
            us[action.fieldName] = action.payload;
            return {
                ...state,
                uploadingStatus: us
            }

        case ADD_RECORDING_CLIP:
            const clips = [
                ...state.recordingClips,
                action.payload
            ];
            return {
                ...state,
                recordingClips: clips
            }

        case REMOVE_RECORDING_CLIP:
            const nclips = [
                ...state.recordingClips,
            ];
            nclips.splice(action.payload, 1);
            return {
                ...state,
                recordingClips: nclips
            }

        case UPDATE_RECORDING_CLIP_INFO:
            let clip = state.recordingClips[action.no];
            clip[action.fieldName] = action.payload;
            state.recordingClips[action.no] = clip;
            return {
                ...state
            }

        case DELETE_EXAM:
            return {
                ...state,
                currentExam: null,
                testedVideo: null,
                examMediaType: 'video',
                examInfo: {
                    savedId: '',
                    identification: '',
                    pieces: [{type: 'MTB Book/Tomplay'}, {type: 'MTB Book/Tomplay'}, {type: 'MTB Book/Tomplay'}],
                    otherAttachments: [],
                    mtbBookCode: '',
                    recordingDate: {
                        year: 0,
                        month: 0,
                        day: 0
                    },
                    submissionNote: "",
                    rootFolderName: "",
                    medias: {}
                },
                recordingClips: [],
            }

        case SET_EXAM_MEDIA_TYPE:
            return {
                ...state,
                examMediaType: action.payload
            }

        case SET_RECORDING_CLIPS:
            return {
                ...state,
                recordingClips: action.payload
            }

        case SET_EXAM_INFO:
            return {
                ...state,
                examInfo: action.payload
            }

        case SET_SELECTED_SUBMITTED_EXAM_ID:
            return {
                ...state,
                selectedSubmittedExamId: action.payload
            }

        default:
            return state;
    }
}

export default appReducer;