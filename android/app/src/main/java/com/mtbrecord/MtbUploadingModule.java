package com.mtbrecord;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

public class MtbUploadingModule extends ReactContextBaseJavaModule implements MtbUploadingService.Callbacks {

    public static final String REACT_CLASS = "MtbUploading";
    private static ReactApplicationContext reactContext;
    private MtbUploadingService uploadingService = null;

    public MtbUploadingModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    String[] jsonStringToArray(String jsonString) {
        ArrayList<String> stringArray = new ArrayList<String>();
        try {
            JSONArray jsonArray = new JSONArray(jsonString);

            for (int i = 0; i < jsonArray.length(); i++) {
                stringArray.add(jsonArray.getString(i));
            }

        } catch (JSONException e) {
            e.printStackTrace();
        } finally {
            return convertArrayListTooArray(stringArray);
        }
    }

    String[] convertArrayListTooArray(ArrayList<String> param) {
        String str[] = new String[param.size()];
        Object[] objArr = param.toArray();

        // Iterating and converting to String
        int i = 0;
        for (Object obj : objArr) {
            str[i++] = (String)obj;
        }
        return str;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startUploading(String files, String paths, String examUUID, String params) {
        String[] uploadFiles = jsonStringToArray(files);
        String[] uploadPaths = jsonStringToArray(paths);
        Intent i = new Intent(this.reactContext, MtbUploadingService.class);
        i.putExtra("files", uploadFiles);
        i.putExtra("ref-paths", uploadPaths);
        i.putExtra("examUUID", examUUID);
        i.putExtra("examParams", params);
        this.reactContext.startService(i);
        this.reactContext.bindService(i, connection, Context.BIND_AUTO_CREATE);
    }

    @ReactMethod
    public void stopUploading() {
        this.reactContext.unbindService(connection);
        this.reactContext.stopService(new Intent(this.reactContext, MtbUploadingService.class));
    }

    private ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            MtbUploadingService.LocalBinder binder = (MtbUploadingService.LocalBinder) service;
            uploadingService = binder.getServiceInstance();
            uploadingService.registerClient(MtbUploadingModule.this);
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

        }
    };

    @Override
    public void updateClient(UploadingStatusModel status) {
        UPLOADINGSTATUS st = status.getuStatus();

        WritableMap params = Arguments.createMap();

        if (st == UPLOADINGSTATUS.PREPARE || st == UPLOADINGSTATUS.ERROR) {
            params.putString("uStatus", st == UPLOADINGSTATUS.PREPARE ? "prepare" : "error");
            params.putString("message", status.getsMessage());
        } else if (st == UPLOADINGSTATUS.UPLOADING) {
            params.putString("uStatus", "uploading");
            params.putString("totalsize", status.getlTotalSize() + "");
            params.putString("uploadedSize", status.getlUploadedSize() + "");
        } else if (st == UPLOADINGSTATUS.DONE) {
            params.putString("uStatus", "done");
            params.putString("totalsize", status.getlTotalSize() + "");
            params.putString("message", status.getsMessage());
        } else {
            params.putString("uStatus", "unknown");
        }

        this.sendEvent("change-status", params);
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        this.reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}
