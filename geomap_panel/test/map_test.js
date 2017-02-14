import Map from '../src/map';

describe('Map', () => {
    let map1;
     let ctrl;
     var finish = false;

  beforeEach((done) => {
    setupWorldmapFixture();
    var interv = setInterval(function() {
        if(finish){
            clearInterval(interv);
            done();
        }
    },20)
  });

  describe('when a map is created', () => {
    it('should add Leaflet to the map div', () => {
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
        console.log(document.getElementsByTagName('svg')[0].getAttribute("width"));
      expect(document.getElementsByTagName('svg')[0].getAttribute("width")).to.be('500');
    });
  });

  afterEach(() => {
    document.body.removeChild(document.getElementById('map'));
});

  function setupWorldmapFixture() {
    const map = '<div style="width:500px;" id="map" class="map"></div>';
    document.body.insertAdjacentHTML('afterbegin', map);
    map1 = new Map(ctrl, document.getElementById('map'), function(){finish = true;});
  }
});
