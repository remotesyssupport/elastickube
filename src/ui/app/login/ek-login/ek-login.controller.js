/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

class LoginController {
    constructor($log, $scope, initialization, instancesNavigationActionCreator, loginNavigationActionCreator, principalActionCreator, routerHelper, sessionStorage) {
        'ngInject';

        this._$log = $log.getInstance(this.constructor.name);
        this._$scope = $scope;
        this._initialization = initialization;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._loginNavigationActionCreator = loginNavigationActionCreator;
        this._principalActionCreator = principalActionCreator;
        this._routerHelper = routerHelper;
    }

    submit() {
        return this._principalActionCreator.login(this.user)
            .then(() => this._initialization.initializeLoggedInUser())
            .then(() => {
                if (sessionStorage.hasOwnProperty("toState")) {
                    var _toState = JSON.parse(sessionStorage.getItem("toState"));
                    var _toParams = JSON.parse(sessionStorage.getItem("toParams"));
                    sessionStorage.removeItem("toState");
                    sessionStorage.removeItem("toParams");
                    this._routerHelper.changeToState(_toState.name, _toParams);
                } else {
                    this._instancesNavigationActionCreator.instances();
                }
            })
            .catch((error) => this._$log.warn(error.body));
    }

    resetPassword() {
        this._loginNavigationActionCreator.resetPassword();
    }
}

export default LoginController;
