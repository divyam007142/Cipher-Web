import { CryptoCard } from "@/components/CryptoCard";
import { MatrixRain } from "@/components/MatrixRain";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url(/images/dark_cyberpunk_digital_grid_background.png)" }}
      />
      
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      {/* Overlay Gradient for better text readability */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-background/80 via-background/40 to-background/90" />
      
      {/* Grid Overlay Effect */}
      <div className="fixed inset-0 z-[-1] bg-[size:50px_50px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] pointer-events-none" />

      {/* Main Content */}
      <main className="w-full max-w-5xl z-10 flex flex-col items-center gap-8">
        
        {/* Header Section */}
        <header className="text-center space-y-4 mb-8">
          <div className="inline-block border border-primary/30 bg-primary/5 px-3 py-1 rounded-full backdrop-blur-md mb-4">
            <span className="text-xs font-mono text-primary tracking-[0.2em] uppercase">
              System Secure • V 1.0.4
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-[0.2em] text-white neon-text-primary">
            SECURE <span className="text-primary">TEXT</span>
          </h1>
          
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
              Military-grade encryption for your sensitive data.
            </h2>
            <p className="text-muted-foreground font-sans max-w-md mx-auto text-lg font-medium">
              No servers. No traces. 100% Client-side.
            </p>
          </div>
        </header>

        {/* Application Core */}
        <CryptoCard />

        {/* Footer */}
        <footer className="mt-12 text-center text-xs font-mono text-white/60">
          <p>© {new Date().getFullYear()} DESIGNED BY ECOLEAF // ENCRYPTED COMMUNICATIONS PROTOCOL</p>
        </footer>
      </main>
    </div>
  );
}
