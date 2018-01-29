
var intFollowSurveyBuilt = 0;

var intRandomSessionReference = -100;

var intFormWidthToSave = 250;

var storedparams;
var st;
var SessionStatus_xmlHttp;
var SessionContent_xmlHttp;
var SessionResponse_xmlHttp;
var SendEmailCopy_xmlHttp;
var AutoContent_xmlHttp;
var intStatusRefreshFlag = 0;
var intContentRefreshFlag = 0;
var intCheckAutoOpenFlag = 0;

var intChatFormuIsBuilt = 0;

var intKeyPressCounter = 0;


var TxtStore = "";

strTextColour = "#000000";

var intSurveyRequirement = 0;

var chatClientWidowModified = false;




function SubmitSurvey() {
    intSurveyRequirement = 10;

    SessionResponse_xmlHttp = GetXmlHttpObject();
    if (SessionResponse_xmlHttp == null) {
        
        if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        } else {
            alert ("We're sorry but your browser does not support AJAX.  This web chat service requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
        }
     
        return;
    }

    var url = "./API/LGNC_SubmitSessionSurvey2.php";

    var params = storedparams;
    for(var i = 1; i < 6; i++){
        var questionId = "question" + i;
        var question = document.getElementById(questionId);
        if(question != null){
            var selected = question.value;
            var strSelected = question.options[selected].text;
            params += '&Q'+ i + '=' + strSelected;
        }
    }

    if (intRandomSessionReference != -100) {
        params = params + "&RSID=" + intRandomSessionReference;
    }

    SessionResponse_xmlHttp.open("POST", url, true);

    //Send the proper header information along with the request
    SessionResponse_xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    SessionResponse_xmlHttp.setRequestHeader("Content-length", params.length);
    SessionResponse_xmlHttp.setRequestHeader("Connection", "close");

    SessionResponse_xmlHttp.onreadystatechange = SessionResponse_stateChanged;
    SessionResponse_xmlHttp.send(params);

    if (typeof(jsText[11]) != "undefined"){
        strStatusMessage = jsText[11];
     } else {
        strStatusMessage = 'Thank You. Sending...';
     }

    var HTML = '<span class="statusmessage" >' + strStatusMessage + '</span><p>';
    document.getElementById("ConversationAlerts").innerHTML = HTML;

}

function SessionResponse_stateChanged()
{
if (SessionResponse_xmlHttp.readyState==4)
  {

     if (typeof(jsText[12]) != "undefined"){
        strStatusMessage = jsText[12];
     } else {
        strStatusMessage = 'Thank You.';
     }

    var HTML = '<span class="statusmessage" >'+strStatusMessage+'</span><p>';
    document.getElementById("ConversationAlerts").innerHTML=HTML;
    
    intSurveyRequirement = 10;
  }
}

function PostChatSurveyOptions()
{

    if (typeof(jsText[12]) != "undefined"){
        strStatusMessage = jsText[12];
     } else {
        strStatusMessage = 'Thank You.';
     }

    var HTML = '<span class="statusmessage" >'+strStatusMessage+'</span><p>';
    document.getElementById("ConversationAlerts").innerHTML=HTML;

    intSurveyRequirement = 10;

}


function StartRefreshCycle(strParams, intSurveyOnEnd, strTextHexColour, intNewSessionID, intActualFormWidth)
{

   intFormWidthToSave = intActualFormWidth;

   intRandomSessionReference = intNewSessionID;
   
   strTextColour = strTextHexColour;

   intStatus = 1;
   intSurveyRequirement = intSurveyOnEnd;

   storedparams = strParams;
   RefreshRequestor();
   

}

function RefreshRequestor()
{
  RefreshSessionStatus();
  BuildSelectedSessionContent();
  CheckForAutoOpen();
  st=setTimeout('RefreshRequestor()',1500);

}

function CheckForAutoOpen()
{
     if(intCheckAutoOpenFlag == 0)
     {
     intCheckAutoOpenFlag = 1;
     AutoContent_xmlHttp=GetXmlHttpObject();
     if (AutoContent_xmlHttp==null)
     {
             if (typeof(jsText[8]) != "undefined"){
                 alert(jsText[8]);
             } else {
                 alert ("We're sorry but your browser does not support AJAX.  The loGo_net commercials portal requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
             }
             return;
     }


     var url="./API/LGNC_GetSessionAutoOpen2.php";
     url = url+storedparams;
     if(intRandomSessionReference != -100)
     {
     url = url+"&RSID="+intRandomSessionReference;
     }

     AutoContent_xmlHttp.onreadystatechange=AutoOpen_stateChanged;
     AutoContent_xmlHttp.open("GET",url,true);
     AutoContent_xmlHttp.send(null);
    }

}


function AutoOpen_stateChanged()
{
if (AutoContent_xmlHttp.readyState==4)
  {
    OpenWindow = AutoContent_xmlHttp.responseText;

    if(OpenWindow != 'NONE')
    {
    }
     intCheckAutoOpenFlag = 0;
  }
}

function BuildSelectedSessionContent()
{
     if(intContentRefreshFlag == 0)
     {
     intContentRefreshFlag = 1;
     SessionContent_xmlHttp=GetXmlHttpObject();
     if (SessionContent_xmlHttp==null)
     {
            if (typeof(jsText[8]) != "undefined"){
                alert(jsText[8]);
            } else {
                alert ("We're sorry but your browser does not support AJAX.  The loGo_net commercials portal requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
            }
            return;
     }


     var url="./API/LGNC_GetSessionComments2.php";
     url = url+storedparams;
     if(intRandomSessionReference != -100)
     {
     url = url+"&RSID="+intRandomSessionReference;
     }


     SessionContent_xmlHttp.onreadystatechange=SessionContent_stateChanged;
     SessionContent_xmlHttp.open("GET",url,true);
     SessionContent_xmlHttp.send(null);
    }

}


function SessionContent_stateChanged()
{
if (SessionContent_xmlHttp.readyState==4)
  {

    if(TxtStore != SessionContent_xmlHttp.responseText)
    {


    var RawText = SessionContent_xmlHttp.responseText;
    RawText = RawText.replace("ECIWIDTHREQ", intFormWidthToSave);

    TxtStore = RawText;

    document.getElementById("SelectedSessionConversation").innerHTML = unescape(RawText);
    
    
    if (chatClientWidowModified==false){
        
        var clientHeight = document.getElementById('SelectedSessionConversation').clientHeight;
        var clientWidth = document.getElementById('SelectedSessionConversation').clientWidth;
        var clientTop = document.getElementById('SelectedSessionConversation').clientTop;
    
        if (clientHeight>100){
            document.getElementById('SelectedSessionConversation').setAttribute('style','height:'+clientHeight+'px !important; width:'+clientWidth+'px; top:'+clientTop+'px; background:#FFFFFF; border:solid 1px #0000ff; padding:4px; position:absolute; left:5px; overflow:auto;   ');
            chatClientWidowModified = true;
        }
    }
    
    
    
    scrollToBottom('SelectedSessionConversation') ;
    }
     intContentRefreshFlag = 0;
  }
}

function scrollToBottom(elm_id)
	{
	var elm = document.getElementById(elm_id);
	try
		{
		elm.scrollTop = elm.scrollHeight+20;
		}
	catch(e)
		{
		var f = document.createElement("input");
		if (f.setAttribute) f.setAttribute("type","text")
		if (elm.appendChild) elm.appendChild(f);
		f.style.width = "0px";
		f.style.height = "0px";
		if (f.focus) f.focus();
		if (elm.removeChild) elm.removeChild(f);
		}
	}


function PolicyCheck()
{
     if(document.getElementById("chkpol").checked)
     {
     }
     else
     {
        if (typeof(jsText[1]) != "undefined"){
                alert(jsText[1]);
        } else {
                alert ("Please check the box to confirm that you agree with our data policy.  Thank you.");
        }
        return;
     }
}




function RequSendMessage()
{


     intStatusRefreshFlag = 1;
     SessionStatus_xmlHttp=GetXmlHttpObject();
     if (SessionStatus_xmlHttp==null)
     {
        if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        } else {
            alert ("We're sorry but your browser does not support AJAX.  This web chat service requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
        }    
        return;
     }

    var url="./API/LGNC_SetSessionComment3.php";

     var params = storedparams;
     params=params+"&SRC=2";
     params=params+"&CMT="+encodeURIComponent(document.getElementById("text-content").value);

     if(intRandomSessionReference != -100)
     {
     params=params+"&RSID="+intRandomSessionReference;
     }

     SessionStatus_xmlHttp.open("POST", url, true);

         //Send the proper header information along with the request
         SessionStatus_xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         SessionStatus_xmlHttp.setRequestHeader("Content-length", params.length);
         SessionStatus_xmlHttp.setRequestHeader("Connection", "close");

     SessionStatus_xmlHttp.onreadystatechange=SessionStatus_stateChanged;
     SessionStatus_xmlHttp.send(params);

    //var HTML = '<span class="statusmessage" >Please wait. Sending...</span><p>';
    
    var HTML = '<span class="statusmessage" >';
    if (typeof(jsText[13]) != "undefined"){
       HTML = HTML +jsText[13];
    } else {
        HTML = HTML + "Please wait. Sending...";
    }
    HTML = HTML +'</span><p>';
    
    document.getElementById("ConversationAlerts").innerHTML=HTML;

    document.getElementById("text-content").value = "";

}




function RequEndSession()
{
  
  if (typeof(jsText[14]) != "undefined"){
       var r=confirm(jsText[14]);
  } else {
       var r=confirm("You are about to end this chat.  Please confirm.");
  }
  
  
  if (r==true)
  {

     intStatusRefreshFlag = 1;



     SessionStatus_xmlHttp=GetXmlHttpObject();
     var url="./API/LGNC_ChangeSessionStatus2.php";
     url = url+storedparams;
     url = url+"&OR=1";
     
     if(intRandomSessionReference != -100)
     {
     url = url+"&RSID="+intRandomSessionReference;
     }


     //var retHTML = '<span class="statusmessage" >Please wait. Ending...</span><p>';
     var retHTML = '<span class="statusmessage" >';
     if (typeof(jsText[28]) != "undefined"){
         retHTML = retHTML +jsText[28];
     } else {
         retHTML = retHTML + "Please wait. Ending...";
     }
     retHTML = retHTML +'</span><p>';
     
     
     document.getElementById("ConversationAlerts").innerHTML=retHTML;
     
     
     document.getElementById("EntryArea").innerHTML="";

     SessionStatus_xmlHttp.onreadystatechange=SessionStatus_stateChanged;
     SessionStatus_xmlHttp.open("GET",url,true);
     SessionStatus_xmlHttp.send(null);


  }


}


function KeyPressCheck(intKeyCode) {
	if (intKeyCode == 13) {
		RequSendMessage();
	} else {
		intKeyPressCounter = 9;
	}

}


function RefreshSessionStatus()
{

     if(intStatusRefreshFlag == 0)
     {

        intKeyPressCounter = intKeyPressCounter - 3;
        if (intKeyPressCounter < 0) {
            intKeyPressCounter = 0;
        }
        
        SessionStatus_xmlHttp=GetXmlHttpObject();

        var url="./API/LGNC_SessionStatus18.php";
        url = url+storedparams;

        if(intRandomSessionReference != -100)
        {
            url = url+"&RSID="+intRandomSessionReference;
        }
        url = url + "&CIST=" + intKeyPressCounter;
             
        SessionStatus_xmlHttp.onreadystatechange=SessionStatus_stateChanged;
        SessionStatus_xmlHttp.open("GET",url,true);
        SessionStatus_xmlHttp.send(null);
        intStatusRefreshFlag = 1;
     }
     
}

function ToggleChatBut()
{




     if(document.getElementById("chkpol").checked)
     {
     document.getElementById("SendRequest").style.display = 'block';
     document.getElementById("PolicyRequest").innerHTML = '';
     }
     else
     {
      document.getElementById("SendRequest").style.display = 'none';
      document.getElementById("PolicyRequest").innerHTML = '<button type="button" class="btn btn-primary" alt="Chat"  onclick="PolicyCheck()">'+jsText[57]+'</button>';

    }
}





function validateEmailAddress(strEnteredEmailAddress)
{

    var atpos = strEnteredEmailAddress.indexOf("@");
    var dotpos = strEnteredEmailAddress.lastIndexOf(".");
    if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=strEnteredEmailAddress.length) {
        return false;
    }
    
    return true;
}


function SendEmailCopy()
{

     var intPermGiven = 0;
     if(document.getElementById("chkFollow").checked)
     {
     intPermGiven = 1;
     }
     
     if(document.getElementById("RequestorEmail").value == "")
     {
        if (typeof(jsText[15]) != "undefined"){
            alert(jsText[15]);
        } else {
            alert("Please enter an email address.  Thank you.");
        }
        return;

     }

     if(!validateEmailAddress(document.getElementById("RequestorEmail").value))
     {
        //alert("Please enter a valid email address.  Thank you.");
        if (typeof(jsText[16]) != "undefined"){
            alert(jsText[16]);
        } else {
            alert("Please enter a valid email address.  Thank you.");
        }
        return;
     }

    SendEmailCopy_xmlHttp=GetXmlHttpObject();



    var url="./API/LGNC_EmailSessionComments.php";
    url = url+storedparams;

     if(intRandomSessionReference != -100)
     {
     url = url+"&RSID="+intRandomSessionReference;
     }


     url = url+"&IP="+intPermGiven;
     url = url+"&TEM="+document.getElementById("RequestorEmail").value;


     SendEmailCopy_xmlHttp.onreadystatechange=SendEmailCopy_stateChanged;
     SendEmailCopy_xmlHttp.open("GET",url,true);
     SendEmailCopy_xmlHttp.send(null);



    //var strButHTML = '<p class="bannermessage" >Thank you.  Please wait...saving and sending.</p>';
    var strButHTML = '<p class="bannermessage" >';
    if (typeof(jsText[17]) != "undefined"){
       strButHTML = strButHTML +jsText[17];
    } else {
       strButHTML = strButHTML + "Thank you.  Please wait...saving and sending.";
    }
    strButHTML = strButHTML +'</p>';
    
    


    document.getElementById("EmailCopyIns").innerHTML=strButHTML;
}

function SendEmailCopy_stateChanged()
{
  if (SendEmailCopy_xmlHttp.readyState==4)
  {

    document.getElementById("EmailCopyIns").innerHTML=SendEmailCopy_xmlHttp.responseText;
        
  }
}



function SessionStatus_stateChanged()
{
  if (SessionStatus_xmlHttp.readyState==4)
  {

        var strCurStatus = "|"+SessionStatus_xmlHttp.responseText+"|";
        var strStatusMessage = "";



        if(strCurStatus == '|1|')
        {
            strStatusMessage = 'Please wait.  An adviser will be with you soon...';
            if (typeof(jsText[18]) != "undefined"){
                strStatusMessage = jsText[18];
            } else {
                strStatusMessage = 'Please wait.  An adviser will be with you soon...';
            }
        }
        
        
    
       if(strCurStatus == '|2|')
       {
            //strStatusMessage = 'Your chat session is now live';
             if (typeof(jsText[19]) != "undefined"){
                strStatusMessage = jsText[19];
            } else {
                strStatusMessage = 'Your chat session is now live'
            }

            document.getElementById("EntryArea").style.display = 'block';
            intChatFormuIsBuilt = 1;
            document.getElementById("SurveyArea").style.display = 'none';


            var strButHTML ='<button type="button" class="btn btn-primary" alt="Send"  onclick="RequSendMessage()">'+jsText[58]+'</button>'; 
            strButHTML = strButHTML + '<button type="button" class="btn btn-primary" alt="End"  onclick="RequEndSession()">'+jsText[59]+'</button>';
            
            document.getElementById("Buttons").innerHTML=strButHTML;


        }



       if(strCurStatus == '|3|')
       {
            if (typeof(jsText[20]) != "undefined"){
               strStatusMessage = jsText[20];
            } else {
               strStatusMessage = 'Response sent. Waiting for advisor...';
            }
        
        
            document.getElementById("SurveyArea").style.display = 'none';
            
            document.getElementById("EntryArea").style.display = 'block';
            var strButHTML ='<button type="button" class="btn btn-primary" alt="Send"  onclick="RequSendMessage()">'+jsText[58]+'</button>'; 
            strButHTML = strButHTML + '<button type="button" class="btn btn-primary" alt="End"  onclick="RequEndSession()">'+jsText[59]+'</button>';
            document.getElementById("Buttons").innerHTML=strButHTML;
        }
        
        
        
        
       if(strCurStatus == '|4|')
       {
            //strStatusMessage = 'Waiting for your response...';
            if (typeof(jsText[21]) != "undefined"){
               strStatusMessage = jsText[21];
            } else {
                strStatusMessage = 'Waiting for your response...';
            }
            
            document.getElementById("SurveyArea").style.display = 'none';

            document.getElementById("EntryArea").style.display = 'block';
            var strButHTML ='<button type="button" class="btn btn-primary" alt="Send"  onclick="RequSendMessage()">'+jsText[58]+'</button>'; 
            strButHTML = strButHTML + '<button type="button" class="btn btn-primary" alt="End"  onclick="RequEndSession()">'+jsText[59]+'</button>';
            document.getElementById("Buttons").innerHTML=strButHTML;

       }
       
       

       if(strCurStatus == '|5|')
       {

          if(intSurveyRequirement == '1' || intSurveyRequirement == '3')
          {
                document.getElementById("SelectedSessionConversation").style.display = 'none';
                document.getElementById("ConversationAlerts").style.display = 'none';
                document.getElementById("EntryArea").style.display = 'none';
                
                
                document.getElementById("SurveyArea").style.display = 'block';
                var strButHTML = '';
                document.getElementById("Buttons").innerHTML=strButHTML;
          }
          else
          {
                document.getElementById("SurveyArea").style.display = 'none';
                document.getElementById("EntryArea").style.display = 'block';
                strStatusMessage = '';

                var strButHTML = '<form method="POST" >';

                strButHTML = strButHTML + '<button type="button" class="btn btn-primary" alt="Print"  onclick="printchat()">'+jsText[60]+'</button>';
                
                strButHTML = strButHTML + '<button type="submit"  name="SendRequest" class="btn btn-primary" alt="New Request" >'+jsText[61]+'</button>';
                
                strButHTML = strButHTML+'<input type="hidden" name="New" value="now"/>';
                
                
                strButHTML = strButHTML+'</form>';

                document.getElementById("Buttons").innerHTML="";
                if(intFollowSurveyBuilt == 0)
                {
                    intFollowSurveyBuilt = 1;
                    document.getElementById("EntryArea").innerHTML=strButHTML;
                }

                document.getElementById("EntryArea").style.display = 'block';
          }
        }
        
       if(strCurStatus == '|6|')
       {

          if(intSurveyRequirement == '2' || intSurveyRequirement == '3')
          {
          document.getElementById("EntryArea").style.display = 'none';
          document.getElementById("SelectedSessionConversation").style.display = 'none';
          document.getElementById("ConversationAlerts").style.display = 'none';
          
          document.getElementById("SurveyArea").style.display = 'block';
           var strButHTML = '';
           document.getElementById("Buttons").innerHTML=strButHTML;
          }
          else
          {
          document.getElementById("SurveyArea").style.display = 'none';
          document.getElementById("EntryArea").style.display = 'block';
          strStatusMessage = '';


          var strButHTML = '<form method="POST" >';

          strButHTML = strButHTML + '<button type="button" class="btn btn-primary" alt="Print"  onclick="printchat()">'+jsText[60]+'</button>'; 
          strButHTML = strButHTML + '<button type="submit"  name="SendRequest" class="btn btn-primary" alt="New Request" >'+jsText[61]+'</button>';
          strButHTML = strButHTML+'<input type="hidden" name="New" value="now"/>';
          
          strButHTML = strButHTML+'</form>';
          
          document.getElementById("Buttons").innerHTML=""; 
          if(intFollowSurveyBuilt == 0)
          {
          intFollowSurveyBuilt = 1;
          document.getElementById("EntryArea").innerHTML=strButHTML;
          }
          
          document.getElementById("EntryArea").style.display = 'block';
           }


        }

       if(strCurStatus == '|7|')
       {
            //strStatusMessage = 'Your comment has been sent';
            if (typeof(jsText[22]) != "undefined"){
               strStatusMessage = jsText[22];
            } else {
               strStatusMessage = 'Your comment has been sent';
            }
       }
       
        
       if(strCurStatus == '|8|')
       {
            //strStatusMessage = 'Sorry.  Your comment was not sent.  Try again.';
            if (typeof(jsText[23]) != "undefined"){
               strStatusMessage = jsText[23];
            } else {
               strStatusMessage = 'Sorry.  Your comment was not sent.  Try again.';
            }
       }
       
       
       if(strCurStatus == '|9|')
       {
            //strStatusMessage = 'Instruction completed.';
            if (typeof(jsText[24]) != "undefined"){
               strStatusMessage = jsText[24];
            } else {
               strStatusMessage = 'Instruction completed.';
            }
       }
        
        
        
       if(strCurStatus == '|10|')
       {
            //strStatusMessage = 'Advisor is now typing...';
            if (typeof(jsText[25]) != "undefined"){
               strStatusMessage = jsText[25];
            } else {
               strStatusMessage = 'Advisor is now typing...';
            }
       }
    
    var HTML = '<span class="statusmessage" >'+strStatusMessage+'</span><p>';
    document.getElementById("ConversationAlerts").innerHTML=HTML;

       intStatusRefreshFlag = 0;

   }

}


function printchat(){

            
     PrintContent_xmlHttp=GetXmlHttpObject();
     if (PrintContent_xmlHttp==null)
     {
        if (typeof(jsText[8]) != "undefined"){
            alert(jsText[8]);
        } else {
            alert ("We're sorry but your browser does not support AJAX.  The loGo_net commercials portal requires a browser which supports AJAX.  Please contact info@logo-net.co.uk for further information.");
        }
        return;
     }


     var url="./API/LGNC_GetStrippedSessionComments.php";
     url = url+storedparams;
     if(intRandomSessionReference != -100)
     {
     url = url+"&RSID="+intRandomSessionReference;
     }


     PrintContent_xmlHttp.onreadystatechange=PrintContent_stateChanged;
     PrintContent_xmlHttp.open("GET",url,true);
     PrintContent_xmlHttp.send(null);




}



function PrintContent_stateChanged()
{
if (PrintContent_xmlHttp.readyState==4)
  {

          var chat = PrintContent_xmlHttp.responseText;
          
          var ContentToPrint = '<html><head><title></title></head><body>';
          ContentToPrint = ContentToPrint+'<img src="assets/LGNC_StandardBanner.png" alt="Banner" ><p>';
          ContentToPrint = ContentToPrint+chat;
          ContentToPrint = ContentToPrint+"</body>";

          var oldPage = document.body.innerHTML;

                //Reset the page's HTML with div's HTML only
            document.body.innerHTML = ContentToPrint;

            //Print Page
            window.print();

            //Restore orignal HTML
            document.body.innerHTML = oldPage;

            }
}

function ChangeImageSource(elImage, strImAddress)
{
     elImage.src =strImAddress;
}

function GetXmlHttpObject()
{
var xmlHttp=null;
try
  {
  // Firefox, Opera 8.0+, Safari
  xmlHttp=new XMLHttpRequest();
  }
catch (e)
  {
  // Internet Explorer
  try
    {
    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
    }
  catch (e)
    {
    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
return xmlHttp;
}
