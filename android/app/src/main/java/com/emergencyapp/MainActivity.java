package com.emergencyapp;

import com.facebook.react.ReactActivity;
import androidx.core.app.ActivityCompat; 
import androidx.core.content.ContextCompat; 
import androidx.appcompat.app.AppCompatActivity; 
import androidx.annotation.NonNull;
import android.content.pm.PackageManager;
import android.os.Bundle; 
import android.widget.Toast; 
import android.Manifest;

public class MainActivity extends ReactActivity {
  private static final int ACCESS_FINE_LOCATION_CODE = 101; 
  private static final int ACCESS_COARSE_LOCATION_CODE = 102; 

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "EmergencyApp";
  }


      @Override
    protected void onCreate(Bundle savedInstanceState) 
    { 
      super.onCreate(savedInstanceState); 
      checkPermission( 
        Manifest.permission.ACCESS_FINE_LOCATION, 
        ACCESS_FINE_LOCATION_CODE); 
      checkPermission( 
        Manifest.permission.ACCESS_FINE_LOCATION, 
        ACCESS_COARSE_LOCATION_CODE); 
      }

  public void checkPermission(String permission, int requestCode) 
  { 
      if (ContextCompat.checkSelfPermission(MainActivity.this, permission) 
          == PackageManager.PERMISSION_DENIED) { 

          // Requesting the permission 
          ActivityCompat.requestPermissions(MainActivity.this, 
                                            new String[] { permission }, 
                                            requestCode); 
      } 
      else { 
          /*Toast.makeText(MainActivity.this, 
                         "Permission already granted", 
                         Toast.LENGTH_SHORT) 
              .show(); */
      } 
  } 

  // This function is called when the user accepts or decline the permission. 
  // Request Code is used to check which permission called this function. 
  // This request code is provided when the user is prompt for permission. 

  @Override
  public void onRequestPermissionsResult(int requestCode, 
                                         @NonNull String[] permissions, 
                                         @NonNull int[] grantResults) 
  { 
      super
          .onRequestPermissionsResult(requestCode, 
                                      permissions, 
                                      grantResults); 

          if (grantResults.length > 0
              && grantResults[0] == PackageManager.PERMISSION_GRANTED) { 
              Toast.makeText(MainActivity.this, 
                (requestCode == ACCESS_FINE_LOCATION_CODE) ? 
                "Fine location permission granted" : "Coarse location permission granted", 
                Toast.LENGTH_SHORT) 
              .show(); 
          } 
          else { 
              Toast.makeText(MainActivity.this, 
                (requestCode == ACCESS_FINE_LOCATION_CODE) ? 
                "Fine location permission denied" : "Coarse location permission denied", 
                Toast.LENGTH_SHORT) 
              .show(); 
          } 
  } 
}
