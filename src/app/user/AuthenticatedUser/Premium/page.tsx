"use client"
import React,{useState} from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Video, Briefcase, Check, Star } from 'lucide-react';

interface PremiumFeature {
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface PlanType {
  id: string;
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PremiumFeature[];
  highlight?: boolean;
}

const PremiumPlans: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const userFeatures: PremiumFeature[] = [
    {
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      name: "Premium Chat",
      description: "Unlimited messaging with advanced features"
    },
    {
      icon: <Video className="w-5 h-5 text-blue-500" />,
      name: "HD Video Calls",
      description: "Crystal clear video conferences"
    }
  ];

  const recruiterFeatures: PremiumFeature[] = [
    {
      icon: <MessageSquare className="w-5 h-5 text-purple-500" />,
      name: "Premium Chat",
      description: "Connect with candidates instantly"
    },
    {
      icon: <Video className="w-5 h-5 text-purple-500" />,
      name: "Video Interviews",
      description: "Conduct seamless video interviews"
    },
    {
      icon: <Briefcase className="w-5 h-5 text-purple-500" />,
      name: "Job Posting",
      description: "Post unlimited job listings"
    }
  ];

  const plans: PlanType[] = [
    {
      id: 'user-premium',
      title: 'Professional',
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      features: userFeatures,
      highlight: true
    },
    {
      id: 'recruiter-premium',
      title: 'Recruiter Pro',
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: recruiterFeatures,
      highlight: true
    }
  ];

  const handleSubscribe = (planId: string) => {
    console.log(`Subscribing to plan: ${planId}`);
    // Implement subscription logic here
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Premium Plans
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the perfect premium plan to enhance your professional journey
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4 my-8">
        <Button 
          variant={billingCycle === 'monthly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('monthly')}
          className="w-28"
        >
          Monthly
        </Button>
        <Button 
          variant={billingCycle === 'yearly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('yearly')}
          className="w-28"
        >
          <p className='pl-5'>Yearly</p>
          <Badge variant="secondary" className="ml-1 overflow-x-clip">Save 20%</Badge>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative flex flex-col h-full transform transition-all duration-300 hover:scale-105 ${
              plan.highlight ? 'border-2 border-gradient-to-r from-blue-500 to-purple-500' : '' 
            }`}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Star className="w-4 h-4 mr-1" /> Premium
              </Badge>
            </div>

            <CardHeader className="text-center">
              <h3 className="text-2xl font-bold">{plan.title}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-gray-500">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-grow">
              <div className="space-y-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold">{feature.name}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => handleSubscribe(plan.id)}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 text-gray-600">
        <p className="text-sm">
          All plans include 24/7 support and a 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default PremiumPlans;