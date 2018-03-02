'use strict';

angular.module('emission.stats.clientstats', [])

.factory('ClientStats', function($window) {
  var clientStat = {};

  clientStat.CLIENT_TIME = "stats/client_time";
  clientStat.CLIENT_ERROR = "stats/client_error";
  clientStat.CLIENT_NAV_EVENT = "stats/client_nav_event";

  clientStat.getStatKeys = function() {
    return {
      STATE_CHANGED: "state_changed",
      BUTTON_FORCE_SYNC: "button_sync_forced"
      DIARY_TIME: "diary_time"
    };
  }

  clientStat.getDB = function() {
    if (angular.isDefined($window) && angular.isDefined($window.cordova) &&
        angular.isDefined($window.cordova.plugins)) {
        return $window.cordova.plugins.BEMUserCache;
    } else {
        return; // undefined
    }
  }

  clientStat.getAppVersion = function() {
    if (angular.isDefined(clientStat.appVersion)) {
        return clientStat.appVersion;
    } else {
        if (angular.isDefined($window) && angular.isDefined($window.cordova) &&
            angular.isDefined($window.cordova.getAppVersion)) {
            $window.cordova.getAppVersion.getVersionNumber().then(function(version) {
                clientStat.appVersion = version;
            });
        }
        return;
    }
  }

  clientStat.getStatsEvent = function(name, reading) {
    var ts_sec = Date.now() / 1000;
    var appVersion = clientStat.getAppVersion();
    return {
      'name': name,
      'ts': ts_sec,
      'reading': reading,
      'client_app_version': appVersion,
      'client_os_version': $window.device.version
    };
  }
  clientStat.addReading = function(name, reading) {
    var db = clientStat.getDB();
    if (angular.isDefined(db)) {
        return db.putMessage(clientStat.CLIENT_TIME,
          clientStat.getStatsEvent(name, reading));
    }
  }

  clientStat.addEvent = function(name) {
    var db = clientStat.getDB();
    if (angular.isDefined(db)) {
        return db.putMessage(clientStat.CLIENT_NAV_EVENT,
          clientStat.getStatsEvent(name, null));
    }
  }

  clientStat.addError = function(name, errorStr) {
    var db = clientStat.getDB();
    if (angular.isDefined(db)) {
        return db.putMessage(clientStat.CLIENT_ERROR,
          clientStat.getStatsEvent(name, errorStr));
    }
  }

  return clientStat;
})
