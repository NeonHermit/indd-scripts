function batchReplaceInInDesignFiles() {
    var folder = Folder.selectDialog("Select a folder with .indd files");
    if (!folder) return; 

    var dialog = new Window("dialog", "Search and Replace");
    dialog.orientation = "column";
    
    var searchGroup = dialog.add("group");
    searchGroup.add("statictext", [0, 0, 100, 25], "Search for:");     // Width: 100, Height: 25
    var searchText = searchGroup.add("edittext", [0, 0, 300, 25], ""); // Width: 300, Height: 25
    
    var replaceGroup = dialog.add("group");
    replaceGroup.add("statictext", [0, 0, 100, 25], "Replace with:");    // Width: 100, Height: 25
    var replaceText = replaceGroup.add("edittext", [0, 0, 300, 25], ""); // Width: 300, Height: 25

    var useGREP = dialog.add("checkbox", undefined, "Use GREP for searching and replacing?");

    var includeMasterPages = dialog.add("checkbox", undefined, "Include Master Pages");

    var buttonsGroup = dialog.add("group");
    buttonsGroup.add("button", undefined, "OK", {name: "ok"});
    buttonsGroup.add("button", undefined, "Cancel", {name: "cancel"});
    
    if (dialog.show() === 1) { 
        var inddFiles = getAllInDesignFiles(folder);
        for (var i = 0; i < inddFiles.length; i++) {
            var doc = app.open(inddFiles[i]);
            if (useGREP.value) {
                findAndReplaceGREP(searchText.text, replaceText.text, doc, includeMasterPages.value);
            } else {
                findAndReplaceText(searchText.text, replaceText.text, doc, includeMasterPages.value);
            }
            doc.save();
            doc.close();
        }
        alert("Finished processing files.");
    }
}

function getAllInDesignFiles(folder) {
    var inddFiles = [];
    var allFiles = folder.getFiles(function(file) {
        return (file instanceof Folder) || (file.name.match(/\.indd$/i));
    });

    for (var i = 0; i < allFiles.length; i++) {
        if (allFiles[i] instanceof Folder) {
            inddFiles = inddFiles.concat(getAllInDesignFiles(allFiles[i]));
        } else {
            inddFiles.push(allFiles[i]);
        }
    }
    return inddFiles;
}

function findAndReplaceText(searchText, replaceText, doc, includeMasterPages) {
    app.findTextPreferences = app.changeTextPreferences = null; 
    app.findTextPreferences.findWhat = searchText;
    app.changeTextPreferences.changeTo = replaceText;

    doc.changeText(); 

    if (includeMasterPages) {
        var masterSpreads = doc.masterSpreads;
        for (var i = 0; i < masterSpreads.length; i++) {
            var masterSpread = masterSpreads[i];
            var textFrames = masterSpread.textFrames;
            for (var j = 0; j < textFrames.length; j++) {
                if (containsVariable(textFrames[j].contents, searchText)) {
                    textFrames[j].contents = textFrames[j].contents.replace(searchText, replaceText);
                }
            }
        }
    }

    app.findTextPreferences = app.changeTextPreferences = null;
}

function findAndReplaceGREP(searchPattern, replacePattern, doc, includeMasterPages) {
    app.findGrepPreferences = app.changeGrepPreferences = null;
    app.findGrepPreferences.findWhat = searchPattern;
    app.changeGrepPreferences.changeTo = replacePattern;

    doc.changeGrep(); 

    // if (includeMasterPages) {
    //     var masterSpreads = doc.masterSpreads;
    //     for (var i = 0; i < masterSpreads.length; i++) {
    //         var masterSpread = masterSpreads[i];
    //         var textFrames = masterSpread.textFrames;
    //         for (var j = 0; j < textFrames.length; j++) {
    //             if (containsVariable(textFrames[j].contents, searchPattern, true)) {
    //                 var foundItems = textFrames[j].findGrep();
    //                 for (var k = 0; k < foundItems.length; k++) {
    //                     foundItems[k].contents = replacePattern;
    //                 }
    //             }
    //         }
    //     }
    // }

    if (includeMasterPages) {
        var masterSpreads = doc.masterSpreads;
        for (var i = 0; i < masterSpreads.length; i++) {
            var masterSpread = masterSpreads[i];
            var textFrames = masterSpread.textFrames;
            for (var j = 0; j < textFrames.length; j++) {
                if (containsVariable(textFrames[j].contents, searchPattern, true)) {
                    textFrames[j].contents = textFrames[j].contents.replace(searchPattern, replacePattern);
                }
            }
        }
    }

    app.findGrepPreferences = app.changeGrepPreferences = null;
}

function containsVariable(text, searchPattern, isGrep) {
    if (isGrep) {
        var regex = new RegExp(searchPattern);
        return regex.test(text);
    } else {
        return text.indexOf(searchPattern) !== -1;
    }
}


batchReplaceInInDesignFiles();