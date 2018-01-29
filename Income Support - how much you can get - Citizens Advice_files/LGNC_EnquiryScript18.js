var strBuiltEnquiry = "";
var intStartQuestionID;
var intWidth;
var strSkillsMarker;
var intLowestPriorityScore = 4;
var intAssignedSkillID = 0;

function SubmitEnquiry() {

    var strName = document.getElementById("RequestorName").value
    var strContact = document.getElementById("ContactDets").value

    var atpos = strContact.indexOf("@");
    var dotpos = strContact.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= strContact.length) {

         if (typeof(jsText[16]) != "undefined"){
            alert(jsText[16]);
        } else {
            alert("Please enter a valid email address.");
        }
     

        return false;
    }

    strBuiltEnquiry = "Name: " + encodeURIComponent(strName) + "<br><b>Contact: " + encodeURIComponent(strContact) + "</b><p>" + strBuiltEnquiry;

    SurveyGetNext_xmlHttp = GetXmlHttpObject();

    var url = "./API/LGNC_SubmitNewEnquiry.php";

    var params = "NM=" + encodeURIComponent(strName);
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


    //var HTML = '<p class="surveytitle" >Please wait while your enquiry is submitted.</p>';
    
    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[2]) != "undefined"){
       HTML = HTML +jsText[2];
    } else {
        HTML = HTML + "Please wait while your enquiry is submitted.";
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
                } else {
                   HTML = HTML + "Thank you.  Your enquiry has been successfully submitted.  We will try to respond within 24 hours.";
                }
                HTML = HTML +'</p>';  
        }
        else {
            //var HTML = '<p class="surveytitle" >Sorry - there has been an error.  Your enquiry could not be submitted.</p>';
            var HTML = '<p class="surveytitle" >';
            if (typeof(jsText[4]) != "undefined"){
               HTML = HTML +jsText[4];
            } else {
               HTML = HTML + "Sorry - there has been an error.  Your enquiry could not be submitted.";
            }
            HTML = HTML +'</p>';
        }
      
        document.getElementById("EnquiryQuestions").innerHTML = SurveyGetNext_xmlHttp.responseText;


    }
}




function SaveSummaryAndGetSubmit() {

    var strText = document.getElementById("requestinfo").value


    strBuiltEnquiry = strBuiltEnquiry + "<p>" + escape(strText);

    //var HTML = '<p class="surveytitle" >Thank you. Please conplete the contact information below and click Submit.</p>';
    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[5]) != "undefined"){
       HTML = HTML +jsText[5];
    } else {
       HTML = HTML + "Thank you. Please conplete the contact information below and click Submit.";
    }
    HTML = HTML +'</p>';
    
    
    
    //HTML = HTML + '<p class="fieldtitles" ><label for="RequestorName">Your name</label></p>';
    HTML = HTML + '<p class="fieldtitles" ><label for="RequestorName">';
    if (typeof(jsText[26]) != "undefined"){
       HTML = HTML +jsText[26];
    } else {
       HTML = HTML + "Your name";
    }
    HTML = HTML +'</label></p>';
    
    
    HTML = HTML + '<input type="text" name="RequestorName" id="RequestorName" size="20" value="" ><br>';
    
    
    
    //HTML = HTML + '<p class="fieldtitles" ><label for="ContactDets">Your email address</label></p>';
    HTML = HTML + '<p class="fieldtitles" ><label for="ContactDets">';
    if (typeof(jsText[27]) != "undefined"){
       HTML = HTML +jsText[27];
    } else {
       HTML = HTML + "Your email address";
    }
    HTML = HTML +'</label></p>';
    
    
    
    HTML = HTML + '<input type="text" name="ContactDets" id="ContactDets" size="20" value="" ><br>';

    HTML = HTML + '<p><button type="button" class="btn btn-primary" alt="Submit"  onclick="SubmitEnquiry()">'+jsText[62]+'</button>';
    HTML = HTML + '<p><button type="button" class="btn btn-primary" alt="Start New Enquiry"  onclick="RestartEnquiry()">'+jsText[63]+'</button>';

    document.getElementById("EnquiryQuestions").innerHTML = HTML;


}






function SaveAnswerAndGetNextQuestion(intFirstQuestionID, strFirstQuestionText, intQuestionType, intCountLoop) {


    if (intQuestionType == '2') {
        var SelText = document.getElementById("FTAnswer").value;

        var intAnswerID = -1;

        strBuiltEnquiry = strBuiltEnquiry + "<br>" + escape(strFirstQuestionText) + ": " + escape(SelText);


    }

    if (intQuestionType == '0') {
        var Ob = document.getElementById("SurveyResp");

        if (Ob.selectedIndex == '0') {
             if (typeof(jsText[6]) != "undefined"){
               alert(jsText[6]);
            } else {
               alert("Please select one of the answers from the drop down box"); 
            }
            return;
        }

        var SelText = Ob.options[Ob.selectedIndex].text;
        var val = Ob.options[Ob.selectedIndex].value;


        var arr = val.split("|");

        var intAnswerID = arr[1];
        var intPriorityRating = arr[0];
        var intCurAssignedSkillID = arr[3];

        if (intCurAssignedSkillID != '0') {
            strSkillsMarker = "|" + intCurAssignedSkillID + "|";
        }

        if (intPriorityRating < intLowestPriorityScore) {
            intLowestPriorityScore = intPriorityRating;
        }

        strBuiltEnquiry = strBuiltEnquiry + "<br>" + escape(strFirstQuestionText) + ": " + escape(SelText);


    }


    if (intQuestionType == '1') {

        var intAnswerID = 0;
        var intLowestChkPriority = 100;
        var intChkPriorityAnswerID = 0;

        var strOptionsChecked = "";


        for (var i = 1; i < intCountLoop; i++) {
            var strChkName = "chkA" + i;

            var ObChk = document.getElementById(strChkName);

            if (ObChk.checked) {
                var val = ObChk.value;
                var arr = val.split("|");

                var intChkAnswerID = arr[1];
                var intChkPriorityRating = arr[0];
                var strText = arr[2];
                var intCurAssignedSkillID = arr[3];

                if (intCurAssignedSkillID != '0') {
                    strSkillsMarker = "|" + intCurAssignedSkillID + "|";
                }


                if (intChkPriorityRating < intLowestChkPriority) {
                    intLowestChkPriority = intChkPriorityRating;
                    intAnswerID = intChkAnswerID;
                }


                strOptionsChecked = strOptionsChecked + strText + ";";
            }

        }

        if (intAnswerID == '0') {
            if (typeof(jsText[7]) != "undefined"){
                alert(jsText[7]);
            } else {
                alert("Please check at least one of the answers shown");
            }
            return;
        }

        if (intLowestChkPriority < intLowestPriorityScore) {
            intLowestPriorityScore = intLowestChkPriority;
        }

        strBuiltEnquiry = strBuiltEnquiry + "<br>" + escape(strFirstQuestionText) + ": " + strOptionsChecked;

    }


    //var HTML = '<p class="surveytitle" >Please wait.  Next queston is now loading....</p>';
    
     var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[9]) != "undefined"){
       HTML = HTML +jsText[9];
    } else {
        HTML = HTML + "Please wait.  Next queston is now loading...";
    }
    HTML = HTML +'</p>';
    
    
    document.getElementById("EnquiryQuestions").innerHTML = HTML;

    SurveyGetNext_xmlHttp = GetXmlHttpObject();
    if (SurveyGetNext_xmlHttp == null) {
         if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        } else {
            alert("We're sorry but your browser does not support AJAX.  This web chat service requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
        }
        return;
    }

    var url = "./API/LGNC_GetNextQuestionHTMLt.php";
    url = url + "?AID=" + intAnswerID;
    url = url + "&QID=" + intFirstQuestionID;


    SurveyGetNext_xmlHttp.onreadystatechange = GetNext_stateChanged;
    SurveyGetNext_xmlHttp.open("GET", url, true);
    SurveyGetNext_xmlHttp.send(null);

}

function ReStartNewEnquiryT(intFirstQuestionID, strFirstQuestionText, intQuestionType, intCountLoop) {
    StartNewEnquiryT(intFirstQuestionID, strFirstQuestionText, strSkillsMarker, intWidth, intQuestionType, intCountLoop);
}

function PolicyCheckStartNewEnquiryT(intFirstQuestionID, strFirstQuestionText, strSkill, intFormWidth, intQuestionType, intCountLoop) {

    if (document.getElementById("chkpol").checked) {
    }
    else {
        if (typeof(jsText[29]) != "undefined"){
            alert(jsText[29]);
        } else {
            alert("Please check the consent box.  Thank you.");
        }
        return;
    }


    StartNewEnquiryT(intFirstQuestionID, strFirstQuestionText, strSkill, intWidth, intQuestionType, intCountLoop);
}


function StartNewEnquiryT(intFirstQuestionID, strFirstQuestionText, strSkill, intFormWidth, intQuestionType, intCountLoop) {


    intLowestPriorityScore = 4;

    strBuiltEnquiry = "";
    intStartQuestionID = intFirstQuestionID;

    intWidth = intFormWidth;
    strSkillsMarker = strSkill;

    if (intQuestionType == '2') {
        var SelText = document.getElementById("FTAnswer").value;

        var intAnswerID = -1;

        strBuiltEnquiry = escape(strFirstQuestionText) + ": " + escape(SelText);


    }

    if (intQuestionType == '0') {
        var Ob = document.getElementById("SurveyResp");

        if (Ob.selectedIndex == '0') {
             if (typeof(jsText[6]) != "undefined"){
                alert(jsText[6]);
            } else {
                alert("Please select one of the answers from the drop down box");
            }
            return;
        }

        var SelText = Ob.options[Ob.selectedIndex].text;
        var val = Ob.options[Ob.selectedIndex].value;

        var arr = val.split("|");

        var intAnswerID = arr[1];
        var intPriorityRating = arr[0];
        var intCurAssignedSkillID = arr[3];

        if (intCurAssignedSkillID != '0') {
            strSkillsMarker = "|" + intCurAssignedSkillID + "|";
        }


        if (intPriorityRating < intLowestPriorityScore) {
            intLowestPriorityScore = intPriorityRating;
        }

        strBuiltEnquiry = escape(strFirstQuestionText) + ": " + escape(SelText);


    }


    if (intQuestionType == '1') {

        var intAnswerID = 0;
        var intLowestChkPriority = 100;
        var intChkPriorityAnswerID = 0;

        strBuiltEnquiry = escape(strFirstQuestionText) + ": ";

        for (var i = 1; i < intCountLoop; i++) {
            var strChkName = "chkA" + i;

            var ObChk = document.getElementById(strChkName);

            if (ObChk.checked) {
                var val = ObChk.value;
                var arr = val.split("|");

                var intChkAnswerID = arr[1];
                var intChkPriorityRating = arr[0];
                var strText = arr[2];
                var intCurAssignedSkillID = arr[3];

                if (intCurAssignedSkillID != '0') {
                    strSkillsMarker = "|" + intCurAssignedSkillID + "|";
                }

                if (intChkPriorityRating < intLowestChkPriority) {
                    intLowestChkPriority = intChkPriorityRating;
                    intAnswerID = intChkAnswerID;
                }


                strBuiltEnquiry = strBuiltEnquiry + strText + ";";
            }

        }

        if (intAnswerID == '0') {
            if (typeof(jsText[7]) != "undefined"){
                alert(jsText[7]);
            } else {
                alert("Please check at least one of the answers shown");
            }
            return;
        }

        if (intLowestChkPriority < intLowestPriorityScore) {
            intLowestPriorityScore = intLowestChkPriority;
        }

    }


     //var HTML = '<p class="surveytitle" >Please wait.  The Enquiry Builder is now starting</p>';
    var HTML = '<p class="surveytitle" >';
    if (typeof(jsText[30]) != "undefined"){
       HTML = HTML +jsText[30];
    } else {
        TML = HTML + "Please wait.  The Enquiry Builder is now starting";
    }
    HTML = HTML +'</p>';
    
    document.getElementById("EnquiryQuestions").innerHTML = HTML;

    SurveyGetNext_xmlHttp = GetXmlHttpObject();
    if (SurveyGetNext_xmlHttp == null) {
        if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        } else {
            alert("We're sorry but your browser does not support AJAX.  This web chat service requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
        }
        return;
    }

    var url = "./API/LGNC_GetNextQuestionHTMLt.php";
    url = url + "?AID=" + intAnswerID;
    url = url + "&QID=" + intFirstQuestionID;


    SurveyGetNext_xmlHttp.onreadystatechange = GetNext_stateChanged;
    SurveyGetNext_xmlHttp.open("GET", url, true);
    SurveyGetNext_xmlHttp.send(null);


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
