import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

interface MarkdownViewerProps {
  content: string;
  prosent: number;
  upload: () => void;
  ispanding: boolean;
  onRun: (command: string) => void;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  onRun,
  upload,
  ispanding,
  prosent
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxHeight: "550px",
        overflowY: "auto",
        paddingRight: "10px"
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : "";
            const isShell = lang === "bash" || lang === "shell";
            const code = String(children).trim();

            if (inline) {
              if (lang && lang !== "text" && lang !== "") {
                return (
                  <Box
                    component="code"
                    sx={{
                      display: "inline",
                      bgcolor: "#eeeeee",
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      fontSize: "0.85rem",
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {code}
                  </Box>
                );
              }
              return <span {...props}>{code}</span>;
            }

            if (isShell) {
              const commands = code
                .split("\n")
                .map((cmd) => cmd.trim())
                .filter((cmd) => cmd.length > 0);

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  {commands.map((cmd, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 1
                        }}
                      >
                        <button
                          onClick={() => onRun(cmd)}
                          style={{
                            backgroundColor: "#1f57f1",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 10px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Run
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language={lang}
                        style={atomDark}
                        customStyle={{
                          padding: "16px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          margin: 0,
                          overflowX: "auto"
                        }}
                      >
                        {cmd}
                      </SyntaxHighlighter>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <SyntaxHighlighter
                language={lang}
                style={atomDark}
                customStyle={{
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  margin: 0,
                  overflowX: "auto"
                }}
              >
                {code}
              </SyntaxHighlighter>
            );
          },
          input({ children }) {
            return <>{children}</>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
      <>
        <Box position="relative" className="flex items-center justify-center">
          <CircularProgress variant="determinate" size={40} value={prosent} />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" component="div" color="textSecondary">
              {`${Math.round(prosent)}%`}
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={upload}
          disabled={prosent == 100 ? false : true}
          variant="contained"
        >
          {ispanding ? <CircularProgress size={20} color="secondary" /> : "Send"}
        </Button>
      </>
    </div>
  );
};

export default MarkdownViewer;
