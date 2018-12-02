angular.module('ado.announcements.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('./announcements.html','<div>\n  <button ladda="$ctrl.checking" type="button" class="btn btn-info" ng-click="$ctrl.reloadNews()">\n    <i class="glyphicon glyphicon-repeat"></i>\n    Check News\n  </button>\n  <hr>\n\n  <p ng-if="$ctrl.checking">\n  <i>\n    Loading news...\n  </i>\n  </p>\n\n  <div ng-repeat="a in $ctrl.announcements" ng-class="{\'text-danger\' : a.klass == \'alert\', \'text-info\': a.klass == \'info\', \'text-warning\': a.klass == \'warning\', \'text-success\': a.klass == \'success\'}">\n    <hr ng-if="$index > 0">\n    <p>\n      <small>\n      <i>\n      {{a.created_at | date:\'medium\'}}\n      </i>\n      </small>\n    </p>\n    <div btf-markdown="a.message"></div>\n  </div>\n</div>\n');}]);
(function () {
  'use strict';

  angular
    .module('ado.announcements', [
      'btford.markdown',
      'ado.announcements.tpls'
    ])
    .component('adoAnnouncements', {
      controller: 'AdoAnnouncementsCtrl',
      templateUrl: './announcements.html'
    })
    .provider("adoAnnouncementsConfig", function () {

      var provider = {};
      var globalConfig = {
        announcements_url: "/announcements"
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

