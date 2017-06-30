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

//
// Template methods
//

function createEntityTemplate(location, id, children, parents, special) {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sheet.getRange(location.row, location.col)
    cell.setValue(id)

    var doc = { id: id }
    if (children) {
        doc.children = 'link'
    }
    if (parents) {
        doc.parents = 'link'
    }
    if (special) {
        doc.subjects = 'link'
    }
    cell.setNote(JSON.stringify(doc))
    cell.setFontWeight('bold')
}

function eraseEntityTemplate(col) {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var current = 2
    while(sheet.getRange(current, col).getValue() !== '') {
        current += 1
    }

    for (current; current >= 1; current--) {
        var cell = sheet.getRange(current, col)
        cell.clear()
        cell.clearNote()
    }
}

function addEntityTemplateField(col, fieldName, fieldType) {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sheet.getRange(1, col)
    
    var template = JSON.parse(cell.getNote())
    template[fieldName] = fieldType
    cell.setNote(JSON.stringify(template))
}

function removeEntityTemplateField(col, fieldName) {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sheet.getRange(1, col)
    
    var template = JSON.parse(cell.getNote())
    delete template[fieldName]
    cell.setNote(JSON.stringify(template))
}

//
// Entity methods
//

function createEntity(location, dbDocument) {
    var sh = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sh.getRange(location.row, location.col)
    var currentRow = location.row
    while(sh.getRange(currentRow-1, location.col).isBlank() && currentRow > 1) {
        sheet().log(currentRow)
        currentRow -= 1
        cell = sh.getRange(currentRow, location.col)
    }
    cell.setValue(dbDocument.id)
    cell.setNote(JSON.stringify(dbDocument))
    cell.activate()
}