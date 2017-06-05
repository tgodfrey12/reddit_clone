(function() {
  angular.module('myApp', ['ui.router', 'angularMoment'])
    .config(config)

  config.$inject = ["$stateProvider", "$urlServiceProvider"]

  function config($stateProvider, $urlServiceProvider) {
    // make your app start at state 'page-one'
    $urlServiceProvider.rules.otherwise({
      state: 'page-one'
    });
    $stateProvider
      .state('page-one', {
        url: '/',
        component: 'pageOne'
      })
      .state('edit-posts', {
        url: '/page-two/:id',
        component: 'pageTwo',
      })
  }

})()
