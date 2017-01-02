define("favoritesListView", ['jquery', 'urlUtil', 'favoritesListController', 'viewModelController', 'productController'], function ($, urlUtil, favoritesListController, viewModelController, productController) {

    var favoritesArray = favoritesListController.getFavorites();

    var noDesignsMessage = function () {
        $('#app-container').append('<h3 class="text-center" style="color: green;">You do not have any saved designs</h3>');
    }

    var removeFavorite = function (index) {
        var deleteDesign = confirm('Are you sure you want to delete this design?');
        if (deleteDesign) {
            /* filter out favorite with index property that matches the index in the DOM */
            favoritesArray = _.filter(favoritesArray, function (fav) { return fav.index != index; });
            $.cookie('favorites', JSON.stringify(favoritesArray), { expires: 365, path: '/' });
            $('[data-index=' + index + ']').closest('.fav-designs-container').parent().fadeOut(function () {
                if (favoritesArray < 1) {
                    noDesignsMessage();
                }
            });

        } else { return; }
    }

    var addItemFromData = function (data, callback) {
        var quantity = quantity || 1;
        var params = {
            type: 'POST',
            url: '/cart/add.js',
            data: data,
            dataType: 'json',
            success: function (line_item) {
                if ((typeof callback) === 'function') {
                    callback(line_item);
                }
                else {
                    Shopify.onItemAdded(line_item);
                }
            },
            error: function (XMLHttpRequest, textStatus) {
                Shopify.onError(XMLHttpRequest, textStatus);
            }
        };
        jQuery.ajax(params);
    };

    var registerEvents = function () {

        function shortenURL(link) {
            var shortUrl;
            $.ajax({
                url:"https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCNDbAl1mngEIvQkiVz2ImfPlq6nemSJAw",
                type: "POST",
                async: false,
                data: '{ longUrl : ' + JSON.stringify(link) + ' }',
                contentType: "application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    shortUrl = data.id;
                },
            }).fail(function (xhr, textStatus, errorThrown) {
                    console(xhr.responseText);
            });
            return shortUrl;
        }

        function buildSocialSharing(index) {
            var rawLink = $('.fav-edit[data-index="' + index + '"]').attr('href');
            var link = encodeURIComponent(shortenURL(rawLink));
            var image = $('.fav-designs-wrapper[data-index="' + index + '"]').find('img').attr('src');
            var text = "How awesome is this? Customized @pridebites.com #pridebites #mypetmychoice";

            $('#fb-meta-og-url').attr('content', link);
            $('.meta-image').attr('content', image);
            $('#facebook-share-' + index).attr('href', "http://wwww.facebook.com/sharer/sharer.php?u=" + link);
            $('#twitter-share-' + index).attr('href', "https://www.twitter.com/share?text=" + encodeURIComponent(text) + "&url=" + link);
            $('#pinterest-share-' + index).attr('href', "http://www.pinterest.com/pin/create/button/?url=" + encodeURIComponent(rawLink) + "&media=" + encodeURIComponent(image));
        }

        $('.fav-remove').on('click', function (e) {
            e.preventDefault();
            removeFavorite($(this).attr('data-index'));
        });

        $('.fav-share').on('click', function (e) {
            console.log('sharing');
            e.preventDefault();
            var index = $(this).data('index');
            buildSocialSharing(index);
            $('#share-modal-' + index).modal('show');
        });

        $('.emailShare').click(function (e) {
            e.preventDefault();
            var index = $(this).data('index');
            $('.modal').modal('hide');
            $('#email-modal-' + index).modal('show');
        });

        $('#manualValidator').hide();
        // string toEmail, string fromEmail, string designImg, string designLink
        $('.submit-share-design').on('click', function (e) {
            e.preventDefault();
            if ($('#toEmail').val() == '' || $('#fromEmail').val() == '') {
                $('#manualValidator').fadeIn('fast');
            } else {
                dataIndex = $(this).closest('.fav-designs-wrapper').attr('data-index');
                data = {
                    toEmail: $('.fav-designs-wrapper[data-index="' + dataIndex + '"]').find('#toEmail').val(),
                    fromEmail: $('.fav-designs-wrapper[data-index="' + dataIndex + '"]').find('#fromEmail').val(),
                    designImg: encodeURI($('.fav-designs-wrapper[data-index="' + dataIndex + '"]').find('img').attr('src')),
                    designLink: $('.fav-edit[data-index="' + dataIndex + '"]').attr('href'),
                    designProperties: $('.fav-edit[data-index="' + dataIndex + '"]').attr('data-properties')
                }
                $('.modal').modal('hide');
                console.log(data);
                $.get(window.ContentRoot + '/api/sharedesign', data)
                    .done(function (response) {
                        console.log('data posted'); console.log(response);
                        $('.modal-design-shared').modal('show');
                    })
            }
        });

        $(document).on("click", '.fav-cart-btn', function () {

            var designs = JSON.parse($.cookie('favorites'));
            var productIndex = $(this).attr('data-index');

            console.log('productIndex');

            var properties = _.filter(designs, function (obj) {
                return obj.index == productIndex;
            })[0].selections;

            var productName = properties.productName;
            console.log(productName);


            var dataPath = productName + ".json";
                productController.loadProduct(dataPath, function () {
                    viewModelController.defaultSelections = properties;
                    console.log('debug')
                    //viewModelController.viewModel.userState.selectedProduct(productName);
                    viewModelController.initialize(productController.getProductModel());
           
                // how do I get the shopifyID?
                var shopifyID = viewModelController.getExternalID();
           
                var data = {};
                data.quantity = 1;
                data.id = shopifyID;
                var request = $.param(data);
                $.each(properties, function (k, v) {
                    request += "&properties%5B" + k + "%5D=" + v;
                });
                //console.log('shopify key:'); console.log(shopifyID);

                // TODO: Make Shopify object available and remove the function for this added to this module.
                addItemFromData(request, function (r) {
                    window.exitReady = true;
                    window.location = '/cart';
                });
            });

        });

        $('.fav-tool').hover(function () {
            $(this).find('.fav-helper-text').show();
        }, function () {
            $(this).find('.fav-helper-text').hide();
        });

    }

    return {
        registerEvents: registerEvents,
        noDesignsMessage: noDesignsMessage
    };
});