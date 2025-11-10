
import React, { useState, useEffect, useRef } from 'react';
import type { User, StudyGroupMember, ChatMessage } from '../types';

const mockMembers: StudyGroupMember[] = [
  { id: 'user-2', name: 'Alex Doe', skill: 'Web Development', progress: 65 },
  { id: 'user-3', name: 'Sam Smith', skill: 'Web Development', progress: 40 },
  { id: 'user-4', name: 'Casey Lee', skill: 'Web Development', progress: 80 },
];

const initialMessages: ChatMessage[] = [
    { id: 'msg-1', senderId: 'user-2', senderName: 'Alex Doe', content: "Hey everyone! Glad to be here. How's week 3 going for you all?", timestamp: new Date(Date.now() - 60000 * 5).toISOString()},
    { id: 'msg-2', senderId: 'user-3', senderName: 'Sam Smith', content: "A bit stuck on the project, but getting there. The resources on CSS Grid were super helpful!", timestamp: new Date(Date.now() - 60000 * 3).toISOString()},
];

const MemberCard: React.FC<{ member: StudyGroupMember }> = ({ member }) => (
    <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-lg">
            {member.name.charAt(0)}
        </div>
        <div>
            <p className="font-semibold text-gray-800">{member.name}</p>
            <p className="text-sm text-gray-500">{member.progress}% complete</p>
        </div>
    </div>
);

const StudyGroup = ({ user }: { user: User }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const allMembers = [
      { id: user.id, name: user.name, skill: user.skill || 'Not selected', progress: user.progress },
      ...mockMembers.filter(m => m.skill === (user.skill || m.skill))
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Study Group</h2>
        <div className="space-y-6 overflow-y-auto">
            {allMembers.map(member => <MemberCard key={member.id} member={member} />)}
        </div>
      </div>
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm flex flex-col h-[75vh]">
        <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800">{user.skill || 'General'} Study Chat</h3>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderId !== user.id && (
                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm flex-shrink-0">
                            {msg.senderName.charAt(0)}
                        </div>
                    )}
                    <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.senderId === user.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        <p className="text-sm">{msg.content}</p>
                    </div>
                </div>
            ))}
            <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors duration-200">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default StudyGroup;
