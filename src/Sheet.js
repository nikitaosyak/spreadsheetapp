function toggleServiceColumn() {
    var s = sheet()
    if (s.meta.get('showService')) {
        s.main.hideColumns(1)
        s.meta.set('showService', false)
    } else {
        s.main.showColumns(1)
        s.meta.set('showService', true)
        s.main.setActiveRange(s.main.getRange('A1'))
    }
}

function showEntityEditor() {
    var html = HtmlService.createTemplateFromFile('editor')
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle('Editor')
        .setWidth(350)
    SpreadsheetApp.getUi().showSidebar(html)
}

function sheet() {
    var _main = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    var _version = _main.getRange(2, 1)
    var _log = _main.getRange(3, 1, 28)
    var _errors = {
        current: [],
        cell: _main.getRange(31, 1, 10),
        init: function() {
            _errors.cell.mergeVertically()
            _errors.cell.setVerticalAlignment('top')
            _errors.update()
        },
        update: function() {
            if (_errors.current.length > 0) {
                _errors.cell.setBackground('red')
            } else {
                _errors.cell.setBackground('green')
                _errors.cell.setValue('NO ERRORS')
            }
        }
    }

    var _meta = {
        current: null,
        cell: _main.getRange(1, 1),

        create: function() {
            _meta.cell.setValue(JSON.stringify({
                version: 0,
                showService: true
            }))
            _meta.init()
        },
        init: function() {
            _meta.current = JSON.parse(_meta.cell.getValue())
        },
        get: function(key) {
            return _meta.current[key]
        },
        set: function(key, value) {
            _meta.current[key] = value
            _meta.cell.setValue(JSON.stringify(_meta.current))
            _version.setValue(_meta.current.version)
        }
    }

    if (_meta.cell.isBlank()) {
        _meta.create()
    } else {
        _meta.init()
    }

    var self = {
        main: _main,
        meta: _meta,
        initialize: function() {
            // init log
            _log.mergeVertically()
            _log.setVerticalAlignment("top")
            _log.setBackground("gray")
            _log.setValue('begin log:\n')

            _errors.init()

            // append menu items here
            var ui = SpreadsheetApp.getUi()
            ui.createMenu('GUILDMASTER')
                .addItem('toggle service column', 'toggleServiceColumn')
                .addItem('show editor', 'showEntityEditor')
                .addToUi()

            // activate zero sheet
            SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(_main)

            // set up service column
            _main.setColumnWidth(1, 200)
            _meta.cell.setBackground('yellow')
            _version.setBackground("magenta")

            _main.setFrozenColumns(1)
            _main.setFrozenRows(1)

            _main.getRange(1, 2, 1, 50).setFontWeight('bold')

            // append entityEditor
            showEntityEditor()
        },
        log: function(value) {
            var currentLog = _log.getValue()
            var logArray = currentLog.split('\n')
            if (logArray.length > 30) {
                logArray.pop()
            }
            logArray.unshift(value)
            _log.setValue(logArray.join('\n'))
        }

    }
    return self
}