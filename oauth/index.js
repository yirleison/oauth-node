var app = angular.module('oauthApp', []);

app.controller('oauthCtrl', function($scope, $http) {
	$scope.enviardatos = function(){		
		var form = document.forms[0];
		var url_getaccesscode = 'https://api.us.apiconnect.ibmcloud.com/bancolombiabluemix-dev/'+form.catalog.value+'/hackathon/v1/security/oauth-otp/oauth2/authorize';
		
		var body = {
			client_id:form.client_id.value,
			client_secret:form.client_secret.value,
			catalog:form.catalog.value,
			redirect_uri:form.redirect_uri.value,
			scope:form.scope.value,
			response_type:'code'
		}
		
		$http({
			url: '/guardardatos', //Cambiar esta url por la del servidor
			method: "GET",
			params: body
		})
		.then(function(data) {
			form.action = url_getaccesscode;
			form.submit();
		},
		function(data) {
			console.log('error');
		});
	}
});