'use client'
import React, { useMemo } from 'react';
import { RootState, useAppSelector } from '../../store/store';
import { CareerMapLogo } from './logo';
import { Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

const DynamicNavigation = dynamic(() => import('./Navigation'), {
  ssr: true,
  loading: () => <div className="h-16 w-96 animate-pulse bg-gray-100 rounded" />
});

const DynamicUserMenu = dynamic(() => import('./userMenu'), {
  ssr: true,
  loading: () => <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
});

// Update the type to be more specific about what planType can be
type PlanType = "Professional" | "recruiter-pro" | undefined;

const PremiumButton = React.memo(({ planType }: { planType: PlanType }) => (
  <Link href="/user/Premium">
    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-sm font-medium hover:from-amber-300 hover:to-yellow-500 transition-colors cursor-pointer">
      <Crown size={16} />
      <span>{planType || 'Premium'}</span>
    </div>
  </Link>
));

const UpgradeButton = React.memo(() => (
  <Link href="/user/Premium">
    <Button 
      variant="outline"
      className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 border-blue-200"
    >
      <Sparkles size={16} className="text-blue-500" />
      <span>Upgrade to Premium</span>
    </Button>
  </Link>
));

const SubscriptionSection = React.memo(({ isPremium, planType }: { 
  isPremium: boolean; 
  planType?: PlanType;
}) => (
  isPremium ? <PremiumButton planType={planType} /> : <UpgradeButton />
));

SubscriptionSection.displayName = 'SubscriptionSection';
PremiumButton.displayName = 'PremiumButton';
UpgradeButton.displayName = 'UpgradeButton';

const Header = () => {
  const { isPremium, planType } = useAppSelector((state: RootState) => ({
    isPremium: state.auth.user?.subscription?.isActive ?? false,
    // Ensure planType is either one of our valid types or undefined
    planType: (state.auth.user?.subscription?.planType as PlanType) || undefined
  }));

  const headerSections = useMemo(() => ({
    logo: (
      <div className="flex items-center flex-shrink-0 w-48">
        <CareerMapLogo />
      </div>
    ),
    navigation: (
      <div className="flex items-center ml-32">
        <DynamicNavigation />
      </div>
    ),
    rightSection: (
      <div className="flex items-center justify-end flex-1 gap-2">
        <SubscriptionSection isPremium={isPremium} planType={planType} />
        <DynamicUserMenu />
      </div>
    )
  }), [isPremium, planType]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {headerSections.logo}
          {headerSections.navigation}
          {headerSections.rightSection}
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);