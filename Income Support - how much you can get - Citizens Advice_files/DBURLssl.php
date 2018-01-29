if(location.protocol=="https:")
{
var dplat = "https://cita.logo-net.co.uk/Delivery/TBURT.php";
}
else
{
var dplat = "http://cita.logo-net.co.uk/Delivery/TBURT.php";
}
var strPURL = 'https://www.citizensadvice.org.uk/benefits/help-if-on-a-low-income/income-support/before-you-claim-income-support/income-support-how-much-you-can-get/';
strPURL = strPURL.replace(/&/g, "^");
strPURL = strPURL.toLowerCase();
strPURL = strPURL.replace(/</g, "-1");
strPURL = strPURL.replace(/>/g, "-2");
strPURL = strPURL.replace(/%3c/g, "-1");
strPURL = strPURL.replace(/%3e/g, "-2");
var T = new Date();
var cMS = T.getTime();
var src = dplat + '?SDTID=158&PURL=' + strPURL + '&CMS=1516982149934&oldTag=1';
var headID = document.getElementsByTagName("head")[0];
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = src;
headID.appendChild(newScript);
document.write('<div id="_oldTag_158_"></div>');