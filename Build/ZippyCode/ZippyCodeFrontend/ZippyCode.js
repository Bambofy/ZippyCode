/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.7.0
 */
Bridge.assembly("ZippyCode", function ($asm, globals) {
    "use strict";

    Bridge.define("ZippyCode.App", {
        main: function Main () {
            if (!Bridge.referenceEquals(window.location.search, "")) {
                ZippyCode.App.ClientPeerID = window.location.search.substr(4);
                System.Console.WriteLine(System.String.format("Joining room {0}", ZippyCode.App.ClientPeerID));
            } else {
                ZippyCode.App.ClientPeerID = ZippyCode.App.GenerateRandomCharArray();

                window.location.search = "?id=" + (ZippyCode.App.ClientPeerID || "");
            }

            ZippyCode.App.Socket = io.connect("http://localhost:1337");

            document.getElementById("editor").onkeyup = Bridge.fn.combine(document.getElementById("editor").onkeyup, function (e) {
                ZippyCode.App.TriggerSendToServer();
            });

            var systemMessageFunc = new Function("UniqueID", "ZippyCode.App.RXSystemMessage(UniqueID)");
            ZippyCode.App.Socket.on("SystemMessage", systemMessageFunc);

            var toClientTextFunc = new Function("Text", "ZippyCode.App.ToClientText(Text)");
            ZippyCode.App.Socket.on("ToClientText", toClientTextFunc);

            var triggerTextToServer = new Function("", "ZippyCode.App.TriggerSendToServer()");
            ZippyCode.App.Socket.on("TriggerSendToServer", triggerTextToServer);



            ZippyCode.App.Socket.on("connect", function () {
                System.Console.WriteLine("Connecting to the server...");

                ZippyCode.App.Socket.compress(true).emit("UserJoinRoom", ZippyCode.App.ClientPeerID);
            });

            ZippyCode.App.Socket.on("disconnect", function () {
                System.Console.WriteLine("Disconnected from server.");
            });




            ZippyCode.App.ToolbarLanguageSelection.onchange = Bridge.fn.combine(ZippyCode.App.ToolbarLanguageSelection.onchange, function (e) {
                var optionElement = ZippyCode.App.ToolbarLanguageSelection.selectedOptions[0];

                var modeJavascriptFilepath = optionElement.getAttribute("value");

                editor.session.setMode(modeJavascriptFilepath);
            });
        },
        statics: {
            fields: {
                ClientPeerID: null,
                Socket: null
            },
            props: {
                EditorDiv: {
                    get: function () {
                        return document.getElementById("editor");
                    }
                },
                EditorDivText: {
                    get: function () {
                        return editor.getValue();
                    },
                    set: function (value) {
                        editor.setValue(value);
                    }
                },
                ToolbarLanguageSelection: {
                    get: function () {
                        return document.getElementById("languageSelect");
                    }
                },
                EditorCursorInformation: {
                    get: function () {
                        return editor.selection.getCursor();
                    }
                }
            },
            methods: {
                SetEditorCursor: function (row, col, keepDesired) {
                    if (keepDesired === void 0) { keepDesired = false; }
                    editor.selection.moveCursorTo(row, col, keepDesired);
                    editor.clearSelection();
                },
                GenerateRandomCharArray: function (pCharCount) {
                    if (pCharCount === void 0) { pCharCount = 6; }
                    var randomOutput = "";
                    for (var i = 0; i < pCharCount; i = (i + 1) | 0) {
                        var v = Bridge.Int.clipu8(Math.random() * 75);
                        var a = 48;
                        var c = System.Convert.toChar(((v + a) | 0), null, 9);
                        randomOutput = (randomOutput || "") + String.fromCharCode(c);
                    }
                    return randomOutput;
                },
                RXSystemMessage: function (pMessage) {
                    System.Console.WriteLine(System.String.format("{0} -> {1}", "System Information Message", pMessage));
                },
                ToClientText: function (pText) {
                    var prevCursorPosition = ZippyCode.App.EditorCursorInformation;

                    ZippyCode.App.EditorDivText = pText;

                    ZippyCode.App.SetEditorCursor(prevCursorPosition.row, prevCursorPosition.column);
                },
                TriggerSendToServer: function () {
                    ZippyCode.App.Socket.emit("ToServerText", ZippyCode.App.EditorDivText);
                }
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJaaXBweUNvZGUuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztZQTZGWUEsSUFBSUE7Z0JBR0FBLDZCQUFlQTtnQkFDZkEsa0VBQXNDQTs7Z0JBS3RDQSw2QkFBZUE7O2dCQUVmQSx5QkFBcUNBLFVBQVNBOzs7WUFHbERBLHVCQUFTQTs7WUFFVEEseUdBQXlEQSxVQUFDQTtnQkFFdERBOzs7WUFHSkEsd0JBQWlDQSxJQUFJQTtZQUNyQ0EseUNBQTJCQTs7WUFFM0JBLHVCQUFnQ0EsSUFBSUE7WUFDcENBLHdDQUEwQkE7O1lBRTFCQSwwQkFBbUNBLElBQUlBO1lBQ3ZDQSwrQ0FBaUNBOzs7O1lBSWpDQSxtQ0FBcUJBLEFBQVNBO2dCQUMxQkE7O2dCQUVBQSx5REFBMkNBOzs7WUFHL0NBLHNDQUF3QkEsQUFBU0E7Z0JBRTdCQTs7Ozs7O1lBTUpBLHFIQUFxQ0EsVUFBQ0E7Z0JBRWxDQSxvQkFBOENBOztnQkFFOUNBLDZCQUFnQ0E7O2dCQUVoQ0EsdUJBQXNDQTs7Ozs7Ozs7Ozs7d0JBakl0Q0EsT0FBT0E7Ozs7O3dCQVFQQSxPQUFPQTs7O3dCQUlQQSxnQkFBK0JBOzs7Ozt3QkFPL0JBLE9BQU9BOzs7Ozt3QkFRUEEsT0FBT0E7Ozs7OzJDQUlvQkEsS0FBU0EsS0FBU0E7O29CQUVqREEsOEJBQTZDQSxLQUFLQSxLQUFLQTtvQkFDdkRBOzttREFHeUNBOztvQkFFekNBO29CQUNBQSxLQUFLQSxXQUFXQSxJQUFJQSxZQUFZQTt3QkFFNUJBLFFBQVNBLGtCQUFNQSxBQUFDQTt3QkFDaEJBO3dCQUNBQSxRQUFTQSxzQkFBZUEsTUFBSUE7d0JBQzVCQSwwREFBZ0JBOztvQkFFcEJBLE9BQU9BOzsyQ0FLd0JBO29CQUUvQkEsMEZBQThEQTs7d0NBR2xDQTtvQkFHNUJBLHlCQUF5QkE7O29CQUV6QkEsOEJBQWdCQTs7b0JBRWhCQSw4QkFBZ0JBLHdCQUEyQkE7OztvQkFLM0NBLDBDQUE0QkEiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFJldHlwZWQ7XHJcbnVzaW5nIFJldHlwZWQuUHJpbWl0aXZlO1xyXG51c2luZyBTeXN0ZW07XHJcblxyXG51c2luZyBDb25zb2xlID0gU3lzdGVtLkNvbnNvbGU7XHJcblxyXG5uYW1lc3BhY2UgWmlwcHlDb2RlXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBcHBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFJldHlwZWQuZG9tLkhUTUxEaXZFbGVtZW50IEVkaXRvckRpdlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXR5cGVkLmRvbS5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRvclwiKS5BczxSZXR5cGVkLmRvbS5IVE1MRGl2RWxlbWVudD4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkeW5hbWljIEVkaXRvckRpdlRleHRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdldFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU2NyaXB0LkNhbGw8ZHluYW1pYz4oXCJlZGl0b3IuZ2V0VmFsdWVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNjcmlwdC5DYWxsKFwiZWRpdG9yLnNldFZhbHVlXCIsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBSZXR5cGVkLmRvbS5IVE1MU2VsZWN0RWxlbWVudCBUb29sYmFyTGFuZ3VhZ2VTZWxlY3Rpb24ge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJldHlwZWQuZG9tLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGFuZ3VhZ2VTZWxlY3RcIikuQXM8UmV0eXBlZC5kb20uSFRNTFNlbGVjdEVsZW1lbnQ+KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZHluYW1pYyBFZGl0b3JDdXJzb3JJbmZvcm1hdGlvblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2V0XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTY3JpcHQuQ2FsbDxkeW5hbWljPihcImVkaXRvci5zZWxlY3Rpb24uZ2V0Q3Vyc29yXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2V0RWRpdG9yQ3Vyc29yKGludCByb3csIGludCBjb2wsIGJvb2wga2VlcERlc2lyZWQgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNjcmlwdC5DYWxsKFwiZWRpdG9yLnNlbGVjdGlvbi5tb3ZlQ3Vyc29yVG9cIiwgcm93LCBjb2wsIGtlZXBEZXNpcmVkKTtcclxuICAgICAgICAgICAgU2NyaXB0LkNhbGwoXCJlZGl0b3IuY2xlYXJTZWxlY3Rpb25cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN0cmluZyBHZW5lcmF0ZVJhbmRvbUNoYXJBcnJheShpbnQgcENoYXJDb3VudCA9IDYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmcgcmFuZG9tT3V0cHV0ID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCBwQ2hhckNvdW50OyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJ5dGUgdiA9IChieXRlKShNYXRoLlJhbmRvbSgpICogNzUpO1xyXG4gICAgICAgICAgICAgICAgYnl0ZSBhID0gNDg7XHJcbiAgICAgICAgICAgICAgICBjaGFyIGMgPSBDb252ZXJ0LlRvQ2hhcih2ICsgYSk7XHJcbiAgICAgICAgICAgICAgICByYW5kb21PdXRwdXQgKz0gYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tT3V0cHV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdHJpbmcgQ2xpZW50UGVlcklEO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUlhTeXN0ZW1NZXNzYWdlKHN0cmluZyBwTWVzc2FnZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwiezB9IC0+IHsxfVwiLCBcIlN5c3RlbSBJbmZvcm1hdGlvbiBNZXNzYWdlXCIsIHBNZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBUb0NsaWVudFRleHQoc3RyaW5nIHBUZXh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gZm9yIHNvbWUgcmVhc29uIHRoZSBjdXJzb3IgaXMgbW92ZWQgdG8gdGhlIGVuZCBvZiB0aGUgY2hhciBhcnJheSBhbmQgc2VsZWN0ZWQgd2hlbiB1cGRhdGVkIGhlcmUuXHJcbiAgICAgICAgICAgIHZhciBwcmV2Q3Vyc29yUG9zaXRpb24gPSBFZGl0b3JDdXJzb3JJbmZvcm1hdGlvbjtcclxuXHJcbiAgICAgICAgICAgIEVkaXRvckRpdlRleHQgPSBwVGV4dDtcclxuXHJcbiAgICAgICAgICAgIFNldEVkaXRvckN1cnNvcihwcmV2Q3Vyc29yUG9zaXRpb25bXCJyb3dcIl0sIHByZXZDdXJzb3JQb3NpdGlvbltcImNvbHVtblwiXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgVHJpZ2dlclNlbmRUb1NlcnZlcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTb2NrZXQuZW1pdChcIlRvU2VydmVyVGV4dFwiLCBFZGl0b3JEaXZUZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgUmV0eXBlZC5zb2NrZXRfaW9fY2xpZW50LlNvY2tldElPQ2xpZW50LlNvY2tldCBTb2NrZXQ7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gd2hlbiB0aGUgcGFnZSBsb2Fkcywgd2UgbmVlZCB0byBrbm93IGlmIHdlIGFyZSBiZWluZyBnaXZlbiBhIGxpbmsgdG8gYSByb29tLlxyXG4gICAgICAgICAgICAvLyBjaGVjayB0aGUgR0VUIHJlcXVlc3RzXHJcbiAgICAgICAgICAgIGlmIChSZXR5cGVkLmRvbS53aW5kb3cubG9jYXRpb24uc2VhcmNoICE9IFwiXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGpvaW4gcm9vbSB3aXRoIGlkIGdpdmVuLlxyXG4gICAgICAgICAgICAgICAgQ2xpZW50UGVlcklEID0gUmV0eXBlZC5kb20ud2luZG93LmxvY2F0aW9uLnNlYXJjaC5TdWJzdHJpbmcoNCk7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIkpvaW5pbmcgcm9vbSB7MH1cIiwgQ2xpZW50UGVlcklEKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBuZXcgcm9vbSBhbmQgbmV3IElELi5cclxuICAgICAgICAgICAgICAgIENsaWVudFBlZXJJRCA9IEdlbmVyYXRlUmFuZG9tQ2hhckFycmF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgUmV0eXBlZC5kb20ud2luZG93LmxvY2F0aW9uLnNlYXJjaCA9IFwiP2lkPVwiICsgQ2xpZW50UGVlcklEO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBTb2NrZXQgPSBzb2NrZXRfaW9fY2xpZW50LmlvLmNvbm5lY3QoXCJodHRwOi8vbG9jYWxob3N0OjEzMzdcIik7XHJcblxyXG4gICAgICAgICAgICBSZXR5cGVkLmRvbS5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRvclwiKS5vbmtleXVwICs9IChlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBaaXBweUNvZGUuQXBwLlRyaWdnZXJTZW5kVG9TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGVzNS5GdW5jdGlvbiBzeXN0ZW1NZXNzYWdlRnVuYyA9IG5ldyBlczUuRnVuY3Rpb24oXCJVbmlxdWVJRFwiLCBcIlppcHB5Q29kZS5BcHAuUlhTeXN0ZW1NZXNzYWdlKFVuaXF1ZUlEKVwiKTtcclxuICAgICAgICAgICAgU29ja2V0Lm9uKFwiU3lzdGVtTWVzc2FnZVwiLCBzeXN0ZW1NZXNzYWdlRnVuYyk7XHJcblxyXG4gICAgICAgICAgICBlczUuRnVuY3Rpb24gdG9DbGllbnRUZXh0RnVuYyA9IG5ldyBlczUuRnVuY3Rpb24oXCJUZXh0XCIsIFwiWmlwcHlDb2RlLkFwcC5Ub0NsaWVudFRleHQoVGV4dClcIik7XHJcbiAgICAgICAgICAgIFNvY2tldC5vbihcIlRvQ2xpZW50VGV4dFwiLCB0b0NsaWVudFRleHRGdW5jKTtcclxuXHJcbiAgICAgICAgICAgIGVzNS5GdW5jdGlvbiB0cmlnZ2VyVGV4dFRvU2VydmVyID0gbmV3IGVzNS5GdW5jdGlvbihcIlwiLCBcIlppcHB5Q29kZS5BcHAuVHJpZ2dlclNlbmRUb1NlcnZlcigpXCIpO1xyXG4gICAgICAgICAgICBTb2NrZXQub24oXCJUcmlnZ2VyU2VuZFRvU2VydmVyXCIsIHRyaWdnZXJUZXh0VG9TZXJ2ZXIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBTb2NrZXQub24oXCJjb25uZWN0XCIsIChBY3Rpb24pKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwiQ29ubmVjdGluZyB0byB0aGUgc2VydmVyLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIFNvY2tldC5jb21wcmVzcyh0cnVlKS5lbWl0KFwiVXNlckpvaW5Sb29tXCIsIENsaWVudFBlZXJJRCk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIFNvY2tldC5vbihcImRpc2Nvbm5lY3RcIiwgKEFjdGlvbikoKCkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJEaXNjb25uZWN0ZWQgZnJvbSBzZXJ2ZXIuXCIpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBUb29sYmFyTGFuZ3VhZ2VTZWxlY3Rpb24ub25jaGFuZ2UgKz0gKGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJldHlwZWQuZG9tLkhUTUxPcHRpb25FbGVtZW50IG9wdGlvbkVsZW1lbnQgPSBUb29sYmFyTGFuZ3VhZ2VTZWxlY3Rpb24uc2VsZWN0ZWRPcHRpb25zWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0cmluZyBtb2RlSmF2YXNjcmlwdEZpbGVwYXRoID0gb3B0aW9uRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBTY3JpcHQuQ2FsbChcImVkaXRvci5zZXNzaW9uLnNldE1vZGVcIiwgbW9kZUphdmFzY3JpcHRGaWxlcGF0aCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdCn0K
