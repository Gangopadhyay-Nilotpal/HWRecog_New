
const express = require("express");
const fsEx = require('fs-extra');
const path = require('path');
const fs = require('fs');

const fname = './WebPage/user_keys.txt';
const jsonPath = './WebPage/user_keys_R.json'
const OTF_Folder_Path = './../OTF_Files';
const OTF_Text = './WebPage/OTF_File.txt';
const ExpRes = './WebPage/ExpResData.txt';

var pre_file_nos = 0;
var cur_file_nos = 0;

console.log('='.repeat(106));
var array = fs.readFileSync(fname).toString().split("\n");

toJson = {
    "applicationKey": (array[0].split(": ")[1]).slice(1,-2),
    "hmacKey": (array[1].split(": ")[1]).slice(1,-1)
};

var jsonCont = JSON.stringify(toJson);
console.log(jsonCont);

fs.exists(jsonPath, (exists) => {
	if (exists === true) { 
	
		fs.unlink(jsonPath, (err) => {
          //if (err) throw err;
		  console.log(" Old user_keys_R.json File - Deleted!");
	    });		
	}
	
	fs.writeFile(jsonPath, jsonCont, 'utf8', (err) => {	
        //if (err) throw err; 
        console.log(" New user_keys_R.json File - Created.");
    });
});

console.log(' indexLocal running...');
console.log('='.repeat(106));

const app = express();
app.use(express.static("./WebPage"));

app.get("/", (req, res) => {
	res.sendFile(path.resolve("./WebPage/pointer_events_workon.html"));
});

app.get("/read_OTF_File_txt", (req, res) => {
	
	fs.readdir(OTF_Folder_Path, function (err, files) { 
		//if (err) throw err;
		cur_file_nos = files.length; 
	//});
	
	//fs.access(OTF_Text, fs.constants.F_OK, (err) => {
		//if (err) throw err;
		//var stats = fs.statSync(OTF_Text);
		//var file_cur_size = stats.size; // File Size In Bytes
	try {	
		if ((pre_file_nos != cur_file_nos) && (fs.existsSync(OTF_Text))) {			
			res.sendFile(path.resolve(OTF_Text));
			pre_file_nos = cur_file_nos;
		} else {	
			res.json({
				status: "Updated.."
			});
		}
	} catch (e) {
		res.json({
			status: "Updated.."
		});
	}
	});
});

app.post('/receiveER', function(req, res) {
	var resData = "[" + req.query.resString + "], ";
	if (resData != '[""], ') {
		fs.appendFile(ExpRes, resData, (err) => {
		  // if (err) throw err;
		  res.json({
				status: "Appended"
			});
		});
	}
});

app.delete("/delete_all_old_OTF_Files", function (req, res) {
	file_pre_size = 0;
    file_cur_size = 0;
	try {
		fsEx.emptyDirSync(OTF_Folder_Path);
		fsEx.removeSync(OTF_Text);
	}
	catch (e){
	}
	res.json({
		status: "Done"
	});
});

app.listen(3333, () => { console.log(" Server started on [Port : 3333] ..."); });

//liveServer.start({"host": "localhost", "port": 3333, "open":"/WebPage/pointer_events_workon.html"});