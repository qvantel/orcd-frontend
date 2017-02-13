export default class Map {
    constructor (ctrl, container, onReadyCallback) {
        this.ctrl = ctrl;
        this.container = container;
        this.ready = false;
        this.onReadyCallback = onReadyCallback;
        this.countries = [
            'DZ', 'EG', 'EH', 'LY', 'MA', 'SD', 'SS', 'TN',
            'BF', 'BJ', 'CI', 'CV', 'GH', 'GM', 'GN', 'GW', 'LR', 'ML', 'MR', 'NE', 'NG', 'SH', 'SL', 'SN', 'TG',
            'AO', 'CD', 'ZR', 'CF', 'CG', 'CM', 'GA', 'GQ', 'ST', 'TD',
            'BI', 'DJ', 'ER', 'ET', 'KE', 'KM', 'MG', 'MU', 'MW', 'MZ', 'RE', 'RW', 'SC', 'SO', 'TZ', 'UG', 'YT', 'ZM', 'ZW',
            'BW', 'LS', 'NA', 'SZ', 'ZA',
            'GG', 'JE', 'AX', 'DK', 'EE', 'FI', 'FO', 'GB', 'IE', 'IM', 'IS', 'LT', 'LV', 'NO', 'SE', 'SJ',
            'AT', 'BE', 'CH', 'DE', 'DD', 'FR', 'FX', 'LI', 'LU', 'MC', 'NL',
            'BG', 'BY', 'CZ', 'HU', 'MD', 'PL', 'RO', 'RU', 'SU', 'SK', 'UA',
            'AD', 'AL', 'BA', 'ES', 'GI', 'GR', 'HR', 'IT', 'ME', 'MK', 'MT', 'CS', 'RS', 'PT', 'SI', 'SM', 'VA', 'YU',
            'BM', 'CA', 'GL', 'PM', 'US',
            'AG', 'AI', 'AN', 'AW', 'BB', 'BL', 'BS', 'CU', 'DM', 'DO', 'GD', 'GP', 'HT', 'JM', 'KN', 'KY', 'LC', 'MF', 'MQ', 'MS', 'PR', 'TC', 'TT', 'VC', 'VG', 'VI',
            'BZ', 'CR', 'GT', 'HN', 'MX', 'NI', 'PA', 'SV',
            'AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE',
            'TM', 'TJ', 'KG', 'KZ', 'UZ',
            'CN', 'HK', 'JP', 'KP', 'KR', 'MN', 'MO', 'TW',
            'AF', 'BD', 'BT', 'IN', 'IR', 'LK', 'MV', 'NP', 'PK',
            'BN', 'ID', 'KH', 'LA', 'MM', 'BU', 'MY', 'PH', 'SG', 'TH', 'TL', 'TP', 'VN',
            'AE', 'AM', 'AZ', 'BH', 'CY', 'GE', 'IL', 'IQ', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'NT', 'SY', 'TR', 'YE', 'YD',
            'AU', 'NF', 'NZ',
            'FJ', 'NC', 'PG', 'SB', 'VU',
            'FM', 'GU', 'KI', 'MH', 'MP', 'NR', 'PW',
            'AS', 'CK', 'NU', 'PF', 'PN', 'TK', 'TO', 'TV', 'WF', 'WS'
        ];
        this.options = {
          region: 'world',
          colorAxis: {colors: ['#151515', '#ff3030']},
          backgroundColor: {
            'fill': '#1f1d1d'
          },
          datalessRegionColor: '#151515',
          legend: {
              textStyle: {
                  'color': 'white'
              }
          }
        };

        this.loadGoogle();
    }

    loadGoogle () {
        var self = this;

        if (typeof google === 'undefined') {
            setTimeout(function () {
                self.loadGoogle();
            }, 30);
        } else {
            google.charts.load('visualization', '1', {'packages': ['geochart']});
            google.charts.setOnLoadCallback(function () {
                self.createMap();
            });
        }
    }

    createMap () {
        var self = this;
        this.map = new google.visualization.GeoChart(this.container);
        google.visualization.events.addListener(this.map, 'ready', function () {
            self.ready = true;
            self.onReadyCallback();
        });
        this.draw();
    }

    draw () {
        var data = [['Country', 'Popularity']];
        for (var i = 0; i < this.countries.length; i++) {
            data.push([this.countries[i], Math.floor(Math.random() * 100)]);
        }

        data = google.visualization.arrayToDataTable(data);

        this.map.draw(data, this.options);
    }
}
