const chokidar = require('chokidar');
const fileconcat = require('concat-files');
const fsExtra = require('fs-extra');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

const OTFstor = './../OTF_Files';
const OTFfile = './../LocalIndex/WebPage/OTF_File.txt';

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
		console.log(' OTF_File.txt updated..');
		//---------------------------------------------------------
		for (var i = 0; i < OTF_array.length; i++) {
			
			if (i > 0) {
				fs.readFile(OTFstor.concat("/", OTF_array[i]), (err, data) => {
					//if (err) throw err;
					var comma = ", ";
					var more_file = data.toString();
					fs.writeFileSync(OTFfile, comma.concat(more_file), {encoding:'utf8', flag:'a'});
				});
			} 
			else if (i == 0) {
				fs.readFile(OTFstor.concat("/", OTF_array[i]), (err, data) => {
					//if (err) throw err;
					var prefix_part = "{ \"events\": [";
					var first_file = data.toString();
					fs.writeFileSync(OTFfile, prefix_part.concat(first_file), {encoding:'utf8', flag:'w'});
				});
			}
			
		}
		//---------------------------------------------------------
	});
	//=========================================================
});