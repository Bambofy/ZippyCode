using Bridge;
using Console = System.Console;
using System.Collections.Generic;

namespace ZippyCodeServer
{
    public static class Rooms
    {
        private static Dictionary<string, Room> _rooms = new Dictionary<string, Room>();

        public static void CreateRoom(string pUnqiueId)
        {
            _rooms.Add(pUnqiueId, new Room(pUnqiueId));
        }

        public static void JoinRoom(object pClientSocket, string pUniqueId)
        {
            Script.Call("pClientSocket.join", pUniqueId);

            Room joinedRoom = Rooms.GetRoom(pUniqueId);
            joinedRoom.UserJoined(pClientSocket);

            Console.WriteLine("User has joined room {0}", pUniqueId);
        }

        public static void LeaveRoom(object pClientSocket, string pUniqueId)
        {
            Room room = GetRoom(pUniqueId);
            int numConnections = room.NumberOfConnections;

            room.UserLeft(pClientSocket);

            if (numConnections == 1)
            {
                Console.WriteLine("Room has been destroyed");
                Rooms.DeleteRoom(pUniqueId);
            }
        }

        public static bool RoomExists(string pUniqueId)
        {
            return _rooms.ContainsKey(pUniqueId);
        }

        public static Room GetRoom(string pUniqueId)
        {
            if (RoomExists(pUniqueId))
            {
                return _rooms[pUniqueId];
            }
            else
            {
                return null;
            }
        }


        public static void DeleteRoom(string pUniqueId)
        {
            GetRoom(pUniqueId).Destroy();

            _rooms.Remove(pUniqueId);
        }


        public static int GetRoomCount()
        {
            return _rooms.Count;
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