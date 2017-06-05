(function() {
  'use strict';

  angular.module('myApp')
    .component('pageOne', {
      controller: controller,
      template: `

      <h1>Create/View Posts</h1>





      <div class=filterVotes>
      <p>
        <input type="text" name="" value="" placeholder='filter' class="form-control">

        <!--input type="submit" value="New Post" class="btn btn-primary" /-->

        <div class="form-inline">
          <label for="sort">  Sort by  {{sortName}} </label>
          <select class="form-control" id="sort">
              <option value="upVotes"  ng-click="sort='-vote_count'; sortName='Votes';">Votes</option>
              <option value="title"  ng-click="sort='created_at'; sortName='Date';">Title</option>
              <option value="lastUpdated"  ng-click="sort='title'; sortName='Title'">Date</option>
            </select>
        </div>
      </p>
      </div>


      <form name="postForm" class="new-post-form" id="postForm">
        <div>
          <label for="title">Title</label>
          <input type="text" name="title" id="title" class="form-control" ng-model="$ctrl.post.title">
        </div>
        <div>
          <label for="body">Body</label>
          <textarea name="body" id="body" class="form-control" ng-model="$ctrl.post.body"></textarea>
        </div>
        <div>
          <label for="author">Author</label>
          <input name="author" id="author" class="form-control" ng-model="$ctrl.post.author">
        </div>
        <div>
          <label for="image-url">Image URL</label>
          <input name="imageUrl" id="image-url" class="form-control" ng-model="$ctrl.post.image_url">
        </div>
        </br>
        <div class="buttons">
          <button type="submit" class="btn btn-primary" ng-click="$ctrl.createPost($ctrl.post)">
              Create Post
            </button>
        </div>
      </form>



      </br>
      <ul ng-repeat="post in $ctrl.posts | orderBy:sort">
        <div class="row">
          <div class="col-md-12">
            <div class="well">
              <div class="media-left">
                <img class="media-object">
                <img src="{{post.image_url}}" width="200" height="200" />
              </div>

              <div class="media-body">
                <h4 class="media-heading">
                    {{post.title}}
                    |
                    <a><i class="glyphicon glyphicon-arrow-up" ng-click="$ctrl.upVote(post)"></i></a>
                    <a><i class="glyphicon glyphicon-arrow-down" ng-click="$ctrl.downVote(post)"></i></a>
                    {{post.vote_count}}
                  </h4>
                <div class="text-right">
                  {{post.author}}
                </div>
                <p>
                  {{post.body}}
                </p>
                <div am-time-ago="post.created_at">
                  {{post.created_at}} |
                </div>
                <div class="buttons">


                  <a ui-sref="edit-posts({ id: post.id })" class="btn btn-primary">
                      Edit Post
                    </a>




                  <div ng-click=$ctrl.toggleComments()>
                    <i class="glyphicon glyphicon-comment"></i>
                    <a ng-if="post.comments.length == 1">
                        {{post.comments.length}} comment
                      </a>
                    <a ng-if="post.comments.length != 1">
                        {{post.comments.length}} comments
                      </a>



                  </div>
                  <div ng-show=$ctrl.showComments ng-repeat="comment in post.comments">
                    {{comment.content}}
                  </div>
                  <div class="row">
                    <div class="col-md-offset-1">
                      <hr>
                      <p>
                        Comment text
                      </p>
                      <form class="form-inline">
                        <div class="form-group">
                          <input type="text" name="newComments" id="newComment" class="form-control" ng-model="post.comments.newComment.content">
                          <input type="submit" class="btn btn-primary" ng-click="$ctrl.insertComment(post)">
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <!--End media-body div-->
            </div>
          </div>
      </ul>
      </div>
  `
    })



  controller.$inject = ['$http']

  function controller($http) {

    console.log('this is the controller for the page ONE component');

    const vm = this

    vm.$onInit = function() {
      //Get all the posts
      $http.get('/api/posts/').then(function(response) {
        vm.posts = response.data;
        vm.showComments = false;
        console.log(vm.posts);
      })
    }

    vm.createPost = function(post) {
      //console.log("creating post");
      post.vote_count = 0;
      post.created_at = new Date;

      //console.log(post);

      $http.post('/api/posts/', post).then(function(response) {
        //console.log(response);
        vm.refreshPosts();
      });
    }

    vm.refreshPosts = function() {
      $http.get('/api/posts/').then(function(response) {
        vm.posts = response.data;
        vm.showComments = false;
        console.log(vm.posts);
      })
    }

    vm.insertComment = function(post) {
      console.log('post = ' + JSON.stringify(post));

      let postIndex = vm.posts.indexOf(post);
      vm.posts[postIndex].comments.push(post.comments.newComment);

      $http.post(`/api/posts/${post.id}/comments`, post.comments.newComment)
        .then((result) => {
          console.log("Sent new comments, result = " + JSON.stringify(result));
        })

      post.comments.newComment = null;
    }



    vm.toggleComments = function() {
      if (vm.showComments) {
        vm.showComments = false;
      } else {
        vm.showComments = true;
      }
    }


    vm.upVote = function(post) {
      console.log(post);
      post.vote_count += 1;
    }

    vm.downVote = function(post) {
      if (post.vote_count > 0) {
        post.vote_count -= 1;
      }

    }

  } //end controller

}());
