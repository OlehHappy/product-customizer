define("viewModelController", ['jquery', 'productController', 'controlPanelView', 'modalView', 'tutorialView' ,'productViewSelectorView', 'designCanvasView', 'fileUploadView'],
                        function ($, productController, controlPanelView, modalView, productViewSelectorView, tutorialView ,designCanvasView, fileUploadView) {
    var viewModel = {
        userState: buildUserStateModel(),  //Intermediate state that will be reset when new product is loaded.
        userSelection: {},  //Selected values that will go to shopify upon completion
        product: ko.observable(),   //Full object model from server
        defaultSelections: null, //Values coming in from predefined templates or Edit an existing item
        editIndex: null //The Cart Item Index of the item being edited.
    };
    
   
    function buildUserSelectionModel(product)
    {
        //Add selected values
        var userSelectionModel = { "productName": ko.observable(product.name) };
        if (viewModel.defaultSelections == null) {
            //Load defaults from product template
            var productProperties = JSONSelect.match(".steps .attributes .customizations .field", product);
            var productValues = JSONSelect.match(".steps .attributes .customizations .selectedValue", product);
            $.each(productProperties, function (index, obj) {
                userSelectionModel[obj] = ko.observable(productValues[index]);
            });
        }
        else {
            userSelectionModel = loadUserSelections();
        }
        //Combined json of all selections used as observable for rendering.
        viewModel['combinedSelection'] = ko.computed(function () {
                                                            return ko.toJS(this);
        }, userSelectionModel);

        return userSelectionModel;
    }
    function loadUserSelections()
    {
        var userSelectionModel = {};
        $.each(viewModel.defaultSelections, function (key, val) {
                userSelectionModel[key] = ko.observable(val);
        });

        return userSelectionModel;
    }


    function buildUserStateModel() {
        return {
            'selectedCategory': ko.observable(),
            'selectedProduct': ko.observable(),
            'selectedStep' : ko.observable(),
            'selectedView': ko.observable(),
            'selectedAttribute': ko.observable()
        };
    }
    function resetUserStateModel()
    {
        viewModel.userState.selectedCategory('default');
        viewModel.userState.selectedStep('styles');
        viewModel.userState.selectedView('default');
        var firstAttribute = viewModel.product().steps[0].attributes[0].name;
        viewModel.userState.selectedAttribute('attribute-' + firstAttribute);
    }

    function setKOBindings() {
        ko.applyBindings(viewModel, document.getElementById("app-container"));
    }

    //public methods
    function initialize(product) {
        viewModel.userSelection = buildUserSelectionModel(product);
        viewModel.product(product);
        resetUserStateModel();
       
        designCanvasView.initialize(viewModel, productController, this);
        designCanvasView.render(viewModel, productController, this);  

        tutorialView.render(product, viewModel);
        controlPanelView.render(product, viewModel);
        modalView.render(product, viewModel);
        productViewSelectorView.render(product, viewModel);
        setKOBindings();
        fileUploadView.initialize(viewModel);

        //Hack: fix Edit item Uploaded files being cleared out during setKOBindings for some reason
        if (viewModel.defaultSelections != null) {
            $.each(viewModel.defaultSelections, function (key, val) {
                if (key.lastIndexOf('image', 0) === 0)
                    viewModel.userSelection[key](val);
            });
        }

    }
    function getViewModel()
    {
        return viewModel;
    }

    
    function getSelectedView()
    {
        var selectedViewId = viewModel.userState.selectedView();
        var selectedView = productController.findViewById(selectedViewId);
        return selectedView;
    }
    function getSelections( attributeName )
    {
        var selections = {};
        var customizations = productController.findCustomizationsByAttributeName(attributeName) || {};

        $.each(customizations, function (index, obj) {
            selections[obj.field] = viewModel.userSelection[obj.field]();
        });
        return selections;
    }
    //Use the flat selection values to get the full options object which includes data such as price
    function getSelectedOptions()
    {
        var options = [];
        var userSelections = ko.toJS(viewModel.userSelection);
        $.each(userSelections, function (key, val) {
            var option = productController.findOptionByCustomizationValue(key, val);
            if( typeof option != "undefined")
                options.push(option);
        });
        return options;
    }

    function getExternalIDKey() {
        var userSelections = ko.toJS(viewModel.userSelection);
        var fields = viewModel.product().externalIds.keyFields;
        var externalKey = "";
        $.each(fields, function (index, obj) {
            externalKey += userSelections[obj] + "-";
        });
        return externalKey.slice(0, -1);
    }
    function getExternalID() {
        var productExternalKey = getExternalIDKey();
        var externalID = viewModel.product().externalIds.variants[productExternalKey];
        return externalID;
    }
    
    return {
        initialize: initialize,
        getViewModel: getViewModel,
        getSelectedView: getSelectedView,
        getSelections: getSelections,
        getSelectedOptions: getSelectedOptions,
        getExternalID: getExternalID
    };
});