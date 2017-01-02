define("designCanvasView", ['jquery'], function ($) {
    var canvasId = "#design-canvas";

    ///ViewModel - Holds userState and userSelections which hold corresponding KO observables
    //selectedView - A subsection of the productModel that corresponds to which view is currently selected.
    function initialize(viewModel, productController, viewModelController) {
        //TODO: remove selectedView
        var domContent = "";
        var currentViewId = viewModel.userState.selectedView();
        var currentView = productController.findViewById(currentViewId);

        $.each(currentView.layers, function (index, obj) {
            var type = index == 0 ? 'base' : 'layer';
            domContent += '<img class="'+ type +'" id="' + obj.attributeName + '"/>';
        });
        $(canvasId).empty().append(domContent);

        viewModel.combinedSelection.subscribe(function () {
            //console.log("Something Changed");
            render(viewModel, productController, viewModelController);
        });
        viewModel.userState.selectedView.subscribe(function () {
            render(viewModel, productController, viewModelController);
        });
    }
    function render(viewModel, productController, viewModelController) {
        var tempCanvas = $(canvasId).clone();
        var viewImages = tempCanvas.children('img');

        var currentViewId = viewModel.userState.selectedView();
        var currentView = productController.findViewById(currentViewId);
        $.each(viewImages, function (index, obj) {
            obj = $(obj);
            var attributeName = obj.attr('id');
            var attributeSelections = viewModelController.getSelections(attributeName);
            var layer = _.findWhere(currentView.layers, { "attributeName": attributeName });
            if (typeof (layer) != "undefined") {
                var type = layer.displayType;

                var src = window.ProductImageRoot
                            + viewModel.userState.selectedProduct() + "/"
                            + currentViewId + "/";

                if (type == 'static') {
                    src += attributeName + '.png?v=' + window.ContentVersion;
                }
                else if (type == 'image' && typeof attributeSelections != "undefined") {
                    if (attributeSelections[attributeName] == 'none') //Allow fields to specify none as a value to hide the layer.
                        src = window.ContentRoot + '/AppContent/blank.png'
                    else
                        src += attributeName + "-" + attributeSelections[attributeName] + ".png?v=" + window.ContentVersion;
                }
                else if (type == 'text' && typeof attributeSelections != "undefined") {
                    //Set proper region
                    var regionID = attributeSelections.textPlacement;
                    //console.log('region');
                    //console.log(regionID);
                    if (typeof (regionID) != "undefined") {
                        delete attributeSelections["textPlacement"];
                        var region = productController.findRegionById(currentView, regionID);
                        attributeSelections = $.extend({}, attributeSelections, region.position);
                    }
                    //Merge Selections and defaults
                    var mergedCustomizations = $.extend({}, layer.defaults, attributeSelections);
                    var photoSelections = viewModelController.getSelections('Photo');
                    if (!photoSelections.image1)//Only show the default image if user has done an upload.
                        delete mergedCustomizations.imgSrc;
                    if (mergedCustomizations.text != '' || typeof mergedCustomizations.imgSrc != "undefined")
                        src = window.ContentRoot + '/DynamicImage?' + $.param(mergedCustomizations);
                    else
                        src = window.ContentRoot + '/AppContent/blank.png';
                }
                else if (type == 'upload' && typeof attributeSelections != "undefined") {
                    var mergedCustomizations = $.extend({}, layer.defaults, attributeSelections);
                    if (mergedCustomizations.image1)
                        src = window.ContentRoot + '/DynamicImage/Upload?' + $.param(mergedCustomizations);
                    else
                        src = window.ContentRoot + '/AppContent/blank.png';
                }
                else if (type == 'none') {
                    src = window.ContentRoot + '/AppContent/blank.png';
                    obj.attr('src', src);//Clear the layer if the value is none
                }
                if (src != '')
                    obj.attr('src', src);
            }
            else
                obj.attr('src', window.ContentRoot + 'AppContent/blank.png'); //Clear the layer if it is not valid for this view
        });

        if (detectIE() == false) {
            //imagesLoaded seems flakey in IE
            $(tempCanvas).imagesLoaded(function () {
                $(canvasId).replaceWith(tempCanvas);
            });
        }else
            $(canvasId).replaceWith(tempCanvas);
    }

    return {
        initialize: initialize,
        render: render
    };
});