(function() {
  'use strict';

  angular.module('myApp')
    .component('pageTwo', {
      controller: controller,
      template: `

      <h1>Edit Post</h1>

      <form name="$ctrl.post" class="new-post-form" ng-submit="$ctrl.editPost()">
        <div>
          <label for="title">Title</label>
          <input type="text" name="title" id="title" class="form-control"  ng-model="$ctrl.post.title">
        </div>
        <div>
          <label for="body">Body</label>
          <textarea name="body" id="body" class="form-control"  ng-model="$ctrl.post.body"></textarea>
        </div>
        <div>
          <label for="author">Author</label>
          <input name="author" id="author" class="form-control" ng-model="$ctrl.post.author">
        </div>
        <div>
          <label for="image-url">Image URL</label>
          <input  name="imageUrl" id="image-url" class="form-control" ng-model="$ctrl.post.image_url">
        </div>
        </br>
        <div class="buttons">
          <button type="submit" class="btn btn-primary">
            Edit Post
          </button>
        </div>
      </form>

          `
    })

  controller.$inject = ['$http', '$scope', '$stateParams']

  function controller($http, $scope, $stateParams) {

    console.log('this is the controller for the page TWO component');
    console.log('stateParams = ' + JSON.stringify($stateParams) + ' scope = ' + $scope);

    let postId = JSON.stringify($stateParams.id);
    console.log(postId);

    const vm = this

    vm.$onInit = function() {
      $http.get(`/api/posts/${$stateParams.id}`)
        .then((result) => {
          vm.post = result.data;
          vm.post.showComments = true;
          console.log(vm.post);
        });
    }


    vm.editPost = function() {
      console.log('Sending update request to update ' + vm.post.id);

      $http.patch(`api/posts/${$stateParams.id}`, vm.post)
        .then((result) => {
          //console.log("Sent update request, result = " + JSON.stringify(result));
        })
    }
  } //end controller

}());
