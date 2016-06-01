cb.pullcounter = {
    throttleTickMs: 1000,
    lastPull: null,

    initialize: function(element) {
        this.topElement = element;
        document.addEventListener('cactbot.wipe', this.onWipe.bind(this));
        document.addEventListener('cactbot.rotation.startfight', this.onStartFight.bind(this));
    },
    leaveZone: function() {
        this.topElement.innerText = '';
    },
    enterZone: function() {
        // FIXME: somehow inform this if there's only one boss in the zone
        this.topElement.innerText = '';
    },
    filtersZone: function(zone) {
        return true;
    },
    onStartFight: function(e) {
        this.lastPull = e.detail;
        this.topElement.classList.remove('wipe');
        this.topElement.innerText = e.detail.attempt;
    },
    onWipe: function() {
        this.topElement.classList.add('wipe');
    },
};

window.addEventListener('load', function () {
    cb.util.loadCSS('pullcounter/pullcounter.css');

    var element = document.createElement('div');
    var nodeContainer = document.createElement('div');
    nodeContainer.classList.add('pullcount');
    element.appendChild(nodeContainer);

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(element);

    var defaultGeometry = {
        width: '180px',
        height: '100px',
    };
    cb.windowManager.add('pullcounter', element, 'pullcounter', defaultGeometry);
    cb.pullcounter.initialize(nodeContainer);
    cb.updateRegistrar.register(cb.pullcounter);
});
