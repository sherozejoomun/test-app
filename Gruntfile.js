/**
 * Axians
  * Copyright (c) 2015 Jon Schlinkert
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({

		'regex-replace': {
			recette:{
				src: ['config.xml','www/config.json','Info.plist'],
				actions:[
					{
						name: 'version',
						search: /\{\$versionApp\}/g,
						replace: '<%= grunt.option(\'versionApp\') %>'
					},
					{
						name: 'versionCode',
						search: /\{\$versionCode\}/g,
						replace: '<%= grunt.option(\'buildNumber\') %>'
					},
					{
						name: 'bundle',
						search: /\{\$bundle\}/g,
						replace: 'com.vinci.iamrec'
					},
					{
						name: 'serverAdresse',
						search: /\{\$middleware\}/g,
						replace: 'https://mobile-recette.vinci-energies.net'
					},
					{
						name: 'name',
						search: /\{\$nameApp\}/g,
						replace: '<%= grunt.option(\'nameApp\') %>'
					}
				]
			},
			production:{
				src: ['config.xml','www/config.json','Info.plist'],
				actions:[
					{
						name: 'version',
						search: /\{\$versionApp\}/g,
						replace: '<%= grunt.option(\'versionApp\') %>'
					},
					{
						name: 'versionCode',
						search: /\{\$versionCode\}/g,
						replace: '<%= grunt.option(\'buildNumber\') %>'
					},
					{
						name: 'bundle',
						search: /\{\$bundle\}/g,
						replace: 'com.vinci.iam'
					},
					{
						name: 'serverAdresse',
						search: /\{\$middleware\}/g,
						replace: 'https://mobile-recette.vinci-energies.net'
					},
					{
						name: 'name',
						search: /\{\$nameApp\}/g,
						replace: '<%= grunt.option(\'nameApp\') %>'
					}
				]
			},
			preProduction:{

			},
			preWP10:{
				src: ['platforms/windows/package.windows10.appxmanifest','platforms/windows/CordovaApp.Windows10.jsproj'],
				actions:[
					{
						name: 'Identity',
						search: /Name="\{.*\}" Publisher/g,
						replace: 'Name="VINCIEnergiesSI.FlashInfo" Publisher'
					},
					{
						name: 'publisher',
						search: /Publisher=.* Version/g,
						replace: 'Publisher="OID.0.9.2342.19200300.100.1.1=9417597, CN=VINCI ENERGIES SYSTÈMES DINFORMATION, OU=VINCI ENERGIES SYSTÈMES DINFORMATION" Version'
					},
					{
						name: 'PhoneIdentity',
						search: /PhoneProductId=.* PhonePublisherId/g,
						replace: 'PhoneProductId="<%= grunt.option(\'productIdWindows\')%>" PhonePublisherId'
					},
					{
						name: 'make',
						search: /<AppxPackageSigningEnabled>true<\/AppxPackageSigningEnabled>/g,
						replace: '<AppxPackageSigningEnabled>false</AppxPackageSigningEnabled>'
					}
				]
			},
			postWP10:{
				src: ['platforms/windows/AppPackages/*_arm_*/temp/AppxManifest.xml'],
				actions:[
					{
						name: 'publisher',
						search: /Publisher.* Version/g,
						replace: 'Publisher="OID.0.9.2342.19200300.100.1.1=9417597, CN=VINCI ENERGIES SYSTÈMES DINFORMATION, OU=VINCI ENERGIES SYSTÈMES DINFORMATION" Version'
					},
					{
						name: 'PhoneIdentity',
						search: /PhoneProductId=.* PhonePublisherId/g,
						replace: 'PhoneProductId="<%= grunt.option(\'productIdWindows\')%>" PhonePublisherId'
					}
				]
			}
		},

		shell : {
			echo : {
				command : function (args){
					return 'echo args';
				}
			},
			gulp : {
				command : function (target) {
					if (process.platform === "win32") {
						var cmd = 'gulp build'
						return cmd;
					}else {
						var cmd = 'gulp build'
						return cmd;
					}

				}
			},
			beforeCreateApp:{
				command : function (target) {
					if (process.platform === "win32") {
						var cmd = 'echo F | xcopy /Y /E resources\\windows\\packageWP.json package.json ';	
						cmd +=' & rmdir /Q /S node_modules & npm install grunt-shell grunt-regex-replace & npm install';
						return cmd;
					}else {
					}

				}				
				
			},
		
			createApp : {
				command : function (target,version) {
					if (process.platform === "win32") {
						var cmd = 'ionic platform rm ' + target;
						cmd += ' & ionic platform add ' + target + version;
						cmd += ' & ionic prepare ' + target;
						return cmd;
					}else {
						var cmd = 'ionic platform rm ' + target;
						cmd += ' ; ionic platform add ' + target + version ;
						cmd += ' ; ionic prepare ' + target;
						return cmd;
					}

				}
			},
			buildApp : {
				command : function (target) {
					if (process.platform === "win32") {						
						var cmd = ' ionic build '  + target + " --release --device --appx=uap --archs=arm";
						return cmd;
					}else {
						//var cmd = 'ionic build '  + target + " --release";
						var cmd ="";
						if(target == "ios") {
							//copie la config pour le build iOS. génère la signature
							//cmd = 'cordova plugin rm phonegap-plugin-push ; cordova plugin add phonegap-plugin-push@1.8.1 --variable SENDER_ID="220387290192" ;';
							cmd += 'cp build-release.xcconfig platforms/ios/cordova/ ;';
							cmd += 'cp Info.plist "platforms/ios/' + grunt.option('nameApp') + '/' + grunt.option('nameApp')+'-Info.plist" ; '; //pb https iOS 9
							cmd += 'cp Info.plist platforms/ios/ ;';
							cmd += 'ionic build '  + target + " --device --release";
						}else {
							//cmd = 'cordova plugin rm cordova-sqlite-storage ; cordova plugin add cordova-sqlite-storage@1.4.7 ;';
							cmd += 'ionic build '  + target + " --release";
						}
						return cmd;
					}

				},
				options: {
            		execOptions: {
                		maxBuffer: Infinity
            		}
        		}
			},
			launchApp : {
				command : function (target) {
						var cmd = ' ionic run --device';
						return cmd;

				}
			},
			postBuildAppWP10: {
				command : function (task) {
						var nameApp = grunt.option('nameApp');
						nameApp = nameApp.replace(' ','');
						var path = "platforms\\windows\\AppPackages\\CordovaApp.Windows10_" + grunt.option('versionApp') +".0_arm_Test\\";
						var cmd ="";
						if(task === "unpack"){
							cmd = "makeappx.exe unpack /p "+ path + "CordovaApp.Windows10_" + grunt.option('versionApp') +".0_arm.appx /d " + path + "temp /l > makeLogUnpack.log";
						}else{
							cmd = "makeappx.exe pack /d "+ path + "temp /p "+ path + "temp.appx" +" /l > makeLogPack.log" ;
						}
						return cmd;
				}
			},
			signApp : {
				command : function (target) {
					var cmd="";
					if (process.platform === "win32") {

						if(target == "android"){
							//pour la recette
							var nameApp = grunt.option('nameApp');
							nameApp = nameApp.replace(' ','');
							// // copie sur slave
							cmd += 'echo F | xcopy /Y /E "platforms\\android\\ant-build\\' + nameApp +'-release-unsigned.apk" "'  + grunt.option('pathBuild') + '.apk "' ;
							//signApp
							cmd += ' & jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "C:\\Users\\mob\\Documents\\Certificat\\keystoreVinci" -storepass 20sixNRJ -keypass 20sixNRJ "' +  grunt.option('pathBuild') + '.apk " affaires';

							// copie sur le maitre pour le plugin copy to slave
							cmd += ' & echo F | xcopy /Y /E "' +  grunt.option('pathBuild') + '.apk" "..\\"'

						}else if(target == "wp8"){
							// copie sur slave
							cmd += ' echo F | xcopy /Y /E "platforms\\wp8\\Bin\\Release\\ionicAppProj_Release_AnyCPU.xap" "' + grunt.option('pathBuild') + '.xap "' ;
							cmd += ' & XapSignTool.exe sign /SignTool "C:\\Program Files (x86)\\Windows Kits\\8.0\\bin\\x86" /f "C:\\Users\\mob\\Documents\\Certificat\\cert-win.pfx" /p 20sixNRJ "' +  grunt.option('pathBuild') + '.xap"' ;

							// copie sur le maitre pour le plugin copy to slave
							cmd += ' & echo F | xcopy /Y /E "' +  grunt.option('pathBuild') + '.xap" "..\\"'
						}else if(target == "windows"){
							var path = "platforms\\windows\\AppPackages\\CordovaApp.Windows10_" + grunt.option('versionApp') +".0_arm_Test";
							// copie sur slave
							cmd += ' echo F | xcopy /Y /E "' + path + '\\temp.appx" "' + grunt.option('pathBuild') + '.appx "' ;
							cmd += ' & signtool.exe sign -fd SHA256 -f "C:\\Users\\mob\\Documents\\Certificat\\cert-win.pfx" /p 20sixNRJ "' +  grunt.option('pathBuild') + '.appx"' ;
							//delete temp
							cmd += ' & rmdir /Q /S ' + path + ' & del ' + path + '\\temp.appx';
							cmd += ' & del ' + path + '\\makeLogUnpack.log ' + '& del ' + path + '\\makeLogPack.log ';
							// copie sur le maitre pour le plugin copy to slave
							cmd += ' & echo F | xcopy /Y /E "' +  grunt.option('pathBuild') + '.appx" "..\\..\\..\\..\\"'
						}

					}else {

						if(target == "android"){
							//pour la recette
							var nameApp = grunt.option('nameApp');
							nameApp = nameApp.replace(/ /g,'');
							//move
							cmd += 'cp platforms/android/build/outputs/apk/android-release-unsigned.apk '  + nameApp + '.apk;' ;
							//signApp
							cmd += ' jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "$APPS_HOME/keystoreVinci" -storepass 20sixNRJ -keypass 20sixNRJ ' + nameApp + '.apk' + ' iam';

						}else if(target == "ios"){
							//prepare directement pour la copie du slave vers le maitre
							var nameApp = grunt.option('nameApp');
							nameApp = nameApp.replace(/ /g,'');
							cmd = "mkdir -p builds/"+ nameApp +"/"+ grunt.option('versionApp')+"; " ;
							cmd += "xcrun -sdk iphoneos PackageApplication -v \"platforms/ios/build/device/" + grunt.option('nameApp') + ".app\" -o \"" + grunt.option('pathBuild') + '.ipa\"' ;
							//ligne de commande pour vérifier la signature
							//zip et dezziper
							//codesign -d --entitlements :- "Payload/Energies Rec.app"/
							//security cms -D -i "Payload/Energies Rec.app/embedded.mobileprovision"
						}
					}
					return cmd;
				}
			},
			svnrevert:{
				command : function () {
					if (process.platform === "win32") {
						var cmd = "svn revert config.xml ;";
						cmd += "svn revert www\\config.json ;";
						return cmd;
					}else {
						var cmd = "svn revert config.xml ;";
						cmd += "svn revert www/config.json ;";
						cmd += "svn revert Info.plist";
						return cmd;
					}
				}
			},
			sendApp:{
				command : function (target) {
					if (process.platform === "win32") {
						if(target == "wp8"){
							//prepare pour la copie du slave vers le maitre
							var cmd = 'echo F | xcopy /Y /E "' + grunt.option('pathBuild') + '.xap" "..\\.." ';
							return cmd;
						} else if(target == "android"){
							var cmd = 'echo F | xcopy /Y /E "' + grunt.option('pathBuild') + '.apk" ' + ' "\\\\L-5CG505375C\\APPSign\\Affaires\\' + grunt.option('nameApp') +"\\"+grunt.option('versionApp')+"\\" + grunt.option('nameApp')+ '.apk"';
							return cmd;
						} else if(target == "windows"){
							var cmd = 'echo F | xcopy /Y /E "' + grunt.option('pathBuild') + '.appx" "..\\..\\.." ';
							return cmd;
						}
					}else{
						//sur le maitre on fait la copie
						if(target == "android"){
							//pour la recette
							var nameApp = grunt.option('nameApp');
							nameApp = nameApp.replace(/ /g,'');
							//nom du dossier
							var versionApp = grunt.option('versionApp');
							var versionAppFile = versionApp.replace(/\./g,'-');
							//nom du fichier avec date YYYYMMDDHHmmSSsss
							var date = (new Date()).toISOString().replace(/[^0-9]/g, "");

							//cmd
							var cmd = 'mkdir -p ' + grunt.option('destDir') + '; ';
							cmd += ' cp ' + nameApp +'.apk "'+  grunt.option('destDir')+'/' + nameApp + '_' + versionAppFile + '_' +  grunt.option('buildNumber') +'.apk"';

						}else if(target == 'ios')
						{
							//prepare pour la copie du slave vers le maitre
							cmd = "cp " + grunt.option('pathBuild') + ".ipa " + grunt.option('destDir');
						}
						return cmd;
					}
				}
			}
		}
	});

	// Load npm plugins to provide necessary tasks.
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-regex-replace');

	//init from jenkins
	grunt.task.registerTask('build', 'init variable from jenkins', function(target,mode,versionApp,buildNumber,appName,destDir,productIdWindows) {
			grunt.log.writeln(this.name + " with env: " + mode + " version:" + versionApp + " buildNumber:" + buildNumber + " appName:"+ appName + " destDir:" + destDir + " product:"+ productIdWindows);

			if (arguments.length === 0) {
				grunt.log.writeln(this.name + ", no args");
				grunt.log.writeln(this.name + ", first arg is number version app and second arg is mode rec|prod|pre-prod");
			} else {
				if(typeof target === "undefined" || target === ""){
					grunt.log.writeln(this.name + ", target arg is empty");
					grunt.fail.fatal("exit");
				}else if(typeof mode === "undefined" || mode === ""){
					grunt.log.writeln(this.name + ", mode arg is empty");
					grunt.fail.fatal("exit");
				}else if(typeof versionApp === "undefined" || versionApp === ""){
					grunt.log.writeln(this.name + ", versionApp arg is empty");
					grunt.fail.fatal("exit");
				}else if(typeof buildNumber === "undefined" || buildNumber === ""){
					grunt.log.writeln(this.name + ", buildNumber arg is empty");
					grunt.fail.fatal("exit");
				}else if(typeof appName === "undefined" || appName === ""){
					grunt.log.writeln(this.name + ", appName arg is empty");
					grunt.fail.fatal("exit");
				}else if(typeof destDir === "undefined" || destDir === ""){
					grunt.log.writeln(this.name + ", destDir arg is empty");
					grunt.fail.fatal("exit");
				}

				//---------------------logs parameter
				grunt.log.writeln("versionApp: " + versionApp + " --- " +"buildNumber: " + buildNumber + " --- " + "appName: " + appName + " --- " );



				//---------------------replace variables environement
				grunt.option('versionApp',versionApp);
				grunt.option('buildNumber',buildNumber);
				grunt.option('nameProject',"Axians");
				grunt.option('destDir',destDir.replace(/ /g,''));
				grunt.log.writeln(this.name + " with env: " + mode + " version:" + versionApp + " buildNumber:" + buildNumber + " appName:"+ appName + " destDir:" + destDir + " product:"+ productIdWindows);
				grunt.option('productIdWindows',productIdWindows);

				grunt.task.run('shell:svnrevert');

				//replace variable
				if(mode === "rec"){
					//replace variables environement
					grunt.option('nameApp',appName +' Rec');
					grunt.option('nameProvisionProfile','affaires - distribution - rec');
					grunt.task.run('regex-replace:recette');

				}
				else if(mode === "prod"){
					//replace variables environement
					grunt.option('nameApp',appName);
					grunt.option('nameProvisionProfile','affaires - distribution');
					grunt.task.run('regex-replace:production');
				}
				else if(mode === "pre-prod"){
					//replace variables environement
				}

				//---------------construct build pathBuild
				//pour la recette
				var nameApp = grunt.option('nameApp');
				nameApp = nameApp.replace(/ /g,'');
				grunt.log.writeln("nameAppComprese appName: "+ appName );
				//nom du dossier
				var versionApp = grunt.option('versionApp');
				var versionAppFile = versionApp.replace(/\./g,'-');
				//nom du fichier avec date YYYYMMDDHHmmSSsss
				var date = (new Date()).toISOString().replace(/[^0-9]/g, "");



				if (process.platform === "win32") {
						//WP8
						var pathBuild = "builds\\"+nameApp+ '\\'+ versionApp + '\\' + nameApp +'_' + versionAppFile + '_' +  grunt.option('buildNumber');
						grunt.option('pathBuild',pathBuild);
					}else {
						//iOS
						var pathBuild = "$PWD/builds/"+ nameApp+"/" + versionApp + '/' + nameApp +'_' + versionAppFile + '_' +  grunt.option('buildNumber');
						grunt.option('pathBuild',pathBuild);
					}




				//------------------create,build,sign and move
				if(target==='android'){
					grunt.task.run( ['shell:createApp:android:@6.1.0','shell:buildApp:android','shell:svnrevert','shell:signApp:android','shell:sendApp:android']);
				}else if(target==='wp8'){
					grunt.task.run( ['shell:createApp:wp8:','regex-replace:manifestWP8','shell:buildApp:wp8','shell:svnrevert','shell:signApp:wp8','shell:sendApp:wp8']);
				}else if(target==='ios'){
					grunt.task.run( ['shell:createApp:ios:@4.3.0','shell:buildApp:ios','shell:svnrevert','shell:signApp:ios','shell:sendApp:ios']);
				}else if(target==='windows'){
					grunt.task.run( ['shell:beforeCreateApp:windows','shell:createApp:windows:@4.4.3','regex-replace:preWP10','shell:buildApp:windows','shell:postBuildAppWP10:unpack','regex-replace:postWP10','shell:postBuildAppWP10:pack','shell:svnrevert','shell:signApp:windows','shell:sendApp:windows']);
				}



			}
	});



	// Default to tasks to run with the "grunt" command.
	grunt.registerTask('default', ['clean', 'jshint', 'test', 'assemble']);

	// launch app
	grunt.registerTask('wp8', ['shell:createApp:wp8','regex-replace:manifestWP8','shell:buildApp:wp8']);
	grunt.registerTask('android', ['shell:createApp:android','shell:buildApp:android','shell:signApp:android']);
	grunt.registerTask('ios', ['shell:createApp:ios --device','shell:buildApp:ios --device']);
	grunt.registerTask('echo', ['shell:echo']);
	grunt.registerTask('signApp', ['shell:signApp:android']);
	// replace task.
	grunt.registerTask('replace', ['regex-replace:recette']);

		//install
	grunt.registerTask('install', []);

};