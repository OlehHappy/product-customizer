define("pricingSummaryView", ['jquery', 'productController', 'viewModelController'], function ($, productController, viewModelController) {

    function initialize() {
        viewModelController.getViewModel().combinedSelection.subscribe(function () {
            render(productController, viewModelController);
        });
        render(productController, viewModelController);
    }

    function render(productController, viewModelController)
    {
        var options = viewModelController.getSelectedOptions();
        //var displayHtml = '';
        var originalPrice = viewModelController.getViewModel().product().basePrice;
        var total = originalPrice;
        $.each(options, function (index, obj) {
            var price = obj.price || 0;
            if (price != 0) {
                total += price;
                //displayHtml += "+  $" + price.toFixed(2) + "("+ obj.value +")" + "<br/>";
            }
        });
        $('.product-price').empty().html("$" + total.toFixed(2) );
        //if (originalPrice != total) {
        //    displayHtml += "<hr/>";
        //    displayHtml += "<div class='total'>$" + total.toFixed(2) + "</div>";
        //}
        //$('.product-price-additions').empty().html(displayHtml);

    }

    return {
        initialize:initialize,
        render: render
    };
});