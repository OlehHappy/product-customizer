//Stuff that still needs to be organized/designed

define("tempView", ['jquery', 'viewModelController', 'productController', 'designCanvasView', 'controlPanelView', 'favoritesView', 'urlUtil'], function ($, viewModelController, productController, designCanvasView, controlPanelView, favoritesView, urlUtil) {
    var initialize = function () {
        
        
        function validate()
        {
            //Validate 0 or 2+ uploads selected
            var uploadCount = 0;
            for (var x = 1; x <= 3; x++) {
                var uploadField = viewModelController.getViewModel().userSelection['image' + x];
                //console.log(uploadField);
                if (uploadField && uploadField())
                    uploadCount++;
            }
            if (uploadCount == 1) {
                alert("Please add a second photo.  Having multiple pictures of your pet allows our artists to capture a better likeness of your pet.")
                return false;
            }
            else
                return true;
        }

        //Following probably belongs in a different module
        $(document).on("click", '#btnSave', function () {
            

            var isValid = validate();
            if (isValid === true) {
                var viewModel = viewModelController.getViewModel();
                if (viewModel.editIndex != null) {
                    //Remove Item from cart so that when we save we don't have duplicates
                    $.ajax({
                        'url': '/cart/change.js',
                        'type': 'POST',
                        'async': false,
                        'data': { line: viewModel.editIndex + 1, quantity: 0 }
                    });
                }


                var shopifyID = viewModelController.getExternalID();
                var userSelections = ko.toJS(viewModel.userSelection);

                var data = {};
                data.quantity = 1;
                data.id = shopifyID;
                var request = $.param(data);
                $.each(userSelections, function (k, v) {
                    request += "&properties%5B" + k + "%5D=" + v;
                });
                //console.log('shopify key:'); console.log(shopifyID);
                var basePrice = viewModelController.getViewModel().product().basePrice;
                TMJS.init({ mid: '140819', domain: 'na' });
                TMJS.recordEvent({ event_id: '4', product_id: shopifyID, customer_id: window.CustomerID, price: basePrice });

                Shopify.addItemFromData(request, function (r) {
                    window.exitReady = true;
                    window.location = '/cart';
                });
            }
        });

        //$(document).on('change', '.imageUpload', function (e) {
        //    var url = "/FileUpload/SaveFile/";
        //    $.ajax({
        //        url: url,
        //        type: "POST",
        //        enctype: 'multipart/form-data',
        //        cache: false,
        //        contentType: false,
        //        processData: false,
        //        data: {
        //            file: $(this).val()
        //        },
        //    });

        //});

        $(document).on('click', '.nextAttribute', function () {
            var selectedAttribute = $(this).closest('.attribute-content').attr('data-attribute');
            var nextAttribute = "";
            var steps = productController.getProductModel().steps;
            $.each(steps, function (i, step) {
                $.each(step.attributes, function (j, attribute) {
                    if (attribute.name == selectedAttribute) {
                        if (j + 1 == step.attributes.length) {
                            // go to next step
                            var nextStep = steps[i + 1].id;
                            var nextAttribute = steps[i + 1].attributes[0].name;
                            
                            // pre-select first attribute
                            viewModelController.getViewModel().userState.selectedStep(nextStep);
                            viewModelController.getViewModel().userState.selectedAttribute('attribute-' + nextAttribute);
                            //Open next accordion.  //TODO: This assumes UI which is not ideal
                            var nextStepID = '#step-' + nextStep;
                            var nextAccordionId = nextStepID + ' > .panel-heading';
                            $(nextAccordionId).trigger('click');
                           
                        } else {
                            // go to next attribute
                            var nextTabId = '#tab-' + step.attributes[j + 1].name;
                            viewModelController.getViewModel().userState.selectedAttribute('attribute-' + step.attributes[j + 1].name);

                            //Scroll to top
                            $(nextTabId).closest('.panel-body').animate({
                                scrollTop: 0
                            }, "slow");
                        }
                    }
                });
            });
        });

        $('#stepAccordion').on('show.bs.collapse', function () {
            $('#stepAccordion .in').collapse('hide');
        });

        // no need for this wrapper, runTestMode, and settimeout once feature is live.  Will still need to register events.
        $(function () {
            setTimeout(function () {
                favoritesView.runTestMode();
                favoritesView.registerEvents();
            }, 2000)
            
        });
        

    }

    return {
        initialize: initialize
    };
});

