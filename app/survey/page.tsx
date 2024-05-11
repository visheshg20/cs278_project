// pages/SurveyPage.tsx
"use client"; // This is a client component 👈🏽

import React, { useState } from 'react';

interface FormData {
  values: string[];
  activities: string[];
  groupActivities: string[];
  excitementLevel: number;
}

const SurveyPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    values: [],
    activities: [],
    groupActivities: [],
    excitementLevel: 3
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Survey Completed! Check console for responses.');
  };

  const handleValueChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.includes(value) ? prev.values.filter(item => item !== value) : [...prev.values, value]
    }));
  };

  const handleActivityChange = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity) ? prev.activities.filter(item => item !== activity) : [...prev.activities, activity]
    }));
  };

  const handleGroupActivityChange = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      groupActivities: prev.groupActivities.includes(activity) ? prev.groupActivities.filter(item => item !== activity) : [...prev.groupActivities, activity]
    }));
  };

  const handleExcitementLevelChange = (level: number) => {
    setFormData(prev => ({
      ...prev,
      excitementLevel: level
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Which values are most important to you in a friendship? (Select up to three)</h2>
          {["Dark Humor", "Sarcasm", "Empathy", "Loyalty", "Honesty", "Open-mindedness", "Reliability", "Adventurousness", "Supportiveness", "Intellectual Curiosity", "Creativity", "Optimism", "Social Conscience"].map(value => (
            <label key={value}>
              <input
                type="checkbox"
                checked={formData.values.includes(value)}
                onChange={() => handleValueChange(value)}
              />
              {value}
            </label>
          ))}
        </div>
        <div>
          <h2>How do you prefer to spend your free time? (Select all that apply)</h2>
          {["Outdoors", "Gaming", "Reading/Writing", "Sports & Working Out", "Arts & Crafts", "Watching TV & Movies", "Going out & Nightlife"].map(activity => (
            <label key={activity}>
              <input
                type="checkbox"
                checked={formData.activities.includes(activity)}
                onChange={() => handleActivityChange(activity)}
              />
              {activity}
            </label>
          ))}
        </div>
        <div>
          <h2>What type of group activities interest you? (Rank these options)</h2>
          {["Casual soccer match", "Super Smash Bros & Mario Kart Tournament", "Board Game Nights", "Group Hikes", "Rock Climbing", "Cooking Classes", "Wine & Cheese Night", "Volunteering"].map(activity => (
            <label key={activity}>
              <input
                type="checkbox"
                checked={formData.groupActivities.includes(activity)}
                onChange={() => handleGroupActivityChange(activity)}
              />
              {activity}
            </label>
          ))}
        </div>
        <div>
          <h2>How excited are you to meet IRL?</h2>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.excitementLevel}
            onChange={e => handleExcitementLevelChange(parseInt(e.target.value))}
          />
          <span>{formData.excitementLevel}</span>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SurveyPage;
