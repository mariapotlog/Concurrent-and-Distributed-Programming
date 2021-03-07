package mariapotlog;

import java.io.IOException;
import java.net.ServerSocket;

public class Main {

    public static void main(String[] args) {
        // server will listen to the port
        try(ServerSocket Socket = new ServerSocket(3000)) {

            // everything is in the while because the server needs to be able to be accessed by many clients
            while(true) {
                // new Thread is created for each client
                new Threads(Socket.accept()).start();
            }

        } catch(IOException err) {
            //print the error message
            System.out.println("Server exception" + err.getMessage());
            err.printStackTrace();
        }
    }
}
