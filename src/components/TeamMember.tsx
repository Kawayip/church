import React from 'react';
import { getTeamImage } from '../utils/assets';

interface TeamMemberProps {
  id: string;
  name: string;
  role: string;
  bio: string;
  email?: string;
  phone?: string;
}

export const TeamMember: React.FC<TeamMemberProps> = ({
  id,
  name,
  role,
  bio,
  email,
  phone
}) => {
  return (
    <div className="card p-6 text-center">
      <div className="mb-4">
        <img
          src={getTeamImage(id)}
          alt={name}
          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#3f7f8c] dark:border-emerald-400"
        />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {name}
      </h3>
      
      <p className="text-[#3f7f8c] dark:text-emerald-400 font-medium mb-3">
        {role}
      </p>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {bio}
      </p>
      
      {(email || phone) && (
        <div className="space-y-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="block text-sm text-[#3f7f8c] dark:text-emerald-400 hover:underline"
            >
              {email}
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="block text-sm text-[#3f7f8c] dark:text-emerald-400 hover:underline"
            >
              {phone}
            </a>
          )}
        </div>
      )}
    </div>
  );
}; 