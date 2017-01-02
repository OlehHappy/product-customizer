define("favoritesView", ['jquery', 'urlUtil', 'viewModelController', 'stringUtil'], function ($, urlUtil, viewModelController, stringUtil) {

    var runTestMode = function () {

        if (urlUtil.getParameterByName('test') === 'true') {
            console.log('debug');
            $('.save-fav, .my-designs').removeClass('hidden');
            //$('.save-fav, #saveOrder').removeClass('hidden');
        }
    }

    var registerEvents = function () {
        $('.continue-editing').on('click', function (e) {
            e.preventDefault();
            $('.modal-design-saved').modal('hide');
        });

        $(document).on('click', '.save-fav', function () {
            $('.save-design-modal').modal('show');
        });

        $('#manualValidator').hide();
        $('.sav-fav-submit').on('click', function (e) {
            e.preventDefault();
            if ($('#Field4').val() == '' || $('#Field2').val() == '') {
                $('#manualValidator').fadeIn('fast');
            } else {
                e.stopPropagation();
                window.exitReady = true;

                var viewModel = viewModelController.getViewModel(),
                    userSelections = ko.toJS(viewModel.userSelection),
                    favorites = $.cookie('favorites'),
                    favoritesArray = typeof favorites != 'undefined' && favorites !== 'null' ? $.parseJSON(favorites) : [],
                    favoritesObj = {},
                    designName = $('#Field4').val(); // user input from design name field


                favoritesObj.selections = userSelections;

                //Pass link to unique design to hidden field
                var customLink = favoritesObj.selections.productName + '&properties=' + JSON.stringify(favoritesObj.selections);
                var customImageLink;
                $('#Field6').val(customLink);

                favoritesObj.designName = designName;
                favoritesArray.push(favoritesObj);

                // linkParameters used to generate image thumbnail
                $.each(favoritesArray, function (index, favObj) {
                    linkParameters = [];
                    favObj.index = index;
                    $.each(favObj.selections, function (favsIndex, favsVal) {
                        attributeArray = [favsIndex, favsVal];
                        linkParameters.push(attributeArray);
                    });

                    favObj.linkParametersStr = JSON.stringify(linkParameters);
                    customImageLink = favObj.linkParametersStr;
                    template = $('#favorites-item-template').html();
                    compiledTemplate = _.template(template, { favObj: favObj });
                    $('#app-container').append(compiledTemplate);

                    //reset
                    linkParameters = [];
    
                });

                // remove cookie and start fresh
                $.removeCookie('favorites', { path: '/' });

                $.cookie('favorites', JSON.stringify(favoritesArray), { expires: 365, path: '/' });
                data = {
                    toEmail: $('#Field2').val(),
                    designName: $('#Field4').val(),
                    designImg: 'http://pridebites.com/apps/custom-pridebites/dynamicimage/thumbnail?size=medium&d=' + customImageLink,
                    designLink: 'http://pridebites.com/apps/custom-pridebites?product=' + customLink,
                    designProperties: JSON.stringify(favoritesObj.selections)
                }
                $('.modal').modal('hide');
                $.get(window.ContentRoot +'/api/savedesign', data)
                    .done(function (response) {
                        console.log('data posted'); console.log(response);
                        //$('.modal-design-saved').modal('show');
                        $('#form1').submit();
                    })
               }
        });
    }

    return {
        registerEvents: registerEvents,
        runTestMode: runTestMode
    }   

});

