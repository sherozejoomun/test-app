import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class SDKPluginHandlerService {
  sdkPluginHandler: any;

  /**
   * Creates an instance of SDKPluginHandlerService.
   *
   * @param platform {Platform} Platform instance
   */
  constructor(public platform: Platform) {
    this.sdkPluginHandler = null;
  }

  /**
   * Initialises MaaS360SDK
   *
   * @param developerKey {string} The developer key given to developer
   * @param licenseKey {string}  The license key
   */
  initializeSDK(developerKey: string, licenseKey: string): void {
    this.sdkPluginHandler = cordova.require('cordova-plugin-m360-sdk.SDKHandler');
    this.sdkPluginHandler.init(developerKey, licenseKey);

  }

  /**
   * Get activation details
   *
   * @returns {any}
   */
  getActivationInfo(): any {
    return this.sdkPluginHandler.getActivationInfo();
  }

  /**
   * Get policy details
   *
   * @returns {any}
   */
  getPolicyInfo(): any {
    return this.sdkPluginHandler.getPolicyInfo();
  }

  /**
   * Get device security details
   *
   * @returns {any}
   */
  getSecurityInfo(): any {
    return this.sdkPluginHandler.getSecurityInfo();
  }

  /**
   * Get user details
   *
   * @returns {any}
   */
  getUserInfo(): any {
    return this.sdkPluginHandler.getUserInfo();
  }

  /**
   * Gets device identity attributes configured
   *
   * @returns {any}
   */
  getDeviceIdentityAttributeInfo(): any {
    return this.sdkPluginHandler.getDeviceIdentityAttributeInfo();
  }

  /**
   * Gets app configuartion data configured in policy
   *
   * @returns {any}
   */
  getAppConfig(): any {
    return this.sdkPluginHandler.getAppConfig();
  }

  /**
   * Reports container lock status
   *
   * @returns {boolean}
   */
  getContainerLockUpdate(): boolean {
    return this.sdkPluginHandler.getContainerLockUpdate();
  }

  /**
   * Get selective status
   *
   * @returns {any}
   */
  getSelectiveWipeStatus(): any {
    return this.sdkPluginHandler.getSelectiveWipeStatus();
  }

}
