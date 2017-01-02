define("fileUploadView", ['jquery'], function ($) {
    //http://docs.fineuploader.com/branch/master/api/options.html
    var maxUploads = 3;

    //function setViewModelFields(viewModel, uploader)
    //{
    //    var files = $(uploader).fineUploaderAzure('getUploads');
    //    var fileIndex = 1;
    //    //Update fields with successful values.
    //    $.each(files, function (index, obj) {
    //        if (obj.status == "upload successful") {
    //            var filename = obj.uuid + obj.name.split('.')[1];
    //            viewModel.userSelection['image' + fileIndex](filename);
    //            fileIndex++;
    //        }
    //    });
    //    //Clear out any remaining fields
    //    for( var x = fileIndex; x <= maxUploads; x++)
    //        viewModel.userSelection['image' + x]('');
    //}

    //function initializeOLD(viewModel) {
    //    var uploader = $("#fine-uploader").fineUploaderAzure({
    //        request: {
    //            endpoint: 'https://pridebites.blob.core.windows.net/useruploads'
    //        },
    //        signature: {
    //            endpoint: window.appName + 'FileUpload/signature'
    //        },
    //        uploadSuccess: {
    //            endpoint: window.appName + 'FileUpload/success'
    //        },
    //        retry: {
    //            enableAuto: true
    //        },
    //        deleteFile: {
    //            enabled: true
    //        },
    //        cors: {
    //            //all requests are expected to be cross-domain requests
    //            expected: true,
 
    //            //if you want cookies to be sent along with the request
    //            sendCredentials: false
    //        },
    //        validation: {
    //            allowedExtensions: ["jpeg", "jpg", "png", "gif"],
    //            sizeLimit: 5000000, // 5 MiB
    //            itemLimit: maxUploads
    //        }
    //    }).on("complete", function (event, id, name, responseJSON, xhr) {
    //        //console.log(responseJSON);
    //        setViewModelFields(viewModel, this);
           
    //    }).on("deleteComplete", function (event, id, xhr, isError) {
    //        setViewModelFields(viewModel, this);
    //    });
    //}

    function initialize(viewModel) {
        $(document).ready(function () {
            filepicker.setKey('AGewTAucGQlOMBc25KFeCz');

            $.each($('.imageUpload'), function (index, obj) {
                var element = obj;
                element.onchange = function (e) {
                    //console.log("This is the onchange stuff", index, obj);
                    //console.log($('#imageUploadTemplate'));
                    //console.log(JSON.stringify(e.fpfile));

                    var selectedUrl = e.fpfile.url;
                    var field = $(obj).attr('data-field');
                    viewModel.userSelection[field](selectedUrl);
                };
                filepicker.constructWidget(element);
            });
        });
    }

    return { initialize: initialize };
});