import AsyncStorage from '@react-native-community/async-storage';

export const getSession = async (sessionId) => {
    var sess = await AsyncStorage.getItem(sessionId);
    if (sess){
        return JSON.parse(sess)
    } else {
        return null;
    }
}

export const setSession = async (sessionId, data) => {
    await AsyncStorage.setItem(sessionId, JSON.stringify(data));
    return true;
}

export const removeSession = async (sessionId) => {
    await AsyncStorage.removeItem(sessionId);
    return true;
}

export const removeAllSession = async () => {
    AsyncStorage.getAllKeys()
    .then(ks => {
        ks.forEach(kItem => {
            AsyncStorage.removeItem(kItem);
        })
        return true;
    }).catch(error => {
        return false;
    })
}