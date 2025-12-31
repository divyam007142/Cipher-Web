import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CryptoJS from "crypto-js";
import { Lock, Unlock, Copy, RefreshCw, Shield, ArrowRightLeft, Sparkles } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function CryptoCard() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!input) {
      setOutput("");
    }
  }, [input]);

  const handleProcess = () => {
    if (!input) {
      sonnerToast.error("Input Required", {
        description: "Please enter some text to process.",
      });
      return;
    }

    setIsAnimating(true);
    
    // Simulate "processing" time for effect
    setTimeout(() => {
      try {
        let result = "";
        
        if (mode === "encrypt") {
          // If key is provided, use it. Otherwise use public default.
          const effectiveKey = secretKey || "default-public-key";
          result = CryptoJS.AES.encrypt(input, effectiveKey).toString();
        } else {
          // Decryption logic:
          // 1. Try with the provided secretKey if it exists
          // 2. If it fails or no key, try with the default key
          
          let decrypted = "";
          if (secretKey) {
            try {
              const bytes = CryptoJS.AES.decrypt(input, secretKey);
              decrypted = bytes.toString(CryptoJS.enc.Utf8);
            } catch (e) {
              // Failed with secret key, move to default
            }
          }

          if (!decrypted) {
            try {
              const bytes = CryptoJS.AES.decrypt(input, "default-public-key");
              decrypted = bytes.toString(CryptoJS.enc.Utf8);
            } catch (e) {
              // Failed with default key too
            }
          }

          if (!decrypted) {
            throw new Error("Invalid Key");
          }
          result = decrypted;
        }
        
        setOutput(result);
        setIsAnimating(false);
        sonnerToast.success(mode === "encrypt" ? "Encrypted Successfully" : "Decrypted Successfully");
      } catch (error) {
        setIsAnimating(false);
        sonnerToast.error("Decryption Failed", {
          description: "This message requires a specific security key or is corrupted.",
        });
      }
    }, 600);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    sonnerToast.success("Copied to Clipboard");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setSecretKey("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-panel border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.1)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <CardHeader className="pb-4 border-b border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardTitle className="text-2xl md:text-3xl font-display tracking-wider text-primary flex items-center gap-2">
                <Shield className="w-6 h-6 animate-pulse" />
                CYPHER<span className="text-white">PUNK</span>
              </CardTitle>
              
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 w-full sm:w-auto">
                <button
                  onClick={() => { setMode("encrypt"); setOutput(""); }}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-bold text-sm tracking-widest transition-all duration-300 ${
                    mode === "encrypt" 
                      ? "bg-primary text-white shadow-[0_0_15px_rgba(0,243,255,0.4)]" 
                      : "text-muted-foreground hover:text-white"
                  }`}
                  data-testid="toggle-encrypt"
                >
                  ENCRYPT
                </button>
                <button
                  onClick={() => { setMode("decrypt"); setOutput(""); }}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-bold text-sm tracking-widest transition-all duration-300 ${
                    mode === "decrypt" 
                      ? "bg-secondary text-white shadow-[0_0_15px_rgba(188,19,254,0.4)]" 
                      : "text-muted-foreground hover:text-white"
                  }`}
                  data-testid="toggle-decrypt"
                >
                  DECRYPT
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-white font-mono text-xs uppercase tracking-widest flex items-center justify-between">
                  <span>Input Data</span>
                  <span className="text-[10px] text-primary/70">{input.length} chars</span>
                </Label>
                <div className="relative group">
                  <Textarea
                    placeholder={mode === "encrypt" ? "Enter plain text here..." : "Paste encrypted string here..."}
                    className="h-64 font-mono text-sm bg-black/30 border-primary/30 focus-visible:ring-primary/50 text-white placeholder:text-white/30 resize-none transition-all group-hover:border-primary/50"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    data-testid="input-text"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-2">
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-white/60 hover:text-white"
                      onClick={() => setInput("")}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Output Section */}
              <div className="space-y-4">
                <Label className="text-white font-mono text-xs uppercase tracking-widest flex items-center justify-between">
                  <span>Processed Output</span>
                  {output && <span className="text-primary text-[10px] animate-pulse">READY</span>}
                </Label>
                <div className="relative h-64 bg-black/40 rounded-md border border-white/10 overflow-hidden group">
                  {/* Digital Rain / Scanline Effect Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                  
                  {isAnimating ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="font-mono text-primary text-sm font-bold animate-pulse">
                         PROCESSING DATA BLOCKS...
                         <div className="w-32 h-1 bg-primary/20 mt-2 rounded overflow-hidden">
                           <motion.div 
                              className="h-full bg-primary shadow-[0_0_10px_#00f3ff]"
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                           />
                         </div>
                       </div>
                    </div>
                  ) : (
                     <Textarea
                      readOnly
                      value={output}
                      className="h-full w-full bg-transparent border-0 resize-none font-mono text-sm text-white font-medium focus-visible:ring-0 p-3 placeholder:text-gray-500"
                      placeholder="Waiting for input..."
                      data-testid="output-text"
                    />
                  )}

                  <AnimatePresence>
                    {output && !isAnimating && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-4 right-4"
                      >
                        <Button 
                          onClick={copyToClipboard}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md"
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          COPY
                        </Button>
                        <Button 
                          onClick={() => setOutput("")}
                          variant="ghost"
                          className="text-white/60 hover:text-destructive transition-colors ml-2"
                          size="sm"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          CLEAR
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-black/20 p-4 rounded-lg border border-white/5 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-2">
                <Label className="text-white font-mono text-xs uppercase">Security Key (Passphrase)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
                  <Input
                    type="password"
                    placeholder="Enter secret passphrase..."
                    className="pl-9 font-mono bg-black/40 border-white/10 focus-visible:ring-primary/50 text-white placeholder:text-white/30 truncate"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    data-testid="input-key"
                  />
                </div>
              </div>

              <Button 
                onClick={handleProcess}
                disabled={isAnimating}
                className={`w-full md:w-auto min-w-[200px] h-10 font-bold tracking-widest transition-all duration-300 ${
                  mode === 'encrypt' 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]' 
                    : 'bg-secondary hover:bg-secondary/90 text-white shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_30px_rgba(188,19,254,0.5)]'
                }`}
                data-testid="btn-process"
              >
                {mode === "encrypt" ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" /> ENCRYPT DATA
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2" /> DECRYPT DATA
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="text-[10px] text-muted-foreground font-mono">
                SECURE AES-256 ENCRYPTION // CLIENT-SIDE ONLY
              </div>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                RESET TERMINAL
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
