define("productController", ['jquery'], function ($) {
    var productModel = {};
    var url = window.ContentRoot + "/AppContent/ProductData/";
   
    function loadProduct(productSchema, callback) {
        $.getJSON(url + productSchema, function (data) {
            productModel = data;
            if (typeof callback != 'undefined') {
                callback();
            }
            $.event.trigger({
                type: "product.loadComplete",
                product: productModel.name
            });
        });
    }
    function getProductModel() {
        return productModel;
    }
    function getHelpMessages()
    {
        return productModel.helpText || {};
    }

    function findRegionById(view, regionId) {
        return _.findWhere(view.regions, { "id": regionId });
    }

    function findViewById(viewId) {
        return _.findWhere(productModel.views, { "id": viewId });
    }
    function findStepById(stepId)
    {
        return _.findWhere(productModel.steps, { "id": stepId });
    }
    function findCustomizationsByAttributeName(attributeName)
    {
        var query = ':has(.name:val("'+ attributeName +'")) > .customizations';
        return JSONSelect.match(query, productModel)[0];
    }
    function findOptionsByField(field)
    {
        var query = ':has(.field:val("' + field + '")) > .groups .options';
        var matches = JSONSelect.match(query, productModel);
        return matches.length == 0 ? [] : matches;
    }

    function findGroupsByField(field) {
        var query = ':has(.field:val("' + field + '")) > .groups';
        var matches = JSONSelect.match(query, productModel);
        return matches.length == 0 ? [] : matches[0];
    }

    function findOptionByCustomizationValue(field, optionValue)
    {
        var query = ':has(.field:val("'+ field +'")) > .options > :has(.value:val("'+ optionValue +'"))';
        return JSONSelect.match(query, productModel)[0];
    }

    function getFieldsByType(type)
    {
        var query = '.type:val("' + type + '") ~ .field';
        var matches = JSONSelect.match(query, productModel);
        return matches.length == 0 ? [] : matches;
    }

    

    return {
        loadProduct: loadProduct,
        getProductModel: getProductModel,
        getHelpMessages: getHelpMessages,
        findViewById: findViewById,
        findRegionById: findRegionById,
        findCustomizationsByAttributeName: findCustomizationsByAttributeName,
        findOptionByCustomizationValue: findOptionByCustomizationValue,
        findOptionsByField: findOptionsByField,
        findStepById: findStepById,
        getFieldsByType: getFieldsByType,
        findGroupsByField: findGroupsByField
    }
});