define("helpTextView", ['jquery', 'viewModelController', 'productController'], function ($, viewModelController, productController) {
    var viewModel = viewModelController.getViewModel();
    var helpMessages = {};
    var randomSelectionIndex = 0;
    var delay = 0;

    viewModel.userState.selectedStep.subscribe(function (stepId) {
        render(stepId);
    });
    viewModel.userState.selectedAttribute.subscribe(function (attribute) {
        render(attribute);
    });
    $(document).on("product.loadComplete", function (e) {
        helpMessages = productController.getHelpMessages();
        render(e.product);

        setTimeout(function () {
            $('.helperContent').slideDown();
        }, 3000);
        
    });

    $('body').on('click', '.btnRandom', function (e) {
        //var PB = $.cookie("PB.RNDM");
        //console.log(PB);
        //$.cookie("PB.RNDM", "{'test':'value'}", { path: '/', expires: 30 });
        delay = 0;
        $('.btnRandom span').text('...');
        (randomSelectionIndex === viewModel.product().predefinedSelections.length - 1) ? randomSelectionIndex = 0 : randomSelectionIndex++;
        var randomSelections = viewModel.product().predefinedSelections[randomSelectionIndex];

        $.each(randomSelections, function (key, value) {
            setTimeout(function () {
                viewModel.userSelection[key]('Red');
            }, delay);
            delay += 200;
            setTimeout(function () {
                viewModel.userSelection[key]('Yellow');
            }, delay);
            delay += 200;

            setTimeout(function () {
                viewModel.userSelection[key](randomSelections[key]);
                $('.btnRandom span').text('TOP SELLERS');
            }, delay);
            delay += 300;
        });

        $('.btnExample').focus();
    });

    function render(userState)
    {
        var message = helpMessages[userState];
        if (typeof (message) != 'undefined') {
            $('.productHelpText').html('...');
            setTimeout(function () {
                $('.productHelpText').html(message);
            }, 1000);
            
        }
    }

});