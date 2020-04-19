const chokidar = require('chokidar');
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
	//console.log(filestatus);
	const str = "./";
	const starting_part = "{ \"events\": [";
	const ending_part = "]}";
	var OTF_Final = "";
	
	var OTF_File_Path = str.concat(filepath.replace(/\\/g, "\/"));
	//console.log(OTF_File_Path);
	
	fs.readFile(OTF_File_Path, (err, data) => { 
		//if (err) throw err; 
		var OTF_coor = data.toString(); 
		OTF_Final = starting_part.concat(OTF_coor, ending_part);
		
		fs.writeFile(OTFfile, OTF_Final, {encoding:'utf8', flag:'w'}, (err) => {
			//if (err) throw err;
			console.log(' OTF_File.txt updated..');
		});
	});
});
