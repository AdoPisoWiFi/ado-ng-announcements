(function () {
  'use strict';

  angular
    .module('ado.announcements', [
      'btford.markdown',
      'ado.announcements.tpls'
    ])
    .component('announcements', {
      controller: 'AdoAnnouncementsCtrl',
      templateUrl: './announcements.html'
    })
    .provider("adoAnnouncementsConfig", function () {

      var provider = {};
      var globalConfig = {
        announcements_url = "/announcements";
      };

      provider.config = function (config) {
        angular.extend(globalConfig, config);
      };

      provider.$get = [
        function() {
          return globalConfig;
        }
      ];

      return provider;

    })
    .controller('AdoAnnouncementsCtrl', [
      'adoAnnouncementsConfig',
      '$http',
      function AdoAnnouncementsCtrl(adoAnnouncementsConfig, $http) {

        $ctrl = this;

        $ctrl.$onInit = function () {

          $ctrl.announcements = [];

          $ctrl.reloadNews = function () {
            $ctrl.checking = true;
            $http.get(adoAnnouncementsConfig.announcements_url)
              .then(function(res) {
                $ctrl.announcements = res.data;
              })
              .catch(function () {
                $ctrl.announcements.unshift({
                  klass: 'alert',
                  message: 'Unable to check for news!',
                  created_at: new Date()
                });
              })
              .finally(function () {
                $ctrl.checking = false;
              });
          };

          $ctrl.reloadNews();

        };

      }
    ]);

})();

