define("stringUtil", [], function () {

    var capitalize = function (string) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        capitalize: capitalize
    }

});