//define("catalogView", ['jquery'], function ($) {

//    function initialize(catalogModel, showCatalog) {
//        var template = $('#catalogTemplate').html();
//        var catalogContent = _.template(template, catalogModel);
//        if (showCatalog == false)
//            $("#catalog-placeholder").hide(); //Placeholder is hidden by default if we are loading a product from query string

//        $("#catalog-placeholder").empty().append(catalogContent);
//        showCategory('default');
//    }
//    function hideCatalog() {
//        $('#catalog-container').slideUp();
//        $('#customizer-container').fadeIn().removeClass('hide');
//    }
//    function showCatalog() {
//        $("#catalog-placeholder").show(); //Placeholder is hidden by default if we are loading a product from query string
//        $('#catalog-container').slideDown();
//        $('#customizer-container').addClass('hide');
//    }
//    function showCategory(name) {
//        $('.category').hide();
//        $('#category-' + name).slideDown();
//    }

//    return {
//        hideCatalog: hideCatalog,
//        showCatalog: showCatalog,
//        showCategory: showCategory,
//        initialize: initialize
//    };
//});