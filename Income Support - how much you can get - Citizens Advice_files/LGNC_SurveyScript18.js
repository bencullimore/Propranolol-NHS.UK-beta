var strBuiltSurvey = "";
var intStartQuestionID;
var intWidth;
var intLowestPriorityScore = 4;
var intSavedIsTest;

var SurveyGetNext_xmlHttp;

function ChangeImageSource(elImage, strImAddress) {

    elImage.src = strImAddress;
}

function SubmitEnquiry() {

    var strName = document.getElementById("RequestorName").value
    var strContact = document.getElementById("ContactDets").value

    strBuiltEnquiry = "Name: " + strName + "<br><b>Contact: " + strContact + "</b><p>" + strBuiltEnquiry;

    SurveyGetNext_xmlHttp = GetXmlHttpObject();

    var url = "./API/LGNC_SubmitNewEnquiry.php";

    var params = "NM=strName";
    params = params + "&TXT=" + encodeURIComponent(strBuiltEnquiry);
    params = params + "&SKL=" + strSkillsMarker;
    params = params + "&P=" + intLowestPriorityScore;


    SurveyGetNext_xmlHttp.open("POST", url, true);

    //Send the proper header information along with the request
    SurveyGetNext_xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    SurveyGetNext_xmlHttp.setRequestHeader("Content-length", params.length);
    SurveyGetNext_xmlHttp.setRequestHeader("Connection", "close");

    SurveyGetNext_xmlHttp.onreadystatechange = EnquirtSubmit_stateChanged;
    SurveyGetNext_xmlHttp.send(params);


    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[2]) != "undefined"){
        HTML = HTML +jsText[2];
    }
    HTML = HTML +'</p>';

    document.getElementById("EnquiryQuestions").innerHTML = HTML;

}

function EnquirtSubmit_stateChanged() {
    if (SurveyGetNext_xmlHttp.readyState == 4) {

        if (document.getElementById("EnquiryQuestions").innerHTML = SurveyGetNext_xmlHttp.responseText == '1') {
            //var HTML = '<p class="surveytitle" >Thank you.  Your enquiry has been successfully submitted.  We will try to respond within 24 hours.</p>';
            var HTML = '<p class="surveytitle" >';
            if (typeof(jsText[3]) != "undefined"){
               HTML = HTML +jsText[3];
            }
            HTML = HTML +'</p>';
        }
        else {
            //var HTML = '<p class="surveytitle" >Sorry - there has been an error.  Your enquiry could not be submitted.</p>';
           var HTML = '<p class="surveytitle" >';
            if (typeof(jsText[4]) != "undefined"){
               HTML = HTML +jsText[4];
            }
            HTML = HTML +'</p>';

        }
        document.getElementById("EnquiryQuestions").innerHTML = SurveyGetNext_xmlHttp.responseText;


    }
}

function SaveSummaryAndGetSubmit() {

    var strText = document.getElementById("requestinfo").value


    strBuiltEnquiry = strBuiltEnquiry + "<p>" + strText;

    //var HTML = '<p class="surveytitle" >Thank you.  Please conplete the contact information below and click Submit.</p>';
    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[5]) != "undefined"){
        HTML = HTML +jsText[5];
    }
    HTML = HTML +'</p>';


    //HTML = HTML + '<p class="fieldtitles" ><label for="RequestorName">Your name</label></p>';
    
    var HTML = '<p class="fieldtitles" ><label for="RequestorName">';
    if (typeof(jsText[26]) != "undefined"){
        HTML = HTML +jsText[26];
    }
    HTML = HTML +'</label></p>';
     
    HTML = HTML + '<input type="text" name="RequestorName" id="RequestorName" size="20" value="" ><br>';
    
    //HTML = HTML + '<p class="fieldtitles" ><label for="ContactDets">Your email address</label></p>';
    var HTML = '<p class="fieldtitles" ><label for="ContactDets">';
    if (typeof(jsText[27]) != "undefined"){
        HTML = HTML +jsText[27];
    }
    HTML = HTML +'</label></p>';
    
    
    HTML = HTML + '<input type="text" name="ContactDets" id="ContactDets" size="20" value="" ><br>';

    HTML = HTML + '<p><button type="button" class="btn btn-primary" alt="Submit"  onclick="SubmitEnquiry()">'+jsText[62]+'</button>';
    HTML = HTML + '<p><button type="button" class="btn btn-primary" alt="Start New Enquiry"  onclick="RestartEnquiry()">'+jsText[63]+'</button>';


    document.getElementById("EnquiryQuestions").innerHTML = HTML;


}


function GetSurveyQuestion(intSurveyInstanceID, strUID, intQuestionID, intQuestionType, intCountLoop, intChatLink, intChatID) {


    var strAnswerString = "";
    if (intQuestionType == '2') {
        var SelText = document.getElementById("FTAnswer").value;

        var intAnswerID = -1;

    }

    if (intQuestionType == '0') {
        var Ob = document.getElementById("SurveyResp");

        if (Ob.selectedIndex == '0') {
            //alert("Please select one of the answers from the drop down box");
            if (typeof(jsText[6]) != "undefined"){
                alert(jsText[6]);
            }
            return;
        }

        var SelText = Ob.options[Ob.selectedIndex].text;
        var val = Ob.options[Ob.selectedIndex].value;

        var arr = val.split("|");

        var intAnswerID = arr[1];
        var intPriorityRating = arr[0];

    }


    if (intQuestionType == '1') {
        
        var SelText = "";
        var intAnswerID = 0;

        var intLowestChkPriority = 100;
        var intChkPriorityAnswerID = 0;

        var strOptionsChecked = "";

        var intCurLowest = 100;
        
        var contChecked = 0;
        
        

        for (var i = 1; i < intCountLoop; i++) {
            var strChkName = "chkA" + i;

            var ObChk = document.getElementById(strChkName);
            
            
            if (ObChk.checked) {
                
                if(contChecked>0){
                    SelText = SelText + ",";
                }
                
                var val = ObChk.value;
                var arr = val.split("|");
                var intChkAnswerID = arr[1];
                var intChkPriorityRating = arr[0];
                if (intChkPriorityRating < intCurLowest) {
                    intCurLowest = intChkPriorityRating;
                    intAnswerID = intChkAnswerID;
                }
                var strText = arr[2];
                strAnswerString = strAnswerString + intChkAnswerID + ",";
                SelText = SelText + strText;
                contChecked++;
            }


        }

        if (intCurLowest < intLowestChkPriority) {
            intLowestChkPriority = intChkPriorityRating;
        }


        if (intAnswerID == '0') {
            alert("Please check at least one of the answers shown");
            return;
        }

        if (intLowestChkPriority < intLowestPriorityScore) {
            intLowestPriorityScore = intLowestChkPriority;
        }

    }


    SurveyGetNext_xmlHttp = GetXmlHttpObject();
    if (SurveyGetNext_xmlHttp == null) {
        //alert("We're sorry but your browser does not support AJAX.  This web chat service requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
        if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        }
        return;
    }

    var url = "./API/LGNF_GetSurveyQuestion.php";

    var params = "AID=" + intAnswerID;
    params = params + "&QID=" + intQuestionID;
    params = params + "&SIID=" + intSurveyInstanceID;
    params = params + "&UID=" + strUID;
    params = params + "&TXT=" + encodeURIComponent(SelText);
    params = params + "&AST=" + strAnswerString;
    params = params + "&TEST=" + intSavedIsTest;

    params = params + "&CHATL=" + intChatLink;
    params = params + "&CHATID=" + intChatID;

    SurveyGetNext_xmlHttp.open("POST", url, true);

    //Send the proper header information along with the request
    SurveyGetNext_xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    SurveyGetNext_xmlHttp.setRequestHeader("Content-length", params.length);
    SurveyGetNext_xmlHttp.setRequestHeader("Connection", "close");

    SurveyGetNext_xmlHttp.onreadystatechange = GetNext_stateChanged;
    SurveyGetNext_xmlHttp.send(params);

    //var HTML = '<p class="surveytitle" >Please wait.  Next queston is now loading....</p>';
    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[9]) != "undefined"){
       HTML = HTML +jsText[9];
    }
    HTML = HTML +'</p>';
    
    document.getElementById("EnquiryQuestions").innerHTML = HTML;

}

function ReStartNewEnquiryT(intFirstQuestionID, strFirstQuestionText, intQuestionType, intCountLoop) {
    StartNewEnquiryT(intFirstQuestionID, strFirstQuestionText, strSkillsMarker, intWidth, intQuestionType, intCountLoop);
}


function PolicyCheckStartNewSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest) {
    intSavedIsTest = intIsTest;
    if (document.getElementById("chkpol").checked) {
    }
    else {
        //alert("Please check the box to confirm that you agree with our data policy.  Thank you.");
        if (typeof(jsText[1]) != "undefined"){
            alert(jsText[1]);
        }
        return;
    }


    StartNewSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest);
}

function StartNewSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest) {


    intSavedIsTest = intIsTest;
    intLowestPriorityScore = 4;

    strBuiltSurvey = "";


    //var HTML = '<p class="surveytitle" >Please wait.  The Survey is now starting...</p>';
    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[10]) != "undefined"){
       HTML = HTML +jsText[10];
    }
    HTML = HTML +'</p>';
    document.getElementById("EnquiryQuestions").innerHTML = HTML;


    SurveyGetNext_xmlHttp = GetXmlHttpObject();
    if (SurveyGetNext_xmlHttp == null) {
        //alert("We're sorry but your browser does not support AJAX.  This web chat service requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
        if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        }
        return;
    }

    var url = "./API/LGNF_GetSurveyQuestion.php";
    var params = "SID=" + intSurveyID;
    params = params + "&STID=" + intSurveyTemplateID;
    params = params + "&RBID=" + intRoadblockID;
    params = params + "&PURL=" + encodeURIComponent(strPURL);
    params = params + "&DT=" + intDeliveryType;
    params = params + "&UID=" + strUID;
    params = params + "&TEST=" + intSavedIsTest;

    SurveyGetNext_xmlHttp.open("POST", url, true);

    //Send the proper header information along with the request
    SurveyGetNext_xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    SurveyGetNext_xmlHttp.setRequestHeader("Content-length", params.length);
    SurveyGetNext_xmlHttp.setRequestHeader("Connection", "close");

    SurveyGetNext_xmlHttp.onreadystatechange = GetNext_stateChanged;
    SurveyGetNext_xmlHttp.send(params);

}

function PolicyCheckStartPreChatNewSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest) {
    intSavedIsTest = intIsTest;
    if (document.getElementById("chkpol").checked) {
    }
    else {
        alert("Please check the box to confirm that you agree with our data policy.  Thank you.");
        return;
    }


    StartNewPreChatSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest);
}

function PolicyCheckStartPostChatNewSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest, intChatSessionID) {


    intSavedIsTest = intIsTest;
    if (document.getElementById("chkpol").checked) {
    }
    else {
        //alert("Please check the box to confirm that you agree with our data policy.  Thank you.");
        if (typeof(jsText[1]) != "undefined"){
            alert(jsText[1]);
        }
        return;
    }


    StartNewPostChatSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest, intChatSessionID);
}


function StartNewPostChatSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest, intChatSessionID) {


    intSavedIsTest = intIsTest;
    intLowestPriorityScore = 4;

    strBuiltSurvey = "";

    //var HTML = '<p class="surveytitle" >Please wait.  The Survey is now starting...</p>';
    
    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[10]) != "undefined"){
       HTML = HTML +jsText[10];
    }
    HTML = HTML +'</p>';
    
    
    document.getElementById("EnquiryQuestions").innerHTML = HTML;

    SurveyGetNext_xmlHttp = GetXmlHttpObject();
    if (SurveyGetNext_xmlHttp == null) {
        if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        }
        return;
    }

    var url = "./API/LGNF_GetSurveyQuestion.php";
    var params = "SID=" + intSurveyID;
    params = params + "&STID=" + intSurveyTemplateID;
    params = params + "&RBID=" + intRoadblockID;
    params = params + "&PURL=" + encodeURIComponent(strPURL);
    params = params + "&DT=" + intDeliveryType;
    params = params + "&UID=" + strUID;
    params = params + "&TEST=" + intSavedIsTest;

    params = params + "&CHATL=2";
    params = params + "&CHATID=" + intChatSessionID;

    SurveyGetNext_xmlHttp.open("POST", url, true);

    //Send the proper header information along with the request
    SurveyGetNext_xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    SurveyGetNext_xmlHttp.setRequestHeader("Content-length", params.length);
    SurveyGetNext_xmlHttp.setRequestHeader("Connection", "close");

    SurveyGetNext_xmlHttp.onreadystatechange = GetNext_stateChanged;
    SurveyGetNext_xmlHttp.send(params);

}


function StartNewPreChatSurvey(intSurveyID, intSurveyTemplateID, intRoadblockID, strPURL, intDeliveryType, strUID, intIsTest) {


    intSavedIsTest = intIsTest;
    intLowestPriorityScore = 4;

    strBuiltSurvey = "";

    //var HTML = '<p class="surveytitle" >Please wait.  The Survey is now starting...</p>';
    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[10]) != "undefined"){
       HTML = HTML +jsText[10];
    }
    HTML = HTML +'</p>';
    
    
    document.getElementById("EnquiryQuestions").innerHTML = HTML;

    SurveyGetNext_xmlHttp = GetXmlHttpObject();
    if (SurveyGetNext_xmlHttp == null) {
        if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        }
        return;
    }

    var url = "./API/LGNF_GetSurveyQuestion.php";
    var params = "SID=" + intSurveyID;
    params = params + "&STID=" + intSurveyTemplateID;
    params = params + "&RBID=" + intRoadblockID;
    params = params + "&PURL=" + encodeURIComponent(strPURL);
    params = params + "&DT=" + intDeliveryType;
    params = params + "&UID=" + strUID;
    params = params + "&TEST=" + intSavedIsTest;

    params = params + "&CHATL=1";
    params = params + "&CHATID=0";

    SurveyGetNext_xmlHttp.open("POST", url, true);

    //Send the proper header information along with the request
    SurveyGetNext_xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    SurveyGetNext_xmlHttp.setRequestHeader("Content-length", params.length);
    SurveyGetNext_xmlHttp.setRequestHeader("Connection", "close");

    SurveyGetNext_xmlHttp.onreadystatechange = GetNext_stateChanged;
    SurveyGetNext_xmlHttp.send(params);

}


function GetNext_stateChanged() {
    if (SurveyGetNext_xmlHttp.readyState == 4) {
        document.getElementById("EnquiryQuestions").innerHTML = SurveyGetNext_xmlHttp.responseText;

    }
}


function RestartEnquiry() {
    strBuiltEnquiry = "";
    intLowestPriorityScore = 4;

    var url = "./API/LGNC_GetFirstQuestionHTMLt.php";
    url = url + "?QID=" + intStartQuestionID;

    SurveyGetNext_xmlHttp.onreadystatechange = GetNext_stateChanged;
    SurveyGetNext_xmlHttp.open("GET", url, true);
    SurveyGetNext_xmlHttp.send(null);
}

function GetXmlHttpObject() {
    var xmlHttp = null;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    }
    catch (e) {
        // Internet Explorer
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}
