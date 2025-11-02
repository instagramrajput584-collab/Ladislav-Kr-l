import React from 'react';
import { User } from '../types';
import Card from '../components/Card';

const mockContacts: User[] = [
  { id: '1', name: 'Alena Novakova', avatarUrl: 'https://picsum.photos/id/1027/200' },
  { id: '2', name: 'Jan Svoboda', avatarUrl: 'https://picsum.photos/id/1005/200' },
  { id: '3', name: 'Petr Dvořák', avatarUrl: 'https://picsum.photos/id/1011/200' },
  { id: '4', name: 'Eva Černá', avatarUrl: 'https://picsum.photos/id/1012/200' },
  { id: '5', name: 'Martin Procházka', avatarUrl: 'https://picsum.photos/id/1013/200' },
  { id: '6', name: 'Lucie Kučerová', avatarUrl: 'https://picsum.photos/id/1014/200' },
  { id: '7', name: 'Tomáš Horák', avatarUrl: 'https://picsum.photos/id/1015/200' },
  { id: '8', name: 'Veronika Veselá', avatarUrl: 'https://picsum.photos/id/1016/200' },
];

const Contacts: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-neutral">Contacts</h1>
        <button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-indigo-200/80 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105">
          Add Contact
        </button>
      </div>
      <Card>
        <ul className="divide-y divide-gray-100">
          {mockContacts.map(contact => (
            <li key={contact.id} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full object-cover" src={contact.avatarUrl} alt={contact.name} />
                <span className="ml-4 text-lg font-medium text-gray-800">{contact.name}</span>
              </div>
              <button className="text-primary hover:text-secondary font-semibold transition-colors">View Profile</button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Contacts;