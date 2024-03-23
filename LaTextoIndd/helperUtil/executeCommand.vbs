If WScript.Arguments.Count > 0 Then
    Set objShell = WScript.CreateObject("WScript.Shell")
    objShell.Run WScript.Arguments(0), 0, True
Else
    MsgBox "No command provided!"
End If
