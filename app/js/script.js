$(function (){

    var aptData, displayData, sortBy, sortDir;

    sortBy = 'petName';
    sortDir = 'asc';

    //FUCTIONS

    function removeApt(aptID){
        var whichApt = _.find(aptData, function (item){
            return item.id === aptID;
        });
        aptData = _.without(aptData, whichApt);
        displayData =_.without(displayData, whichApt);
    }

    function listAppointments(info){
        if (sortDir === 'asc'){
            info = _.sortBy(info, sortBy);
        }else {
            info = _.sortBy(info, sortBy).reverse();
        }
        $.addTemplateFormatter('formatDate', function(value) {
            return $.format.date(new Date(value), 'MM/dd hh:mm p' );
          }); //date formatter
      
        $('#petList').loadTemplate('appointment-list.html', info, {
            complete: function (){
                $('.pet-delete').on('click', function (){
                    $(this).parents('.pet-item').hide(300, function ( ){
                        var whichItem = $(this).attr('id');
                        removeApt(Number(whichItem));//use Number if whichItem is text
                        console.log(aptData);
                        $(this).remove(); //called once hide completes. this represents the parent now, before it was the button
                    });
                });//delete apt

                $('[contenteditable]').on('blur', function(){
                    var whichID, fieldName, fieldData;
                    whichID = Number($(this).parents('.pet-item').attr('id'));
                    fieldName = $(this).data('field'); // you can ignore data-field
                    fieldData = $(this).text();
                    aptData[whichID][fieldName] = fieldData;
                   
                });
            }  //complete
        }); //load template
    }
    //READ DATA
    $.ajax({
        url : 'js/data.json',
        method :  'GET',
        data: {

        }}
    ).done(function(data){
        aptData = data;
        displayData = data;
        listAppointments(displayData);
        
    });
    //EVENTS

    //click on a dropdown
    $('.apt-addheading').on('click', function () {
        $('.card-body').toggle(300);
    });

    $('.sort-menu .dropdown-item').on('click', function (){
        var sortDropDown = $(this).attr('id');
        switch(sortDropDown){
        
            case 'sort-petName':
                $('.sort-by').removeClass('active');
                sortBy = 'petName';
                break;
            case 'sort-ownerName':
                $('.sort-by').removeClass('active');
                sortBy = 'ownerName';
                break;
            case 'sort-aptDate':
                $('.sort-by').removeClass('active');
                sortBy = 'aptDate';
                break;
            case 'sort-asc':
                $('.sort-dir').removeClass('active');
                sortDir = 'asc';
                break;
            case 'sort-desc':
                $('.sort-dir').removeClass('active');
                sortDir = 'desc';
                break;

        }

        $(this).addClass('active');
        listAppointments(displayData);
    });

    //Typed in search box

    $('#SearchApts').keyup(function(){

        var searchText = $(this).val();
        displayData = _.filter(aptData, function(item){
            return (item.petName.toLowerCase().match(searchText.toLowerCase())) ||
                   item.ownerName.toLowerCase().match(searchText.toLowerCase()) ||
                   item.aptNotes.toLowerCase().match(searchText.toLowerCase())
            ;
        });
        listAppointments(displayData);
    });

    $('#aptForm').submit(function(e){
        var newItem = {};
        e.preventDefault();

        newItem.petName = $('#petName').val();
        newItem.ownerName = $('#ownerName').val();
        newItem.aptDate = $('#aptDate').val();
        newItem.aptNotes = $('#aptNotes').val();

        aptData.push(newItem);
        listAppointments(displayData);
        $('#aptForm')[0].reset();
        $('.card-body').hide(300);
    });


}); //Document is ready


