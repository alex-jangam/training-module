/*globals require, module, console, exports */
/*jslint node: true */
"use strict";
var fs = require("fs");
var version;



function updateVersion() {
    var newVersion = JSON.stringify({version : version.join(".")});
    fs.writeFile("./src/version/usedversion.json", newVersion, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Updated version : ", version.join("."));
    });
}
function writeIndex(newIndex) {
    fs.writeFile("./dist/index.html", newIndex, function (err) {
        if (err) {
            return console.log("Error in reading index in dist folder, please make sure code is build properly");
        }
				updateVersion();
    });
}


function readIndex() {
    fs.readFile("./dist/index.html", "utf8", function (err, data) {
        var newIndex;
        if (err) {
            return console.log("Error in reading index in dist folder, please make sure code is build properly");
        }
        version[2] = parseInt(version[2], 10) + 1;
        newIndex = data.split("bundle.js").join("bundle.js?version=" + version.join("."));
        writeIndex(newIndex);
    });
}

function getUIVersion() {
		fs.readFile("./src/version/usedversion.json", "utf8", function (err, data) {
				if (err) {
						return console.log("Error", err);
				}
				version = JSON.parse(data).version.split(".");
				readIndex();
		});
}

getUIVersion()
// readIndex();
