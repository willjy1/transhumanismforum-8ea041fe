import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Thinkers from "./pages/Thinkers";
import CreatePost from "./pages/CreatePost";
import CreatePostRich from "./components/CreatePostRich";
import Bookmarks from "./pages/Bookmarks";
import Messages from "./pages/Messages";
import Library from "./pages/Library";
import About from "./pages/About";
import Events from "./pages/Events";
import BestOf from "./pages/BestOf";
import Sequences from "./pages/Sequences";
import Concepts from "./pages/Concepts";
import UserProfile from "./pages/UserProfile";
import Forum from "./pages/Forum";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/thinkers" element={<Thinkers />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/create-post-rich" element={<CreatePostRich />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/library" element={<Library />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/best-of" element={<BestOf />} />
              <Route path="/sequences" element={<Sequences />} />
              <Route path="/concepts" element={<Concepts />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
