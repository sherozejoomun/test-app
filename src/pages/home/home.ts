import { Component } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Config } from '../../components/config/config';
import { SDKPluginHandlerService } from '../../providers/sdkplugin-handler-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  _userForm: FormGroup;
  _userName: String;
  loading: any;

  constructor(public alertController: AlertController, public fb: FormBuilder,
    private sdkPluginHandlerService: SDKPluginHandlerService, private platform: Platform) {
    document.addEventListener("deviceready", () => window['isCordovaReady'] = true, false);
    this._userForm = fb.group({
      oldPassword: fb.control(''),
      newPassword: fb.control(''),
      newPassword2: fb.control(''),
      rulesPwd: fb.control('')
    });

    platform.ready().then(() => {
      if (!!window['isCordovaReady']) {
        onDeviceReady();
      } else {
        document.addEventListener("deviceready", onDeviceReady, false);
      }

      function onDeviceReady() {
        this.sdkPluginHandlerService.initializeSDK('0020003747', '917B-C741-4A28-8FB2');
        let data = JSON.parse(this.sdkPluginHandlerService.getUserInfo());
        this._userName = data.username;
      }

    });
  }

  private showAlert(title: string, message: string): void {
    let alert = this.alertController.create({
      title: title,
      subTitle: message,
      buttons: ["close"]
    });
    alert.present(alert);
  }

  ngOnInit() {
    //TODO:injecter service provider sdk et recuperer le nom de l'utilisateur
    let data = JSON.parse(this.sdkPluginHandlerService.getUserInfo());
    this._userName = data.username;
  }

  /**
   * handle submission
  */
  submitChangePwd() {
    console.log(this._userForm.value);
    let data = JSON.parse(this.sdkPluginHandlerService.getUserInfo());
    this._userName = data.username;
    // this.showAlert('User Name:', data.username);
  }

  /**
   * Method that shows an alert wih version of app
   *
   */
  showVersion(): void {
    let alert = this.alertController.create({
      title: "Version",
      subTitle: Config.VERSION_APP,
      buttons: ["close"]
    });
    alert.present(alert);
  }

  /**
   * get image according language
   */
  getRulesImageUrl() {
    //TODO : according langue
    return '../../img/rules-' + 'en' + '.jpg';
  }


}
