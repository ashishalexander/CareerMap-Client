  import React, { useState, useRef, useEffect } from "react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import {
    Send,
    Loader2,
    MessageCircle,
    Video,
    VideoOff,
    Mic,
    MicOff,
    Phone,
    Lock,
    User,
  } from "lucide-react";
  import { ChatMessage } from "./ChatMessage";
  import { useChat } from "../hooks/useChat";
  import { useAppSelector } from "@/app/store/store";
  import { useSocket } from "../../providers";
  import Peer from "simple-peer";
  import { toast } from "sonner";

  interface ChatRoomProps {
    roomId: string;
    receiverId: string;
  }

  export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, receiverId }) => {
    // Message State
    const [newMessage, setNewMessage] = useState("");
    const { messages, sendMessage, isLoading } = useChat(roomId);
    const userId = useAppSelector((state) => state.auth.user?._id);
    const socket = useSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Video Call State
    const [isVideoCallActive, setIsVideoCallActive] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [callStatus, setCallStatus] = useState<"idle" | "calling" | "in-call">("idle");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isCleaningUp, setIsCleaningUp] = useState(false);
    const [callTimeoutId, setCallTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const callStatusRef = useRef("idle");
    

    const [showIncomingCallDialog, setShowIncomingCallDialog] = useState(false);
    const [incomingCallFrom, setIncomingCallFrom] = useState("");

    
    const subscription = useAppSelector((state) => state.auth.user?.subscription);

    // Check premium status
    const hasPremiumAccess = subscription?.isActive && 
      (subscription?.planType === 'Professional' || subscription?.planType === 'Recruiter Pro');

    // Peer Connection References
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<Peer.Instance | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const pendingSignalRef = useRef<any[] | null>(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    // Socket room management
    useEffect(() => {
      if (!socket || !roomId) return;

      socket.emit("join_room", roomId);

      return () => {
        socket.emit("leave_room", roomId);
      };
    }, [socket, roomId]);

    const cleanup = () => {
    // Add a check to prevent concurrent cleanup calls
    if (isCleaningUp) return;
    setIsCleaningUp(true);
    
    console.log("Cleaning up video call...");
  
  try {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
      localVideoRef.current.oncanplay = null;

    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
      remoteVideoRef.current.oncanplay = null;

    }

    // Centralize peer destruction
    if (peerRef.current) {
      try {
        peerRef.current.removeAllListeners();
        peerRef.current.destroy();
      } catch (e) {
        console.error("Error destroying peer:", e);
      }
      peerRef.current = null;
    }


    if (callTimeoutId) {
      clearTimeout(callTimeoutId);
      setCallTimeoutId(null);
    }

    setRemoteStream(null);
    setIsVideoCallActive(false);
    setCallStatus("idle");
  } finally {
    setIsCleaningUp(false);
  }
};

useEffect(() => {
  callStatusRef.current = callStatus;
}, [callStatus]);


const startCallTimeoutTimer = () => {
  console.log("starting")
  const timeoutId = setTimeout(() => {
    console.log("checking call status:",callStatus)
    if (callStatusRef.current !== "in-call") {
      toast.error("Call not answered", {
        description: "The call was not answered. Please try again later.",
      });
      setShowIncomingCallDialog(false);
      setIncomingCallFrom("");
      endVideoCall();
    }
  }, 30000); 
  
  return timeoutId;
};



    const startVideoCall = async () => {
      try {
        const newTimeoutId = startCallTimeoutTimer();
        setCallTimeoutId(newTimeoutId);
        // First, ensure thorough cleanup of any existing call state
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
        
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
          localStreamRef.current = null;
        }

        // Reset all state
        setRemoteStream(null);
        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
        
        // Now start the new call
        console.log("Starting video call...");
        setIsVideoCallActive(true);
        setCallStatus("calling");
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: true
        });
        
        localStreamRef.current = stream;
        console.log("Local stream obtained:", localStreamRef.current);

        if (localVideoRef.current) {
          localVideoRef.current.setAttribute('autoplay', '');
          localVideoRef.current.setAttribute('playsInline', '');
          localVideoRef.current.muted = true;
          localVideoRef.current.srcObject = stream;
          
          localVideoRef.current.oncanplay = async () => {
            try {
              await localVideoRef.current?.play();
              console.log("Local video playing successfully");
            } catch (err) {
              console.error("Error playing local video:", err);
            }
          };
        }
        
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        peer.on("signal", (data) => {
          console.log("Peer signal generated:", data);
          socket?.emit("video_call_signal", { 
            roomId,
            signal: data,
            from: userId,
            to: receiverId,
          });
        });

        peer.on("connect", () => {
          console.log("Peer connection established");
          setCallStatus("in-call");
          if (callTimeoutId) {
            clearTimeout(callTimeoutId);
            setCallTimeoutId(null);
          }
        });

        peer.on("stream", (incomingStream) => {
          console.log("Received remote stream");
          setRemoteStream(incomingStream);
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = incomingStream;
            try {
              remoteVideoRef.current.play();
            } catch (err) {
              console.error("Error playing remote video:", err);
            }
          }
        });

        peer.on("error", (err) => {
          console.error("Peer connection error:", err);
          cleanup();
        });

        peerRef.current = peer;
        console.log("start video call ",peerRef.current)

        socket?.emit("initiate_video_call", {
          roomId,
          from: userId,
          to: receiverId,
        });

      } catch (error) {
        console.error("Error in startVideoCall:", error);
        cleanup();
        alert("Failed to start video call. Please check camera permissions.");
      }
    };

    const handleIncomingCall = async () => {
      try {
        setShowIncomingCallDialog(false);
        setIncomingCallFrom("");
        if (callTimeoutId) {
          clearTimeout(callTimeoutId);
          setCallTimeoutId(null);
        }
        
        console.log("Handling incoming call...");
        setIsVideoCallActive(true);
        setCallStatus("in-call");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: true
        }).catch((err) => {
          console.error("Media access error:", err);
          alert("Failed to access camera/microphone. Please check permissions.");
          throw err;
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.setAttribute('autoplay', '');
          localVideoRef.current.setAttribute('playsInline', '');
          localVideoRef.current.muted = true;
          localVideoRef.current.srcObject = stream;
          
          try {
            await localVideoRef.current.play();
            console.log("Local video playing successfully");
          } catch (err) {
            console.error("Error playing local video:", err);
          }
        }

        // Create peer only if it doesn't exist
        if (!peerRef.current) {
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
            config: {
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
              ]
            }
          });
          peerRef.current = peer;
          console.log("handle Incomming video call peerRef.current",peerRef.current)
          console.log("hanlde incomming video call",peer)

          peer.on("signal", (signalData) => {
            console.log("Answering peer generated signal:", signalData);
            socket?.emit("video_call_signal", {
              roomId,
              signal: signalData,
              from: userId,
              to: receiverId,
            });
          });

          peer.on("connect", () => {
            console.log("Peer connection established");
            setCallStatus("in-call");
            if (callTimeoutId) {
              clearTimeout(callTimeoutId);
              setCallTimeoutId(null);
            }
          });

          peer.on("stream", (remoteVideoStream) => {
            console.log("Received remote stream:", remoteVideoStream);
            setRemoteStream(remoteVideoStream);
            
            if (remoteVideoRef.current) {
              remoteVideoRef.current.setAttribute('autoplay', '');
              remoteVideoRef.current.setAttribute('playsInline', '');
              remoteVideoRef.current.srcObject = remoteVideoStream;
              
              try {
                remoteVideoRef.current.play();
                console.log("Remote video playing successfully");
              } catch (err) {
                console.error("Error playing remote video:", err);
              }
            }
          });

          peer.on("error", (err) => {
            console.error("Peer connection error:", err);
            cleanup();
          });

          peer.on("close", () => {
            console.log("Peer connection closed");
            cleanup();
          });

         // Process any pending signals that arrived before peer was created
          if (pendingSignalRef.current && Array.isArray(pendingSignalRef.current)) {
            console.log("Processing pending signals:", pendingSignalRef.current);
            pendingSignalRef.current.forEach(signal => {
              peer.signal(signal);
            });
            pendingSignalRef.current = null;
          }
        }

      } catch (error) {
        console.error("Error handling incoming call:", error);
        cleanup();
        alert("Failed to accept call. Please try again.");
      }
    };

      // Function to reject incoming call
  const rejectIncomingCall = () => {
    socket?.emit("reject_video_call", {
      roomId,
      from: userId,
      to: incomingCallFrom,
    });
    setShowIncomingCallDialog(false);
    setIncomingCallFrom("");
  };


    // End Video Call
    const endVideoCall = () => {
      socket?.emit("end_video_call", {
        roomId,
        from: userId,
        to: receiverId,
      });
      cleanup();
    };

    // Toggle Video
    const toggleVideo = () => {
      const videoTrack = localStreamRef.current?.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    };

    // Toggle Audio
    const toggleAudio = () => {
      const audioTrack = localStreamRef.current?.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    };

    // Socket event listeners
    useEffect(() => {
      if (!socket) return;

      socket.on("incoming_video_call", async (data) => {
        if (!hasPremiumAccess) {
          socket.emit("reject_video_call", {
            roomId,
            from: userId, 
            to: data.from,
          });
          toast.error("Premium Required", {
            description: "Upgrade to Premium to accept video calls",
            action: {
              label: "Upgrade",
              onClick: () => window.location.href = "/user/Premium"
            },
            duration: 5000
          });
          return;
        }
        console.log("Received incoming call:", data);
        if (data.to === userId && data.roomId === roomId) {
          setIncomingCallFrom(data.from);
          setShowIncomingCallDialog(true);
        }
      });

      socket.on("video_call_signal", (data) => {
        console.log("Received signal:", data);
        
        if (data.to === userId) {
          if (!peerRef.current) {
             // Initialize the pending signals array if it doesn't exist
              pendingSignalRef.current = pendingSignalRef.current || [];
              // Store the signal to process after peer is created
               console.log("Storing pending signal:", data.signal);
              pendingSignalRef.current.push(data.signal);
          } else {
            // If peer exists, process the signal immediately
            console.log("Processing signal immediately:", data.signal);
            try {
              peerRef.current.signal(data.signal);
              
              if (data.signal.type === "offer" || data.signal.type === "answer") {
                setCallStatus("in-call");
              }
            } catch (error) {
              console.error("Error processing signal:", error);
              cleanup();
            }
          }
        }
      });

      socket.on("end_video_call", () => {
        console.log("Call ended by the other user");
        setShowIncomingCallDialog(false);
        setIncomingCallFrom("");
        cleanup();
      });

      socket.on("video_call_rejected", () => {
        toast.error("Call Declined", {
          description: "The recipient declined your call",
          duration: 5000
        });
        cleanup();
      }); 

      return () => {
        socket.off("incoming_video_call");
        socket.off("video_call_signal");
        socket.off("end_video_call");
        socket.off("video_call_rejected");
        cleanup();
      };
    }, [socket, userId, roomId, receiverId]);
    // Send message handler
    const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      if (!hasPremiumAccess) {
        toast.error("Premium Required", {
          description: "Upgrade to Premium to send messages",
          action: {
            label: "Upgrade",
            onClick: () => window.location.href = "/user/Premium"
          },
          duration: 5000
        });
        return;
      }

      sendMessage(newMessage, receiverId);
      setNewMessage("");
    };

    const handleVideoCallClick = () => {
      if (!hasPremiumAccess) {
        toast.error("Premium Required", {
          description: "Video calls are a premium feature. Upgrade to access.",
          action: {
            label: "Upgrade",
            onClick: () => window.location.href = "/user/Premium"
          },
          duration: 5000
        });
        return;
      }

      // Existing video call logic here
      startVideoCall();
    };

    // Loading state
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full relative">
         {/* Incoming Call Dialog */}
      {showIncomingCallDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">Incoming Video Call</h3>
              <div className="mt-2 mb-6 h-2 w-full flex space-x-1 justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-0"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-300"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-600"></div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={rejectIncomingCall}
              >
                Decline
              </Button>
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={handleIncomingCall}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
        {/* Video Call UI */}
        {isVideoCallActive && (
        <div className="fixed inset-0 z-50 bg-black/90">
          <div className="max-w-6xl mx-auto p-4 h-full flex flex-col">
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Local Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror local video
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <span className="text-white">Camera Off</span>
                  </div>
                )}
              </div>

              {/* Remote Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {callStatus === "calling" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <span className="text-white animate-pulse">Calling...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Call Controls */}
            <div className="mt-4 flex justify-center gap-4">
              <Button
                variant="destructive"
                size="icon"
                onClick={endVideoCall}
                className="rounded-full h-12 w-12"
              >
                <Phone className="h-6 w-6 rotate-225" />
              </Button>
              <Button
                variant={isVideoEnabled ? "outline" : "destructive"}
                size="icon"
                onClick={toggleVideo}
                className="rounded-full h-12 w-12"
              >
                {isVideoEnabled ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <VideoOff className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant={isAudioEnabled ? "outline" : "destructive"}
                size="icon"
                onClick={toggleAudio}
                className="rounded-full h-12 w-12"
              >
                {isAudioEnabled ? (
                  <Mic className="h-6 w-6" />
                ) : (
                  <MicOff className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

        {/* Chat Room Header with Video Call Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Chat Room</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={handleVideoCallClick}
            className="relative"
          >
            <Video className="h-5 w-5" />
            {!hasPremiumAccess && (
              <Lock className="h-3 w-3 absolute bottom-0 right-0 text-yellow-500" />
            )}
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1">
        <div className="p-4">
            {!hasPremiumAccess ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
                <Lock className="h-12 w-12 text-yellow-500" />
                <h3 className="text-lg font-semibold text-center">Premium Feature</h3>
                <p className="text-center text-gray-600 max-w-md">
                  Upgrade to Premium to unlock messaging and video calls.
                  Connect with professionals and recruiters seamlessly.
                </p>
                <Button
                  onClick={() => window.location.href = "/user/Premium"}
                  className="mt-4"
                >
                  Upgrade to Premium
                </Button>
              </div>
            ) : messages && messages.length > 0 ? (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isOwnMessage={message.senderId === userId}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={hasPremiumAccess 
                ? "Type a message..." 
                : "Upgrade to Premium to send messages"}
              className="flex-1"
              disabled={!hasPremiumAccess}            
            />
            <Button type="submit" size="icon" disabled={!hasPremiumAccess}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    );
  };
