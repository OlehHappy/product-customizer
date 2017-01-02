require(["productController", "viewModelController", "tutorialView" ,"tempView", "helpTextView", "pricingSummaryView", "urlUtil"], function (productController, viewModelController, tutorialView, tempView, helpTextView, pricingSummaryView, urlUtil) {
    $.ajaxSetup({ cache: false });

    function selectViewModelBasedOnUrlParams()
    {
        var viewModel = viewModelController.getViewModel();
        var cartID = urlUtil.getParameterByName('edit');
        var cartIndex = urlUtil.getParameterByName('index');
        var properties = urlUtil.getParameterByName('properties');
        var defaultProduct = window.ProductHandle || urlUtil.getParameterByName('product');
        var requiredParamsNotMet = defaultProduct == '' && cartID == '' && properties == '';
        if (requiredParamsNotMet) {
            window.exitReady = true;
            window.location = "/collections/custom-dog-products";
        }
        else {
            if (cartID != '' && cartIndex != '') {
                //Load properties from the cart
                $.getJSON('/cart.js', function (response) {
                    var cartItem = response.items[cartIndex];
                    viewModel.editIndex = +cartIndex;
                    viewModel.defaultSelections = cartItem.properties;
                    viewModel.userState.selectedProduct(cartItem.properties.productName);
                });
            }
            if (properties != '') {
                //console.log(properties);
                viewModel.defaultSelections = JSON.parse(properties);
                viewModel.userState.selectedProduct(defaultProduct);
            }
            else
                viewModel.userState.selectedProduct(defaultProduct);
        }
    }
    function loadProduct(productName) {
        var dataPath = productName + ".json";
        productController.loadProduct(dataPath, function () {
            viewModelController.initialize(productController.getProductModel());
            pricingSummaryView.initialize();
            //catalogView.hideCatalog();
        });
    }
    
    viewModelController.getViewModel().userState.selectedProduct.subscribe(function (val) {
        //Anytime we change products load the data and intialize the model
        loadProduct(val);
    });
    tempView.initialize();
    selectViewModelBasedOnUrlParams();
    //ko.applyBindings(viewModelController.getViewModel(), document.getElementById("app-container"));
    $('#customizer-container').removeClass('hide');
});