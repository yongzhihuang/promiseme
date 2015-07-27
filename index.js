var Q = require('q');
var Promise = require('bluebird');
var GitHubApi = require('github');

var github = new GitHubApi({
	version: '3.0.0'
});

//===============Callback Hell===================
var getUserAvatarWithCallback = function(user, callback) {
	github.search.users({ q:user }, function(err, res) {
		if (err) {
			callback(err, null);
		}
		var avatarUrl = res.items[0].avatar_url;
		callback(null, avatarUrl);
	});
};

//invoke items
getUserAvatarWithCallback('yongzhihuang', function(err, avatar) {
	if (!err) {
		console.log('Got avatar back with good ol callback', avatar);
	}
});

//===============Bluebird===================
var getUserAvatarWithBluebird = function(user) {
	//Returns a promise method from bluebird
	return new Promise(function(resolve, reject) {
		github.search.users({ q: user}, function(err, res) {
			if (err) {
				reject(err);
			}
			var avatarUrl = res.items[0].avatar_url;
			resolve(avatarUrl);
		});
	});
};

getUserAvatarWithBluebird('yongzhihuang')
.then(function(avatarUrl) {
	console.log('Received avatar back with Bluebird', avatarUrl);
}).catch(function(error) {
	console.log('Error getting avatar with Bluebird', error);
});

//===============Q===================
var getUserAvatarWithQ = function(user) {
	var deferred = Q.defer();

	github.search.users({ a: user}, function(err, res) {
		if (err) {
			deferred.reject(err);
		}
		var avatarUrl = res.items[0].avatar_url;
		deferred.resolve(avatarUrl);
	});

	return deferred.promise;
};

getUserAvatarWithBluebird('yongzhihuang')
.then(function(avatarUrl) {
	console.log('Received avatar back with Q', avatarUrl);
	//Stuff returned here gets passed in as param to next .then()
	return avatarUrl + ' SOME JUNK APPEND TO IT';
}).then(function(appendedAvatar) {
	console.log('Check out the new appended avatar', appendedAvatar);
	//You can also return another promise
	var deferred = Q.defer();

	setTimeout(function() {
		deferred.resolve('im another async call after 1 sec');
	}, 1000);
	return deferred.promise;
}).then(function(anotherAsyncCall) {
	console.log('Im the result of another async call!');
}).catch(function(error) {
	console.log('Error getting avatar with Q', error);
}).finally(function() {
	console.log('I will get called whether theres error or not');
});
