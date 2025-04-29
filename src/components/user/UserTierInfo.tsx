import React, { useState, useEffect } from 'react';
import { userService, TierUsageResponse } from '@/services/api/user.service';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FaDatabase,
  FaFileAlt,
  FaServer,
  FaHistory,
  FaQuestionCircle,
  FaChevronRight,
  FaCrown,
} from 'react-icons/fa';
import { Progress } from '@/components/ui/progress';

export function UserTierInfo() {
  const [tierUsage, setTierUsage] = useState<TierUsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchTierInfo = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getUserTier();
        if (response) {
          setTierUsage(response);
        } else {
          setTierUsage(null);
          console.warn('No tier information was received');
        }
      } catch (err) {
        console.error('Failed to fetch tier info:', err);
        setTierUsage(null);
        console.warn('Error fetching tier information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTierInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-between items-center py-2.5 px-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="w-4 h-4 rounded" />
      </div>
    );
  }

  if (!tierUsage || !tierUsage.tier) {
    return null;
  }

  const { tier, usage } = tierUsage;

  const calculatePercentage = (used: number, limit: number) => {
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const limitItems = [
    {
      icon: <FaDatabase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />,
      label: 'Spaces',
      value: `${usage.space_count}/${tier.space_limit}`,
      tooltipText: `Space usage: ${usage.space_count} of ${tier.space_limit}`,
      percentage: calculatePercentage(usage.space_count, tier.space_limit),
    },
    {
      icon: <FaFileAlt className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />,
      label: 'Documents',
      value: `${usage.document_count}/${tier.document_limit}`,
      tooltipText: `Document usage: ${usage.document_count} of ${tier.document_limit}`,
      percentage: calculatePercentage(usage.document_count, tier.document_limit),
    },
    {
      icon: <FaQuestionCircle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />,
      label: 'Today Queries',
      value: `${usage.today_query_count}/${tier.query_limit}`,
      tooltipText: `Query usage today: ${usage.today_query_count} of ${tier.query_limit}`,
      percentage: calculatePercentage(usage.today_query_count, tier.query_limit),
    },
    {
      icon: <FaHistory className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />,
      label: 'History',
      value: `${usage.query_history_count}/${tier.query_history_limit}`,
      tooltipText: `Query history: ${usage.query_history_count} of ${tier.query_history_limit}`,
      percentage: calculatePercentage(usage.query_history_count, tier.query_history_limit),
    },
    {
      icon: <FaServer className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />,
      label: 'Today API Calls',
      value: `${usage.today_api_call_count}/${tier.api_call_limit}`,
      tooltipText: `API calls today: ${usage.today_api_call_count} of ${tier.api_call_limit}`,
      percentage: calculatePercentage(usage.today_api_call_count, tier.api_call_limit),
    },
  ];

  return (
    <>
      <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
      >
        <motion.span
          animate={isExpanded ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaCrown className="mr-2 h-4 w-4 text-amber-500" />
        </motion.span>
        {tier.cost_month > 0 ? 'Premium Plan' : 'Free Plan'}
        <motion.span
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-auto"
        >
          <FaChevronRight className="h-4 w-4" />
        </motion.span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {isExpanded && (
          <TooltipProvider>
            <div className="ml-6 mt-1 flex flex-col gap-2.5 mb-1">
              {limitItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1.5 rounded-md hover:bg-muted cursor-help text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                      <Progress
                        value={item.percentage}
                        className="h-1.5 bg-gray-200 dark:bg-gray-700"
                        indicatorClassName={getProgressColor(item.percentage)}
                      />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="text-xs">{item.tooltipText}</p>
                    <p className="text-xs font-medium">{item.percentage}% used</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        )}
      </motion.div>
    </>
  );
}
