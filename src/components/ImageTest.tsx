import React from 'react';
import { getLogo, getTeamImage, getUIImage, getBackgroundImage } from '../utils/assets';

export const ImageTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Image Test Component</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Logo Test:</h3>
        <div className="flex space-x-4">
          <div>
            <p>Light Logo:</p>
            <img src={getLogo('light')} alt="Light Logo" className="h-16 w-auto" />
          </div>
          <div>
            <p>Dark Logo:</p>
            <img src={getLogo('dark')} alt="Dark Logo" className="h-16 w-auto" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Team Images Test:</h3>
        <div className="flex space-x-4">
          <div>
            <p>Pastor:</p>
            <img src={getTeamImage('pastor')} alt="Pastor" className="h-32 w-32 object-cover rounded" />
          </div>
          <div>
            <p>Elder:</p>
            <img src={getTeamImage('elder')} alt="Elder" className="h-32 w-32 object-cover rounded" />
          </div>
          <div>
            <p>Deacon:</p>
            <img src={getTeamImage('deacon')} alt="Deacon" className="h-32 w-32 object-cover rounded" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">UI Images Test:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p>Adults:</p>
            <img src={getUIImage('adults')} alt="Adults" className="h-24 w-full object-cover rounded" />
          </div>
          <div>
            <p>Youth:</p>
            <img src={getUIImage('youth')} alt="Youth" className="h-24 w-full object-cover rounded" />
          </div>
          <div>
            <p>Worship:</p>
            <img src={getUIImage('worship')} alt="Worship" className="h-24 w-full object-cover rounded" />
          </div>
          <div>
            <p>Fellowship:</p>
            <img src={getUIImage('fellowship')} alt="Fellowship" className="h-24 w-full object-cover rounded" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Background Images Test:</h3>
        <div className="space-y-2">
          <div>
            <p>Hero 1:</p>
            <img src={getBackgroundImage('hero1')} alt="Hero 1" className="h-32 w-full object-cover rounded" />
          </div>
          <div>
            <p>Hero 2:</p>
            <img src={getBackgroundImage('hero2')} alt="Hero 2" className="h-32 w-full object-cover rounded" />
          </div>
          <div>
            <p>Hero 3:</p>
            <img src={getBackgroundImage('hero3')} alt="Hero 3" className="h-32 w-full object-cover rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}; 