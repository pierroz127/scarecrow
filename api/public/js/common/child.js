angular.module('scarecrow.common.services')
  .factory('Child', [
    function() {
      var dateIsValid = function(dateObj) {
        var dt = new Date();
        if (dateObj.year > dt.getFullYear()) return false;
        if (dateObj.month < 1 || dateObj.month > 12) return false;
        if (dateObj.day < 1) return false;
        switch (dateObj.month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            return dateObj.day <= 31;
          case 2:
            return dateObj.day <= 29;
          case 4:
          case 6:
          case 9:
          case 11:
            return dateObj.day <= 30;
          default:
            return false;
        }
      }

      var childService = function() {
        this.firstname = "";
        this.lastname = "";
        this.birthdate = {};
        this.socialSecurityNbr = "";
        this.allergys = "";
        this.heading = "Enfant";
      };

      childService.prototype.updateHeading = function() {
        if (this.firstname != "" && this.lastname != "") {
          this.heading = this.firstname + " " + this.lastname;
        } 
      };

      childService.prototype.isValid = function() {
        return this.firstname != "" && 
          this.lastname != "" && 
          this.socialSecurityNbr != "" &&
          dateIsValid(this.birthdate);
      }
      return childService;
    }
]);