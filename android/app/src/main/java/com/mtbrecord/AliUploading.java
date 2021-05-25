package com.mtbrecord;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.alibaba.sdk.android.oss.ClientConfiguration;
import com.alibaba.sdk.android.oss.ClientException;
import com.alibaba.sdk.android.oss.OSS;
import com.alibaba.sdk.android.oss.OSSClient;
import com.alibaba.sdk.android.oss.ServiceException;
import com.alibaba.sdk.android.oss.callback.OSSCompletedCallback;
import com.alibaba.sdk.android.oss.callback.OSSProgressCallback;
import com.alibaba.sdk.android.oss.common.auth.OSSAuthCredentialsProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSPlainTextAKSKCredentialProvider;
import com.alibaba.sdk.android.oss.internal.OSSAsyncTask;
import com.alibaba.sdk.android.oss.model.PutObjectRequest;
import com.alibaba.sdk.android.oss.model.PutObjectResult;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import java.io.File;
import java.io.IOException;

enum UPLOADINGSTATUS {
    PREPARE,
    UPLOADING,
    DONE,
    ERROR
}

public class AliUploading {

    private OSS oss;
    private String[] files = null;
    private String[] paths = null;
    private String examUUID = null;
    private String examParams = null;
    private int currentNo = -1;
    private long[] fileSizes = null;
    private long totalSize = 0;
    private UPLOADINGSTATUS uploadingStatus = UPLOADINGSTATUS.PREPARE;
    private String message = "Uploading is not started.";
    private long uploadedSize = 0;
    private long uploadedSizeOfUploadingFile = 0;
    private Context context;
    final MtbUploadingService.ServiceCallbackInterface uploadingCallback;
    private UploadingStatusModel model;
    NotificationManager notificationManager;
    final String NOTIFICATION_CHANNEL_ID = "mtb_uploading_notification_channel";
    OSSAsyncTask currentTask = null;

    String accessKeyId = "accessKeyId";
    String accessKeySecret = "accessKeySecret";
    String endpoint = "endpoint";
    String bucketName = "bucketName";

    Handler handler = new Handler();
    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            // Do something here on the main thread
            updateModel();
            handler.postDelayed(this, 1000);
        }
    };

    public void setTotalSize(long totalSize) {
        this.totalSize = totalSize;
    }

    public void setUploadedSize(long uSize) {
        this.uploadedSize = uSize;
    }

    public void setUploadedSizeOfUploadingFile(long uploadedSizeOfUploadingFile) {
        this.uploadedSizeOfUploadingFile = uploadedSizeOfUploadingFile;
    }

    public void setUploadingStatus(UPLOADINGSTATUS uploadingStatus) {
        this.uploadingStatus = uploadingStatus;
    }

    public AliUploading(
            Context context,
            String[] uFiles,
            String[] uPaths,
            String examUUID,
            String examParams,
            MtbUploadingService.ServiceCallbackInterface uploadingCallback
    ) {
        this.context = context;
        this.files = uFiles;
        this.paths = uPaths;
        this.examUUID = examUUID;
        this.examParams = examParams;
        this.uploadingCallback = uploadingCallback;
        this.model = new UploadingStatusModel();
        notificationManager = (NotificationManager)       context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            @SuppressLint("WrongConstant") NotificationChannel notificationChannel = new NotificationChannel(NOTIFICATION_CHANNEL_ID, "MTB Notifications", NotificationManager.IMPORTANCE_MAX);
            // Configure the notification channel.
            notificationChannel.enableLights(true);
            notificationChannel.setLightColor(Color.RED);
            notificationChannel.setVibrationPattern(new long[]{0, 500, 1000, 500, 200});
            notificationChannel.enableVibration(true);
            notificationManager.createNotificationChannel(notificationChannel);
        }
    }

    public void stop() {
        handler.removeCallbacks(runnableCode);
        if (currentTask != null) {
            currentTask.cancel();
        }
    }

    private void raiseNotification(String title, String content) {
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(context, NOTIFICATION_CHANNEL_ID);
        notificationBuilder.setAutoCancel(true)
                .setDefaults(Notification.DEFAULT_ALL)
                .setWhen(System.currentTimeMillis())
                .setSmallIcon(R.mipmap.ic_launcher)
                .setTicker("MTB Exam Uploading")
                .setContentTitle(title)
                .setContentText(content)
                .setContentInfo("Information");
        notificationManager.notify(1, notificationBuilder.build());
    }

    public boolean aliBucketConfig() {
        try {
            if (files == null || files.length == 0) {
                this.message = "Uploading files are not specified.";
                setUploadingStatus(UPLOADINGSTATUS.ERROR);
                return false;
            }

            if (paths == null || paths.length == 0) {
                this.message = "Paths are not specified.";
                setUploadingStatus(UPLOADINGSTATUS.ERROR);
                return false;
            }

            ClientConfiguration conf = new ClientConfiguration();
            conf.setConnectionTimeout(3600 * 1000);
            conf.setSocketTimeout(3600 * 1000);
            conf.setMaxConcurrentRequest(5);
            conf.setMaxErrorRetry(2);

            OSSCredentialProvider credentialProvider = new OSSPlainTextAKSKCredentialProvider(accessKeyId, accessKeySecret);
//            OSSCredentialProvider credentialProvider = new OSSAuthCredentialsProvider("http://178.62.60.224/");

            this.oss = new OSSClient(context, endpoint, credentialProvider, conf);

            long total = 0;
            this.fileSizes = new long[files.length];
            for (int i = 0; i < files.length; i++) {
                Uri uFile = Uri.parse(files[i]);
                String file = RealPathUtil.getRealPath(context, uFile);
                File f = new File(file);
                this.fileSizes[i] = f.length();
                total += fileSizes[i];
            }
            setTotalSize(total);

            return true;
        } catch (Exception e) {
            this.message = e.getMessage();
            setUploadingStatus(UPLOADINGSTATUS.ERROR);
            return false;
        }
    }

    public void startUploading() {
        this.currentNo = 0;
        this.uploadedSize = 0;
        this.uploadedSizeOfUploadingFile = 0;
        this.setUploadedSize(0);
        setUploadingStatus(UPLOADINGSTATUS.UPLOADING);
        uploadFile();
        this.raiseNotification("MTB Uploading", "Exam upload has begun.");
        handler.postDelayed(runnableCode, 300);
    }

    private void uploadFile() {
        String ref = paths[currentNo];
        String file;
        Uri uFile = Uri.parse(files[currentNo]);
        file = RealPathUtil.getRealPath(context, uFile);
        File f = new File(file);

        final long filesize = fileSizes[currentNo];

        PutObjectRequest put = new PutObjectRequest(bucketName, ref, file);

        put.setProgressCallback(new OSSProgressCallback<PutObjectRequest>() {
            @Override
            public void onProgress(PutObjectRequest request, long currentSize, long total) {
                setUploadedSizeOfUploadingFile(currentSize);
            }
        });

        currentTask = oss.asyncPutObject(put, new OSSCompletedCallback<PutObjectRequest, PutObjectResult>() {
            @Override
            public void onSuccess(PutObjectRequest request, PutObjectResult result) {
                setUploadedSizeOfUploadingFile(0);
                setUploadedSize(uploadedSize + filesize);
                nextUploading();
            }

            @Override
            public void onFailure(PutObjectRequest request, ClientException clientExcepion, ServiceException serviceException) {
                // Request exception
                if (clientExcepion != null) {
                    clientExcepion.printStackTrace();
                    String msg = clientExcepion.getMessage();
                    if (msg.indexOf("Task is cancelled!") >= 0) {
                        message = "Upload cancelled";
                    } else {
                        message = "Local exception";
                    }
                } else if (serviceException != null) {
                    message = "Service exception";
                } else {
                    message = "Unknown issue.";
                }
                setUploadingStatus(UPLOADINGSTATUS.ERROR);
                raiseNotification("MTB Uploading Failed", message);
            }
        });
    }

    private void nextUploading() {
        currentNo ++;
        if (currentNo < files.length) {
            uploadFile();
        } else {
            currentTask = null;
            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            // raiseNotification("MTB Uploading", message);
            OkHttpClient client = new OkHttpClient();
            try {
                RequestBody body = RequestBody.create(JSON, examParams);
                Request request = new Request.Builder()
                        .url("BASE_URL/" + examUUID )
                        .header("Authorization", "Bearer token")
                        .header("Content-Type", "application/json")
                        .header("X-Requested-With", "XMLHttpRequest")
                        .put(body)
                        .build();
                Response response = client.newCall(request).execute();
                String result = response.body().string();

                int responseCode = response.code();
                if (responseCode != 200) {
                    message = "Submission Api calling is failed.";
                    setUploadingStatus(UPLOADINGSTATUS.ERROR);
                    raiseNotification("MTB Uploading Failed", message);
                } else {
                    message = "Exam upload complete.";
                    setUploadingStatus(UPLOADINGSTATUS.DONE);
                    raiseNotification("MTB Uploading", message);
                }
                handler.removeCallbacks(runnableCode);
                updateModel();
            } catch (IOException e) {
                message = "IOException: " + e.getMessage();
                setUploadingStatus(UPLOADINGSTATUS.ERROR);
                raiseNotification("MTB Uploading Failed", e.getMessage());
                handler.removeCallbacks(runnableCode);
                updateModel();
            }
        }
    }

    public void updateModel() {
        model.setuStatus(uploadingStatus);
        model.setlTotalSize(totalSize);
        model.setlUploadedSize(uploadedSize + uploadedSizeOfUploadingFile);
        model.setsMessage(message);

        this.uploadingCallback.notifyStatus(model);
    }
}
