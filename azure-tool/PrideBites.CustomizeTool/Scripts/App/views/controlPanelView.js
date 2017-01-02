define("controlPanelView", ['jquery'], function ($) {

    // Add active classes on headers so we can properly style them
    // Resize the sidebar depending on which panel is clicked
    $('body').on('show.bs.collapse', function (e) {
        activateHeading(e);
        disableActiveTab();
        resizeSidebar();
    });
    $('body').on('hide.bs.collapse', function (e) {
        activateHeading(e);
        disableActiveTab();
        resizeSidebar();
    });

    (function ($) {
        $.each(['show', 'hide'], function (i, ev) {
            var el = $.fn[ev];
            $.fn[ev] = function () {
                this.trigger(ev);
                return el.apply(this, arguments);
            };
        });
    })(jQuery);

    function disableActiveTab() {
        $(".panel-heading").attr("data-toggle", "collapse");
        $(".active:not(.fieldCustomization > div > div > .panel-primary > .panel-heading)").attr("data-toggle", "");
    };

    // Count the rest of the panels before and after the active one in this partial
    // Determine the height of the panel body leaving space for the remaining tabs on the bottom
    // Margin for Complete Order area included
    function panelHeightCalculation(height) {
        var totalPanels     = $("#control-container").find(".panel-primary:visible:not(.fieldCustomization > div > div > .panel-primary)").length;
        var previousPanels  = $(".active").parents(".panel:visible").length;
        var remainingPanels = totalPanels - previousPanels;
        var previousHeight  = previousPanels * $(".panel-heading").outerHeight();
        var remainingHeight = remainingPanels * $(".panel-heading").outerHeight();
        return (height - (previousHeight + remainingHeight) - 163);
    };

    function resizeSidebar() {
        var containerHeight = $(window).height() - $(".head").outerHeight();
        $(".panel-body:not(.fieldCustomization > div > div > .panel > .panel-collapse > .panel-body)").height(panelHeightCalculation(containerHeight));
    };

    function activateHeading(e)
    {
        var heading = $(e.target).prev('.panel-heading');
        heading.toggleClass('active');
        heading.find('.glyphicon').toggleClass('glyphicon-chevron-up glyphicon-chevron-down')
    }

    function activateSelectedStep(viewModel) {
        //Update UI for first step
        var selectedStepId = '#step-' + viewModel.userState.selectedStep();
        $(selectedStepId + "> .panel-collapse").addClass('in');
        $(selectedStepId + "> .panel-heading").addClass('active');
    }
    function activateSelectedAttribute(viewModel)
    {
        //Activate first tab in each step
        $('.step-attributes .nav-tabs').find('li:first').addClass('active');
        $('.tab-content').find('.tab-pane:first').addClass('active');

        //Show active states on tabs and tab content
        viewModel.userState.selectedAttribute.subscribe(function (selectedAttributeClassId) {
            $('.' + selectedAttributeClassId).addClass('active').siblings().removeClass('active');
            var selectedTabContentClassId = 'tab-' + selectedAttributeClassId.split('-')[1];
            $('#' + selectedTabContentClassId).addClass('active').siblings().removeClass('active');
        });
    }
    
       var render = function (product, viewModel) {
       var template = $('#productTemplate').html();
       $("#control-container").empty().append(_.template(template, { "product": product }));
       $('.nextAttribute').last().hide();

       activateSelectedStep(viewModel);
       activateSelectedAttribute(viewModel);

       $('body').on('click', '.colorPicker .option', function () {
           var selectedOption = $(this);
           viewModel.userSelection[selectedOption.attr('data-field')](selectedOption.attr('data-value'));
       });

       disableActiveTab();

       // If the user resizes the window resize the panels
       $(window).resize(function () {
           resizeSidebar();
           //window.scrollTo(0,0);
       });

       $(document).ready(function() {
           //Colorpicker popovers
           $('body').popover({
               'html': true,
               'container': '#control-container',
               'placement': function (tip, ele) {
                   var width = $(window).width();
                   return width >= 975 ? 'left' : (width < 600 ? 'top' : 'left');
               },
               'selector': 'a[rel="popover"]',
               'content': function (e) {
                   var pickerContent = $(this).siblings('.colorPicker-subOptions').html();
                   return pickerContent;
               },
               'trigger':'focus'
           });

           $('.active').on('show', function(){
               resizeSidebar();
           });
       });
    }
    return {
        render: render
    };
});