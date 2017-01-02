define("favoritesListController", ['jquery', 'urlUtil'], function ($, urlUtil) {
  
    var favorites = $.cookie('favorites'),
        favoritesArray = favorites ? $.parseJSON(favorites) : [];

    var getFavorites = function () {
        return favoritesArray;
    }

    return {
        getFavorites: getFavorites
    };
});