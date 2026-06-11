import React, { useState, useEffect } from "react";
import { 
  Heart, X, Sparkles, MapPin, Briefcase, GraduationCap, 
  HelpCircle, ShieldCheck, Loader2, RefreshCw, BookOpen, 
  MessageSquare, User, Compass, Send, AlertTriangle, Check, 
  ChevronRight, Info, Award, Settings, Filter, Copy
} from "lucide-react";
import { DEMO_PROFILES, EDUCATIONAL_ARTICLES } from "./mockData";
import { Profile, Gender, RelationshipGoal, Match, Message, GuideArticle } from "./types";
import DiscoveryTab from "./components/DiscoveryTab";

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<"discover" | "conversations" | "guides" | "profile">("discover");
  
  // Custom user profile with defaults
  const [myProfile, setMyProfile] = useState<Profile>({
    id: "user_me",
    name: "Alex",
    age: 26,
    gender: Gender.FTM_TRANSMAN,
    pronouns: "he/him",
    bio: "Passionate about pottery, vintage synths, and early morning hikes. Looking for genuine, warm partners who love intentionality, cozy brunch dates, and deep talks.",
    interests: ["Pottery", "Synthesizers", "Hiking", "Brunch"],
    goals: RelationshipGoal.LONG_TERM,
    location: "Manhattan, NY",
    distanceMiles: 0,
    profession: "Graphic Designer",
    education: "BFA in Visual Arts",
    avatarSeed: "alex",
    avatarBgColor: "from-indigo-600 to-rose-400",
    transitionStageShared: "On Testosterone, post-top surgery. Happy to share naturally!",
    openToAnsweringQuestions: "happy_to_share",
    verificationStatus: "verified"
  });

  // Discovery filtering stage
  const [filterGender, setFilterGender] = useState<string>("ALL"); // "ALL", "CIS", "FTM"
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);

  // Matching & Chat Log States
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "match_clara",
      partnerProfile: DEMO_PROFILES[1], // Clara (Cis Woman)
      latestMessage: "That coffee spot sounds amazing, I'm free on Sunday!",
      timestamp: "12:45 PM",
      unreadCount: 1
    },
    {
      id: "match_julian",
      partnerProfile: DEMO_PROFILES[3], // Julian (Cis Man)
      latestMessage: "Loved your bio about the vintage synths! We should jam sometime.",
      timestamp: "Yesterday",
      unreadCount: 0
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "match_clara": [
      { id: "m1", senderId: "ftm_toby", text: "Hey Clara! Your standard poodle looks adorable in that profile photo.", timestamp: Date.now() - 3600000 * 3 },
      { id: "m2", senderId: "user_me", text: "Haha thank you! She does love tracking dirt in the house too though.", timestamp: Date.now() - 3600000 * 2, status: "read" },
      { id: "m3", senderId: "ftm_toby", text: "That coffee spot sounds amazing, I'm free on Sunday!", timestamp: Date.now() - 3600000 }
    ],
    "match_julian": [
      { id: "m4", senderId: "user_me", text: "Hey Julian, awesome history book references!", timestamp: Date.now() - 3600000 * 24, status: "read" },
      { id: "m5", senderId: "match_julian", text: "Loved your bio about the vintage synths! We should jam sometime.", timestamp: Date.now() - 3600000 * 20 }
    ]
  });

  const [selectedMatchId, setSelectedMatchId] = useState<string>("match_clara");
  const [activeChatMessageText, setActiveChatMessageText] = useState("");
  const [latestVibeMatchName, setLatestVibeMatchName] = useState<string | null>(null);

  // Direct AI Bio Optimizer states
  const [newBioDraft, setNewBioDraft] = useState(myProfile.bio);
  const [optimizingBio, setOptimizingBio] = useState(false);
  const [optimizedOptions, setOptimizedOptions] = useState<{ warm: string; playful: string; minimalist: string } | null>(null);
  const [bioError, setBioError] = useState("");

  // AI Dating Coach states
  const [coachDraft, setCoachDraft] = useState("");
  const [coaching, setCoaching] = useState(false);
  const [coachFeedback, setCoachFeedback] = useState<{ feedback: string; improvedDraft: string; safetyScore: number } | null>(null);
  const [coachError, setCoachError] = useState("");

  // AI Date Planner states
  const [coachSubTab, setCoachSubTab] = useState<"coach" | "planner">("coach");
  const [planningDate, setPlanningDate] = useState(false);
  const [dateSuggestions, setDateSuggestions] = useState<{ 
    title: string; 
    description: string; 
    location: string; 
    relevance: string; 
    accessibilityTip: string; 
    respectTip: string; 
  }[] | null>(null);
  const [plannerError, setPlannerError] = useState("");

  // Search/Filter of Guides
  const [guideSearch, setGuideSearch] = useState("");
  const [selectedGuideCat, setSelectedGuideCat] = useState<string>("ALL");
  const [selectedGuide, setSelectedGuide] = useState<GuideArticle | null>(EDUCATIONAL_ARTICLES[1]);

  // Interests Editor state
  const [newInterestTag, setNewInterestTag] = useState("");

  // Global Toast Notification State
  interface ToastItem {
    id: string;
    message: string;
    type?: "success" | "info" | "error";
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleCopyBio = (text: string, toneName: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${toneName} to clipboard!`, "success");
  };

  const handleCopyDateProposal = (title: string, desc: string) => {
    const textToCopy = `${title} - ${desc}`;
    navigator.clipboard.writeText(textToCopy);
    showToast(`Copied date proposal to clipboard!`, "success");
  };

  // Filter candidates based on identity preference
  useEffect(() => {
    let list = DEMO_PROFILES.filter(p => !matches.some(m => m.partnerProfile.id === p.id));
    
    if (filterGender === "CIS") {
      list = list.filter(p => p.gender.toLowerCase().includes("cis"));
    } else if (filterGender === "FTM") {
      list = list.filter(p => p.gender.toLowerCase().includes("ftm") || p.gender.toLowerCase().includes("trans"));
    }
    setFilteredProfiles(list);
  }, [filterGender, matches]);

  // Handle swipes simulated matches
  const handleLike = (profile: Profile) => {
    // 60% chance to immediately simulate a match for interactive playfulness!
    const isNewMatch = Math.random() > 0.35;
    
    if (isNewMatch) {
      const matchId = `match_${profile.id}`;
      const newMatchItem: Match = {
        id: matchId,
        partnerProfile: profile,
        latestMessage: "It's a connection! Say hi and try asking Gemini for a respectful icebreaker.",
        timestamp: "Just Now",
        unreadCount: 0
      };
      
      setMatches(prev => [newMatchItem, ...prev]);
      setMessages(prev => ({
        ...prev,
        [matchId]: [
          {
            id: `sys_${Date.now()}`,
            senderId: "system",
            text: `✨ You and ${profile.name} are both looking for ${profile.goals}! Try typing a friendly draft message or tap "Ask Gemini" for unique Icebreakers.`,
            timestamp: Date.now()
          }
        ]
      }));
      
      setLatestVibeMatchName(profile.name);
      setSelectedMatchId(matchId);
      // Auto fade-out notification
      setTimeout(() => setLatestVibeMatchName(null), 5000);
    }
  };

  const handlePass = (profile: Profile) => {
    // Standard skip log
    console.log("Logged pass for ", profile.name);
  };

  // Bio Optimization Trigger
  const triggerBioOptimization = async () => {
    if (!newBioDraft.trim()) {
      setBioError("Please write some rough words about yourself before optimizing.");
      return;
    }
    setOptimizingBio(true);
    setBioError("");
    setOptimizedOptions(null);

    try {
      const res = await fetch("/api/gemini/optimize-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalBio: newBioDraft,
          identity: myProfile.gender,
          goals: myProfile.goals
        })
      });

      if (!res.ok) {
        throw new Error("Unable to contact bio optimization engine.");
      }

      const data = await res.json();
      setOptimizedOptions(data);
    } catch (err: any) {
      console.error(err);
      setBioError("Could not reach compiler. Please ensure your GEMINI_API_KEY is configured.");
    } finally {
      setOptimizingBio(false);
    }
  };

  // Dating Coach review
  const reviewMessageDraftWithAI = async () => {
    if (!coachDraft.trim()) {
      setCoachError("Please write a draft in the coach input field first.");
      return;
    }
    setCoaching(true);
    setCoachError("");
    setCoachFeedback(null);

    // Get current chat context
    const currentMatch = matches.find(m => m.id === selectedMatchId);
    const history = messages[selectedMatchId] || [];
    const chatHistoryContextString = history
      .slice(-4)
      .map(m => `${m.senderId === "user_me" ? "User" : "Match"}: ${m.text}`)
      .join("\n");

    try {
      const res = await fetch("/api/gemini/chat-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftMessage: coachDraft,
          chatHistory: chatHistoryContextString,
          userRole: myProfile.gender,
          matchRole: currentMatch?.partnerProfile.gender || "Cis Member"
        })
      });

      if (!res.ok) {
        throw new Error("Dating coach is temporarily asleep.");
      }

      const data = await res.json();
      setCoachFeedback(data);
    } catch (err: any) {
      console.error(err);
      setCoachError("Wingman AI took too long to respond. Ensure your API secrets are valid.");
    } finally {
      setCoaching(false);
    }
  };

  // Update bio helper
  const applyOptimizedBio = (variationText: string) => {
    setMyProfile(prev => ({ ...prev, bio: variationText }));
    setNewBioDraft(variationText);
    setOptimizedOptions(null);
  };

  // Apply coached improved draft directly to active message input
  const applyCoachedDraftToChat = () => {
    if (coachFeedback?.improvedDraft) {
      setActiveChatMessageText(coachFeedback.improvedDraft);
      setCoachDraft("");
      setCoachFeedback(null);
    }
  };

  // Date suggestion actions
  const generateDateSuggestions = async () => {
    const activeMatch = matches.find(m => m.id === selectedMatchId);
    if (!activeMatch) {
      setPlannerError("Please select a vibe connection first.");
      return;
    }

    setPlanningDate(true);
    setPlannerError("");
    setDateSuggestions(null);

    try {
      const res = await fetch("/api/gemini/date-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInterests: myProfile.interests,
          userLocation: myProfile.location,
          partnerInterests: activeMatch.partnerProfile.interests,
          partnerLocation: activeMatch.partnerProfile.location,
          partnerName: activeMatch.partnerProfile.name
        })
      });

      if (!res.ok) {
        throw new Error("Unable to reach Date Planner coordinates.");
      }

      const data = await res.json();
      setDateSuggestions(data);
    } catch (err: any) {
      console.error(err);
      setPlannerError("Failed to plan date. Please verify your internet connection and API keys.");
    } finally {
      setPlanningDate(false);
    }
  };

  const applyDateProposalToChat = (title: string, desc: string) => {
    const text = `Hey, I was thinking we could try this date idea: "${title}" - ${desc} What do you think?`;
    setActiveChatMessageText(text);
  };

  // Send Chat message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeChatMessageText.trim()) return;

    const newMessage: Message = {
      id: `user_m_${Date.now()}`,
      senderId: "user_me",
      text: activeChatMessageText,
      timestamp: Date.now(),
      status: "sent"
    };

    setMessages(prev => ({
      ...prev,
      [selectedMatchId]: [...(prev[selectedMatchId] || []), newMessage]
    }));

    // Update matches latest text
    setMatches(prev => 
      prev.map(m => m.id === selectedMatchId ? { ...m, latestMessage: activeChatMessageText, timestamp: "Just Now" } : m)
    );

    setActiveChatMessageText("");

    // Simulate cute automatic response after 2.5 seconds to build a magical simulator
    const activeMatch = matches.find(m => m.id === selectedMatchId);
    if (!activeMatch) return;

    setTimeout(() => {
      const partnerName = activeMatch.partnerProfile.name;
      const responses = [
        `Thanks for sharing! I really appreciate that you're so open. Let's definitely get a vanilla latte coffee this week!`,
        `Oh wow! That is so neat. I actually play guitar too, we should exchange music list ideas.`,
        `That sounds incredibly cozy. Tell me more about your recent hiking trails!`,
        `Absolutely! I completely agree that communication is key. Let's do a voice call soon.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const partnerMessage: Message = {
        id: `partner_m_${Date.now()}`,
        senderId: activeMatch.partnerProfile.id,
        text: randomResponse,
        timestamp: Date.now()
      };

      setMessages(prev => {
        const list = prev[selectedMatchId] || [];
        const updatedList = list.map(m => 
          m.senderId === "user_me" ? { ...m, status: "read" as const } : m
        );
        // Don't duplicate if they opened another chat
        return {
          ...prev,
          [selectedMatchId]: [...updatedList, partnerMessage]
        };
      });

      setMatches(prev => 
        prev.map(m => m.id === selectedMatchId ? { ...m, latestMessage: randomResponse, unreadCount: 1 } : m)
      );

    }, 2500);

  };

  // Profile Tag edits
  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterestTag.trim() && !myProfile.interests.includes(newInterestTag.trim())) {
      setMyProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterestTag.trim()]
      }));
      setNewInterestTag("");
    }
  };

  const handleRemoveInterest = (tag: string) => {
    setMyProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== tag)
    }));
  };

  // Filter guides list
  const filteredArticles = EDUCATIONAL_ARTICLES.filter(art => {
    const charsMatch = art.title.toLowerCase().includes(guideSearch.toLowerCase()) || 
                       art.content.toLowerCase().includes(guideSearch.toLowerCase());
    
    if (selectedGuideCat === "ALL") return charsMatch;
    return art.category === selectedGuideCat && charsMatch;
  });

  return (
    <div className="w-full min-h-screen bg-[#070b13] text-[#f8fafc] font-sans overflow-x-hidden relative flex flex-col">
      
      {/* GLOWING MESH BACKDROP BLOBS FROM FROSTED GLASS THEME */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[50%] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-glow-slow"></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[60%] bg-rose-500/15 rounded-full blur-[120px] pointer-events-none" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[25%] right-[10%] w-[35%] h-[40%] bg-amber-400/5 rounded-full blur-[90px] pointer-events-none"></div>

      {/* MATCHED BANNER NOTIFICATION */}
      {latestVibeMatchName && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300 w-full max-w-sm px-4">
          <div className="backdrop-blur-2xl bg-indigo-950/80 border border-indigo-400/30 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-md animate-bounce">
              ♥
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">It's a Connection!</h5>
              <p className="text-xs text-white/90 font-medium">You and <strong className="text-white text-sm">{latestVibeMatchName}</strong> liked each other!</p>
            </div>
            <button 
              onClick={() => {
                setActiveTab("conversations");
                setLatestVibeMatchName(null);
              }}
              className="text-xs px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg font-medium transition cursor-pointer"
            >
              Chat Now
            </button>
          </div>
        </div>
      )}

      {/* SYSTEM HEADER BAR */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-bold font-display select-none">⚤</span>
          </div>
          <div>
            <h1 className="text-lg font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-stone-200 to-indigo-300">FTM-Cis Connect</h1>
            <p className="text-[10px] text-indigo-300/80 font-semibold tracking-wider uppercase">Respectful Ally-Guided Transmasculine Dating</p>
          </div>
        </div>

        {/* Dynamic header stats badge from standard look */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md bg-white/5 text-[10px] font-bold tracking-widest text-indigo-200 flex items-center gap-2 select-none shadow-inner">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            <span>842 MEMBERS ONLINE NOW</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs text-white/60">
            <span className="text-stone-500">Logged in as:</span>
            <span className="font-semibold text-indigo-300">{myProfile.name} 🇺🇸</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER LAYOUT */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-stretch">
        
        {/* LEFT MULTI-COLUMN INTERFACED NAV */}
        <nav className="col-span-1 lg:col-span-3 flex flex-row lg:flex-col gap-2 p-2 rounded-[24px] border border-white/10 backdrop-blur-xl bg-white/5 lg:py-6 lg:px-4 h-auto lg:h-fit justify-between lg:justify-start lg:gap-3 shrink-0">
          <div className="hidden lg:block mb-4 px-2">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40">Dating Vibe Control</h3>
          </div>
          
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 ${
              activeTab === "discover" 
                ? "bg-gradient-to-r from-indigo-500/20 to-rose-400/20 text-indigo-200 border border-indigo-400/30 shadow-inner scale-102" 
                : "text-white/60 hover:text-white/90 hover:bg-white/5 border border-transparent"
            }`}
          >
            <Compass className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Discover Spark</span>
          </button>

          <button
            onClick={() => setActiveTab("conversations")}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 relative ${
              activeTab === "conversations" 
                ? "bg-gradient-to-r from-indigo-500/20 to-rose-400/20 text-indigo-200 border border-indigo-400/30 shadow-inner scale-102" 
                : "text-white/60 hover:text-white/90 hover:bg-white/5 border border-transparent"
            }`}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Vibe Conversations</span>
            {matches.reduce((acc, current) => acc + current.unreadCount, 0) > 0 && (
              <span className="absolute top-2.5 right-2 sm:right-auto sm:left-[11rem] w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center font-bold">
                {matches.reduce((acc, current) => acc + current.unreadCount, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("guides")}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 ${
              activeTab === "guides" 
                ? "bg-gradient-to-r from-indigo-500/20 to-rose-400/20 text-indigo-200 border border-indigo-400/30 shadow-inner scale-102" 
                : "text-white/60 hover:text-white/90 hover:bg-white/5 border border-transparent"
            }`}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Ally Guides & FAQ</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 ${
              activeTab === "profile" 
                ? "bg-gradient-to-r from-indigo-500/20 to-rose-400/20 text-indigo-200 border border-indigo-400/30 shadow-inner scale-102" 
                : "text-white/60 hover:text-white/90 hover:bg-white/5 border border-transparent"
            }`}
          >
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">My Profile Engine</span>
          </button>

          <div className="hidden lg:block pt-6 mt-6 border-t border-white/5 px-2 text-left">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Our Community Pledge</h4>
            <p className="text-[10px] text-white/50 leading-relaxed font-normal">
              FTM-Cis Connect prioritizes healthy boundaries, vetted allies, and respect-first conversation guidelines. No intrusive transition questioning early on. Be beautiful, be transparent.
            </p>
          </div>
        </nav>

        {/* RIGHT INTERACTIVE CONTENT GRID AREA */}
        <main className="col-span-1 lg:col-span-9 flex flex-col gap-6">
          
          {/* TAB 1: DISCOVER/SWIPE CANDIDATES */}
          {activeTab === "discover" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              
              {/* Swiper Deck Column (Take up most space) */}
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center justify-between gap-3 mb-2 select-none">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-medium tracking-tight text-white/95">Local Connections</h2>
                    <p className="text-xs text-white/60">Showing recommended partners matching your boundary layout.</p>
                  </div>
                  
                  {/* Quick toggle filter */}
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-[10px]">
                    <button 
                      onClick={() => setFilterGender("ALL")}
                      className={`px-2.5 py-1.5 rounded-lg cursor-pointer font-medium ${filterGender === "ALL" ? "bg-white/10 text-white font-bold" : "text-white/55 hover:text-white/80"}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setFilterGender("CIS")}
                      className={`px-2.5 py-1.5 rounded-lg cursor-pointer font-medium ${filterGender === "CIS" ? "bg-white/10 text-white font-bold" : "text-white/55 hover:text-white/80"}`}
                    >
                      Cis Allies
                    </button>
                    <button 
                      onClick={() => setFilterGender("FTM")}
                      className={`px-2.5 py-1.5 rounded-lg cursor-pointer font-medium ${filterGender === "FTM" ? "bg-white/10 text-white font-bold" : "text-white/55 hover:text-white/80"}`}
                    >
                      FTM Fellows
                    </button>
                  </div>
                </div>

                <DiscoveryTab 
                  candidates={filteredProfiles} 
                  onSwipeLeft={handlePass} 
                  onSwipeRight={handleLike} 
                  isFtmUser={myProfile.gender === Gender.FTM_TRANSMAN}
                  onSelectIcebreaker={(starterText) => {
                    // Prepopulate draft in conversations tab if matched
                    setCoachDraft(starterText);
                    alert(`Loaded into dialogue helper draft! You can view and edit this in "Vibe Conversations".`);
                  }}
                  userProfile={myProfile}
                  onShowToast={showToast}
                />
              </div>

              {/* Side Educational Tips (Takes up 1 column on desktop) */}
              <div className="hidden md:block md:col-span-1 space-y-4">
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs mb-2">
                    <Info className="w-3.5 h-3.5" />
                    <span>Dating Standard</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white/90 mb-1">Cis Ally Tip:</h4>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Avoid asking FTM guys about their "birth names" or medical transition details right away. Treat him as the handsome guy he is, and ask about his hobbies! Let deep trust build naturally.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab("guides");
                      setSelectedGuide(EDUCATIONAL_ARTICLES[1]);
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold mt-3 underline"
                  >
                    Read Etiquette Guide &rarr;
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs mb-2">
                    <Award className="w-3.5 h-3.5" />
                    <span>Verify Account</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white/90 mb-1">Verify Profile Badging</h4>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Verify secure photo identity to unlock the verified badge. Fosters premium trust and helps filtering out scammers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE CHATS & GEMINI DATING COACH */}
          {activeTab === "conversations" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px] items-stretch">
              
              {/* Match List Column (Col span 4) */}
              <div className="md:col-span-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Vibe Connections</h3>
                
                <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                  {matches.length === 0 ? (
                    <div className="text-center py-10">
                      <Heart className="w-8 h-8 text-white/20 mx-auto mb-2" />
                      <p className="text-xs text-white/50">No matches yet. Go to Discover and like some profiles to match!</p>
                    </div>
                  ) : (
                    matches.map(m => (
                      <div 
                        key={m.id}
                        onClick={() => {
                          setSelectedMatchId(m.id);
                          // Clear unread
                          setMatches(matchedList => matchedList.map(item => item.id === m.id ? { ...item, unreadCount: 0 } : item));
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer select-none text-left ${
                          selectedMatchId === m.id 
                            ? "bg-white/10 border-indigo-400/40" 
                            : "bg-white/5 hover:bg-white/8 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${m.partnerProfile.avatarBgColor} flex items-center justify-center font-bold text-sm text-white`}>
                            {m.partnerProfile.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold text-white/90">{m.partnerProfile.name}</span>
                              <span className="text-[10px] text-white/40">{m.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-white/60 truncate italic">
                              {m.latestMessage}
                            </p>
                          </div>
                          {m.unreadCount > 0 && (
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Canvas Section (Col span 5) */}
              <div className="md:col-span-5 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
                {(() => {
                  const activeMatch = matches.find(m => m.id === selectedMatchId);
                  if (!activeMatch) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <MessageSquare className="w-10 h-10 text-white/20 mb-3" />
                        <h4 className="text-sm font-semibold text-white/85">No Chat Open</h4>
                        <p className="text-xs text-white/50 max-w-xs mt-1">Select an active vibe match from the panel to start the dialogue stream.</p>
                      </div>
                    );
                  }

                  const activeLogs = messages[selectedMatchId] || [];

                  return (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${activeMatch.partnerProfile.avatarBgColor} flex items-center justify-center font-bold text-white text-xs`}>
                            {activeMatch.partnerProfile.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-white mb-0.5">{activeMatch.partnerProfile.name}</h4>
                            <p className="text-[10.5px] text-indigo-300 font-medium">Seeking {activeMatch.partnerProfile.goals}</p>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-white/80 font-mono">
                          {activeMatch.partnerProfile.pronouns}
                        </span>
                      </div>

                      {/* Messages display */}
                      <div className="flex-grow p-4 overflow-y-auto space-y-3.5 flex flex-col justify-end">
                        <div className="space-y-3">
                          {activeLogs.map((msg) => {
                            if (msg.senderId === "system") {
                              return (
                                <div key={msg.id} className="text-center p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/10 text-[10.5px] text-indigo-200">
                                  {msg.text}
                                </div>
                              );
                            }

                            const isMe = msg.senderId === "user_me";
                            return (
                              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start animate-in fade-in duration-300"}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                                  isMe 
                                    ? "bg-indigo-600 text-white rounded-br-none" 
                                    : "bg-white/10 text-white/95 border border-white/5 rounded-bl-none text-left"
                                }`}>
                                  <p>{msg.text}</p>
                                  <div className="flex items-center justify-between gap-4 mt-1.5 pt-1 border-t border-white/5">
                                    {msg.aiSuggested ? (
                                      <div className="flex items-center gap-1 text-[8.5px] text-indigo-300 font-bold tracking-wider uppercase select-none">
                                        <Sparkles className="w-2 h-2 text-indigo-400" />
                                        <span>Gemini Suggested</span>
                                      </div>
                                    ) : (
                                      <div />
                                    )}
                                    <div className="flex items-center gap-1 text-[8.5px] text-white/55 ml-auto select-none">
                                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                      {isMe && (
                                        msg.status === "read" ? (
                                          <div className="flex items-center -space-x-1" title="Read">
                                            <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                                            <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                                          </div>
                                        ) : (
                                          <Check className="w-3 h-3 text-white/40" title="Sent" />
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/5 flex gap-2">
                        <input
                          type="text"
                          value={activeChatMessageText}
                          onChange={(e) => setActiveChatMessageText(e.target.value)}
                          placeholder={`Message ${activeMatch.partnerProfile.name}...`}
                          className="flex-grow rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400/50"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-500 transition cursor-pointer flex items-center justify-center shadow-md shadow-indigo-600/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </>
                  );
                })()}
              </div>

              {/* Dating Coach / Date Planner Sidebar Pane (Col span 3) */}
              <div className="md:col-span-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-400/5 rounded-full blur-xl pointer-events-none" />
                
                {/* Frosted Glass Tabs for rightmost column */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] mb-3.5 select-none shrink-0">
                  <button 
                    onClick={() => setCoachSubTab("coach")}
                    className={`flex-1 py-1.5 rounded-lg cursor-pointer font-bold transition flex items-center justify-center gap-1 ${coachSubTab === "coach" ? "bg-white/10 text-white" : "text-white/55 hover:text-white/80"}`}
                  >
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    Coach Ally
                  </button>
                  <button 
                    onClick={() => setCoachSubTab("planner")}
                    className={`flex-1 py-1.5 rounded-lg cursor-pointer font-bold transition flex items-center justify-center gap-1 ${coachSubTab === "planner" ? "bg-white/10 text-white" : "text-white/55 hover:text-white/80"}`}
                  >
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    Date Planner
                  </button>
                </div>

                {coachSubTab === "coach" ? (
                  <>
                    <h3 className="text-xs font-bold text-white/90 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 select-none text-left">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Dating Coach Ally</span>
                    </h3>

                    <p className="text-[10px] text-white/50 leading-relaxed text-left mb-3">
                      Unsure if your message draft is respectful, authentic, or too invasive? Let's check it against respectful community standards.
                    </p>

                    {/* Coach Input Area */}
                    <div className="space-y-3 pb-3 border-b border-white/5 text-left shrink-0">
                      <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase block select-none">Draft Tester:</label>
                      <textarea
                        value={coachDraft}
                        onChange={(e) => setCoachDraft(e.target.value)}
                        placeholder="e.g. 'Hey, in what stages of your medical FTM journey are you? Just curious!'"
                        rows={3}
                        className="w-full text-xs rounded-lg p-2.5 bg-white/5 border border-white/15 focus:outline-none focus:border-indigo-500 text-white placeholder-white/30"
                      />
                      
                      <button
                        onClick={reviewMessageDraftWithAI}
                        disabled={coaching || !coachDraft.trim()}
                        className="w-full py-2 bg-gradient-to-tr from-indigo-500 to-rose-400 hover:from-indigo-600 hover:to-rose-500 text-white rounded-lg text-[11px] font-bold tracking-wider inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 transition duration-150"
                      >
                        {coaching ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Educating...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
                            <span>Audit Draft</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Coach Feedback responses */}
                    <div className="flex-1 overflow-y-auto pt-3 space-y-3 text-left">
                      {coachFeedback ? (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          
                          {/* Safety / Suitability Score */}
                          <div className="flex items-center justify-between gap-1.5 bg-white/5 p-2 rounded-xl border border-white/10 select-none">
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Respect Score:</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                coachFeedback.safetyScore >= 8 
                                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30" 
                                  : coachFeedback.safetyScore >= 5 
                                  ? "bg-amber-500/10 text-amber-300 border border-amber-400/30" 
                                  : "bg-rose-500/10 text-rose-300 border border-rose-400/30"
                              }`}>
                                {coachFeedback.safetyScore}/10
                              </span>
                            </div>
                          </div>

                          {/* Coach Explanation block */}
                          <div className="text-[11px] text-white/80 bg-white/5 border border-white/5 p-3 rounded-xl leading-relaxed italic">
                            <h4 className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mb-1 font-sans">COACH CHRONICLES:</h4>
                            <p>"{coachFeedback.feedback}"</p>
                          </div>

                          {/* Improved Draft Alternative to replace standard */}
                          {coachFeedback.improvedDraft && (
                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative group">
                              <div className="text-[9.5px] font-bold text-indigo-300 uppercase mb-1">Affirming Alternative:</div>
                              <p className="italic text-white/90 text-[10.5px] leading-relaxed">"{coachFeedback.improvedDraft}"</p>
                              
                              <button
                                onClick={applyCoachedDraftToChat}
                                className="w-full mt-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-indigo-300 rounded-lg text-[9.5px] font-bold text-center transition cursor-pointer"
                              >
                                Apply Draft to Chat Input
                              </button>
                            </div>
                          )}

                        </div>
                      ) : coachError ? (
                        <p className="text-rose-400 text-xs text-center">{coachError}</p>
                      ) : (
                        <div className="text-center py-6 text-white/40 flex flex-col items-center">
                          <HelpCircle className="w-8 h-8 text-white/10 mb-2" />
                          <p className="text-[10px] italic">
                            Type in the draft tester box and hit "Audit Draft" to analyze your writing before sending!
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xs font-bold text-white/90 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 select-none text-left shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      <span>AI Date Planner</span>
                    </h3>

                    <p className="text-[10px] text-white/50 leading-relaxed text-left mb-3 shrink-0">
                      Plan a safe, respectful public date tailored specifically to you and your match's shared interests using Gemini suggestions.
                    </p>

                    {(() => {
                      const activeMatch = matches.find(m => m.id === selectedMatchId);
                      if (!activeMatch) {
                        return (
                          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 text-white/40">
                            <Heart className="w-8 h-8 text-white/10 mb-2 animate-pulse" />
                            <p className="text-[10.5px] italic">Select an active vibe connection on the left panel to begin planning!</p>
                          </div>
                        );
                      }

                      return (
                        <div className="flex-grow flex flex-col overflow-hidden text-left space-y-3">
                          {/* Synergy pool list */}
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-[10px] text-white/80 space-y-1.5 shrink-0">
                            <span className="font-bold text-rose-300 uppercase tracking-wider block">SYNERGY POOL:</span>
                            <p className="leading-relaxed">
                              Merging your interests (<span className="text-indigo-200 font-semibold">{myProfile.interests.slice(0, 3).join(", ")}</span>) with <strong>{activeMatch.partnerProfile.name}</strong>'s (<span className="text-indigo-200 font-semibold">{activeMatch.partnerProfile.interests.slice(0, 3).join(", ")}</span>).
                            </p>
                          </div>

                          <button
                            onClick={generateDateSuggestions}
                            disabled={planningDate}
                            className="w-full py-2 bg-gradient-to-tr from-indigo-500 to-rose-400 hover:from-indigo-600 hover:to-rose-500 text-white rounded-lg text-[11px] font-bold tracking-wider inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 transition duration-150 shrink-0"
                          >
                            {planningDate ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Designing Suggestions...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                <span>Generate Suggestions</span>
                              </>
                            )}
                          </button>

                          {plannerError && (
                            <p className="text-rose-400 text-[10.5px] font-medium text-center shrink-0">{plannerError}</p>
                          )}

                          <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
                            {dateSuggestions ? (
                              dateSuggestions.map((sug, idx) => (
                                <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 animate-in fade-in duration-200">
                                  <div className="flex items-start justify-between gap-1">
                                    <h4 className="text-xs font-bold text-white leading-snug">{sug.title}</h4>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/15">Vibe {idx+1}</span>
                                  </div>
                                  
                                  <p className="text-[10.5px] text-white/85 leading-relaxed italic">"{sug.description}"</p>
                                  
                                  <div className="text-[10px] space-y-1 bg-black/20 p-2.5 rounded-lg border border-white/5 text-white/70">
                                    <p><strong className="text-indigo-200 font-semibold">Where:</strong> {sug.location}</p>
                                    <p><strong className="text-rose-200 font-semibold">Synergy:</strong> {sug.relevance}</p>
                                    <p><strong className="text-[#a7f3d0] font-semibold">Accessibility:</strong> {sug.accessibilityTip}</p>
                                    <p><strong className="text-amber-200 font-semibold">Ally Respect:</strong> {sug.respectTip}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      onClick={() => handleCopyDateProposal(sug.title, sug.description)}
                                      className="py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-lg text-[9.5px] font-bold text-center transition cursor-pointer flex items-center justify-center gap-1"
                                    >
                                      <Copy className="w-3 h-3 text-rose-400" />
                                      Copy Idea
                                    </button>
                                    <button
                                      onClick={() => applyDateProposalToChat(sug.title, sug.description)}
                                      className="py-1.5 bg-indigo-600/10 hover:bg-indigo-600/25 border border-indigo-400/25 text-indigo-300 hover:text-indigo-200 rounded-lg text-[9.5px] font-bold text-center transition cursor-pointer"
                                    >
                                      Draft Proposal
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              !planningDate && (
                                <div className="text-center py-10 text-white/30 flex flex-col items-center">
                                  <HelpCircle className="w-8 h-8 text-white/5 mb-1.5" />
                                  <p className="text-[10.5px] leading-relaxed">
                                    Tap "Generate Suggestions" to create a selection of amazing dates with custom accessibility adjustments and safety recommendations!
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ALLY GUIDES & Terminology */}
          {activeTab === "guides" && (
            <div className="space-y-6">
              
              {/* Header stats search and filters */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 select-none">
                <div>
                  <h3 className="text-lg font-display font-semibold text-white/90">Inclusive Education Center</h3>
                  <p className="text-xs text-white/60">A secure space explaining gender journey terminology and dating courtesy.</p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <input
                    type="text"
                    value={guideSearch}
                    onChange={(e) => setGuideSearch(e.target.value)}
                    placeholder="Search terms/topics..."
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-indigo-400/50 w-full sm:w-48"
                  />

                  <select
                    value={selectedGuideCat}
                    onChange={(e) => setSelectedGuideCat(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:ring-1 focus:ring-indigo-400/55 cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Ally Guidance">Ally Guidance</option>
                    <option value="Terminology">Terminology</option>
                    <option value="Safety & Transition">Safety & Transition</option>
                  </select>
                </div>
              </div>

              {/* Main Guides layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* List column */}
                <div className="md:col-span-4 space-y-3">
                  {filteredArticles.length === 0 ? (
                    <p className="text-xs text-white/45 p-4 text-center">No articles match your search parameters.</p>
                  ) : (
                    filteredArticles.map(art => (
                      <div
                        key={art.id}
                        onClick={() => setSelectedGuide(art)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition ${
                          selectedGuide?.id === art.id 
                            ? "bg-indigo-500/10 border-indigo-500/30" 
                            : "bg-white/5 hover:bg-white/10 border-white/5"
                        }`}
                      >
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          art.category === "Ally Guidance" ? "bg-amber-400/10 text-amber-300" :
                          art.category === "Terminology" ? "bg-indigo-400/10 text-indigo-300" :
                          "bg-rose-400/10 text-rose-300"
                        }`}>
                          {art.category}
                        </span>
                        <h4 className="text-xs font-bold text-white/90 mt-2">{art.title}</h4>
                        <p className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Article detail reader (Col span 8) */}
                <div className="md:col-span-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-left space-y-4">
                  {selectedGuide ? (
                    <article className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300/90">{selectedGuide.category}</span>
                          <h2 className="text-lg sm:text-2xl font-display font-bold text-white mt-1 leading-tight">{selectedGuide.title}</h2>
                        </div>
                        <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-400/20 text-[10px] text-emerald-300 font-semibold select-none flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verified Safe Guide
                        </div>
                      </div>

                      {/* Content block parsed */}
                      <div className="text-xs text-white/80 leading-relaxed font-normal whitespace-pre-line space-y-4 font-sans">
                        {/* We output formatted markdown content roughly with simple styles */}
                        <div className="prose prose-invert prose-xs max-w-none text-white/80">
                          {selectedGuide.content}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 mt-4 text-[10.5px] text-white/50 flex items-center gap-2 select-none">
                        <Info className="w-4 h-4 text-white/30" />
                        <span>Guidance contributed by community educators and LGBTQ+ ally counselors.</span>
                      </div>
                    </article>
                  ) : (
                    <div className="text-center py-20 text-white/45">
                      <BookOpen className="w-10 h-10 text-white/10 mx-auto mb-2" />
                      <p className="text-xs">Select any guide article from the list to begin reading.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: MY PROFILE ENGINE & BIO OPTIMIZER */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
              
              {/* Profile Config Form */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-display font-semibold text-white/90">My Profile Configuration</h3>
                  <p className="text-xs text-white/55">Customize how your personality translates to other community members.</p>
                </div>

                <div className="space-y-4">
                  {/* Name, Age, Pronouns */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">My Name:</label>
                      <input
                        type="text"
                        value={myProfile.name}
                        onChange={(e) => setMyProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full text-xs rounded-lg px-3 py-2 bg-white/5 border border-white/15 text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">My Age:</label>
                      <input
                        type="number"
                        value={myProfile.age}
                        onChange={(e) => setMyProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 20 }))}
                        className="w-full text-xs rounded-lg px-3 py-2 bg-white/5 border border-white/15 text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">Pronouns:</label>
                      <input
                        type="text"
                        value={myProfile.pronouns}
                        onChange={(e) => setMyProfile(prev => ({ ...prev, pronouns: e.target.value }))}
                        className="w-full text-xs rounded-lg px-3 py-2 bg-white/5 border border-white/15 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="he/him"
                      />
                    </div>
                  </div>

                  {/* My Identity / Gender selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">My Gender / Identity:</label>
                    <select
                      value={myProfile.gender}
                      onChange={(e) => setMyProfile(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full text-xs rounded-lg px-3 py-2.5 bg-slate-900 border border-white/15 text-white focus:outline-none cursor-pointer"
                    >
                      <option value={Gender.FTM_TRANSMAN}>{Gender.FTM_TRANSMAN}</option>
                      <option value={Gender.CISGENDER_WOMAN}>{Gender.CISGENDER_WOMAN}</option>
                      <option value={Gender.CISGENDER_MAN}>{Gender.CISGENDER_MAN}</option>
                      <option value={Gender.NON_BINARY}>{Gender.NON_BINARY}</option>
                    </select>
                  </div>

                  {/* Seek goals */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">My Relationship Intent:</label>
                    <select
                      value={myProfile.goals}
                      onChange={(e) => setMyProfile(prev => ({ ...prev, goals: e.target.value as RelationshipGoal }))}
                      className="w-full text-xs rounded-lg px-3 py-2.5 bg-slate-900 border border-white/15 text-white focus:outline-none cursor-pointer"
                    >
                      <option value={RelationshipGoal.LONG_TERM}>{RelationshipGoal.LONG_TERM}</option>
                      <option value={RelationshipGoal.CASUAL}>{RelationshipGoal.CASUAL}</option>
                      <option value={RelationshipGoal.FRIENDSHIP}>{RelationshipGoal.FRIENDSHIP}</option>
                      <option value={RelationshipGoal.OPEN_TO_CONNECTIONS}>{RelationshipGoal.OPEN_TO_CONNECTIONS}</option>
                    </select>
                  </div>

                  {/* Career & schooling */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">Profession:</label>
                      <input
                        type="text"
                        value={myProfile.profession || ""}
                        onChange={(e) => setMyProfile(prev => ({ ...prev, profession: e.target.value }))}
                        className="w-full text-xs rounded-lg px-3 py-2 bg-white/5 border border-white/15 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="e.g. Graphic Designer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">Education:</label>
                      <input
                        type="text"
                        value={myProfile.education || ""}
                        onChange={(e) => setMyProfile(prev => ({ ...prev, education: e.target.value }))}
                        className="w-full text-xs rounded-lg px-3 py-2 bg-white/5 border border-white/15 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="e.g. BS in Design"
                      />
                    </div>
                  </div>

                  {/* Transition Stage Shared (Optional/Secure) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase flex items-center gap-1 select-none">
                      <span>Journey Share (Optional):</span>
                      <span className="text-white/30 font-normal lowercase tracking-normal">(helps secure transparent chemistry)</span>
                    </label>
                    <input
                      type="text"
                      value={myProfile.transitionStageShared || ""}
                      onChange={(e) => setMyProfile(prev => ({ ...prev, transitionStageShared: e.target.value }))}
                      placeholder="e.g. 'On Testosterone, fully out' or 'Cis ally supporting FTM individuals'"
                      className="w-full text-xs rounded-lg px-3 py-2.5 bg-white/5 border border-white/15 text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  {/* Boundaries question disclosure */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">Conversational Boundaries Preferences:</label>
                    <select
                      value={myProfile.openToAnsweringQuestions || "happy_to_share"}
                      onChange={(e) => setMyProfile(prev => ({ ...prev, openToAnsweringQuestions: e.target.value as any }))}
                      className="w-full text-xs rounded-lg px-3 py-2.5 bg-slate-900 border border-white/15 text-white focus:outline-none cursor-pointer"
                    >
                      <option value="happy_to_share">🌱 Open and happy to answer respectful questions</option>
                      <option value="prefer_no_invasive_questions">🔒 Please avoid transition questions early on, focus on personality first</option>
                      <option value="only_if_matched_and_close">💬 Only willing to discuss trans topics after we match and bond</option>
                    </select>
                  </div>

                  {/* Interests editing */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">My Interests:</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {myProfile.interests.map(interest => (
                        <span 
                          key={interest} 
                          className="px-2 py-1 bg-white/10 hover:bg-rose-500/20 text-white/90 rounded text-[10.5px] font-medium inline-flex items-center gap-1 select-none cursor-pointer transition"
                          title="Click to remove tag"
                          onClick={() => handleRemoveInterest(interest)}
                        >
                          {interest}
                          <span className="text-[9px] text-white/40">&times;</span>
                        </span>
                      ))}
                    </div>

                    <form onSubmit={handleAddInterest} className="flex gap-2">
                      <input
                        type="text"
                        value={newInterestTag}
                        onChange={(e) => setNewInterestTag(e.target.value)}
                        placeholder="Add interest tag..."
                        className="flex-grow text-xs rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 focus:outline-none"
                      />
                      <button 
                        type="submit"
                        className="px-3 bg-white/15 hover:bg-white/20 border border-white/10 rounded-lg text-xs text-white"
                      >
                        Add
                      </button>
                    </form>
                  </div>

                </div>
              </div>

              {/* Bio Optimizer Column */}
              <div className="space-y-6">
                
                {/* Visual Preview Badge */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3.5 select-none">Live Swiper Preview</h3>
                  <div className="p-4 rounded-xl border border-white/10 bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${myProfile.avatarBgColor} flex items-center justify-center text-xl font-bold text-white`}>
                        {myProfile.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{myProfile.name}, {myProfile.age}</h4>
                        <p className="text-[10px] text-indigo-300 font-semibold">{myProfile.pronouns} • {myProfile.gender}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/85 mt-3.5 italic leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                      "{myProfile.bio || "No biography written yet."}"
                    </p>
                  </div>
                </div>

                {/* Gemini Bio Optimizer Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-semibold text-white/95 leading-none">Wingman Bio Optimizer</h3>
                      <span className="text-[10px] text-white/50 select-none">Powered by Gemini AI</span>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <p className="text-xs text-white/60 leading-relaxed">
                      Rough draft or feeling tongue-tied? Write down any brief facts or points you'd like to share, click Optimize, and select any of the 3 polished versions to apply!
                    </p>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">Bio rough draft:</label>
                      <textarea
                        value={newBioDraft}
                        onChange={(e) => setNewBioDraft(e.target.value)}
                        placeholder="Write a rough draft bio..."
                        rows={4}
                        className="w-full text-xs rounded-lg p-3 bg-white/5 border border-white/15 focus:outline-none focus:border-indigo-500 text-white placeholder-white/30"
                      />
                    </div>

                    <button
                      onClick={triggerBioOptimization}
                      disabled={optimizingBio}
                      className="w-full py-2.5 bg-gradient-to-tr from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/10 inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 transition"
                    >
                      {optimizingBio ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Transforming...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Optimize with Gemini</span>
                        </>
                      )}
                    </button>

                    {bioError && (
                      <p className="text-rose-400 text-xs mt-2">{bioError}</p>
                    )}

                    {/* Optimized options */}
                    {optimizedOptions && (
                      <div className="pt-4 border-t border-white/5 space-y-3 animate-in fade-in duration-200">
                        <h4 className="text-[10px] font-bold text-white/40 tracking-wider uppercase select-none">Optimized Options:</h4>
                        
                        {/* Option 1: Warm */}
                        <div className="p-3 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl space-y-1.5 transition">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-amber-300 uppercase">1. Warm & Friendly</span>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleCopyBio(optimizedOptions.warm, "Warm & Friendly Bio")}
                                className="text-[9.5px] text-zinc-400 hover:text-zinc-200 font-semibold cursor-pointer border border-white/10 rounded py-0.5 px-1.5 bg-white/5 hover:bg-white/10 flex items-center gap-1"
                              >
                                <Copy className="w-2.5 h-2.5" />
                                Copy
                              </button>
                              <button
                                onClick={() => applyOptimizedBio(optimizedOptions.warm)}
                                className="text-[9.5px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer border border-indigo-400/20 rounded py-0.5 px-1.5 bg-indigo-500/5 hover:bg-indigo-500/10"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-white/80 italic leading-relaxed">"{optimizedOptions.warm}"</p>
                        </div>

                        {/* Option 2: Playful */}
                        <div className="p-3 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl space-y-1.5 transition">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-rose-300 uppercase">2. Playful & Witty</span>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleCopyBio(optimizedOptions.playful, "Playful & Witty Bio")}
                                className="text-[9.5px] text-zinc-400 hover:text-zinc-200 font-semibold cursor-pointer border border-white/10 rounded py-0.5 px-1.5 bg-white/5 hover:bg-white/10 flex items-center gap-1"
                              >
                                <Copy className="w-2.5 h-2.5" />
                                Copy
                              </button>
                              <button
                                onClick={() => applyOptimizedBio(optimizedOptions.playful)}
                                className="text-[9.5px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer border border-indigo-400/20 rounded py-0.5 px-1.5 bg-indigo-500/5 hover:bg-indigo-500/10"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-white/80 italic leading-relaxed">"{optimizedOptions.playful}"</p>
                        </div>

                        {/* Option 3: Minimalist */}
                        <div className="p-3 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl space-y-1.5 transition">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-teal-300 uppercase">3. Minimalist & Deep</span>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleCopyBio(optimizedOptions.minimalist, "Minimalist & Deep Bio")}
                                className="text-[9.5px] text-zinc-400 hover:text-zinc-200 font-semibold cursor-pointer border border-white/10 rounded py-0.5 px-1.5 bg-white/5 hover:bg-white/10 flex items-center gap-1"
                              >
                                <Copy className="w-2.5 h-2.5" />
                                Copy
                              </button>
                              <button
                                onClick={() => applyOptimizedBio(optimizedOptions.minimalist)}
                                className="text-[9.5px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer border border-indigo-400/20 rounded py-0.5 px-1.5 bg-indigo-500/5 hover:bg-indigo-500/10"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-white/80 italic leading-relaxed">"{optimizedOptions.minimalist}"</p>
                        </div>

                      </div>
                    )}

                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="w-full py-8 mt-auto border-t border-white/5 select-none bg-slate-950/20 text-center text-xs text-white/40">
        <p>&copy; 2026 FTM-Cis Connect. All rights reserved.</p>
        <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-white/30 font-serif">
          <span>🌸 Empowering authentic dating & affirming spaces. Code with love.</span>
        </p>
      </footer>

      {/* GLOBAL TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 bg-[#0d1527]/95 border border-indigo-500/25 shadow-2xl rounded-2xl p-3.5 pr-4 animate-in slide-in-from-bottom duration-300 backdrop-blur-xl"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 select-none">
              {toast.type === "success" ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : toast.type === "error" ? (
                <X className="h-4 w-4 text-rose-400" />
              ) : (
                <Sparkles className="h-4 w-4 text-indigo-400" />
              )}
            </div>
            <div className="flex-1 text-xs font-semibold text-white/95 text-left">
              {toast.message}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white/45 hover:text-white/85 p-0.5 cursor-pointer shrink-0 transition"
              aria-label="Close Toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
