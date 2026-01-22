import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, X } from 'lucide-react';
import './AntiGravityAssistant.css';

const AntiGravityAssistant = ({ onCommand, onStateChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('Ready');
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setFeedback('Listening...');
            };

            recognition.onend = () => {
                // Auto-restart if it cuts off but we are still "Open"
                if (isOpen) {
                    try {
                        recognition.start();
                    } catch (e) {
                        setIsListening(false);
                    }
                } else {
                    setIsListening(false);
                    setFeedback('Paused');
                }
            };

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                        processCommand(finalTranscript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                setTranscript(interimTranscript || finalTranscript);
            };

            recognitionRef.current = recognition;
        } else {
            setFeedback('Voice Not Supported');
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [isOpen]);

    const speak = (text) => {
        if (synthRef.current) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            synthRef.current.speak(utterance);
        }
    };

    const processCommand = (cmd) => {
        const lowerCmd = cmd.toLowerCase().trim();
        console.log("Voice Command:", lowerCmd);
        setFeedback(`Heard: "${cmd}"`);

        // --- NAVIGATION COMMANDS ---
        if (lowerCmd.includes('go to dashboard') || lowerCmd.includes('open dashboard')) {
            speak('Navigating to Dashboard');
            onCommand('NAVIGATE', '/dashboard');
        }
        else if (lowerCmd.includes('go to detect') || lowerCmd.includes('open detection')) {
            speak('Opening Detection Center');
            onCommand('NAVIGATE', '/detect');
        }
        else if (lowerCmd.includes('go to settings')) {
            speak('Opening Settings');
            onCommand('NAVIGATE', '/settings');
        }
        else if (lowerCmd.includes('go to about') || lowerCmd.includes('open about')) {
            speak('Opening About Us');
            onCommand('NAVIGATE', '/about');
        }
        else if (lowerCmd.includes('go to home')) {
            speak('Going Home');
            onCommand('NAVIGATE', '/');
        }

        // --- INPUT FLOW COMMANDS ---
        else if (lowerCmd.match(/^\d+$/) || lowerCmd.match(/^case \d+$/)) {
            // Precise number handling: "25", "8492"
            const match = lowerCmd.match(/\d+/);
            if (match) {
                const value = match[0];
                speak(`Inputting ${value}`);
                onCommand('INPUT_VALUE', value);
            }
        }
        else if (lowerCmd.includes('case number') || lowerCmd.match(/case\s+(\d+)/)) {
            // Explicit generic trigger
            const match = lowerCmd.match(/\d+/);
            if (match) {
                speak(`Setting case number ${match[0]}`);
                onCommand('SET_CASE_NUMBER', match[0]);
            } else {
                speak("Please say the number.");
            }
        }
        else if (lowerCmd.includes('confirm') || lowerCmd.includes('next') || lowerCmd.includes('enter')) {
            speak('Confirmed');
            onCommand('CONFIRM');
        }
        else if (lowerCmd.includes('x-ray') || lowerCmd.includes('x ray')) {
            speak('Selected X-Ray');
            onCommand('SET_REPORT_TYPE', 'X-Ray');
        }
        else if (lowerCmd.includes('ct scan')) {
            speak('Selected CT Scan');
            onCommand('SET_REPORT_TYPE', 'CT Scan');
        }
        else if (lowerCmd.includes('mri')) {
            speak('Selected MRI');
            onCommand('SET_REPORT_TYPE', 'MRI');
        }
        else if (lowerCmd.includes('upload') || lowerCmd.includes('image')) {
            speak('Opening upload dialog');
            onCommand('TRIGGER_UPLOAD');
        }
        else if (lowerCmd.includes('analyze') || lowerCmd.includes('run analysis')) {
            speak('Starting analysis');
            onCommand('Analyze');
        }
        else if (lowerCmd.includes('stop listening') || lowerCmd.includes('go to sleep')) {
            toggleAssistant();
        }
    };

    const toggleAssistant = () => {
        // Toggle the open state
        setIsOpen(prev => {
            const newState = !prev;
            if (newState) {
                // OPENING
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.start();
                        setIsListening(true);
                        setFeedback('Listening...');
                        speak('Voice assistant activated. Please enter case number.');
                    } catch (e) {
                        console.log("Recognition already started");
                    }
                }
            } else {
                // CLOSING
                if (recognitionRef.current) {
                    recognitionRef.current.stop();
                    setIsListening(false);
                }
                speak('Voice assistant deactivated');
            }
            return newState;
        });
    };

    return (
        <div className={`antigravity-wrapper ${isOpen ? 'open' : ''}`}>
            {isOpen && (
                <div className="assistant-panel glass-panel">
                    <div className="assistant-header">
                        <span className="status-dot" style={{ background: isListening ? '#00ff88' : '#ff4444' }}></span>
                        <span className="assistant-title">AI Assistant</span>
                        <button className="close-btn" onClick={toggleAssistant}><X size={14} /></button>
                    </div>
                    <div className="transcript-box">
                        {transcript || "Listening for commands..."}
                    </div>
                    <div className="feedback-line">
                        {feedback}
                    </div>
                    <div className="voice-waves">
                        {/* Visualizer bars */}
                        <div className={`bar ${isListening ? 'animate' : ''}`}></div>
                        <div className={`bar ${isListening ? 'animate' : ''}`}></div>
                        <div className={`bar ${isListening ? 'animate' : ''}`}></div>
                        <div className={`bar ${isListening ? 'animate' : ''}`}></div>
                    </div>
                </div>
            )}

            <button className={`floating-mic-btn ${isListening ? 'listening' : ''}`} onClick={toggleAssistant}>
                {isOpen ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
        </div>
    );
};

export default AntiGravityAssistant;
