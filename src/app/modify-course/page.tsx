'use client';

import { useState } from 'react';

interface ContentBlock {
  id: string;
  type: 'article' | 'quiz';
  title: string;
  content: string;
  completed: boolean;
}

export default function CoursePage() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: '1',
      type: 'article',
      title: 'Introduction to Web Development',
      content: 'Web development is the work involved in developing a website for the Internet or an intranet...',
      completed: false,
    },
    {
      id: '2',
      type: 'quiz',
      title: 'Web Development Basics Quiz',
      content: 'Test your knowledge about web development fundamentals...',
      completed: false,
    },
  ]);

  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [newBlock, setNewBlock] = useState<Partial<ContentBlock>>({
    type: 'article',
    title: '',
    content: '',
  });

  const toggleCompletion = (id: string) => {
    setContentBlocks(blocks =>
      blocks.map(block =>
        block.id === id ? { ...block, completed: !block.completed } : block
      )
    );
  };

  const handleAddBlock = () => {
    if (!newBlock.title || !newBlock.content) return;

    const block: ContentBlock = {
      id: Date.now().toString(),
      type: newBlock.type as 'article' | 'quiz',
      title: newBlock.title,
      content: newBlock.content,
      completed: false,
    };

    setContentBlocks(prev => [...prev, block]);
    setNewBlock({ type: 'article', title: '', content: '' });
    setIsAddingBlock(false);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Content</h1>
          <button
            onClick={() => setIsAddingBlock(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Content Block
          </button>
        </div>

        {isAddingBlock && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Add New Content Block</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newBlock.type}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, type: e.target.value as 'article' | 'quiz' }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="article">Article</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newBlock.title}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newBlock.content}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md h-32"
                  placeholder="Enter content"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingBlock(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBlock}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Block
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {contentBlocks.map((block) => (
            <div
              key={block.id}
              className={`p-6 rounded-lg border ${
                block.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      block.type === 'article'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {block.type === 'article' ? 'Article' : 'Quiz'}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900">{block.title}</h2>
                </div>
                <button
                  onClick={() => toggleCompletion(block.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    block.completed
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {block.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              <div className="prose max-w-none text-gray-700">{block.content}</div>

              {block.type === 'quiz' && (
                <div className="mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
