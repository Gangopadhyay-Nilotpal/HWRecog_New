const chokidar = require('chokidar');
const fileconcat = require('concat-files');
const fsExtra = require('fs-extra');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

const OTFstor = './../OTF_Files';
const OTFfile = './../LocalIndex/WebPage/OTF_File.txt';

//const starting_part = "{ \"events\": [";
//const ending_part = "]}";

if (fs.existsSync(OTFstor)){ 
	fsExtra.emptyDirSync(OTFstor);
	console.log(' Old OTF files are Deleted from "OTF_Files" folder..');
}

if (!fs.existsSync(OTFstor)){ 
	fs.mkdirSync(OTFstor);
	console.log(' New "OTF_Files" folder has created..');
}

fs.exists(OTFfile, (exists) => {
	if (exists === true) { 	
		fs.unlink(OTFfile, (err) => {
          //if (err) throw err;
		  console.log(' Old OTF_File.txt - Deleted!!');
	    });
	}
});

// One-liner for current directory
chokidar.watch(OTFstor).on('add', (filepath, filestatus) => {
	//console.log(filepath);
	fs.exists(OTFfile, (exists) => {
		if (exists === true) {
			fs.unlink(OTFfile, (err) => {
			  //if (err) throw err;
			});
		}
	});
	
	//=========================================================
	fs.readdir(OTFstor, (err, files) => {
		//if (err) throw err;
		var OTF_array = [];
		var count = 0;

		files.forEach((file) => {
			OTF_array.push(file);
			OTF_array.sort();
		});
		
		fs.writeFileSync(OTFfile, "{ \"events\": [", {encoding:'utf8', flag:'w'});
		
		//---------------------------------------------------------
		for (var i = 0; i < OTF_array.length; i++) {
			
			if (((OTF_array.length - 1) == i) && (OTF_array.length == (i + 1))) {
				fs.readFile(OTFstor.concat("/", OTF_array[i]), (err, data) => {
					//if (err) throw err;
					var end_bracks = " ]}";
					var last_file = data.toString();
					fs.writeFileSync(OTFfile, last_file.concat(end_bracks), {encoding:'utf8', flag:'a'});
					console.log(' OTF_File.txt updated..');
				});
			}
			else if ((i < (OTF_array.length - 1)) && ((OTF_array.length - 1) != i)) {
				fs.readFile(OTFstor.concat("/", OTF_array[i]), (err, data) => {
					//if (err) throw err;
					var comma = ", ";
					var more_file = data.toString();
					fs.writeFileSync(OTFfile, more_file.concat(comma), {encoding:'utf8', flag:'a'});
				});
			}
			
		}
		//---------------------------------------------------------
	});
	//=========================================================
});