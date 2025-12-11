export interface User {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  stars: 1 | 2 | 3; // Trust rating: 1-3 stars
  completedRisks: number;
  totalRisks: number;
  memberSince: Date;
  verification: {
    creditCheckScore: number; // 0-100, needs to be >= 70 for verification
    hasFullName: boolean;
    hasVerifiedEmail: boolean;
    hasVerifiedPhone: boolean;
    hasConfirmedAddress: boolean;
    hasBankAccount: boolean;
  };
}

export function getDisplayName(user: User, format: 'full' | 'initial' = 'full'): string {
  if (format === 'initial') {
    return `${user.firstName} ${user.lastName.charAt(0)}.`;
  }
  return `${user.firstName} ${user.lastName}`;
}

export function getUserStars(completedRisks: number, totalRisks: number): 1 | 2 | 3 {
  if (totalRisks === 0) return 3;
  const completionRate = completedRisks / totalRisks;
  
  if (completionRate === 1 && completedRisks >= 10) return 3; // Perfect track record with 10+ risks
  if (completionRate >= 0.95 || completedRisks >= 5) return 2; // 95%+ or at least 5 completed
  return 1; // Starting level
}

export function isUserVerified(user: User): boolean {
  const { verification } = user;
  const profileComplete = 
    verification.hasFullName &&
    verification.hasVerifiedEmail &&
    verification.hasVerifiedPhone &&
    verification.hasConfirmedAddress &&
    verification.hasBankAccount;
  
  return verification.creditCheckScore >= 70 && profileComplete;
}

export function getProfileCompleteness(user: User): number {
  const { verification } = user;
  const checks = [
    verification.hasFullName,
    verification.hasVerifiedEmail,
    verification.hasVerifiedPhone,
    verification.hasConfirmedAddress,
    verification.hasBankAccount,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}