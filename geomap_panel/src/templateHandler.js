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
}
