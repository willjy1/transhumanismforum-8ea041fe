import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Brain, Users, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (!error) {
      navigate('/');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, username);
    setLoading(false);
  };

  const features = [
    {
      icon: Brain,
      title: "Advanced Discussions",
      description: "Engage with cutting-edge ideas about consciousness and AI"
    },
    {
      icon: Users,
      title: "Expert Community", 
      description: "Connect with researchers and thought leaders"
    },
    {
      icon: BookOpen,
      title: "Premium Content",
      description: "Access curated resources and exclusive insights"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Forum
        </Link>
      </div>

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Brand & Features */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-hero font-semibold leading-tight">
                Join the
                <span className="text-primary"> Transhumanist </span>
                Community
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Connect with visionaries exploring human enhancement, artificial intelligence, 
                and the next chapter of human evolution.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-6">
                <div className="interactive-card">
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-semibold">Welcome back</h2>
                    <p className="text-muted-foreground">
                      Sign in to continue the conversation
                    </p>
                  </div>
                  
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus-ring"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus-ring"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <div className="interactive-card">
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-semibold">Join the community</h2>
                    <p className="text-muted-foreground">
                      Create your account to start participating
                    </p>
                  </div>
                  
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="focus-ring"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus-ring"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus-ring"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;