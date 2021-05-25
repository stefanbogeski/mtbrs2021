package com.mtbrecord;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;

import androidx.annotation.Nullable;

public class MtbUploadingService extends Service {

    private Callbacks activity;
    private final IBinder mBinder = new LocalBinder();
    private AliUploading uploading;
    private Handler handler = new Handler();
    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            // upload file here.
            if (uploading.aliBucketConfig()) {
                uploading.startUploading();
            } else {
                uploading.updateModel();
            }
        }
    };

    public class LocalBinder extends Binder {
        public MtbUploadingService getServiceInstance(){
            return MtbUploadingService.this;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        uploading.stop();
        this.handler.removeCallbacks(runnableCode);
        super.onDestroy();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String[] files = intent.getStringArrayExtra("files");
        String[] refPaths = intent.getStringArrayExtra("ref-paths");
        String examUUID = intent.getStringExtra("examUUID");
        String params = intent.getStringExtra("examParams");

        uploading = new AliUploading(this, files, refPaths, examUUID, params, new ServiceCallbackInterface() {
            @Override
            public void notifyStatus(UploadingStatusModel ust) {
                activity.updateClient(ust);
            }
        });
        this.handler.postDelayed(runnableCode, 300);
        return START_STICKY;
    }

    public void registerClient(MtbUploadingModule mobule){
        this.activity = (Callbacks)mobule;
    }

    public interface Callbacks{
        public void updateClient(UploadingStatusModel ust);
    }

    public interface ServiceCallbackInterface{
        public void notifyStatus(UploadingStatusModel ust);
    }
}
