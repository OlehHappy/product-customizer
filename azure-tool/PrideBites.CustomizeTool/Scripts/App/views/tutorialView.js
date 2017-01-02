define("tutorialView", ['jquery', 'tutorialController', 'responsiveUtil'], function ($, tutorialController, responsiveUtil) {

    function render(product) {
        var watchVid = tutorialController.showVideo();
        var environment = responsiveUtil.findBootstrapEnvironment();
        var isDesktopOrTablet = environment == "lg" || environment == "md" || environment == "sm";
        if (watchVid != 'seenRecently' && isDesktopOrTablet) {
            imgLocation = window.LightboxRoot + product.name + '-welcome.jpg'
            $('#imageModalContent').attr("src", imgLocation);
            $('#imageModal').modal('show');
        }
    }

    return {
        render: render
    };
});