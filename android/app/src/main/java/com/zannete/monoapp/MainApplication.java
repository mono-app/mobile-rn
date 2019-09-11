package com.zannete.monoapp;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.wix.RNCameraKit.RNCameraKitPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.eko.RNBackgroundDownloaderPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.dylanvann.fastimage.FastImageViewPackage;

import org.reactnative.camera.RNCameraPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.rnfs.RNFSPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;  

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.instanceid.RNFirebaseInstanceIdPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new WebRTCModulePackage(),
          new RandomBytesPackage(),
          new RNCameraKitPackage(),
          new DocumentPickerPackage(),
          new RNBackgroundDownloaderPackage(),
          new AsyncStoragePackage(),
          new NetInfoPackage(),
          new RNSpinkitPackage(),
          new FastImageViewPackage(),
          new RNFSPackage(),
          new RNCameraPackage(),
          new RNSensitiveInfoPackage(),
          new SvgPackage(),
          new VectorIconsPackage(),
          new RNGestureHandlerPackage(),
          new RNFirebasePackage(),
          new RNFirebaseFirestorePackage(),
          new RNFirebaseAuthPackage(),
          new RNFirebaseStoragePackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage(),
          new RNFirebaseInstanceIdPackage(),
          new MapsPackage(),
          new RNGooglePlacesPackage(),
          new RNFetchBlobPackage()                                                                                         
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
