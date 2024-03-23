### LaTex + InDesign

Prerequisites:
* Place the helperUtil somewhere accessible (Documents for example).  
* Install MikTeX.
* Install PERL (https://strawberryperl.com/).  
* Local Security Policy:  
  Local Policies -> User Rights Assignment -> Create symbolic links and add the user of the machine and restart. This is in order to avoid pdfcrop requesting admin rights.  

* In the .jsx change the paths to the .exe & .vbs:  

  ```jsx
  var processorPath = "C:\\Users\\velib\\OneDrive\\Documents\\helperUtil\\texCompileHelp.exe";
  var vbsPath = "C:\\Users\\velib\\OneDrive\\Documents\\helperUtil\\executeCommand.vbs";
  ```  

