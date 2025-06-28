import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const FeedbackForm = () => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleStarHover = (star) => {
    setHovered(star);
  };

  const handleStarLeave = () => {
    setHovered(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the feedback to your backend or API
    // Include email if user is not logged in
    // Example: { rating, feedback, email: user ? user._email : email }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-green-700 mb-2">Thank you for your feedback!</h3>
        <p className="text-green-600">We appreciate your input to help us improve Nutri-Planner.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-purple-800 mb-2 text-center">Feedback</h2>
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg font-medium text-gray-700 mb-1">Rate your experience:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              className="focus:outline-none"
            >
              <Star
                size={32}
                className={
                  (hovered || rating) >= star
                    ? 'text-yellow-400 fill-yellow-300 stroke-yellow-500'
                    : 'text-gray-300 stroke-gray-400'
                }
                strokeWidth={2}
                fill={(hovered || rating) >= star ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>
      </div>
      {/* Email input for guests */}
      {!user && (
        <div>
          <label htmlFor="feedback-email" className="block text-lg font-medium text-gray-700 mb-2">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder="Enter your email to send feedback"
            required
          />
          {emailTouched && !isEmailValid(email) && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
          )}
        </div>
      )}
      <div>
        <label htmlFor="feedback" className="block text-lg font-medium text-gray-700 mb-2">
          Your Feedback
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
          placeholder="Let us know what you think..."
          required
        />
      </div>
      <button
        type="submit"
        className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-purple-700 transition disabled:opacity-50"
        disabled={
          rating === 0 ||
          feedback.trim() === '' ||
          (!user && (!isEmailValid(email) || email === ''))
        }
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm; 