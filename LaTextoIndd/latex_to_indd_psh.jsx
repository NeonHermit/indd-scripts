var dialog = new Window("dialog", "Place your LaTeX Equation");

// Input box, size
var latexInput = dialog.add("edittext", undefined, "", {multiline: true});
latexInput.size = [800, 600];

// Preamble and closure for LaTeX
var latexPreamble = "\\documentclass{article}\n\\pagestyle{empty}\n\\begin{document}\n";
var latexClosure = "\n\\end{document}";

latexInput.text = latexPreamble + latexClosure;  // Initialize the edit area with the preamble and closure

// Add OK and Cancel buttons
var buttonsGroup = dialog.add("group");
buttonsGroup.add("button", undefined, "OK", {name: "ok"});
buttonsGroup.add("button", undefined, "Cancel", {name: "cancel"});

// Show the dialog
if (dialog.show() != 1) {
    exit();  // Exit the script if Cancel is pressed
}

// If OK is pressed, extract the LaTeX code from the input
var splits = latexInput.text.split("\\begin{document}");
var userLatex = "";
if (splits.length > 1) {
    var innerSplits = splits[1].split("\\end{document}");
    if (innerSplits.length > 0) {
        userLatex = innerSplits[0];
    }
    latexPreamble = splits[0] + "\\begin{document}\n";
    latexClosure = "\n\\end{document}" + (innerSplits.length > 1 ? innerSplits[1] : "");
}

var fullLatexCode = latexPreamble + userLatex + latexClosure;

var docDir = app.activeDocument.filePath;

// Name of the sub-directory for .tex files
var texSubDirName = "texFiles";
// Full path to the sub-directory
var texSubDir = File(docDir + "/" + texSubDirName);
// If the sub-directory doesn't exist, create it
if (!texSubDir.exists) {
    new Folder(texSubDir.fsName).create();
}

// Generate unique file name based on current timestamp
var timestamp = (new Date()).getTime();
var latexFileName = "latexInput_" + timestamp + ".tex";
var latexFile = File(texSubDir + "/" + latexFileName);

latexFile.encoding = "UTF8";
latexFile.open('w');
latexFile.writeln(fullLatexCode);
latexFile.close();

var processorPath = "C:\\Users\\velibor\\Documents\\helperUtil\\texCompileHelp.exe";

// Create a temporary batch file to execute the PowerShell command
var psCommand = 'powershell.exe -windowstyle hidden -ExecutionPolicy Bypass -Command "Start-Process -FilePath \'' + processorPath + '\' -ArgumentList \'' + latexFile.fsName + '\' -NoNewWindow -Wait"';

var batFile = File(texSubDir + "/tempExecute.bat");
batFile.open('w');
batFile.writeln('@echo off');
batFile.writeln(psCommand);
batFile.close();

batFile.execute();

var maxAttempts = 30;
var attempt = 0;
var pdfGenerated = false;
var pdfPath = texSubDir + "/" + latexFileName.replace(".tex", ".pdf");
var pdfFile = File(pdfPath);

while (attempt < maxAttempts && !pdfGenerated) {
    if (pdfFile.exists) {
        pdfGenerated = true;
    } else {
        $.sleep(1000); // Wait for 1 second before checking again
        attempt++;
    }
}

batFile.remove();

if (pdfGenerated) {
    app.activeDocument.place(pdfFile);
} else {
    alert("Error generating PDF.");
}