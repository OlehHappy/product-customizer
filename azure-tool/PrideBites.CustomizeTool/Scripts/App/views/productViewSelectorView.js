define("productViewSelectorView", ['jquery', 'productController'], function ($, productController) {
    function showOnlyValidViews(validViews, viewModel)
    {
        var htmlViews = $('.viewSelection');
        if (typeof validViews != "undefined") {
            $.each(htmlViews, function (index, obj) {
                var elem = $(obj);
                var currentView = elem.attr('data-viewid');
                var isValid = _.contains(validViews, currentView);
                if (!isValid) {
                    //elem.hide();
                    if (viewModel.userState.selectedView() == currentView)
                        viewModel.userState.selectedView(validViews[0]);
                }
                //else
                //    elem.show();
            });
        }
        else
            htmlViews.show();
        
    }

    var render = function (product, viewModel) {
        $(document).on('click', '.viewSelection', function () {
            viewModel.userState.selectedView($(this).data("viewid"));
        });
        viewModel.userState.selectedProduct.subscribe(function (val) {
            //Anytime we change products load the data and intialize the model
            viewModel.userState.selectedView('default');
        });
        viewModel.userState.selectedStep.subscribe(function (stepId) {
            var step = productController.findStepById(stepId);
            showOnlyValidViews(step.views, viewModel);
        });
        viewModel.userState.selectedView.subscribe(function (selectedView) {
            //console.log(selectedView);
            $('.viewSelection').removeClass('active');
            $('.viewSelection[data-viewId='+ selectedView+']').addClass('active');
        });

        var viewTemplate = $('#viewTemplate').html();
        $('#view-container').empty().append(_.template(viewTemplate, { "product": product, "views": product.views }));
        $('.viewSelection').first().addClass('active');
    }
    return {
        render: render
    };
});