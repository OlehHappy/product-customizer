define("modalView", ['jquery'], function ($) {
    
    // Change this function to fill a data attribute rather than an id. 
    // When the button is clicked the data will pass to a function to load
    // in the correct image to our modal.
    function initializeLightboxTriggerButtons(product) {
        $('.btnExample').data('product', product.name.toLowerCase());
        $('.btnMoreInfo').data('product', product.name.toLowerCase());
        $('#size-chart').data('product', product.name.toLowerCase());
    }

    // Generic function to load the conttent into the modal. 
    // Get the product name, the button pressed, and load the image into the modal. 
    function loadCustomLightbox(product, button) {
        var imgLocation;
        if (button === "example") {
            imgLocation = window.LightboxRoot + product + '-examples.jpg'
        } else if (button === "moreInfo") {
            imgLocation = window.LightboxRoot + product + '-box.jpg'
        } else if( button === "sizing"){
            if (product === 'hoodie' || product === 'coat') {
                imgLocation = window.LightboxRoot + 'generic-size-chart.jpg'
            } else {
                imgLocation = window.LightboxRoot + product + '-size-chart.jpg'
            }
        }
        $('#imageModalContent').attr("src", imgLocation);
        $('#imageModal').modal('show');
    }

    var render = function (product, viewModel) {

        initializeLightboxTriggerButtons(product);

        // On button clicks fire the function for the lightbox replacement.
        $('.btnExample').click(function () {
            loadCustomLightbox($(this).data('product'), 'example');
        });

        $('.btnMoreInfo').click(function () {
            loadCustomLightbox($(this).data('product'), 'moreInfo');
        });

        $('#size-chart').click(function () {
            loadCustomLightbox($(this).data('product'), 'sizing');
        });
    }
    return {
        render: render
    };
});