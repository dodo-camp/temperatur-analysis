import axios from 'axios';
import moment from 'moment';

function uploadFileToServer(data, cb) {
    return axios.post("http://localhost:3080/file/upload", data, {
        onUploadProgress: cb
    })
}

function getAnalytics(dateGap) {
    let dateFrom = moment().subtract(dateGap, 'y').format('llll');
    return axios.get(`http://localhost:3080/file/getAnalytics?dateFrom=${dateFrom}`);
}

export {
    uploadFileToServer,
    getAnalytics
};