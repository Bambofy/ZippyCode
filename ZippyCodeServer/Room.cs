using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ZippyCodeServer
{
    public class Room
    {
        public string UniqueID;
        public int NumberOfConnections
        {
            get
            {
                return Sockets.Count;
            }
        }

        public List<object> Sockets = new List<object>();

        public Room(string pUniqueID)
        {
            UniqueID = pUniqueID;
        }

        public void UserJoined(object pClientSocket)
        {
            SyncClients();

            Sockets.Add(pClientSocket);
            this.SendWelcomeMessage();
        }

        public void UserLeft(object pClientSocket)
        {
            Sockets.Remove(pClientSocket);
            this.SendExitMessage();
        }

        public void SyncClients()
        {
            // if we are NOT the first person joining the room.
            Console.WriteLine("Number of connections: {0}", NumberOfConnections);
            if (NumberOfConnections > 0)
            {
                var clientSocket = Sockets.First<object>(); // select an existing client

                Send(clientSocket, "TriggerSendToServer", ""); // request data from existing client.
            }
        }

        public void RepeatMessage(string pMessage)
        {
            Broadcast("ToClientText", pMessage);
        }

        public void SendExitMessage()
        {
            Broadcast("SystemMessage", "Somebody has left the room!");
        }

        public void SendWelcomeMessage()
        {
            Broadcast("SystemMessage", "Somebody has joined the room, welcome!");
        }

        public void Destroy()
        {
        }

        private void Broadcast(string pEvent, string pMessage)
        {
            Script.Call("ZippyCodeModule.ZippyCodeServer.ZippyServer.IO.to(this.UniqueID).emit", pEvent, pMessage);
        }

        private void Send(object pClientSocket, string pEvent, string pMessage)
        {
            Script.Call("pClientSocket.emit", pEvent, pMessage);
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