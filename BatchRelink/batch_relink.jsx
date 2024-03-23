function relinkMissingLinks(doc, linkDirectory) {
    var links = doc.links;
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.status == LinkStatus.LINK_MISSING || link.status == LinkStatus.LINK_OUT_OF_DATE) {
            var newLinkPath = new File(linkDirectory.fsName + "/" + link.name);
            if (newLinkPath.exists) {
                link.relink(newLinkPath);
            }
        }
    }
}

function processInddFilesInDirectory(rootDirectory, linkDirectory) {
    var inddFiles = rootDirectory.getFiles("*.indd");

    for (var i = 0; i < inddFiles.length; i++) {
        var inddFile = inddFiles[i];
        // Suppress user interaction for missing links
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        var doc = app.open(inddFile);
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL; // Reset the interaction level
        relinkMissingLinks(doc, linkDirectory);
        doc.save();
        doc.close(SaveOptions.YES);
    }

    var subdirectories = rootDirectory.getFiles(function (file) {
        return file instanceof Folder;
    });

    for (var j = 0; j < subdirectories.length; j++) {
        processInddFilesInDirectory(subdirectories[j], linkDirectory);
    }
}

function batchRelink() {
    var proceed = confirm("Would you like to proceed with batch relinking?", true, "Batch Relinking Confirmation");

    if (!proceed) {
        alert("Batch relinking aborted by user.");
        return;
    }

    var rootDirectory = Folder.selectDialog("Select Root Directory");
    if (!rootDirectory) {
        return;
    }

    var linkDirectory = Folder.selectDialog("Select Missing or Modified Link Directory");
    if (!linkDirectory) {
        return;
    }

    processInddFilesInDirectory(rootDirectory, linkDirectory);

    alert("Batch relinking completed.");
}

batchRelink();