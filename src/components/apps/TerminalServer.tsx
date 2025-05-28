import { Modal, Box, Typography, CircularProgress } from "@mui/material";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { IoMdCloseCircle } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { getToken } from "~/utils";
import { io } from "socket.io-client";
import "xterm/css/xterm.css";

export const TerminalModalServer = ({
  isOpen,
  name,
  onClose,
  appId
}: {
  isOpen: boolean;
  name: string | undefined;
  onClose: () => void;
  appId: string | undefined;
}) => {
  const socketRef = useRef<any>(null);
  const termRef = useRef<any>(null);
  const terminalRef = useRef<any>(null);
  const [isTerminalLoading, setTerminalLoading] = useState(false);
  const [terminalError, setTerminalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setTerminalLoading(true);
    const term = new Terminal({
      cursorBlink: true,
      disableStdin: false,
      scrollback: 1000,
      fontFamily: "monospace",
      fontSize: 16,
      theme: { background: "#1a1a1a", foreground: "#ffffff" }
    });
    const fitAddon = new FitAddon();
    termRef.current = term;

    term.loadAddon(fitAddon);

    setTimeout(() => {
      if (!terminalRef.current) return;

      term.open(terminalRef.current);
      fitAddon.fit();
      term.focus(); // MUHIM

      const socket = io("wss://d.dev-baxa.me/terminal1", {
        transports: ["websocket"],
        auth: { token: `Bearer ${getToken()}` }
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        term.write("✅ Connected to WebSocket\r\n");
        if (appId) {
          socket.emit("connectToServerForGotoServer", { productId: appId });
        }
      });

      socket.on("ssh_output", (data: string) => term.write(data));
      socket.on("ssh_error", (err: string) => term.write(`\r\n❌ ${err}\r\n`));

      term.onData((data: string) => {
        socket.emit("terminalDataForGotoServer", { data });
      });

      window.addEventListener("resize", () => {
        fitAddon.fit();
        term.scrollToBottom();
      });

      setTerminalLoading(false);
    }, 100);

    return () => {
      socketRef.current?.disconnect();
      termRef.current?.dispose();
    };
  }, [isOpen, appId]);

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="terminal-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#1a1a1a",
          width: 950,
          borderRadius: "10px",
          p: 2
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <Typography variant="h6" sx={{ color: "white" }}>
            Terminal - {name || "Unknown"}
          </Typography>
          <IoMdCloseCircle
            size={25}
            className="cursor-pointer text-gray-400 hover:text-white"
            onClick={onClose}
          />
        </div>

        <Box
          sx={{
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <div ref={terminalRef} style={{ height: "100%", width: "100%" }} />
          {isTerminalLoading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              <CircularProgress size={30} sx={{ color: "white" }} />
            </Box>
          )}
        </Box>

        {terminalError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {terminalError}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};
