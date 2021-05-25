import { ApiInstance } from "./config"

export const getExamInfoAPI = (examRef, birthday) => {
    return new Promise((resolve, reject) => {
        const url = `/exams?reference=${examRef}&candidate_date_of_birth=${birthday}`;
        ApiInstance.get(url).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(JSON.stringify(error));
            reject(error.toString());
        })
    });
}

export const submitExamAPI = (uuid, params) => {
    return new Promise((resolve, reject) => {
        const url = `/exams/${uuid}`;
        ApiInstance.put(url, params).then(res => {
            resolve(res.data)
        }).catch(error => {
            reject(error.toString());
        })
    })
}