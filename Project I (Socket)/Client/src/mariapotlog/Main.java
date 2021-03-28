package mariapotlog;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        try(Socket socket = new Socket("localhost", 3000)) {

            // terminate the client application if it does not respond in 5 seconds
            socket.setSoTimeout(5000);

            // getting the input from the server
            InputStreamReader inputReader = new InputStreamReader(socket.getInputStream());
            BufferedReader input = new BufferedReader(inputReader);
            //  sending output to server
            PrintWriter output = new PrintWriter(socket.getOutputStream(), true);

            Scanner scanner = new Scanner(System.in);
            String message;
            String response;

            do {
                System.out.println("Enter string to be sent: ");
                // read string from console
                message = scanner.nextLine();

                output.println(message);

                if(!message.equals("exit")) {
                    response = input.readLine();
                    System.out.println(response);
                }
            } while (!message.equals("exit"));

        } catch(SocketTimeoutException err) {
            System.out.println("Socket timed out because: " + err);
        } catch(IOException err) {
            System.out.println("Client Error: " + err.getMessage());
        }
    }
}