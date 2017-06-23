function getSelected() {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sheet.getActiveCell()
    var resultData
    
    var row = cell.getRow(), col = cell.getColumn()
    
    if (col === 1) {
        resultData = {'result': 'error', 'reason': 'WRONG FIELD'}
    } else if (row === 1) {
        resultData = {
            result: 'ok',
            location: {row: 1, col: col},
            type: 'entityTemplate',
            value: cell.getValue(),
            document: cell.getNote()
        }
    } else {
        var classCell = sheet.getRange(1, col)
        resultData = {
            result: 'ok',
            location: {row: row, col: col},
            type: 'entity',
            class: classCell.getValue(),
            template: classCell.getNote(),
            value: cell.getValue(),
            document: cell.getNote()
        }    
    }
    return resultData
}

function createEntityTemplate(location, id, children, parents, special) {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sheet.getRange(location.row, location.col)
    cell.setValue(id)

    var doc = { id: id }
    if (children) {
        doc.children = []
    }
    if (parents) {
        doc.parens = []
    }
    if (special) {
        doc.subjects = []
    }
    cell.setNote(JSON.stringify(doc))
}