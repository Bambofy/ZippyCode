using Bridge;
using Newtonsoft.Json;
using Retyped;
using Retyped.Primitive;
using System;

using static Retyped.dom;
using static Retyped.socket_io_client;

using Console = System.Console;

namespace ZippyCode
{
    public class App
    {
        public static HTMLDivElement EditorDiv
        {
            get
            {
                return document.getElementById("editor").As<HTMLDivElement>();
            }
        }

        public static dynamic EditorDivText
        {
            get
            {
                return Script.Call<dynamic>("editor.getValue");
            }
            set
            {
                Script.Call("editor.setValue", value);
            }
        }

        public static HTMLSelectElement ToolbarLanguageSelection {
            get
            {
                return document.getElementById("languageSelect").As<HTMLSelectElement>();
            }
        }

        public static dynamic EditorCursorInformation
        {
            get
            {
                return Script.Call<dynamic>("editor.selection.getCursor");
            }
        }

        public static void SetEditorCursor(int row, int col, bool keepDesired = false)
        {
            Script.Call("editor.selection.moveCursorTo", row, col, keepDesired);
            Script.Call("editor.clearSelection");
        }

        public static string GenerateRandomCharArray(int pCharCount = 6)
        {
            string randomOutput = "";
            for (int i = 0; i < pCharCount; i++)
            {
                byte v = (byte)(Math.Random() * 75);
                byte a = 48;
                char c = Convert.ToChar(v + a);
                randomOutput += c;
            }
            return randomOutput;
        }

        public static string ClientPeerID;

        public static void RXSystemMessage(string pMessage)
        {
            Console.WriteLine("{0} -> {1}", "System Information Message", pMessage);
        }

        public static void ToClientText(string pText)
        {
            // for some reason the cursor is moved to the end of the char array and selected when updated here.
            var prevCursorPosition = EditorCursorInformation;

            EditorDivText = pText;

            SetEditorCursor(prevCursorPosition["row"], prevCursorPosition["column"]);
        }

        public static void TriggerSendToServer()
        {
            Socket.emit("ToServerText", EditorDivText);
        }

        public static SocketIOClient.Socket Socket;
        public static void Main()
        {
            // when the page loads, we need to know if we are being given a link to a room.
            // check the GET requests
            if (window.location.search != "")
            {
                // join room with id given.
                ClientPeerID = window.location.search.Substring(4);
                Console.WriteLine("Joining room {0}", ClientPeerID);
            }
            else
            {
                // create new room and new ID..
                ClientPeerID = GenerateRandomCharArray();

                window.location.search = "?id=" + ClientPeerID;
            }

            Socket = socket_io_client.io.connect("http://localhost:1337");

            document.getElementById("editor").onkeyup += (e) =>
            {
                ZippyCode.App.TriggerSendToServer();
            };

            es5.Function systemMessageFunc = new es5.Function("UniqueID", "ZippyCode.App.RXSystemMessage(UniqueID)");
            Socket.on("SystemMessage", systemMessageFunc);

            es5.Function toClientTextFunc = new es5.Function("Text", "ZippyCode.App.ToClientText(Text)");
            Socket.on("ToClientText", toClientTextFunc);

            es5.Function triggerTextToServer = new es5.Function("", "ZippyCode.App.TriggerSendToServer()");
            Socket.on("TriggerSendToServer", triggerTextToServer);



            Socket.on("connect", () => {
                Console.WriteLine("Connecting to the server...");

                Socket.compress(true).emit("UserJoinRoom", ClientPeerID);
            });

            Socket.on("disconnect", () =>
            {
                Console.WriteLine("Disconnected from server.");
            });




            ToolbarLanguageSelection.onchange += (e) =>
            {
                HTMLOptionElement optionElement = ToolbarLanguageSelection.selectedOptions[0];

                string modeJavascriptFilepath = optionElement.getAttribute("value");

                Script.Call("editor.session.setMode", modeJavascriptFilepath);
            };
        }
    }

}