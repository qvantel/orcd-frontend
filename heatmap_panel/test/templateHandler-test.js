import TemplateHandler from '../src/templateHandler';

describe('TemplateHandler', () => {
    let ctrl;
    let variableSrv;
    let templateSrv;
    let templateHandler;

    beforeEach(() => {
        setupHandler();
    });

    describe('when building a variable simple', () => {
        beforeEach(() => {
            templateHandler.buildSimple('Test', ['Test2', 'Test3']);
        });

        it('it should add a variable to the variablesrv with the correct information', () => {
            expect(templateHandler.variableSrv.variables.length).to.equal(1);
            expect(templateHandler.variableSrv.variables[0].options.length).to.equal(2);
        });
    });

    describe('when updating a variable simple', () => {
        beforeEach(() => {
            templateHandler.buildSimple('Test', ['Test2', 'Test3']);
            templateHandler.buildSimple('Test', ['Test2', 'Test3', 'Test4']);
        });

        it('it should add a variable to the variablesrv with the correct information', () => {
            expect(templateHandler.variableSrv.variables.length).to.equal(1);
            expect(templateHandler.variableSrv.variables[0].options.length).to.equal(3);
        });
    });

    describe('when deleting a variable simple', () => {
        beforeEach(() => {
            templateHandler.buildSimple('Test', ['Test2', 'Test3']);
            templateHandler.buildSimple('Test', []);
        });

        it('it should delete a variable to the variablesrv with the correct information', () => {
            expect(templateHandler.variableSrv.variables.length).to.equal(0);
        });
    });

    describe('when delete a variable that doesnt exist simple', () => {
        beforeEach(() => {
            templateHandler.buildSimple('Test', []);
        });

        it('it should add a variable to the variablesrv with the correct information', () => {
            expect(templateHandler.variableSrv.variables.length).to.equal(0);
        });
    });

    describe('when a variable has been added', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );
        });

        it('it should add a variable to the variablesrv with the correct information', () => {
            expect(templateHandler.variableSrv.variables.length).to.equal(1);
        });
    });

    describe('when you add a variable when there already exists one with the same name', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );
        });

        it('it should not be added', () => {
            expect(templateHandler.variableSrv.variables.length).to.equal(1);
        });
    });

    describe('when a variable has been updated', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );

            var newOptions = templateHandler.buildOptions([
                {text: 'se', value: 'se', select: true},
                {text: 'fi', value: 'fu', select: true},
                {text: 'dk', value: 'dk', select: true}
            ]);
            templateHandler.updateVariable(
                'countries',
                newOptions,
                'se,fi,dk',
                newOptions
            );
        });

        it('it should add a new option to the variable', () => {
            expect(templateHandler.variableSrv.variables[0].options.length).to.equal(3);
        });
    });

    describe('when trying to update a variable that doesnt exist', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );

            var newOptions = templateHandler.buildOptions([
                {text: 'se', value: 'se', select: true},
                {text: 'fi', value: 'fu', select: true},
                {text: 'dk', value: 'dk', select: true}
            ]);
            templateHandler.updateVariable(
                'countries2',
                newOptions,
                'se,fi,dk',
                newOptions
            );
        });

        it('it should now throw an exception', () => {});
    });

    describe('when deleting a variable', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );

            templateHandler.deleteVariable('countries');
        });

        it('it should be removed', () => {
            expect(templateHandler.variableSrv.variables.length).to.equal(0);
        });
    });

    describe('when deleting a variable that doesnt exist', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );

            templateHandler.deleteVariable('countries2');
        });

        it('it should not throw an exception', () => {
            expect(templateHandler.variableSrv.variables.length).to.equal(1);
        });
    });

    describe('when getting a variable index by name', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );
        });

        it('it should return the correct index', () => {
            expect(templateHandler.getVariableIndexByName('countries')).to.equal(0);
        });
    });

    describe('when getting a variable index by name that doesnt exist', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );
        });

        it('it should return -1', () => {
            expect(templateHandler.getVariableIndexByName('countries2')).to.equal(-1);
        });
    });

    describe('when getting the index of variable where there are no variables present', () => {
        beforeEach(() => {
            templateHandler.variableSrv.variables = undefined;
        });

        it('it should return -1', () => {
            expect(templateHandler.getVariableIndexByName('countries')).to.equal(-1);
        });
    });

    describe('when checking if a variable exists', () => {
        beforeEach(() => {
            var variable = buildVariable();
            templateHandler.addVariable(
                variable.type,
                variable.name,
                variable.label,
                variable.options,
                variable.current,
                variable.query,
                variable.multi
            );
        });

        it('it should return if it exists', () => {
            expect(templateHandler.variableExists('countries')).to.equal(true);
            expect(templateHandler.variableExists('countries2')).to.equal(false);
        });
    });

    describe('getOptionsByName(name)', () => {
      beforeEach(() => {
          var variable = buildVariable();
          templateHandler.addVariable(
              variable.type,
              variable.name,
              variable.label,
              variable.options,
              variable.current,
              variable.query,
              variable.multi
          );
      });

      it('Should return the options of the variable with the name provided as a parameter', () => {
        var options = templateHandler.buildOptions([
            {text: 'se', value: 'se', select: true},
            {text: 'fi', value: 'fu', select: true}
        ]);

        expect(templateHandler.getOptionsByName('countries')).to.eql(options);
      });
    });

    function buildVariable () {
        var options = templateHandler.buildOptions([
            {text: 'se', value: 'se', select: true},
            {text: 'fi', value: 'fu', select: true}
        ]);
        var query = 'se,fi';
        var current = templateHandler.buildCurrent(query, options);

        return {
            type: 'custom',
            name: 'countries',
            label: 'Countries',
            options: options,
            current: current,
            query: query,
            multi: true
        };
    }

    function setupHandler () {
        templateSrv = {
            init: () => {
            }
        };

        variableSrv = {
            variables: [],
            updateVariable: () => {
            },
            $rootScope: {
                $emit: () => {
                },
                $broadcast: () => {
                }
            }
        };
        variableSrv.createVariableFromModel = (data) => {
            return {
                name: data.name,
                current: data.current,
                options: data.options
            };
        };

        ctrl = {
            dashboard: {
                updateSubmenuVisibility: () => {
                }
            }
        };

        templateHandler = new TemplateHandler(ctrl, templateSrv, variableSrv)
    }
});
