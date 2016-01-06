$(document).ready(function(){
    /*
     *  Retrieving the values from the 'data-*' attributes
     */
    var changelistener = $(this).find('.controlls').data('changelistener');
    //var initialValue = $('.controlls').val();
    var type = $(this).find('.controlls').data('type');
    var editable = $(this).find('.controlls').data('editable');
    var list = $(this).find('.controlls').data('list');
    var toggle_empty = $(this).find('.controlls').data('empty');
    var maxlist = $(this).find('.controlls').data('maxlist');
    var minlist = $(this).find('.controlls').data('minlist');
    var deletetable = $(this).find('.controlls').data('deletetable');
    var revertable = $(this).find('.controlls').data('revertable');
    var defaultUm = $(this).find('.controlls').data('defaultum');
    var hasPrefix = $(this).find('.controlls').data('hasprefix');
    var hasSufix = $(this).find('.controlls').data('hassufix');
    var hasUm = $(this).find('.controlls').data('hasum');
    var hasUmItem = $(this).find('.controlls').data('hasumitem');
    // The readonly/editable flag - when this is 0 - the content is in readonly mode; when it's 1 - the content can be edited.
    var editable_flag = 0;
    var deleted_all_flag = 0;
    var empty_all_flag = 0;
    var dirtyFlag = 0;
    var total_li = $('.item').length;           // Get the LI number
    var currentIdNumber = minlist + 1;    //  Get the number of the minimum items, add 1 and store it as the item ID
    var that = $(this);
    //  Get the initial values for each input and select in order to have these values to be used for the individual revert functionality
    var initialValuesCont = {};             //  Creating the global object which will hold the initial values from the inputs
    var initialValuesContSelect = {};       //  Creating the global object which will hold the initial values from the selects
    $('.container').each(function(index){
        var initialValues = [];             //  Creating the local array which will hold the initial values from each input
        var initialValuesUMitem = [];       //  Creating the local array which will hold the initial values from each select
        $(this).find('.item').each(function(){
            initialValues.push($(this).find('.ve-text').val());     //  Push each item values into an array that will be created for each element
            if (hasUmItem === true) {
                initialValuesUMitem.push($(this).closest('.item').find('.has_um_item').val());      //  Same as above but for select elements
            }
        });
        initialValuesCont["v" + index] = initialValues;                 //  Store the arrays declared above as elements of the global object - inputs
        initialValuesContSelect["v" + index] = initialValuesUMitem;     //  Store the arrays declared above as elements of the global object - selects
    });

    $('.container').each(function(){
        var multilang = $(this).find('.controlls').data('multilang');
    });
    
    //  Set the position of each item
    var setPosition = function(){
        $('.container').each(function(){
            $(this).find('.ve-text').each(function(index){
                var itemPosition = index + 1;
                $(this).closest('.item').find('.position').val(itemPosition);
            });
        });
    }
    //  Call the function on page load
    setPosition();
    var readonlyVal = '';       //  Definig the variable globally
    
     //  Dirty flag
    $(document).on('change', 'input, select', function(){
        dirtyFlag = 1;
        $(this).find('.container').addClass('dirtyField');
    });
    $(document).on('click', 'nav li', function(){
        dirtyFlag = 1;
        $(this).find('.container').addClass('dirtyField');
    });
   
    var EditableSwitch = function() {
        $('.container').each(function(){
            var hasPrefix = $(this).find('.controlls').data('hasprefix');
            var hasSufix = $(this).find('.controlls').data('hassufix');
            var hasUm = $(this).find('.controlls').data('hasum');
            var hasUmItem = $(this).find('.controlls').data('hasumitem');
            readonlyVal = '';       //  Empty the variable before each execution of the EditableSwitch function
            //  The readonly output text
            if (hasPrefix === true) {
                readonlyVal += that.find('.has_prefix').val();
            }
            readonlyVal += ' ';
            $(this).find('.ve-text').each(function(){
                readonlyVal += ($(this).val());
                var hasUmItemVal = $(this).nextAll('.has_um_item');
                readonlyVal += ' ';
                if (hasUmItemVal.val() != undefined) {
                    readonlyVal += hasUmItemVal.val();
                }
                readonlyVal += ' // ';
            });
            if ((hasUm === true) && (hasUmItem != true)) {
                readonlyVal += that.find('.has_um').val();
            }
            readonlyVal += ' ';
            if (hasSufix === true) {
                readonlyVal += that.find('.has_sufix').val();
            }
            readonlyVal += ' ';
            $(this).find('.readonly_container').html(readonlyVal);
        });
    }
    EditableSwitch();
    
    //  On page load, check if the Editable Flag is ON or OFF and display the proper content
    if (editable_flag === 0) {
        $('.container').each(function(){
            $(this).find('.dymanic_content').addClass('hidden');
            $(this).find('.toggle_delete_all, .toggle_empty_all, .revert_all, .open_modal').addClass('hidden');
            $(this).find('.readonly_container').removeClass('hidden');
        });
    }
    //  On page load, check if 'hasum' is true or not and make the proper adjustments
    $('.container').each(function(){
        var hasUm = $(this).find('.controlls').data('hasum');
        var hasUmItem = $(this).find('.controlls').data('hasumitem');
        if (hasUm === true) {
            if (hasUmItem === true) {
                //  Only Has UM for each item exists
                $(this).find('.has_um').remove();
            } else {
                //  Only Has UM for the entire component exists
                $(this).find('.has_um_item').remove();
            }
        } else {
            $(this).find('.has_um').remove();
        }
    });
    //  Hidding the menu icons on page load
    $('.container').find('.menu').addClass('hidden');
       
    //  Individual item menu functionality
    $(document).on('mouseover', '.item nav', function(){
        $(this).children('ul').removeClass('hidden');
    }).on('mouseout', '.item nav', function(){
        $(this).children('ul').addClass('hidden');
    });
    
    /*
     *  Remove elements depending on the data-* attributes 
     */
    $('.container').each(function(){
        var hasUm = $(this).find('.controlls').data('hasum');
        var hasPrefix = $(this).find('.controlls').data('hasprefix');
        var hasSufix = $(this).find('.controlls').data('hassufix');
        if (hasPrefix === false) {
            $(this).find('.has_prefix').remove();
        }
        if (hasSufix === false) {
            $(this).find('.has_sufix').remove();
        }
        if (hasUm === false) {
            $(this).find('.has_um').remove();
        }
    });
     /*
     *  Buttons Fuctionality
     */
    // Readonly toggle mode
    $(document).on('click', '.toggle_edit', function(){
        var $parent = $(this).closest('.container');
        var dc = $parent.find('.dymanic_content');
        var rc = $parent.find('.readonly_container');
        EditableSwitch();
        if (dc.hasClass('hidden')) {
            dc.removeClass('hidden');
            rc.addClass('hidden');
            $parent.find('.controlls').find('ul').addClass('main_menu');
            $parent.find('.menu, .toggle_delete_all, .toggle_empty_all, .revert_all, .open_modal').removeClass('hidden');
            $parent.find('.main_menu').addClass('hidden');
        } else {
            dc.addClass('hidden');
            rc.removeClass('hidden');
            $parent.find('.menu, .toggle_delete_all, .toggle_empty_all, .revert_all, .open_modal').addClass('hidden');
            $parent.find('.main_menu').removeClass();
        }
    });
    
    $(document).on('mouseover', '.controlls nav', function(){
            var xc = $(this).closest('.container').find('.readonly_container');
            if (xc.hasClass('hidden')) {
                $(this).closest('.container').find('.main_menu').removeClass('hidden');
            }
        }).on('mouseout', '.controlls nav', function(){
        var xc = $(this).closest('.container').find('.readonly_container');
            if (xc.hasClass('hidden')) {
                $(this).closest('.container').find('.main_menu').addClass('hidden');
            }
        });
    
    
    //  Deleting the componennt (with the possibility to revert this delete action)
    $(document).on('click', '.toggle_delete_all', function(){
        var $parent = $(this).closest('.container');
        if (deleted_all_flag === 0) {
            if (empty_all_flag === 1) {     //  Deleting an Empty element
                $parent.find('.ui-icon-cancel.empty_all').addClass('hidden');
            }
            $parent.find('.dymanic_content').addClass('hidden');
            $parent.find('.ui-icon-trash.delete_all').removeClass('hidden');
            $parent.find('.toggle_edit, .toggle_empty_all, .revert_all, .open_modal').hide();
            $parent.find('.delete_all_flag').val('true');
            deleted_all_flag = 1;
        } else {
            if (empty_all_flag === 1) {     //  Un-Deleting an Empty element
                $parent.find('.ui-icon-cancel.empty_all').removeClass('hidden');
            } else {                        //  Un-Deleting a Non-Empty element
                $parent.find('.dymanic_content').removeClass('hidden');
            }
            $parent.find('.toggle_edit, .toggle_empty_all, .revert_all, .open_modal').show();
            $parent.find('.ui-icon-trash.delete_all').addClass('hidden');
            $parent.find('.delete_all_flag').val('false');  
            deleted_all_flag = 0;
        }
    });
      
    //  Set/Unset Empty for the entire component
    $(document).on('click', '.toggle_empty_all', function(){
        var $parent = $(this).closest('.container');
        if (empty_all_flag === 0) {
            $parent.find('.dymanic_content').addClass('hidden');
            $parent.find('.ui-icon-cancel.empty_all').removeClass('hidden');
            $parent.find('.empty_all_flag').val('true');
            empty_all_flag = 1;
        } else {
            $parent.find('.dymanic_content').removeClass('hidden');
            $parent.find('.ui-icon-cancel.empty_all').addClass('hidden');
            $parent.find('.empty_all_flag').val('false');
            empty_all_flag = 0;
        }
    });
    
    var revertAll = [];
    //  Initial values that will be used for tghe 'Revert all' functionality
    $('.container').each(function(){
        var $prefix = $(this).find('.has_prefix').val();
        var $sufix = $(this).find('.has_sufix').val();
        var $um = $(this).find('.has_um').val();
        var revertedComponent = $(this).find('.items').html();        //  The content of the initial component
        revertAll.push(revertedComponent);
        //  Revert to initial state for the entire component
        $(document).on('click', '.revert_all', function(){
            var currentID = $(this).closest('.container').attr('id');       //  get the ID of the current container
            var currentIDnumber = currentID.match(/[\d]+$/) - 1;                //  get the number from the ID and substract 1
            var $parent = $(this).closest('.container');
            $parent.find('.has_prefix').val($prefix);
            $parent.find('.has_sufix').val($sufix);
            $parent.find('.has_um').val($um);
            $parent.find('.items').html(revertAll[currentIDnumber]);        //  revert the component to the initial state
            total_li = minlist;
            setPlusMinus();
            setArrows();
            dirtyFlag = 0;
            $(this).find('.container').removeClass('dirtyField');
        });
    });

     /*
     *   The MOVE UP and MOVE DOWN functionality for the list items
     */
    //  The function which sets how the items are moved
    var setArrows = function() {
        var itemsList = that.find('.item');
        //  If the list has just ONE element, hide the DOWN arrow 
        if (itemsList.length === 1) {
            itemsList.find('.move_up').addClass('hidden');
            itemsList.find('.move_down').addClass('hidden');
        } else {
            for(var i = 0; i < itemsList.length; i++){
                if ($(itemsList[i]).is( ":first-child" )) {     //  For the first item, remove the UP arrow
                    $(itemsList[i]).find('.move_up').addClass('hidden');
                    $(itemsList[i]).find('.move_down').removeClass('hidden');
                } else if ($(itemsList[i]).is( ":last-child" )){            //  For the last item, remove the DOWN arrow
                    $(itemsList[i]).find('.move_down').addClass('hidden');
                    $(itemsList[i]).find('.move_up').removeClass('hidden');
                } else {                                //  For the other items, make visible both arrows
                    $(itemsList[i]).find('.move_up').removeClass('hidden');
                    $(itemsList[i]).find('.move_down').removeClass('hidden');
                }
            }
        }
    }
    //  Call the function on page load
    setArrows();

    //  The function which removes "+" and/or "-" depending on the number ot the items
    var setPlusMinus = function(){
        if (clickedElem == null) {                  //  Normal view
            $('.container').each(function(){
                var totalsLi = $(this).find('.items .item').length;     //  Get the total number of the list items for each element
                var minlistElem = $(this).find('.controlls').data('minlist');       //  Get the minlist value for each item
                var maxlistElem = $(this).find('.controlls').data('maxlist');       //  Get the maxlist value for each item
                if (totalsLi <= minlistElem) {
                    $(this).find('.delete_item').addClass('hidden');
                } else if (totalsLi >= maxlistElem) {
                    $(this).find('.add_more').addClass('hidden');
                } else {
                    $(this).find('.delete_item').removeClass('hidden');
                    $(this).find('.add_more').removeClass('hidden');
                }
            });
        } else {                                    //  Modal view
            $parent3 = $('#generated_modal .items');
            var parent2 = clickedElem.closest('.container');
            var totalsLi = $parent3.find('.item').length;     //  Get the total number of the list items for each element
            var minlistElem = parent2.find('.controlls').data('minlist');       //  Get the minlist value for each item
            var maxlistElem = parent2.find('.controlls').data('maxlist');       //  Get the maxlist value for each item
            console.log("totalsLi: " + totalsLi);
            console.log("minlistElem: " + minlistElem);
            console.log("maxlistElem: " + maxlistElem);
            if (totalsLi <= minlistElem) {
                $parent3.find('.delete_item').addClass('hidden');
            } else if (totalsLi >= maxlistElem) {
                $parent3.find('.add_more').addClass('hidden');
            } else {
                $parent3.find('.delete_item').removeClass('hidden');
                $parent3.find('.add_more').removeClass('hidden');
            }
        }
    }
    //  Call the function on page load
    setPlusMinus();
    
    //  Switch 2 list items on click on the DOWN arrow
    $(document).on('click', '.move_down', function(){
        var $liAsParent = $(this).closest('.item');
        $liAsParent.before($liAsParent.next());
        $liAsParent.after($liAsParent.next());
        setArrows();
        setPosition();
    });
    //  Switch 2 list items on click on the UP arrow
    $(document).on('click', '.move_up', function(){
        var $liAsParent = $(this).closest('.item');
        $liAsParent.before($liAsParent.prev());
        $liAsParent.after($liAsParent.prev());
        setArrows();
        setPosition();
    });

    /*
     *  Adding a new element on click
     */
    $(document).on('click', '.add_more', function(){
        var $parent = $(this).closest('.items');
        var $parent2 = $(this).closest('.container');
        var totalsLi = $parent.find('.item').length;     //  Get the total number of the list items for each element
        if (clickedElem == null) {
            var maxlistElem = $parent2.find('.controlls').data('maxlist');       //  Get the maxlist value for each item
            var multilang = $parent2.find('.controlls').data('multilang');       //  Get the data-multilang value
            //alert(multilang);
        } else {
            var maxlistElem = clickedElem.closest('.container').find('.controlls').data('maxlist');       //  Get the maxlist value for each item
            var multilang = clickedElem.closest('.container').find('.controlls').data('multilang');       //  Get the data-multilang value
        }
        if (totalsLi < maxlistElem) {
            var newItem =   '<li class="item new_item">' +
                            '<nav>' +
                                '<span class="menu_items ui-icon ui-icon-gear"></span>' +
                                '<ul class="hidden">' +
                                    '<li title="Delete" class="delete_item ui-icon ui-icon-minus"></li>' +
                                    '<li title="Empty" class="toggle_empty ui-icon ui-icon-cancel"></li>' +
                                    '<li title="Revert to initial" class="dynamic_revert ui-icon ui-icon-arrowrefresh-1-e"></li>' +
                                    '<li title="Move Up" class="move_up ui-icon ui-icon-arrowthick-1-n"></li>' +
                                    '<li title="Move Down" class="move_down ui-icon ui-icon-arrowthick-1-s"></li>' +
                                    '<li title="Add another item" class="add_more ui-icon ui-icon-plus"></li>' +
                                '</ul>' +
                            '</nav>';
                            if (type === 'input') {
                                newItem += '<input type="text" id="item_' + currentIdNumber + '" class="ve-text" value="" />';
                            }
                            if (type === 'textarea') {
                                newItem += '<textarea id="item_' + currentIdNumber + '" class="ve-text"></textarea>';
                            }
                            newItem += '<input type="hidden" class="position" value=""/>' +
                                '<input type="hidden" class="empty_flag" value="false" />' +
                                '<span class="ui-icon ui-icon-cancel empty_item" style="display:none;"></span>' +
                                '<input type="hidden" class="deleted_flag" value="false" />';
                            if (multilang === true) {
                                newItem += '<span class="multilang"></span>';
                            }
                                if (hasUmItem === true) {
                    newItem += '<select class="has_um_item default_um" style="margin-left:4px;">' +
                                    '<option value="1m">1m</option>' +
                                    '<option value="2m">2m</option>' +
                                    '<option value="3m">3m</option>' +
                                '</select>';
                                }
                    newItem += '<div class="clear"></div> ' +
                            '</li>';
            $(this).closest('.item').after(newItem);  //appending the new element right after the parent element of the clicked item
            $parent.find('.default_um').val(defaultUm);
            totalsLi++;
            currentIdNumber++;
            setArrows();
            setPosition();
            setPlusMinus();
        } else {
        }
    });
    
    //  Delete individual item
    $(document).on('click', '.delete_item', function(){
            $(this).closest('.item').remove();
            total_li--;
            setArrows();
            setPosition();
            setPlusMinus();
    });

    //  Set/Unset Empty for individual items
    $(document).on('click', '.toggle_empty', function(){
        $(this).closest('.item').find('.ve-text').toggle();
        $(this).closest('.item').find('.has_um_item').toggle();
        $(this).closest('.item').find('.empty_item').toggle();
        var emptyFlagItem = $(this).closest('.item').find('.empty_flag');
        var emptyFlagItemVal = emptyFlagItem.val();
        emptyFlagItem.val(emptyFlagItemVal === "true" ? "false" : "true");
    });
    
    //  There were created 2 "revert" functions: one for the initial input, which may have an initial value and one for the elements added dynamically with the "+" button because they are empty by default.
    //  Revert function for the initial input to the initial value
    $(document).on('click', '.revert_to_initial', function(){
        var currentID = clickedElem.closest('.container').attr('id');       //  get the ID of the current container
        var currentIDnumber = currentID.match(/[\d]+$/) - 1;                //  get the number from the ID and substract 1
        var classArr = $(this).closest('.item').find('.ve-text').attr("class").match(/[\w-]*item[\w-]*/g);          //  get item_number for the current input
        var classArrNumber = classArr[0].match(/[\d]+$/) - 1;                  //   get the number from the Item_number class name and substract 1
        var initVal = initialValuesCont["v" + currentIDnumber][classArrNumber];     //  get the reverted value to the initial value from tha field
        $(this).closest('.item').find('.ve-text').val(initVal);                 //  set the reverted value as the the value retrieved above
    });
    //  Revert function for the inputs created dinamically with the "+" button
     $(document).on('click', '.dynamic_revert', function(){
        $(this).closest('.item').find('.ve-text').val('');
    });
    var clickedElem = null;         //  declarating this as a global variable to be used on the 'open in modal' functionality
    //  Open in modal window functionality
    $(document).on('click', '.open_modal', function(){
        var $parent = $(this).closest('.container');
        $('<div/>', {id: 'generated_modal', class: 'items'}).appendTo($parent);     //  Creating the new modal and append it to the current container
        var items_content = $parent.find('.items').clone();                                 //  Get the content from the '.items' list by clonning the element
        var $currentModal = $parent.find('#generated_modal');           //  Get the current modal
        $currentModal.html(items_content);                          //  Insert the content from the '.items' list into the generated modal
        $('<button class="save">Save</button><button class="cancel">Cancel</button>').appendTo($currentModal);         //  Add 'Save' and'Cancel' buttons to the modal window
        //  Since the .CLONE() jQuery method doesn't clone also the selected value of the <select> elements, we will do this separatelly
        var selectedIndexItems = [];    //  A new Array for the selected values
        $parent.find('.items select').each(function(){
          selectedIndexItems.push($(this).prop('selectedIndex'));           //  get the selected items from the initial selects
        });
        $('#generated_modal select').each(function(index){
          $(this).prop('selectedIndex', selectedIndexItems[index]);         //  place the items retrieved above into the selects from the modal
        });
        $($currentModal).modal({                                           //  Display the modal
            escapeClose: false,
            clickClose: true
        });
        clickedElem = $(this);          //  get a reference to the clicked 'open in modal' item
        return false;
    });
   //   Functionality for the 'Save' and 'Cancel' buttons from the Modal window
    $(document).on('click', '.save', function(){
        //alert(clickedElem);
        var new_generated_content = $('#generated_modal .items').clone();           // Get the new UL.items by clonning it
        clickedElem.closest('.container').find('.items').replaceWith(new_generated_content);                             //  Replace the old UL.items with the one clonned above
        //  Same as above - force the <select> elements to keep the new values
        var selectedIndexModal = [];    //  A new Array for the selected values from the Module
        $('#generated_modal select').each(function(){
          selectedIndexModal.push($(this).prop('selectedIndex'));           //  get the selected items from the selects from the modal
        });
        clickedElem.closest('.container').find('.items select').each(function(index){
          $(this).prop('selectedIndex', selectedIndexModal[index]);         //  place the items retrieved above into the initial selects
        });
        $.modal.close();                                                            // Close the modal
        $('#generated_modal').remove();     
        $('#generated_modal').remove();     //  This is used twice because there are 2 divs with the same ID generated from the modal script
        clickedElem = null;                 //  clear the value for clickedElem as we go back to the initial display (out of the modal window)
    });
    $(document).on('click', '.cancel', function(){
        $.modal.close();                                                            // Close the modal
        $('#generated_modal').remove();
    }); 

/*
 *  Multi language modal
 */
    $(document).on('click', '.multilang', function(){
        var $parent = $(this).closest('.item');
        $('<div/>', {id: 'generated_lang_modal', class: 'lang_items'}).appendTo($parent);     //  Creating the new modal and append it to the current container
        var items_content = $parent.find('.langs').clone();                                 //  Get the content from the '.items' list by clonning the element
        alert(items_content);
        var $currentModal = $parent.find('#generated_lang_modal');           //  Get the current modal
        $currentModal.html(items_content);                          //  Insert the content from the '.items' list into the generated modal
        $('<button class="save_lang">Save</button><button class="cancel_lang">Cancel</button>').appendTo($currentModal);         //  Add 'Save' and'Cancel' buttons to the modal window
        $('#generated_lang_modal .langs').removeClass('hidden');
        $($currentModal).modal({                                           //  Display the modal
            escapeClose: false,
            clickClose: true
        });
        clickedElem = $(this);          //  get a reference to the clicked 'open in modal' item
        return false;
    });
 
 
 
});