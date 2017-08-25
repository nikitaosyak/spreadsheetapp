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

function getDefaultValue(fieldType) {
    switch(fieldType) {
        case 'string': 
        case 'formula':
            return ''
        case 'number': return 0
        case 'range': return [0, 1]
        case 'link': 
        case 'enum':
            return []
        default: return 'UNKNOWN TYPE'
    }
}

function iterateObjects(sh, col, cb) {
    var current = 1
    while(!sh.getRange(current + 1, col).isBlank()) {
        current += 1
    }
    for (current; current > 1; current--) {
        cb(sh.getRange(current, col))
    }
}

//
// Template methods
//

function createEntityTemplate(location, id, children, parents, special) {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sheet.getRange(location.row, location.col)
    cell.setValue(id)

    var doc = { id: id }
    if (id !== 'category') {
        doc.category = 'string'
    }
    doc.meta = 'meta'

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

    var templateCell = sheet.getRange(1, col)
    templateCell.clear()
    templateCell.clearNote()

    iterateObjects(sheet, col, function(cell) {
        cell.clear()
        cell.clearNote()
    })

    
}

function addEntityTemplateField(col, fieldName, fieldType) {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var templateCell = sheet.getRange(1, col)
    
    var template = JSON.parse(templateCell.getNote())
    template[fieldName] = fieldType
    templateCell.setNote(JSON.stringify(template))

    iterateObjects(sheet, col, function(cell) {
        var dbDocument = JSON.parse(cell.getNote())
        dbDocument[fieldName] = getDefaultValue(fieldType)
        cell.setNote(JSON.stringify(dbDocument))
    })
}

function removeEntityTemplateField(col, fieldName) {
    var sheet = SpreadsheetApp.getActive().getActiveSheet()
    var templateCell = sheet.getRange(1, col)

    var template = JSON.parse(templateCell.getNote())
    delete template[fieldName]
    templateCell.setNote(JSON.stringify(template))

    iterateObjects(sheet, col, function(cell) {
        var dbDocument = JSON.parse(cell.getNote())
        delete dbDocument[fieldName]
        cell.setNote(JSON.stringify(dbDocument))
    })
}

function listOfValuesInColumn(col, fieldName) {
    var sh = SpreadsheetApp.getActive().getActiveSheet()
    var values = []
    iterateObjects(sh, col, function(cell) {
        var dbDocument = JSON.parse(cell.getNote())
        values.push(dbDocument[fieldName])
    })
    sheet().log(values)
    return values
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

function updateEntity(location, dbDocument) {
    var sh = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sh.getRange(location.row, location.col)

    // lazy validate different shit here
    var originalValue = JSON.parse(cell.getNote())
    if (location.col > 1) {
        if (originalValue.category !== dbDocument.category) {
            var cat = dbDocument.category
            if (cat) {
                if (listOfValuesInColumn(2, 'id').indexOf(cat) === -1) {
                    throw 'cannot find matching category for ' + cat
                }
            }
        }
    }

    cell.setValue(dbDocument.id)
    cell.setNote(JSON.stringify(dbDocument))
    cell.activate()
}

function eraseEntity(location) {
    var sh = SpreadsheetApp.getActive().getActiveSheet()
    var cell = sh.getRange(location.row, location.col)
    cell.clear()
    cell.clearNote()

    var current = location.row
    while(!sh.getRange(current+1, location.col).isBlank()) {
        var currentCell = sh.getRange(current, location.col)
        var nextCell = sh.getRange(current+1, location.col)

        currentCell.setValue(nextCell.getValue())
        currentCell.setNote(nextCell.getNote())
        nextCell.clear()
        nextCell.clearNote()

        current += 1
    }
}