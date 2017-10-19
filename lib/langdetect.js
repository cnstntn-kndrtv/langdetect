var langDetectHandler,
    defaultLangDetectHandler = 'detectByABC';

function detectByABC(text) {
    var abc = {
        "russian": ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'],
        "english": ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    };

    var signsArray = [],
        detections = [],
        intersection;

    text = text.trim();
    
    // чистка букв которых нет в словарях
    signsArray = [];
    for (var i = 0, l = 0; i < text.length; i++) {
        for (var j in abc) {
            for (var k = 0; k < abc[j].length; k++) {
                if (abc[j][k] == text[i]) {
                    signsArray[l] = text[i];
                    l++;
                }
            }
        }
    }

    // удаляем дубли
    var i = signsArray.length;
    signsArray.sort();
    while (i--) {
        if (signsArray[i] == signsArray[i - 1]) {
            signsArray.splice(i, 1);
        }
    }

    // подсчет пересечений словарей и текста
    var i = 0;
    for (var j in abc) {
        detections[i] = []
        detections[i][0] = j;
        intersection = arrayIntersection(signsArray, abc[j]).length;
        detections[i][1] = intersection / signsArray.length * intersection / abc[j].length;
        i++
    }

    //сортировка
    detections = detections.sort(function(a, b) {
        if (a[1] < b[1]) return 1;
        else if (a[1] > b[1]) return -1;
        else return 0;
    });
    if (detections[0][1] != NaN) return detections[0][0];
    else return 'undefined';
}

function arrayIntersection(a1, a2) {
    var a2Set = new Set(a2);
    return a1.filter(function(x) {
        return a2Set.has(x);
    });
}

function detectLD(text) {
    var LanguageDetect = require('languagedetect');
    var lngDetector = new LanguageDetect();
    
    var result = lngDetector.detect(text);
    if (result.length != 0) return lngDetector.detect(text)[0][0];
    else return 'undefined';
}

function setHandler(handler) {
    langDetectHandler = handler || defaultLangDetectHandler;
}

function detect(text) {
    var myFuncs = {
        detectByABC: function (text) {
            return detectByABC(text);
        },
        detectLD: function (text) {
            return detectLD(text);
        }
    };
    var s = false;
    for (var i in myFuncs) {
        if (i == langDetectHandler) s = true;
    }
    
    if (s) return myFuncs[langDetectHandler](text);
    else return myFuncs[defaultLangDetectHandler](text);
}

exports.detectByABC = detectByABC;

exports.detectLD = detectLD;

exports.setHandler = setHandler;

exports.detect = detect;