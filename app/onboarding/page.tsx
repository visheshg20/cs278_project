// components/OnboardingForm.tsx

"use client"; // This is a client component 👈🏽

import React, { useState } from 'react';

interface FormData {
  name: string;
  status: 'Undergraduate Student' | 'Graduate Student';
  school: string;
}

const OnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    status: 'Undergraduate Student',
    school: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Print form data to the console instead of sending it to the server
    console.log('Form Data Submitted:', formData);
    alert('Form Submitted! Check console for data.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name or nickname" name="name" value={formData.name} onChange={handleChange} required />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="Undergraduate Student">Undergraduate Student</option>
        <option value="Graduate Student">Graduate Student</option>
      </select>
      <input type="text" placeholder="School" name="school" value={formData.school} onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default OnboardingForm;
