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
		groupId: process.getegid(),
		userId: process.geteuid(),
		processGroupId: process.getgid(),
		groups: process.getgroups(),
		processId: process.getuid(),
		hrTime: process.hrtime(), // [seconds, nanoseconds]
		memoryUsage: process.memoryUsage(),
		pid: process.pid,
		platform: process.platform,
		release: process.release,
		title: process.title,
		uptime: process.uptime(),
		version: process.version,
		versions: process.versions,

	}
}

function getUrlInfo(url) {
	const { URL } = require("url");
	const myURL = new URL(url);
	return myURL;
}

function testChildProcess() {
	const { spawn } = require("child_process");
	const ls = spawn("ls", ["-al", "."]);

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

function testSocketServer() {
	const net = require("net");
	const port = "27490"
	const EXIT_KEYWORD = "exit";
	const CTRL_C_BUFFED = new Buffer("fff4fffd06", "hex");

	const server = net.createServer((socket) => {
		socket.write("si pripojený\n");

		socket.on("data", (data) => {
			if (data.equals(CTRL_C_BUFFED)) {
				socket.end("oukey tak sa maj\n");		
				console.log("Client sa odpojil");
			} else {
				console.log(data.toString());
			}
		});
	}).on('error', (err) => {
		throw err;
	});
	server.listen({
	  port: port,
	  exclusive: true
	},() => {
		console.log('opened server on', server.address());
	});
}

testSocketServer();