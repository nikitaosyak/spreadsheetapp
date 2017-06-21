function onOpen(e) {
    sheet().initialize()
}

function onChange(e) {

}

function onEdit(e) {

}

// function doGet() {
//     return HtmlService.createTemplateFromFile('entityEditor')
//         .evaluate()
//         .setSandboxMode(HtmlService.SandboxMode.IFRAME)
//         .setTitle('Editor')
//         .setWidth(350)
// }

function getSelected() {
    //  var s = sheet()
    sheet().log(SpreadsheetApp.getActive().getActiveCell().getValue())
    return SpreadsheetApp.getActive().getActiveCell().getValue()
}