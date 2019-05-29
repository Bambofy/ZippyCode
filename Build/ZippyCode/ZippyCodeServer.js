/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.7.0
 */
Bridge.assembly("ZippyCodeServer", function ($asm, globals) {
    "use strict";

    (function () {
        var ZippyCodeModule = { };
        Bridge.define("ZippyCodeServer.Room", {
            $metadata : function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[System.String],"pi":[{"n":"pUniqueID","pt":System.String,"ps":0}],"sn":"ctor"},{"a":1,"n":"Broadcast","t":8,"pi":[{"n":"pEvent","pt":System.String,"ps":0},{"n":"pMessage","pt":System.String,"ps":1}],"sn":"Broadcast","rt":System.Void,"p":[System.String,System.String]},{"a":2,"n":"Destroy","t":8,"sn":"Destroy","rt":System.Void},{"a":2,"n":"RepeatMessage","t":8,"pi":[{"n":"pMessage","pt":System.String,"ps":0}],"sn":"RepeatMessage","rt":System.Void,"p":[System.String]},{"a":1,"n":"Send","t":8,"pi":[{"n":"pClientSocket","pt":System.Object,"ps":0},{"n":"pEvent","pt":System.String,"ps":1},{"n":"pMessage","pt":System.String,"ps":2}],"sn":"Send","rt":System.Void,"p":[System.Object,System.String,System.String]},{"a":2,"n":"SendExitMessage","t":8,"sn":"SendExitMessage","rt":System.Void},{"a":2,"n":"SendWelcomeMessage","t":8,"sn":"SendWelcomeMessage","rt":System.Void},{"a":2,"n":"SyncClients","t":8,"sn":"SyncClients","rt":System.Void},{"a":2,"n":"UserJoined","t":8,"pi":[{"n":"pClientSocket","pt":System.Object,"ps":0}],"sn":"UserJoined","rt":System.Void,"p":[System.Object]},{"a":2,"n":"UserLeft","t":8,"pi":[{"n":"pClientSocket","pt":System.Object,"ps":0}],"sn":"UserLeft","rt":System.Void,"p":[System.Object]},{"a":2,"n":"NumberOfConnections","t":16,"rt":System.Int32,"g":{"a":2,"n":"get_NumberOfConnections","t":8,"rt":System.Int32,"fg":"NumberOfConnections","box":function ($v) { return Bridge.box($v, System.Int32);}},"fn":"NumberOfConnections"},{"a":2,"n":"Sockets","t":4,"rt":System.Collections.Generic.List$1(System.Object),"sn":"Sockets"},{"a":2,"n":"UniqueID","t":4,"rt":System.String,"sn":"UniqueID"}]}; },
            $scope: ZippyCodeModule,
            $module: "ZippyCodeModule",
            fields: {
                UniqueID: null,
                Sockets: null
            },
            props: {
                NumberOfConnections: {
                    get: function () {
                        return this.Sockets.Count;
                    }
                }
            },
            ctors: {
                init: function () {
                    this.Sockets = new (System.Collections.Generic.List$1(System.Object)).ctor();
                },
                ctor: function (pUniqueID) {
                    this.$initialize();
                    this.UniqueID = pUniqueID;
                }
            },
            methods: {
                UserJoined: function (pClientSocket) {
                    this.SyncClients();

                    this.Sockets.add(pClientSocket);
                    this.SendWelcomeMessage();
                },
                UserLeft: function (pClientSocket) {
                    this.Sockets.remove(pClientSocket);
                    this.SendExitMessage();
                },
                SyncClients: function () {
                    System.Console.WriteLine(System.String.format("Number of connections: {0}", Bridge.box(this.NumberOfConnections, System.Int32)));
                    if (this.NumberOfConnections > 0) {
                        var clientSocket = System.Linq.Enumerable.from(this.Sockets).first();

                        this.Send(clientSocket, "TriggerSendToServer", "");
                    }
                },
                RepeatMessage: function (pMessage) {
                    this.Broadcast("ToClientText", pMessage);
                },
                SendExitMessage: function () {
                    this.Broadcast("SystemMessage", "Somebody has left the room!");
                },
                SendWelcomeMessage: function () {
                    this.Broadcast("SystemMessage", "Somebody has joined the room, welcome!");
                },
                Destroy: function () { },
                Broadcast: function (pEvent, pMessage) {
                    ZippyCodeModule.ZippyCodeServer.ZippyServer.IO.to(this.UniqueID).emit(pEvent, pMessage);
                },
                Send: function (pClientSocket, pEvent, pMessage) {
                    pClientSocket.emit(pEvent, pMessage);
                }
            }
        });

        Bridge.define("ZippyCodeServer.Rooms", {
            $metadata : function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"CreateRoom","is":true,"t":8,"pi":[{"n":"pUnqiueId","pt":System.String,"ps":0}],"sn":"CreateRoom","rt":System.Void,"p":[System.String]},{"a":2,"n":"DeleteRoom","is":true,"t":8,"pi":[{"n":"pUniqueId","pt":System.String,"ps":0}],"sn":"DeleteRoom","rt":System.Void,"p":[System.String]},{"a":2,"n":"GetRoom","is":true,"t":8,"pi":[{"n":"pUniqueId","pt":System.String,"ps":0}],"sn":"GetRoom","rt":ZippyCodeModule.ZippyCodeServer.Room,"p":[System.String]},{"a":2,"n":"GetRoomCount","is":true,"t":8,"sn":"GetRoomCount","rt":System.Int32,"box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"JoinRoom","is":true,"t":8,"pi":[{"n":"pClientSocket","pt":System.Object,"ps":0},{"n":"pUniqueId","pt":System.String,"ps":1}],"sn":"JoinRoom","rt":System.Void,"p":[System.Object,System.String]},{"a":2,"n":"LeaveRoom","is":true,"t":8,"pi":[{"n":"pClientSocket","pt":System.Object,"ps":0},{"n":"pUniqueId","pt":System.String,"ps":1}],"sn":"LeaveRoom","rt":System.Void,"p":[System.Object,System.String]},{"a":2,"n":"RoomExists","is":true,"t":8,"pi":[{"n":"pUniqueId","pt":System.String,"ps":0}],"sn":"RoomExists","rt":System.Boolean,"p":[System.String],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_rooms","is":true,"t":4,"rt":System.Collections.Generic.Dictionary$2(System.String,ZippyCodeModule.ZippyCodeServer.Room),"sn":"_rooms"}]}; },
            $scope: ZippyCodeModule,
            $module: "ZippyCodeModule",
            statics: {
                fields: {
                    _rooms: null
                },
                ctors: {
                    init: function () {
                        this._rooms = new (System.Collections.Generic.Dictionary$2(System.String,ZippyCodeModule.ZippyCodeServer.Room)).ctor();
                    }
                },
                methods: {
                    CreateRoom: function (pUnqiueId) {
                        ZippyCodeModule.ZippyCodeServer.Rooms._rooms.add(pUnqiueId, new ZippyCodeModule.ZippyCodeServer.Room(pUnqiueId));
                    },
                    JoinRoom: function (pClientSocket, pUniqueId) {
                        pClientSocket.join(pUniqueId);

                        var joinedRoom = ZippyCodeModule.ZippyCodeServer.Rooms.GetRoom(pUniqueId);
                        joinedRoom.UserJoined(pClientSocket);

                        System.Console.WriteLine(System.String.format("User has joined room {0}", pUniqueId));
                    },
                    LeaveRoom: function (pClientSocket, pUniqueId) {
                        var room = ZippyCodeModule.ZippyCodeServer.Rooms.GetRoom(pUniqueId);
                        var numConnections = room.NumberOfConnections;

                        room.UserLeft(pClientSocket);

                        if (numConnections === 1) {
                            System.Console.WriteLine("Room has been destroyed");
                            ZippyCodeModule.ZippyCodeServer.Rooms.DeleteRoom(pUniqueId);
                        }
                    },
                    RoomExists: function (pUniqueId) {
                        return ZippyCodeModule.ZippyCodeServer.Rooms._rooms.containsKey(pUniqueId);
                    },
                    GetRoom: function (pUniqueId) {
                        if (ZippyCodeModule.ZippyCodeServer.Rooms.RoomExists(pUniqueId)) {
                            return ZippyCodeModule.ZippyCodeServer.Rooms._rooms.getItem(pUniqueId);
                        } else {
                            return null;
                        }
                    },
                    DeleteRoom: function (pUniqueId) {
                        ZippyCodeModule.ZippyCodeServer.Rooms.GetRoom(pUniqueId).Destroy();

                        ZippyCodeModule.ZippyCodeServer.Rooms._rooms.remove(pUniqueId);
                    },
                    GetRoomCount: function () {
                        return ZippyCodeModule.ZippyCodeServer.Rooms._rooms.Count;
                    }
                }
            }
        });

        Bridge.define("ZippyCodeServer.ZippyServer", {
            $metadata : function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"LoadIO","is":true,"t":8,"pi":[{"n":"pIO","pt":System.Object,"ps":0}],"sn":"LoadIO","rt":System.Void,"p":[System.Object]},{"a":2,"n":"RoomMessage","is":true,"t":8,"pi":[{"n":"pUniqueID","pt":System.String,"ps":0},{"n":"pMessage","pt":System.String,"ps":1}],"sn":"RoomMessage","rt":System.Void,"p":[System.String,System.String]},{"a":2,"n":"UserJoinRoom","is":true,"t":8,"pi":[{"n":"pClientSocket","pt":System.Object,"ps":0},{"n":"pUniqueID","pt":System.String,"ps":1}],"sn":"UserJoinRoom","rt":System.Void,"p":[System.Object,System.String]},{"a":2,"n":"UserLeaveRoom","is":true,"t":8,"pi":[{"n":"pClientSocket","pt":System.Object,"ps":0},{"n":"pUniqueID","pt":System.String,"ps":1}],"sn":"UserLeaveRoom","rt":System.Void,"p":[System.Object,System.String]},{"a":2,"n":"IO","is":true,"t":4,"rt":System.Object,"sn":"IO"}]}; },
            $scope: ZippyCodeModule,
            $module: "ZippyCodeModule",
            statics: {
                fields: {
                    IO: null
                },
                methods: {
                    LoadIO: function (pIO) {
                        ZippyCodeModule.ZippyCodeServer.ZippyServer.IO = pIO;
                    },
                    UserJoinRoom: function (pClientSocket, pUniqueID) {
                        System.Console.WriteLine("User has connected.");
                        if (!ZippyCodeModule.ZippyCodeServer.Rooms.RoomExists(pUniqueID)) {
                            System.Console.WriteLine(System.String.format("Created a room with id {0}", pUniqueID));
                            ZippyCodeModule.ZippyCodeServer.Rooms.CreateRoom(pUniqueID);
                        }

                        ZippyCodeModule.ZippyCodeServer.Rooms.JoinRoom(pClientSocket, pUniqueID);
                    },
                    UserLeaveRoom: function (pClientSocket, pUniqueID) {
                        System.Console.WriteLine("User has disconnected!");
                        if (ZippyCodeModule.ZippyCodeServer.Rooms.RoomExists(pUniqueID)) {
                            ZippyCodeModule.ZippyCodeServer.Rooms.LeaveRoom(pClientSocket, pUniqueID);
                        }
                    },
                    RoomMessage: function (pUniqueID, pMessage) {
                        System.Console.WriteLine("Repeating message to entire room...");
                        ZippyCodeModule.ZippyCodeServer.Rooms.GetRoom(pUniqueID).RepeatMessage(pMessage);
                    }
                }
            }
        });
        module.exports.ZippyCodeModule = ZippyCodeModule;
    }) ();

});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJaaXBweUNvZGVTZXJ2ZXIuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIlJvb20uY3MiLCJSb29tcy5jcyIsIkFwcC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQWNnQkEsT0FBT0E7Ozs7OzttQ0FJZUEsS0FBSUE7O2dDQUV0QkE7O29CQUVSQSxnQkFBV0E7Ozs7c0NBR1FBO29CQUVuQkE7O29CQUVBQSxpQkFBWUE7b0JBQ1pBOztvQ0FHaUJBO29CQUVqQkEsb0JBQWVBO29CQUNmQTs7O29CQU1BQSw0RUFBZ0RBO29CQUNoREEsSUFBSUE7d0JBRUFBLG1CQUFtQkE7O3dCQUVuQkEsVUFBS0E7Ozt5Q0FJYUE7b0JBRXRCQSwrQkFBMEJBOzs7b0JBSzFCQTs7O29CQUtBQTs7O3FDQU9tQkEsUUFBZUE7b0JBRWxDQSxzRUFBcUZBLFFBQVFBOztnQ0FHL0VBLGVBQXNCQSxRQUFlQTtvQkFFbkRBLG1CQUFrQ0EsUUFBUUE7Ozs7Ozs7Ozs7Ozs7OztzQ0NyRUdBLEtBQUlBOzs7OzBDQUV2QkE7d0JBRTFCQSxpREFBV0EsV0FBV0EsSUFBSUEscUNBQUtBOzt3Q0FHUEEsZUFBc0JBO3dCQUU5Q0EsbUJBQWtDQTs7d0JBRWxDQSxpQkFBa0JBLDhDQUFjQTt3QkFDaENBLHNCQUFzQkE7O3dCQUV0QkEsMEVBQThDQTs7eUNBR3JCQSxlQUFzQkE7d0JBRS9DQSxXQUFZQSw4Q0FBUUE7d0JBQ3BCQSxxQkFBcUJBOzt3QkFFckJBLGNBQWNBOzt3QkFFZEEsSUFBSUE7NEJBRUFBOzRCQUNBQSxpREFBaUJBOzs7MENBSUtBO3dCQUUxQkEsT0FBT0EseURBQW1CQTs7dUNBR0hBO3dCQUV2QkEsSUFBSUEsaURBQVdBOzRCQUVYQSxPQUFPQSxxREFBT0E7OzRCQUlkQSxPQUFPQTs7OzBDQUtlQTt3QkFFMUJBLDhDQUFRQTs7d0JBRVJBLG9EQUFjQTs7O3dCQU1kQSxPQUFPQTs7Ozs7Ozs7Ozs7Ozs7O3NDQ3JEZUE7d0JBRXRCQSxpREFBS0E7OzRDQUd1QkEsZUFBc0JBO3dCQUVsREE7d0JBQ0FBLElBQUlBLENBQUNBLGlEQUFpQkE7NEJBRWxCQSw0RUFBZ0RBOzRCQUNoREEsaURBQWlCQTs7O3dCQUdyQkEsK0NBQWVBLGVBQWVBOzs2Q0FHREEsZUFBc0JBO3dCQUVuREE7d0JBQ0FBLElBQUlBLGlEQUFpQkE7NEJBRWpCQSxnREFBZ0JBLGVBQWVBOzs7MkNBSVJBLFdBQWtCQTt3QkFFN0NBO3dCQUNBQSw4Q0FBY0EseUJBQXlCQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG5cclxubmFtZXNwYWNlIFppcHB5Q29kZVNlcnZlclxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUm9vbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgVW5pcXVlSUQ7XHJcbiAgICAgICAgcHVibGljIGludCBOdW1iZXJPZkNvbm5lY3Rpb25zXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNvY2tldHMuQ291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBMaXN0PG9iamVjdD4gU29ja2V0cyA9IG5ldyBMaXN0PG9iamVjdD4oKTtcclxuXHJcbiAgICAgICAgcHVibGljIFJvb20oc3RyaW5nIHBVbmlxdWVJRClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFVuaXF1ZUlEID0gcFVuaXF1ZUlEO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVXNlckpvaW5lZChvYmplY3QgcENsaWVudFNvY2tldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN5bmNDbGllbnRzKCk7XHJcblxyXG4gICAgICAgICAgICBTb2NrZXRzLkFkZChwQ2xpZW50U29ja2V0KTtcclxuICAgICAgICAgICAgdGhpcy5TZW5kV2VsY29tZU1lc3NhZ2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVzZXJMZWZ0KG9iamVjdCBwQ2xpZW50U29ja2V0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU29ja2V0cy5SZW1vdmUocENsaWVudFNvY2tldCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VuZEV4aXRNZXNzYWdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTeW5jQ2xpZW50cygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBpZiB3ZSBhcmUgTk9UIHRoZSBmaXJzdCBwZXJzb24gam9pbmluZyB0aGUgcm9vbS5cclxuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJOdW1iZXIgb2YgY29ubmVjdGlvbnM6IHswfVwiLCBOdW1iZXJPZkNvbm5lY3Rpb25zKTtcclxuICAgICAgICAgICAgaWYgKE51bWJlck9mQ29ubmVjdGlvbnMgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50U29ja2V0ID0gU29ja2V0cy5GaXJzdDxvYmplY3Q+KCk7IC8vIHNlbGVjdCBhbiBleGlzdGluZyBjbGllbnRcclxuXHJcbiAgICAgICAgICAgICAgICBTZW5kKGNsaWVudFNvY2tldCwgXCJUcmlnZ2VyU2VuZFRvU2VydmVyXCIsIFwiXCIpOyAvLyByZXF1ZXN0IGRhdGEgZnJvbSBleGlzdGluZyBjbGllbnQuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlcGVhdE1lc3NhZ2Uoc3RyaW5nIHBNZXNzYWdlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQnJvYWRjYXN0KFwiVG9DbGllbnRUZXh0XCIsIHBNZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNlbmRFeGl0TWVzc2FnZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBCcm9hZGNhc3QoXCJTeXN0ZW1NZXNzYWdlXCIsIFwiU29tZWJvZHkgaGFzIGxlZnQgdGhlIHJvb20hXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU2VuZFdlbGNvbWVNZXNzYWdlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEJyb2FkY2FzdChcIlN5c3RlbU1lc3NhZ2VcIiwgXCJTb21lYm9keSBoYXMgam9pbmVkIHRoZSByb29tLCB3ZWxjb21lIVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERlc3Ryb3koKVxyXG4gICAgICAgIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBCcm9hZGNhc3Qoc3RyaW5nIHBFdmVudCwgc3RyaW5nIHBNZXNzYWdlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2NyaXB0LkNhbGwoXCJaaXBweUNvZGVNb2R1bGUuWmlwcHlDb2RlU2VydmVyLlppcHB5U2VydmVyLklPLnRvKHRoaXMuVW5pcXVlSUQpLmVtaXRcIiwgcEV2ZW50LCBwTWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgU2VuZChvYmplY3QgcENsaWVudFNvY2tldCwgc3RyaW5nIHBFdmVudCwgc3RyaW5nIHBNZXNzYWdlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2NyaXB0LkNhbGwoXCJwQ2xpZW50U29ja2V0LmVtaXRcIiwgcEV2ZW50LCBwTWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICBwdWJsaWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgW0luaXQoSW5pdFBvc2l0aW9uLlRvcCldXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEluaXRHbG9iYWxzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlcXVpcmUuU2VsZihcIi4vYnJpZGdlLmpzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNlcnZlckZ1bmMoUmV0eXBlZC5ub2RlLmh0dHAuSW5jb21pbmdNZXNzYWdlIHJlcSwgUmV0eXBlZC5ub2RlLmh0dHAuT3V0Z29pbmdNZXNzYWdlIHJlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN5c3RlbS5Db25zb2xlLldyaXRlTGluZShcIlNlcnZlciByZWNlaXZlZCByZXF1ZXN0LlwiKTtcclxuICAgICAgICAgICAgcmVzLndyaXRlKFwiSGVsbG8gY2xpZW50XCIpO1xyXG4gICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoU2VydmVyRnVuYyk7XHJcbiAgICAgICAgICAgIHNlcnZlci5saXN0ZW4oMzAwMSk7XHJcblxyXG4gICAgICAgICAgICBzb2NrZXRfaW8uU29ja2V0SU8uXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgICovXHJcbn0iLCJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIENvbnNvbGUgPSBTeXN0ZW0uQ29uc29sZTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgWmlwcHlDb2RlU2VydmVyXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgUm9vbXNcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBEaWN0aW9uYXJ5PHN0cmluZywgUm9vbT4gX3Jvb21zID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBSb29tPigpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgQ3JlYXRlUm9vbShzdHJpbmcgcFVucWl1ZUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX3Jvb21zLkFkZChwVW5xaXVlSWQsIG5ldyBSb29tKHBVbnFpdWVJZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEpvaW5Sb29tKG9iamVjdCBwQ2xpZW50U29ja2V0LCBzdHJpbmcgcFVuaXF1ZUlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2NyaXB0LkNhbGwoXCJwQ2xpZW50U29ja2V0LmpvaW5cIiwgcFVuaXF1ZUlkKTtcclxuXHJcbiAgICAgICAgICAgIFJvb20gam9pbmVkUm9vbSA9IFJvb21zLkdldFJvb20ocFVuaXF1ZUlkKTtcclxuICAgICAgICAgICAgam9pbmVkUm9vbS5Vc2VySm9pbmVkKHBDbGllbnRTb2NrZXQpO1xyXG5cclxuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJVc2VyIGhhcyBqb2luZWQgcm9vbSB7MH1cIiwgcFVuaXF1ZUlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBMZWF2ZVJvb20ob2JqZWN0IHBDbGllbnRTb2NrZXQsIHN0cmluZyBwVW5pcXVlSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSb29tIHJvb20gPSBHZXRSb29tKHBVbmlxdWVJZCk7XHJcbiAgICAgICAgICAgIGludCBudW1Db25uZWN0aW9ucyA9IHJvb20uTnVtYmVyT2ZDb25uZWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgIHJvb20uVXNlckxlZnQocENsaWVudFNvY2tldCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobnVtQ29ubmVjdGlvbnMgPT0gMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJSb29tIGhhcyBiZWVuIGRlc3Ryb3llZFwiKTtcclxuICAgICAgICAgICAgICAgIFJvb21zLkRlbGV0ZVJvb20ocFVuaXF1ZUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIFJvb21FeGlzdHMoc3RyaW5nIHBVbmlxdWVJZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBfcm9vbXMuQ29udGFpbnNLZXkocFVuaXF1ZUlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgUm9vbSBHZXRSb29tKHN0cmluZyBwVW5pcXVlSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoUm9vbUV4aXN0cyhwVW5pcXVlSWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3Jvb21zW3BVbmlxdWVJZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEZWxldGVSb29tKHN0cmluZyBwVW5pcXVlSWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHZXRSb29tKHBVbmlxdWVJZCkuRGVzdHJveSgpO1xyXG5cclxuICAgICAgICAgICAgX3Jvb21zLlJlbW92ZShwVW5pcXVlSWQpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IEdldFJvb21Db3VudCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gX3Jvb21zLkNvdW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgcHVibGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIFtJbml0KEluaXRQb3NpdGlvbi5Ub3ApXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBJbml0R2xvYmFscygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXF1aXJlLlNlbGYoXCIuL2JyaWRnZS5qc1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTZXJ2ZXJGdW5jKFJldHlwZWQubm9kZS5odHRwLkluY29taW5nTWVzc2FnZSByZXEsIFJldHlwZWQubm9kZS5odHRwLk91dGdvaW5nTWVzc2FnZSByZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTeXN0ZW0uQ29uc29sZS5Xcml0ZUxpbmUoXCJTZXJ2ZXIgcmVjZWl2ZWQgcmVxdWVzdC5cIik7XHJcbiAgICAgICAgICAgIHJlcy53cml0ZShcIkhlbGxvIGNsaWVudFwiKTtcclxuICAgICAgICAgICAgcmVzLmVuZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKFNlcnZlckZ1bmMpO1xyXG4gICAgICAgICAgICBzZXJ2ZXIubGlzdGVuKDMwMDEpO1xyXG5cclxuICAgICAgICAgICAgc29ja2V0X2lvLlNvY2tldElPLlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICAqL1xyXG59IiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFJldHlwZWQ7XHJcbnVzaW5nIENvbnNvbGUgPSBTeXN0ZW0uQ29uc29sZTtcclxuXHJcblthc3NlbWJseTogTW9kdWxlKE1vZHVsZVR5cGUuQ29tbW9uSlMsIFwiWmlwcHlDb2RlTW9kdWxlXCIpXVxyXG5cclxubmFtZXNwYWNlIFppcHB5Q29kZVNlcnZlclxyXG57XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBaaXBweVNlcnZlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgb2JqZWN0IElPO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTG9hZElPKG9iamVjdCBwSU8pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJTyA9IHBJTztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBVc2VySm9pblJvb20ob2JqZWN0IHBDbGllbnRTb2NrZXQsIHN0cmluZyBwVW5pcXVlSUQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIlVzZXIgaGFzIGNvbm5lY3RlZC5cIik7XHJcbiAgICAgICAgICAgIGlmICghUm9vbXMuUm9vbUV4aXN0cyhwVW5pcXVlSUQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIkNyZWF0ZWQgYSByb29tIHdpdGggaWQgezB9XCIsIHBVbmlxdWVJRCk7XHJcbiAgICAgICAgICAgICAgICBSb29tcy5DcmVhdGVSb29tKHBVbmlxdWVJRCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFJvb21zLkpvaW5Sb29tKHBDbGllbnRTb2NrZXQsIHBVbmlxdWVJRCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgVXNlckxlYXZlUm9vbShvYmplY3QgcENsaWVudFNvY2tldCwgc3RyaW5nIHBVbmlxdWVJRClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwiVXNlciBoYXMgZGlzY29ubmVjdGVkIVwiKTtcclxuICAgICAgICAgICAgaWYgKFJvb21zLlJvb21FeGlzdHMocFVuaXF1ZUlEKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUm9vbXMuTGVhdmVSb29tKHBDbGllbnRTb2NrZXQsIHBVbmlxdWVJRCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSb29tTWVzc2FnZShzdHJpbmcgcFVuaXF1ZUlELCBzdHJpbmcgcE1lc3NhZ2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIlJlcGVhdGluZyBtZXNzYWdlIHRvIGVudGlyZSByb29tLi4uXCIpO1xyXG4gICAgICAgICAgICBSb29tcy5HZXRSb29tKHBVbmlxdWVJRCkuUmVwZWF0TWVzc2FnZShwTWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICBwdWJsaWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgW0luaXQoSW5pdFBvc2l0aW9uLlRvcCldXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEluaXRHbG9iYWxzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlcXVpcmUuU2VsZihcIi4vYnJpZGdlLmpzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNlcnZlckZ1bmMoUmV0eXBlZC5ub2RlLmh0dHAuSW5jb21pbmdNZXNzYWdlIHJlcSwgUmV0eXBlZC5ub2RlLmh0dHAuT3V0Z29pbmdNZXNzYWdlIHJlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN5c3RlbS5Db25zb2xlLldyaXRlTGluZShcIlNlcnZlciByZWNlaXZlZCByZXF1ZXN0LlwiKTtcclxuICAgICAgICAgICAgcmVzLndyaXRlKFwiSGVsbG8gY2xpZW50XCIpO1xyXG4gICAgICAgICAgICByZXMuZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoU2VydmVyRnVuYyk7XHJcbiAgICAgICAgICAgIHNlcnZlci5saXN0ZW4oMzAwMSk7XHJcblxyXG4gICAgICAgICAgICBzb2NrZXRfaW8uU29ja2V0SU8uXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgICovXHJcbn0iXQp9Cg==
