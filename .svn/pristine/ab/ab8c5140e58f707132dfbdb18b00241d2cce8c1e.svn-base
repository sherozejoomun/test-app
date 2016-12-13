

/**
 * Config defines the application configuration settings.
 *
 * @author: 
 * @version: 1.0.0
 * @since: 1.0.0
 */
export class Config {

  // Application version
  public static get VERSION_APP():string {
    return '1.0.0';
  }


  // Application ID
  public static get APPLICATION_ID():string {
    return 'FlashInfo';
  }

  // Application API BASE
  public static get BASE_URL():string {
    return 'https://mobile-recette.vinci-energies.net/flashinfo/api/v1';
  }

  // Default country for Logging
  public static get DEFAULT_COUNTRY():string {
    return 'France';
  }

  // Default application locale
  public static get DEFAULT_LOCALE():string {
    return 'en';
  }

  // Domain name that is appended to the user name to get the email address of the user.
  public static get DOMAIN():string {
    return 'vinci-energies.net';
  }

  // URL for IP localisation
  public static get IP_LOCALISATION_URL():string {
    return 'http://ip-api.com/json';
  }

  // Logging component configurations
  public static get LOGGING():any {

    return {
      APPLICATION_NAME: 'IAM',
      BUSINESS_UNIT: null,
      COMPANY: null,
      ECHO_URL: 'https://mobile-recette.vinci-energies.net/log-middleware/services/echo',
      LOG_LEVEL: 'INFO',
      LOGGER_NAME: 'flashInfoLogger',
      METIER: {
        NAME: 'LogMetier',
        URL: 'https://mobile-recette.vinci-energies.net/log-middleware/services/addLogMetier'
      },
      PING_URL: 'https://mobile-recette.vinci-energies.net/log-middleware/services/ping',
      STATISTIQUE_URL: 'https://mobile-recette.vinci-energies.net/log-middleware/services/addLogSuivi',
      TECHNIQUE: {
        NAME: 'LogTechnique',
        URL: 'https://mobile-recette.vinci-energies.net/log-middleware/services/addLogTechnique'
      },
      VERSION: '1.0.5'
    }
  }

  // Push notification settings for the application
  public static get PN_SETTINGS():any {
    return {
      android: {
        senderID: '220387290192'
      },
      ios: {
        alert: true,
        badge: true,
        sound: false
      },
      windows: {
      }
    }
  }

  // URL for push notification service registration
  public static get PN_USER_SERVICE_REGISTRATION_URL():string {
    return 'https://mobile-recette.vinci-energies.net/push-notifications/services/utilisateur';
  }
}
