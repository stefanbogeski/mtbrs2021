import { customRound } from "./math";

export const displayTotalSize = (totalsize, pos) => {
    if (!pos)   pos = 2;
    if (totalsize < 1024)
        return `${totalsize} B`;

    totalsize = totalsize / 1024;
    if (totalsize < 1024) {
        return `${customRound(totalsize, pos)} KB`;
    }

    totalsize = totalsize / 1024;
    if (totalsize < 1024) {
        return `${customRound(totalsize, pos)} MB`;
    }

    totalsize = totalsize / 1024;
    if (totalsize < 1024) {
        return `${customRound(totalsize, pos)} GB`;
    }

    totalsize = totalsize / 1024;
    return `${customRound(totalsize, pos)} TB`;
}

export const getUrlExtension = (url) => {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}

export const getFileNameFromUrl = (url) => {
    return url.substring(url.lastIndexOf('/')+1);
}