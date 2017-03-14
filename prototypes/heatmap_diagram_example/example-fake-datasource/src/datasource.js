import _ from 'lodash';

export class GenericDatasource {

  constructor (instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
  }

  query (options) {
    //  Build options sent from Grafana.
    //  var query = this.buildQueryParameters(options);
      var generateDatapoint = function(){
          return new Date();
      };

    //  Try to return example from grafana page. Modify example data to whatever needed!
    return { data: [
      {'target': 'upper_50',
      'datapoints': [
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Spotify'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Netflix'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Telefoni'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Bredband'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Facebook'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'SMS'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'MMS'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
          [_.random(0, 1000), Date.parse(new Date('2017-02-14T13:00:00')), 'Example'],
      ]}
    ] }
  }

  testDatasource () {
    //  Fake working back end. Does want a 'then()', but works anyway.
    return {status: 'success', message: 'Fake back end is working', title: 'Success'};
  }

  //    Does not do anything at the moment. Not needed for example.
  annotationQuery (options) {
    //  Defined as needed by Grafana. Annotations are disabled in plugin.json.
  }

  buildQueryParameters (options) {
    //  remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric';
    });

    var targets = _.map(options.targets, target => {
      return {
        target: this.templateSrv.replace(target.target),
        refId: target.refId,
        hide: target.hide,
        type: target.type || 'timeserie'
      };
    });

    options.targets = targets;

    return options;
  }
}
