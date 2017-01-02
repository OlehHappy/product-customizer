//define("catalogController", ['jquery', 'viewModelController', 'productController', 'catalogView', 'urlUtil', "pricingSummaryView"], function ($, viewModelController, productController, catalogView, urlUtil, pricingSummaryView) {
//    var catalogModel = {};
//    var url = window.ContentRoot + "/AppContent/ProductData/_catalog.json";
//    var viewModel = viewModelController.getViewModel();

    

//    //$(document).on('click', '#step-product', function () {
//    //    $('#modalConfirmBackCatalog').modal('show');
//    //});
//    //$(document).on('click', '#btnConfirmBack', function () {
//    //    viewModel.userState.selectedProduct('');
//    //    catalogView.showCatalog();


//    //});
//    //Confiure Show/hide event handlers
//    viewModel.userState.selectedProduct.subscribe(function (val) {
//        //Anytime we change products load the data and intialize the model
//        loadProduct(val);
//    });
//    viewModel.userState.selectedCategory.subscribe(function (val) {
//        catalogView.showCategory(val);
//    });

//    function initialize(callback) {
//        $.getJSON(url, function (data) {
//            catalogModel = data;

//            //Load the default product if specified by query string otherwise show catalog
            
            
//            //Load catalog UI template
//            catalogView.initialize(catalogModel, showCatalog);

//            if(typeof callback != "undefined")
//                callback();
//        });
//    }

//    return {
//        initialize: initialize
//    }

//});