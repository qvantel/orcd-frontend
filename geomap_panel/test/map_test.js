import Map from '../src/map';

describe('Map', () => {
    let map1;
    let ctrl;
    var finish = false;

  beforeEach((done) => {
    setupWorldmapFixture();

    var interv = setInterval(function (){
        if (finish){
            clearInterval(interv);
            done();
        }
    }, 20);
  });

  describe('when a map is created', () => {
    it('should add Google geochart to the map div', () => {
      expect(document.getElementById('map')).to.not.be(null);
    });
  });

  describe('If map is created', () => {
    it('should add svg', () => {
      expect(document.getElementsByTagName('svg')).to.not.be(null);
    });
  });

  describe('If svg is created', () => {
    it('check width', () => {
      expect(document.getElementsByTagName('svg')[0].getAttribute("width")).to.be('500');
    });
  });

  describe('Test lerp function', () => {
    it('value is', () => {
      expect(map1.lerp(10,20,0.5)).to.be(15);
    });
  });

  describe('Test lerp function', () => {
    it('value is', () => {
      expect(map1.lerp(10,20,0.5)).to.not.be(25);
    });
  });

  describe('Test setData function', () => {
    it('value is', () => {
        map1.setData({"SE":2});
        map1.setData({"SE":4});
        map1.setData({"SE":7});
      expect(map1.data["SE"].wanted).to.be(7);
      expect(map1.data["SE"].last).to.be(4);
      expect(map1.data["SE"].current).to.be(4);
    });
  });

  describe('Test setData function', () => {
    it('value is', () => {
        map1.setData({"SE":4});
        map1.setData({"SE":8});
        map1.lerpDataValues(0.5);
        expect(map1.data["SE"].current).to.be(6);
    });
  });

  describe('Test setData function', () => {
    it('value is', () => {
        map1.setData({"SE":4});
        map1.setData({"SE":8});
        map1.lerpDataValues(0.5);
        expect(map1.data["SE"].current).to.not.be(7);
    });
  });
  
  afterEach (() => {
    document.body.removeChild(document.getElementById('map'));
});

  function setupWorldmapFixture () {
    const map = '<div style="width:500px;" id="map" class="map"></div>';
    document.body.insertAdjacentHTML('afterbegin', map);
    ctrl = {
        panel: {
            showLegend: true,
            colors: ['#fff', '#000']
        },
        lightTheme: true,
        getRegion: function () {
            return 'world';
        }
    }
    map1 = new Map(ctrl, document.getElementById('map'), function () { finish = true; });
  }
});
