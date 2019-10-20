package com.zannete.monoapp;

import android.app.Application;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.rnfs.RNFSPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.RNFetchBlob.RNFetchBlobPackage; 
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts; 

import com.react.rnspinkit.RNSpinkitPackage;
import com.dylanvann.fastimage.FastImageViewPackage;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;

import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.opentokreactnative.OTPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
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
            new RealmReactPackage(),
            new OTPackage(),
            new RNFusedLocationPackage(),
            new PickerPackage(),
          new ImageResizerPackage(),
          new ImagePickerPackage(),
          new DocumentPickerPackage(),
          new AsyncStoragePackage(),
          new NetInfoPackage(),
          new RNSpinkitPackage(),
          new FastImageViewPackage(),
          new RNFSPackage(),
          new RNCameraPackage(),
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
          new RNFetchBlobPackage(),
          new ReactNativeContacts()                                                                            
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
