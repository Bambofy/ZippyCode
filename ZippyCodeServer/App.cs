using Bridge;
using System;
using Retyped;

using static Retyped.node;
using static Retyped.node.http;
using static Retyped.node.fs;
using static Retyped.socket_io;
using Console = System.Console;

[assembly: Module(ModuleType.CommonJS, "ZippyCodeModule")]

namespace ZippyCodeServer
{

    public static class ZippyServer
    {
        public static object IO;

        public static void LoadIO(object pIO)
        {
            IO = pIO;
        }

        public static void UserJoinRoom(object pClientSocket, string pUniqueID)
        {
            Console.WriteLine("User has connected.");
            if (!Rooms.RoomExists(pUniqueID))
            {
                Console.WriteLine("Created a room with id {0}", pUniqueID);
                Rooms.CreateRoom(pUniqueID);
            }

            Rooms.JoinRoom(pClientSocket, pUniqueID);
        }

        public static void UserLeaveRoom(object pClientSocket, string pUniqueID)
        {
            Console.WriteLine("User has disconnected!");
            if (Rooms.RoomExists(pUniqueID))
            {
                Rooms.LeaveRoom(pClientSocket, pUniqueID);
            }
        }

        public static void RoomMessage(string pUniqueID, string pMessage)
        {
            Console.WriteLine("Repeating message to entire room...");
            Rooms.GetRoom(pUniqueID).RepeatMessage(pMessage);
        }
    }

    /*
    public class App
    {
        [Init(InitPosition.Top)]
        public static void InitGlobals()
        {
            require.Self("./bridge.js");
        }

        public static void ServerFunc(Retyped.node.http.IncomingMessage req, Retyped.node.http.OutgoingMessage res)
        {
            System.Console.WriteLine("Server received request.");
            res.write("Hello client");
            res.end();
        }

        public static void Main()
        {
            var server = http.createServer(ServerFunc);
            server.listen(3001);

            socket_io.SocketIO.
        }
    }
        */
}