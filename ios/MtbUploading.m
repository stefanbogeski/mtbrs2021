//
//  MtbUploading.m
//  mtbrecord
//
//  Created by Codie Leal on 11/4/20.
//

#import <Foundation/Foundation.h>
#import "MtbUploading.h"
#import "AppDelegate.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import <AliyunOSSiOS/OSSService.h>

#define OSS_ACCESS_KEY_ID           @"OSS_ACCESS_KEY_ID"
#define OSS_ACCESS_KEY_SECRET       @"OSS_ACCESS_KEY_SECRET"
#define OSS_STS_URL                 @"OSS_STS_URL"
#define OSS_ENDPOINT                @"OSS_ENDPOINT"
#define OSS_BUCKET_NAME             @"OSS_BUCKET_NAME"

@interface MtbUploading (){
  OSSClient *_client;
  int64_t _totalSize;
  int64_t _uploadedSize;
  int64_t _upladingSize;
  int64_t _upladingFileSize;
  NSString *_uStatus;
  NSString *_message;
  NSTimer *timeOfActiveUser;
}

@end

@implementation MtbUploading

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"change-status"];
}

RCT_EXPORT_METHOD(startUploading:(NSArray<NSString *> *)filePaths alibabaRefs:(NSArray<NSString *> *)alibabaRefs examUUID:(NSString *)examUUID params:(NSString *)params) {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    self->timeOfActiveUser = [NSTimer scheduledTimerWithTimeInterval:0.1 target:self selector:@selector(sendEvent) userInfo:nil repeats:YES];
  });

  _uStatus = @"prepare";
  _message = @"";
  [self initConfiguration];
  
  int i;
  _totalSize = 0;
  _uploadedSize = 0;
  _upladingSize = 0;
  _upladingFileSize = 0;
  for (i = 0; i < [filePaths count]; i++) {
    NSURL *baseURL = [NSURL URLWithString:filePaths[i]];
    
    NSString *path = baseURL.path;
    int64_t fileSize = [[[NSFileManager defaultManager] attributesOfItemAtPath:path error:nil] fileSize];
    _totalSize += fileSize;
  }

  _uStatus = @"uploading";
  for (i = 0; i < [filePaths count]; i++) {
    if ([_uStatus  isEqual: @"error"]) break;
    [self fileUploading:filePaths[i] storageRef:alibabaRefs[i]];
  }
  
  if ([_uStatus  isEqual: @"error"]) {
    
  } else {
    // [self finishUploading:@"done" message:@"Exam upload complete."];
    [self submittingExamInfo:examUUID params:params];
  }
}

RCT_EXPORT_METHOD(stopUploading) {

}

- (void)fileUploading:(NSString *)filepath storageRef:(NSString *)storageRef {
  OSSPutObjectRequest * put = [OSSPutObjectRequest new];
  put.bucketName = OSS_BUCKET_NAME;
  put.objectKey = storageRef;
  put.uploadingFileURL = [NSURL URLWithString:filepath];
  put.uploadProgress = ^(int64_t bytesSent, int64_t totalByteSent, int64_t totalBytesExpectedToSend) {
    self->_upladingFileSize = totalBytesExpectedToSend;
    self->_upladingSize = totalByteSent;
    NSLog(@"-- uploading -- %lld", totalByteSent);
  };

  OSSTask * putTask = [_client putObject:put];
  [putTask continueWithBlock:^id(OSSTask *task) {
      if (! task.error) {
        self->_uploadedSize = self->_uploadedSize + self->_upladingFileSize;
        self->_upladingSize = 0;
      } else {
        [self finishUploading:@"error" message:@"uploading error"];
      }
      return nil;
  }];
  [putTask waitUntilFinished];
}

- (void)initConfiguration {
  id<OSSCredentialProvider> credentialProvider = [[OSSPlainTextAKSKPairCredentialProvider alloc] initWithPlainTextAccessKey:OSS_ACCESS_KEY_ID secretKey:OSS_ACCESS_KEY_SECRET];
//  OSSAuthCredentialProvider *credentialProvider = [[OSSAuthCredentialProvider alloc] initWithAuthServerUrl:OSS_STS_URL];
  OSSClientConfiguration *cfg = [[OSSClientConfiguration alloc] init];
  cfg.maxRetryCount = 3;
  cfg.maxConcurrentRequestCount = 10;
  cfg.timeoutIntervalForRequest = 30;
  cfg.timeoutIntervalForResource = 24 * 60 * 60;
  _client = [[OSSClient alloc] initWithEndpoint:OSS_ENDPOINT credentialProvider:credentialProvider clientConfiguration:cfg];
}

- (void) submittingExamInfo:(NSString *)eUUID params:(NSString *)params {
  NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"BASE_URL/%@", eUUID]];

  // Convert the dictionary into JSON data.
  NSData *JSONData = [params dataUsingEncoding:NSUTF8StringEncoding];
  // NSData *JSONData = [NSJSONSerialization dataWithJSONObject:params options:0 error:nil];
  
  // Create a POST request with our JSON as a request body.
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  request.HTTPMethod = @"PUT";
  request.HTTPBody = JSONData;
  NSString *authValue = [NSString stringWithFormat:@"Bearer %@", @"5a67ec7d-bfa1-501a-9943-7ce0f2bb089d"];
  [request setValue:authValue forHTTPHeaderField:@"Authorization"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [request setValue:@"XMLHttpRequest" forHTTPHeaderField:@"X-Requested-With"];
  
  // Create a task.
  NSURLSessionDataTask *submitTask = [[NSURLSession sharedSession] dataTaskWithRequest:request
                                                               completionHandler:^(NSData *data,
                                                                                   NSURLResponse *response,
                                                                                   NSError *error)
  {
    if (!error)
    {
      long statusCode = ((NSHTTPURLResponse *)response).statusCode;
      if (statusCode != 200) {
        [self finishUploading:@"error" message:[NSString stringWithFormat:@"Submission Api calling is failed. %ld", statusCode]];
      } else {
        [self finishUploading:@"done" message:@"Exam upload complete."];
      }
    }
    else
    {
      [self finishUploading:@"error" message:error.localizedDescription];
    }
  }];
  // Start the task.
  [submitTask resume];
}

- (void) finishUploading:(NSString *)status message:(NSString *)message {
  [timeOfActiveUser invalidate];
  timeOfActiveUser = nil;
  
  self->_uStatus = status;
  self->_message = message;
  [self sendEvent];
}

- (void)sendEvent {
  if ([_uStatus  isEqual: @"prepare"]) {
    [self sendEventWithName:@"change-status" body:@{
      @"uStatus": _uStatus,
      @"message": _message
    }];
  } else if ([_uStatus  isEqual: @"error"]) {
    [self sendEventWithName:@"change-status" body:@{
      @"uStatus": _uStatus,
      @"message": _message
    }];
  } else if ([_uStatus  isEqual: @"uploading"]) {
    [self sendEventWithName:@"change-status" body:@{
      @"uStatus": @"uploading",
      @"totalsize": [NSString stringWithFormat:@"%lld", _totalSize],
      @"uploadedSize": [NSString stringWithFormat:@"%lld", (_uploadedSize + _upladingSize)]
    }];
  } else if ([_uStatus  isEqual: @"done"]) {
    [self sendEventWithName:@"change-status" body:@{
      @"uStatus": @"done",
      @"totalsize": [NSString stringWithFormat:@"%lld", _totalSize],
      @"message": _message
    }];
  } else {
    [self sendEventWithName:@"change-status" body:@{
      @"uStatus": @"unknown"
    }];
  }
}

@end
