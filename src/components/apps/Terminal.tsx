import  { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import io from "socket.io-client";
import { getToken } from "~/utils";
import { useProgressStore } from "~/stores/slices/progress";

const TerminalComponent = () => {
  const setProgressMessage = useProgressStore((state) => state.setProgressMessage);
  const setSocketId = useProgressStore((state) => state.setSocketId);
  const progressId = useProgressStore((state) => state.setProgressId);
  const terminalRef = useRef<any>(null);
  const socketRef = useRef<any>(null);
  const progressSocketRef = useRef<any>(null);
  const termRef = useRef<any>(null);

  useEffect(() => {
    termRef.current = new Terminal({
      cursorBlink: true,
      fontFamily: "monospace",
      fontSize: 14,
      theme: { background: "#1a1a1a", foreground: "#00ff00" },
      disableStdin: false,
      scrollback: 1000
    });

    const fitAddon = new FitAddon();
    termRef.current.loadAddon(fitAddon);
    termRef.current.open(terminalRef.current);
    fitAddon.fit();
    const token = getToken();
    termRef.current.focus();

    termRef.current.write("Serverga ulanmoqda ...\r\n");

    socketRef.current = io(
      "https://datagaze-platform-9cab2c02bc91.herokuapp.com/terminal",
      {
        transports: ["websocket"],
        auth: {
          token: `Bearer ${token}`
        }
      }
    );

    let rawInputMode = false;
    let inputBuffer = "";

    const scrollToBottom = () => {
      termRef.current.scrollToBottom();
    };

    socketRef.current.on("disconnect", () => {
      termRef.current.write("\r\nHolat: Serverdan uzildi!\r\n");
      scrollToBottom();
      setTimeout(() => {
        if (!socketRef.current.connected) socketRef.current.connect();
      }, 1000);
    });

    socketRef.current.on("data", ({ output }: any) => {
      termRef.current.write("\r\n" + output + "");
      scrollToBottom();
    });

    socketRef.current.on("command_response", ({ data }: any) => {
      if (data.result.startsWith("CLIENT_ID:")) {
        rawInputMode = true;
        termRef.current.write("\r\nRaw input rejimi yoqildi\r\n");
      } else {
        termRef.current.write(data.result + "");
      }
      scrollToBottom();
    });
    socketRef.current.on("connect", () => {
      termRef.current.write("Serverga ulandi!\n\r");
      setSocketId(socketRef.current.id);
    });
    // \r-bu qator boshiga otkazadi \n-bu esa ENTER \b-backspace ASCII dagi kodi
    socketRef.current.on("error", (err: any) => {
      termRef.current.write("\r\nServer xatosi: " + err + "\r\n");
      scrollToBottom();
    });

    socketRef.current.on("connect_error", (err: any) => {
      termRef.current.write("\r\nUlanish xatosi: " + err.message + "\r\n");
      scrollToBottom();
    });

    termRef.current.onData((data: any) => {
      if (rawInputMode) {
        socketRef.current.emit("command", { command: data });
      } else {
        if (data === "\r") {
          if (socketRef.current.connected && inputBuffer.trim()) {
            socketRef.current.emit("command", { command: inputBuffer });
            termRef.current.write("\r\n");
            inputBuffer = "";
          } else {
            termRef.current.write("\r\nXato: Serverga ulanib bo‘lmadi!\r\n");
          }
        } else if (data === "\u007F" || data === "\b") {
          if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            termRef.current.write("\b \b");
          }
        } else {
          inputBuffer += data;
          termRef.current.write(data);
        }
      }
      scrollToBottom();
    });

    terminalRef.current.addEventListener("click", () => {
      termRef.current.focus();
    });

    progressSocketRef.current = io(
      "https://datagaze-platform-9cab2c02bc91.herokuapp.com/progress",
      {
        transports: ["websocket"],
        auth: { token: `Bearer ${token}` }
      }
    );

    progressSocketRef.current.on("connect", () => {
      progressId(progressSocketRef.current.id);
    });

    progressSocketRef.current.on("progressUpdate", (data: any) => {
      setProgressMessage(data.progress);
    });

    progressSocketRef.current.on("disconnect", () => {
      setProgressMessage(0);
    });

    progressSocketRef.current.on("connect_error", (err: any) => {
      setProgressMessage(err.message);
    });

    const handleResize = () => {
      fitAddon.fit();
      scrollToBottom();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (termRef.current) termRef.current.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100%", background: "#1a1a1a" }}
    />
  );
};

export default TerminalComponent;
