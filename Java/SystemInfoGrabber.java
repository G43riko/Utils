import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.lang.management.RuntimeMXBean;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SystemInfoGrabber {
	static void print(Object obj){
		System.out.println(obj);
	}
	
	public SystemInfoGrabber(){
		//printSystemData();
		//printNetworkData();
		//printRuntimeData();
	}
	
	
	private void runProcess(String script){
		String line;
		try {
			Process p = Runtime.getRuntime().exec(script);
			BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
			while ((line = in.readLine()) != null) {
				System.out.println(line);
			}
			in.close();
			
		} catch (IOException e) {
			print("nepodarilo sa spustiť príkaz: " + script);
			e.printStackTrace();
		}
	}
	private void printNetworkData(){
		String hostname = "Unknown";
		try{
		    InetAddress addr;
		    addr = InetAddress.getLocalHost();
		    hostname = addr.getHostName();
		}
		catch (UnknownHostException ex){
		    System.out.println("Hostname can not be resolved");
		}
		finally{
			print("hostName: " + hostname);
		}
		
		try {
			Enumeration<NetworkInterface> e = NetworkInterface.getNetworkInterfaces();
			while(e.hasMoreElements()){
			    NetworkInterface n = (NetworkInterface) e.nextElement();
			    Enumeration<InetAddress> ee = n.getInetAddresses();
			    while (ee.hasMoreElements()){
			        InetAddress i = (InetAddress) ee.nextElement();
			        print(n.getName() + ": " + i.getHostAddress());
			        
			    }
			}
		} catch (SocketException e1) {
			e1.printStackTrace();
			print("Nepodarilo sa zisiť informácie o IP adresách");
		}
		
	}
	
	private void printRuntimeData(){
		RuntimeMXBean obj = ManagementFactory.getRuntimeMXBean(); 
		print("runtimeName: " + obj.getName());
		print("runtimeUptime: " + obj.getUptime() + "ms");
		
		Runtime r = Runtime.getRuntime();
		print("runtimeFreeMemory: " + r.freeMemory());
		print("runtimeMaxMemory: " + r.maxMemory());
		print("runtimeTotalMemory: " + r.totalMemory());
		
		OperatingSystemMXBean os = ManagementFactory.getOperatingSystemMXBean();
		print("osAvailProcessors: " + os.getAvailableProcessors());
		
		//long memorySize = ((OperatingSystemMXBean) os).getTotalPhysicalMemorySize();
		
	}

	private void printSystemData(){
		//JAVA
		File file = new File(System.getProperty("java.class.path"));
		print("classPath: " + file.getAbsolutePath());
		//OS
		print("osArch: " + System.getProperty("os.arch"));
		print("osName: " + System.getProperty("os.name"));
		print("osVersion: " + System.getProperty("os.version"));
		//USER
		print("userName: " + System.getProperty("user.name"));
		print("userHome: " + System.getProperty("user.home"));
		print("uptime: " + getSystemUptime() + "ms");
	}

	private static long getSystemUptime(){
        long uptime = -1;
		try{
	        String os = System.getProperty("os.name").toLowerCase();
	        if (os.contains("win")) {
	            Process uptimeProc = Runtime.getRuntime().exec("net stats srv");
	            BufferedReader in = new BufferedReader(new InputStreamReader(uptimeProc.getInputStream()));
	            String line;
	            while ((line = in.readLine()) != null) {
	                if (line.startsWith("Statistics since")) {
	                    SimpleDateFormat format = new SimpleDateFormat("'Statistics since' MM/dd/yyyy hh:mm:ss a");
	                    Date boottime = format.parse(line);
	                    uptime = System.currentTimeMillis() - boottime.getTime();
	                    break;
	                }
	            }
	        } else if (os.contains("mac") || os.contains("nix") || os.contains("nux") || os.contains("aix")) {
	            Process uptimeProc = Runtime.getRuntime().exec("uptime");
	            BufferedReader in = new BufferedReader(new InputStreamReader(uptimeProc.getInputStream()));
	            String line = in.readLine();
	            if (line != null) {
	                Pattern parse = Pattern.compile("((\\d+) days,)? (\\d+):(\\d+)");
	                Matcher matcher = parse.matcher(line);
	                if (matcher.find()) {
	                    String _days = matcher.group(2);
	                    String _hours = matcher.group(3);
	                    String _minutes = matcher.group(4);
	                    int days = _days != null ? Integer.parseInt(_days) : 0;
	                    int hours = _hours != null ? Integer.parseInt(_hours) : 0;
	                    int minutes = _minutes != null ? Integer.parseInt(_minutes) : 0;
	                    uptime = TimeUnit.MILLISECONDS.convert(days, TimeUnit.DAYS) +
	                            TimeUnit.MILLISECONDS.convert(hours, TimeUnit.HOURS) +
	                            TimeUnit.MILLISECONDS.convert(minutes, TimeUnit.MINUTES);
	                }
	            }
	        }
        }
		catch(Exception e){}
		
        return uptime;
    }
	
	public static void main(String [] args){
		new SystemInfoGrabber();
	}
}
