import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact/messages');
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/messages/${id}/read`);
      toast.success('Message marked as read');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/contact/messages/${id}`);
      toast.success('Message deleted');
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Contact Messages</h1>

      {/* Responsive Layout: Stack on mobile, side by side on desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Messages List - Left Side (Full width on mobile, 1/3 on desktop) */}
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${!message.isRead ? 'font-semibold' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={`flex-shrink-0 ${!message.isRead ? 'text-blue-600' : 'text-gray-400'}`}>
                    <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{message.name}</p>
                    <p className="text-xs text-gray-500 truncate">{message.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {messages.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">No messages yet.</p>
            </div>
          )}
        </div>

        {/* Message Detail - Right Side (Full width on mobile, 2/3 on desktop) */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6">
          {selectedMessage ? (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold break-words">{selectedMessage.subject}</h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                    From: <span className="font-medium">{selectedMessage.name}</span> ({selectedMessage.email})
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                  {!selectedMessage.isRead && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 mt-4">
                <p className="whitespace-pre-wrap text-sm sm:text-base break-words">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-6">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <EnvelopeIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm sm:text-base">Select a message to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesList;