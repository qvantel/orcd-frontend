/** This class will be responsible for handling template variables */
export default class TemplateHandler {
    /**
    * Build the template handler and set some initiate variables
    */
    constructor (ctrl, templateSrv, variableSrv) {
        this.ctrl = ctrl;
        this.templateSrv = templateSrv;
        this.variableSrv = variableSrv;
    }

    addVariable (type, name, label, options, current, query, multi) {
        if (this.variableExists(name)) return;

        this.variableSrv.addVariable({
            type: type,
            name: name,
            label: label,
            options: options,
            current: current,
            query: query,
            multi: multi
        });
    }

    updateVariable (variableName, options, query, currentText, currentValue) {
        if (!this.variableExists(variableName)) return;

        var variable = this.variableSrv.variables[this.getVariableIndexByName(variableName)];
        variable.options = options;
        variable.query = query;
        variable.current.text = currentText;
        variable.current.value = currentValue;
    }

    variableUpdated () {
        this.variableSrv.$rootScope.$emit('template-variable-value-updated');
        this.variableSrv.$rootScope.$broadcast('refresh');
        this.templateSrv.init(this.variableSrv.variables);
    }

    deleteVariable (name) {
        var variableIndex = this.getVariableIndexByName(name);

        if (variableIndex !== -1) {
            this.variableSrv.variables.splice(variableIndex, 1);
        }
    }

    getVariableIndexByName (name) {
        if (this.variableSrv.variables) {
            for (var i = 0; i < this.variableSrv.variables.length; i++) {
                if (this.variableSrv.variables[i].name === name) {
                    return i;
                }
            }
        }

        return -1;
    }

    variableExists (name) {
        return this.getVariableIndexByName(name) !== -1;
    }

    buildCurrent (text, value) {
        return {'text': text, 'value': value};
    }

    buildOption (text, value, selected) {
        return {'text': text, 'value': value, 'selected': selected};
    }

    buildOptions (options) {
        var res = [];

        for (var key in options) {
            res.push(this.buildOption(options[key].text, options[key].value, options[key].selected));
        }

        return res;
    }
}
