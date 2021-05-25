package com.mtbrecord;

public class UploadingStatusModel {
    private UPLOADINGSTATUS  uStatus;
    private long             lTotalSize;
    private long             lUploadedSize;
    private String           sMessage;

    public UPLOADINGSTATUS getuStatus() {
        return uStatus;
    }

    public void setuStatus(UPLOADINGSTATUS uStatus) {
        this.uStatus = uStatus;
    }

    public long getlTotalSize() {
        return lTotalSize;
    }

    public void setlTotalSize(long lTotalSize) {
        this.lTotalSize = lTotalSize;
    }

    public long getlUploadedSize() {
        return lUploadedSize;
    }

    public void setlUploadedSize(long lUploadedSize) {
        this.lUploadedSize = lUploadedSize;
    }

    public String getsMessage() {
        return sMessage;
    }

    public void setsMessage(String sMessage) {
        this.sMessage = sMessage;
    }
}
