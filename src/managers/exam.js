import { submitExamAPI } from '../backend/exam';
import { setSavedExams, setSelectedSubmittedExamId, updateExamInfo } from '../redux/actions';
import store from '../redux/store';
import { getSession, removeSession, setSession } from '../utils/session';
import { getRandomString } from '../utils/string';

const SAVED_EXAM_IDS = "SAVED_EXAM_IDS";
const SUBMITTED_EXAM_IDS = "SUBMITTED_EXAM_IDS";

export const attachFinished = (pieces) => {
    for (var i = 0; i < pieces.length; i++) {
        if (!pieces[i].name)    return false;
        if (i < 3) {
            if (pieces[i].type !== 'MTB Book/Tomplay' && (!pieces[i].images || pieces[i].images.length === 0))  return false;
        }
    }
    return true;
}

export const getPercentOfExam = (exam, examType) => {
    const total = examType === 'video' ? 5 : 4;

    let current = 2;

    if (examType === 'video' && exam.identification) {
        current += 1;
    }

    if (attachFinished(exam.pieces)) {
        current += 1;
    }

    return Math.round(current * 100 / total);
}

export const loadSavedExamsFromLocalStorage = async () => {
    const savedExams = await getSession(SAVED_EXAM_IDS);
    return savedExams;
}

export const selectSavedExam = async (id) => {
    const exam = await getSession(`SavedExam_${id}`);
    return exam;
}

export const loadSubmittedExamsFromLocalStorage = async () => {
    const submittedExams = await getSession(SUBMITTED_EXAM_IDS);
    return submittedExams;
}

export const selectSubmittedExam = async (id) => {
    const exam = await getSession(`SubmittedExam_${id}`);
    return exam;
}

export const deleteRecordingClipOfSubmitExamRecord = async (id, no) => {
    let exam = await getSession(`SubmittedExam_${id}`);
    exam.recordingClips[no].deleted = true;
    await setSession(`SubmittedExam_${id}`, exam);
}

export const loadExamsFromLocalStorage = async () => {
    const savedExams = await loadSavedExamsFromLocalStorage()
    const submittedExams = await loadSubmittedExamsFromLocalStorage();
    return ({ savedExams, submittedExams });
}

export const saveExamToLocalStorage = () => {
    return new Promise(async (resolve, reject) => {
        const appInfo = store.getState().appInfo;
        const { currentExam, examMediaType, examInfo, recordingClips } = appInfo;

        const { savedId, recordingDate } = examInfo;
        let savedExamIds = await getSession(SAVED_EXAM_IDS);

        let no = -1;
        if (!savedExamIds) savedExamIds = [];
        savedExamIds.forEach((examId, i) => {
            if (examId.id === savedId) no = i
        })

        if (no === -1) {
            savedExamIds.push({
                id: savedId,
                candidateName: currentExam?.student?.full_name,
                date: recordingDate,
                percent: getPercentOfExam(examInfo, examMediaType),
                reference: currentExam.reference
            });
            await setSession(SAVED_EXAM_IDS, savedExamIds);
        }

        const exam = { currentExam, examMediaType, examInfo, recordingClips }
        await setSession(`SavedExam_${savedId}`, exam);

        const exams = await loadSavedExamsFromLocalStorage();
        store.dispatch(setSavedExams(exams));
        resolve(exams);
    })
}

export const saveSubmittedExamToLocalStorage = () => {
    return new Promise(async (resolve, reject) => {
        const appInfo = store.getState().appInfo;
        const { currentExam, examMediaType, examInfo, recordingClips } = appInfo;

        const { savedId, recordingDate } = examInfo;
        let submittedExamIds = await getSession(SUBMITTED_EXAM_IDS);
        deleteExamFromLocalStorage(savedId);

        let no = -1;
        if (!submittedExamIds) submittedExamIds = [];
        submittedExamIds.forEach((examId, i) => {
            if (examId.id === savedId) no = i
        })

        if (no === -1) {
            submittedExamIds.push({
                id: savedId,
                candidateName: currentExam?.student?.full_name,
                date: recordingDate,
                recordingType: examMediaType
            });
            await setSession(SUBMITTED_EXAM_IDS, submittedExamIds);
        }

        const exam = { currentExam, examMediaType, examInfo, recordingClips }
        await setSession(`SubmittedExam_${savedId}`, exam);

        store.dispatch(setSelectedSubmittedExamId(savedId));
        const exams = await loadSubmittedExamsFromLocalStorage();
        resolve(exams);
    })
}

export const deleteExamFromLocalStorage = (id) => {
    const appInfo = store.getState().appInfo;
    const { savedExams } = appInfo;
    let no = -1;
    for (var i = 0; i < savedExams.length; i++) {
        if (savedExams[i].id === id) {
            savedExams.splice(i, 1);
            setSession(SAVED_EXAM_IDS, savedExams);
            removeSession(`SavedExam_${id}`);
            return savedExams;
        }
    }
}

export const deleteSubmittedExamFromLocalStorage = (id) => {
    const appInfo = store.getState().appInfo;
    const { submittedExams } = appInfo;
    let no = -1;
    for (var i = 0; i < submittedExams.length; i++) {
        if (submittedExams[i].id === id) {
            submittedExams.splice(i, 1);
            setSession(SUBMITTED_EXAM_IDS, submittedExams);
            removeSession(`SubmittedExam_${id}`);
            return submittedExams;
        }
    }
}

export const generateSavedExamId = (num) => {
    let generatedID = '';
    for (var i = 0; i < num; i++) {
        generatedID += ((i === 0) ? "" : "-");
        generatedID += getRandomString(8);
    }
    return generatedID;
}

export const getMTBClipName = (no, date) => {
    const { year, month, day } = date;
    if (no === 0) return `MTB exam - ${day}/${month}/${year}`;
    return `Additional exam clip ${no}`
}