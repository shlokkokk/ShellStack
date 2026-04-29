import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, ChevronDown, Maximize2, ShieldCheck, Zap, Terminal } from 'lucide-react';
import { getResponse, type ChatMessage } from '../lib/aiBrain';
import './ChatBot.css';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Neural link established. I am StackAI, your resident ghost in the machine. I eat firewalls for breakfast and bleed 0days. What target are we melting today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const response = await getResponse(userMessage.content);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const renderContent = (content: string) => {
    const parseInline = (text: string) => {
      let t = text;
      // Bold **text**
      t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic *text* or _text_
      t = t.replace(/\*(.*?)\*/g, '<em>$1</em>');
      t = t.replace(/_(.*?)_/g, '<em>$1</em>');
      // Inline code `code`
      t = t.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
      // Links [text](url)
      t = t.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="msg-link">$1</a>');
      return t;
    };

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${index}`} className="code-block-wrapper">
              <div className="code-block-header">
                <Terminal size={12} /> Terminal Output
              </div>
              <pre className="code-block">
                <code>{codeBlockContent.join('\n')}</code>
              </pre>
            </div>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="msg-h2" dangerouslySetInnerHTML={{ __html: parseInline(line.replace('## ', '')) }} />);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="msg-h3" dangerouslySetInnerHTML={{ __html: parseInline(line.replace('### ', '')) }} />);
      } else if (line.startsWith('> ')) {
        elements.push(<blockquote key={index} className="msg-quote" dangerouslySetInnerHTML={{ __html: parseInline(line.replace('> ', '')) }} />);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={index} className="msg-li" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />);
      } else if (line === '---') {
        elements.push(<div key={index} className="msg-divider" />);
      } else if (line.trim() !== '') {
        elements.push(<p key={index} className="msg-p" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />);
      } else {
        // empty line spacing
        elements.push(<div key={index} className="msg-spacer" />);
      }
    });

    return elements;
  };

  return (
    <div className="chatbot-container-wrapper">
      {showTooltip && !isOpen && (
        <div className="chatbot-tooltip">
          <span>Need Intel?</span>
          <div className="chatbot-tooltip-arrow" />
        </div>
      )}
      <div 
        className={`chatbot-fab ${isOpen ? 'active' : ''}`} 
        onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
        title="Access StackAI Intelligence"
      >
        {isOpen ? <ChevronDown size={28} /> : <Bot size={28} className="animate-pulse" />}
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="scanline" />
          <div className="neural-scan" />
          
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <Zap size={20} className="text-[#39FF14]" />
              <span className="text-white tracking-widest text-lg">STACK.AI v3.0</span>
              <div className="chatbot-header-status" />
            </div>
            <div className="flex items-center gap-3">
              <button className="chatbot-icon-btn">
                <Maximize2 size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="chatbot-icon-btn close-btn"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="message-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className="message-content">
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <div className="chatbot-input-container">
              <input
                type="text"
                placeholder="Initialize query override..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="chatbot-input"
                autoFocus
              />
              <button 
                onClick={handleSend}
                className="chatbot-send-btn"
                disabled={!input.trim() || isTyping}
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-[#39FF14] opacity-70" />
              <span className="text-xs text-gray-400 uppercase tracking-[0.2em] font-mono">
                God-Tier Intel Node Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
