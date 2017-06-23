function onOpen(e) {
    sheet().initialize()
}

function onChange(e) {

}

function onEdit(e) {

}

function getSelected() {
    var sheet = SpreadsheetApp.getActive()
    var cell = sheet.getActiveCell()
    var resultData
    
    var row = cell.getRow(), col = cell.getColumn()
    
    if (col === 1) {
        resultData = {'result': 'error', 'reason': 'WRONG FIELD'}
    } else if (row === 1) {
        resultData = {
            result: 'ok',
            type: 'class',
            value: cell.getValue(),
            document: cell.getNote()
        }
    } else {
        var classCell = sheet.getRange(1, col)
        resultData = {
            result: 'ok',
            type: 'entity',
            class: classCell.getValue(),
            template: classCell.getNote(),
            value: cell.getValue(),
            document: cell.getNote()
        }    
    }
    return resultData
}