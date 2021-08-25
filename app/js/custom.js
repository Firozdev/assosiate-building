/*
 * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget 
 */

ZOHO.embeddedApp.on("PageLoad", function(pageData) {
    const findButton = document.getElementById('find-button').addEventListener("click",function(){
        document.getElementById('errorConsole').innerHTML = '';
        const zipCodeValue = document.getElementById('ZipCode').value;
        ZOHO.CRM.API.getAllRecords({Entity:"Buildings",sort_order:"asc"})
.then(function(recordsCount){
   const count = recordsCount.data;
   let counter = 0;
   for(let i = 0; i < count.length; i++){
           counter++;
   }
   const loopSTr =  Math.ceil(counter / 200);
   for(var i = 1; i <= loopSTr; i++ ){
    ZOHO.CRM.API.searchRecord({Entity:"Buildings",Type:"criteria",Query:"(Service_Zip_Postal_Code:equals:"+zipCodeValue+")"})
    .then(function(searchResult){
       //const recordsArray = searchResult.data;
       if(searchResult.data != undefined){
        document.getElementById('duplicate-table').classList.remove('d-none');
        let tableRow = '';
        searchResult.data.forEach(record => {
           const recordZip =  record.Service_Zip_Postal_Code;
           const recordID =  record.id;
           const recordCompany = record.Name;
           const recordStreetAddress = record.Service_Street;
           tableRow += '<tr>';
           tableRow += `<td><input class="checkRec" recId ="${recordID}" type="checkbox"></td>`;
           tableRow += `<td>${recordID}</td>`;
           tableRow += `<td>${recordCompany}</td>`;
           tableRow += `<td>${recordStreetAddress}</td>`;
           tableRow += `<td>${recordZip}</td>`;
           tableRow += '</tr>';
        });
        document.getElementById('tablebBodyContent').innerHTML = tableRow;
       }else{
        document.getElementById('duplicate-table').classList.add('d-none');
        document.getElementById('errorConsole').innerHTML = `<p class="text-danger" id="errorMassage">Any Record Not Matched !</p>`;

       }
    })
   }
})
        
    });

    $("body").on("click",".checkRec",function(){
        $(".checkRec").not(this).prop("checked",false);
        const allCheckdOrNot = document.querySelector('.checkRec:checked');
        if(allCheckdOrNot && allCheckdOrNot.value == "on"){
            document.getElementById('assosiate-btn').classList.remove("disabled","bg-secondary");
            document.getElementById('assosiate-btn').classList.add("btn-outline-primary");
            
        }else{
            document.getElementById('assosiate-btn').classList.add("disabled","bg-secondary");
            document.getElementById('assosiate-btn').classList.remove("btn-outline-primary");
            document.getElementById('updateLogArea').classList.add('d-none');
        }
        
    })
    document.getElementById('assosiate-btn').addEventListener("click",function(){
        let entityID = (pageData.EntityId[0]);
        var checkedValue = document.querySelector('.checkRec:checked').getAttribute("recId");
        var config={
            Entity:"Contacts",
            APIData:{
                  "id": entityID,
                  "Building1": checkedValue,
            },
            Trigger:["workflow"]
          }
          ZOHO.CRM.API.updateRecord(config)
          .then(function(updateRec){
              if(updateRec.data[0].code = "SUCCESS"){
                document.getElementById('updateLogArea').classList.remove("d-none");
                document.getElementById('updateLogArea').innerHTML = `<p class="text-success">Building is assosiate successfully !</p>`;
              }else{
                  console.log("error dekao")
              }
              
          })

    });
    /*
     * Verify if EntityInformation is Passed 
     */

});

//main function
    //main function
/*
 * initialize the widget.
 */
ZOHO.embeddedApp.init();