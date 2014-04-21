angular.module('scarecrow.common.services')
  .factory('session', [
    function() {
      var session = {
        user : {
          id : 0,
          email: "",
          pseudo: ""
        },

        reset: function() {
          this.user = {
            id: 0,
            email: "",
            pseudo: ""
          }
        },

        set: function(email, pseudo) {
          this.user.email = email;
          this.user.pseudo = pseudo;
        },

        getUserEmail: function() {
          return this.user.email;
        }
      }

      return function() {
        return session;
      }
    }
  ]);