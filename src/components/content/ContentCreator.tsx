'use client';

import { useState } from 'react';
import { NewContentRequest } from '@/types/backend-aliases';
import { apiService } from '@/services/api';

interface ContentCreatorProps {
  moduleId: number;
  onContentCreated: () => void;
  onCancel: () => void;
}

export default function ContentCreator({ moduleId, onContentCreated, onCancel }: ContentCreatorProps) {
  const [contentType, setContentType] = useState<'Text' | 'Question'>('Text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!body.trim()) {
      setError(contentType === 'Text' ? 'Content is required' : 'Question text is required');
      return;
    }

    if (contentType === 'Question') {
      const nonEmptyOptions = options.filter(opt => opt.trim());
      if (nonEmptyOptions.length < 2) {
        setError('Questions must have at least 2 options');
        return;
      }
      if (!correctAnswer.trim()) {
        setError('Correct answer is required for questions');
        return;
      }
      if (!options.includes(correctAnswer)) {
        setError('Correct answer must be one of the provided options');
        return;
      }
    }

    try {
      setCreating(true);
      setError(null);

      const contentData: NewContentRequest = {
        title: title.trim(),
        body: body.trim(),
        type: contentType,
        moduleId,
        ...(contentType === 'Question' && {
          options: options.filter(opt => opt.trim()),
          correctAnswer: correctAnswer.trim()
        })
      };

      await apiService.createContent(contentData);

      // Reset form
      setTitle('');
      setBody('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      setContentType('Text');

      onContentCreated();
    } catch (err) {
      console.error('Error creating content:', err);
      setError(err instanceof Error ? err.message : 'Failed to create content');
    } finally {
      setCreating(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    // Update correct answer if it matches the old value
    if (correctAnswer === options[index]) {
      setCorrectAnswer(value);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);

      // Clear correct answer if it was the removed option
      if (correctAnswer === options[index]) {
        setCorrectAnswer('');
      }
    }
  };

  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#171717' }}>Create New Content Block</h3>
        <button
          onClick={onCancel}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Content Type Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#171717' }}>
            Content Type:
          </label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                value="Text"
                checked={contentType === 'Text'}
                onChange={(e) => setContentType(e.target.value as 'Text' | 'Question')}
                style={{ marginRight: '8px' }}
              />
              <span style={{ color: '#171717' }}>Text Content</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                value="Question"
                checked={contentType === 'Question'}
                onChange={(e) => setContentType(e.target.value as 'Text' | 'Question')}
                style={{ marginRight: '8px' }}
              />
              <span style={{ color: '#171717' }}>Question</span>
            </label>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="contentTitle" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#171717' }}>
            {contentType === 'Text' ? 'Content Title:' : 'Question Title:'}
          </label>
          <input
            type="text"
            id="contentTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={contentType === 'Text' ? 'Enter content title...' : 'Enter question title...'}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              color: '#171717'
            }}
          />
        </div>

        {/* Body/Content */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="contentBody" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#171717' }}>
            {contentType === 'Text' ? 'Content:' : 'Question Text:'}
          </label>
          <textarea
            id="contentBody"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={contentType === 'Text' ? 'Enter the content text...' : 'Enter the question...'}
            rows={contentType === 'Text' ? 6 : 3}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical',
              backgroundColor: '#ffffff',
              color: '#171717'
            }}
          />
        </div>

        {/* Question-specific fields */}
        {contentType === 'Question' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#171717' }}>
              Answer Options:
            </label>

            {options.map((option, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                <span style={{
                  minWidth: '20px',
                  fontWeight: 'bold',
                  color: '#6c757d'
                }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    color: '#171717'
                  }}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    style={{
                      padding: '8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#007cba',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '8px'
                }}
              >
                Add Option
              </button>
            )}

            {/* Correct Answer Selection */}
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#171717' }}>
                Correct Answer:
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  color: '#171717'
                }}
              >
                <option value="">Select the correct answer...</option>
                {options.filter(opt => opt.trim()).map((option, index) => (
                  <option key={index} value={option}>
                    {String.fromCharCode(65 + options.indexOf(option))}. {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: '10px 20px',
              backgroundColor: creating ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: creating ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {creating ? 'Creating...' : `Create ${contentType} Content`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={creating}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: creating ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 