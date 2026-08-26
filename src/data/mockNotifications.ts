import { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-01',
    title: 'New Career Fit Unlocked: AI / ML Engineer (96% Match)',
    message: 'Based on your latest assessment answers and Python skills, your compatibility with AI / ML Engineer has increased to 96%.',
    type: 'recommendation',
    timestamp: '2026-02-24T10:30:00Z',
    read: false,
    actionUrl: '/careers/car-ai-ml-engineer'
  },
  {
    id: 'notif-02',
    title: 'Achievement Stamp Unlocked: "Masterclass Scholar"',
    message: 'You have watched over 60 minutes of expert video sessions! Your passport score increased by +8 points.',
    type: 'milestone',
    timestamp: '2026-02-23T15:45:00Z',
    read: false,
    actionUrl: '/dashboard'
  },
  {
    id: 'notif-03',
    title: 'New Curated Guide: The AI Systems Blueprint 2026',
    message: 'A brand-new 68-page engineering guide has been added to the Technology domain resources.',
    type: 'resource',
    timestamp: '2026-02-22T08:15:00Z',
    read: true,
    actionUrl: '/resources'
  },
  {
    id: 'notif-04',
    title: 'Passport Profile 68% Complete',
    message: 'Upload your verified resume and add your primary target salary to unlock your full Career Clarity Seal.',
    type: 'system',
    timestamp: '2026-02-20T12:00:00Z',
    read: true,
    actionUrl: '/profile'
  }
];
