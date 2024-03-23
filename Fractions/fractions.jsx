var dialog = createDialog();
var dialogResult = dialog.show();

if (dialogResult === 1) {
    var leadingNumeratorValue = parseFloat(dialog.leadingNumeratorInput.text);
    var leadingLineValue = parseFloat(dialog.leadingLineInput.text);
    var leadingDenominatorValue = parseFloat(dialog.leadingDenominatorInput.text);
    var spaceBeforeNumeratorValue = parseFloat(dialog.spaceBeforeNumeratorInput.text);
    var spaceAfterNumeratorValue = parseFloat(dialog.spaceAfterNumeratorInput.text);
    var spaceBeforeLineValue = parseFloat(dialog.spaceBeforeLineInput.text);
    var spaceAfterLineValue = parseFloat(dialog.spaceAfterLineInput.text);
    var spaceBeforeDenominatorValue = parseFloat(dialog.spaceBeforeDenominatorInput.text);
    var spaceAfterDenominatorValue = parseFloat(dialog.spaceAfterDenominatorInput.text);
    var extraUnderlines = parseInt(dialog.extraUnderlineInput.text, 10);

    var sel = app.selection[0];
    var contents = getSelectionContents(sel);

    if (!contents) {
        alert("Invalid selection. Please select some text.");
    } else {
        // var regex = /([\w\s\+\-\(\)]+)\/([\w\s\+\-\(\)]+)/g;
        var regex = /([^\/]+)\s*\/\s*([^\/\s]+)/g;
        var newContents = contents.replace(regex, function(match, p1, p2) {
            var maxWidth = Math.max(p1.length, p2.length) + extraUnderlines;
            return p1 + '\r' + createUnderline(maxWidth) + '\r' + p2;
        });

        if (newContents === contents) {
            alert("No fractions found in the selected text.");
        } else {
            sel.contents = newContents;

            var paragraphs = sel.texts[0].paragraphs.everyItem().getElements();
            for (var i = 0; i < paragraphs.length; i++) {
                var content = paragraphs[i].contents;

                // Logic for numerator
                paragraphs[i].justification = Justification.CENTER_ALIGN;
                paragraphs[i].leading = leadingNumeratorValue;
                paragraphs[i].spaceBefore = spaceBeforeNumeratorValue;
                paragraphs[i].spaceAfter = spaceAfterNumeratorValue;
                applyItalicToNonNumericChars(paragraphs[i]);

                i++; // Move to the underline
                if (i < paragraphs.length && paragraphs[i].contents.indexOf('_') !== -1) {
                    paragraphs[i].justification = Justification.CENTER_ALIGN;
                    paragraphs[i].leading = leadingLineValue;
                    paragraphs[i].spaceBefore = spaceBeforeLineValue;
                    paragraphs[i].spaceAfter = spaceAfterLineValue;
                }

                i++; // Move to the denominator
                if (i < paragraphs.length) {
                    paragraphs[i].justification = Justification.CENTER_ALIGN;
                    paragraphs[i].leading = leadingDenominatorValue;
                    paragraphs[i].spaceBefore = spaceBeforeDenominatorValue;
                    paragraphs[i].spaceAfter = spaceAfterDenominatorValue;
                    applyItalicToNonNumericChars(paragraphs[i]);
                }
            }
        }
    }
}

function createDialog() {
    var dialog = new Window("dialog", "Fraction Formatting");
    dialog.orientation = "column";
    dialog.alignChildren = "left";

    var leadingNumeratorGroup = dialog.add("group");
    var leadingNumeratorText = leadingNumeratorGroup.add("statictext", undefined, "Numerator Leading:");
    leadingNumeratorText.characters = 20;
    var leadingNumeratorInput = leadingNumeratorGroup.add("edittext", undefined, "10");
    leadingNumeratorInput.characters = 5;

    var leadingLineGroup = dialog.add("group");
    var leadingLineText = leadingLineGroup.add("statictext", undefined, "Line Leading:");
    leadingLineText.characters = 20;
    var leadingLineInput = leadingLineGroup.add("edittext", undefined, "4");
    leadingLineInput.characters = 5;

    var leadingDenominatorGroup = dialog.add("group");
    var leadingDenominatorText = leadingDenominatorGroup.add("statictext", undefined, "Denominator Leading:");
    leadingDenominatorText.characters = 20;
    var leadingDenominatorInput = leadingDenominatorGroup.add("edittext", undefined, "13");
    leadingDenominatorInput.characters = 5;

    var spaceBeforeNumeratorGroup = dialog.add("group");
    var spaceBeforeNumeratorText = spaceBeforeNumeratorGroup.add("statictext", undefined, "Numerator Space Before/After:");
    spaceBeforeNumeratorText.characters = 20;
    var spaceBeforeNumeratorInput = spaceBeforeNumeratorGroup.add("edittext", undefined, "0");
    spaceBeforeNumeratorInput.characters = 5;
    var spaceAfterNumeratorInput = spaceBeforeNumeratorGroup.add("edittext", undefined, "0");
    spaceAfterNumeratorInput.characters = 5;

    var spaceBeforeLineGroup = dialog.add("group");
    var spaceBeforeLineText = spaceBeforeLineGroup.add("statictext", undefined, "Line Space Before/After:");
    spaceBeforeLineText.characters = 20;
    var spaceBeforeLineInput = spaceBeforeLineGroup.add("edittext", undefined, "0");
    spaceBeforeLineInput.characters = 5;
    var spaceAfterLineInput = spaceBeforeLineGroup.add("edittext", undefined, "0");
    spaceAfterLineInput.characters = 5;

    var spaceBeforeDenominatorGroup = dialog.add("group");
    var spaceBeforeDenominatorText = spaceBeforeDenominatorGroup.add("statictext", undefined, "Denominator Space Before/After:");
    spaceBeforeDenominatorText.characters = 20;
    var spaceBeforeDenominatorInput = spaceBeforeDenominatorGroup.add("edittext", undefined, "0");
    spaceBeforeDenominatorInput.characters = 5;
    var spaceAfterDenominatorInput = spaceBeforeDenominatorGroup.add("edittext", undefined, "0");
    spaceAfterDenominatorInput.characters = 5;

    var extraUnderlineGroup = dialog.add("group");
    var extraUnderlineText = extraUnderlineGroup.add("statictext", undefined, "Extra Underlines:");
    extraUnderlineText.characters = 20;
    var extraUnderlineInput = extraUnderlineGroup.add("edittext", undefined, "1");
    extraUnderlineInput.characters = 5;


    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    okButton.onClick = function () {
        dialog.close(1);
    };

    cancelButton.onClick = function () {
        dialog.close(2);
    };

    dialog.leadingNumeratorInput = leadingNumeratorInput;
    dialog.leadingLineInput = leadingLineInput;
    dialog.leadingDenominatorInput = leadingDenominatorInput;
    dialog.spaceBeforeNumeratorInput = spaceBeforeNumeratorInput;
    dialog.spaceAfterNumeratorInput = spaceAfterNumeratorInput;
    dialog.spaceBeforeLineInput = spaceBeforeLineInput;
    dialog.spaceAfterLineInput = spaceAfterLineInput;
    dialog.spaceBeforeDenominatorInput = spaceBeforeDenominatorInput;
    dialog.spaceAfterDenominatorInput = spaceAfterDenominatorInput;
    dialog.extraUnderlineInput = extraUnderlineInput;

    return dialog;
}

function getSelectionContents(selection) {
    if (selection instanceof TextFrame) return selection.contents;
    if (selection instanceof Text) return selection.contents;
    if (selection instanceof TextColumn) return selection.contents;
    if (selection instanceof Paragraph) return selection.contents;
    if (selection instanceof Word) return selection.contents;
    if (selection instanceof Character) return selection.contents;
    if (selection instanceof InsertionPoint) return selection.contents;
    return null;
}

function createUnderline(width) {
    var underlineText = '';
    for (var i = 0; i < width; i++) {
        underlineText += '_';
    }
    return underlineText;
}

function applyItalicToNonNumericChars(paragraph) {
    var charStyle = app.activeDocument.characterStyles.itemByName("ItalicStyle");

    for (var i = 0; i < paragraph.contents.length; i++) {
        var currentChar = paragraph.contents[i];
        // Check if the character is not a number and is not a bracket
        if (!/\d/.test(currentChar) && currentChar !== '(' && currentChar !== ')') {
            // Apply italic formatting
            paragraph.characters[i].appliedCharacterStyle = charStyle;
        }
    }
}
