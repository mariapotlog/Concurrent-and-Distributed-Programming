package mariapotlog;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class Threads extends Thread{
    private Socket socket;

    public Threads(Socket socket) {
        // new socket will be created when client will connect
        this.socket = socket;
    }

    @Override
    public void run() {
        try{
            // get input from the client
            InputStreamReader inputReader = new InputStreamReader(socket.getInputStream());
            BufferedReader input = new BufferedReader(inputReader);
            // the output object helps us deliver the response to client
            // the autoFlush true ensures that the application actually sends data
            PrintWriter output = new PrintWriter(socket.getOutputStream(), true);

            while(true) {
                // we store in the message string the input from the client
                String message = input.readLine();
                System.out.println("Message received from client is: " + message);
                // we set 7 seconds to wait in order to reply to the client
                try {
                    Thread.sleep(4000);
                } catch(InterruptedException err) {
                    System.out.println("One Thread less");
                }
                // we send to the client the message previously received
                output.println(message);
            }
        } catch(IOException err) {
            System.out.println("ERROR: " + err.getMessage());
        } finally {
            try {
                socket.close();
            } catch(IOException err) {
                System.out.println("ERROR: " + err.getMessage());
            }
        }
    }
}