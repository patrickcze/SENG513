//
// this is just a stub for a function you need to implement
//
function getStats(txt) {
    function getMaxLineLenght(txt) {
        let maxLineLength = 0
        let linesOfText = txt.split('\n');

        linesOfText.forEach(function (val, index, array) {
            if (val.length > maxLineLength) {
                maxLineLength = val.length;
            }
        });

        return maxLineLength;
    }

    function getAverageWordLengths(txt) {
        var words = txt.replace(/\n|\r|\t/g, " ").replace(/[.,\/#?+!$%\^&\*;:{}=\-"_`~()]/g, " ").replace(/\s{2,}/g, " ").toLowerCase().trim().split(" ");

        let num = 0

        words.forEach(function (val, index, array) {
            num += val.length
        });

        return num / words.length;
    }

    function findFrequentWords(txt) {
        var words = txt.replace(/\n|\r|\t/g, " ").replace(/[.,\/#?+!$%\^&\*;:{}=\-"_`~()]/g, " ").replace(/\s{2,}/g, " ").toLowerCase().trim().split(" ");

        var frequentWords = {};
        var countNumbers = [];
        var wordsByCounts = {};

        words.forEach(function (val, index, array) {
            if (val in frequentWords) {
                frequentWords[val] += 1;
            } else {
                frequentWords[val] = 1;
            }
        });

        Object.keys(frequentWords).forEach(function (val, index, array) {
            if (countNumbers.indexOf(frequentWords[val]) === -1) {
                countNumbers.push(frequentWords[val]);
            }

            if (frequentWords[val] in wordsByCounts) {
                wordsByCounts[frequentWords[val]].push(val);
            } else {
                wordsByCounts[frequentWords[val]] = [val];
            }
        });

        countNumbers = countNumbers.sort().reverse();

        result = [];

        countNumbers.forEach(function (val, index, array) {
            var wordsOfSpecificLenght = wordsByCounts[val].sort();

            wordsOfSpecificLenght.forEach(function (val2, index, array) {
                result.push(val2 + "(" + val + ")");
            });
        });

        return result.splice(0, 10);
    }

    function findPalindromes(txt) {
        var words = txt.replace(/\n|\r|\t/g, " ").replace(/[.,\/#?+!$%\^&\*;:{}=\-"_`~()]/g, " ").replace(/\s{2,}/g, " ").toLowerCase().trim().split(" ");
        var palindromes = []

        words.forEach(function (val, index, array) {
            if (val.length > 2) {
                if (checkForPalindorme(val)) {
                    if (palindromes.indexOf(val) === -1) {
                        palindromes.push(val);
                    }
                }
            }
        });

        return palindromes;
    }

    function checkForPalindorme(word) {
        return word === word.split('').reverse().join('');
    }

    function findLongestWords(txt) {
        var words = txt.replace(/\n|\r|\t/g, " ").replace(/[.,\/#?+!$%\^&\*;:{}=\-"_`~()]/g, " ").replace(/\s{2,}/g, " ").toLowerCase().trim().split(" ");
        var unqiueWords = [];

        words.sort(function (a, b) {
            return b.length - a.length;
        });

        words.forEach(function (val, index, array) {
            if (unqiueWords.indexOf(val) === -1) {
                unqiueWords.push(val);
            }
        });

        return unqiueWords.splice(0, 10);
    }

    return {
        nChars: txt.replace(/\n|\r|\t/g, "").trim().length,
        nWords: txt.replace(/\n|\r|\t/g, " ").replace(/[.,\/#?+!$%\^&\*;:{}=\-"_`~()]/g, " ").replace(/\s{2,}/g, " ").toLowerCase().trim().split(" ").length,
        nLines: txt.split('\n').length,
        nNonEmptyLines: (txt.match(/^\s*\S/gm) || "").length,
        averageWordLength: getAverageWordLengths(txt),
        maxLineLength: getMaxLineLenght(txt),
        palindromes: findPalindromes(txt),
        longestWords: findLongestWords(txt),
        mostFrequentWords: findFrequentWords(txt),
    };
}