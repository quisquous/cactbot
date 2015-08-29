cb.util = {};

cb.util.jobIdToName = {
    1: 'gld',
    2: 'pgl',
    3: 'mrd',
    4: 'lnc',
    5: 'arc',
    6: 'cnj',
    7: 'thm',
    8: 'crp',
    9: 'bsm',
    10: 'arm',
    11: 'gsm',
    12: 'ltw',
    13: 'wvr',
    14: 'alc',
    15: 'cul',
    16: 'min',
    17: 'btn',
    18: 'fsh',
    19: 'pld',
    20: 'mnk',
    21: 'war',
    22: 'drg',
    23: 'brd',
    24: 'whm',
    25: 'blm',
    26: 'acn',
    27: 'smn',
    28: 'sch',
    29: 'rog',
    30: 'nin',
    31: 'mch',
    32: 'drk',
    33: 'ast',
};

cb.util.loadCSS = function(filename) {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", filename);

    var head = document.getElementsByTagName("head")[0];
    head.appendChild(link)
}