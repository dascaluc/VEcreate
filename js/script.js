$(document).ready(function(){
    /*
     *  Retrieving the values from the 'data-*' attributes
     */
    var changelistener = $('#controlls').data('changelistener');
    //var initialValue = $('#controlls').val();
    var editable = $('#controlls').data('editable');
    var list = $('#controlls').data('list');
    var toggle_empty = $('#controlls').data('empty');
    var maxlist = $('#controlls').data('maxlist');
    var minlist = $('#controlls').data('minlist');
    var deletetable = $('#controlls').data('deletetable');
    var revertable = $('#controlls').data('revertable');
    var defaultUm = $('#controlls').data('defaultum');
    var hasPrefix = $('#controlls').data('hasprefix');
    var hasSufix = $('#controlls').data('hassufix');
    var hasUm = $('#controlls').data('hasum');
    var hasUmItem = $('#controlls').data('hasumitem');
    // The readonly/editable flag - when this is 0 - the content is in readonly mode; when it's 1 - the content can be edited.
    var editable_flag = 0;
    var deleted_all_flag = 0;
    var empty_all_flag = 0;
    var dirtyFlag = 0;
    var total_li = $('.item').length;           // Get the LI number
    var currentIdNumber = minlist + 1;    //  Get the number of the minimum items, add 1 and store it as the item ID
    //  Get the initial values for each input
    var initialValues = [];
    var initialValuesUMitem = [];
    $('.ve-text').each(function(){
        initialValues.push($(this).val());
        
        if (hasUmItem === true) {
            initialValuesUMitem.push($(this).closest('.item').find('.has_um_item').val());
        }
        
    });
    //  Set the position of each item
    var setPosition = function(){
        $('.ve-text').each(function(index){
            var itemPosition = index + 1;
            $(this).closest('.item').find('.position').val(itemPosition);
        });
    }
    //  Call the function on page load
    setPosition();
    var readonlyVal = '';       //  Definig the variable globally
    
     //  Dirty flag
    $(document).on('change', 'input, select', function(){
        dirtyFlag = 1;
        $('#wrap').addClass('dirtyField');
    });
    $(document).on('click', 'nav li', function(){
        dirtyFlag = 1;
        $('#wrap').addClass('dirtyField');
    });
    
    var EditableSwitch = function() {
        readonlyVal = '';       //  Empty the variable before each execution of the EditableSwitch function
        //  The readonly output text
        if (hasPrefix === true) {
            readonlyVal += $('.has_prefix').val();
        }
        readonlyVal += ' ';
        $('.ve-text').each(function(){
            readonlyVal += ($(this).val());
            var hasUmItemVal = $(this).nextAll('.has_um_item');
            readonlyVal += ' ';
            if (hasUmItemVal.val() != undefined) {
                readonlyVal += hasUmItemVal.val();
            }
            readonlyVal += ' // ';
        });
        if ((hasUm === true) && (hasUmItem != true)) {
            readonlyVal += $('.has_um').val();
        }
        readonlyVal += ' ';
        if (hasSufix === true) {
            readonlyVal += $('.has_sufix').val();
        }
        readonlyVal += ' ';
        $('#readonly_container').html(readonlyVal);
    }
    EditableSwitch();
    
    //  On page load, check if the Editable Flag is ON or OFF and display the proper content
    if (editable_flag === 0) {
        $('#dymanic_content').hide();
        $('.toggle_delete_all, .toggle_empty_all, .revert_all, .open_modal').hide();
        $('#readonly_container').show();
    }
    //  On page load, check if 'hasum' is true or not and make the proper adjustments
    if (hasUm === true) {
        if (hasUmItem === true) {
            //  Only Has UM for each item exists
            $('.has_um').remove();
        } else {
            //  Only Has UM for the entire component exists
            $('.has_um_item').remove();
        }
    } else {
        $('.has_um').remove();
    }

    //  Menu functionality
    $(document).on('mouseover', 'nav', function(){
        $(this).children('ul').removeClass('hidden');
    }).on('mouseout', 'nav', function(){
        $(this).children('ul').addClass('hidden');
    });
    
    /*
     *  Remove elements depending on the data-* attributes 
     */
    if (hasPrefix === false) {
        $('.has_prefix').remove();
    }
    if (hasSufix === false) {
        $('.has_sufix').remove();
    }
    if (hasUm === false) {
        $('.has_um').remove();
    }
    
     /*
     *  Buttons Fuctionality
     */
    // Readonly toggle mode
    $(document).on('click', '.toggle_edit', function(){
        EditableSwitch();
        if (editable_flag === 0) {              //  Make the component Editable
            if (empty_all_flag === 0) {
                $('#dymanic_content').show();
                $('#readonly_container').hide();
            }
            $('.toggle_delete_all, .toggle_empty_all, .revert_all, .open_modal').show();
            editable_flag = 1;
        } else {                                //  Make the component Non-Editable
            if (empty_all_flag === 0) {
                $('#dymanic_content').hide();
                $('#readonly_container').show();
            }
            $('.toggle_delete_all, .toggle_empty_all, .revert_all, .open_modal').hide();
            editable_flag = 0;
        }
    });
    
    //  Deleting the componennt (with the possibility to revert this delete action)
    $(document).on('click', '.toggle_delete_all', function(){
        if (deleted_all_flag === 0) {
            if (empty_all_flag === 1) {     //  Deleting an Empty element
                $('.ui-icon-cancel.empty_all').addClass('hidden');
            }
            $('#dymanic_content').hide();
            $('.ui-icon-trash.delete_all').removeClass('hidden');
            $('.toggle_edit, .toggle_empty_all, .revert_all').hide();
            $('#delete_all_flag').val('true');
            deleted_all_flag = 1;
        } else {
            if (empty_all_flag === 1) {     //  Un-Deleting an Empty element
                $('.ui-icon-cancel.empty_all').removeClass('hidden');
            } else {                        //  Un-Deleting a Non-Empty element
                $('#dymanic_content').show();
            }
            $('.toggle_edit, .toggle_empty_all, .revert_all').show();
            $('.ui-icon-trash.delete_all').addClass('hidden');
            $('#delete_all_flag').val('false');  
            deleted_all_flag = 0;
        }
    });
      
    //  Set/Unset Empty for the entire component
    $(document).on('click', '.toggle_empty_all', function(){
        if (empty_all_flag === 0) {
            $('#dymanic_content').hide();
            $('.ui-icon-cancel.empty_all').removeClass('hidden');
            $('#empty_all_flag').val('true');
            empty_all_flag = 1;
        } else {
            $('#dymanic_content').show();
            $('.ui-icon-cancel.empty_all').addClass('hidden');
            $('#empty_all_flag').val('false');
            empty_all_flag = 0;
        }
    });
    
    //  Initial values that will be used for tghe 'Revert all' functionality
    var $prefix = $('.has_prefix').val();
    var $sufix = $('.has_sufix').val();
    var $um = $('.has_um').val();
    var revertedComponent = $('#items').html();        //  The content of the initial component
    //  Revert to initial state for the entire component
    $(document).on('click', '.revert_all', function(){
        $('.has_prefix').val($prefix);
        $('.has_sufix').val($sufix);
        $('.has_um').val($um);
        //$('.new_item').remove();
        $('#items').html(revertedComponent);
        total_li = minlist;
        setPlusMinus();
        setArrows();
        //setPosition();
        
        dirtyFlag = 0;
        $('#wrap').removeClass('dirtyField');
    });
    
     /*
     *   The MOVE UP and MOVE DOWN functionality for the list items
     */
    //  The function which sets how the items are moved
    var setArrows = function() {
        var itemsList = $('.item');
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
        if (total_li <= minlist) {
            $('.delete_item').addClass('hidden');
        } else if (total_li >= maxlist) {
            $('.add_more').addClass('hidden');
        } else {
            $('.delete_item').removeClass('hidden');
            $('.add_more').removeClass('hidden');
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
        if (total_li < maxlist) {
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
                            '</nav>' +
                                '<input type="text" id="item_' + currentIdNumber + '" class="ve-text" value="" />' +
                                '<input type="hidden" class="position" value=""/>' +
                                '<input type="hidden" class="empty_flag" value="false" />' +
                                '<span class="ui-icon ui-icon-cancel empty_item" style="display:none;"></span>' +
                                '<input type="hidden" class="deleted_flag" value="false" />';
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
            $('.default_um').val(defaultUm);
            total_li++;
            currentIdNumber++;
            setArrows();
            setPosition();
            setPlusMinus();
            
        }else{
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
        var currentID = $(this).closest('.item').find('.ve-text').attr('id');       //  get the ID of the current input
        var currentIDnumber = currentID.match(/[\d]+$/);                            //  get the number from the ID name. At this moment, the ID of an input field is set as 'item_number' (ex: item_1, item_2 ...)
        $(this).closest('.item').find('.ve-text').val(initialValues[currentIDnumber-1]);    //replace the value from the input field with the initial value we got on page load
    });
    //  Revert function for the inputs created dinamically with the "+" button
     $(document).on('click', '.dynamic_revert', function(){
        $(this).closest('.item').find('.ve-text').val('');
    });
    
    //  Open in modal window functionality
    $(document).on('click', '.open_modal', function(){
        $('<div/>', {id: 'generated_modal', class: 'items'}).appendTo('#wrap');     //  Creating the new modal
        var items_content = $('#items').clone();                                 //  Get the content from the '#items' list by clonning the element
        $('#generated_modal').html(items_content);                              //  Insert the content from the '#items' list into the generated modal
        $('<button class="save">Save</button><button class="cancel">Cancel</button>').appendTo('#generated_modal');         //  Add 'Save' and'Cancel' buttons to the modal window
        //  Since the .CLONE() jQuery method doesn't clone also the selected value of the <select> elements, we will do this separatelly
        var selectedIndexItems = [];    //  A new Array for the selected values
        $('#items select').each(function(){
          selectedIndexItems.push($(this).prop('selectedIndex'));
        });
        $('#generated_modal select').each(function(index){
          $(this).prop('selectedIndex', selectedIndexItems[index]);
        });
        
        $('#generated_modal').modal({                                           //  Display the modal
            escapeClose: false,
            clickClose: true
        });
        return false;
    });
   //   Functionality for the 'Save' and 'Cancel' buttons from the Modal window
    $(document).on('click', '.save', function(){
        var new_generated_content = $('#generated_modal .items').clone();           // Get the new UL#items by clonning it
        $('#items').replaceWith(new_generated_content);                             //  Replace the old UL#items with the one clonned above
        //  Same as above - force the <select> elements to keep the new values
        var selectedIndexModal = [];    //  A new Array for the selected values from the Module
        $('#generated_modal select').each(function(){
          selectedIndexModal.push($(this).prop('selectedIndex'));
        });
        $('#items select').each(function(index){
          $(this).prop('selectedIndex', selectedIndexModal[index]);
        });
        $.modal.close();                                                            // Close the modal
        $('#generated_modal').remove();
    });
    $(document).on('click', '.cancel', function(){
        $.modal.close();                                                            // Close the modal
        $('#generated_modal').remove();
    }); 
    
});