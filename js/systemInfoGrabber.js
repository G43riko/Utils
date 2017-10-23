/*
TODO 
sudo lshw / lshw -short / lshw -html
lscpu
lsblk / lsblk -a
lsusb / lsusb -v
lspci / lspci -v
sudo fdisk -l
sudo dmidecode -t bios / sudo dmidecode -t memory / sudo dmidecode -t system
 */

function getData() {
	function getOsData() {
		const os = require("os");
		return {
			eol: os.EOL,
			arch: os.arch(),
			constants: os.constants,
			cpus: os.cpus(),
			endian: os.endianness(), // big endian/little endian.
			freeMem: os.freemem(), // free memory in bytes
			homedir: os.homedir(),
			hostName: os.hostname(),
			networkInterfaces: os.networkInterfaces(),
			platform: os.platform(),
			release: os.release(),
			tmpDir: os.tmpdir(),
			totalMem: os.totalmem(),
			type: os.type(),
			uptime: os.uptime(),
			userInfo: os.userInfo(),
		};
	}

	function getProcessData() {
		const process = require("process");
		return {
			arch: process.arch,
			argv: process.argv,
			cpuUsage: process.cpuUsage(),
			cwd: process.cwd(),
			env: process.env,
			execArgv: process.execArgv,
			execPath: process.execPath,
			groupId: process.getegid && process.getegid(),
			userId: process.geteuid && process.geteuid(),
			processGroupId: process.getgid && process.getgid(),
			groups: process.getgroups && process.getgroups(),
			processId: process.getuid && process.getuid(),
			hrTime: process.hrtime && process.hrtime(), // [seconds, nanoseconds]
			memoryUsage: process.memoryUsage && process.memoryUsage(),
			pid: process.pid,
			platform: process.platform,
			release: process.release,
			title: process.title,
			uptime: process.uptime(),
			version: process.version,
			versions: process.versions,

		}
    }
    
	function getUsers() {
        const fs = require('fs');
        const PASSWD_FILE = "/etc/passwd";
        if (!fs.existsSync(PASSWD_FILE)) {
            console.error("error: súbor " + PASSWD_FILE + " neexistuje");
			return {};
        }
		const contents = content.split("\n");
		const result = [];
		for(let i=0 ; i<contents.length ; i++) {
			const splitLine = contents[i].split(":");
			result[result.length] = {
				userName: splitLine[0],
				password: splitLine[1],
				userId: splitLine[2],
				groupId: splitLine[3],
				groupIdInfo: splitLine[4],
				homeDirectory: splitLine[5],
				shell: splitLine[6],
			}
		}
		return result;
	}

	function getGroups() {
        const fs = require('fs');
        const GROUP_FILE = "/etc/group";
        if (!fs.existsSync(GROUP_FILE)) {
            console.error("error: súbor " + GROUP_FILE + " neexistuje");
			return {};
        }
		const content = fs.readFileSync(GROUP_FILE).toString();
		const contents = content.split("\n");
		const result = [];
		for(let i=0 ; i<contents.length ; i++) {
			const splitLine = contents[i].split(":");
			result[result.length] = {
				groupName: splitLine[0],
				password: splitLine[1],
				groupId: splitLine[2],
				groupList: splitLine[3] // users list
			}
		}
		return result;
	}

	return {
		os: getOsData(),
		process: getProcessData(),
		users: getUsers(),
		groups: getGroups()
	}
}

function getUrlInfo(url) {
	const { URL } = require("url");
	const myURL = new URL(url);
	return myURL;
}

function testChildProcess() {
	const { spawn } = require("child_process");
	const ls = spawn("ls", ["."]);

	ls.stdout.on("data", (data) => {
	  console.log(`stdout: ${data}`);
	});

	ls.stderr.on("data", (data) => {
	  console.log(`stderr: ${data}`);
	});

	ls.on("close", (code) => {
	  console.log(`child process exited with code ${code}`);
	});
}

function testReadFromLine() {
	var readline = require('readline');
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout,
	  terminal: false
	});

	rl.on('line', function(line){
	    console.log("precitane: ", line);
	    if(line === "reset") {
			process.stdout.write('\033c');
	    }
	    if(line === "clean") {
	    	process.stdout.clearLine();
	    }
	})
}

function testSocketServer(options = {}) {
	const net = require("net");
	const EXIT_KEYWORD = "exit";
	const CTRL_C_BUFFER_LINNUX = new Buffer("fff4fffd06", "hex");
	const CTRL_C_BUFFED_WINDOWS = new Buffer("03", "hex");
	const END_LINE_WINDOW = new Buffer("0d0a", "hex");

	options.port = options.port || 8123;
	options.exclusive = typeof options.exclusive === "undefined" ? options.exclusive : true;

	const server = net.createServer((socket) => {
		socket.write("si pripojený\n");

		socket.on("data", (data) => {
			if (data.equals(CTRL_C_BUFFER_LINNUX) || data.equals(CTRL_C_BUFFED_WINDOWS)) {
				socket.end("oukey tak sa maj\n");		
				console.log("Client sa odpojil");
			} else {
				console.log(data.toString(), " == ", data);
			}
			if(data.equals(END_LINE_WINDOW)) {
				console.log("end of line");
			}
		});
	}).on('error', (err) => {
		throw err;
	});
	server.listen({
	  port: options.port,
	  exclusive: options.exclusive
	},() => {
		console.log('opened server on', server.address());
	});
}

function handleEvents() {
	process.exitCode = 1;

	process.on('SIGINT', () => {
		console.log("Oukey tak teda končíme: ", process.exitCode);
		process.exit();
	});


	setTimeout(() => console.log("končíme"), 10000);
}

function testKeyLogger() {
	const { spawn } = require("child_process");
	const ls = spawn("xinput", ["list"]);

	ls.stdout.on("data", (data) => {
	  // console.log("data: ", data.toString());
	  // split by "\n"
	  // najsť riadok obsahujuci master keyboard a najsť tam id=X
	  // zistiť či v /dev/inputs existuje súbor eventX
	  // počúvať súbor /dev/inputs/eventX
	  // pri každej zmene zistiť tlačítko
	});
}

function testLoader() {
	/*
	var twirlTimer = (function() {
	  var P = ["\\", "|", "/", "-"];
	  var x = 0;
	  return setInterval(function() {
	    process.stdout.write("\r" + P[x++]);
	    x &= 3;
	  }, 250);
	})();
	*/
	let counter = 0
	setInterval(() => {
		process.stdout.write("#");
		if(counter++ % (process.stdout.columns )  === 0) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
		}
	}, 25);
}


function killByName(name) {
	const { spawn } = require("child_process");
	const ls = spawn("ps", ["x"]);

	ls.stdout.on("data", (data) => {
		const lines = data.toString().split("\n").filter(line => line.indexOf(name) >= 0);
		if(lines.length === 1) {
			const splitLine = lines[0].replace(/ +/g, " ").split(" ");	
			const pid = splitLine[0];
			const name = splitLine[4];
			console.log("remove", name + " (" + pid +")???");

			process.stdin.on('readable', () => {
			  const chunk = process.stdin.read();
			  if (chunk !== null) {
			    if(chunk.toString() === "ano\n") {
			    	console.log("maze sa");
					process.kill(pid);
			    } else {
			    	console.log("nemaze sa");
			    }
				process.stdin.removeAllListeners("readable");
			  }

			});
		}
	});
}

// testSocketServer();
// testKeyLogger();
// handleEvents();
// testReadFromLine();

// killByName("soffice");


function getLoginUsers() {
	const result = {
		time: new Date().getTime(),
		data: []
	}
	const { spawn } = require("child_process");
	const ls = spawn("w");
	return new Promise((success, reject) => {
		ls.stdout.on("data", (data) => {
			const splitData = data.toString().split("\n");
			for(let i=2 ; i<splitData.length ; i++) {
				const line = splitData[i].replace(/ +/g, " ").split(" ");
				if(line.length < 8) {
					continue;
				}
				result.data[result.data.length] = {
					user: line[0],
					tty: line[1],
					from: line[2],
					login: line[3],
					idle: line[4],
					jcpu: line[5], // time used by all processes attached to the tty.
					pcpu: line[6], // time used by the current process, named in the "what" field.
					what: line[7],
				}
			}
			success(result);
		});
	})
}
