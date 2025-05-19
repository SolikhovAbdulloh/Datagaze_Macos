import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { Socket } from "socket.io-client";

interface TerminalInstallProps {
  socket: Socket | null | any;
  productId: string;
}

const TerminalInstall = ({ socket, productId }: TerminalInstallProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    // Terminalni sozlash
    termRef.current = new Terminal({
      cursorBlink: true,
      fontFamily: "monospace",
      fontSize: 14,
      theme: { background: "#1a1a1a", foreground: "#00ff00" },
      disableStdin: true, // Faqat javob ko'rsatish uchun, kiritish o'chirilgan
      scrollback: 1000
    });

    const fitAddon = new FitAddon();
    termRef.current.loadAddon(fitAddon);
    termRef.current.open(terminalRef.current!);
    fitAddon.fit();
    termRef.current.focus();

    // Pastga aylantirish funksiyasi
    const scrollToBottom = () => {
      termRef.current?.scrollToBottom();
    };

    // Socket hodisalari
    if (socket) {
      socket.on("connect", () => {
        termRef.current?.write("Connected to server!\r\n");
        // productId bilan connectToServer hodisasini yuborish
        socket.emit("connectToServer", { productId });
        scrollToBottom();
      });

      socket.on("connectToServerResponse", (response: any) => {
        termRef.current?.write(
          `\r\nServer response: ${response.data || JSON.stringify(response)}\r\n`
        );
        scrollToBottom();
      });

      socket.on("ssh_output", (response: any) => {
        termRef.current?.write(`\r\n${response.data || JSON.stringify(response)}\r\n`);
        scrollToBottom();
      });

      socket.on("ssh_error", (err: any) => {
        termRef.current?.write(`\r\nSSH error: ${err.message || err}\r\n`);
        scrollToBottom();
      });

      socket.on("message", (msg: any) => {
        termRef.current?.write(`\r\nMessage: ${msg}\r\n`);
        scrollToBottom();
      });
    } else {
      termRef.current?.write("\r\nError: Socket not provided!\r\n");
      scrollToBottom();
    }

    // Oyna o'lchami o'zgarganda moslashish
    const handleResize = () => {
      fitAddon.fit();
      scrollToBottom();
    };
    window.addEventListener("resize", handleResize);

    // Tozalash
    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("connectToServerResponse");
        socket.off("ssh_output");
        socket.off("ssh_error");
        socket.off("message");
        socket.off("disconnect");
      }
      if (termRef.current) termRef.current.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [socket, productId]);

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100%", background: "#1a1a1a" }}
    />
  );
};

export default TerminalInstall;
