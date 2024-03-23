function customTrim(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

if (app.documents.length !== 0 && app.selection.length !== 0 && app.selection[0] instanceof TextFrame) {

    var dialog = app.dialogs.add({ name: "Delete text" });
    
    var radioGroup;
    with (dialog) {
        with (dialogColumns.add()) {
            with (borderPanels.add()) {
                radioGroup = radiobuttonGroups.add();
                radioGroup.radiobuttonControls.add({ staticLabel: "Before =" });
                radioGroup.radiobuttonControls.add({ staticLabel: "After =" });
            }
        }
    }

    if (dialog.show() === true) {
        var selectedTextFrame = app.selection[0];
        var content = selectedTextFrame.contents;
        var lines = content.split('\r'); // Split by return character to get individual lines

        if (radioGroup.selectedButton === 0) {
            for (var i = 0; i < lines.length; i++) {
                var position = lines[i].indexOf('=');
                if (position !== -1) {
                    lines[i] = lines[i].substring(position + 1);
                    lines[i] = customTrim(lines[i]);
                }
            }
            selectedTextFrame.contents = lines.join('\r');
        } else {
            // For each line, keep only up to and including "="
            for (var i = 0; i < lines.length; i++) {
                var pos = lines[i].indexOf('=');
                if (pos !== -1) {
                    lines[i] = lines[i].substring(0, pos + 1);
                }
            }
            selectedTextFrame.contents = lines.join('\r');
        }

        dialog.destroy();
    } else {
        dialog.destroy();
    }

} else {
    alert("Please select a text frame before running the script.");
}
